export interface GroupedEntry<T> {
    monthKey: string;
    monthLabel: string;
    entries: T[];
}

function formatMonthLabel(key: string): string {
    const [year, month] = key.split("-");
    return new Date(+year, +month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
    });
}

function resolveDate(val: unknown): string {
    if (val instanceof Date) return val.toISOString().slice(0, 10);
    return String(val ?? "");
}

export function groupAndSort<T>(
    entries: T[],
    dateField: keyof T,
): GroupedEntry<T>[] {
    const groups = new Map<string, T[]>();

    for (const entry of entries) {
        const raw = resolveDate(entry[dateField]);
        const key = raw.slice(0, 7);
        if (!key) continue;
        const list = groups.get(key) ?? [];
        list.push(entry);
        groups.set(key, list);
    }

    return Array.from(groups.entries())
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([key, entries]) => ({
            monthKey: key,
            monthLabel: formatMonthLabel(key),
            entries: entries.sort((a, b) =>
                resolveDate(b[dateField]).localeCompare(resolveDate(a[dateField])),
            ),
        }));
}
