import { LOG_PATH, ASSETS_PATH, MAX_IMAGES, RESIZE_PROXY } from './config.js';
import { sendTelegram } from './telegram.js';
import { getRepoFile, putRepoFile, putRepoFileBinary } from './github.js';
import { setSession } from './session.js';

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

			const putRes = await putRepoFileBinary(env, assetPath, bytes, `log: add image ${assetPath}`);
			if (!putRes.ok) {
				console.error('image upload failed', await putRes.text());
				continue;
			}
			imagePaths.push(`/${assetPath}`);
		} catch (err) {
			console.error('image upload failed', err);
		}
	}

	if (imagePaths.length === 0) {
		await sendTelegram(env, chatId, '✗ All image uploads failed — entry not committed. Try /log again.');
		return;
	}

	const existing = await getRepoFile(env, yamlPath);
	const existingContent = existing?.content ?? '';
	const fileSha = existing?.sha ?? null;

	const imagesYaml = imagePaths.map((p) => `    - ${p}`).join('\n');
	const tilYaml = til.length ? `[${til.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(', ')}]` : '[]';

	const summaryYaml = [
		'  summary: |',
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
		'  images:',
		imagesYaml,
		`  til: ${tilYaml}`,
		'',
	]
		.filter(Boolean)
		.join('\n');

	const putRes = await putRepoFile(env, yamlPath, newEntry + '\n' + existingContent, `log: add entry ${today}`, fileSha);

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

export { showMenu, advanceToImages, advanceToTil, commitLogEntry };
