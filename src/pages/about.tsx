import "./page.css";

import { motion } from "motion/react";
import MetaComponent from "../components/meta";

const timeline = [
    {
        year: "2022",
        label: "Started coding, building Discord bots",
        icon: "✨",
    },
    {
        year: "Jun 2024",
        label: "Hack Club member, building & shipping",
        icon: "🛳️",
    },
    {
        year: "Sep 2024",
        label: "Joined GEC Sreekrishnapuram, B. Tech CSE",
        icon: "📚",
    },
    {
        year: "Jan 2025",
        label: "Co-Lead at TinkerHub & μLearn GECSKP",
        icon: "⚡",
    },
    {
        year: "Jun 2025",
        label: "Campus Lead, TinkerHub GEC Palakkad",
        icon: "🤝",
    },
    {
        year: "Mar 2026",
        label: "Software Developer Intern @ Biloop.ai",
        icon: "👨‍💻",
    },
    { year: "Now", label: "Building useful things", icon: "🚀" },
];

function AboutPage() {
    return (
        <>
            <MetaComponent
                pageTitle="About"
                pageDescription="All about Fahad - A passionate developer"
            />
            <div className="min-h-dvh p-8 pt-28 max-w-3xl mx-auto">
                {/* Bio section — single column */}
                <div className="pb-16">
                    <h1 className="about-head">
                        A little bit{" "}
                        <span className="about-me">about me .</span>
                    </h1>
                    <p className="pt-6">
                        I'm a student currently pursuing a bachelors in computer
                        science & engineering at GEC Palakkad. I'm a self taught
                        developer who loves to build things that actually
                        matters!
                    </p>
                    <br />
                    <p>
                        Honestly, I love what I do. And this site is a product
                        of my passion :D
                    </p>
                </div>

                {/* Timeline section */}
                <motion.div
                    className="border-t border-[var(--tertiary)]/20 pt-12 pb-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="about-subheadings text-xl mb-10">
                        Timeline
                    </h2>

                    <div className="relative">
                        {/* Animated SVG line that draws on scroll */}
                        <motion.svg
                            className="absolute left-[26px] top-2 h-full w-[2px]"
                            aria-hidden="true"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.line
                                x1="1"
                                y1="0"
                                x2="1"
                                y2="100%"
                                className="timeline-line"
                                strokeDasharray="6 4"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 1.2,
                                    ease: "easeInOut",
                                }}
                            />
                        </motion.svg>

                        {timeline.map((item, index) => (
                            <motion.div
                                key={item.year + item.label}
                                className="flex gap-5 pb-10 last:pb-0 relative"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.4,
                                }}
                            >
                                {/* Dot */}
                                <div className="flex flex-col items-center pt-1">
                                    <motion.div
                                        className="w-[14px] h-[14px] rounded-full bg-transparent z-10"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 0.1 + index * 0.1,
                                            type: "spring",
                                            stiffness: 200,
                                        }}
                                    />
                                </div>

                                {/* Year */}
                                <div className="min-w-[72px] pt-1">
                                    <div className="timeline-year">
                                        {item.year}
                                    </div>
                                </div>

                                {/* Label */}
                                <div className="flex items-center gap-2 pt-0.5">
                                    <span className="timeline-icon text-sm">
                                        {item.icon}
                                    </span>
                                    <span className="timeline-label">
                                        {item.label}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact section */}
                <div className="border-t border-[var(--tertiary)]/20 pt-8">
                    <h2 className="about-subheadings">Contacts</h2>
                    <p>
                        <a
                            className="underline underline-offset-4"
                            href="https://instagram.com/ranger_nf"
                        >
                            ranger_nf on Instagram
                        </a>{" "}
                        <span className="about-side-note">(preferred)</span>
                        <br />
                        <span>or message me on LinkedIn</span>
                    </p>

                    <h2 className="about-subheadings">About this site</h2>
                    <p>
                        The design of this site was heavily inspired by:
                        <br />
                        <br />
                        <a
                            className="underline underline-offset-4"
                            href="https://wandixu.com/"
                            target="_blank"
                        >
                            wandixu.com
                        </a>{" "}
                        <span className="about-side-note">
                            (She built a masterpiece!)
                        </span>
                        <br />
                        <a
                            className="underline underline-offset-4"
                            href="https://scalzodesign.be/"
                            target="_blank"
                        >
                            scalzodesign.be
                        </a>{" "}
                        <span className="about-side-note">
                            (Again, a goated site)
                        </span>
                        <br />
                    </p>
                </div>
            </div>
        </>
    );
}

export default AboutPage;
