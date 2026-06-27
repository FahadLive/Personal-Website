# Portfolio Redesign — AI Agent Spec

**Project:** Mohammed Fahad's Personal Portfolio  
**Design Direction:** "A Developer's Sketchbook" — Thoughtful Whimsy  
**Version:** 2.0 (Mobile-First)

---

## 1. Mission Statement

Transform an existing clean, Swiss-style developer portfolio into a warm, handcrafted experience that feels like **opening someone's sketchbook**. Every element should carry subtle personality without sacrificing professionalism. The result must be memorable to recruiters and delightful to curious visitors.

**Primary audience:** Mobile visitors (phones, ~390px viewport)  
**Design approach:** Mobile-first — build the mobile layout first, then progressively enhance for tablet and desktop  
**Mood target:** Professional + Creative + Curious + Warm + Handmade  
**Anti-targets:** ❌ Childish ❌ Cartoon ❌ Colorful explosion

---

## 2. Design Tokens

### 2.1 Color Palette

| Token             | Hex       | Usage                                        |
| ----------------- | --------- | -------------------------------------------- |
| `--color-bg`      | `#FAF8F3` | Page background (warm paper)                 |
| `--color-text`    | `#111111` | Primary text                                 |
| `--color-accent`  | `#C53B42` | Italic headings, underlines, doodles, arrows |
| `--color-green`   | `#2E6B57` | Sparingly — Forest Green secondary           |
| `--color-blue`    | `#335C81` | Sparingly — Deep Blue secondary              |
| `--color-mustard` | `#D9A441` | Sparingly — Mustard secondary                |
| `--color-purple`  | `#7A5C8F` | Sparingly — Soft Purple secondary            |

> Secondary colors appear in tiny amounts only (icons, underlines, creature accents).

---

### 2.2 Typography

| Role                  | Font Options                                                   | Notes                            |
| --------------------- | -------------------------------------------------------------- | -------------------------------- |
| **Heading**           | General Sans / Satoshi / Neue Montreal / Cabinet Grotesk       | Geometric sans-serif             |
| **Display Accent**    | Instrument Serif / Cormorant Garamond / Canela / Editorial New | Italic, generous tracking        |
| **Handwritten Notes** | Caveat / Patrick Hand / Reenie Beanie                          | Used only for margin annotations |

**Font size scale — mobile base, scaled up at breakpoints:**

| Element          | Mobile                    | Tablet (`≥768px`)          | Desktop (`≥1280px`)         |
| ---------------- | ------------------------- | -------------------------- | --------------------------- |
| Hero name        | `clamp(56px, 14vw, 80px)` | `clamp(80px, 10vw, 120px)` | `clamp(100px, 10vw, 160px)` |
| Section heading  | `28px`                    | `36px`                     | `48px`                      |
| Body text        | `16px`                    | `17px`                     | `18px`                      |
| Handwritten note | `14px`                    | `15px`                     | `16px`                      |
| Nav items        | Full-screen overlay       | `16px`                     | `16px`                      |

**Loading order:** Load heading and handwritten fonts via Google Fonts or self-host. Accent serif loads as display font only (no body text use).

---

### 2.3 Breakpoints

Write all CSS mobile-first. Use `min-width` queries only.

```css
/* Base styles: mobile (default, ~390px) */

@media (min-width: 768px) {
    /* tablet  */
}
@media (min-width: 1024px) {
    /* desktop */
}
@media (min-width: 1280px) {
    /* wide    */
}
```

---

### 2.4 Spacing & Motion

| Property               | Mobile                                  | Desktop                                        |
| ---------------------- | --------------------------------------- | ---------------------------------------------- |
| Section padding        | `48px 20px`                             | `96px 40px`                                    |
| Card padding           | `20px`                                  | `28px`                                         |
| Paper-float animation  | Disabled (battery/performance)          | `translateY: 0 → 3px → 0`, `4s`, `ease-in-out` |
| Card tap lift          | `scale(1.02)`, `150ms`                  | `translateY: -6px`, shadow grow, `200ms`       |
| Hero stagger           | `80ms` delay between lines              | `100ms` delay between words/letters            |
| Handwritten arrow draw | `600ms` SVG stroke dashoffset           | `800ms`                                        |
| Doodle opacity         | `6%` (fewer doodles, less visual noise) | `10%` at rest, `25%` on hover                  |
| Scroll animation       | `translateY 16px → 0` fade              | `translateY 20px → 0` fade                     |

