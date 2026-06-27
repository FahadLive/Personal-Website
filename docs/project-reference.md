# Personal Website — Project Reference

**Last updated:** 2026-06-27  
**Branch:** The repository is live on Fahad's personal site.  
**Stack:** React 19 + Vite 6 + Tailwind CSS v4 + `motion/react` + React Router v7  
**Package manager:** pnpm@10.10.0

---

## What's Done (All Phases Complete)

### Phase 1 — Design Tokens & Fonts
- Tailwind v4 `@theme` block with full palette (`surface`, `ink`, `accent`, `green`, `blue`, `mustard`, `purple`, `footer-bg`, `bg-shade`)
- Backward-compatible CSS vars in `:root {}` (`--main`, `--text`, `--tertiary`, etc.)
- Three fonts loaded: Satoshi (headings/body), Instrument Serif (display accent), Caveat (handwritten)
- `color-scheme: light` only
- Font vars: `--font-sans`, `--font-serif`, `--font-hand`

### Phase 2 — Layout Shell & Navigation
- `BackgroundDecorations`: 7 fixed SVG doodles at `z-0`, 6% opacity mobile / 10% desktop, float animations
- `PaperClip`: interactive SVG clip at `z-0`, wiggle on tap/hover
- Layout component with proper z-index stacking (doodles `z-0` → content `z-[1]` → header `z-[50]` → mobile menu `z-[100]` → cursor `z-[10000]`)
- Desktop nav: About → Projects → Blogs + LinkedIn + GitHub (hand-drawn SVG border button)
- Mobile menu: full-screen overlay, correct link order, "← based in Kerala" note, Escape key closes
- `NavLinks` with arrow slide + underline animation on hover
- `PageDirects` GitHub button with SVG stroke-dashoffset draw animation

### Phase 3a — Home Hero
- Three-layer composition: name (TextTransition cycling Developer/Builder/Creator/Thinker/Coder), "✦ Thought-driven" serif float at `-3deg`, "← based in Kerala" handwritten note
- Irregular clip-path portrait, right-aligned on desktop
- Tagline: "building software that quietly solves problems."
- Staggered entrance: 0.35s–0.8s delays (faster than spec for snappiness)
- TextTransition: `cycleSpeed=6`, `revealSpeed=4`

### Phase 3b — Project & Blog Cards
- `ProjectItem`: paper-card with masking tape SVG, `-6px` hover lift, shadow grow
- `BlogItem`: sticky-note with `#FFF9F0` bg, pin 📌 wiggle
- Desktop grid with alternating rotation per card

### Phase 3c — About Page
- Single column, no portrait
- Timeline with real data (2022 → Now), SVG line-draw via `pathLength`, spring dots, staggered scroll reveals

### Phase 3d — Dividers & Polish
- Section dividers: `✦` and `▼` centered
- Film grain via CSS `feTurbulence` filter on project images
- Blog typography with serif title
- Downloads page with polaroid card

### Phase 4 — Custom Cursor & Easter Eggs
- CustomCursor: desktop only (`pointer: fine` guard), lerp 0.12, 12px ring → 48px on links/images, "VIEW" text on images
- Confetti: 40 particles, triple-tap logo within 800ms window, palette colors, canvas-based

### Phase 5 — Hidden Creatures
- **Bird** (Home page, top-right): wing flap on tap/hover
- **Cat** (Projects page, bottom-right): wakes up + tail wag on tap/hover
- **Snail** (Blogs page, bottom-right): crawls 40px right on tap/hover
- **Ghost** (About page, bottom-right): wobble + smile on tap/hover
- All: inline SVGs, `motion` animations, accessible (`aria-label`, keyboard-triggerable)

### Phase 6 — Spec Document Updated
- `spec/specs.md` now has **Appendix A: Implementation Decisions** with 17 categories documenting every deviation from the original spec

---

## What Needs Work / Potential Improvements

### Known Spec Gaps (Not Implemented)

| Feature | Spec Reference | Notes |
|---|---|---|
| Robot creature | §4.4 (Footer) | No footer exists; creature has nowhere to live |
| Footer with quote randomizer | §4.10 | Explicitly removed by user |
| "Playground" nav item | §4.1 Mobile menu | No playground section/page exists |
| Additional handwritten notes (`↓ open source`, `↓ building useful things`) | §4.2 Hero | Only "← based in Kerala" is shown |
| Wavy SVG line divider | §4.9 | Only `✦` and `▼` are used |
| Ink stamp divider | §4.9 | Not built |
| Konami Code → dark mode easter egg | §6 | Not implemented |
| Shake device → confetti easter egg | §6 | Not implemented |
| Type "hello" → robot popup easter egg | §6 | Not implemented |
| 👆 emoji on custom cursor when hovering creatures | §5.1 | Cursor only shows "VIEW" on images |
| Long press image → "VIEW" label (mobile) | §5.3 | Not implemented |
| Swipe left on cards to reveal tags (mobile) | §5.3 | Not implemented |

