import { useState } from "react";
import { motion } from "motion/react";

interface CreatureProps {
  className?: string;
  style?: React.CSSProperties;
}

function Cat({ className, style }: CreatureProps) {
  const [waking, setWaking] = useState(false);

  return (
    <motion.div
      className={`z-0 cursor-pointer select-none ${className ?? ""}`}
      style={style}
      onTap={() => setWaking(true)}
      onHoverStart={() => setWaking(true)}
      onAnimationComplete={() => setWaking(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setWaking(true); }}
      aria-label="Sleeping cat"
    >
      <svg width="36" height="20" viewBox="0 0 36 20" aria-hidden="true">
        <motion.ellipse
          cx="16"
          cy="12"
          rx="11"
          ry="6"
          fill="#111"
          animate={waking ? { rx: 12, ry: 5 } : {}}
          transition={{ duration: 0.4 }}
        />
        <path d="M6 8 L4 4 L8 7" fill="#111" />
        <path d="M22 8 L24 4 L26 7" fill="#111" />
        <motion.path
          d="M27 14 Q32 10 30 8"
          fill="none"
          stroke="#111"
          strokeWidth="2"
          strokeLinecap="round"
          animate={waking ? { d: ["M27 14 Q32 10 30 8", "M27 14 Q33 8 31 6", "M27 14 Q32 10 30 8"] } : {}}
          transition={{ duration: 0.5 }}
        />
        <motion.circle
          cx="13"
          cy="10"
          r="1.2"
          fill="#FAF8F3"
          animate={waking ? { scale: [0, 1, 0] } : { scale: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle
          cx="19"
          cy="10"
          r="1.2"
          fill="#FAF8F3"
          animate={waking ? { scale: [0, 1, 0] } : { scale: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      </svg>
    </motion.div>
  );
}

export default Cat;
