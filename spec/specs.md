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
