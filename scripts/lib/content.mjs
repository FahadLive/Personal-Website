import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import matter from "gray-matter";

export function walkDir(dir, ext = ".md") {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full, ext));
    } else if (extname(full) === ext) {
      files.push(full);
    }
  }
  return files;
}

export function parseFrontmatter(filePath) {
  return matter(readFileSync(filePath, "utf-8"));
}

export function slugFromPath(filePath) {
  return filePath.split("/").pop().replace(/\.md$/, "");
}
