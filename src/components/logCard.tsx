import { useState } from "react";
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
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
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
                            aria-label={`mood: ${entry.mood}`}
                        >
                            {entry.mood}
                        </span>
                    )}
                </div>

                {/* Date */}
                <span className="font-hand text-mustard text-[12px] block mb-2">
                    {formatDate(entry.date)}
                </span>

                {/* Summary */}
                <p
                    className="font-sans text-ink leading-snug whitespace-pre-wrap break-words"
                    style={{ fontSize: "14px" }}
                >
                    <Linkify
                        options={{
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className:
                                "underline decoration-dotted hover:decoration-solid",
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
                                onClick={() => setLightboxSrc(src)}
                                className="flex-1 aspect-[4/3] overflow-hidden rounded-[4px] bg-ink/5
                                           transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-2
                                           focus-visible:outline-accent"
                                aria-label="Open image"
                            >
                                <img
                                    src={src}
                                    alt={`Log image ${i + 1}`}
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
                        className="mt-2.5 font-sans text-ink/50 leading-relaxed break-words"
                        style={{ fontSize: "11px" }}
                    >
                        <span className="font-medium">TIL: </span>
                        {entry.til.join(", ")}
                    </div>
                )}
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxSrc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
                        onClick={() => setLightboxSrc(null)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setLightboxSrc(null);
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image lightbox"
                        tabIndex={0}
                    >
                        <motion.img
                            key={lightboxSrc}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            src={lightboxSrc}
                            alt="Enlarged log image"
                            className="max-w-full max-h-[90vh] object-contain rounded-[4px]"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
