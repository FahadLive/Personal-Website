import { IconArrowUpRight } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";

interface PageDirectButtonProp {
    text: string;
    link?: string;
    onClick?: () => void;
}

const PageDirectButton: React.FC<PageDirectButtonProp> = ({
    text,
    link = "/",
    onClick,
}) => {
    const external = /^https?:\/\//.test(link);
    const className =
        "group relative flex flex-row justify-center p-2 w-fit";
    const content = (
        <>
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    d="M16 3 h66 q10 0 13 4 q3 4 2 18 q-1 10 -13 13 h-58 q-10 0 -13 -4 q-3 -4 -2 -18 q1 -10 13 -13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="doodle-btn-border"
                    style={{ color: "#111" }}
                />
            </svg>
            <div className="nav-bar-item px-1 font-black">
                {text.toLowerCase()}
                {external && (
                    <span className="sr-only"> (opens in new tab)</span>
                )}
            </div>
            <IconArrowUpRight
                className="font-semibold group-hover:rotate-45 transition"
                aria-hidden="true"
            />
        </>
    );

    if (external) {
        return (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className={className}
            >
                {content}
            </a>
        );
    }
    return (
        <Link to={link} onClick={onClick} className={className}>
            {content}
        </Link>
    );
};

export default PageDirectButton;
