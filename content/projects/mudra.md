---
title: "Mudra"
date: 2026-02-22T02:04:45+05:30
summary: "👌 Next-generation human-computer interaction through biophysical intelligence — our Make-A-Ton 8.0 submission"
author: Fahad
tags: ["Hardware", "Python", "Next.js"]
githubLink: https://github.com/FahadLive/Mudra
cover:
    image: "images/projects/mudra.webp"
---

**Mudra** (Malayalam: മുദ്ര) is a multi-purpose wearable input device that combines **EMG** (muscle activity) and **IMU** (motion) signals to recognize gestures in real time. By fusing these data streams it achieves more robust and accurate gesture recognition than traditional camera-based systems, which are limited by line-of-sight and lighting. Predictions are streamed instantly to a live, reactive interface via **WebSockets**.

It was our submission for **Make-A-Ton 8.0**, conducted by CUSAT.

## 🚀 Key capabilities

- **EMG & IMU fusion** — robust gesture recognition without any camera
- **Low-latency streaming** — instant WebSocket broadcasting for real-time feedback
- **Privacy-friendly** — all interaction derived from biometric and inertial signals
- **Dynamic accumulation** — the frontend builds language and geometry in real time from incoming gesture streams
- **Neo-brutalist aesthetic** — high-impact raw design language

## 🏗️ Architecture

- **Backend (Python)** — UDP receiver → feature extraction → ML prediction (Random Forest) → WebSocket server broadcasting state to clients
- **Frontend (Next.js 15 + React)** — smart content accumulation logic, a dynamic layout engine, and webcam-ready AR overlays

Built for the creators of interactive experiences.