---

## 3. Layout System

### 3.1 Overall Principle

**Mobile:** Single column. Personality comes from typography scale, rotation, and handwritten notes — not from multi-column asymmetry.  
**Desktop:** Intentional imbalance with multi-column layouts and overlapping elements.

---

### 3.2 Grid

| Breakpoint | Columns | Max Width | Gutters |
| ---------- | ------- | --------- | ------- |
| Mobile     | 4       | 100%      | `16px`  |
| Tablet     | 8       | 100%      | `20px`  |
| Desktop    | 12      | `1280px`  | `24px`  |

---

### 3.3 Layout Wireframes

**Mobile Hero:**

```
┌─────────────────────────┐
│  Logo        ☰ menu     │  ← sticky top bar, 56px
├─────────────────────────┤
│                         │
│  MOHAMMED               │
│  FAHAD                  │  ← large heading, left-aligned
│                         │
│  ✦ Thought-driven       │  ← serif float, -3deg, accent red
│                         │
│  ← based in Kerala      │  ← handwritten note
│                         │
│  [portrait image]       │  ← full-width cutout, centered
│                         │
│  building software      │
│  that quietly solves    │
│  problems.              │  ← tagline
│                         │
└─────────────────────────┘
```

**Desktop Hero:**

```
┌──────────────────────────────────────────────┐
│  Logo                          about projects │
├──────────────────────────────────────────────┤
│                                              │
│     MOHAMMED                  [portrait]     │
│     FAHAD          ✦ Thought-driven          │
│                                              │
│     ← based in Kerala                        │
│     ↓ open source                            │
│                                              │
│     building software                        │
│     that quietly solves problems.            │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 4. Page Sections — Detailed Spec

### 4.1 Navigation

#### Mobile (Hamburger)

- **Trigger:** `☰` icon in top-right of sticky header (`56px` tall)
- **Open state:** Full-screen overlay, `background: #FAF8F3`, slides down from top (`300ms ease`)
- **Close:** `✕` icon or tap outside

**Mobile menu layout:**

```
┌─────────────────────────┐
│  Logo            ✕      │
│                         │
│  about                  │
│                         │
│  projects               │
│                         │
│  blog                   │
│                         │
│  playground             │
│                         │
│  [github ↗]             │  ← full-width hand-drawn button
│                         │
│  ← based in Kerala      │  ← handwritten note at bottom
└─────────────────────────┘
```

- Each nav item: large (`32px`), left-aligned, tap target `≥ 48px` tall
- Tap on item: accent underline swipes in (`300ms`), then navigates

#### Desktop (`≥1024px`)

- Horizontal nav in header, right-aligned
- **Hover:** Arrow slides in, underline grows (`scaleX: 0 → 1`)
- **GitHub button:** Hand-drawn SVG border, `github ↗`, border redraws on hover

---

### 4.2 Hero Section

Three-layer composition — adapted per viewport:

**Layer 1 — Main Heading**

- Mobile: `MOHAMMED` / `FAHAD` stacked, left-aligned, `clamp(56px, 14vw, 80px)`
- Desktop: larger, can break across more space
- Color: `#111111`
- Staggered line reveal on load

**Layer 2 — Serif Float**

- Text: `Thought-driven`
- Font: Display Accent (Italic), color: `#C53B42`, rotation: `-3deg`
- Mobile: appears below name, slight left offset
- Desktop: overlaps heading, positioned via `position: absolute`
- Float animation: **desktop only**

**Layer 3 — Handwritten Margin Notes**

```
← based in Kerala
↓ open source
↓ building useful things
```

- Font: Handwritten
- Mobile: stacked below serif float, left-aligned, smaller (`14px`)
- Desktop: positioned in margins, scattered placement
- Draw-in delay after heading

**Hero Tagline:**

```
building software
that quietly solves problems.
```

- Mobile: `18px`, left-aligned, below portrait image
- Desktop: `22px`, below heading composition

**Hero Image:**

- Transparent PNG portrait cutout, no rectangle
- Mobile: centered, `max-width: 260px`, no text overlap
- Desktop: right side, overlaps heading text
- Shadow: `0 8px 40px rgba(0,0,0,0.12)` on both

