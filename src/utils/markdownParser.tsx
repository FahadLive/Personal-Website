import manifest from "../generated/contentManifest.json";

export interface ProjectListItem {
    slug: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
    githubLink: string | null;
    externalLink: string | null;
    coverImage: string | null;
    imagesFolder?: string | null;
}

export interface BlogListItem {
    slug: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
    coverImage: string | null;
    readingTime: number;
}

export function getProjectList(): ProjectListItem[] {
    return manifest.projects as ProjectListItem[];
}

export function getBlogList(): BlogListItem[] {
    return manifest.blogs as BlogListItem[];
}

const galleryImageLoaders = import.meta.glob(
    "../assets/images/projects/**/*.{webp,png,jpg,jpeg}",
    {
        query: "?url",
        import: "default",
    },
) as Record<string, () => Promise<string>>;

function galleryFolderName(imagesFolder: unknown): string | null {
    if (typeof imagesFolder !== "string") return null;
    const segments = imagesFolder.split("/").filter(Boolean);
    return segments.length ? segments[segments.length - 1] : null;
}

async function loadGalleryImages(imagesFolder: unknown): Promise<string[]> {
    const folder = galleryFolderName(imagesFolder);
    if (!folder) return [];

    return Promise.all(
        Object.entries(galleryImageLoaders)
            .filter(([path]) => path.includes(`/${folder}/`))
            .sort(([a], [b]) =>
                a.localeCompare(b, undefined, { numeric: true }),
            )
            .map(([, loadImage]) => loadImage()),
    );
}

interface BodyChunk {
    slug: string;
    html: string;
}

async function loadBody(type: "projects" | "blogs", slug: string): Promise<BodyChunk | null> {
    const list = type === "projects" ? manifest.projects : manifest.blogs;
    if (!list.some((entry) => entry.slug === slug)) return null;

    const chunk = (await import(
        `../generated/content/${type}/${slug}.json`
    )) as { default: BodyChunk };
    return chunk.default;
}

export interface ProjectDetail extends ProjectListItem {
    html: string;
    images: string[];
}

export async function getProjectData(slug: string): Promise<ProjectDetail | null> {
    try {
        const meta = getProjectList().find((project) => project.slug === slug);
        if (!meta) return null;

        const [body, images] = await Promise.all([
            loadBody("projects", slug),
            loadGalleryImages(meta.imagesFolder),
        ]);
        if (!body) return null;

        return { ...meta, html: body.html, images };
    } catch (error) {
        console.error(`Error loading project with slug: ${slug}`, error);
        return null;
    }
}

export interface BlogDetail extends BlogListItem {
    html: string;
}

export async function getBlogData(slug: string): Promise<BlogDetail | null> {
    try {
        // Blogs live in nested folders; match on slug via the manifest.
        const meta = getBlogList().find((blog) => blog.slug === slug);
        if (!meta) return null;

        const body = await loadBody("blogs", slug);
        if (!body) return null;

        return { ...meta, html: body.html };
    } catch (error) {
        console.error(`Error loading blog post with slug: ${slug}`, error);
        return null;
    }
}
