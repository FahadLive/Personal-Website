import { load } from "js-yaml";
import { groupAndSort, GroupedEntry } from "./groupByMonth";

export interface ScratchpadEntry {
    url: string;
    note: string;
    tags: string[];
    added: string;
    image?: string | null;
}

export type ScratchpadGroup = GroupedEntry<ScratchpadEntry>;

export async function getScratchpadGroups(): Promise<ScratchpadGroup[]> {
    const files = import.meta.glob("/content/scratchpad/*.yaml", {
        query: "?raw",
        import: "default",
    });

    const allEntries: ScratchpadEntry[] = [];

    for (const [path, loadFile] of Object.entries(files)) {
        const raw = (await loadFile()) as string;
        const entries = load(raw) as ScratchpadEntry[];
        allEntries.push(...entries);
    }

    return groupAndSort(allEntries, "added");
}
