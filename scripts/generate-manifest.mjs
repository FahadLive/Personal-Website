import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { walkDir, parseFrontmatter, slugFromPath } from "./lib/content.mjs";

function byDateDesc(a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

const projects = walkDir("content/projects")
  .map((filePath) => ({ filePath, slug: slugFromPath(filePath), data: parseFrontmatter(filePath).data }))
  .filter(({ data }) => !data.isPrivate)
  .map(({ slug, data }) => ({
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary ?? null,
    tags: data.tags ?? [],
    githubLink: data.githubLink ?? null,
    externalLink: data.externalLink ?? null,
    coverImage: data.cover?.image ?? null,
  }))
  .sort(byDateDesc);

const blogs = walkDir("content/blogs")
  .map((filePath) => ({ filePath, slug: slugFromPath(filePath), data: parseFrontmatter(filePath).data }))
  .filter(({ data }) => !data.isPrivate)
  .map(({ slug, data }) => ({
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary ?? null,
    tags: data.tags ?? [],
    coverImage: data.cover?.image ?? null,
  }))
  .sort(byDateDesc);

const outPath = "src/generated/contentManifest.json";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ projects, blogs }, null, 2) + "\n");

console.log(`Generated contentManifest.json (${projects.length} projects, ${blogs.length} blogs)`);
