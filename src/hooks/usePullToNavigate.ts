import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animate, useMotionValue, useReducedMotion } from "motion/react";

interface Options {
    to: string;
    /** Resisted pull distance (px) needed to trigger navigation. */
    threshold?: number;
    from?: string;
}

const RESISTANCE = 0.5;
const IDLE_RESET_MS = 150;
const LEAVE_MS = 220;

function atScrollBoundary() {
    const el = document.documentElement;
    return el.scrollHeight - window.innerHeight <= 1 || window.scrollY + window.innerHeight >= el.scrollHeight - 1;
}

function isTypingTarget(target: EventTarget | null) {
    const el = target as HTMLElement | null;
    if (!el) return false;
    return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

/**
 * Overscroll navigation: pulling past the bottom of a page that cannot scroll
 * further (wheel, trackpad, touch swipe up, or ArrowDown/PageDown/Space)
 * navigates to `to`. Returns a 0..1 `progress` MotionValue plus `ready` and
 * `leaving` flags for rendering feedback.
 */
export default function usePullToNavigate({ to, threshold = 100, from = "/" }: Options) {
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();
    const progress = useMotionValue(0);
    const [ready, setReady] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const triggered = useRef(false);

    useEffect(() => {
        triggered.current = false;
        let raw = 0;
        let idleTimer: ReturnType<typeof setTimeout> | undefined;
        let leaveTimer: ReturnType<typeof setTimeout> | undefined;
        let touchStartY: number | null = null;
        let isReady = false;

        const setPull = (value: number) => {
            raw = Math.max(0, value);
            const p = Math.min((raw * RESISTANCE) / threshold, 1);
            progress.set(p);
            const nowReady = p >= 1;
            if (nowReady !== isReady) {
                isReady = nowReady;
                setReady(nowReady);
            }
        };

        const reset = () => {
            raw = 0;
            if (isReady) {
                isReady = false;
                setReady(false);
            }
            if (reduceMotion) progress.set(0);
            else animate(progress, 0, { type: "spring", stiffness: 300, damping: 30 });
        };

        const trigger = () => {
            if (triggered.current) return;
            triggered.current = true;
            setLeaving(true);
            leaveTimer = setTimeout(() => navigate(to, { state: { from } }), reduceMotion ? 0 : LEAVE_MS);
        };

        const onWheel = (e: WheelEvent) => {
            if (triggered.current) return;
            if (e.deltaY < 0) {
                if (raw > 0) setPull(raw + e.deltaY);
                return;
            }
            if (!atScrollBoundary() && raw === 0) return;
            e.preventDefault();
            setPull(raw + e.deltaY);
            if (raw * RESISTANCE >= threshold) {
                trigger();
                return;
            }
            clearTimeout(idleTimer);
            idleTimer = setTimeout(reset, IDLE_RESET_MS);
        };

        const onTouchStart = (e: TouchEvent) => {
            touchStartY = atScrollBoundary() ? e.touches[0].clientY : null;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (touchStartY === null || triggered.current) return;
            const dy = touchStartY - e.touches[0].clientY;
            if (dy <= 0) {
                if (raw > 0) setPull(0);
                return;
            }
            if (e.cancelable) e.preventDefault();
            setPull(dy);
        };

        const onTouchEnd = () => {
            if (touchStartY === null) return;
            touchStartY = null;
            if (raw * RESISTANCE >= threshold) trigger();
            else reset();
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
            if (isTypingTarget(e.target)) return;
            if (!["ArrowDown", "PageDown", " "].includes(e.key)) return;
            const el = e.target as HTMLElement;
            if (e.key === " " && ["BUTTON", "A", "SUMMARY"].includes(el?.tagName)) return;
            if (!atScrollBoundary()) return;
            e.preventDefault();
            trigger();
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("touchcancel", onTouchEnd);
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
            window.removeEventListener("keydown", onKeyDown);
            clearTimeout(idleTimer);
            clearTimeout(leaveTimer);
            progress.set(0);
        };
    }, [to, from, threshold, navigate, progress, reduceMotion]);

    return { progress, ready, leaving };
}