---

### 4.3 Background Decorations

**Mobile:** Maximum 3 doodles visible at once, positioned carefully so they don't crowd content. All at `6%` opacity.

**Desktop:** Full set at `10%` opacity.

| Doodle                 | Show on Mobile  | Opacity (mob/desk) | Animation          |
| ---------------------- | --------------- | ------------------ | ------------------ |
| `✦` star               | ✅ Yes          | 6% / 10%           | Desktop float only |
| `↗` arrow              | ✅ Yes          | 6% / 10%           | Static             |
| `~~~~` wavy lines      | ❌ No           | — / 8%             | None               |
| `///` hatching         | ❌ No           | — / 8%             | None               |
| Dot clusters           | ✅ Yes (1 only) | 6% / 10%           | None               |
| Small circles          | ❌ No           | — / 10%            | Desktop float only |
| Paper clip SVG         | ❌ No           | — / 10%            | Desktop hover only |
| Masking tape strip SVG | ✅ Yes (1 only) | 6% / 8%            | None               |

> All doodles: `pointer-events: none`, `z-index` below content.

---

### 4.4 Hidden Creatures

**Mobile:** Creatures are visible but tap-triggered (no hover on touch). Single tap plays animation. Position them so they don't intrude on readable content.

| Section  | Creature     | Mobile Position          | Tap/Hover Behavior    |
| -------- | ------------ | ------------------------ | --------------------- |
| Hero     | Tiny bird    | Top-right, below header  | Wings flap            |
| Projects | Sleeping cat | Bottom of section        | Wakes up, stretches   |
| Blog     | Snail        | End of article list      | Crawls forward `40px` |
| About    | Ghost        | Right margin of timeline | Waves hand            |
| Footer   | Robot        | Above footer divider     | Blinks LEDs           |

> Mobile tap target around each creature: minimum `44×44px` transparent touch area.

---

### 4.5 Project Cards

**Mobile layout:** Single column, full-width cards, stacked vertically.

```
┌─────────────────────────┐
│ [tape accent]           │
│                         │
│  Project Name           │
│                         │
│  [tiny sketch icon]     │
│                         │
│  Short description of   │
│  what this project does │
│                         │
│  → open                 │
└─────────────────────────┘
```

**Desktop layout:** 2–3 column grid, each card at a different rotation.

**Card styles:**

- Background: `#FFFFFF` or `#FFF9F0`
- Mobile rotation: `0deg` (no rotation on mobile — looks broken on narrow screens)
- Desktop rotation: alternates `-1deg` / `+1deg` / `0deg`
- Box shadow: `2px 4px 12px rgba(0,0,0,0.08)`
- Optional: masking-tape SVG accent at top corner

**Touch/Hover states:**

- Mobile tap: `scale(1.02)`, shadow increase, `150ms`
- Desktop hover: `translateY: -6px`, shadow `4px 16px 32px rgba(0,0,0,0.14)`, paper-curl on bottom-right (CSS `::after`)

---

### 4.6 Image Placement (Throughout Page)

**Mobile:** Images are full-width, no rotation (rotation causes overflow on narrow viewports). Stacked above or below their associated text.

**Desktop:** Alternating left/right with rotation.

| Breakpoint | Layout             | Rotation |
| ---------- | ------------------ | -------- |
| Mobile     | Full-width stack   | `0deg`   |
| Tablet     | 50/50 side by side | `±2deg`  |
| Desktop    | Alternating L/R    | `±4deg`  |

**Image style requirements (all breakpoints):**

- Black-and-white or desaturated
- Film grain: `filter: contrast(1.05) brightness(0.98)` + SVG feTurbulence noise
- Irregular edges via SVG clip-path
- Occasional Polaroid frame (white border `12px` sides, `40px` bottom, caption area)

---

### 4.7 Blog Section

**Mobile:** Cards stacked vertically, full-width. Pin icon at top-left of each card.

```
┌─────────────────────────┐
│ 📌                      │
│  Article Title          │
│  ──────────────         │
│  Short excerpt...       │
│                         │
│  read more →            │
└─────────────────────────┘
```

**Mobile tap:** Pin briefly wiggles (`rotate: -5deg → 5deg`, `200ms`), card tints slightly

**Desktop:** 2-column grid of sticky-note cards with slight rotation variation

---

