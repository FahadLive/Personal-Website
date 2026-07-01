const GITHUB_REPO = 'FahadLive/Personal-Website';
const LOG_PATH = 'content/log';
const ASSETS_PATH = 'public/content/log-assets';
const SCRATCHPAD_PATH = 'content/scratchpad';
const MAX_IMAGES = 3;

// Resize/compress proxy — re-encodes to webp without bundling a codec into the Worker.
const RESIZE_PROXY = (url) => `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=1600&q=75&output=webp`;

// Crude but effective enough for personal use — first http(s) URL in the message.
const URL_RE = /(https?:\/\/[^\s]+)/i;

// KV session helpers
async function getSession(env, chatId) {
	const data = await env.SESSIONS.get(String(chatId), 'json');
	return data ?? { step: 'idle' };
}
async function setSession(env, chatId, session) {
	await env.SESSIONS.put(String(chatId), JSON.stringify(session));
}
async function deleteSession(env, chatId) {
	await env.SESSIONS.delete(String(chatId));
}

export default {
	async fetch(request, env) {
		if (request.method !== 'POST') return new Response('ok');

		const body = await request.json();

		if (body.callback_query) {
			await handleCallback(body, env);
			return new Response('ok');
		}

		const message = body?.message;
		if (!message) return new Response('ok');

		// Security: only you
		if (String(message.from.id) !== env.ALLOWED_USER_ID) {
			return new Response('ok');
		}

		const chatId = message.chat.id;
		const text = (message.text ?? '').trim();
		const session = await getSession(env, chatId);

		// ── Global commands, work from any state ──

		if (text === '/cancel') {
			await deleteSession(env, chatId);
			await sendTelegram(env, chatId, 'Cancelled.');
			return new Response('ok');
		}

		if (text === '/menu' || text === '/start') {
			await deleteSession(env, chatId);
			await showMenu(env, chatId);
			return new Response('ok');
		}

		if (text === '/log') {
			await setSession(env, chatId, { step: 'project' });
			await sendTelegram(env, chatId, 'What are you building? (project name) 🛠️');
			return new Response('ok');
		}

		if (text === '/add') {
			await setSession(env, chatId, { step: 'url' });
			await sendTelegram(env, chatId, "What's the link? 🔗");
			return new Response('ok');
		}

		// ── Idle + link detection ──
		// If nothing's in progress and the message contains a URL, don't assume —
		// confirm which flow they meant before doing anything.
		if (session.step === 'idle') {
			const match = text.match(URL_RE);
			if (match) {
				await setSession(env, chatId, { step: 'confirm_link', url: match[1] });
				await sendTelegram(env, chatId, `Looks like a link:\n${match[1]}\n\nWhat's this for?`, {
					reply_markup: {
						inline_keyboard: [
							[{ text: '🦋 add to scratchpad', callback_data: 'link_scratchpad' }],
							[{ text: '🛠️ start a build log instead', callback_data: 'link_log' }],
							[{ text: '✕ cancel', callback_data: 'link_cancel' }],
						],
					},
				});
				return new Response('ok');
			}

			await showMenu(env, chatId);
			return new Response('ok');
		}

		// ── Build log flow ──

		if (session.step === 'project') {
			await setSession(env, chatId, { step: 'summary', project: text });
			await sendTelegram(env, chatId, "What'd you do today? ✏️");
			return new Response('ok');
		}

		if (session.step === 'summary') {
			await setSession(env, chatId, { ...session, step: 'mood', summary: text });
			await sendTelegram(env, chatId, "How'd it feel? (one emoji, or tap skip)", {
				reply_markup: { inline_keyboard: [[{ text: 'skip →', callback_data: 'skip_mood' }]] },
			});
			return new Response('ok');
		}

		if (session.step === 'mood') {
			await advanceToImages(env, chatId, { ...session, mood: text });
			return new Response('ok');
		}

		if (session.step === 'images') {
			if (message.photo?.length) {
				const largest = message.photo[message.photo.length - 1];
				const images = [...(session.images ?? []), largest.file_id];
				await setSession(env, chatId, { ...session, images });

				if (images.length >= MAX_IMAGES) {
					await advanceToTil(env, chatId, { ...session, images });
				} else {
					await sendTelegram(env, chatId, `Got ${images.length}/${MAX_IMAGES}. Send another, or tap done.`, {
						reply_markup: { inline_keyboard: [[{ text: `done (${images.length}) →`, callback_data: 'done_images' }]] },
					});
				}
				return new Response('ok');
			}
			await sendTelegram(env, chatId, 'Send a photo — at least one image is required for a log entry 📸');
			return new Response('ok');
		}

		if (session.step === 'til') {
			const til = text
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean);
			await commitLogEntry(env, chatId, { ...session, til });
			await deleteSession(env, chatId);
			return new Response('ok');
		}

		// ── Scratchpad flow ──

		if (session.step === 'url') {
			await setSession(env, chatId, { step: 'note', url: text });
			await sendTelegram(env, chatId, "Got it. What's your note? ✏️");
			return new Response('ok');
		}

		if (session.step === 'note') {
			await setSession(env, chatId, { ...session, step: 'tags', note: text });
			await sendTelegram(env, chatId, 'Any tags? (comma separated, or tap skip)', {
				reply_markup: { inline_keyboard: [[{ text: 'skip →', callback_data: 'skip_tags' }]] },
			});
			return new Response('ok');
		}

		if (session.step === 'tags') {
			const tags = text
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean);
			await commitScratchpadEntry(env, chatId, { ...session, tags });
			await deleteSession(env, chatId);
			return new Response('ok');
		}

		// Anything sent in 'confirm_link' that isn't a button tap — nudge instead of ignoring
		if (session.step === 'confirm_link') {
			await sendTelegram(env, chatId, 'Tap one of the buttons above ↑ or send /cancel.');
			return new Response('ok');
		}

		return new Response('ok');
	},
};

