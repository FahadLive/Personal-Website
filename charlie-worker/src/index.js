const GITHUB_REPO = 'FahadLive/Personal-Website';
const CONTENT_PATH = 'content/scratchpad';

export default {
	async fetch(request, env) {
		if (request.method !== 'POST') return new Response('ok');

		const body = await request.json();
		const message = body?.message;
		if (!message) return new Response('ok');

		// Security: only accept messages from you
		if (String(message.from.id) !== env.ALLOWED_USER_ID) {
			return new Response('ok');
		}

		const text = message.text ?? '';

		// Command: /add url | note | tag1, tag2
		if (!text.startsWith('/add ')) {
			await sendTelegram(env, message.chat.id, 'Use: /add url | note | tag1, tag2');
			return new Response('ok');
		}

		const parts = text
			.slice(5)
			.split('|')
			.map((s) => s.trim());
		if (parts.length < 2) {
			await sendTelegram(env, message.chat.id, 'Need at least: /add url | note');
			return new Response('ok');
		}

		const [url, note, tagsRaw] = parts;
		const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()) : [];
		const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
		const monthKey = today.slice(0, 7); // YYYY-MM
		const filePath = `${CONTENT_PATH}/${monthKey}.yaml`;

		// Fetch existing file from GitHub (if it exists)
		const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, { headers: githubHeaders(env) });

		let existingContent = '';
		let fileSha = null;

		if (getRes.ok) {
			const data = await getRes.json();
			existingContent = atob(data.content.replace(/\n/g, ''));
			fileSha = data.sha;
		}

		// Build new entry
		const newEntry = [
			`- url: ${url}`,
			`  note: "${note.replace(/"/g, '\\"')}"`,
			tags.length ? `  tags: [${tags.join(', ')}]` : `  tags: []`,
			`  added: ${today}`,
			'',
		].join('\n');

		const updatedContent = newEntry + existingContent;

		// Commit to GitHub
		const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
			method: 'PUT',
			headers: githubHeaders(env),
			body: JSON.stringify({
				message: `scratchpad: add entry ${today}`,
				content: btoa(unescape(encodeURIComponent(updatedContent))),
				...(fileSha ? { sha: fileSha } : {}),
			}),
		});

		if (putRes.ok) {
			await sendTelegram(env, message.chat.id, `✓ Added to ${monthKey}.yaml`);
		} else {
			const err = await putRes.json();
			await sendTelegram(env, message.chat.id, `✗ GitHub error: ${err.message}`);
		}

		return new Response('ok');
	},
};

function githubHeaders(env) {
	return {
		Authorization: `Bearer ${env.GITHUB_TOKEN}`,
		'Content-Type': 'application/json',
		'User-Agent': 'fahad-scratchpad-bot',
		Accept: 'application/vnd.github+json',
	};
}

async function sendTelegram(env, chatId, text) {
	await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: chatId, text }),
	});
}
