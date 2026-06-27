import { IconArrowRight } from "@tabler/icons-react";
import "./components.css";
import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface BlogItemProps {
    indexNum: string;
    blogTitle: string;
    blogTags?: string[];
    slug?: string;
    coverImage?: string | null;
    summary?: string | null;
}

const polaroidVariants = [
    { rotate: -2, x: 6, y: 0 },
    { rotate: 2.5, x: -8, y: -7 },
    { rotate: -3, x: 0, y: -9 },
    { rotate: 1.5, x: -4, y: 0 },
    { rotate: -4, x: 8, y: -5 },
    { rotate: 3.5, x: -6, y: 0 },
];

const BlogItem: React.FC<BlogItemProps> = ({
    indexNum,
    blogTitle,
    blogTags = [],
    slug,
    coverImage,
    summary,
}) => {
    const tagCount = blogTags?.length;
    const [wiggling, setWiggling] = useState(false);
    const [imgError, setImgError] = useState(false);

    const cardIndex = parseInt(indexNum) - 1;
    const v = polaroidVariants[cardIndex % polaroidVariants.length];

    const path = useLocation();
    const navigate = useNavigate();
    const showImage = coverImage && !imgError;

    const handleClick = useCallback(() => {
        setWiggling(true);
        setTimeout(() => setWiggling(false), 400);
        setTimeout(
            () => navigate("/blog/" + slug, { state: { from: path } }),
            200,
        );
    }, [slug, path, navigate]);

    return (
        <div onClick={handleClick} className="sticky-note p-5">
            {/* Pin */}
            <div
                className={`absolute -top-2 -left-2 text-2xl select-none pointer-events-none transition-transform origin-top ${wiggling ? "pin-wiggle" : ""}`}
                aria-hidden="true"
            >
                📌
            </div>

            <div className="flex flex-col gap-3">
                {showImage && (
                    <div
                        className="card-image-wrapper"
                        style={
                            {
                                "--pop-x": `${v.x}px`,
                                "--pop-rotate": `${v.rotate}deg`,
                                "--pop-y": `${v.y}px`,
                            } as React.CSSProperties
                        }
                    >
                        <img
                            src={`/${coverImage}`}
                            alt={`Cover for ${blogTitle}`}
                            className="card-image"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <div className="project-num text-[var(--tertiary)] text-xs">
                            BLOG /{indexNum}
                        </div>
                        <div className="project-tags flex gap-1 text-xs text-[var(--tertiary)]">
                            {blogTags?.map((tag, index) => (
                                <span key={index}>
                                    {tag.toUpperCase()}
                                    {index < tagCount - 1 && " •"}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="blog-title text-[var(--text)] text-lg">
                        {blogTitle}.
                    </div>
                    {!showImage && summary && (
                        <div className="project-summary text-xs text-[var(--text)]/60 mt-1 line-clamp-2">
                            {summary}
                        </div>
                    )}
                    <div className="flex items-center justify-end mt-1">
                        <IconArrowRight className="text-[var(--tertiary)] w-5 h-5 transition" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogItem;
