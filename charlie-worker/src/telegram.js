async function sendTelegram(env, chatId, text, extra = {}) {
	await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: chatId, text, ...extra }),
	});
}

async function answerCallbackQuery(env, queryId) {
	await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/answerCallbackQuery`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ callback_query_id: queryId }),
	});
}

export { sendTelegram, answerCallbackQuery };
