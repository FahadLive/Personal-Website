import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "link" | "image" | "creature";

const MODE_SIZES: Record<CursorMode, number> = {
  default: 12,
  link: 48,
  image: 48,
  creature: 48,
};

const MODE_LABELS: Record<CursorMode, string | null> = {
  default: null,
  link: null,
  image: "VIEW",
  creature: "\u{1F446}",
};

function CustomCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setIsFinePointer(fine);
    if (!fine) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const detectHover = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "[data-cursor], a, button, img, [role=button]",
      );
      if (!el) { setMode("default"); return; }
      const tag = el.tagName.toLowerCase();
      if (el.hasAttribute("data-cursor")) {
        setMode(el.getAttribute("data-cursor") as CursorMode);
      } else if (tag === "img") {
        setMode("image");
      } else if (tag === "a" || tag === "button" || el.getAttribute("role") === "button") {
        setMode("link");
      } else {
        setMode("default");
      }
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", detectHover);

    return () => {
      cancelAnimationFrame(raf.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", detectHover);
    };
  }, []);

  if (!isFinePointer) return null;

  const size = MODE_SIZES[mode];
  const label = MODE_LABELS[mode];

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[10000]"
      style={{
        transform: "translate(0, 0)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full border-[1.5px] border-[#111] transition-all duration-150 ease-out"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
      >
        {label && (
          <span className="text-[9px] font-bold text-[#111] tracking-wider select-none leading-none">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export default CustomCursor;
