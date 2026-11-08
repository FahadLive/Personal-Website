import type { ReactNode } from "react";
import { motion, useTransform } from "motion/react";
import { IconArrowDown } from "@tabler/icons-react";
import usePullToNavigate from "../hooks/usePullToNavigate";

interface PullToNavigateProps {
    to: string;
    children: ReactNode;
    className?: string;
    label?: string;
    readyLabel?: string;
}

function PullToNavigate({
    to,
    children,
    className,
    label = "keep exploring",
    readyLabel = "let go ✦",
}: PullToNavigateProps) {
    const { progress, ready, leaving } = usePullToNavigate({ to });

    const contentY = useTransform(progress, [0, 1], [0, -24]);
    const indicatorY = useTransform(progress, [0, 1], [24, -8]);
    const indicatorOpacity = useTransform(progress, [0, 0.15, 1], [0, 0.6, 1]);

    return (
        <motion.div
            className={className}
            style={{ y: contentY, overscrollBehaviorY: "contain" }}
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: 0.2 }}
        >
            {children}
            <motion.div
                aria-hidden
                className="pointer-events-none fixed bottom-6 left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center font-hand text-lg text-accent"
                style={{ y: indicatorY, opacity: indicatorOpacity }}
            >
                <motion.span
                    animate={{ rotate: ready ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <IconArrowDown size={22} stroke={1.5} />
                </motion.span>
                <span>{ready ? readyLabel : label}</span>
            </motion.div>
        </motion.div>
    );
}

export default PullToNavigate;
