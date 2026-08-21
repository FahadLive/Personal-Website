import React, { useState, useEffect } from "react";

interface TextTransitionProps {
    text: string;
    styleName?: string;
    delay?: number;
    characterCycleSpeed?: number;
    revealSpeed?: number;
    cycleCharacters?: string;
}

const TextTransition: React.FC<TextTransitionProps> = ({
    text,
    styleName = "",
    delay = 0,
    characterCycleSpeed = 10,
    revealSpeed = 8,
    cycleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
}) => {
    // Start fully populated at the target length so the element
    // never resizes after mount — no layout shift.
    const [displayedChars, setDisplayedChars] = useState<string[]>(() =>
        Array(text.length).fill("X"),
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    // Re-seed placeholders if the text prop itself changes length,
    // without ever dropping to an empty/short array.
    useEffect(() => {
        setDisplayedChars(Array(text.length).fill("X"));
        setCurrentIndex(0);
    }, [text]);

    // Start animation after delay
    useEffect(() => {
        const timer = setTimeout(() => {
            startAnimation();
        }, delay);
        return () => clearTimeout(timer);
    }, [delay, text]);

    const getRandomChar = () => {
        return cycleCharacters[
            Math.floor(Math.random() * cycleCharacters.length)
        ];
    };

    const startAnimation = () => {
        // Animate each character sequentially
        const animateCharacter = (index: number) => {
            if (index >= text.length) return;
            let counter = 0;
            const cycles = 5 + Math.floor(Math.random() * 5); // 5-10 cycles per character
            const cycleInterval = setInterval(() => {
                setDisplayedChars((prev) => {
                    const newChars = [...prev];
                    newChars[index] = getRandomChar();
                    return newChars;
                });
                counter++;
                if (counter >= cycles) {
                    clearInterval(cycleInterval);
                    // Set final character
                    setDisplayedChars((prev) => {
                        const newChars = [...prev];
                        newChars[index] = text[index];
                        return newChars;
                    });
                    // Move to next character after short pause
                    setTimeout(() => {
                        setCurrentIndex((prev) => prev + 1);
                        animateCharacter(index + 1);
                    }, revealSpeed);
                }
            }, characterCycleSpeed);
        };
        animateCharacter(0);
    };

    return (
        <div className={`text-transition-wrapper`}>
            {displayedChars.map((char, i) => (
                <span
                    key={i}
                    className={`transition-character ${styleName} ${i <= currentIndex ? "visible" : "hidden"}`}
                    style={{
                        display: "inline-block",
                        minWidth: "0.5em",
                        transition: "opacity 0.2s",
                    }}
                >
                    {char}
                </span>
            ))}
        </div>
    );
};

export default TextTransition;
