import { motion, useReducedMotion } from "motion/react";
import MetaComponent from "../components/meta";
import Ghost from "../components/creatures/ghost";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "./timeline-overrides.css";

interface TimelineItem {
    date: string;
    heading: string;
    icon: string;
    lines: string[];
    quote?: string;
}

const tapeColors = [
    "var(--color-green)",
    "var(--color-mustard)",
    "var(--color-purple)",
    "var(--color-accent)",
];

const cardRadii = [
    "18px 6px 16px 4px",
    "4px 16px 6px 18px",
    "16px 4px 18px 6px",
    "6px 18px 4px 16px",
];

const cardTilts = [-1.6, 1.1, -0.9, 1.4];

const timeline: TimelineItem[] = [
    {
        date: "2022",
        heading: "✨ I started coding",
        icon: "✨",
        lines: [
            "It began with Discord bots.",
            "Naturally, I thought this meant I knew how programming worked.",
            "I did not.",
        ],
    },
    {
        date: "Jun – Oct 2024",
        heading: "🛳️ Joined Hack Club",
        icon: "🛳️",
        lines: [
            "Got involved with Hack Club as a community member.",
            "This was around the time I started realizing that building things is considerably more fun when we have people to share the moment with.",
            "Yup, those teenagers were AWESOME!!",
        ],
    },
    {
        date: "Sep 2024",
        heading: "📚 GEC Palakkad happened",
        icon: "📚",
        lines: [
            "Joined GEC Palakkad for B.Tech CSE.",
            "Four years of engineering officially began.",
            "Life felt like drama for the first time ever. I got to experience the rollercoaster of emotions. Those college life reels were not lying :)",
        ],
    },
    {
        date: "Jan 2025 – Jan 2026",
        heading: "⚡ Started helping run things",
        icon: "⚡",
        lines: [
            "Co-led TinkerHub GEC Palakkad and μLearn GECSKP.",
            "Learned a lot about teamwork, communication and organizing. Met a lot of people - I'm glad that I decided to take part in these communities.",
        ],
    },
    {
        date: "Jun 2025 – Mar 2026",
        heading: "🤝 Became Campus Lead",
        icon: "🤝",
        lines: [
            "Took up the Campus Lead role at TinkerHub GEC Palakkad.",
            "TinkerHub gave me moments that hold a special value for me",
        ],
        quote: "Life is good",
    },
    {
        date: "Mar 2026 – now",
        heading: "👨‍💻 Started working at Biloop.ai",
        icon: "👨‍💻",
        lines: [
            "Software Developer Intern.",
            "Now I get paid to stare at Django and Next.js",
            "Which is honestly pretty close to what I was doing anyway. And yeah... Daily standups",
        ],
    },
    {
        date: "Jun 2026 – now",
        heading: "🤍 NSS Unit 185",
        icon: "🤍",
        lines: [
            "Joined the APJAKTU NSS Unit 185 team as Joint Volunteer Secretary.",
            "Proud to be a NSS Volunteer. It gave me a sense of purpose. I love the activities of NSS.",
        ],
        quote: "Manass Nannavatte",
    },
    {
        date: "Jul 2026 – now",
        heading: "🚀 Technology Lead, IEDC NEST",
        icon: "🚀",
        lines: [
            "Joined IEDC NEST as Technology Lead.",
            "More people. More ideas. More things to build.",
        ],
    },
    {
        date: "Jul 2026 – now",
        heading: "🧭 Joined the TinkerHub Council",
        icon: "🧭",
        lines: [
            "Now I'm helping out at a slightly bigger level too.",
            "Still having fun.",
        ],
    },
];

function Sparkle({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
            <path
                d="M20 3 L23 17 L37 20 L23 23 L20 37 L17 23 L3 20 L17 17 Z"
                fill="var(--color-mustard)"
            />
        </svg>
    );
}

