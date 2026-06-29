# Scratchpad — AI Agent Spec

**Feature:** Scratchpad page for justfahad.me  
**Design Direction:** "Browsing with Chaya" — margin notes made public  
**Version:** 1.0  
**Parent Spec:** Portfolio Redesign v2.0 (inherit all tokens, motion, and typography)

---

## 1. Mission Statement

A lightweight, high-frequency public log of links and thoughts Fahad finds cool. Feels like someone left their browser tabs open as sticky notes on a corkboard. More casual and raw than blogs or projects — no cover images, no long-form writing, just a URL, a note, and a tag.

**Mood:** Browsing with chaya (mallu tea) in hand — warm, unhurried, personal  
**Anti-targets:** ❌ News feed ❌ Bookmark manager ❌ Product hunt clone

---

## 2. Data Source

Content lives in monthly YAML files at:

```
content/
  scratchpad/
    2026-06.yaml
    2026-07.yaml
    ...
```

### Entry schema

```yaml
- url: https://example.com
  note: Short thought about why this is cool
  tags: [design, tools]
  added: 2026-06-14
```

| Field   | Type       | Required | Notes                              |
| ------- | ---------- | -------- | ---------------------------------- |
| `url`   | string     | ✅       | Full URL                           |
| `note`  | string     | ✅       | 1–3 sentences max                  |
| `tags`  | string[]   | ✅       | 1–3 tags, lowercase                |
| `added` | YYYY-MM-DD | ✅       | Used for month grouping and stamps |

### Parser behaviour

- Load all YAML files at build time (or runtime via `import.meta.glob` in Vite)
- Group entries by `YYYY-MM` derived from `added`
- Sort months descending (newest first), entries within each month descending by `added`
- Expose grouped structure to the page component

---

## 3. Page Route

`/scratchpad` — add to React Router config and desktop nav (between `blogs` and the GitHub button).

---

## 4. Design Tokens

Inherit all tokens from `src/index.css` `@theme` block. No new color tokens. Scratchpad-specific usage:

| Token             | Usage in Scratchpad                     |
| ----------------- | --------------------------------------- |
| `--color-surface` | Page background (`#FAF8F3`)             |
| `--color-accent`  | Month divider text, `↗` arrow on hover  |
| `--color-mustard` | Month stamp in card corner (`Jun '26`)  |
| `--color-ink`     | Note body text                          |
| `--font-hand`     | URL display, month divider, month stamp |
| `--font-sans`     | Note text, tag pills                    |

---

## 5. Layout

### 5.1 Page structure

```
┌─────────────────────────────────────────┐
│  [sticky header — inherited]            │
├─────────────────────────────────────────┤
│                                         │
│  scratchpad          [tea creature →]   │  ← page heading area
│  things i found cool                    │    heading: font-hand, 28px mobile
│                                         │
│  ── June 2026 ──────────────────────    │  ← month divider
│                                         │
│  [card]  [card]                         │
│  [card]  [card]  [card]                 │
│                                         │
│  ── May 2026 ───────────────────────    │
│                                         │
│  [card]  [card]                         │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 Grid

Same masonry pattern as `BlogsListPage`:

```tsx
<div className="columns-1 md:columns-2 xl:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6 [&>*]:break-inside-avoid">
```

Cards are narrower feel than blog cards — achieve this via tighter internal padding (`p-4` vs `p-5`).

### 5.3 Month divider

Rendered as a full-width `break-inside-avoid` block inside the masonry flow — it will naturally break columns above it.

```
── June 2026 ──────────────────────────────
```

- Font: `font-hand`, `15px`, color `--color-accent`
- The dashes are actual characters (`──`) with a `flex-grow` rule for the trailing line
- `mb-2 mt-6` spacing above/below
- No border — the dashes ARE the visual

```tsx
<div className="flex items-center gap-3 w-full col-span-full font-hand text-[15px] text-accent mt-6 mb-2">
    <span className="shrink-0">── {monthLabel}</span>
    <span className="flex-1 border-t border-dashed border-accent/30" />
