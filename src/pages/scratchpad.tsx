import { motion } from "motion/react";
import MetaComponent from "../components/meta";
import ScratchpadCard from "../components/scratchpadCard";
import ChayaCup from "../components/creatures/chayaCup";
import { getScratchpadGroups } from "../utils/scratchpadParser";

const rotations = [-0.5, 0.3, -0.2, 0.6, -0.4, 0.2];

const ScratchpadPage: React.FC = () => {
    const groups = getScratchpadGroups();

    // Flatten groups into a renderable list of dividers + entries
    const items = groups.flatMap((group) => [
        {
            type: "divider" as const,
            key: group.monthKey,
            label: group.monthLabel,
        },
        ...group.entries.map((entry, i) => ({
            type: "entry" as const,
            key: `${entry.url}-${entry.added}`,
            entry,
            index: i,
        })),
    ]);

    // Pre-compute global index for rotation + stagger
    let entryCounter = 0;

    return (
        <>
            <MetaComponent
                pageTitle="Scratchpad"
                pageDescription="Links and notes from Fahad's browser tabs."
            />
            <div className="relative min-h-dvh p-8 pt-28">
                <div className="columns-1 md:columns-2 xl:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6 [&>*]:break-inside-avoid">
                    {items.map((item) => {
                        if (item.type === "divider") {
                            return (
                                <motion.div
                                    key={item.key}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-3 w-full font-hand text-[15px] text-accent mt-6 mb-1 break-inside-avoid"
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
                            <motion.div
                                key={item.key}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeOut",
                                    delay: globalIndex * 0.05,
                                }}
                                style={{
                                    transform: `rotate(${rotations[globalIndex % rotations.length]}deg)`,
                                }}
                            >
                                <ScratchpadCard
                                    url={item.entry.url}
                                    note={item.entry.note}
                                    tags={item.entry.tags}
                                    added={item.entry.added}
                                    image={item.entry.image}
                                    index={globalIndex}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                <ChayaCup className="absolute right-4 bottom-4" />
            </div>
        </>
    );
};

export default ScratchpadPage;