async function showMenu(env, chatId) {
	await sendTelegram(env, chatId, 'What do you want to do?', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🛠️ log a build', callback_data: 'menu_log' }],
				[{ text: '🦋 add to scratchpad', callback_data: 'menu_scratchpad' }],
			],
		},
	});
}

async function advanceToImages(env, chatId, session) {
	await setSession(env, chatId, { ...session, step: 'images', images: [] });
	await sendTelegram(env, chatId, `Send 1–${MAX_IMAGES} photos from today 📸 (required — send at least one)`);
}

async function advanceToTil(env, chatId, session) {
	await setSession(env, chatId, { ...session, step: 'til' });
	await sendTelegram(env, chatId, 'Learn anything? (comma separated, short — or tap skip)', {
		reply_markup: { inline_keyboard: [[{ text: 'skip →', callback_data: 'skip_til' }]] },
	});
}

// Handle inline button presses
async function handleCallback(body, env) {
	const query = body.callback_query;
	const chatId = query.message.chat.id;
	const session = await getSession(env, chatId);

	switch (query.data) {
		case 'menu_log':
			await setSession(env, chatId, { step: 'project' });
			await sendTelegram(env, chatId, 'What are you building? (project name) 🛠️');
			break;

		case 'menu_scratchpad':
			await setSession(env, chatId, { step: 'url' });
			await sendTelegram(env, chatId, "What's the link? 🔗");
			break;

		case 'link_scratchpad':
			if (session.step === 'confirm_link') {
				await setSession(env, chatId, { step: 'note', url: session.url });
				await sendTelegram(env, chatId, "Got it. What's your note? ✏️");
			}
			break;

		case 'link_log':
			if (session.step === 'confirm_link') {
				// They had typed a link but actually meant to start a build log —
				// don't try to guess the project name from the URL, just start clean.
				await setSession(env, chatId, { step: 'project' });
				await sendTelegram(env, chatId, 'No problem — what are you building? (project name) 🛠️');
			}
			break;

		case 'link_cancel':
			await deleteSession(env, chatId);
			await sendTelegram(env, chatId, 'Cancelled.');
			break;

		case 'skip_mood':
			if (session.step === 'mood') await advanceToImages(env, chatId, { ...session, mood: null });
			break;

		case 'done_images':
			if (session.step === 'images') {
				if (!session.images?.length) {
					await sendTelegram(env, chatId, 'Need at least one photo before moving on 📸');
				} else {
					await advanceToTil(env, chatId, session);
				}
			}
			break;

		case 'skip_til':
			if (session.step === 'til') {
				await commitLogEntry(env, chatId, { ...session, til: [] });
				await deleteSession(env, chatId);
			}
			break;

		case 'skip_tags':
			if (session.step === 'tags') {
				await commitScratchpadEntry(env, chatId, { ...session, tags: [] });
				await deleteSession(env, chatId);
			}
			break;
	}

	await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/answerCallbackQuery`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ callback_query_id: query.id }),
	});
}

// ── Build log commit ──

async function fetchCompressedImage(env, fileId) {
	const fileRes = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
	const fileData = await fileRes.json();
	const filePath = fileData.result.file_path;
	const telegramUrl = `https://api.telegram.org/file/bot${env.TELEGRAM_TOKEN}/${filePath}`;

	const compressedRes = await fetch(RESIZE_PROXY(telegramUrl));
	if (!compressedRes.ok) {
		const original = await fetch(telegramUrl);
		return new Uint8Array(await original.arrayBuffer());
	}
	return new Uint8Array(await compressedRes.arrayBuffer());
}

