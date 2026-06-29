import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";

interface CreatureProps {
    className?: string;
    style?: React.CSSProperties;
}

function ChayaCup({ className, style }: CreatureProps) {
    const [tilted, setTilted] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const handleInteraction = useCallback(() => {
        setTilted(true);
        setTimeout(() => setTilted(false), 1500);
    }, []);

    const steamEnabled = !reducedMotion && !isMobile;

    return (
        <motion.div
            className={`z-0 cursor-pointer select-none ${className ?? ""}`}
            style={style}
            onTap={handleInteraction}
            onHoverStart={handleInteraction}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleInteraction();
            }}
            aria-label="Chaya cup — tap or hover to see steam"
        >
            <motion.svg
                width="28"
                height="36"
                viewBox="0 0 28 36"
                aria-hidden="true"
                animate={tilted ? { rotate: -15 } : { rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="origin-bottom"
            >
                {/* Glass body */}
                <path
                    d="M5 4 L4 32 Q4 34 6 34 L22 34 Q24 34 24 32 L23 4 Z"
                    fill="rgba(217, 164, 65, 0.8)"
                    stroke="#111"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                {/* Glass rim */}
                <path
                    d="M3 4 L25 4"
                    fill="none"
                    stroke="#111"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                {/* Liquid surface ellipse */}
                <ellipse
                    cx="14"
                    cy="6"
                    rx="9"
                    ry="2"
                    fill="rgba(217, 164, 65, 0.9)"
                    stroke="#111"
                    strokeWidth="1"
                />

                {/* Steam lines */}
                {steamEnabled && (
                    <>
                        <path
                            d="M10 1 Q8 -4 10 -8"
                            fill="none"
                            stroke="#111"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            className="steam-path steam-path-1"
                        />
                        <path
                            d="M18 1 Q16 -4 18 -8"
                            fill="none"
                            stroke="#111"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            className="steam-path steam-path-2"
                        />
                    </>
                )}
            </motion.svg>
        </motion.div>
    );
}

export default ChayaCup;
