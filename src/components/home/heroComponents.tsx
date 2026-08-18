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
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
        >
            <img
                src="/fahads-photo.webp"
                alt="Mohammed Fahad"
                className="hero-portrait"
                style={maxWidth ? { maxWidth, width: "100%" } : undefined}
                draggable={false}
            />
        </motion.div>
    );
}
