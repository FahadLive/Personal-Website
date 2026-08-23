import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { walkDir, parseFrontmatter, slugFromPath } from "./lib/content.mjs";

const BASE_URL = "https://justfahad.me";
const BLOG_DIR = "content/blogs";
const PROJECT_DIR = "content/projects";
const DIST_DIR = "dist";

const SITE_NAME = "Fahad";

function stripTitleEmoji(title) {
  return title.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2700}-\u{27BF}]/gu, "").trim();
}

const indexHtml = readFileSync(join(DIST_DIR, "index.html"), "utf-8");

const pages = [];

// Blogs
for (const file of walkDir(BLOG_DIR)) {
  const { data } = parseFrontmatter(file);
  if (data.draft || data.isPrivate) continue;

  const slug = slugFromPath(file);
  const title = data.title;
  const description = data.summary?.replace(/[*_`#\[\]]/g, "") || "";
  const coverPath = data.cover?.image || null;
  const imageUrl = coverPath ? `${BASE_URL}/${coverPath}` : `${BASE_URL}/opengraph-image.jpg`;

  pages.push({
    url: `/blog/${slug}`,
    filePath: `blog/${slug}.html`,
    title: `${stripTitleEmoji(title)} | ${SITE_NAME}`,
    description,
    imageUrl,
  });
}

// Projects
for (const file of walkDir(PROJECT_DIR)) {
  const { data } = parseFrontmatter(file);
  if (data.isPrivate) continue;

  const slug = slugFromPath(file);
  const title = data.title;
  const description = data.summary?.replace(/[*_`#\[\]]/g, "") || "";
  const coverPath = data.cover?.image || null;
  const imageUrl = coverPath ? `${BASE_URL}/${coverPath}` : `${BASE_URL}/opengraph-image.jpg`;

  pages.push({
    url: `/projects/${slug}`,
    filePath: `projects/${slug}.html`,
    title: `${stripTitleEmoji(title)} | ${SITE_NAME}`,
    description,
    imageUrl,
  });
}

function replaceMetaTag(html, name, property, newContent) {
  if (property) {
    const regex = new RegExp(
      `(<meta\\s+${property}="${name}"[^>]*?content=)"([^"]*)"`,
      "i"
    );
    return html.replace(regex, `$1"${escapeHtml(newContent)}"`);
  }
  const regex = new RegExp(
    `(<meta\\s+name="${name}"[^>]*?content=)"([^"]*)"`,
    "i"
  );
  return html.replace(regex, `$1"${escapeHtml(newContent)}"`);
}

function escapeHtml(str) {
  return str.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

let count = 0;
for (const page of pages) {
  let html = indexHtml;

  // Title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${page.title}</title>`
  );

  // Canonical
  html = html.replace(
    /<link[^>]*rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${BASE_URL}${page.url}" />`
  );

  // Meta description
  html = replaceMetaTag(html, "description", null, page.description);

  // OG tags
  html = replaceMetaTag(html, "og:type", "property", "website");
  html = replaceMetaTag(html, "og:title", "property", page.title);
  html = replaceMetaTag(html, "og:description", "property", page.description);
  html = replaceMetaTag(html, "og:image", "property", page.imageUrl);
  html = replaceMetaTag(html, "og:url", "property", `${BASE_URL}${page.url}`);

  // Twitter tags
  html = replaceMetaTag(html, "twitter:card", "name", "summary_large_image");
  html = replaceMetaTag(html, "twitter:title", "name", page.title);
  html = replaceMetaTag(html, "twitter:description", "name", page.description);
  html = replaceMetaTag(html, "twitter:image", "name", page.imageUrl);

  const outPath = join(DIST_DIR, page.filePath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  count++;
}

console.log(`Prerendered ${count} pages with OG tags`);
