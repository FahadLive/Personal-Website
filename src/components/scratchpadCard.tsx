import { useCallback, useState } from "react";
import "./components.css";
interface ScratchpadCardProps {
    url: string;
    note: string;
    tags: string[];
    added: string;
    index: number;
    image?: string | null;
}

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

const polaroidVariants = [
    { rotate: -2, x: 6, y: 0 },
    { rotate: 2.5, x: -8, y: -7 },
    { rotate: -3, x: 0, y: -9 },
    { rotate: 1.5, x: -4, y: 0 },
    { rotate: -4, x: 8, y: -5 },
    { rotate: 3.5, x: -6, y: 0 },
];

function formatMonthStamp(dateStr: string): string {
    const [y, m] = dateStr.split("-").map(Number);
    return `${MONTHS[m - 1]} '${String(y).slice(2)}`;
}

function displayUrl(url: string): string {
    try {
        const u = new URL(url);
        const parts = u.pathname.split("/").filter(Boolean);
        return u.hostname + (parts[0] ? `/${parts[0]}` : "");
    } catch {
        return url;
    }
}

const bgColors = ["#FFFFFF", "#FFF9F0"];
const rotations = [-0.5, 0.3, -0.2, 0.6, -0.4, 0.2];

const faviconFallbacks = new Set<string>();

function ScratchpadCard({
    url,
    note,
    tags,
    added,
    index,
    image,
}: ScratchpadCardProps) {
    const displayTags = tags.slice(0, 3);
    const monthStamp = formatMonthStamp(added);
    const shortUrl = displayUrl(url);
    const bg = bgColors[index % bgColors.length];
    const rot = rotations[index % rotations.length];
    const [faviconOk, setFaviconOk] = useState(
        () => !faviconFallbacks.has(url),
    );

    const v = polaroidVariants[index % polaroidVariants.length];

    let hostname = "";
    try {
        hostname = new URL(url).hostname;
    } catch {
        /* skip */
    }

    const faviconSrc = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;

    const handleClick = useCallback(() => {
        window.open(url, "_blank", "noopener,noreferrer");
    }, [url]);

    return (
        <div
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClick();
            }}
            role="link"
            tabIndex={0}
            aria-label={`Link to ${shortUrl}: ${note}`}
            className="scratchpad-card group relative cursor-pointer rounded-[6px] p-4 transition-all duration-200 ease-out
                       hover:md:-translate-y-[5px] active:scale-[1.02]"
            style={{
                backgroundColor: bg,
                boxShadow: "2px 4px 12px rgba(0,0,0,0.07)",
                rotate: `${rot}deg`,
            }}
        >
            {/* Month stamp */}
            <span
                className="absolute top-3 right-3 font-hand text-mustard select-none"
                style={{ fontSize: "11px", lineHeight: 1 }}
            >
                {monthStamp}
            </span>

            {/* URL row */}
            <div className="flex items-center gap-1.5 pr-12">
                {/* Favicon preview */}
                {faviconOk && hostname && (
                    <img
                        src={faviconSrc}
                        alt=""
                        className="shrink-0 rounded-sm ring-1 ring-ink/10 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6"
                        style={{ width: 14, height: 14 }}
                        loading="lazy"
                        onError={() => {
                            faviconFallbacks.add(url);
                            setFaviconOk(false);
                        }}
                    />
                )}

                {/* Hostname with full-URL tooltip */}
                <span
                    className="font-hand text-ink/60 truncate"
                    style={{ fontSize: "14px" }}
                    title={url}
                >
                    {shortUrl}
                </span>

                {/* ↗ arrow */}
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="shrink-0 transition-all duration-300 ease-out
                               group-hover:md:opacity-100 group-focus-visible:opacity-100
                               opacity-60 group-hover:md:stroke-accent"
                    style={{
                        stroke: "currentColor",
                        strokeWidth: 1.5,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                    }}
                    aria-hidden="true"
                >
                    <path
                        d="M2 10 L10 2"
                        className="transition-all duration-300 ease-out"
                        style={{ strokeDasharray: 12, strokeDashoffset: 12 }}
                        onMouseEnter={(e) => {
                            if (window.matchMedia("(hover: hover)").matches) {
                                e.currentTarget.style.strokeDashoffset = "0";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (window.matchMedia("(hover: hover)").matches) {
                                e.currentTarget.style.strokeDashoffset = "12";
                            }
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.strokeDashoffset = "0";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.strokeDashoffset = "12";
                        }}
                    />
                    <path d="M4 2 L10 2 L10 8" />
                </svg>
            </div>

            {/* Preview image */}
            {image && (
                <div className="flex-1 border-y border-dashed border-accent/10 my-8">
                    <div
                        className="card-image-wrapper"
                        style={
                            {
                                "--pop-x": `${v.x}px`,
                                "--pop-rotate": `${v.rotate}deg`,
                                "--pop-y": `${v.y}px`,
                            } as React.CSSProperties
                        }
                    >
                        <img
                            src={image}
                            alt={`Preview for ${shortUrl}`}
                            className="card-image"
                            loading="lazy"
                        />
                    </div>
                </div>
            )}

            {/* Note */}
            <p
                className="font-sans text-ink mt-1.5 leading-snug"
                style={{ fontSize: "14px" }}
            >
                {note}
            </p>

            {/* Tag pills */}
            {displayTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {displayTags.map((tag) => (
                        <span
                            key={tag}
                            className="font-sans font-medium rounded-full px-2 py-0.5 text-ink/50"
                            style={{
                                fontSize: "11px",
                                lineHeight: 1.2,
                                backgroundColor: "rgba(17,17,17,0.05)",
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ScratchpadCard;