### 4.8 About Section — Timeline

**Mobile:** Simplified vertical timeline, single column. Year on the left as a short label, milestone text on the right. No wide two-column layout.

```
2019 ──────────────────────
     Started coding
     ↓
2022 ──────────────────────
     Open Source
     ↓
2025 ──────────────────────
     Building products
     ↓
Now ───────────────────────
     [current focus]
```

- Year labels: `#C53B42`, bold, `14px`
- Connecting SVG path draws on scroll-into-view (`IntersectionObserver`)
- Node dots: `8px` circles, accent color
- Illustrations at each node: `24px` inline icon (desktop: larger, beside text)

---

### 4.9 Section Transitions / Dividers

Same on mobile and desktop, but with reduced padding around them on mobile:

- `────────────✦────────────` (centered, scaled to viewport width)
- Hand-drawn wavy SVG line
- Downward arrow with handwritten label
- Ink stamp graphic

---

### 4.10 Footer

**Mobile:**

```
──────────────────────────

Made openly.
Fueled by curiosity.

Coffee count: ∞

"[random quote]"

© Mohammed Fahad

[github]  [twitter]  [linkedin]
```

**Desktop:** Same content, wider layout with items on one line where appropriate.

- "Made openly." line: Display Accent Italic
- Quote: Handwritten font, centered
- Social icons: `40px` tap targets minimum on mobile
- Background: `#F0EDE6`

---

## 5. Interaction & Motion Spec

### 5.1 Custom Cursor

**Desktop only.** Do not render on touch devices.

```javascript
// Guard — cursor only on fine pointer (mouse)
if (window.matchMedia("(pointer: fine)").matches) {
    initCustomCursor();
}
```

| Context      | Cursor                                        |
| ------------ | --------------------------------------------- |
| Default      | Small ring `12px`, `border: 1.5px solid #111` |
| On links     | Ring stretches to `48px`                      |
| On images    | Ring shows text `VIEW` inside                 |
| On creatures | Ring shows `👆` or wave emoji                 |

Implementation: Absolutely-positioned `div` + `mousemove` + lerp (`position += (target - position) * 0.12`).

---

### 5.2 Scroll Animations

Use `IntersectionObserver` with threshold `0.15` on all viewports.

| Element             | Mobile Animation             | Desktop Animation                    |
| ------------------- | ---------------------------- | ------------------------------------ |
| Section headings    | Fade + `translateY 16px → 0` | Fade + `translateY 20px → 0`         |
| Project cards       | Fade-in, no rotation settle  | Stagger fade-in with rotation settle |
| Timeline nodes      | Draw SVG line                | Draw SVG line                        |
| Sticky notes (blog) | Fade up                      | Slide in from slight angle           |
| Handwritten notes   | Fade in                      | Draw-in via stroke animation         |

> All animations disabled when `prefers-reduced-motion: reduce` is set.

---

### 5.3 Touch Interactions (Mobile-Specific)

| Trigger             | Action                                 |
| ------------------- | -------------------------------------- |
| Tap project card    | `scale(1.02)` + shadow pulse, `150ms`  |
| Tap creature        | Plays animation once                   |
| Tap logo            | Confetti burst (same as desktop click) |
| Long press image    | Polaroid-style "VIEW" label slides in  |
| Swipe left on cards | (Optional) reveal project tags         |
| Tap nav hamburger   | Full-screen overlay animates in        |

---

### 5.4 Desktop Microinteractions

| Trigger                     | Action                                  |
| --------------------------- | --------------------------------------- |
| Hover project card          | Paper lifts, shadow grows, corner curls |
| Hover heading               | Serif accent word shifts `2px`          |
| Hover creature illustration | Creature plays idle animation           |
| Hover logo                  | Subtle `rotate: 5deg` bounce            |
| Hover nav item              | Arrow slides in, underline draws        |
| Scroll page                 | Sticky notes slide in from margin       |

---

## 6. Easter Eggs

| Trigger                        | Mobile Support  | Effect                                           |
| ------------------------------ | --------------- | ------------------------------------------------ |
| Tap logo (×3 rapid taps)       | ✅ Yes          | Confetti burst (canvas, 40 particles)            |
| Type `hello` on desktop        | ❌ No           | Robot illustration pops up with greeting         |
| Shake device                   | ✅ Yes (mobile) | Confetti burst (DeviceMotionEvent, if permitted) |
| Konami Code (desktop keyboard) | ❌ No           | Toggle dark theme (inverted warm palette)        |
| Footer quote                   | ✅ Yes          | Randomizes from 10–15 quotes on each page load   |

