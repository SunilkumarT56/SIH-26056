

# 🇮🇳 Real-Time Airfare Price Index (APIx)

**High-Frequency Domestic Airfare Monitoring Platform**  
NSO / RBI Analytics · SIH-26056

![Status](https://img.shields.io/badge/Status-LIVE-4dab9a?style=for-the-badge) fff ![Stack](https://img.shields.io/badge/React-Vite-191919?style=for-the-badge)



---

## Dashboard

The main dashboard is a **React app** with Notion-inspired black UI, Apple/Google-level polish, and interactive charts.

### Run locally

```bash
cd dashboard
npm install
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Build for production

```bash
cd dashboard
npm run build
npm run preview
```

---



## Features


| Section                   | Description                              |
| ------------------------- | ---------------------------------------- |
| **KPI Cards**             | APIx index, MoM/YoY change, observations |
| **Index Trend**           | Area chart — Jan–Sep monthly series      |
| **Route Heatmap**         | Per-route index with severity indicators |
| **Contributors**          | Doughnut chart — MoM movement breakdown  |
| **Lead-Time Elasticity**  | Bar chart — T+1 to T+45 fare curves      |
| **Airline Analysis**      | Carrier-level average fares              |
| **Fare Composition**      | Pie chart — base, tax, fees breakdown    |
| **Fare Distribution**     | P10–P90 percentile bars                  |
| **Volatility & Festival** | Route risk + Diwali demand impact        |
| **DGCA Validation**       | APIx vs benchmark backtesting            |
| **Data Quality**          | Coverage metrics + source health         |
| **Policy Alerts**         | Real-time anomaly notifications          |
| **Gov API**               | `/index` `/routes` `/fares` endpoints    |
| **Data Explorer**         | Live fare table with export              |


---



## Design

- **Theme:** Notion dark (`#191919` background, subtle borders, muted typography)
- **Typography:** Inter — clean, Apple/Google-style hierarchy
- **Charts:** Recharts with custom tooltips
- **Icons:** Lucide React
- **Layout:** Responsive grid, sticky header, glassmorphism cards

---



## Project Structure

```
SIH-26056/
├── README.md
└── dashboard/          ← React + Vite + Tailwind
    ├── src/
    │   ├── components/  ← UI modules
    │   ├── data/        ← Mock dataset
    │   └── App.tsx
    └── package.json
```

---

SIH-26056 · NSO / RBI Analytics · Domestic Airfare Monitoring Platform# SIH-26056
