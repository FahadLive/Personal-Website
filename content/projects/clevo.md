---
title: "Clevo"
date: 2025-09-04T22:35:45+05:30
summary: "🗑️ a smart waste management platform"
author: Fahad
tags: ["Web App", "React", "TypeScript", "Backend", "Java", "Spring Boot"]
githubLink: https://github.com/FahadLive/clevo-frontend
---

The frontend of **Clevo**, the smart waste management platform. It pairs with the [Clevo Backend](/projects/clevo-backend) to let citizens book waste pickups, recyclers manage slots, and authorities monitor the whole system.

Built with **Vite**, **TypeScript**, **React**, **shadcn-ui**, and **Tailwind CSS**, and deployed at [clevo-frontend.vercel.app](https://clevo-frontend.vercel.app).

The **Clevo API** is the backend of Clevo, an innovative platform for streamlining waste collection, enhancing citizen participation, and providing valuable insights for authorities.

## ⚙️ Architecture

- **Java Spring Boot** backend providing a robust framework for RESTful APIs
- **MySQL** database for all data storage
- **OpenAPI/Swagger** for API documentation

## 👥 Role-based API

- **Citizens** — book pickup slots, view available slots, track bookings, and manage eco-points rewards
- **Recyclers** — create/update/delete pickup slots, view bookings within a ward, and update booking status
- **Authorities** — manage users, wards, and waste categories, plus dashboard analytics on waste trends, waste-by-type, waste-by-region, and eco-points distribution
