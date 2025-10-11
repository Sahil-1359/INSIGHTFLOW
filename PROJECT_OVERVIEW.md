# InsightFlow — Project Overview

## 1. Project Overview

InsightFlow is a lightweight, client‑side analytics app that converts a raw CSV into a readable dashboard within seconds. Users upload a CSV, the app profiles the data, computes quality metrics (completeness, validity, anomaly signal), and visualizes patterns with interactive charts. A simple insight and recommendation layer summarizes what to do next.

What makes it unique:
- **Zero backend required** for the demo: all parsing and calculations run in the browser.
- **Immediate feedback**: users see metrics, charts, insights, and recommendations within a few seconds of upload.
- **Guarded visualizations**: charts auto‑hide or degrade gracefully when the dataset doesn’t support them.

Core workflow: CSV Upload → Local AI-like Analysis → Results Dashboard.

## 2. Technology Stack

- **React 18**: UI composition and state. Well-known, flexible.
- **Vite**: Dev server and bundler. Fast HMR and simple config.
- **Tailwind CSS + Plugins**: Utility-first styling with consistent, themeable design.
- **Recharts**: Charting primitives for line, pie, bar, and area charts.
- **Framer Motion**: Subtle animations and progress transitions.
- **PapaParse**: Robust CSV parsing in the browser with streaming.
- **date-fns**: Lightweight date operations.
- **lucide-react**: Icon system for clean UI affordances.
- **clsx / class-variance-authority (CVA) / tailwind-merge**: Predictable, composable UI variants.

Reasoning: The stack keeps everything client-side, fast, and easy to deploy statically. Libraries were chosen for developer velocity and strong ecosystem support.

## 3. How The App Works

From the user’s perspective:
- **Step 1: Upload** a CSV via drag & drop on `Upload Data`.
- **Step 2: Analyze**: the app parses the file, infers basic types, computes quality metrics, detects numeric columns, and builds chart datasets.
- **Step 3: View Results**: after a short progress screen, the dashboard shows KPIs, charts, insights, and recommendations.

Behind the scenes (high level):
1. `DataContext` uses PapaParse to read the CSV with headers and dynamic typing.
2. It computes metrics (completeness, numeric parse rate proxy, an anomaly signal).
3. It builds data for charts (trends by month if a date column exists; category distribution; performance bars; growth proxy).
4. Pages/components render using context data and guard against invalid/insufficient values.

### Data flow diagram
```mermaid
flowchart LR
  U[User selects CSV] --> P[PapaParse (header, dynamicTyping)]
  P --> R[Rows + Columns]
  R --> M[Compute metrics (completeness, validity, anomalies)]
  R --> C[Build charts (trends, demographics, performance, growth)]
  M --> D[DataContext Store]
  C --> D
  D --> L[Loading Screen]
  L --> B[Results Dashboard]
  B -->|Insights/Recommendations| U
```

### Pseudocode
```js
onAnalyze(file) {
  const { rows, columns } = parseCSV(file)
  const metrics = computeMetrics(rows, columns)
  const charts = buildCharts(rows, columns)
  setContext({ fileInfo, rows, columns, metrics, charts })
  navigate('/results-dashboard')
}
```

## 4. Key Features

- **CSV drag & drop upload** with live validation and preview.
- **Local, AI‑inspired analysis**
  - Data quality: completeness %, numeric validity proxy.
  - Anomaly signal detection on a selected/first numeric column.
  - Automated trend and distribution construction when data supports it.
- **Dashboard** with:
  - KPIs: completeness, accuracy proxy, anomalies, record/column counts.
  - Charts: Revenue/metric trends, demographics pie, performance bar, growth area.
  - Insight cards and data‑driven recommendations.
- **Error handling**: invalid/insufficient data leads to guarded empty states (no crashes or misleading visuals).
- **Responsive design**: usable on desktop and mobile.

## 5. What Insights Does It Give?

- **Data Completeness**: Share of non‑empty cells; helps gauge overall data readiness.
- **Accuracy (Proxy)**: Numeric parse success rate on numeric columns; highlights potential type issues.
- **Anomalies**: % of suspected outliers on a numeric metric using a simple 3σ rule; flags potential data quality or business spikes.
- **Trends**: Monthly aggregation if a date column is present; reveals seasonality or growth.
- **Demographics/Distribution**: Top categories (e.g., customer segment) to see skew or concentration.
- **Performance Bars**: Average per numeric column vs a simple auto target (for relative comparison).
- **Recommendations**: Actionable items derived from metrics (e.g., improve completeness, investigate outliers, amplify top segment).

