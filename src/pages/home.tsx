import "./page.css";

import { motion } from "motion/react";
import NavLinks from "../components/navLinks";
import MetaComponent from "../components/meta";
import Bird from "../components/creatures/bird";
import { HeroName, HeroPortrait } from "../components/home/heroComponents";

const NAV_ITEMS = [
    { indexNum: "01", text: "Projects", link: "/projects" },
    { indexNum: "02", text: "Blogs", link: "/blogs" },
    { indexNum: "03", text: "About", link: "/about" },
    { indexNum: "04", text: "Scratchpad", link: "/scratchpad" },
    { indexNum: "05", text: "Build", link: "/build" },
];

const FOOTER_CONTENT = "MADE OPENLY BY FAHAD";

function HomePage() {
    return (
        <>
            <MetaComponent
                pageTitle="Home"
                pageDescription="Hi, I'm Mohammed Fahad, a passionate student who loves turning ideas into impactful digital experiences."
            />
            <div className="relative flex flex-col min-h-dvh p-8 pt-28">
                <Bird
                    className="absolute"
                    style={{ top: "120px", right: "24px" }}
                />

                {/* ── Mobile Layout ── */}
                <div className="flex h-full flex-col md:hidden">
                    {/* Name */}
                    <HeroName />

                    {/* Serif float */}
                    <motion.div
                        className="hero-float mt-2"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                    >
                        ✦ Thought-driven developer
                    </motion.div>

                    {/* Handwritten note */}
                    <motion.div
                        className="hero-note ml-1 mt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        // based in Kerala
                    </motion.div>

                    {/* Portrait */}
                    <HeroPortrait />

                    {/* Tagline */}
                    <motion.div
                        className="hero-tagline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                    >
                        building software
                        <br />
                        that quietly solves problems.
                    </motion.div>

                    <div className="flex justify-center pt-6 mt-auto">
                        <a
                            href="https://github.com/FahadLive/personal-website"
                            className="text-xs font-light opacity-50"
                        >
                            {FOOTER_CONTENT}
                        </a>
                    </div>
                </div>

                {/* ── Desktop Layout ── */}
                <div className="hidden md:flex md:flex-col min-h-full">
                    <div className="flex items-start justify-between gap-12 mt-4">
                        <div className="flex-1 max-w-2xl">
                            {/* Name */}
                            <HeroName />

                            {/* Serif float */}
                            <motion.div
                                className="hero-float mt-3"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35, duration: 0.5 }}
                            >
                                ✦ Thought-driven developer
                            </motion.div>

                            {/* Handwritten note */}
                            <motion.div
                                className="hero-note ml-1 mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                            >
                                // based in Kerala
                            </motion.div>

                            {/* Tagline */}
                            <motion.div
                                className="hero-tagline mt-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                            >
                                building software
                                <br />
                                that quietly solves problems.
                            </motion.div>
                        </div>

                        {/* Portrait */}
                        <HeroPortrait maxWidth="320px" />
                    </div>

                    {/* Nav + footer */}
                    <div className="flex items-end justify-between mt-12 pb-8">
                        <div className="flex gap-8">
                            {NAV_ITEMS.map((item) => (
                                <NavLinks key={item.link} {...item} />
                            ))}
                        </div>
                        <a
                            href="https://github.com/FahadLive/personal-website"
                            className="text-xs font-light opacity-50"
                        >
                            {FOOTER_CONTENT}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
