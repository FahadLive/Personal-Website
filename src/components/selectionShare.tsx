import { IconCheck, IconCopy, IconShare2 } from "@tabler/icons-react";
import { useEffect, useRef, useState, useCallback } from "react";

interface SelectionShareProps {
    title: string;
    url: string;
}

function stripEmojis(str: string) {
    return str
        .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
}

function SelectionShare({ title, url }: SelectionShareProps) {
    const [show, setShow] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const btnRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<string>("");

    const checkSelection = useCallback(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) {
                setShow(false);
                return;
            }

            const text = sel.toString().trim();
            if (text.length < 10) {
                setShow(false);
                return;
            }

            let node: Node | null = sel.anchorNode;
            let insideBlog = false;
            while (node) {
                if (node instanceof HTMLElement) {
                    if (node.closest(".blog-content")) {
                        insideBlog = true;
                        break;
                    }
                    if (node === document.body) break;
                }
                node = node.parentNode;
            }
            if (!insideBlog) {
                setShow(false);
                return;
            }

            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            selectionRef.current = text;
            setPos({ x: rect.left + rect.width / 2, y: rect.top });
            setShow(true);
        }, 200);
    }, []);

    useEffect(() => {
        const onDown = (e: MouseEvent | TouchEvent) => {
            if (btnRef.current?.contains(e.target as Node)) return;
            setShow(false);
        };

        document.addEventListener("mouseup", checkSelection);
        document.addEventListener("touchend", checkSelection);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("touchstart", onDown);
        return () => {
            document.removeEventListener("mouseup", checkSelection);
            document.removeEventListener("touchend", checkSelection);
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("touchstart", onDown);
            clearTimeout(timer.current);
        };
    }, [checkSelection]);

    const handleShare = useCallback(async () => {
        const text = selectionRef.current;
        if (!text) return;

        const cleanTitle = stripEmojis(title);
        const message = `"${text}"\n\n— from ${cleanTitle}\n${url}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: cleanTitle,
                    text: message,
                    url,
                });
            } catch {
                /* user cancelled */
            }
        } else {
            window.open(
                `https://wa.me/?text=${encodeURIComponent(message)}`,
                "_blank",
            );
        }

        setShow(false);
        window.getSelection()?.removeAllRanges();
    }, [title, url]);

    const handleCopy = useCallback(async () => {
        const text = selectionRef.current;
        if (!text) return;

        const cleanTitle = stripEmojis(title);
        await navigator.clipboard.writeText(
            `"${text}"\n\n— from ${cleanTitle}\n${url}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [title, url]);

    if (!show) return null;

    return (
        <div
            className="fixed z-50 select-none"
            style={{
                left: pos.x,
                top: pos.y - 8,
                transform: "translate(-50%, -100%)",
            }}
        >
            <div
                ref={btnRef}
                className="flex items-center gap-1 p-1 bg-[var(--tertiary)] rounded-lg shadow-lg"
            >
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded-md hover:brightness-90 transition-all active:scale-95"
                >
                    <IconShare2 />
                    Share
                </button>
                <div className="w-px h-5 bg-white/20" />
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded-md hover:brightness-90 transition-all active:scale-95"
                >
                    {copied ? <IconCheck /> : <IconCopy />}
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            {/* arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-[var(--tertiary)] rotate-45 rounded-sm" />
        </div>
    );
}

export default SelectionShare;
