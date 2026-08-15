---
title: "Koottam Exporter"
date: 2026-04-21T20:52:11+05:30
summary: "📊 Unofficial scraper to export event data from koottam.tinkerhub.org"
author: Fahad
tags: ["Python", "Scraper"]
githubLink: https://github.com/FahadLive/koottam-exporter
---

An **unofficial scraper** that exports event data from the [Koottam](https://koottam.tinkerhub.org) events dashboard. It visits the dashboard, scrapes event details (name, dates, location, attendees, ratings, photos) and downloads everything into `events.xlsx` and local photo folders.

## ⚠️ Disclaimer

Not affiliated with, endorsed by, or approved by **TinkerHub**. Intended only for core team members with legitimate access, since no official export API exists. Use responsibly.

## 🛠️ How it works

- Uses **Playwright** to automate a Chromium browser using a saved session token
- Collects URLs of all past events and visits each event page to scrape details
- Downloads banners and photos into `photos/<event-name>/`
- Exports everything to `events.xlsx` using **openpyxl**
- Caches results so repeat runs are fast

Output files: `events.xlsx`, `photos/`, `session.json`, `event_urls.txt`.
