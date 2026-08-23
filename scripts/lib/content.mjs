import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import matter from "gray-matter";

export function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full));
    } else if (extname(full) === ".md") {
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
