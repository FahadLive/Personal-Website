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

export { getSession, setSession, deleteSession };