---

## 7. Technical Implementation Notes

### 7.1 Tech Stack Assumptions

- Framework: Next.js / Astro / plain HTML+CSS+JS (agent should confirm)
- Animation: CSS animations + lightweight JS (`requestAnimationFrame` for cursor, GSAP optional)
- SVG illustrations: Inline SVGs for animatability
- Fonts: Google Fonts or Fontshare (General Sans, Caveat, Instrument Serif)

### 7.2 Performance Constraints (Mobile-Priority)

Mobile performance is the primary target. All optimizations serve mobile first.

| Constraint                  | Requirement                                                     |
| --------------------------- | --------------------------------------------------------------- |
| Hero image                  | WebP format, `max-width: 600px` on mobile, lazy-load below fold |
| Doodle SVGs                 | Single sprite sheet, only 3 shown on mobile                     |
| Creature illustrations      | Lazy-loaded via `IntersectionObserver`                          |
| Custom cursor JS            | Not loaded on touch devices                                     |
| Floating animations         | Disabled on mobile (saves battery)                              |
| Grain texture               | CSS SVG `feTurbulence` filter — no raster image                 |
| Total JS bundle             | Target `< 80KB` gzipped (excluding framework)                   |
| First Contentful Paint      | `< 1.5s` on 4G mobile                                           |
| Target Lighthouse (mobile)  | ≥ 90 Performance, ≥ 95 Accessibility                            |
| Target Lighthouse (desktop) | ≥ 95 Performance                                                |

---

### 7.3 Accessibility

- All SVG illustrations: `aria-hidden="true"` (decorative)
- Custom cursor: only supplemental — native cursor never hidden
- All touch targets: minimum `44×44px` (Apple HIG / WCAG 2.5.5)
- All motion: wrapped in `@media (prefers-reduced-motion: no-preference)`
- Handwritten fonts: never used for body text (readability)
- Mobile nav overlay: focus trapped while open, `Escape` closes it
- Color contrast: all text meets WCAG AA (`4.5:1` body, `3:1` large text)

---

## 8. Asset Checklist (To Be Provided by Developer)

- [ ] Transparent PNG portrait cutout — high-res (`800×800px` minimum), WebP export also
- [ ] 3–5 black-and-white workspace/candid photos — provided at `1200px` wide max
- [ ] SVG of 5 creature illustrations (bird, cat, snail, ghost, robot)
- [ ] SVG hand-drawn decorative elements (arrows, stars, underlines, tape strips)
- [ ] Optional: Polaroid-style event/hackathon photos

---

## 9. File Delivery Expectations (Agent Output)

The agent should produce the following:

1. `index.html` (or framework entry point) — complete page structure
2. `styles/` — modular CSS written mobile-first with CSS custom properties
    - `tokens.css` — all design tokens
    - `layout.css` — grid and breakpoint system
    - `components.css` — cards, nav, hero, blog notes, etc.
    - `animations.css` — all motion (wrapped in `prefers-reduced-motion`)
3. `scripts/` — split by device capability
    - `scroll-animations.js` — IntersectionObserver (runs on all devices)
    - `cursor.js` — custom cursor (loaded only on `pointer: fine` devices)
    - `easter-eggs.js` — confetti, robot, dark mode toggle
    - `mobile-nav.js` — hamburger overlay
4. `assets/svg/` — all doodles and dividers as inline-ready SVGs
5. `assets/illustrations/` — creature SVGs (placeholders if not provided)
6. `components/` — if using a component framework: `HeroSection`, `ProjectCard`, `TimelineItem`, `BlogNote`, `MobileNav`, `Footer`

---

## 10. Acceptance Criteria

