import { getSession, setSession, deleteSession } from './session.js';
import { sendTelegram, answerCallbackQuery } from './telegram.js';
import { showMenu, advanceToImages, advanceToTil, commitLogEntry } from './log.js';
import { commitScratchpadEntry } from './scratchpad.js';
import { getExistingProjects, fuzzyMatch } from './fuzzy.js';
import { URL_RE, MAX_IMAGES } from './config.js';

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
			const knownProjects = await getExistingProjects(env);
			const match = fuzzyMatch(text, knownProjects);

			if (match && match.score < 1) {
				await setSession(env, chatId, {
					step: 'confirm_project',
					project: text,
					matchedProject: match.project,
				});
				await sendTelegram(env, chatId, `Did you mean "${match.project}"?`, {
					reply_markup: {
						inline_keyboard: [
							[{ text: `✔ Yes — ${match.project}`, callback_data: 'confirm_project_yes' }],
							[{ text: '✕ No, keep mine', callback_data: 'confirm_project_no' }],
						],
					},
				});
				return new Response('ok');
			}

			await setSession(env, chatId, { step: 'summary', project: text });
			await sendTelegram(env, chatId, "What'd you do today? ✏️");
			return new Response('ok');
		}

		if (session.step === 'confirm_project') {
			await sendTelegram(env, chatId, 'Tap one of the buttons above ↑ or send /cancel.');
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

// ── Inline button handler ──

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
				await setSession(env, chatId, { step: 'project' });
				await sendTelegram(env, chatId, 'No problem — what are you building? (project name) 🛠️');
			}
			break;

		case 'link_cancel':
			await deleteSession(env, chatId);
			await sendTelegram(env, chatId, 'Cancelled.');
			break;

		case 'confirm_project_yes':
			if (session.step === 'confirm_project') {
				await setSession(env, chatId, { step: 'summary', project: session.matchedProject });
				await sendTelegram(env, chatId, "What'd you do today? ✏️");
			}
			break;

		case 'confirm_project_no':
			if (session.step === 'confirm_project') {
				await setSession(env, chatId, { step: 'summary', project: session.project });
				await sendTelegram(env, chatId, "What'd you do today? ✏️");
			}
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

	await answerCallbackQuery(env, query.id);
}
