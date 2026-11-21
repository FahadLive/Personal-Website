import { IconMenu, IconX } from "@tabler/icons-react";
import React, { useState, useEffect, useRef } from "react";
import NavLinks from "./navLinks";
import PageDirectButton from "./pageDirects";

const MobileMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [windowHeight, setWindowHeight] = useState<number>(0);
    const openRef = useRef<HTMLButtonElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const wasOpen = useRef(false);

    // Focus management, Escape to close, and scroll lock while open.
    useEffect(() => {
        if (isOpen) {
            wasOpen.current = true;
            closeRef.current?.focus();
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            const onKey = (e: KeyboardEvent) => {
                if (e.key === "Escape") setIsOpen(false);
            };
            document.addEventListener("keydown", onKey);
            return () => {
                document.body.style.overflow = prevOverflow;
                document.removeEventListener("keydown", onKey);
            };
        }
        if (wasOpen.current) {
            wasOpen.current = false;
            openRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const updateHeight = () => {
            setWindowHeight(window.innerHeight);
        };

        // Set height initially
        updateHeight();

        // Update height on resize and orientation change
        window.addEventListener("resize", updateHeight);
        window.addEventListener("orientationchange", updateHeight);

        // Cleanup
        return () => {
            window.removeEventListener("resize", updateHeight);
            window.removeEventListener("orientationchange", updateHeight);
        };
    }, []);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <div className="z-[100] bg-[var(--tertiary)] hover:bg-[var(--text)] p-2 rounded-[50%] transition">
            <button
                ref={openRef}
                type="button"
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
                inert={isOpen}
                onClick={() => setIsOpen(true)}
                className={`md:hidden block transition-opacity duration-300 ${
                    isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            >
                <IconMenu
                    className="h-6 w-6 text-[var(--main)]"
                    aria-hidden="true"
                />
            </button>
            {/* Mobile Menu Overlay */}
            <div
                id="mobile-nav"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                inert={!isOpen}
                style={{ height: windowHeight ? `${windowHeight}px` : "100vh" }}
                className={`fixed top-0 left-0 w-screen bg-[var(--main)] p-6 transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-full pointer-events-none"
                }`}
            >
                <div className="flex flex-col h-full p-3">
                    <div className="flex justify-end p-2">
                        <button
                            ref={closeRef}
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setIsOpen(false)}
                            className="p-1 group"
                        >
                            <IconX
                                className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90"
                                aria-hidden="true"
                            />
                        </button>
                    </div>

                    <div className="flex flex-col justify-between h-full">
                        {/* Buttons on the top */}
                        <nav
                            aria-label="Primary"
                            className="text-center space-y-6 py-6"
                        >
                            <NavLinks
                                indexNum="01"
                                text="Home"
                                link="/"
                                onClick={handleLinkClick}
                            />
                            <NavLinks
                                indexNum="02"
                                text="About"
                                link="/about"
                                onClick={handleLinkClick}
                            />
                            <NavLinks
                                indexNum="03"
                                text="Projects"
                                link="/projects"
                                onClick={handleLinkClick}
                            />
                            <NavLinks
                                indexNum="04"
                                text="Blogs"
                                link="/blogs"
                                onClick={handleLinkClick}
                            />
                            <NavLinks
                                indexNum="05"
                                text="Scratchpad"
                                link="/scratchpad"
                                onClick={handleLinkClick}
                            />
                            <NavLinks
                                indexNum="06"
                                text="Build in Public"
                                link="/build"
                                onClick={handleLinkClick}
                            />
                        </nav>
                        <div className="flex flex-col gap-6">
                            <div className="page-directs flex justify-between items-center">
                                <a
                                    className="nav-bar-item"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://linkedin.com/in/just-fahad/"
                                >
                                    linkedin
                                    <span className="sr-only">
                                        {" "}
                                        (opens in new tab)
                                    </span>
                                </a>
                                <PageDirectButton
                                    text="github"
                                    link="https://github.com/FahadLive"
                                />
                            </div>
                            <div className="font-hand text-sm opacity-75">
                                # based in Kerala
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
