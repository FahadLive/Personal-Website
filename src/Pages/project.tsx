import "./page.css";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getProjectData, type ProjectDetail } from "../utils/markdownParser";

import { motion } from "motion/react";
import ProjectGallery from "../components/projectGallery";
import { IconBrandGithub, IconLink } from "@tabler/icons-react";
import MetaComponent from "../components/meta";
import { Loading } from "../components/loading";

function formatDate(d: Date): string {
    return d
        .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
        })
        .toUpperCase();
}

// Summaries start with a decorative emoji (used in cards); drop it for the lede.
const stripLeadingEmoji = (text: string) =>
    text.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, "");

const actionClass =
    "inline-flex items-center gap-2 rounded-4xl border-2 border-[var(--tertiary)] bg-[var(--tertiary)] px-4 py-2 text-sm text-[var(--main)] transition-colors hover:bg-[var(--main)] hover:text-[var(--tertiary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--tertiary)]";

const ProjectPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const path = useLocation();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadProject = async () => {
            if (!slug) {
                navigate("/projects", { state: { from: path } });
                return;
            }

            try {
                const projectData = await getProjectData(slug);
                if (!projectData) {
                    navigate("/projects");
                    return;
                }
                setProject(projectData);
            } catch (error) {
                console.error(`Failed to load project: ${slug}`, error);
                navigate("/projects");
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [slug, path]);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full justify-center text-center pt-40">
                <Loading />
            </div>
        );
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    const date = new Date(project.date);
    const hasDate = !Number.isNaN(date.getTime());
    const hasImages = !!project.images && project.images.length > 0;

    return (
        <>
            <MetaComponent
                pageTitle={project.title}
                pageDescription={project.summary}
                pagePreview={project.coverImage || project.images?.[0] || null}
            />
            <div className="max-w-3xl min-w-0 mx-auto pt-28 px-8 md:px-10 pb-24">
                <article className="min-w-0">
                    <motion.header
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {/* Tags */}
                        {project.tags.length > 0 && (
                            <ul className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs font-medium uppercase tracking-wider text-[var(--tertiary)]">
                                {project.tags.map((tag, index) => (
                                    <li
                                        key={tag + index}
                                        className="flex items-center gap-2"
                                    >
                                        {index > 0 && (
                                            <span aria-hidden="true">·</span>
                                        )}
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Title */}
                        <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-4">
                            {project.title}.
                        </h1>

                        {/* Summary lede */}
                        {project.summary && (
                            <p className="mb-6 max-w-2xl font-sans text-lg leading-snug text-[var(--text)]/80 md:text-xl">
                                {stripLeadingEmoji(project.summary)}
                            </p>
                        )}

                        {/* Date + actions */}
                        <div className="mb-10 flex flex-col gap-y-4 font-sans text-sm text-[var(--text)]/70">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 font-sans text-sm text-[var(--text)]/70">
                                {project.githubLink && (
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={actionClass}
                                    >
                                        <IconBrandGithub
                                            size={18}
                                            aria-hidden="true"
                                        />
                                        GitHub
                                        <span className="sr-only">
                                            {" "}
                                            (opens in new tab)
                                        </span>
                                    </a>
                                )}
                                {project.externalLink && (
                                    <a
                                        href={project.externalLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={actionClass}
                                    >
                                        <IconLink
                                            size={18}
                                            aria-hidden="true"
                                        />
                                        Project link
                                        <span className="sr-only">
                                            {" "}
                                            (opens in new tab)
                                        </span>
                                    </a>
                                )}
                            </div>
                            {hasDate && (
                                <time dateTime={date.toISOString()}>
                                    {formatDate(date)}
                                </time>
                            )}
                        </div>
                    </motion.header>

                    <div className="section-divider mb-10" aria-hidden="true">
                        ✦
                    </div>

                    {/* Gallery breaks out of the text column so screenshots can be larger */}
                    {/* Mobile: bleed to the screen edges with negative margins (no fixed width, so the
                        column can never grow past the viewport). `contain: inline-size` stops the scrolling
                        carousel/marquee from contributing its (wide) content to the page's intrinsic width.
                        Desktop: centred and wider than the text. */}
                    {hasImages && (
                        <div className="relative -mx-8 mb-10 [contain:inline-size] md:mx-0 md:left-1/2 md:w-[min(calc(100vw-5rem),76rem)] md:-translate-x-1/2">
                            <ProjectGallery
                                images={project.images}
                                title={project.title}
                            />
                        </div>
                    )}

                    {/* Content */}
                    {project.html && (
                        <motion.div
                            id="learn-more"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: project.html }}
                        />
                    )}
                </article>
            </div>
        </>
    );
};

export default ProjectPage;
