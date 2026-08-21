import "../../pages/page.css";

import { motion } from "motion/react";
import TextTransition from "../transitionText";

export function HeroName() {
    return (
        <div>
            <TextTransition
                styleName="hero-name"
                text="MOHAMMED"
                characterCycleSpeed={6}
                revealSpeed={4}
            />
            <TextTransition
                styleName="hero-name"
                text="FAHAD"
                characterCycleSpeed={6}
                revealSpeed={4}
            />
        </div>
    );
}

export function HeroPortrait({ maxWidth }: { maxWidth?: string }) {
    return (
        <motion.div
            className="flex w-full justify-center md:justify-end md:p-5"
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
        >
            <img
                src="/fahads-photo.webp"
                alt="Mohammed Fahad"
                className="hero-portrait"
                style={maxWidth ? { maxWidth, width: "100%" } : undefined}
                draggable={false}
                fetchPriority="high"
                loading="eager"
            />
        </motion.div>
    );
}
