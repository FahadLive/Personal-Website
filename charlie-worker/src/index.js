const GITHUB_REPO = 'FahadLive/Personal-Website';
const CONTENT_PATH = 'content/scratchpad';

// In-memory session store (lives as long as the worker instance)
const sessions = new Map();

export default {
	async fetch(request, env) {
		if (request.method !== 'POST') return new Response('ok');

		const body = await request.json();
		const message = body?.message;
		if (!message) return new Response('ok');

		// Security: only you
		if (String(message.from.id) !== env.ALLOWED_USER_ID) {
			return new Response('ok');
		}

		const chatId = message.chat.id;
		const text = (message.text ?? '').trim();
		const session = sessions.get(chatId) ?? { step: 'idle' };

		// /add — start the flow
		if (text === '/add') {
			sessions.set(chatId, { step: 'url' });
			await sendTelegram(env, chatId, "What's the link? 🔗");
			return new Response('ok');
		}

		// /cancel — bail out anytime
		if (text === '/cancel') {
			sessions.delete(chatId);
			await sendTelegram(env, chatId, 'Cancelled.');
			return new Response('ok');
		}

		// Step: waiting for URL
		if (session.step === 'url') {
			sessions.set(chatId, { step: 'note', url: text });
			await sendTelegram(env, chatId, "Got it. What's your note? ✏️");
			return new Response('ok');
		}

		// Step: waiting for note
		if (session.step === 'note') {
			sessions.set(chatId, { ...session, step: 'tags', note: text });
			await sendTelegram(env, chatId, 'Any tags? (comma separated, or tap skip)', {
				reply_markup: {
					inline_keyboard: [[{ text: 'skip →', callback_data: 'skip_tags' }]],
				},
			});
			return new Response('ok');
		}

		// Step: waiting for tags (typed)
		if (session.step === 'tags') {
			const tags = text
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean);
			await commitEntry(env, chatId, { ...session, tags });
			sessions.delete(chatId);
			return new Response('ok');
		}

		// Unknown state
		if (session.step === 'idle') {
			await sendTelegram(env, chatId, 'Send /add to add something cool 🦋');
		}

		return new Response('ok');
	},
};

async function getOgImage(url) {
	try {
		const res = await fetch(url, {
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; scratchpad-bot/1.0)' },
			// Don't follow forever, timeout-ish
			signal: AbortSignal.timeout(5000),
		});
		const html = await res.text();

		// Try og:image first, fall back to twitter:image
		const og =
			html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
			html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ??
			html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);

		return og?.[1] ?? null;
	} catch {
		return null;
	}
}

// Handle inline button presses (skip tags)
async function handleCallback(body, env) {
	const query = body.callback_query;
	if (!query) return;

	const chatId = query.message.chat.id;
	const session = sessions.get(chatId);

	if (query.data === 'skip_tags' && session?.step === 'tags') {
		await commitEntry(env, chatId, { ...session, tags: [] });
		sessions.delete(chatId);
	}

	// Acknowledge the button tap
	await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/answerCallbackQuery`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ callback_query_id: query.id }),
	});
}

async function commitEntry(env, chatId, session) {
	const { url, note, tags } = session;

	const ogImage = await getOgImage(url);

	const today = new Date().toISOString().slice(0, 10);
	const monthKey = today.slice(0, 7);
	const filePath = `${CONTENT_PATH}/${monthKey}.yaml`;

	const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, { headers: githubHeaders(env) });

	let existingContent = '';
	let fileSha = null;

	if (getRes.ok) {
		const data = await getRes.json();
		existingContent = atob(data.content.replace(/\n/g, ''));
		fileSha = data.sha;
	}

	const newEntry = [
		`- url: ${url}`,
		`  note: "${note.replace(/"/g, '\\"')}"`,
		tags.length ? `  tags: [${tags.join(', ')}]` : `  tags: []`,
		`  added: ${today}`,
		ogImage ? `  image: ${ogImage}` : null,
		'',
	].join('\n');

	const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
		method: 'PUT',
		headers: githubHeaders(env),
		body: JSON.stringify({
			message: `scratchpad: add entry ${today}`,
			content: btoa(unescape(encodeURIComponent(newEntry + existingContent))),
			...(fileSha ? { sha: fileSha } : {}),
		}),
	});

	if (putRes.ok) {
		await sendTelegram(env, chatId, `🦋 Added to ${monthKey}.yaml\n\n${url}`);
	} else {
		const err = await putRes.json();
		await sendTelegram(env, chatId, `✗ GitHub error: ${err.message}`);
	}
}

function githubHeaders(env) {
	return {
		Authorization: `Bearer ${env.GITHUB_TOKEN}`,
		'Content-Type': 'application/json',
		'User-Agent': 'fahad-scratchpad-bot',
		Accept: 'application/vnd.github+json',
	};
}

async function sendTelegram(env, chatId, text, extra = {}) {
	await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: chatId, text, ...extra }),
	});
}
