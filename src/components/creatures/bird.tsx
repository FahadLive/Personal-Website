import { useState } from "react";
import { motion } from "motion/react";

interface CreatureProps {
  className?: string;
  style?: React.CSSProperties;
}

function Bird({ className, style }: CreatureProps) {
  const [flapping, setFlapping] = useState(false);

  return (
    <motion.div
      className={`z-0 cursor-pointer select-none ${className ?? ""}`}
      style={style}
      onTap={() => setFlapping(true)}
      onHoverStart={() => setFlapping(true)}
      onAnimationComplete={() => setFlapping(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setFlapping(true); }}
      aria-label="Tiny bird"
    >
      <svg width="28" height="22" viewBox="0 0 28 22" aria-hidden="true">
        <circle cx="13" cy="13" r="6" fill="#111" />
        <circle cx="20" cy="10" r="3.5" fill="#111" />
        <path d="M23 9 L27 10 L23 11" fill="#111" />
        <path d="M6 13 L3 10 L4 15" fill="#111" />
        <motion.path
          d="M8 11 Q13 5 17 11"
          fill="none"
          stroke="#111"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={flapping ? { d: ["M8 11 Q13 5 17 11", "M8 8 Q13 2 17 8", "M8 11 Q13 5 17 11"] } : {}}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </motion.div>
  );
}

export default Bird;