</div>
```

---

## 6. Card Component — `ScratchpadCard`

### 6.1 Visual anatomy

```
┌──────────────────────────────┐
│                    Jun '26   │  ← month stamp, font-hand, mustard, 12px, top-right
│                              │
│  example.com/path/to/thing ↗ │  ← URL display, font-hand, 14px, ink/60, truncated
│                              │
│  Short note about why this   │  ← note text, font-sans, 14px, ink, 2–3 lines
│  is cool or interesting.     │
│                              │
│  [design]  [tools]           │  ← tag pills
└──────────────────────────────┘
```

### 6.2 Card styles

| Property         | Value                                             |
| ---------------- | ------------------------------------------------- |
| Background       | `#FFFFFF` alternating with `#FFF9F0` (by index)   |
| Border           | none                                              |
| Box shadow       | `2px 4px 12px rgba(0,0,0,0.07)`                   |
| Border radius    | `6px`                                             |
| Padding          | `p-4` (16px)                                      |
| Mobile rotation  | `0deg`                                            |
| Desktop rotation | alternates `[-0.5, 0.3, -0.2, 0.6, -0.4, 0.2]deg` |
| Cursor           | `cursor-pointer`                                  |

Cards look like torn paper slips — small, dense, no wasted space.

### 6.3 URL display

- Show only the hostname + first path segment: `example.com/path` (strip protocol, trailing slashes, long paths)
- Font: `font-hand`, `14px`, `color: ink/60`
- `↗` arrow sits inline after the URL text
- The `↗` is an SVG with `stroke-dashoffset` draw animation — draws in on hover/focus, static (fully drawn) on mobile

```tsx
// URL truncation helper
const displayUrl = (url: string) => {
    try {
        const u = new URL(url);
        const parts = u.pathname.split("/").filter(Boolean);
        return u.hostname + (parts[0] ? `/${parts[0]}` : "");
    } catch {
        return url;
    }
};
```

### 6.4 Month stamp

- Content: `Jun '26` (abbreviated month + 2-digit year)
- Font: `font-hand`, `11px`, `color: mustard`
- Position: `absolute top-3 right-3`
- Card wrapper needs `relative`

### 6.5 Tag pills

- Font: `font-sans`, `11px`, `font-medium`
- Background: `bg-ink/5`, `text-ink/50`
- Border radius: `rounded-full`
- Padding: `px-2 py-0.5`
- Gap: `gap-1.5`, `flex-wrap`
- Max 3 tags shown; if more, silently truncate (no "+N more")

### 6.6 Interactions

**Mobile (tap):**

- `scale(1.02)` + shadow increase, `150ms ease`
- Whole card is tappable — `onClick` opens `url` in new tab

**Desktop (hover):**

- `translateY(-5px)` + shadow `4px 12px 28px rgba(0,0,0,0.12)`, `200ms ease`
- `↗` SVG arrow draws in (`stroke-dashoffset: length → 0`, `300ms`)
- Rotation settles slightly on hover (add `0.5deg` to current rotation)

**Focus:**

- Keyboard focus ring: `outline: 2px solid var(--color-accent)`, `outline-offset: 2px`
- Arrow draws in on focus (same as hover)

### 6.7 Component interface

```tsx
interface ScratchpadCardProps {
    url: string;
    note: string;
    tags: string[];
    added: string; // YYYY-MM-DD
    index: number; // for rotation + bg alternation
}
```

---

## 7. Page Heading

```
scratchpad
things i found cool while drinking chai ↓
```