### Potential Issues to Verify

- **Film grain filter**: The `feTurbulence` CSS filter is applied to project images — test that it renders correctly across browsers (Safari sometimes has SVG filter quirks)
- **Custom cursor on mobile**: Guarded by `pointer: fine`, but verify it never renders on actual touch devices
- **Confetti on triple-tap**: The 800ms window may need tuning — test on actual mobile to ensure it's not too tight
- **Page transition flash**: SPA routing may show a brief unstyled flash — verify with production build
- **TextTransition cycle timing**: The 6s cycle speed may feel fast/slow depending on content length

### Maintenance & Housekeeping

- **Run ESLint**: `pnpm lint` — has never been run in this session; may surface issues
- **No tests exist**: Consider adding basic smoke tests
- **Lighthouse audit**: Spec targets ≥90 Performance / ≥95 Accessibility on mobile — never verified
- **Font loading**: Satoshi from Fontshare may have intermittent availability; consider self-hosting fallback
- **Bundle size**: `dist/projects-*.js` at ~348 kB (106 kB gzip) is large — the `gray-matter` Markdown parser is the likely culprit. If pages grow, consider lazy-loading or switching to a lighter parser / pre-built JSON
- **Doodle count on mobile**: Spec says max 3, but 7 are rendered at 6% opacity — verify no performance impact on low-end devices

### Feature Polish Ideas

- Add hover/focus styles to timeline interactive dots
- Animate the "based in Kerala" handwritten note to draw in via stroke animation (spec mentions stroke-dashoffset draw)
- Add `loading="lazy"` to project/blog cover images if not already present
- Consider adding a subtle paper texture CSS (repeating conic-gradient or noise SVG) for extra sketchbook feel
- The confetti burst could use a sound effect (small detail, big delight)
- Custom cursor could pulse subtly when idle for extra polish

### Accessibility Checkpoints

- [ ] All interactive elements keyboard-focusable and operable
- [ ] Color contrast ratios verified (WCAG AA: 4.5:1 body, 3:1 large text)
- [ ] `prefers-reduced-motion` tested in practice (not just code review)
- [ ] Mobile menu focus trap verified
- [ ] SVG illustrations all have `aria-hidden="true"` (decorative use)
- [ ] Custom cursor never hides native cursor on focusable elements

---

## File Map (Key Files)

| File | Purpose |
|---|---|
| `src/index.css` | Tailwind v4 @theme, global styles, backward-compat vars |
| `src/app.css` | Root font-family |
| `src/index.html` | Font loading links |
| `src/components/layout.tsx` | Main layout shell, z-index stacking |
| `src/components/header.tsx` | Navigation, mobile menu, confetti trigger |
| `src/components/backgroundDecorations.tsx` | 7 SVG doodles |
| `src/components/paperClip.tsx` | Interactive paper clip |
| `src/components/customCursor.tsx` | Desktop cursor |
| `src/components/navLinks.tsx` | Desktop nav items |
| `src/components/pageDirects.tsx` | GitHub hand-drawn button |
| `src/components/mobileMenu.tsx` | Full-screen overlay |
| `src/components/components.css` | All animation keyframes, card classes |
| `src/pages/page.css` | Hero, timeline, divider, film grain styles |
| `src/pages/home.tsx` | Three-layer hero |
| `src/pages/projectsList.tsx` | Project card grid |
| `src/pages/blogsList.tsx` | Blog sticky-note grid |
| `src/pages/about.tsx` | Timeline + bio |
| `src/pages/project.tsx` | Single project page |
| `src/pages/blog.tsx` | Single blog page |
| `src/pages/downloads.tsx` | Polaroid card page |
| `src/components/creatures/bird.tsx` | Bird (home page) |
| `src/components/creatures/cat.tsx` | Cat (projects page) |
| `src/components/creatures/snail.tsx` | Snail (blogs page) |
| `src/components/creatures/ghost.tsx` | Ghost (about page) |
| `src/lib/confetti.ts` | Canvas-based confetti |
| `spec/specs.md` | Full design spec + Appendix A (implementation decisions) |
