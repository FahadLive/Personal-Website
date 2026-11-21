import { readFileSync } from "fs";
import { join } from "path";
import { walkDir, parseFrontmatter, slugFromPath } from "./content.mjs";

export const BASE_URL = "https://justfahad.me";
export const SITE_NAME = "Fahad";
export const AUTHOR = "Mohammed Fahad";

export function stripTitleEmoji(title) {
  return String(title)
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
    .trim();
}

export function plain(text) {
  return String(text ?? "").replace(/[*_`#\[\]]/g, "").trim();
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function isoDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function draftSlugs(dir) {
  const slugs = new Set();
  for (const file of walkDir(dir)) {
    const { data } = parseFrontmatter(file);
    if (data.draft || data.isPrivate) slugs.add(slugFromPath(file));
  }
  return slugs;
}

function readBody(type, slug) {
  try {
    const raw = readFileSync(
      join("src/generated/content", type, `${slug}.json`),
      "utf-8",
    );
    return JSON.parse(raw).html ?? "";
  } catch {
    return "";
  }
}

function absImage(coverImage) {
  return coverImage
    ? `${BASE_URL}/${coverImage}`
    : `${BASE_URL}/opengraph-image.jpg`;
}

/** Public (non-draft, non-private) content, newest first, with rendered bodies. */
export function loadPublicContent() {
  const manifest = JSON.parse(
    readFileSync("src/generated/contentManifest.json", "utf-8"),
  );
  const hiddenBlogs = draftSlugs("content/blogs");
  const hiddenProjects = draftSlugs("content/projects");

  const blogs = manifest.blogs
    .filter((b) => !hiddenBlogs.has(b.slug))
    .map((b) => ({
      ...b,
      url: `/blog/${b.slug}`,
      imageUrl: absImage(b.coverImage),
      html: readBody("blogs", b.slug),
    }));

  const projects = manifest.projects
    .filter((p) => !hiddenProjects.has(p.slug))
    .map((p) => ({
      ...p,
      url: `/project/${p.slug}`,
      imageUrl: absImage(p.coverImage),
      html: readBody("projects", p.slug),
    }));

  return { blogs, projects };
}