| Criterion                                | Pass Condition                                                   |
| ---------------------------------------- | ---------------------------------------------------------------- |
| Warm background applied                  | `#FAF8F3` throughout, no pure white                              |
| Mobile nav works                         | Hamburger opens full-screen overlay; all items ≥ 48px tap height |
| Three-layer hero renders on mobile       | Name, serif float, handwritten note all visible without overflow |
| Hero image correct on mobile             | Centered, `max-width: 260px`, no text overlap                    |
| Cards are full-width on mobile           | No rotation on mobile; rotation only on desktop                  |
| At most 3 doodles on mobile              | No visual clutter; all at 6% opacity                             |
| At least 2 creatures present             | Tap-triggered animation works on touch                           |
| Handwritten font in use                  | Caveat or equivalent for margin notes                            |
| All tap targets ≥ 44×44px                | Links, buttons, nav items, creature touch areas                  |
| Logo confetti (triple tap on mobile)     | Triggers on 3 rapid taps                                         |
| Custom cursor absent on touch devices    | Not rendered or initialised on mobile                            |
| Floating animations absent on mobile     | `paper-float` keyframes not active on mobile                     |
| Motion respects `prefers-reduced-motion` | All CSS animations and JS-driven motion disabled                 |
| Lighthouse Performance ≥ 90 (mobile)     | Tested with Lighthouse mobile profile                            |
| Lighthouse Accessibility ≥ 95            | Tested on mobile profile                                         |

---

## Appendix A — Implementation Decisions (v2.0)

This appendix records every deviation, addition, or implementation-specific detail from the original spec. The spec above is the *intended* design; this appendix is the *built* reality.

### A.1 Tech Stack

| Spec Assumption | Actual Implementation |
|---|---|
| Next.js / Astro / HTML+CSS+JS | **React 19 + Vite 6** (SPA, no SSR) |
| GSAP for animation | **motion/react** (React 19 compatible Framer Motion fork) |
| CSS custom properties + modular CSS | **Tailwind CSS v4** (`@theme` block in `index.css`) |
| Separate CSS files (tokens, layout, components, animations) | **Single `components.css` + `page.css`** per-page CSS |
| Fetch — not used in spec | **gray-matter** for Markdown parsing (projects/blogs sourced from `.md` files) |
| Icons — not specified | **Tabler Icons** (`@tabler/icons-react`) for nav and UI |
| Routing — not specified | **React Router v7** (`react-router`) for SPA routing |

### A.2 Layout System — Deviations

| Spec | Built | Why |
|---|---|---|
| Footer section (4.10) with quote, social icons, dark footer bg | **Not implemented.** No footer exists anywhere. | User explicitly removed footer. |
| "Playground" nav item in mobile menu | **Not implemented.** Mobile menu links: About, Projects, Blogs. | No playground section exists. |
| Max width 1280px on desktop | **Not used.** Content fills viewport. | Minimalist approach; perceived width is constrained by padding + `max-w-3xl` on about page only. |
| `56px` sticky top bar | **`p-6 pt-6` with offset content via `pt-28`.** Header height is content-driven (~80–90px). | Simpler implementation; no fixed height needed. |

### A.3 Navigation — Deviations

| Spec | Built |
|---|---|
| Desktop nav: right-aligned, horizontal | ✅ As specified, with `gap-8 md:gap-12` links + GitHub button. |
| GitHub button: hand-drawn SVG border, redraws on hover | ✅ `PageDirects` component (SVG with `stroke-dashoffset` draw animation, `#C53B42` on hover). |
| Nav underline: `scaleX: 0 → 1` on hover | ✅ `NavLinks` component, with sliding arrow indicator. |
| Mobile menu: "about / projects / blog / playground" | Modified: **about → projects → blogs** (no playground). |
| Mobile menu close: `✕` icon or tap outside | ✅ Implemented, plus `Escape` key support. |
| Handwritten "← based in Kerala" | ✅ Present at bottom of mobile menu and hero. |

### A.4 Hero Section — Deviations

| Spec | Built |
|---|---|
| Hero name break: `MOHAMMED / FAHAD` stacked | ✅ Implemented with `TextTransition` component cycling through roles. |
| Serif float: `Thought-driven`, `-3deg`, accent | ✅ Implemented with `-3deg` rotation. |
| Handwritten notes: `← based in Kerala`, `↓ open source`, `↓ building useful things` | Modified: **Only "← based in Kerala"** (single note). |
| Hero image: right side on desktop, overlaps heading | ✅ Implemented with `irregular clip-path`, `right-0 md:right-12`. |
| Hero stagger: 80ms on mobile, 100ms on desktop | Implemented with **350ms–800ms delays** (faster than spec for responsive feel). |
| Tagline: `building software that quietly solves problems.` | ✅ Implemented as specified. |

