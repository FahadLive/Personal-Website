import "./page.css";

import { motion } from "motion/react";
import NavLinks from "../components/navLinks";
import TextTransition from "../components/transitionText";
import MetaComponent from "../components/meta";
import Bird from "../components/creatures/bird";

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
                    style={{ top: "12px", right: "12px" }}
                />

                {/* ── Mobile Layout ── */}
                <div className="flex h-full flex-col md:hidden">
                    {/* Name */}
                    <div>
                        <TextTransition
                            styleName="hero-name"
                            text="MOHAMMED"
                            characterCycleSpeed={6}
                            revealSpeed={4}
                        />
                        <TextTransition
                            styleName="hero-name"
                            text="FAHAD"
                            characterCycleSpeed={6}
                            revealSpeed={4}
                        />
                    </div>

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
                    <motion.div
                        className="flex justify-center my-8"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.5 }}
                    >
                        <img
                            src="/fahads-photo.jpg"
                            alt="Mohammed Fahad"
                            className="hero-portrait"
                            draggable={false}
                        />
                    </motion.div>

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

                    {/* Nav links */}
                    <motion.div
                        className="flex flex-col gap-2 mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                    >
                        <NavLinks
                            indexNum="01"
                            text="Projects"
                            link="/projects"
                        />
                        <NavLinks indexNum="02" text="Blogs" link="/blogs" />
                        <NavLinks indexNum="03" text="About" link="/about" />
                    </motion.div>

                    <div className="flex justify-center pt-8 pb-4 mt-auto">
                        <a
                            href="https://github.com/FahadLive/personal-website"
                            className="text-xs font-light opacity-50"
                        >
                            MADE OPENLY BY FAHAD
                        </a>
                    </div>
                </div>

                {/* ── Desktop Layout ── */}
                <div className="hidden md:flex md:flex-col min-h-full">
                    <div className="flex items-start justify-between gap-12 mt-4">
                        <div className="flex-1 max-w-2xl">
                            {/* Name */}
                            <div>
                                <TextTransition
                                    styleName="hero-name"
                                    text="MOHAMMED"
                                    characterCycleSpeed={6}
                                    revealSpeed={4}
                                />
                                <TextTransition
                                    styleName="hero-name"
                                    text="FAHAD"
                                    characterCycleSpeed={6}
                                    revealSpeed={4}
                                />
                            </div>

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
                        <motion.div
                            className="flex-shrink-0 mt-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.45, duration: 0.6 }}
                        >
                            <img
                                src="/fahads-photo.jpg"
                                alt="Mohammed Fahad"
                                className="hero-portrait"
                                style={{
                                    maxWidth: "320px",
                                    width: "100%",
                                }}
                                draggable={false}
                            />
                        </motion.div>
                    </div>

                    {/* Nav + footer */}
                    <div className="flex items-end justify-between mt-12 pb-8">
                        <div className="flex gap-8">
                            <NavLinks
                                indexNum="01"
                                text="Projects"
                                link="/projects"
                            />
                            <NavLinks
                                indexNum="02"
                                text="Blogs"
                                link="/blogs"
                            />
                            <NavLinks
                                indexNum="03"
                                text="About"
                                link="/about"
                            />
                        </div>
                        <a
                            href="https://github.com/FahadLive/personal-website"
                            className="text-xs font-light opacity-50"
                        >
                            MADE OPENLY BY FAHAD
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
