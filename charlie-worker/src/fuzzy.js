import { GITHUB_REPO, LOG_PATH } from './config.js';
import { githubHeaders, getRepoFile } from './github.js';

async function getExistingProjects(env) {
	const projects = new Set();

	try {
		const logDirRes = await fetch(
			`https://api.github.com/repos/${GITHUB_REPO}/contents/${LOG_PATH}`,
			{ headers: githubHeaders(env) },
		);
		if (logDirRes.ok) {
			const logFiles = await logDirRes.json();
			for (const file of logFiles) {
				if (!file.name.endsWith('.yaml')) continue;
				const fileData = await getRepoFile(env, file.path);
				if (!fileData) continue;
				const projectMatches = fileData.content.matchAll(/project:\s*"([^"]+)"|project:\s*(\S+)/g);
				for (const m of projectMatches) {
					projects.add(m[1] ?? m[2]);
				}
			}
		}
	} catch (err) {
		console.error('failed to fetch log projects', err);
	}

	try {
		const projectsDirRes = await fetch(
			`https://api.github.com/repos/${GITHUB_REPO}/contents/content/projects`,
			{ headers: githubHeaders(env) },
		);
		if (projectsDirRes.ok) {
			const projectFiles = await projectsDirRes.json();
			for (const file of projectFiles) {
				if (!file.name.endsWith('.md')) continue;
				const fileData = await getRepoFile(env, file.path);
				if (!fileData) continue;
				const titleMatch = fileData.content.match(/^title:\s*"([^"]+)"|^title:\s*(\S.+)/m);
				if (titleMatch) {
					projects.add(titleMatch[1] ?? titleMatch[2].trim());
				}
			}
		}
	} catch (err) {
		console.error('failed to fetch project titles', err);
	}

	return [...projects];
}

function fuzzyMatch(input, projects) {
	const normalized = input.toLowerCase().trim();
	const inputTokens = normalized.split(/\s+/).filter(Boolean);

	if (!inputTokens.length || !projects.length) return null;

	let best = null;
	let bestScore = 0;

	for (const project of projects) {
		const pLower = project.toLowerCase();

		if (pLower === normalized) return { project, score: 1 };

		if (pLower.includes(normalized) || normalized.includes(pLower)) {
			const lenRatio = Math.min(normalized.length, pLower.length) / Math.max(normalized.length, pLower.length);
			const score = 0.7 + lenRatio * 0.25;
			if (score > bestScore) {
				bestScore = score;
				best = project;
			}
			continue;
		}

		const projectTokens = pLower.split(/\s+/).filter(Boolean);
		const common = inputTokens.filter((t) => projectTokens.includes(t)).length;
		const all = new Set([...inputTokens, ...projectTokens]);
		const score = common / all.size;

		if (score > bestScore) {
			bestScore = score;
			best = project;
		}
	}

	return bestScore >= 0.5 ? { project: best, score: bestScore } : null;
}

export { getExistingProjects, fuzzyMatch };
