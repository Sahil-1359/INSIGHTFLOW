import React, { createContext, useContext, useMemo, useState } from 'react';
import Papa from 'papaparse';

const DataContext = createContext(null);

export const useDataContext = () => useContext(DataContext);

function isNumeric(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

function detectNumericColumns(rows, columns) {
  const numericCols = new Set();
  columns.forEach((col) => {
    let numericCount = 0;
    let total = 0;
    for (let i = 0; i < rows.length; i++) {
      const v = rows[i]?.[col];
      if (v === '' || v === null || v === undefined) continue;
      total++;
      const num = typeof v === 'number' ? v : Number(v);
      if (Number.isFinite(num)) numericCount++;
    }
    const ratio = total === 0 ? 0 : numericCount / total;
    if (ratio >= 0.7) numericCols.add(col);
  });
  return Array.from(numericCols);
}

function computeMetrics(rows, columns) {
  const totalCells = rows.length * columns.length;
  let nonEmpty = 0;
  rows.forEach((r) => {
    columns.forEach((c) => {
      const v = r?.[c];
      if (v !== '' && v !== null && v !== undefined) nonEmpty++;
    });
  });
  const completeness = totalCells === 0 ? 0 : (nonEmpty / totalCells) * 100;

  const numericCols = detectNumericColumns(rows, columns);

  // Accuracy: share of numeric cells that are valid numbers among numeric columns
  let validNumeric = 0;
  let numericTotal = 0;
  rows.forEach((r) => {
    numericCols.forEach((c) => {
      const num = Number(r?.[c]);
      if (!Number.isNaN(num)) validNumeric++;
      numericTotal++;
    });
  });
  const accuracy = numericTotal === 0 ? 100 : (validNumeric / numericTotal) * 100;

  // Anomalies: percentage of points > 3 std dev from mean for first numeric column
  let anomaliesPct = 0;
  if (numericCols.length > 0) {
    const c = numericCols[0];
    const vals = rows
      .map((r) => Number(r?.[c]))
      .filter((n) => Number.isFinite(n));
    if (vals.length > 3) {
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const variance = vals.reduce((a, b) => a + (b - mean) * (b - mean), 0) / vals.length;
      const std = Math.sqrt(variance) || 0;
      const outliers = std === 0 ? 0 : vals.filter((v) => Math.abs(v - mean) > 3 * std).length;
      anomaliesPct = (outliers / vals.length) * 100;
    }
  }

  return {
    completeness: Number.isFinite(completeness) ? Math.max(0, Math.min(100, completeness)) : 0,
    accuracy: Number.isFinite(accuracy) ? Math.max(0, Math.min(100, accuracy)) : 0,
    anomalies: Number.isFinite(anomaliesPct) ? Math.max(0, Math.min(100, anomaliesPct)) : 0,
    totalRecords: rows.length,
    columns: columns.length,
    validRecords: rows.length - 0,
    issuesFound: Math.round((100 - (Number.isFinite(accuracy) ? accuracy : 100)) / 4),
    numericCols,
  };
}

function buildCharts(rows, columns) {
  const numericCols = detectNumericColumns(rows, columns);
  const charts = {};

  // Trends: if a date-like column and a numeric column exist, aggregate by month
  const dateCol = columns.find((c) => /date/i.test(c));
  const numCol = numericCols[0];
  if (dateCol && numCol) {
    const byMonth = new Map();
    rows.forEach((r) => {
      const d = new Date(r?.[dateCol]);
      const n = Number(r?.[numCol]);
      if (!Number.isFinite(d.getTime()) || !Number.isFinite(n)) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      byMonth.set(key, (byMonth.get(key) || 0) + n);
    });
    charts.trends = Array.from(byMonth.entries())
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([month, revenue]) => ({ month, revenue }));
  }

  // Demographics: prefer non-numeric, non-date/time columns with small unique count (<= 12)
  const dateLike = (name) => /date|time|timestamp|day|month|year/i.test(String(name));
  const categoricalCandidates = columns.filter((c) => !numericCols.includes(c) && !dateLike(c));
  let chosenCategorical = null;
  let chosenEntries = null;
  for (const c of categoricalCandidates) {
    const counts = new Map();
    rows.forEach((r) => {
      const v = r?.[c];
      if (v === '' || v === null || v === undefined) return;
      counts.set(String(v), (counts.get(String(v)) || 0) + 1);
    });
    const uniqueCount = counts.size;
    if (uniqueCount > 0 && uniqueCount <= 12) {
      chosenCategorical = c;
      chosenEntries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
      break;
    }
  }
  if (!chosenCategorical && categoricalCandidates.length) {
    // fallback: pick the first, but cap to top 6 values
    const c = categoricalCandidates[0];
    const counts = new Map();
    rows.forEach((r) => {
      const v = r?.[c];
      if (v === '' || v === null || v === undefined) return;
      counts.set(String(v), (counts.get(String(v)) || 0) + 1);
    });
    chosenCategorical = c;
    chosenEntries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }
  if (chosenEntries) {
    charts.demographics = chosenEntries
      .map(([age, value]) => ({ age: String(age), value: Number.isFinite(value) && value > 0 ? value : 0 }))
      .filter((d) => d.value > 0);
  }

  // Performance: build from numeric columns current vs target as simple scaled numbers
  if (numericCols.length >= 2) {
    charts.performance = numericCols.slice(0, 5).map((c, idx) => {
      const vals = rows.map((r) => Number(r?.[c])).filter((n) => Number.isFinite(n));
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      const target = avg * 1.1;
      return { category: c, current: Math.round(avg), target: Math.round(target), budget: Math.round(target * 100) };
    });
  }

  // Growth: create quarter sequence if trends exist
  if (charts.trends && charts.trends.length) {
    charts.growth = charts.trends.slice(-6).map((t, i) => ({ quarter: `P${i + 1}`, growth: Math.max(0, Math.round((t.revenue / (charts.trends[0].revenue || 1)) * 10)), forecast: Math.max(0, Math.round((t.revenue / (charts.trends[0].revenue || 1)) * 12)) }));
  }

  return charts;
}

