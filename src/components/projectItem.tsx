import { IconArrowRight } from "@tabler/icons-react";
import "./components.css";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ProjectItemProps {
  indexNum: string;
  projectName: string;
  projectTags?: string[];
  slug?: string;
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

const ProjectItem: React.FC<ProjectItemProps> = ({
  indexNum,
  projectName,
  projectTags = [],
  slug,
}) => {
  const tagCount = projectTags?.length;

  const path = useLocation();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/project/" + slug, { state: { from: path } })}
      className="paper-card p-5 md:p-6"
    >
      <MaskingTape />

      {/* desktop view */}
      <div className="hidden md:flex md:flex-col gap-3">
        <div className="project-num text-[var(--tertiary)] text-sm">
          PROJECT /{indexNum}
        </div>
        <div className="project-name text-[var(--text)] text-2xl">
          {projectName.toUpperCase()}.
        </div>
        <div className="flex items-center justify-between">
          <div className="project-tags flex gap-2 text-xs text-[var(--tertiary)]">
            {projectTags?.map((tag, index) => (
              <span key={index}>
                {tag.toUpperCase()}
                {index < tagCount - 1 && " •"}
              </span>
            ))}
          </div>
          <IconArrowRight className="text-[var(--tertiary)] w-6 h-6 group-hover:scale-125 transition" />
        </div>
      </div>

      {/* mobile view */}
      <div className="flex flex-col gap-2 md:hidden">
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
      </div>
    </div>
  );
};

export default ProjectItem;
