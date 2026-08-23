import manifest from "../generated/contentManifest.json";
import { groupAndSort, GroupedEntry } from "./groupByMonth";

export interface ScratchpadEntry {
    url: string;
    note: string;
    tags: string[];
    added: string;
    image?: string | null;
}

export type ScratchpadGroup = GroupedEntry<ScratchpadEntry>;

export function getScratchpadGroups(): ScratchpadGroup[] {
    const entries = manifest.scratchpad as ScratchpadEntry[];
    return groupAndSort(entries, "added");
}
