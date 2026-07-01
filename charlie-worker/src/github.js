import { GITHUB_REPO } from './config.js';

function githubHeaders(env) {
	return {
		Authorization: `Bearer ${env.GITHUB_TOKEN}`,
		'Content-Type': 'application/json',
		'User-Agent': 'fahad-charlie-bot',
		Accept: 'application/vnd.github+json',
	};
}

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

function parseGitHubContent(data) {
	const binary = atob(data.content.replace(/\n/g, ''));
	return {
		content: new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))),
		sha: data.sha,
	};
}

async function getRepoFile(env, path) {
	const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
		headers: githubHeaders(env),
	});
	if (!res.ok) return null;
	return parseGitHubContent(await res.json());
}

async function putRepoFile(env, path, content, message, sha) {
	const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
		method: 'PUT',
		headers: githubHeaders(env),
		body: JSON.stringify({
			message,
			content: utf8ToBase64(content),
			...(sha ? { sha } : {}),
		}),
	});
	return res;
}

async function putRepoFileBinary(env, path, bytes, message) {
	const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
		method: 'PUT',
		headers: githubHeaders(env),
		body: JSON.stringify({
			message,
			content: arrayBufferToBase64(bytes),
		}),
	});
	return res;
}

export { githubHeaders, arrayBufferToBase64, utf8ToBase64, getRepoFile, putRepoFile, putRepoFileBinary };