function Timeline({ items }: { items: TimelineItem[] }) {
    return (
        <VerticalTimeline lineColor="color-mix(in srgb, var(--color-ink) 18%, transparent)">
            {items.map((item, i) => {
                const tape = tapeColors[i % tapeColors.length];
                const radius = cardRadii[i % cardRadii.length];
                const tilt = cardTilts[i % cardTilts.length];

                return (
                    <VerticalTimelineElement
                        key={`${item.date}-${i}`}
                        date={item.date}
                        contentStyle={{
                            background: "var(--color-surface)",
                            color: "var(--color-ink)",
                            boxShadow:
                                "0 10px 24px -12px rgba(17,17,17,0.28), 0 2px 0 rgba(17,17,17,0.06)",
                            border: "1px solid color-mix(in srgb, var(--color-ink) 12%, transparent)",
                            borderRadius: radius,
                            transform: `rotate(${tilt}deg)`,
                            position: "relative",
                            overflow: "visible",
                            padding: "1.5rem 1.5rem 1.25rem",
                        }}
                        contentArrowStyle={{
                            borderRight:
                                "7px solid color-mix(in srgb, var(--color-ink) 12%, transparent)",
                        }}
                        iconStyle={{
                            background: tape,
                            color: "#fff",
                            boxShadow: "0 0 0 4px var(--color-surface)",
                        }}
                        icon={
                            <span className="flex items-center justify-center w-full h-full text-lg">
                                {item.icon}
                            </span>
                        }
                    >
                        {/* washi tape strip */}
                        <span
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                top: "-14px",
                                left: "18px",
                                width: "68px",
                                height: "22px",
                                background: tape,
                                opacity: 0.75,
                                transform: `rotate(${-tilt * 1.4 - 3}deg)`,
                                boxShadow: "0 2px 4px rgba(17,17,17,0.15)",
                            }}
                        />

                        <h3 className="font-hand text-[22px] leading-tight text-ink">
                            {item.heading.replace(/^\S+\s/, "")}
                        </h3>

                        <div className="font-sans text-[14.5px] leading-relaxed text-ink/85 mt-2 space-y-1.5">
                            {item.lines.map((line, li) => (
                                <p key={li}>{line}</p>
                            ))}
                            {item.quote && (
                                <p className="font-serif italic text-ink/70 pt-1 pl-3 border-l-2 border-ink/15">
                                    "{item.quote}"
                                </p>
                            )}
                        </div>
                    </VerticalTimelineElement>
                );
            })}
        </VerticalTimeline>
    );
}

