import "./page.css";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getBlogData, type BlogDetail } from "../utils/markdownParser";
import MetaComponent from "../components/meta";
import SelectionShare from "../components/selectionShare";
import Giscus from "@giscus/react";

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
    const [blog, setBlog] = useState<BlogDetail | null>(null);
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

    const readingTime = blog.readingTime;

    return (
        <>
            <MetaComponent
                pageTitle={blog.title}
                pageDescription={blog.summary}
                pagePreview={blog.coverImage ? blog.coverImage : null}
            />
            <div className="max-w-3xl mx-auto pt-28 px-8 md:px-10 pb-24">
                <article>
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
                        <time dateTime={new Date(blog.date).toISOString()}>
                            {formatDate(new Date(blog.date))}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{readingTime} min read</span>
                    </div>

                    {/* Divider */}
                    <div className="section-divider mb-10">✦</div>

                    {/* Content */}
                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: blog.html }}
                    />
                    <SelectionShare
                        title={blog.title}
                        url={`https://justfahad.me/blog/${slug}`}
                    />
                </article>
                <div className="my-16">
                    <Giscus
                        id="comments"
                        repo="FahadLive/Personal-Website"
                        repoId="R_kgDOKyqUtA"
                        category="General"
                        categoryId="DIC_kwDOKyqUtM4DAFgN"
                        mapping="pathname"
                        strict="0"
                        reactionsEnabled="1"
                        emitMetadata="0"
                        inputPosition="top"
                        theme="catppuccin_latte"
                        lang="en"
                        loading="lazy"
                    />
                </div>
            </div>
        </>
    );
};

export default BlogPage;
