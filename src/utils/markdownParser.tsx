import manifest from "../generated/contentManifest.json";

export interface ProjectListItem {
    slug: string;
    title: string;
    date: string;
    summary: string | null;
    tags: string[];
    githubLink: string | null;
    externalLink: string | null;
    coverImage: string | null;
}

export interface BlogListItem {
    slug: string;
    title: string;
    date: string;
    summary: string | null;
    tags: string[];
    coverImage: string | null;
}

export function getProjectList(): ProjectListItem[] {
    return manifest.projects as ProjectListItem[];
}

export function getBlogList(): BlogListItem[] {
    return manifest.blogs as BlogListItem[];
}

const projectMarkdownLoaders = import.meta.glob("../../content/projects/*.md", {
    query: "?raw",
    import: "default",
}) as Record<string, () => Promise<string>>;

const blogMarkdownLoaders = import.meta.glob("../../content/blogs/**/*.md", {
    query: "?raw",
    import: "default",
}) as Record<string, () => Promise<string>>;

const galleryImageLoaders = import.meta.glob(
    "../assets/images/projects/**/*.{webp,png,jpg,jpeg}",
    {
        query: "?url",
        import: "default",
    },
) as Record<string, () => Promise<string>>;

async function parseMatter(raw: string) {
    const { Buffer } = await import("buffer");
    const globalRef = globalThis as unknown as { Buffer?: typeof Buffer };
    globalRef.Buffer ??= Buffer;
    const { default: matter } = await import("gray-matter");
    return matter(raw);
}

function galleryFolderName(imagesFolder: unknown): string | null {
    if (typeof imagesFolder !== "string") return null;
    const segments = imagesFolder.split("/").filter(Boolean);
    return segments.length ? segments[segments.length - 1] : null;
}

export async function getProjectData(slug: string) {
    try {
        const loader = projectMarkdownLoaders[`../../content/projects/${slug}.md`];
        if (!loader) {
            return null;
        }

        const raw = await loader();
        const { data, content } = await parseMatter(raw);

        const folder = galleryFolderName(data.imagesFolder);
        const images = folder
            ? await Promise.all(
                  Object.entries(galleryImageLoaders)
                      .filter(([path]) => path.includes(`/${folder}/`))
                      .sort(([a], [b]) =>
                          a.localeCompare(b, undefined, { numeric: true }),
                      )
                      .map(([, loadImage]) => loadImage()),
              )
            : [];

        return {
            slug,
            title: data.title,
            date: data.date,
            summary: data.summary,
            tags: data.tags || [],
            githubLink: data.githubLink || null,
            externalLink: data.externalLink || null,
            coverImage: data.cover?.image || null,
            images,
            content: content,
        };
    } catch (error) {
        console.error(`Error loading project with slug: ${slug}`, error);
        return null;
    }
}

export interface BlogData {
    slug: string;
    title: string;
    date: Date;
    summary: string;
    tags: string[];
    coverImage: string | null;
    content: string;
}

export async function getBlogData(slug: string): Promise<BlogData | null> {
    try {
        const entry = Object.entries(blogMarkdownLoaders).find(
            ([path]) => path.split("/").pop()?.replace(".md", "") === slug,
        );
        if (!entry) {
            return null;
        }

        const raw = await entry[1]();
        const { data, content } = await parseMatter(raw);

        return {
            slug,
            title: data.title,
            date: data.date,
            summary: data.summary,
            tags: data.tags || [],
            coverImage: data.cover?.image || null,
            content,
        };
    } catch (error) {
        console.error(`Error loading blog post with slug: ${slug}`, error);
        return null;
    }
}
