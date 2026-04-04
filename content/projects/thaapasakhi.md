---
title: "ThaapaSakhi"
date: 2024-11-19T07:50:00+05:30
tags: ["Music", "Hardware"]
summary: "🌡️  താപസഖി: Temperature based music player. Made using NodeMCU & Node.js"
author: Fahad
githubLink: https://github.com/FahadLive/ThaapaSakhi
imagesFolder: /images/projects/thaapasakhi/
cover:
  image: "images/projects/thaapasakhi-logo.svg"
---

## My Team:

- Team Lead: Mohammed Fahad - Government Engineering College Palakkad
- Member 2: N Fadeela - Government Engineering College Palakkad
- Member 3: Mohammed Muflih - Government Engineering College Palakkad

---

This is a whimsical little gadget that turns temperature into tunes—because why _feel_ the weather when you can _hear_ it?

Let’s be honest: checking the temperature is _way_ too much effort. Who has time to glance at a thermometer or—god forbid—step outside? This project solves a problem _nobody_ asked for by converting boring old temperature readings into delightful melodies. You’re welcome.

### The Solution (Because Why Not?)

We hooked up a DHT11 sensor to a NodeMCU, made it whisper temperature data to a PC over Wi-Fi, and computer plays custom tunes based on how hot or cold it is. Hot day? Here’s a tropical vibe. Chilly night? Enjoy some cozy lo-fi. It’s absurd, it’s unnecessary, and it’s 100% fun.

**Hardware:**

- **NodeMCU v1 (ESP8266)** – The brain that complains about the weather
- **DHT11 Sensor** – The snitch that reports temperature to the system

### **How It Works (Magic, Basically)**

1. **Sensor Spills the Tea:** The DHT11 reads the temperature and sends it to `ntfy` (a simple pub-sub service).
2. **PC Listens In:** A Node.js script subscribes to the temperature updates via WebSocket.
3. **DJ Mode Activated:** Depending on the temp, your computer plays the perfect soundtrack—like a weather-dependent Spotify playlist, but _way_ more extra.

**Why?** Because engineering should be playful. And because we _could_. 😉