- `scratchpad`: `font-hand`, `clamp(36px, 8vw, 52px)`, `color: ink`
- Subtitle: `font-hand`, `16px`, `color: ink/50`
- Left-aligned, `mb-8`
- No serif float or layering (this section is already casual — don't overdo it)

---

## 8. Tea Creature — `ChayaCup`

A tiny steaming glass of tea (mallu cutting chai — the small cylindrical glass, not a mug). Replaces the coffee cup idea.

### 8.1 SVG description

- A short cylindrical glass (`~28×36px` viewBox)
- Amber/brown liquid fill (use `--color-mustard` at 80% opacity)
- Two small wavy steam lines rising from the top (SVG `path` with animate)
- No handle (cutting chai glass style — bare glass)
- Simple line-art style, stroke-only, `stroke: var(--color-ink)`, `stroke-width: 1.5`

### 8.2 Steam animation

```css
/* Steam lines: offset upward, fade in/out, loop */
@keyframes steam {
    0% {
        transform: translateY(0) scaleX(1);
        opacity: 0;
    }
    30% {
        opacity: 0.6;
    }
    70% {
        opacity: 0.4;
    }
    100% {
        transform: translateY(-8px) scaleX(1.3);
        opacity: 0;
    }
}
```

- Two steam paths, staggered `0.8s` apart
- Duration: `2s` each, `ease-in-out`, `infinite`
- Desktop only — disable via `@media (prefers-reduced-motion)` and skip on mobile

### 8.3 Tap/hover interaction

- Tap or hover: glass tilts `rotate(-15deg)` as if being picked up, `300ms spring`
- Steam intensifies (opacity goes to `0.9`, faster loop `1.2s`)
- Returns to resting state after `1.5s` or on mouse leave

### 8.4 Placement

- Positioned `absolute` in the page heading area: `top-[80px] right-4` on mobile, `top-[72px] right-10` on desktop
- `z-index: 1` (above doodles, below header)
- `pointer-events: auto` — must be tappable
- Minimum touch target: `44×44px` transparent wrapper around the `28×36px` SVG

### 8.5 Component file

`src/components/creatures/chayaCup.tsx`

Follow the same pattern as existing creatures (`snail.tsx`, `bird.tsx`) — `motion` for animation, `useState` for triggered state, `className` prop passthrough.

---

## 9. Entry Animation

Same pattern as `BlogsListPage`:

```tsx
<motion.div
    key={`${entry.url}-${entry.added}`}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.04, // slightly faster stagger than blogs (0.05)
    }}
    style={{
        transform: `rotate(${rotations[index % rotations.length]}deg)`,
    }}
>
    <ScratchpadCard {...entry} index={index} />
</motion.div>
```

Month dividers animate in with the same fade but no `y` offset:

```tsx
<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
>
    {/* divider */}
</motion.div>
```

---

## 10. Data Loading

Use Vite's `import.meta.glob` to load YAML files at build time. Parse with `js-yaml` (already in ecosystem, or add it — `pnpm add js-yaml`).

```ts
// src/utils/scratchpadParser.ts

import * as yaml from "js-yaml";

interface ScratchpadEntry {
    url: string;
    note: string;
    tags: string[];
    added: string;
}

interface ScratchpadGroup {
    monthKey: string; // "2026-06"
    monthLabel: string; // "June 2026"
    entries: ScratchpadEntry[];
}

export async function getScratchpadGroups(): Promise<ScratchpadGroup[]> {
    const files = import.meta.glob("/content/scratchpad/*.yaml", {
        query: "?raw",
        import: "default",
    });

    const results: { key: string; entries: ScratchpadEntry[] }[] = [];

    for (const [path, load] of Object.entries(files)) {
        const raw = (await load()) as string;
        const entries = yaml.load(raw) as ScratchpadEntry[];
        const key = path.match(/(\d{4}-\d{2})\.yaml$/)?.[1] ?? "";
        results.push({ key, entries });
    }

    // Sort months descending
    results.sort((a, b) => b.key.localeCompare(a.key));

    return results.map(({ key, entries }) => ({
        monthKey: key,
        monthLabel: formatMonthLabel(key), // "June 2026"
        entries: entries.sort((a, b) => b.added.localeCompare(a.added)),
    }));
}

function formatMonthLabel(key: string): string {
    const [year, month] = key.split("-");
    return new Date(+year, +month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
    });
}
```

---

## 11. Nav Integration

Add `scratchpad` link to:

1. **Desktop nav** (`src/components/header.tsx`) — between `blogs` and the GitHub button. Same `NavLinks` component pattern.
2. **Mobile menu** (`src/components/mobileMenu.tsx`) — add as fourth item: `about → projects → blogs → scratchpad`

Label: `scratchpad` (lowercase, consistent with existing nav style)

---

## 12. Meta

```tsx
<MetaComponent
    pageTitle="Scratchpad"
    pageDescription="Links and notes from Fahad's browser tabs."
/>
```

---

## 13. File Checklist

| File                                    | Action                                 |
| --------------------------------------- | -------------------------------------- |
| `src/pages/scratchpad.tsx`              | Create — page component                |
| `src/components/scratchpadCard.tsx`     | Create — card component                |
| `src/components/creatures/chayaCup.tsx` | Create — tea creature                  |
| `src/utils/scratchpadParser.ts`         | Create — YAML loader + grouper         |
| `src/components/header.tsx`             | Edit — add nav link                    |
| `src/components/mobileMenu.tsx`         | Edit — add mobile menu item            |
| `content/scratchpad/2026-06.yaml`       | Create — seed with 3–5 example entries |
| `src/App.tsx` (or router file)          | Edit — add `/scratchpad` route         |

---

## 14. Acceptance Criteria

| Criterion                | Pass Condition                                         |
| ------------------------ | ------------------------------------------------------ |
| Route works              | `/scratchpad` renders without 404                      |
| YAML loads               | Entries from all monthly files appear                  |
| Month grouping           | Entries grouped and sorted newest-first                |
| Month dividers           | Handwritten `── Month YYYY ──` dividers between groups |
| Card URL display         | Hostname + first path segment only, no protocol        |
| Month stamp              | `Jun '26` in mustard, top-right of card                |
| Tag pills                | Rendered, max 3, `font-sans 11px`                      |
| Card click               | Opens `url` in new tab                                 |
| Mobile rotation          | `0deg` on all cards                                    |
| Desktop rotation         | Alternating slight rotations per index                 |
| Hover lift               | `translateY(-5px)` + shadow on desktop                 |
| Tap lift                 | `scale(1.02)` on mobile                                |
| `↗` arrow                | Draws in on hover/focus (SVG stroke animation)         |
| Chaya creature           | Visible in heading area, tappable/hoverable            |
| Steam animation          | Steam rises from cup, desktop only                     |
| Cup tilt on tap          | `rotate(-15deg)` spring, returns after 1.5s            |
| Nav link added           | `scratchpad` appears in desktop nav and mobile menu    |
| `prefers-reduced-motion` | Steam and all animations disabled                      |
| Accessibility            | All tap targets ≥ 44×44px, focus ring on cards         |

---

## Appendix — Rotation Array

```ts
const rotations = [-0.5, 0.3, -0.2, 0.6, -0.4, 0.2];
```

Same length-6 pattern as blogs. Cards with `index % 6 === 0` have the most tilt (`-0.5deg`), which looks intentional at scale.

---

## Appendix — Seed Data (content/scratchpad/2026-06.yaml)

```yaml
- url: https://rauno.me
  note: Insane attention to detail. The way the cursor interacts with elements is something else.
  tags: [design, inspiration]
  added: 2026-06-22

- url: https://animata.design
  note: Copy-paste animated components. Actually useful, not just pretty demos.
  tags: [tools, frontend]
  added: 2026-06-18

- url: https://justgetflux.com
  note: Been using this for years. Still the best thing I install on any new machine.
  tags: [tools, productivity]
  added: 2026-06-14

- url: https://typescale.com
  note: Quick way to nail type scale before touching code.
  tags: [design, typography]
  added: 2026-06-09

- url: https://linear.app/method
  note: Linear's design methodology. Good writing about how they think about product.
  tags: [product, reading]
  added: 2026-06-03
```
