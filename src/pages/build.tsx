import { useEffect, useState } from "react";
import { motion } from "motion/react";
import MetaComponent from "../components/meta";
import BuildHeatmap from "../components/buildHeatmap";
import LogCard from "../components/logCard";
import ForkCta from "../components/forkCta";
import {
    getBuildLogGroups,
    getHeatmapData,
    getStreak,
    HeatmapDay,
    LogGroup,
} from "../utils/buildLogParser";

export default function BuildPage() {
    const [groups, setGroups] = useState<LogGroup[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);
    const [streak, setStreak] = useState(0);
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getBuildLogGroups(), getHeatmapData()])
            .then(([g, h]) => {
                setGroups(g);
                setHeatmapData(h);
                setStreak(getStreak(h));
            })
            .catch((err) => {
                console.error("build log load failed:", err);
            });
    }, []);

    // Collect unique project names for filter debugging
    const projects = new Set<string>();
    for (const group of groups) {
        for (const entry of group.entries) {
            projects.add(entry.project);
        }
    }

    const items = groups.flatMap((group) => [
        {
            type: "divider" as const,
            key: group.monthKey,
            label: group.monthLabel,
        },
        ...group.entries
            .filter((e) => !filter || e.project === filter)
            .map((entry, i) => ({
                type: "entry" as const,
                key: `${entry.date}-${entry.project}-${i}`,
                entry,
                index: i,
            })),
    ]);

    let entryCounter = 0;

    return (
        <>
            <MetaComponent
                pageTitle="Build Log"
                pageDescription="What Fahad is building, documented as it happens."
            />
            <div className="min-h-dvh p-6 pt-28 max-w-3xl mx-auto overflow-x-hidden">
                {/* Heading */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <h1
                            className="font-hand text-ink"
                            style={{
                                fontSize: "clamp(36px, 8vw, 52px)",
                                lineHeight: 1.1,
                            }}
                        >
                            build in public
                        </h1>
                        <p className="font-hand text-ink/50 text-[16px] mt-1">
                            documenting what i make, as i make it
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {streak > 0 && (
                            <span
                                className="font-sans font-medium text-[13px] text-ink rounded-full px-3 py-1"
                                style={{
                                    backgroundColor: "rgba(217,164,65,0.15)",
                                }}
                            >
                                streak: {streak}🔥
                            </span>
                        )}
                    </div>
                </div>

                {/* Heatmap */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mt-8 min-w-0 max-w-[calc(100vw-3rem)]"
                >
                    <BuildHeatmap data={heatmapData} />
                </motion.div>

                {/* Filter hint */}
                {filter && (
                    <div className="mt-6 flex items-center gap-2">
                        <span className="font-sans text-[13px] text-ink/50">
                            filtered:{" "}
                            <strong className="text-ink">{filter}</strong>
                        </span>
                        <button
                            onClick={() => setFilter(null)}
                            className="font-sans text-[12px] text-accent underline underline-offset-2"
                        >
                            clear
                        </button>
                    </div>
                )}

                {/* Log list — masonry */}
                <div className="columns-1 md:columns-2 gap-4 md:gap-6 mt-6 [&>*]:break-inside-avoid">
                    {items.map((item) => {
                        if (item.type === "divider") {
                            return (
                                <motion.div
                                    key={item.key}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-3 w-full font-hand text-[15px] text-accent mt-6 mb-1"
                                >
                                    <span className="shrink-0">
                                        ── {item.label}
                                    </span>
                                    <span className="flex-1 border-t border-dashed border-accent/30" />
                                </motion.div>
                            );
                        }

                        const globalIndex = entryCounter++;

                        return (
                            <LogCard
                                key={item.key}
                                entry={item.entry}
                                index={globalIndex}
                                onProjectClick={(p) =>
                                    setFilter((prev) => (prev === p ? null : p))
                                }
                            />
                        );
                    })}
                </div>

                {/* Fork CTA */}
                <ForkCta />
            </div>
        </>
    );
}
