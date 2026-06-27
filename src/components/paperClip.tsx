import { useState, useCallback } from "react";

function PaperClip() {
  const [wiggling, setWiggling] = useState(false);

  const triggerWiggle = useCallback(() => {
    setWiggling(true);
    setTimeout(() => setWiggling(false), 500);
  }, []);

  return (
    <div
      className="fixed z-0 cursor-pointer select-none"
      style={{ top: "110px", right: "16px" }}
      onClick={triggerWiggle}
      onMouseEnter={triggerWiggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") triggerWiggle(); }}
      aria-label="Paper clip doodle"
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <svg
          width="22"
          height="26"
          viewBox="0 0 22 26"
          aria-hidden="true"
          className={`transition-transform duration-300 ${wiggling ? "doodle-wiggle" : ""}`}
        >
          <path
            d="M8 5 c0-4 6-4 6 0 c0 9-12 9-12 3 c0-7 12-9 14-1 c2 8-10 13-13 7"
            fill="none"
            stroke="#111"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default PaperClip;
