import "./page.css";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getBlogData } from "../utils/markdownParser";

import MetaComponent from "../components/meta";
import Markdown from "react-markdown";
import SelectionShare from "../components/selectionShare";

interface ProjectsDataType {
    slug: string;
    title: string;
    date: Date;
    summary: string;
    tags: string[];
    content: string;
    coverImage: string | null;
}

function estimateReadingTime(text: string): number {
    const plain = text.replace(/[#*`\[\]]/g, " ");
    const words = plain.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

function formatDate(d: Date): string {
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const BlogPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const path = useLocation();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<ProjectsDataType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlog = async () => {
            if (!slug) {
                navigate("/blogs", { state: { from: path } });
                return;
            }

            try {
                const blogData = await getBlogData(slug);
                if (!blogData) {
                    console.error(`No Data for slug: ${slug}`);
                    navigate("/blogs");
                    return;
                }
                setBlog(blogData);
            } catch (error) {
                console.error(`Failed to load blog: ${slug}`, error);
                navigate("/blogs");
            } finally {
                setLoading(false);
            }
        };

        loadBlog();
    }, [slug, path]);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full justify-center text-center pt-40">
                <p className="text-[var(--tertiary)]">Loading blog...</p>
            </div>
        );
    }

    if (!blog) {
        return <div>Blog not found</div>;
    }

    const readingTime = estimateReadingTime(blog.content);

    return (
        <>
            <MetaComponent
                pageTitle={blog.title}
                pageDescription={blog.summary}
                pagePreview={blog.coverImage ? blog.coverImage : null}
            />
            <article className="max-w-3xl mx-auto pt-28 px-8 md:px-10 pb-24">
                {/* Cover image */}
                {blog.coverImage && (
                    <div className="relative mb-10 rounded-sm overflow-hidden grain">
                        <img
                            src={`/${blog.coverImage}`}
                            alt=""
                            className="w-full h-auto object-cover"
                            loading="eager"
                        />
                    </div>
                )}

                {/* Title */}
                <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-4">
                    {blog.title}.
                </h1>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-sm font-sans text-[var(--text)]/50 mb-10">
                    <time dateTime={blog.date.toISOString()}>
                        {formatDate(blog.date)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{readingTime} min read</span>
                </div>

                {/* Divider */}
                <div className="section-divider mb-10">✦</div>

                {/* Content */}
                <div className="blog-content">
                    <Markdown>{blog.content}</Markdown>
                </div>
                <SelectionShare
                    title={blog.title}
                    url={`https://justfahad.me/blog/${slug}`}
                />
            </article>
        </>
    );
};

export default BlogPage;
