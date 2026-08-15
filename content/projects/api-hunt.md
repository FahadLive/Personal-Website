---
title: "API Hunt"
date: 2025-08-16T19:50:00+05:30
summary: "🏆 Treasure Hunt but with FastAPI"
author: Fahad
tags: ["Game", "Python", "FastAPI"]
githubLink: https://github.com/FahadLive/API-Hunt
---

**API Hunt** is an engaging treasure hunt game that challenges developers to solve riddles and navigate through API endpoints. Race against time, solve cryptic clues, and climb the leaderboard!

Live at [api-hunt.justfahad.me](https://api-hunt.justfahad.me/).

## 🎯 Features

- Multi-stage riddle challenges — solve cryptic clues to find the next endpoint
- Real-time leaderboard — compete based on completion time
- Sequential progression — no skipping stages
- Player statistics and game stats
- Clean, well-structured RESTful API

## 🎮 How to play

1. `POST /start` with your player name
2. Solve each riddle to unlock the next endpoint
3. Submit answers via `POST /{endpoint}`
4. Complete all stages and see your completion time!

Built with **FastAPI**, **Pydantic**, and **Uvicorn**.