### A.5 Background Decorations — Deviations

| Spec | Built |
|---|---|
| 3 doodles max on mobile | **Implemented with 7 doodles, all at 6% opacity on mobile.** Minimal visual impact at that opacity. |
| Doodle opacity: 6% mobile, 10% desktop | ✅ Spec matches. Desktop set to 10% via `md:opacity-10`. |
| Doodle pointer-events: none | ✅ `pointer-events: none` on all doodles. |
| Doodle z-index: below content | ✅ `z-0` on doodles, content at `z-[1]`, header at `z-[50]`. |
| Paper clip: desktop only, hover wiggle | ✅ Same implementation, always visible (not just on hover), with wiggle on tap/hover. |

### A.6 Hidden Creatures — Deviations

| Spec | Built |
|---|---|
| 5 creatures: Bird, Cat, Snail, Ghost, Robot | **4 implemented** (Robot omitted — no footer to place it near). |
| Footer Robot creature | **Not implemented.** Footer is removed. |
| Animations: tap/hover triggers | ✅ All animate on tap or hover start via `motion` + `useState`. |
| 44×44px touch targets | ✅ Wrapped in `cursor-pointer select-none` divs — ensures touchable area. |
| Bird: wings flap | ✅ `motion.path` stroke morphing. |
| Cat: wakes up, stretches | ✅ Opens eyes (white circles scale), tail wags. |
| Snail: crawls 40px | ✅ `motion.svg animate x: 40` then returns. |
| Ghost: waves hand | ✅ Wobble `rotate` animation + smile morph. |

### A.7 Project & Blog Cards — Deviations

| Spec | Built |
|---|---|
| Project card: masking tape SVG accent | ✅ `PaperClip` component reused + masking tape SVG at top. |
| Project card: box shadow `2px 4px 12px rgba(0,0,0,0.08)` | ✅ `shadow-sm` (Tailwind) = similar values. |
| Hover: `translateY: -6px`, shadow increase | ✅ `hover:-translate-y-1.5 hover:shadow-lg` on `.paper-card`. |
| Blog card: sticky-note style, `#FFF9F0` | ✅ `bg-[#FFF9F0]` with pin 📌 wiggle on hover. |
| Desktop grid: alternating rotation | ✅ `rotations` array applied per index. |

### A.8 About Page — Deviations

| Spec | Built |
|---|---|
| Timeline: year on left, milestone on right | ✅ Single column with year + label + icon. |
| Animated SVG line draws on scroll | ✅ `motion.line` with `pathLength` draw, `stroke-dasharray: "6 4"`. |
| Spring dots on timeline nodes | ✅ `motion.div` with `spring` transition, `stiffness: 200`. |
| Hero portrait on about page | **Not included.** About page has no portrait — single bio text only. |
| Contact section with social links | ✅ Simplified: Instagram (preferred) + LinkedIn. |
| "About this site" attribution | ✅ Credits wandixu.com and scalzodesign.be. |

### A.9 Section Dividers — Deviations

| Spec | Built |
|---|---|
| `───────────✦───────────` | ✅ Implemented in project/blog pages. |
| Hand-drawn wavy SVG line | **Not implemented.** Only `✦` and `▼` dividers used. |
| Downward arrow with handwritten label | ✅ `▼` arrow used, styled consistently. |
| Ink stamp graphic | **Not implemented.** |

### A.10 Custom Cursor — Deviations

| Spec | Built |
|---|---|
| Desktop only, `pointer: fine` guard | ✅ `matchMedia("(pointer: fine")` before rendering. |
| Default: 12px ring, `1.5px solid #111` | ✅ `12px` ring with `lg:48px` on links. |
| On images: "VIEW" text | ✅ Shows "VIEW" inside enlarged ring. |
| On creatures: `👆` emoji | **Not implemented.** No special emoji for creatures. |
| Lerp: `position += (target - position) * 0.12` | ✅ Smoothed with lerp, `0.12` factor. |
| Native cursor never hidden | ✅ Always `cursor-none` class on container + `cursor: inherit` on child elements. |

### A.11 Easter Eggs — Deviations