> Note: Metrics are designed for rapid feedback, not full data governance. For production, swap heuristics for business‑validated rules and column mapping.

## 6. Files and Folder Structure

```
/ (project root)
├─ index.html
├─ vite.config.mjs                   # Vite config (port, build dir)
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ PROJECT_OVERVIEW.md               # This document
└─ src/
   ├─ App.jsx                        # Wraps Routes with DataProvider
   ├─ Routes.jsx                     # Application routes
   ├─ index.jsx                      # React root (Tailwind styles imported)
   ├─ styles/
   │  ├─ tailwind.css                # Tailwind entry
   │  └─ index.css                   # Global styles
   ├─ context/
   │  └─ DataContext.jsx             # CSV parsing, metrics, charts, shared state
   ├─ components/
   │  ├─ AppIcon.jsx
   │  ├─ ScrollToTop.jsx
   │  └─ ui/
   │     ├─ Header.jsx
   │     ├─ Button.jsx
   │     └─ ActionContextMenu.jsx
   ├─ pages/
   │  ├─ csv-upload-interface/
   │  │  └─ index.jsx                # Upload page (drag & drop, preview, analyze)
   │  ├─ analysis-loading-screen/
   │  │  └─ index.jsx                # Progress simulation then navigate to results
   │  └─ results-dashboard/
   │     ├─ index.jsx                # Dashboard shell
   │     └─ components/
   │        ├─ DataQualityOverview.jsx
   │        ├─ InteractiveCharts.jsx
   │        ├─ InsightsSection.jsx
   │        ├─ RecommendationsPanel.jsx
   │        └─ ExportToolbar.jsx
   └─ sample-data/
      └─ test_sales.csv              # Example CSV for demo/testing
```

## 7. Setup & Usage

Prerequisites: Node 18+ recommended.

Install and run:
```bash
npm install
npm start
```
Open the app:
- Local: `http://localhost:4028`

Usage:
1. Go to `Upload Data` → drop a CSV with a header row.
2. Click `Start AI Analysis`.
3. Review KPIs, charts, and insights on the `Dashboard`.

Environment variables:
- None required for this client‑only demo.
- Future extensions (optional): keys for back‑end analysis APIs or storage.

## 8. Deployment

This app is a static frontend; deploy on:
- **Vercel**, **Netlify**, **GitHub Pages**, or any static hosting.

Build and preview locally:
```bash
npm run build       # outputs to /build (per vite.config.mjs)
npm run serve       # preview the built site
```

Environment variables (future):
- `VITE_API_BASE_URL` – if introducing a backend for heavier analysis/export.

## 9. Sample Output

Dashboard sample (conceptual):
- KPIs: `Completeness 93.4%`, `Accuracy 88.0%`, `Anomalies 4.2%`, `Records 15,847`.
- Charts: Monthly metric trend, top 5 categories pie, performance bars.
- Insights:
  - “Your dataset is 93.4% complete across 12 columns and 15,847 records.”
  - “2.1% of numeric points look anomalous based on a 3σ rule.”
  - “Top segment contributes 38% of rows; consider targeted initiatives.”

Example analysis payload (JSON) exposed in context:
```json
{
  "fileInfo": { "name": "sales.csv", "size": 123456 },
  "metrics": {
    "completeness": 93.4,
    "accuracy": 88.0,
    "anomalies": 4.2,
    "totalRecords": 15847,
    "columns": 12,
    "validRecords": 14932,
    "issuesFound": 23,
    "numericCols": ["Quantity", "Revenue", "Cost"]
  },
  "charts": {
    "trends": [{ "month": "2024-01", "revenue": 45000 }, { "month": "2024-02", "revenue": 52000 }],
    "demographics": [{ "age": "Consumer", "value": 6840 }, { "age": "SMB", "value": 5130 }],
    "performance": [{ "category": "Revenue", "current": 87000, "target": 95700 }],
    "growth": [{ "quarter": "P1", "growth": 9, "forecast": 11 }]
  }
}
```

## 10. Contact / Credits

- **Author**: InsightFlow Team
- **Contact**: team@example.com
- **Tech Credits**: React, Vite, Tailwind CSS, Recharts, PapaParse, date‑fns, lucide-react, Framer Motion.
- **License**: MIT (optional; update as needed)
