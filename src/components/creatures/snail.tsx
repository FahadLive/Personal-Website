import { useState } from "react";
import { motion } from "motion/react";

interface CreatureProps {
  className?: string;
  style?: React.CSSProperties;
}

function Snail({ className, style }: CreatureProps) {
  const [crawling, setCrawling] = useState(false);

  return (
    <motion.div
      className={`z-0 cursor-pointer select-none ${className ?? ""}`}
      style={style}
      onTap={() => setCrawling(true)}
      onHoverStart={() => setCrawling(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setCrawling(true); }}
      aria-label="Snail"
    >
      <motion.svg
        width="32"
        height="18"
        viewBox="0 0 32 18"
        aria-hidden="true"
        animate={crawling ? { x: 40 } : { x: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onAnimationComplete={() => setCrawling(false)}
      >
        <path d="M4 14 Q10 17 20 14" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="9" r="6" fill="#111" />
        <path d="M10 5 Q14 9 10 13" fill="none" stroke="#FAF8F3" strokeWidth="1" strokeLinecap="round" />
        <path d="M5 14 L4 10" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 14 L7 11" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="4" cy="9.5" r="0.8" fill="#FAF8F3" />
      </motion.svg>
    </motion.div>
  );
}

export default Snail;
