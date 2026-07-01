const GITHUB_REPO = 'FahadLive/Personal-Website';
const LOG_PATH = 'content/log';
const ASSETS_PATH = 'public/content/log-assets';
const SCRATCHPAD_PATH = 'content/scratchpad';
const MAX_IMAGES = 3;
const RESIZE_PROXY = (url) => `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=1600&q=75&output=webp`;
const URL_RE = /(https?:\/\/[^\s]+)/i;

export { GITHUB_REPO, LOG_PATH, ASSETS_PATH, SCRATCHPAD_PATH, MAX_IMAGES, RESIZE_PROXY, URL_RE };
