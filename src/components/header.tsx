import React, { useEffect, useRef, useState } from "react";
import MobileMenu from "./mobileMenu";
import { triggerConfetti } from "../lib/confetti";
import PageDirectButton from "./pageDirects";
import { Link, NavLink, useLocation } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

import "./components.css";

const Header: React.FC = () => {
    const [isHomePage, setIsHomePage] = useState<boolean>(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const tapCount = useRef(0);
    const tapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );
    useEffect(() => {
        const onScroll = () => {
            const scrollTop =
                window.scrollY ||
                document.documentElement.scrollTop ||
                document.body.scrollTop;

            setIsScrolled(scrollTop > 10);
        };

        onScroll();

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const handleLogoClick = () => {
        tapCount.current++;
        if (tapCount.current >= 3) {
            tapCount.current = 0;
            clearTimeout(tapTimer.current);
            triggerConfetti();
            return;
        }
        clearTimeout(tapTimer.current);
        tapTimer.current = setTimeout(() => {
            tapCount.current = 0;
        }, 800);
    };

    const location = useLocation();

    useEffect(() => {
        setIsHomePage(location.pathname === "/");
    }, [location]);

    return (
        <header
            className={`fixed top-0 left-0 flex w-full p-6 z-[50] ${!isHomePage && isScrolled ? "header-scrolled" : ""}`}
        >
            <div className={`header-gradient`} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={isHomePage.toString()}
                    initial={{ y: "-200%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-200%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex w-full flex-row justify-between items-center"
                >
                    {!isHomePage && (
                        <div className="flex justify-start pt-1">
                            <Link to={location.state?.from || "/"} aria-label="Back">
                                <IconArrowLeft
                                    className="text-[var(--tertiary)] w-10 h-10 group-hover:scale-105"
                                    aria-hidden="true"
                                />
                            </Link>
                        </div>
                    )}

                    <Link
                        to="/"
                        aria-label="Fahad, home"
                        className="flex hover:cursor-pointer items-center p-2"
                        onClick={handleLogoClick}
                    >
                        <img
                            src="/logo.svg"
                            alt=""
                            className={`${!isHomePage ? "md:absolute md:left-[50%]" : ""} h-11 w-11 md:h-12 md:w-12`}
                        />
                    </Link>

                    <div className="md:hidden p-3">
                        <MobileMenu />
                    </div>

                    <nav
                        aria-label="Primary"
                        className="page-directs hidden md:flex h-max items-center gap-8 lg:gap-14"
                    >
                        <NavLink className="nav-bar-item" to="/projects">
                            projects
                        </NavLink>
                        <NavLink className="nav-bar-item" to="/blogs">
                            blogs
                        </NavLink>
                        <NavLink className="nav-bar-item" to="/about">
                            about
                        </NavLink>

                        <a
                            className="nav-bar-item"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://linkedin.com/in/just-fahad/"
                        >
                            linkedin
                            <span className="sr-only"> (opens in new tab)</span>
                        </a>
                        <PageDirectButton
                            text="github"
                            link="https://github.com/FahadLive"
                        />
                    </nav>
                </motion.div>
            </AnimatePresence>
        </header>
    );
};

export default Header;
