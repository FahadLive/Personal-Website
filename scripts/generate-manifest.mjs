import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { dirname, join } from "path";
import { load } from "js-yaml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { walkDir, parseFrontmatter, slugFromPath } from "./lib/content.mjs";

// No rehype-raw → raw HTML in markdown stays inert (matches react-markdown defaults).
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

function renderMarkdown(mdBody) {
  return String(processor.processSync(mdBody));
}

function estimateReadingTime(text) {
  const plain = text.replace(/[#*`\[\]]/g, " ");
  const words = plain.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function normalizeDateField(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

function byDateDesc(a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function collectMarkdown(dir) {
  return walkDir(dir).map((filePath) => ({
    filePath,
    slug: slugFromPath(filePath),
    ...parseFrontmatter(filePath),
  }));
}

const projects = collectMarkdown("content/projects")
  .filter(({ data }) => !data.isPrivate)
  .map(({ slug, data, content }) => ({
    entry: {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary ?? "",
      tags: data.tags ?? [],
      githubLink: data.githubLink ?? null,
      externalLink: data.externalLink ?? null,
      coverImage: data.cover?.image ?? null,
    },
    html: renderMarkdown(content),
    imagesFolder: data.imagesFolder ?? null,
  }));

const blogs = collectMarkdown("content/blogs")
  .filter(({ data }) => !data.isPrivate)
  .map(({ slug, data, content }) => ({
    entry: {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary ?? "",
      tags: data.tags ?? [],
      coverImage: data.cover?.image ?? null,
      readingTime: estimateReadingTime(content),
    },
    html: renderMarkdown(content),
  }));

const scratchpad = [];
for (const file of walkDir("content/scratchpad", ".yaml")) {
  const entries = load(readFileSync(file, "utf-8"));
  if (!Array.isArray(entries)) continue;
  for (const e of entries) {
    scratchpad.push({
      url: e.url,
      note: e.note ?? null,
      tags: e.tags ?? [],
      added: normalizeDateField(e.added),
      image: e.image ?? null,
    });
  }
}

const log = [];
for (const file of walkDir("content/log", ".yaml")) {
  const entries = load(readFileSync(file, "utf-8"));
  if (!Array.isArray(entries)) continue;
  for (const e of entries) {
    log.push({
      date: normalizeDateField(e.date),
      project: e.project,
      summary: e.summary ?? "",
      mood: e.mood ?? null,
      images: e.images ?? [],
      til: e.til ?? [],
    });
  }
}

projects.sort((a, b) => byDateDesc(a.entry, b.entry));
blogs.sort((a, b) => byDateDesc(a.entry, b.entry));

const manifest = {
  projects: projects.map(({ entry, imagesFolder }) => ({ ...entry, imagesFolder })),
  blogs: blogs.map(({ entry }) => entry),
  scratchpad,
  log,
};

mkdirSync(dirname("src/generated/contentManifest.json"), { recursive: true });
writeFileSync(
  "src/generated/contentManifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);

// Per-slug body chunks so detail pages lazy-load exactly one small file.
rmSync("src/generated/content", { recursive: true, force: true });
for (const type of ["projects", "blogs"]) {
  mkdirSync(join("src/generated/content", type), { recursive: true });
}
for (const { entry, html } of projects) {
  writeFileSync(
    join("src/generated/content/projects", `${entry.slug}.json`),
    JSON.stringify({ slug: entry.slug, html }) + "\n",
  );
}
for (const { entry, html } of blogs) {
  writeFileSync(
    join("src/generated/content/blogs", `${entry.slug}.json`),
    JSON.stringify({ slug: entry.slug, html }) + "\n",
  );
}

console.log(
  `Generated contentManifest.json (${projects.length} projects, ${blogs.length} blogs, ` +
    `${scratchpad.length} scratchpad entries, ${log.length} log entries) + body chunks`,
);