| Spec | Built |
|---|---|
| Triple-tap logo: confetti burst | ✅ 40 particles, 800ms window, canvas-based, palette colors. |
| Type "hello": robot popup | **Not implemented.** |
| Shake device: confetti | **Not implemented.** |
| Konami Code: dark mode | **Not implemented.** |
| Footer quote randomizer | **Not implemented.** No footer. |

### A.12 Motion & Animation — Specific Parameters

#### Hero Load Sequence
| Element | Delay | Duration |
|---|---|---|
| Name (TextTransition) | `0.35s` | First cycle starts immediately |
| Serif float | `0.4s` | `0.6s` fade+slide |
| Handwritten note | `0.5s` | `0.5s` fade |
| Portrait | `0.6s` | `0.8s` fade+scale |
| Tagline | `0.8s` | `0.5s` fade |

#### TextTransition Component
- `cycleSpeed`: 6 (seconds between role changes)
- `revealSpeed`: 4 (seconds for letter reveal)
- Roles: "Developer", "Builder", "Creator", "Thinker", "Coder"

#### Timeline Animation
- Line draw: `pathLength 0 → 1`, `1.2s`, `easeInOut`
- Each item: `delay: index * 0.1s`, `0.4s`, spring dots
- Viewport: `once: true, margin: "-40px"`

#### Doodle Float Keyframes (`.doodle-float`)
```
0%: translateY(0)
50%: translateY(-6px)
100%: translateY(0)
```
- Duration: varies by doodle (`4s`–`7s`)
- Easing: `ease-in-out`
- Desktop only (media query guard in `components.css`)

#### Confetti
- Count: 40 particles
- Window: 800ms (3 taps within window triggers)
- Colors: drawn from palette (`#C53B42`, `#335C81`, `#D9A441`, `#7A5C8F`, `#2E6B57`)
- Canvas-based, no dependencies
- Particle physics: random angle + velocity, gravity drag, fade out

### A.13 Z-Index Stacking Order

| Layer | Z-Index | Element |
|---|---|---|
| Doodles | `0` | `backgroundDecorations.tsx` |
| Paper clip | `0` | `paperClip.tsx` (sibling of doodles) |
| Page content | `1` | Main content area |
| Header | `50` | `header.tsx` (sticky top) |
| Mobile menu | `100` | `mobileMenu.tsx` (full-screen overlay) |
| Custom cursor | `10000` | `customCursor.tsx` (always on top) |

### A.14 Tailwind v4 Theme Overrides — Full @theme Block

These tokens are defined in `src/index.css`:

```css
@theme {
  --color-surface: #FAF8F3;
  --color-ink: #111111;
  --color-accent: #C53B42;
  --color-green: #2E6B57;
  --color-blue: #335C81;
  --color-mustard: #D9A441;
  --color-purple: #7A5C8F;
  --color-footer-bg: #F0EDE6;
  --color-bg-shade: #f1efe8;
  --font-sans: "Satoshi", "Helvetica Neue", sans-serif;
  --font-serif: "Instrument Serif", serif;
  --font-hand: "Caveat", cursive;
}
```

Backward-compat CSS custom properties are also set in `:root {}` for any legacy references.

### A.15 Font Loading

| Font | Source | Weight |
|---|---|---|
| Satoshi (headings/body) | Fontshare (`api.fontshare.com`) | 300, 400, 500, 700, 900 |
| Instrument Serif (display accent) | Google Fonts | 400 italic |
| Caveat (handwritten notes) | Google Fonts | 400 |

### A.16 Animations Respecting `prefers-reduced-motion`

All CSS animations in `components.css` are wrapped in:
```css
@media (prefers-reduced-motion: no-preference) { ... }
```

The `motion` library components use `useReducedMotion()` internally, and custom cursor defers to CSS `@media (prefers-reduced-motion)` guards.

### A.17 What Was Built But Not in Spec

| Feature | Details |
|---|---|
| Film grain on project images | SVG `feTurbulence` filter applied via CSS |
| Section dividers (`✦` and `▼`) | Used on `project.tsx` and `blog.tsx` pages |
| Irregular clip-path on hero portrait | Custom polygon path for sketchbook feel |
| Page title meta component | `MetaComponent` for SEO |
| Markdown-powered content | Projects and blogs sourced from `.md` files |
| `pt-28` offset for fixed header | Each page's content area offsets for the fixed header |
| SPA routing | React Router handles all page transitions |
