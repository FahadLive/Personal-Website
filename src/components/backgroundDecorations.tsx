function Star() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 C13 8 16 11 21 12 C16 13 13 16 12 21 C11 16 8 13 3 12 C8 11 11 8 12 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CurlyArrow() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 18 Q10 14 18 6 M14 6 h6 v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WavyLines() {
  return (
    <svg width="60" height="16" viewBox="0 0 60 16" aria-hidden="true">
      <path
        d="M2 10 Q10 2 18 10 Q26 18 34 10 Q42 2 50 10 Q56 16 60 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Hatching() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" aria-hidden="true">
      <path
        d="M4 22 l8 -18 M10 26 l8 -18 M16 28 l8 -16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotCluster() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      <circle cx="13" cy="6" r="1.5" fill="currentColor" />
      <circle cx="9.5" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SmallCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 2 C15 0 19 5 17 11 C15 17 6 18 3 12 C0 6 4 2 10 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MaskingTape() {
  return (
    <svg width="40" height="22" viewBox="0 0 40 22" aria-hidden="true">
      <path
        d="M2 6 Q4 2 10 3 L28 2 Q33 3 36 6 L38 14 Q37 18 30 17 L10 18 Q5 18 3 15 Z"
        fill="currentColor"
        opacity="0.25"
      />
    </svg>
  );
}

function BackgroundDecorations() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none"
      aria-hidden="true"
      style={{ color: "#111" }}
    >
      <div className="absolute doodle-float opacity-[0.06] md:opacity-[0.10]" style={{ top: "18%", right: "8%" }}>
        <Star />
      </div>

      <div className="absolute hidden md:block md:opacity-[0.10]" style={{ top: "52%", right: "5%" }}>
        <CurlyArrow />
      </div>

      <div className="absolute hidden md:block md:opacity-[0.08]" style={{ bottom: "20%", left: "10%" }}>
        <WavyLines />
      </div>

      <div className="absolute hidden md:block md:opacity-[0.08]" style={{ bottom: "10%", left: "4%" }}>
        <Hatching />
      </div>

      <div className="absolute opacity-[0.06] md:opacity-[0.10]" style={{ top: "40%", left: "6%" }}>
        <DotCluster />
      </div>

      <div className="absolute hidden md:block doodle-float-slow md:opacity-[0.10]" style={{ top: "65%", left: "4%" }}>
        <SmallCircle />
      </div>

      <div className="absolute opacity-[0.06] md:opacity-[0.08]" style={{ top: "72%", left: "5%" }}>
        <MaskingTape />
      </div>
    </div>
  );
}

export default BackgroundDecorations;
