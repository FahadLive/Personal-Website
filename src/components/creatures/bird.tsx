import { useState } from "react";
import { motion } from "motion/react";

interface CreatureProps {
    className?: string;
    style?: React.CSSProperties;
}

function Bird({ className, style }: CreatureProps) {
    const [interacting, setInteracting] = useState(false);

    return (
        <motion.div
            className={`z-0 cursor-pointer select-none ${className ?? ""}`}
            style={style}
            role="button"
            tabIndex={0}
            aria-label="Tiny bird"
            onHoverStart={() => setInteracting(true)}
            onHoverEnd={() => setInteracting(false)}
            onTapStart={() => setInteracting(true)}
            onTapCancel={() => setInteracting(false)}
            onTap={() => setInteracting(false)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    setInteracting(true);
                }
            }}
            onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    setInteracting(false);
                }
            }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.img
                src={
                    interacting
                        ? "/doodles/birb-shy.webp"
                        : "/doodles/birb-chill.webp"
                }
                alt="Bird chilling"
                aria-hidden="true"
                draggable={false}
                className="w-14 h-auto"
                animate={{ scale: interacting ? 0.96 : 1 }}
                transition={{ duration: 0.15 }}
            />
        </motion.div>
    );
}

export default Bird;
