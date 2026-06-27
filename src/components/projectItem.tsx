import { IconArrowRight } from "@tabler/icons-react";
import "./components.css";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ProjectItemProps {
  indexNum: string;
  projectName: string;
  projectTags?: string[];
  slug?: string;
  coverImage?: string | null;
  summary?: string | null;
}

function MaskingTape() {
  return (
    <svg
      width="32"
      height="18"
      viewBox="0 0 32 18"
      aria-hidden="true"
      className="card-tape hidden md:block"
    >
      <path
        d="M2 5 Q3 2 8 3 L22 2 Q26 3 28 5 L30 11 Q29 14 24 13 L8 14 Q4 14 3 12 Z"
        fill="#111"
        opacity="0.15"
      />
    </svg>
  );
}

const polaroidVariants = [
    { rotate: -2.5, x: 0, y: -12 },
    { rotate: 3, x: 10, y: -6 },
    { rotate: -3.5, x: -6, y: 0 },
    { rotate: 2, x: 6, y: -16 },
    { rotate: -1.5, x: -10, y: 0 },
    { rotate: 4, x: 0, y: -10 },
];

const ProjectItem: React.FC<ProjectItemProps> = ({
  indexNum,
  projectName,
  projectTags = [],
  slug,
  coverImage,
  summary,
}) => {
  const tagCount = projectTags?.length;
  const [imgError, setImgError] = useState(false);
  const cardIndex = parseInt(indexNum) - 1;
  const v = polaroidVariants[cardIndex % polaroidVariants.length];

  const path = useLocation();
  const navigate = useNavigate();
  const showImage = coverImage && !imgError;

  return (
    <div
      onClick={() => navigate("/project/" + slug, { state: { from: path } })}
      className="paper-card p-5"
    >
      <MaskingTape />

      <div className="flex flex-col gap-3">
        {showImage && (
          <div
            className="card-image-wrapper"
            style={{
              "--pop-x": `${v.x}px`,
              "--pop-rotate": `${v.rotate}deg`,
              "--pop-y": `${v.y}px`,
            } as React.CSSProperties}
          >
            <img
              src={`/${coverImage}`}
              alt={`Cover for ${projectName}`}
              className="card-image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="project-num text-[var(--tertiary)] text-xs">
              PROJECT /{indexNum}
            </div>
            <div className="project-tags flex gap-1 text-xs text-[var(--tertiary)]">
              {projectTags?.map((tag, index) => (
                <span key={index}>
                  {tag.toUpperCase()}
                  {index < tagCount - 1 && " •"}
                </span>
              ))}
            </div>
          </div>
          <div className="project-name text-[var(--text)] text-xl">
            {projectName.toUpperCase()}.
          </div>
          {summary && (
            <div className="card-summary text-sm text-[var(--text)]/55 mt-0.5 line-clamp-2 leading-snug">
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

export default ProjectItem;
