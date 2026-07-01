import { SCRATCHPAD_PATH, GITHUB_REPO } from './config.js';
import { sendTelegram } from './telegram.js';
import { getRepoFile, putRepoFile } from './github.js';

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

	const existing = await getRepoFile(env, filePath);
	const existingContent = existing?.content ?? '';
	const fileSha = existing?.sha ?? null;

	const noteYaml = [
		'  note: |',
		...note
			.replace(/\r\n/g, '\n')
			.split('\n')
			.map((line) => `    ${line}`),
	];

	const newEntry = [
		`- url: ${url}`,
		...noteYaml,
		tags.length ? `  tags: [${tags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(', ')}]` : '  tags: []',
		`  added: ${today}`,
		ogImage ? `  image: ${ogImage}` : null,
		'',
	]
		.filter(Boolean)
		.join('\n');

	const putRes = await putRepoFile(env, filePath, newEntry + '\n' + existingContent, `scratchpad: add entry ${today}`, fileSha);

	if (putRes.ok) {
		await sendTelegram(env, chatId, `🦋 Added to ${monthKey}.yaml\n\n${url}`);
	} else {
		const err = await putRes.json();
		await sendTelegram(env, chatId, `✗ GitHub error: ${err.message}`);
	}
}

export { getOgImage, commitScratchpadEntry };
