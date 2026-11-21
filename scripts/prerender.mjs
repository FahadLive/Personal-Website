import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import {
  BASE_URL,
  SITE_NAME,
  AUTHOR,
  stripTitleEmoji,
  plain,
  escapeHtml as esc,
  isoDate,
  loadPublicContent,
} from "./lib/site.mjs";

const DIST_DIR = "dist";
const indexHtml = readFileSync(join(DIST_DIR, "index.html"), "utf-8");
const { blogs, projects } = loadPublicContent();

function setMeta(html, attr, name, content) {
  const re = new RegExp(`(<meta\\s+${attr}="${name}"[^>]*?content=)"[^"]*"`, "i");
  return html.replace(re, `$1"${esc(content)}"`);
}

function jsonLd(objects) {
  return objects
    .map(
      (o) =>
        `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`,
    )
    .join("\n");
}

const person = {
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: AUTHOR,
  url: BASE_URL,
};

function breadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${BASE_URL}${path}`,
    })),
  };
}

const navHtml = `<nav aria-label="Primary"><a href="/">Home</a> <a href="/projects">Projects</a> <a href="/blogs">Blogs</a> <a href="/about">About</a> <a href="/scratchpad">Scratchpad</a> <a href="/build">Build log</a></nav>`;

function tagsHtml(tags) {
  return tags?.length ? `<p>${tags.map(esc).join(", ")}</p>` : "";
}

function listItemHtml(item, label) {
  const date = isoDate(item.date);
  return `<li><article><h2><a href="${item.url}">${esc(stripTitleEmoji(item.title))}</a></h2>${
    date ? `<p><time datetime="${date}">${date}</time></p>` : ""
  }${item.summary ? `<p>${esc(plain(item.summary))}</p>` : ""}${tagsHtml(item.tags)}</article></li>`;
}

function listSnapshot(heading, intro, items) {
  return `${navHtml}<main id="main"><h1>${esc(heading)}</h1><p>${esc(intro)}</p><ul>${items
    .map((i) => listItemHtml(i))
    .join("")}</ul></main>`;
}

function detailSnapshot(item, kind) {
  const date = isoDate(item.date);
  const listPath = kind === "blog" ? "/blogs" : "/projects";
  const links = [
    item.githubLink && `<a href="${esc(item.githubLink)}" rel="noopener noreferrer">Source on GitHub</a>`,
    item.externalLink && `<a href="${esc(item.externalLink)}" rel="noopener noreferrer">Project link</a>`,
  ]
    .filter(Boolean)
    .join(" ");
  return `${navHtml}<main id="main"><article><h1>${esc(stripTitleEmoji(item.title))}</h1>${
    date ? `<p><time datetime="${date}">${date}</time></p>` : ""
  }${tagsHtml(item.tags)}${item.summary ? `<p>${esc(plain(item.summary))}</p>` : ""}${
    item.coverImage
      ? `<img src="/${esc(item.coverImage)}" alt="Cover image for ${esc(stripTitleEmoji(item.title))}" />`
      : ""
  }${links ? `<p>${links}</p>` : ""}<div>${item.html}</div><p><a href="${listPath}">&larr; All ${
    kind === "blog" ? "blogs" : "projects"
  }</a></p></article></main>`;
}

const pages = [];

pages.push({
  url: "/blogs",
  title: `Blogs | ${SITE_NAME}`,
  description: `Writing by ${AUTHOR} on building software, learning in public and ideas worth sharing.`,
  imageUrl: `${BASE_URL}/opengraph-image.jpg`,
  ogType: "website",
  body: listSnapshot("Blogs", `Writing by ${AUTHOR}.`, blogs),
  ld: [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Blogs",
      url: `${BASE_URL}/blogs`,
      author: person,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: blogs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${BASE_URL}${b.url}`,
          name: stripTitleEmoji(b.title),
        })),
      },
    },
    breadcrumb([["Home", "/"], ["Blogs", "/blogs"]]),
  ],
});

pages.push({
  url: "/projects",
  title: `Projects | ${SITE_NAME}`,
  description: `Projects built by ${AUTHOR}: web apps, tools and experiments, with write-ups and source links.`,
  imageUrl: `${BASE_URL}/opengraph-image.jpg`,
  ogType: "website",
  body: listSnapshot("Projects", `Things built by ${AUTHOR}.`, projects),
  ld: [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Projects",
      url: `${BASE_URL}/projects`,
      author: person,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${BASE_URL}${p.url}`,
          name: stripTitleEmoji(p.title),
        })),
      },
    },
    breadcrumb([["Home", "/"], ["Projects", "/projects"]]),
  ],
});

for (const b of blogs) {
  const title = stripTitleEmoji(b.title);
  const date = isoDate(b.date);
  pages.push({
    url: b.url,
    title: `${title} | ${SITE_NAME}`,
    description: plain(b.summary),
    imageUrl: b.imageUrl,
    ogType: "article",
    body: detailSnapshot(b, "blog"),
    ld: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: plain(b.summary),
        image: b.imageUrl,
        url: `${BASE_URL}${b.url}`,
        mainEntityOfPage: `${BASE_URL}${b.url}`,
        ...(date && { datePublished: date, dateModified: date }),
        keywords: b.tags?.join(", "),
        author: person,
      },
      breadcrumb([["Home", "/"], ["Blogs", "/blogs"], [title, b.url]]),
    ],
  });
}

for (const p of projects) {
  const title = stripTitleEmoji(p.title);
  const date = isoDate(p.date);
  pages.push({
    url: p.url,
    title: `${title} | ${SITE_NAME}`,
    description: plain(p.summary),
    imageUrl: p.imageUrl,
    ogType: "article",
    body: detailSnapshot(p, "project"),
    ld: [
      {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: title,
        description: plain(p.summary),
        image: p.imageUrl,
        url: `${BASE_URL}${p.url}`,
        ...(date && { dateCreated: date }),
        keywords: p.tags?.join(", "),
        author: person,
        ...(p.githubLink && { sameAs: p.githubLink }),
      },
      breadcrumb([["Home", "/"], ["Projects", "/projects"], [title, p.url]]),
    ],
  });
}

let count = 0;
for (const page of pages) {
  let html = indexHtml;
  const fullUrl = `${BASE_URL}${page.url}`;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`);
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "property", "og:type", page.ogType);
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "property", "og:image", page.imageUrl);
  html = setMeta(html, "property", "og:url", fullUrl);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  html = setMeta(html, "name", "twitter:image", page.imageUrl);

  // index.html has no canonical, so insert one (plus JSON-LD) before </head>.
  html = html.replace(
    "</head>",
    `<link rel="canonical" href="${fullUrl}" />\n${jsonLd(page.ld)}\n</head>`,
  );

  // Static snapshot for crawlers/AI fetchers; React's createRoot replaces it on load.
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${page.body}</div>`,
  );

  // /projects -> dist/projects.html, /blog/x -> dist/blog/x.html
  const outPath = join(DIST_DIR, `${page.url.slice(1)}.html`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  count++;
}

console.log(`Prerendered ${count} pages (static HTML snapshot + JSON-LD)`);
