import { load } from "js-yaml";
import { groupAndSort, GroupedEntry } from "./groupByMonth";

export interface LogEntry {
    date: string;
    project: string;
    summary: string;
    mood?: string | null;
    images: string[];
    til: string[];
}

export type LogGroup = GroupedEntry<LogEntry>;

export interface HeatmapDay {
    date: string;
    count: number;
    level: number;
}

export interface TilItem {
    date: string;
    project: string;
    text: string;
}

export async function getBuildLogGroups(): Promise<LogGroup[]> {
    const files = import.meta.glob("/content/log/*.yaml", {
        query: "?raw",
        import: "default",
    });
    const allEntries: LogEntry[] = [];
    for (const [path, loadFile] of Object.entries(files)) {
        const raw = (await loadFile()) as string;
        if (!raw?.trim()) continue; // empty file → skip, don't throw

        const parsed = load(raw);
        if (!Array.isArray(parsed)) {
            console.warn(
                `buildLogParser: ${path} did not parse to an array, skipping`,
            );
            continue;
        }
        allEntries.push(
            ...(parsed as LogEntry[]).map((e) => ({
                ...e,
                date:
                    e.date instanceof Date
                        ? e.date.toISOString().slice(0, 10)
                        : String(e.date),
            })),
        );
    }
    return groupAndSort(allEntries, "date");
}

function fillDateRange(dayCount: Map<string, number>): HeatmapDay[] {
    const dates = Array.from(dayCount.keys()).sort();
    if (dates.length === 0) return [];

    const year = Number(dates[0].slice(0, 4));
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(
        Date.UTC(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
        ),
    );

    const result: HeatmapDay[] = [];
    for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        const count = dayCount.get(key) ?? 0;
        result.push({
            date: key,
            count,
            level:
                count === 0
                    ? 0
                    : count === 1
                      ? 1
                      : count === 2
                        ? 2
                        : count === 3
                          ? 3
                          : 4,
        });
    }
    return result;
}

export async function getHeatmapData(): Promise<HeatmapDay[]> {
    const groups = await getBuildLogGroups();
    const dayCount = new Map<string, number>();

    for (const group of groups) {
        for (const entry of group.entries) {
            const key = entry.date;
            dayCount.set(key, (dayCount.get(key) ?? 0) + 1);
        }
    }

    return fillDateRange(dayCount);
}

export function getStreak(data: HeatmapDay[]): number {
    const activeDates = new Set(
        data.filter((d) => d.count > 0).map((d) => d.date),
    );

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const yesterdayStr = new Date(today.getTime() - 86400000)
        .toISOString()
        .slice(0, 10);

    let startDate = todayStr;
    if (activeDates.has(todayStr)) {
        startDate = todayStr;
    } else if (activeDates.has(yesterdayStr)) {
        startDate = yesterdayStr;
    } else {
        return 0;
    }

    let streak = 0;
    const current = new Date(startDate);

    while (activeDates.has(current.toISOString().slice(0, 10))) {
        streak++;
        current.setDate(current.getDate() - 1);
    }

    return streak;
}

export function getAllTilItems(groups: LogGroup[]): TilItem[] {
    const items: TilItem[] = [];
    for (const group of groups) {
        for (const entry of group.entries) {
            for (const text of entry.til) {
                items.push({ date: entry.date, project: entry.project, text });
            }
        }
    }
    return items;
}
