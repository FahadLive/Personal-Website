import { useRef, useEffect, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { HeatmapDay } from "../utils/buildLogParser";

interface BuildHeatmapProps {
    data: HeatmapDay[];
}

export default function BuildHeatmap({ data }: BuildHeatmapProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (data.length === 0 || !contentRef.current || !scrollRef.current)
            return;

        setReady(false);
        let scrolled = false;

        const scrollToEnd = () => {
            if (!scrollRef.current || !contentRef.current || scrolled) return;
            const contentWidth = contentRef.current.scrollWidth;
            const containerWidth = scrollRef.current.clientWidth;
            if (contentWidth > containerWidth) {
                scrollRef.current.scrollLeft = contentWidth - containerWidth;
                scrolled = true;
            }
            setReady(true); // unblock smooth scrolling either way, even if nothing to scroll
        };

        // Catch the case where it's already correctly sized
        scrollToEnd();

        // Catch later reflows (web fonts loading, etc.) without guessing a timeout
        const observer = new ResizeObserver(() => scrollToEnd());
        observer.observe(contentRef.current);

        return () => observer.disconnect();
    }, [data]);

    if (data.length === 0) {
        return (
            <p className="font-hand text-ink/40 text-[14px]">
                no entries yet — log your first build to start the streak
            </p>
        );
    }

    return (
        <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden"
            style={{
                width: "100%",
                maxWidth: "100%",
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorX: "contain",
                scrollBehavior: ready ? "smooth" : "auto",
            }}
        >
            <div ref={contentRef} style={{ width: "max-content" }}>
                <ActivityCalendar
                    data={data}
                    colorScheme="light"
                    blockSize={12}
                    blockMargin={3}
                    blockRadius={2}
                    fontSize={12}
                    showWeekdayLabels={["mon", "wed", "fri"]}
                    showTotalCount={false}
                    showColorLegend={false}
                    theme={{
                        light: [
                            "var(--color-bg-shade)",
                            "color-mix(in srgb, var(--color-mustard) 30%, var(--color-surface))",
                            "color-mix(in srgb, var(--color-mustard) 55%, var(--color-surface))",
                            "color-mix(in srgb, var(--color-accent) 70%, var(--color-surface))",
                            "var(--color-accent)",
                        ],
                        dark: [
                            "var(--color-bg-shade)",
                            "color-mix(in srgb, var(--color-mustard) 30%, var(--color-surface))",
                            "color-mix(in srgb, var(--color-mustard) 55%, var(--color-surface))",
                            "color-mix(in srgb, var(--color-accent) 70%, var(--color-surface))",
                            "var(--color-accent)",
                        ],
                    }}
                    labels={{
                        weekdays: [
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                        ],
                    }}
                />
            </div>
        </div>
    );
}
