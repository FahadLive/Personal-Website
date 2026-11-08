import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import usePullToNavigate from "../hooks/usePullToNavigate";

interface PullToNavigateProps {
    to: string;
    children: ReactNode;
    className?: string;
    label?: string;
    readyLabel?: string;
}

const READY_HOLD_MS = 1200;

function PullToNavigate({
    to,
    children,
    className,
    label = "keep exploring",
    readyLabel = "let go ✦",
}: PullToNavigateProps) {
    const { progress, ready, leaving } = usePullToNavigate({ to });
    const reduceMotion = useReducedMotion();

    const [holding, setHolding] = useState(false);
    const holdTimer = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!ready) return;
        setHolding(true);
        window.clearTimeout(holdTimer.current);
        holdTimer.current = window.setTimeout(
            () => setHolding(false),
            READY_HOLD_MS,
        );
    }, [ready]);

    useEffect(() => () => window.clearTimeout(holdTimer.current), []);

    const showReady = ready || holding;

    // Content lifts away to reveal the sunrise, so nothing is drawn over it.
    const contentY = useTransform(
        progress,
        [0, 1],
        [0, reduceMotion ? 0 : -100],
    );
    const sunY = useTransform(progress, [0, 1], ["100%", "0%"]);
    const sunScale = useTransform(progress, [0, 1], [0.8, 1]);
    const sunOpacity = useTransform(progress, [0, 0.2, 1], [0, 0.45, 0.9]);

    return (
        <>
            <motion.div
                aria-hidden
                className="pointer-events-none fixed inset-x-0 bottom-0 z-0 mx-auto flex h-[80px] w-[min(620px,100%)] items-end justify-center overflow-hidden will-change-[transform,opacity]"
                style={{
                    y: reduceMotion ? 0 : sunY,
                    scale: reduceMotion ? 1 : sunScale,
                    opacity: sunOpacity,
                    borderRadius: "9999px 9999px 0 0",
                    transformOrigin: "50% 100%",
                }}
                animate={{
                    filter:
                        showReady && !reduceMotion
                            ? "saturate(1.3) brightness(1.08)"
                            : "saturate(1) brightness(1)",
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <span className="absolute inset-x-0 top-2 text-center font-hand text-xl text-amber-700 opacity-70">
                    {showReady ? readyLabel : label}
                </span>
            </motion.div>
            <motion.div
                className={className}
                style={{ y: contentY, overscrollBehaviorY: "contain" }}
                animate={{ opacity: leaving ? 0 : 1 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.div>
        </>
    );
}

export default PullToNavigate;
