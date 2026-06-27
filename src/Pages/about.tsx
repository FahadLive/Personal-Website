import "./page.css";

import { motion } from "motion/react";
import MetaComponent from "../components/meta";
import Ghost from "../components/creatures/ghost";

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
        label: "Joined GEC Palakkad, B. Tech CSE",
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
            <div className="relative min-h-dvh p-8 pt-28 max-w-3xl mx-auto">
                <Ghost
                    className="absolute"
                    style={{ bottom: "24px", right: "24px" }}
                />

                {/* Bio section — single column */}
                <div className="pb-16">
                    <h1 className="about-head">
                        A little bit{" "}
                        <span className="about-me">about me .</span>
                    </h1>

                    <div className="about-bio pt-6 space-y-4 text-base leading-relaxed">
                        <p>
                            I'm Mohammed Fahad — a self-taught developer and
                            B.Tech CSE student at GEC Palakkad. I love building
                            things that bridge the gap between ideas and impact:
                            web apps, Discord bots, hardware tinkerings, even a
                            Godot game or two.
                        </p>
                        <p>
                            I work across the stack — React, TypeScript, Python,
                            Dart, Next.js, Django, and a handful of IoT chips.
                            Recently shipped <strong>StockFlow</strong>, a full
                            B2B order management platform, and I served as the
                            campus lead for{" "}
                            <strong>TinkerHub GEC Palakkad</strong> in the year
                            2025-26, helping build a tech culture on campus.
                        </p>
                        <p>
                            I'm also a FOSS enthusiast, a hardware tinkerer, and
                            someone who genuinely believes the web should be
                            weird, personal, and handmade. This site is that
                            belief in action.
                        </p>
                    </div>
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
