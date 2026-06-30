# Build In Public — Fork Guide

This site's `/build` page is powered by YAML files committed to this repo. Here's how it works so you can make your own.

## Repo Structure

```
content/
  log/
    2026-06.yaml      # Monthly YAML files with log entries
  log-assets/          # Images referenced by log entries
src/
  utils/
    buildLogParser.ts  # Reads YAML, returns groups + heatmap data
    groupByMonth.ts    # Shared month grouping helper
  components/
    buildHeatmap.tsx   # Wraps react-activity-calendar
    logCard.tsx        # Entry card with images, TIL, project filter
    forkCta.tsx        # "Want to build in public too?" CTA
    creatures/
      gearDoodle.tsx   # Little gear that spins on tap
  pages/
    build.tsx          # Full page: heatmap + log + fork CTA
```

## YAML Schema

```yaml
- date: 2026-06-14
  project: BlastOff
  summary: What got built today. 1–4 sentences.
  mood: 🔥 # optional — single emoji
  images:
      - /content/log-assets/2026-06-14-1.webp # 1–3 required
  til: [something learned today, another thing learned]
```

## Getting Started

1. Fork this repo
2. Create `content/log/YYYY-MM.yaml` files with your entries
3. Commit images to `content/log-assets/`
4. Serve the site (Vite, Next.js, plain HTML — the data is just YAML)

## Bot Automation (Optional)

See `charlie-worker/src/index.js` for a Telegram bot that writes entries via chat. The flow:

`/log` → project → summary → mood (skip) → photos (1–3) → TIL (skip) → commit

## Dependencies

- `react-activity-calendar` for the heatmap
- `js-yaml` for parsing (already used in the repo)
- `motion` (framer-motion) for entry animations
