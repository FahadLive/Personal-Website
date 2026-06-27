import { useState } from "react";
import { motion } from "motion/react";

interface CreatureProps {
  className?: string;
  style?: React.CSSProperties;
}

function Ghost({ className, style }: CreatureProps) {
  const [waving, setWaving] = useState(false);

  return (
    <motion.div
      className={`z-0 cursor-pointer select-none ${className ?? ""}`}
      style={style}
      onTap={() => setWaving(true)}
      onHoverStart={() => setWaving(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setWaving(true); }}
      aria-label="Friendly ghost"
    >
      <motion.svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        aria-hidden="true"
        animate={waving ? { rotate: [0, -8, 8, -4, 0] } : {}}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => setWaving(false)}
      >
        <path
          d="M5 4 Q5 0 12 0 Q19 0 19 4 L19 18 Q17 16 15 18 Q13 20 11 18 Q9 16 7 18 Q5 20 5 18 Z"
          fill="#111"
        />
        <circle cx="9" cy="6" r="1.5" fill="#FAF8F3" />
        <circle cx="15" cy="6" r="1.5" fill="#FAF8F3" />
        <motion.path
          d="M7 11 Q9 13 12 11"
          fill="none"
          stroke="#FAF8F3"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={waving ? { d: ["M7 11 Q9 13 12 11", "M7 11 Q10 14 13 11", "M7 11 Q9 13 12 11"] } : {}}
          transition={{ duration: 0.3 }}
        />
      </motion.svg>
    </motion.div>
  );
}

export default Ghost;