async function commitLogEntry(env, chatId, session) {
	const { project, summary, mood, images, til } = session;

	const today = new Date().toISOString().slice(0, 10);
	const monthKey = today.slice(0, 7);
	const yamlPath = `${LOG_PATH}/${monthKey}.yaml`;

	await sendTelegram(env, chatId, 'Compressing images and committing… 🦋');

	const tag = Math.random().toString(36).slice(2, 6);
	const imagePaths = [];

	for (let i = 0; i < images.length; i++) {
		try {
			const bytes = await fetchCompressedImage(env, images[i]);
			const assetPath = `${ASSETS_PATH}/${today}-${tag}-${i + 1}.webp`;

			await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${assetPath}`, {
				method: 'PUT',
				headers: githubHeaders(env),
				body: JSON.stringify({
					message: `log: add image ${assetPath}`,
					content: arrayBufferToBase64(bytes),
				}),
			});

			imagePaths.push(`/${assetPath}`);
		} catch (err) {
			console.error('image upload failed', err);
		}
	}

	if (imagePaths.length === 0) {
		await sendTelegram(env, chatId, '✗ All image uploads failed — entry not committed. Try /log again.');
		return;
	}

	const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${yamlPath}`, { headers: githubHeaders(env) });
	let existingContent = '';
	let fileSha = null;
	if (getRes.ok) {
		const data = await getRes.json();
		const binary = atob(data.content.replace(/\n/g, ''));

		existingContent = new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
		fileSha = data.sha;
	}

	const imagesYaml = imagePaths.map((p) => `    - ${p}`).join('\n');
	const tilYaml = til.length ? `[${til.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(', ')}]` : '[]';

	const summaryYaml = [
		`  summary: |`,
		...summary
			.replace(/\r\n/g, '\n')
			.split('\n')
			.map((line) => `    ${line}`),
	];

	const newEntry = [
		`- date: ${today}`,
		`  project: "${project.replace(/"/g, '\\"')}"`,
		...summaryYaml,
		mood ? `  mood: ${mood}` : null,
		`  images:`,
		imagesYaml,
		`  til: ${tilYaml}`,
		'',
	]
		.filter(Boolean)
		.join('\n');

	const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${yamlPath}`, {
		method: 'PUT',
		headers: githubHeaders(env),
		body: JSON.stringify({
			message: `log: add entry ${today}`,
			content: utf8ToBase64(newEntry + '\n' + existingContent),
			...(fileSha ? { sha: fileSha } : {}),
		}),
	});

	if (putRes.ok) {
		await sendTelegram(
			env,
			chatId,
			`🛠️ Logged to ${monthKey}.yaml — ${imagePaths.length} image(s)${til.length ? `, ${til.length} TIL` : ''}`,
		);
	} else {
		const err = await putRes.json();
		await sendTelegram(env, chatId, `✗ GitHub error: ${err.message}`);
	}
}

// ── Scratchpad commit ──

async function getOgImage(url) {
	try {
		const res = await fetch(url, {
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; charlie-bot/1.0)' },
			signal: AbortSignal.timeout(5000),
		});
		const html = await res.text();
		const og =
			html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
			html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ??
			html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
		return og?.[1] ?? null;
	} catch {
		return null;
	}
}

async function commitScratchpadEntry(env, chatId, session) {
	const { url, note, tags } = session;
	const ogImage = await getOgImage(url);

	const today = new Date().toISOString().slice(0, 10);
	const monthKey = today.slice(0, 7);
	const filePath = `${SCRATCHPAD_PATH}/${monthKey}.yaml`;

	const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, { headers: githubHeaders(env) });
	let existingContent = '';
	let fileSha = null;
	if (getRes.ok) {
		const data = await getRes.json();
		const binary = atob(data.content.replace(/\n/g, ''));

		existingContent = new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
		fileSha = data.sha;
	}

	const noteYaml = [
		`  note: |`,
		...note
			.replace(/\r\n/g, '\n')
			.split('\n')
			.map((line) => `    ${line}`),
	];

	const newEntry = [
		`- url: ${url}`,
		...noteYaml,
		tags.length ? `  tags: [${tags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(', ')}]` : `  tags: []`,
		`  added: ${today}`,
		ogImage ? `  image: ${ogImage}` : null,
		'',
	]
		.filter(Boolean)
		.join('\n');

	const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
		method: 'PUT',
		headers: githubHeaders(env),
		body: JSON.stringify({
			message: `scratchpad: add entry ${today}`,
			content: utf8ToBase64(newEntry + '\n' + existingContent),
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

// ── Shared helpers ──

function arrayBufferToBase64(bytes) {
	let binary = '';
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary);
}

function utf8ToBase64(str) {
	const bytes = new TextEncoder().encode(str);

	let binary = '';
	const chunk = 0x8000;

	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}

	return btoa(binary);
}

function githubHeaders(env) {
	return {
		Authorization: `Bearer ${env.GITHUB_TOKEN}`,
		'Content-Type': 'application/json',
		'User-Agent': 'fahad-charlie-bot',
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
