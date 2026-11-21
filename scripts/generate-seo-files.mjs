import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  BASE_URL,
  AUTHOR,
  stripTitleEmoji,
  plain,
  escapeHtml as esc,
  isoDate,
  loadPublicContent,
} from "./lib/site.mjs";

const DIST_DIR = "dist";
const { blogs, projects } = loadPublicContent();
const today = new Date().toISOString().slice(0, 10);

const staticRoutes = ["/", "/projects", "/blogs", "/about", "/scratchpad", "/build"];

// sitemap.xml
const urls = [
  ...staticRoutes.map((p) => ({ loc: p, lastmod: today })),
  ...blogs.map((b) => ({ loc: b.url, lastmod: isoDate(b.date) })),
  ...projects.map((p) => ({ loc: p.url, lastmod: isoDate(p.date) })),
];
writeFileSync(
  join(DIST_DIR, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (u) =>
        `  <url><loc>${BASE_URL}${u.loc === "/" ? "" : u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`,
    )
    .join("\n")}\n</urlset>\n`,
);

// rss.xml (blogs)
writeFileSync(
  join(DIST_DIR, "rss.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>\n<title>${esc(AUTHOR)} - Blogs</title>\n<link>${BASE_URL}/blogs</link>\n<description>Writing by ${esc(AUTHOR)}</description>\n<atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n${blogs
    .map((b) => {
      const d = isoDate(b.date);
      return `<item><title>${esc(stripTitleEmoji(b.title))}</title><link>${BASE_URL}${b.url}</link><guid>${BASE_URL}${b.url}</guid>${
        d ? `<pubDate>${new Date(d).toUTCString()}</pubDate>` : ""
      }<description>${esc(plain(b.summary))}</description></item>`;
    })
    .join("\n")}\n</channel></rss>\n`,
);

// llms.txt (replaces the stale hand-written one in public/)
const line = (item) =>
  `- [${stripTitleEmoji(item.title)}](${BASE_URL}${item.url})${item.summary ? `: ${plain(item.summary)}` : ""}`;
writeFileSync(
  join(DIST_DIR, "llms.txt"),
  `# ${AUTHOR} (Fahad)\n\n> Personal website of ${AUTHOR}: projects, blogs, build log and notes.\n\n## Pages\n- [Home](${BASE_URL}/)\n- [About](${BASE_URL}/about)\n- [Projects](${BASE_URL}/projects)\n- [Blogs](${BASE_URL}/blogs)\n- [Build log](${BASE_URL}/build)\n- [Scratchpad](${BASE_URL}/scratchpad)\n\n## Projects\n${projects
    .map(line)
    .join("\n")}\n\n## Blogs\n${blogs.map(line).join("\n")}\n\n## Feeds\n- [RSS](${BASE_URL}/rss.xml)\n- [Sitemap](${BASE_URL}/sitemap.xml)\n`,
);

// 404.html: SPA shell with noindex; Netlify serves it with a real 404 status.
const shell = readFileSync(join(DIST_DIR, "index.html"), "utf-8");
writeFileSync(
  join(DIST_DIR, "404.html"),
  shell
    .replace(/<title>[^<]*<\/title>/, "<title>Page not found | Fahad</title>")
    .replace("</head>", '<meta name="robots" content="noindex" />\n</head>'),
);

console.log(
  `Generated sitemap.xml (${urls.length} urls), rss.xml, llms.txt, 404.html`,
);
