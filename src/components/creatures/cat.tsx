import { useState } from "react";
import { motion } from "motion/react";

interface CreatureProps {
    className?: string;
    style?: React.CSSProperties;
}

function Cat({ className, style }: CreatureProps) {
    const [interacting, setInteracting] = useState(false);

    return (
        <motion.div
            className={`z-0 cursor-pointer select-none ${className ?? ""}`}
            style={style}
            role="button"
            tabIndex={0}
            aria-label="Cat"
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
                        ? "/doodles/kitty-love.png"
                        : "/doodles/kitty-chill.png"
                }
                alt=""
                aria-hidden="true"
                draggable={false}
                className="w-9 h-auto"
                animate={{ scale: interacting ? 1.05 : 1 }}
                transition={{ duration: 0.15 }}
            />
        </motion.div>
    );
}

export default Cat;
