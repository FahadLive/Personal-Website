import { IconArrowDownRight } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import "./components.css";

interface NavLinksProp {
    indexNum: string;
    text: string;
    link: string;
    onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProp> = ({
    indexNum,
    text,
    link,
    onClick,
}) => {
    return (
        <Link
            className="navlinks group hover:translate-x-4 flex gap-2 xl:gap-3 text-center items-center transition"
            to={link}
            onClick={onClick}
        >
            <span className="text-[var(--tertiary)] font-bold text-xl xl:text-2xl">
                {indexNum}
            </span>
            <span className="nav-underline text-[var(--text)] font-semibold transition text-xl xl:text-2xl">
                {text}
            </span>
            <IconArrowDownRight className="font-semibold group-hover:-rotate-45 group-hover:bg-[var(--tertiary))] group-hover:text-[var(--main))] rounded-4xl transition" />
        </Link>
    );
};

export default NavLinks;
