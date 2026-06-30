import { useState } from "react";

export default function GearDoodle({ className = "" }: { className?: string }) {
    const [spinning, setSpinning] = useState(false);

    const handleClick = () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        setSpinning(true);
        setTimeout(() => setSpinning(false), 500);
    };

    return (
        <button
            onClick={handleClick}
            aria-label="Spin gear"
            className={`inline-flex items-center justify-center p-1 cursor-pointer bg-transparent border-none ${className}`}
        >
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    transform: spinning ? "rotate(360deg)" : "rotate(0deg)",
                    transition: spinning ? "transform 0.5s ease-in-out" : "none",
                }}
                className="text-accent/60 hover:text-accent transition-colors"
            >
                {/* Gear teeth */}
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="16" y1="3" x2="16" y2="7" />
                    <line x1="16" y1="25" x2="16" y2="29" />
                    <line x1="3" y1="16" x2="7" y2="16" />
                    <line x1="25" y1="16" x2="29" y2="16" />
                    <line x1="6.3" y1="6.3" x2="9.2" y2="9.2" />
                    <line x1="22.8" y1="22.8" x2="25.7" y2="25.7" />
                    <line x1="6.3" y1="25.7" x2="9.2" y2="22.8" />
                    <line x1="22.8" y1="9.2" x2="25.7" y2="6.3" />
                </g>
                {/* Inner circle */}
                <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
                {/* Center dot */}
                <circle cx="16" cy="16" r="2" fill="currentColor" />
            </svg>
        </button>
    );
}
