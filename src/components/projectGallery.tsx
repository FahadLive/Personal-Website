import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import useMediaQuery from "../hooks/useMediaQuery";

interface ProjectGalleryProps {
    images: string[];
    title: string;
}

/**
 * Sizing for any aspect ratio. Each image measures itself on load and sets --ar (width/height).
 * Height = min(max slot height, available width / ratio); aspect-ratio then derives the width,
 * so portrait, landscape and panoramic shots all fit fully (no crop, no letterbox, never wider
 * than the viewport).
 */
const SLOT_VARS = {
    "--gh": "min(62vh, 34rem)", // max image height
    "--gw": "calc(100vw - 4rem)", // max image width
} as React.CSSProperties;

function GalleryImage({
    src,
    alt,
    eager,
    className = "",
}: {
    src: string;
    alt: string;
    eager?: boolean;
    className?: string;
}) {
    const [ar, setAr] = useState(0.6); // placeholder until the real ratio is known
    return (
        <img
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onLoad={(e) => {
                const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                if (w && h) setAr(w / h);
            }}
            className={`block w-auto max-w-none rounded-md shadow-lg grain ${className}`}
            style={{
                ["--ar" as string]: ar,
                aspectRatio: "var(--ar)",
                height: "min(var(--gh), calc(var(--gw) / var(--ar)))",
            }}
        />
    );
}

const altFor = (title: string, i: number, total: number) =>
    `${title} screenshot ${i + 1} of ${total}`;

/** Mobile: native scroll-snap carousel (swipe), peeking next slide, counter. No autoplay. */
function SwipeGallery({ images, title }: ProjectGalleryProps) {
    const [active, setActive] = useState(0);
    const scroller = useRef<HTMLUListElement>(null);
    const raf = useRef(0);

    // Active slide = the one whose centre is closest to the scroller's left-aligned snap point.
    const onScroll = () => {
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
            const el = scroller.current;
            if (!el) return;
            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
            if (atEnd) return setActive(images.length - 1);
            let best = 0;
            let bestDist = Infinity;
            Array.from(el.children).forEach((child, i) => {
                const dist = Math.abs(
                    (child as HTMLElement).offsetLeft - 24 - el.scrollLeft,
                );
                if (dist < bestDist) {
                    bestDist = dist;
                    best = i;
                }
            });
            setActive(best);
        });
    };

    return (
        <div style={SLOT_VARS}>
            {/* Focusable scroll region: arrow keys scroll it natively. */}
            <ul
                ref={scroller}
                onScroll={onScroll}
                tabIndex={0}
                aria-label={`${title} screenshots, swipe or use arrow keys`}
                className="flex w-0 min-w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-6 py-3 scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tertiary)]"
            >
                {images.map((src, i) => (
                    <li key={src + i} className="shrink-0 snap-start">
                        <GalleryImage
                            src={src}
                            alt={altFor(title, i, images.length)}
                            eager={i === 0}
                        />
                    </li>
                ))}
            </ul>
            <p
                aria-hidden="true"
                className="mt-1 text-center font-hand text-base text-[var(--text)]/70"
            >
                {active + 1} / {images.length}
            </p>
        </div>
    );
}

/** Desktop: continuous linear marquee (CSS), pausable; static scroll strip for reduced motion. */
function MarqueeGallery({ images, title }: ProjectGalleryProps) {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
        return (
            <div
                className="flex gap-4 overflow-x-auto p-5"
                style={SLOT_VARS}
                tabIndex={0}
                role="region"
                aria-label={`${title} screenshots`}
            >
                {images.map((src, i) => (
                    <div key={src + i} className="shrink-0">
                        <GalleryImage
                            src={src}
                            alt={altFor(title, i, images.length)}
                            eager={i === 0}
                        />
                    </div>
                ))}
            </div>
        );
    }

    // Enough identical copies that the visible window never runs out; shifting by one copy loops seamlessly.
    const copies = Math.max(2, Math.ceil(8 / images.length));
    const duration = images.length * 7; // seconds per copy => constant speed regardless of count

    return (
        <div>
            <div
                className="gallery-marquee"
                style={
                    {
                        ...SLOT_VARS,
                        "--gh": "min(60vh, 32rem)",
                        "--gw": "min(calc(100vw - 6rem), 72rem)",
                        "--gallery-copies": copies,
                        "--gallery-duration": `${duration}s`,
                    } as React.CSSProperties
                }
            >
                <div className="gallery-track">
                    {Array.from({ length: copies }).map((_, copy) => (
                        <div
                            key={copy}
                            className="flex shrink-0"
                            // Copies after the first are loop duplicates: hide from assistive tech.
                            aria-hidden={copy > 0 ? true : undefined}
                            {...(copy > 0 ? { inert: true } : {})}
                        >
                            {images.map((src, i) => (
                                <div key={src + i} className="shrink-0 p-5">
                                    <GalleryImage
                                        src={src}
                                        alt={
                                            copy > 0
                                                ? ""
                                                : altFor(
                                                      title,
                                                      i,
                                                      images.length,
                                                  )
                                        }
                                        eager={copy === 0 && i === 0}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (images.length === 0) return null;

    if (images.length === 1) {
        return (
            <div className="flex justify-center p-3 md:p-5" style={SLOT_VARS}>
                <GalleryImage src={images[0]} alt={altFor(title, 0, 1)} eager />
            </div>
        );
    }

    return isDesktop ? (
        <MarqueeGallery images={images} title={title} />
    ) : (
        <SwipeGallery images={images} title={title} />
    );
}
