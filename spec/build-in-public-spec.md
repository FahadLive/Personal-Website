# Build In Public — AI Agent Spec

**Feature:** Build-log + TIL + activity heatmap for justfahad.me
**Design Direction:** "Scrapbook, but mine" — a Hack Club Scrapbook for one person, with the door left open for others
**Version:** 1.0
**Parent Spec:** Portfolio Redesign v2.0 + Scratchpad v1.0 (inherit all tokens, motion, and typography)

---

## 1. Mission Statement

A daily-ish log of what's actually being built, written the same evening it happens, with zero ceremony. The page has three jobs: **make Fahad show up daily** (subtle pressure, same as Scrapbook's Slack channel), **let visitors see momentum at a glance** (the heatmap is the hook), and **let other builders copy the whole pattern** (a "use this" path, not just an admiring look).

This is not a blog. Entries are short, timestamped, occasionally messy. The TIL section is the same energy as Scratchpad but for _learnings_ instead of links — one paragraph, no polish required.

**Mood:** Logbook on a workbench, not a portfolio piece
**Anti-targets:** ❌ Polished changelog ❌ Corporate "building in public" thread aesthetic ❌ GitHub contribution graph cosplay (it should feel handmade, not like a stat dashboard)

---

## 2. Concept Breakdown

| Piece         | Purpose                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Log**       | Daily/near-daily entries: what got built, a thought, optional link/image. The core "document" half of build → document → share.    |
| **TIL**       | Short atomic learnings, tagged, separate from the log. Aggregatable — answers "what has Fahad been learning" at a glance.          |
| **Heatmap**   | GitHub-style activity calendar driven by log + TIL entry dates. The thing people screenshot.                                       |
| **Fork path** | A `/build-in-public/start` page (or README section) explaining the YAML-in-repo pattern so others can clone it for their own site. |

---

## 3. Data Source

One content type now — TIL lives **inside** the log entry as a short comma-separated field, not a separate file. Simpler bot flow, simpler parser, one YAML per month.

```
content/
  log/
    2026-06.yaml
  log-assets/
    2026-06-14-1.webp
    2026-06-14-2.webp
```

### 3.1 Log entry schema

```yaml
- date: 2026-06-14
  project: BlastOff
  summary: Wired up the heatmap component, took longer than expected because of timezone bugs.
  mood: 🔥 # optional, single emoji — energy of the day
  images:
      - /content/log-assets/2026-06-14-1.webp
      - /content/log-assets/2026-06-14-2.webp
  til:
      [
          animation-timeline hooks straight into scroll position,
          react-activity-calendar themes via CSS vars,
      ]
```

| Field     | Type       | Required | Notes                                                                                                      |
| --------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `date`    | YYYY-MM-DD | ✅       | Drives heatmap + grouping                                                                                  |
| `project` | string     | ✅       | Free text, used for filter pills                                                                           |
| `summary` | string     | ✅       | 1–4 sentences, card clamps at ~5 lines                                                                     |
| `mood`    | string     | ❌       | Single emoji                                                                                               |
| `images`  | string[]   | ✅       | **1–3 required**, local paths under `content/log-assets/`, pre-compressed to WebP at upload time           |
| `til`     | string[]   | ❌       | 0+ short fragments, comma-separated at entry time — rendered as small chips on the card, not full TilCards |

There is no separate `til/*.yaml` and no `tilParser.ts` — TIL items are derived from the flat `til[]` arrays across all log entries when an aggregated view is needed (e.g. a "things learned this month" strip), computed client-side from the same parsed log data.

### 3.2 Parser behaviour

- Same `import.meta.glob` + `js-yaml` pattern as `scratchpadParser.ts` — extend it as `src/utils/buildLogParser.ts`, reusing the shared `groupByMonth()` helper.
- Exports a **flat date list** (`{ date, count }[]`, one count per day = number of log entries that day) for the heatmap. TIL items don't add separate heatmap weight — they ride along on the day's log entry.
- Also exports a flattened `getAllTilItems()` helper (`{ date, project, text }[]`) for any future "recent learnings" strip — not a required UI element for v1, just keep the data shape ready.

---

## 4. Page Route & Structure

`/build` — add to React Router config, desktop nav, and mobile menu (after `scratchpad`).

