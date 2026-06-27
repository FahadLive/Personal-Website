import { IconArrowRight } from "@tabler/icons-react";
import "./components.css";
import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface BlogItemProps {
  indexNum: string;
  blogTitle: string;
  blogTags?: string[];
  slug?: string;
}

const BlogItem: React.FC<BlogItemProps> = ({
  indexNum,
  blogTitle,
  blogTags = [],
  slug,
}) => {
  const tagCount = blogTags?.length;
  const [wiggling, setWiggling] = useState(false);

  const path = useLocation();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    setWiggling(true);
    setTimeout(() => setWiggling(false), 400);
    setTimeout(
      () => navigate("/blog/" + slug, { state: { from: path } }),
      200,
    );
  }, [slug, path, navigate]);

  return (
    <div
      onClick={handleClick}
      className="sticky-note p-5 md:p-6"
    >
      {/* Pin */}
      <div
        className={`absolute -top-1 -left-1 text-lg select-none pointer-events-none transition-transform origin-top ${wiggling ? "pin-wiggle" : ""}`}
        aria-hidden="true"
      >
        📌
      </div>

      {/* desktop view */}
      <div className="hidden md:flex md:flex-col gap-3 pt-3">
        <div className="project-num text-[var(--tertiary)] text-sm">
          BLOG /{indexNum}
        </div>
        <div className="blog-title text-[var(--text)] text-xl">
          {blogTitle}.
        </div>
        <div className="flex justify-end">
          <IconArrowRight className="text-[var(--tertiary)] w-6 h-6 transition" />
        </div>
      </div>

      {/* mobile view */}
      <div className="flex flex-col gap-2 md:hidden pt-3">
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
      </div>
    </div>
  );
};

export default BlogItem;
