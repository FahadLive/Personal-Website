import { load } from "js-yaml";

export interface ScratchpadEntry {
    url: string;
    note: string;
    tags: string[];
    added: string;
}

export interface ScratchpadGroup {
    monthKey: string;
    monthLabel: string;
    entries: ScratchpadEntry[];
}

function formatMonthLabel(key: string): string {
    const [year, month] = key.split("-");
    return new Date(+year, +month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
    });
}

export async function getScratchpadGroups(): Promise<ScratchpadGroup[]> {
    const files = import.meta.glob("/content/scratchpad/*.yaml", {
        query: "?raw",
        import: "default",
    });

    const results: { key: string; entries: ScratchpadEntry[] }[] = [];

    for (const [path, loadFile] of Object.entries(files)) {
        const raw = (await loadFile()) as string;
        const entries = load(raw) as ScratchpadEntry[];
        const key = path.match(/(\d{4}-\d{2})\.yaml$/)?.[1] ?? "";
        results.push({ key, entries });
    }

    results.sort((a, b) => b.key.localeCompare(a.key));

    return results.map(({ key, entries }) => ({
        monthKey: key,
        monthLabel: formatMonthLabel(key),
        entries: entries.sort((a, b) => b.added.localeCompare(a.added)),
    }));
}