```
┌─────────────────────────────────────────┐
│  [sticky header — inherited]            │
├─────────────────────────────────────────┤
│                                         │
│  build in public        [streak: 12🔥]  │  ← heading, font-hand
│  documenting what i make, as i make it  │
│                                         │
│  [ heatmap — full width, scrollable ]   │
│                                         │
│  [ Log ▾ ]   [ TIL ▾ ]   ← view toggle  │  ← segmented control, mobile + desktop
│                                         │
│  ── June 2026 ──────────────────────    │  ← reused month divider pattern
│                                         │
│  [entry]                               │
│  [entry]                               │
│                                         │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄    │
│  want to build in public too? → guide  │  ← fork CTA, bottom of page
│                                         │
└─────────────────────────────────────────┘
```

Log and TIL render in the **same vertical list**, switched by a segmented control rather than two separate routes — keeps the heatmap as one shared anchor and avoids splitting the "show up daily" habit across two pages.

---

## 5. Heatmap Component

### 5.1 Library choice

Use **`react-activity-calendar`** (lightweight, themeable via CSS variables, no D3 dependency, ~5KB). Do not hand-roll grid math.

```bash
pnpm add react-activity-calendar
```

Reasoning: it accepts a flat `{ date, count, level }[]`, handles month labels, tooltips, and responsive scroll out of the box — matches the "don't build complex things yourself" constraint.

### 5.2 Data shape

```ts
interface HeatmapDay {
    date: string; // YYYY-MM-DD
    count: number; // log entries + TIL entries that day
    level: 0 | 1 | 2 | 3 | 4; // bucketed from count
}
```

Level bucketing: `0` entries → 0, `1` → 1, `2` → 2, `3` → 3, `4+` → 4.

### 5.3 Theming

Override the library's default green scale with the warm palette — do **not** ship GitHub green.

```css
.react-activity-calendar {
    --ac-color-0: var(--color-bg-shade);
    --ac-color-1: color-mix(
        in srgb,
        var(--color-mustard) 30%,
        var(--color-surface)
    );
    --ac-color-2: color-mix(
        in srgb,
        var(--color-mustard) 55%,
        var(--color-surface)
    );
    --ac-color-3: color-mix(
        in srgb,
        var(--color-accent) 70%,
        var(--color-surface)
    );
    --ac-color-4: var(--color-accent);
}
```

