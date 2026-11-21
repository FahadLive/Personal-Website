import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogEntry } from "../utils/buildLogParser";
import "./components.css";
import Linkify from "linkify-react";

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const bgColors = ["#FFFFFF", "#FFF9F0"];
const cardRotations = [-0.5, 0.3, -0.2, 0.6, -0.4, 0.2];

function formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
}

interface LogCardProps {
    entry: LogEntry;
    index: number;
    onProjectClick: (project: string) => void;
}

export default function LogCard({
    entry,
    index,
    onProjectClick,
}: LogCardProps) {
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const closeLightbox = () => setLightbox(null);

    // Move focus into the dialog, close on Escape, and restore focus afterwards.
    useEffect(() => {
        if (!lightbox) return;
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightbox(null);
            // The close button is the only focusable control: keep focus trapped on it.
            if (e.key === "Tab") {
                e.preventDefault();
                closeRef.current?.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        const trigger = triggerRef.current;
        return () => {
            document.removeEventListener("keydown", onKey);
            trigger?.focus();
        };
    }, [lightbox]);
    const bg = bgColors[index % bgColors.length];
    const rot = cardRotations[index % cardRotations.length];

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: index * 0.04,
                }}
                className="group rounded-[6px] p-4 m-4 md:m-0 transition-all duration-200 ease-out
                           hover:md:-translate-y-[5px] active:scale-[1.02]"
                style={{
                    backgroundColor: bg,
                    boxShadow: "2px 4px 12px rgba(0,0,0,0.07)",
                    rotate: `${rot}deg`,
                }}
            >
                {/* Project name + mood */}
                <div className="flex items-center gap-2 mb-1">
                    <button
                        onClick={() => onProjectClick(entry.project)}
                        className="font-sans font-medium text-left text-[14px] text-ink hover:text-accent transition-colors
                                   underline decoration-dotted underline-offset-2 decoration-ink/30 hover:decoration-accent/60"
                    >
                        {entry.project}
                    </button>
                    {entry.mood && (
                        <span
                            className="text-sm leading-none"
                            role="img"
                            aria-label={`mood: ${entry.mood}`}
                        >
                            {entry.mood}
                        </span>
                    )}
                </div>

                {/* Date */}
                <span className="font-hand text-mustard-text text-[12px] block mb-2">
                    {formatDate(entry.date)}
                </span>

                {/* Summary */}
                <p
                    className="font-sans text-ink leading-snug whitespace-pre-wrap max-w-xs md:max-w-none break-words overflow-hidden"
                    style={{ fontSize: "14px" }}
                >
                    <Linkify
                        options={{
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className:
                                "underline decoration-dotted hover:decoration-solid break-all [overflow-wrap:anywhere]",
                        }}
                    >
                        {entry.summary}
                    </Linkify>
                </p>

                {/* Images row */}
                {entry.images.length > 0 && (
                    <div
                        className="flex gap-1.5 mt-3"
                        style={{
                            maxWidth:
                                entry.images.length === 1 ? "60%" : "100%",
                        }}
                    >
                        {entry.images.map((src, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    triggerRef.current = e.currentTarget;
                                    setLightbox({
                                        src,
                                        alt: `${entry.project} log image ${i + 1}`,
                                    });
                                }}
                                className="flex-1 aspect-[4/3] overflow-hidden rounded-[4px] bg-ink/5
                                           transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-2
                                           focus-visible:outline-accent"
                                aria-label={`Enlarge ${entry.project} log image ${i + 1}`}
                            >
                                <img
                                    src={src}
                                    alt={`${entry.project} log image ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* TIL chips */}
                {entry.til.length > 0 && (
                    <div
                        className="mt-2.5 font-sans text-ink/70 leading-relaxed break-words"
                        style={{ fontSize: "11px" }}
                    >
                        <span className="font-medium">TIL: </span>
                        {entry.til.join(", ")}
                    </div>
                )}
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
                        onClick={closeLightbox}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image viewer"
                    >
                        <button
                            ref={closeRef}
                            type="button"
                            aria-label="Close image"
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Close
                        </button>
                        <motion.img
                            key={lightbox.src}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            src={lightbox.src}
                            alt={lightbox.alt}
                            className="max-w-full max-h-[90vh] object-contain rounded-[4px]"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