export const DataProvider = ({ children }) => {
  const [fileInfo, setFileInfo] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState(null);
  // AI insights state
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(
    String(import.meta?.env?.VITE_AI_INSIGHTS_ENABLED || '').toLowerCase() === 'true'
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [aiUsed, setAiUsed] = useState(false);
  const [lastCsvText, setLastCsvText] = useState(null);

  const generateAIInsights = async (csvText) => {
    setAiLoading(true);
    setAiError(null);
    setAiData(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: csvText,
      });
      const json = await res.json();
      if (json?.aiUsed && json?.data) {
        setAiData(json?.data);
        setAiUsed(true);
      } else {
        setAiData(null);
        setAiUsed(false);
      }
    } catch (e) {
      setAiError(e?.message || 'Failed to generate AI insights');
      setAiData(null);
      setAiUsed(false);
    } finally {
      setAiLoading(false);
    }
  };

  const ingestCSV = (file) => new Promise(async (resolve, reject) => {
    try {
      const csvText = await file.text();
      setLastCsvText(csvText);
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: async (result) => {
          const dataRows = result.data || [];
          const cols = result.meta?.fields || Object.keys(dataRows[0] || {});
          setFileInfo({ name: file.name, size: file.size, lastModified: file.lastModified });
          setRows(dataRows);
          setColumns(cols);
          const m = computeMetrics(dataRows, cols);
          setMetrics(m);
          const c = buildCharts(dataRows, cols);
          setCharts(c);

          // Always call AI overlay (toggle removed)
          generateAIInsights(csvText);

          resolve({ rows: dataRows, columns: cols, metrics: m, charts: c });
        },
        error: (err) => reject(err),
      });
    } catch (e) {
      reject(e);
    }
  });

  // Re-run AI on the last uploaded CSV without re-uploading
  const reanalyzeAI = async () => {
    if (!lastCsvText) return;
    if (!aiInsightsEnabled) return;
    await generateAIInsights(lastCsvText);
  };

  const value = useMemo(() => ({ 
    fileInfo, rows, columns, metrics, charts, ingestCSV,
    aiInsightsEnabled, setAiInsightsEnabled, aiLoading, aiError, aiData, aiUsed,
    generateAIInsights, reanalyzeAI,
  }), [fileInfo, rows, columns, metrics, charts, aiInsightsEnabled, aiLoading, aiError, aiData, aiUsed]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