- Cell border-radius: `2px` (slightly rounder than GitHub's squares — softer, sketchbook feel)
- Cell gap: default library spacing, no override needed
- Tooltip on hover/tap: native `react-activity-calendar` tooltip, restyle to `font-hand`, `--color-ink` bg, `--color-surface` text

### 5.4 Mobile behaviour

- Horizontally scrollable container, `overflow-x-auto`, snap to most recent (scroll to end on mount)
- Shrink cell size via the library's `blockSize`/`blockMargin` props rather than CSS scale (avoids tooltip misalignment)
- No hover tooltip on touch — tap a cell to reveal a small inline caption below the grid: `"3 entries · Jun 14"`

### 5.5 Streak counter

Small badge next to the page heading: `streak: 12🔥`. Computed client-side from the flat date list — count consecutive days (today or yesterday backward) with ≥1 entry. If streak is `0`, hide the badge entirely rather than showing `0🔥`.

---

## 6. Entry Card — `LogCard`

```
┌──────────────────────────────┐
│  BlastOff              🔥    │  ← project name + mood emoji
│  Jun 14                      │  ← date, font-hand, 12px
│                              │
│  Wired up the heatmap        │
│  component, took longer      │  ← summary, font-sans, 14px
│  than expected...            │
│                              │
│  [img] [img] [img]           │  ← 1–3 images, swipeable row, 4:3 crop
│                              │
│  TIL: timeline hooks scroll, │  ← til chips, font-sans 11px, ink/50
│       calendar themes via    │     rendered inline, comma-joined, wraps
│       css vars               │
└──────────────────────────────┘
```

- Same card chassis as `ScratchpadCard`: `bg-white`/`bg-[#FFF9F0]` alternating, `2px 4px 12px rgba(0,0,0,0.07)` shadow, `6px` radius, `p-4`
- Project name acts as a filter pill source — tapping it filters the list to that project (client-side, no route change)
- **Images row**: 1–3 thumbnails, `aspect-[4/3]`, `object-cover`, `rounded-[4px]`, single image spans wider, 2–3 images sit in a flex row with `gap-1.5`. Tap/click opens a simple lightbox (no library — a fixed-position `motion.div` overlay reusing the existing `cursor.js` "VIEW" affordance pattern from the parent spec's custom cursor).
- **TIL chips**: rendered only if `til[]` is non-empty, as a single wrapped line prefixed `TIL:`, `font-sans 11px`, `text-ink/50`, items joined with `, ` — not individual pill components, this is intentionally lighter-weight than Scratchpad's tag pills since it's secondary content on the card.

### 6.1 Shared interaction rules

Inherit from Scratchpad spec §6.6 exactly: mobile tap → `scale(1.02)`, desktop hover → `translateY(-5px)` + shadow grow, focus ring `2px solid var(--color-accent)`. Rotation array reused: `[-0.5, 0.3, -0.2, 0.6, -0.4, 0.2]deg`. Tapping the image row itself should not trigger the card's own link navigation (since there is no `link` field anymore) — it only opens the lightbox.

---

## 7. List View

No view toggle needed anymore — there's only one entry type. The list under the heatmap is just the log, newest first, grouped by month divider (reusing Scratchpad's `── Month YYYY ──` pattern exactly). TIL content surfaces inline on each card rather than as a separate filterable view.

---

## 8. The "Fork This" Section

This is the part that makes the page more than a personal log — it's the invitation. Lives at the bottom of `/build` as a single card, not a separate nav item (keep nav minimal).

```
┌─────────────────────────────────────────┐
│  want to build in public too?           │
│                                         │
│  this page is just YAML files + a       │
│  template. fork it, swap the content,   │
│  ship your own.                         │
│                                         │
│  [ read the guide → ]                   │
└─────────────────────────────────────────┘
```

- `read the guide →` links to a static `/build/start` route (or directly to the GitHub README section — simplest is a `BUILD_IN_PUBLIC.md` in the repo, linked externally, to avoid building a second CMS-y page)
- Guide content (markdown file, not part of this UI spec) should cover: repo structure, the two YAML schemas, swapping the heatmap library in if they don't want React, and the Telegram-bot-commits-YAML pattern as optional rather than required
- Style: same card chassis, `border: 1px dashed var(--color-ink)/20` to visually separate it from content cards (signals "this is a different kind of card — an action, not an entry")

---

## 9. Page Heading & Streak Badge

```
build in public                    streak: 12🔥
documenting what i make, as i make it
```

- `build in public`: `font-hand`, `clamp(36px, 8vw, 52px)`, `color: ink` — same scale as Scratchpad heading
- Subtitle: `font-hand`, `16px`, `ink/50`
- Streak badge: `font-sans`, `13px font-medium`, `bg-mustard/15`, `text-ink`, `rounded-full`, `px-3 py-1` — top-right on desktop, wraps below heading on mobile
- No tea creature here — this section gets its own creature: a small **mechanical gear/wrench doodle** that spins briefly on tap (reuse the creature component pattern from `chayaCup.tsx`, simpler animation — `rotate: 0 → 360, 500ms`)

---

## 10. Entry Animation

Identical pattern to Scratchpad §9 — `motion.div`, `initial={{ opacity: 0, y: 24 }}`, `delay: index * 0.04`. Heatmap itself fades in once on mount (`opacity 0 → 1, 400ms`), does not re-animate on view toggle.

---

## 11. Nav Integration

1. **Desktop nav** (`header.tsx`) — add `build` between `scratchpad` and the GitHub button.
2. **Mobile menu** (`mobileMenu.tsx`) — `about → projects → blogs → scratchpad → build`.

Label: `build` (lowercase, matches existing nav style). Avoid `build in public` in the nav itself — too long for the mobile tap target row; full name only appears as the page heading.

---

## 12. Performance & Library Notes

| Constraint            | Approach                                                                                                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Heatmap library       | `react-activity-calendar` only — no D3, no custom SVG grid math                                                                                                                                             |
| YAML parsing          | Reuse existing `js-yaml` + `import.meta.glob` pattern, don't add a second YAML library                                                                                                                      |
| Streak calc           | Pure JS reduce over the flat date list, computed once on mount, no library needed                                                                                                                           |
| Bundle impact         | `react-activity-calendar` is small enough to import directly (no lazy-load needed), but heatmap component itself can still be wrapped in `IntersectionObserver`-gated lazy render if bundle budget is tight |
| Images in log entries | Same WebP + lazy-load rule as hero image in parent spec                                                                                                                                                     |

---

## 13. File Checklist

| File                                      | Action                                                        |
| ----------------------------------------- | ------------------------------------------------------------- |
| `src/pages/build.tsx`                     | Create — page component (heatmap + list)                      |
| `src/components/logCard.tsx`              | Create — includes image row + TIL chip line                   |
| `src/components/buildHeatmap.tsx`         | Create — wraps `react-activity-calendar`                      |
| `src/components/forkCta.tsx`              | Create                                                        |
| `src/components/creatures/gearDoodle.tsx` | Create                                                        |
| `src/utils/buildLogParser.ts`             | Create                                                        |
| `src/utils/groupByMonth.ts`               | Create — shared helper, refactor out of `scratchpadParser.ts` |
| `src/components/header.tsx`               | Edit — add nav link                                           |
| `src/components/mobileMenu.tsx`           | Edit — add mobile menu item                                   |
| `content/log/2026-06.yaml`                | Create — seed entries                                         |
| `content/log-assets/`                     | Create — directory for committed images                       |
| `BUILD_IN_PUBLIC.md`                      | Create — fork guide                                           |
| `src/App.tsx`                             | Edit — add `/build` route                                     |
| `package.json`                            | Edit — add `react-activity-calendar`                          |
| `workers/charlie-build-bot/`              | Create — Telegram bot Worker for `/log` flow (see Appendix B) |

---

## 14. Acceptance Criteria

| Criterion                | Pass Condition                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| Route works              | `/build` renders without 404                                                                      |
| Heatmap renders          | Themed in warm palette, not GitHub green                                                          |
| Heatmap mobile           | Horizontally scrollable, defaults scrolled to latest                                              |
| Streak badge             | Correct consecutive-day count, hidden when 0                                                      |
| Log entries              | Project name, date, summary, images (1–3), optional mood/til all render correctly                 |
| Images required          | Entries with 0 images are treated as invalid by the parser (dev-time warning, not a render crash) |
| TIL chips                | Render inline only when `til[]` present, comma-joined, no chip styling                            |
| Project filter           | Tapping project name on a log card filters list client-side                                       |
| Lightbox                 | Tapping an image opens overlay, closes on tap-outside/Escape                                      |
| Fork CTA                 | Visible at bottom of page, dashed border distinguishes it from entries                            |
| Cards                    | Reuse Scratchpad chassis — same shadow, radius, rotation, hover/tap behavior                      |
| Creature                 | Gear doodle spins on tap/hover near heading                                                       |
| Nav link                 | `build` appears in desktop nav and mobile menu                                                    |
| `prefers-reduced-motion` | Heatmap fade, card animation, gear spin, streak badge all respect the media query                 |
| Accessibility            | All tap targets ≥ 44×44px, heatmap cells have accessible tooltips/labels                          |
| Bot: images mandatory    | `/log` flow refuses to commit until at least 1 photo received                                     |
| Bot: image compression   | Uploaded images are re-encoded to WebP and resized before being committed to the repo             |

---

## Appendix A — Seed Data

### `content/log/2026-06.yaml`

```yaml
- date: 2026-06-14
  project: BlastOff
  summary: Wired up the heatmap component today. Took longer than expected because of timezone bugs in the date grouping.
  mood: 🔥
  images:
      - /content/log-assets/2026-06-14-1.webp
      - /content/log-assets/2026-06-14-2.webp
  til:
      [
          animation-timeline hooks straight into scroll position,
          react-activity-calendar themes via CSS vars,
      ]

- date: 2026-06-12
  project: justfahad.me
  summary: Started sketching the build-in-public page. Stealing the layout bones from scratchpad, changing the soul.
  mood: ✏️
  images:
      - /content/log-assets/2026-06-12-1.webp
  til: []
```

---

## Appendix B — Telegram Bot (`charlie-build-bot`)

Cloudflare Worker, same pattern as the existing Scratchpad bot — extended with a mandatory image step and an inline TIL step. See repo at `workers/charlie-build-bot/index.js`.

**Flow:** `/log` → project → summary → mood (skip button) → images (1–3, "done" button appears after first photo) → til (comma-separated text or skip button) → commit.

Images are downloaded from Telegram, piped through `wsrv.nl` for resize + WebP re-encode (no codec library bundled into the Worker), then committed as binary files alongside the YAML in the same GitHub commit batch.
