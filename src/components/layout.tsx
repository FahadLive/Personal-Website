import { useEffect, useRef, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "./header";
import BackgroundDecorations from "./backgroundDecorations";
import CustomCursor from "./customCursor";

/** Moves focus to <main> and announces the new page title after client-side navigation. */
function RouteAnnouncer({ mainRef }: { mainRef: React.RefObject<HTMLElement | null> }) {
    const { pathname } = useLocation();
    const [message, setMessage] = useState("");
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        // Wait for the page (and its helmet title) to settle.
        const t = setTimeout(() => {
            mainRef.current?.focus({ preventScroll: true });
            setMessage(document.title);
        }, 300);
        return () => clearTimeout(t);
    }, [pathname, mainRef]);

    return (
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {message}
        </div>
    );
}

function Layout() {
    const mainRef = useRef<HTMLElement>(null);
    return (
        <div className="relative w-full min-w-0 min-h-dvh bg-surface">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded focus:bg-[var(--text)] focus:px-4 focus:py-2 focus:text-[var(--main)]"
            >
                Skip to content
            </a>
            <BackgroundDecorations />
            <Header />
            <CustomCursor />
            <main
                id="main"
                ref={mainRef}
                tabIndex={-1}
                className="grid z-[1] w-full min-w-0 outline-none"
            >
                <Outlet />
            </main>
            <RouteAnnouncer mainRef={mainRef} />
            <ScrollRestoration />
        </div>
    );
}

export default Layout;