export default function AboutPage() {
    const reduceMotion = useReducedMotion();
    const fadeUp = {
        initial: { opacity: 0, y: reduceMotion ? 0 : 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: reduceMotion ? 0 : 0.45 },
    };

    return (
        <>
            <MetaComponent
                pageTitle="About"
                pageDescription="All about Fahad - A passionate developer"
            />
            <div className="relative min-h-dvh overflow-x-hidden pt-28 pb-24">
                <Ghost
                    className="absolute hidden sm:block"
                    style={{
                        bottom: "40px",
                        right: "4%",
                        transform: "rotate(-6deg)",
                    }}
                />

                {/* Bio — offset left, ~68% width on desktop */}
                <motion.div
                    {...fadeUp}
                    className="px-6 sm:px-8 w-full md:w-[68%] max-w-2xl md:ml-[6%]"
                >
                    <h1
                        className="font-hand text-ink"
                        style={{
                            fontSize: "clamp(38px, 8vw, 54px)",
                            lineHeight: 1.15,
                        }}
                    >
                        A little bit{" "}
                        <span className="font-serif italic text-accent">
                            about me.
                        </span>
                    </h1>

                    <div className="font-sans pt-4 space-y-4 text-[16px] leading-relaxed text-ink/90">
                        <p>Hi, I'm Fahad</p>
                        <p>
                            I'm a B.Tech CSE student at GEC Palakkad who somehow
                            went from making Discord bots to building web apps,
                            breaking hardware, organizing tech communities, and
                            occasionally wondering why I decided to touch a
                            particular codebase in the first place.
                        </p>

                        <div className="space-y-0.5">
                            <p>I like making things.</p>
                            <p>Sometimes useful things.</p>
                            <p>Sometimes silly things.</p>
                            <p>
                                Sometimes things that are useful{" "}
                                <em>because they're silly.</em>
                            </p>
                        </div>

                        <p>
                            I mostly live somewhere around{" "}
                            <strong className="text-ink">
                                React, TypeScript, Python, Django, Next.js
                            </strong>{" "}
                            and hardware that has far too few pins. But
                            honestly, I'm more interested in the thing I'm
                            trying to make than the particular stack used to
                            make it.
                        </p>
                        <p>
                            Lately I've been building software professionally,
                            tinkering with side projects, and trying to make
                            technology feel a little less intimidating for the
                            people around me.
                        </p>

                        <div className="space-y-0.5">
                            <p>
                                And yes, I still get excited when something
                                works on the first try.
                            </p>
                            <p className="text-ink/60">
                                It doesn't happen often.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Timeline — graph-paper backdrop, centered */}
                <motion.div
                    {...fadeUp}
                    transition={{
                        duration: reduceMotion ? 0 : 0.45,
                        delay: 0.3,
                    }}
                    className="relative mt-16"
                >
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-full -z-10"
                        style={{
                            backgroundImage:
                                "linear-gradient(color-mix(in srgb, var(--color-green) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-green) 10%, transparent) 1px, transparent 1px)",
                            backgroundSize: "26px 26px",
                            maskImage:
                                "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
                            WebkitMaskImage:
                                "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
                        }}
                    />

                    <p className="font-hand text-[26px] text-center text-ink pt-6">
                        the somewhat questionable timeline
                    </p>

                    <Timeline items={timeline} />

                    {/* open visual endpoint, not another card */}
                    <div className="relative text-center px-6 pb-4">
                        <Sparkle className="w-8 h-8 mx-auto mb-3" />
                        <p
                            className="font-hand text-ink"
                            style={{ fontSize: "clamp(30px, 6vw, 42px)" }}
                        >
                            and now?
                        </p>
                        <div className="font-sans text-[15px] text-ink/80 max-w-sm mx-auto mt-2 space-y-1">
                            <p>I'm building useful things.</p>
                            <p>Some serious.</p>
                            <p>Some experimental.</p>
                            <p>Some that probably shouldn't exist.</p>
                            <p className="text-ink/55 pt-1">
                                We'll see where this goes.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Say hi — narrower, offset right */}
                <motion.div
                    {...fadeUp}
                    className="px-6 sm:px-8 w-full md:w-[52%] max-w-md md:ml-auto md:mr-[8%] mt-20"
                >
                    <h2 className="font-hand text-ink text-[28px]">say hi</h2>
                    <p className="font-sans text-ink/90 mt-2">
                        I'm much better at conversations than contact forms
                        pretending to be conversations.
                    </p>
                    <p className="font-sans text-ink/90 mt-3">
                        Instagram:
                        <a
                            className="underline underline-offset-4"
                            href="https://instagram.com/ranger_nf"
                        >
                            ranger_nf
                        </a>
                        <br />
                        <span>
                            Or find me on LinkedIn.{" "}
                            <span className="text-ink/55 text-[13px]">
                                (probably the easiest way to find me)
                            </span>
                        </span>
                        <br />
                        <span>
                            Or send a mail to
                            <a
                                className="underline underline-offset-4"
                                href="mailto:hi@justfahad.me"
                            >
                                hi@justfahad.me
                            </a>
                            <span className="text-ink/55 text-[13px]">
                                (this will definitely catch my attention)
                            </span>
                        </span>
                    </p>
                </motion.div>

                {/* About this site — offset left again */}
                <motion.div
                    {...fadeUp}
                    className="px-6 sm:px-8 w-full md:w-[58%] max-w-lg md:ml-[6%] mt-16"
                >
                    <h2 className="font-hand text-ink text-[28px]">
                        about this little corner of the internet
                    </h2>
                    <div className="font-sans text-ink/90 mt-2 space-y-3">
                        <p>
                            I wanted this website to feel like a website made by{" "}
                            <strong className="text-ink">a person</strong>,
                            rather than a website assembled by a committee.
                        </p>
                        <div className="space-y-0.5">
                            <p>It's a little strange.</p>
                            <p>It's a little handmade.</p>
                            <p>Some things move around.</p>
                            <p>Some things probably shouldn't.</p>
                            <p className="text-ink/60">That's intentional.</p>
                        </div>
                        <p>A lot of the visual inspiration came from:</p>
                        <p>
                            <a
                                className="underline underline-offset-4"
                                href="https://wandixu.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                wandixu.com
                            </a>{" "}
                            <span className="text-ink/55 text-[13px]">
                                — genuinely, what a masterpiece.
                            </span>
                            <br />
                            <a
                                className="underline underline-offset-4"
                                href="https://scalzodesign.be/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                scalzodesign.be
                            </a>{" "}
                            <span className="text-ink/55 text-[13px]">
                                — another ridiculously good site.
                            </span>
                        </p>
                        <p className="text-ink/60">
                            Stealing? No. Borrowing aggressively? ...maybe.
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
