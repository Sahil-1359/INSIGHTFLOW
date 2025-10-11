// Lightweight local dev API for AI analysis (CommonJS)
// Runs on http://localhost:3001 and mirrors /api/analyze route

const express = require('express');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// Prefer .env.local if present
const localEnv = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(localEnv)) {
  require('dotenv').config({ path: localEnv, override: true });
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use('/api/analyze', express.text({ type: '*/*', limit: '30mb' }));

const SYSTEM_PROMPT = `You are a data analytics expert. Analyze CSV data and return structured business insights in valid JSON format only. No additional text.`;

// Create a representative CSV sample for large files to control token usage
function sampleCSV(csvText, maxBytes = 1000000, headRows = 200, tailRows = 50, randomRows = 500) {
  try {
    if (!csvText || typeof csvText !== 'string') return '';
    if (Buffer.byteLength(csvText, 'utf8') <= maxBytes) return csvText;
    const lines = csvText.split(/\r?\n/);
    if (lines.length <= headRows + tailRows + randomRows + 1) return csvText.slice(0, maxBytes);
    const header = lines[0] || '';
    const body = lines.slice(1);
    const head = body.slice(0, headRows);
    const tail = body.slice(-tailRows);
    const pool = body.slice(headRows, Math.max(headRows, body.length - tailRows));
    const sampled = [];
    const step = Math.max(1, Math.floor(pool.length / Math.max(1, randomRows)));
    for (let i = 0; i < pool.length && sampled.length < randomRows; i += step) sampled.push(pool[i]);
    const combined = [header, ...head, ...sampled, ...tail].join('\n');
    return combined.slice(0, maxBytes);
  } catch {
    return csvText;
  }
}

function isValidAIResponse(obj) {
  try {
    if (!obj || typeof obj !== 'object') return false;
    const dq = obj.dataQuality || {};
    const okDQ = typeof dq.completeness === 'number' && typeof dq.accuracy === 'number' && typeof dq.anomalies === 'number' && typeof dq.summary === 'string';
    const okInsights = Array.isArray(obj.insights);
    const okRecs = Array.isArray(obj.recommendations);
    return okDQ && okInsights && okRecs && typeof obj.summary === 'string';
  } catch {
    return false;
  }
}

app.post('/api/analyze', async (req, res) => {
  try {
    const csvData = typeof req.body === 'string' ? req.body : '';
    if (!csvData) return res.status(400).json({ error: 'csvData string is required in request body' });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });

    const client = new OpenAI({ apiKey });

    const sampled = sampleCSV(csvData);
    const userPrompt = `Analyze this CSV and provide executive-grade insights. Be precise, quantify findings, and focus on business impact.\n\nCSV Sample (file may be larger; sample provided):\n${sampled}\n\nRequirements:\n- Provide at least 8 diverse insights spanning: trends, seasonalities, correlations, segmentation, anomalies/outliers, KPI drivers, cohort/retention (if dates), and risk flags.\n- Provide at least 6 actionable recommendations ranked by impact/ROI with realistic effort.\n- Use confidence (0-100) justified by sample size/signal strength.\n- Use clear business language with numbers, percentages, and time windows.\n- If a category is not applicable, substitute the closest meaningful analysis.\n\nReturn ONLY valid JSON with this exact structure:\n{\n"dataQuality": {\n"completeness": number (0-100),\n"accuracy": number (0-100),\n"anomalies": number (0-100),\n"summary": "brief quality assessment"\n},\n"insights": [\n{\n"title": "insight title",\n"description": "detailed finding with quantified evidence",\n"type": "trend|pattern|anomaly|correlation|segmentation|seasonality|cohort|risk|kpi",\n"impact": "high|medium|low",\n"confidence": number (0-100)\n}\n],\n"recommendations": [\n{\n"title": "recommendation title",\n"description": "actionable advice with how-to steps and guardrails",\n"priority": "high|medium|low",\n"effort": "low|medium|high",\n"expectedROI": "percentage or description"\n}\n],\n"summary": "executive summary of key findings"\n}\n\nHard constraints:\n- JSON must parse without errors.\n- Do not include markdown, code fences, or extra keys.\n- Keep numbers realistic and derived from the provided data.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort('timeout'), 60000);
    let content;
    try {
      const resp = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.35,
        response_format: { type: 'json_object' }
      }, { signal: controller.signal });
      content = resp?.choices?.[0]?.message?.content?.trim() || '{}';
    } finally {
      clearTimeout(timeout);
    }

    let first;
    try { first = JSON.parse(content); } catch { first = {}; }

    const minInsights = 8;
    const minRecs = 6;
    const haveEnough = Array.isArray(first?.insights) && first.insights.length >= minInsights && Array.isArray(first?.recommendations) && first.recommendations.length >= minRecs;
    let finalData = first;
    if (!haveEnough) {
      const enrichPrompt = `You previously returned this JSON. Expand it to include AT LEAST ${minInsights} insights and AT LEAST ${minRecs} recommendations. Diversify categories (trend, seasonality, correlation, segmentation, anomaly, cohort, risk, KPI). Avoid duplicates, keep schema and keys exactly the same, keep numbers realistic and consistent with the CSV sample. Return ONLY the full JSON object.\n\nCURRENT_JSON:\n${JSON.stringify(first)}`;
      const resp2 = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: enrichPrompt }
        ],
        temperature: 0.35,
        response_format: { type: 'json_object' }
      });
      const content2 = resp2?.choices?.[0]?.message?.content?.trim() || '{}';
      try { finalData = JSON.parse(content2); } catch { finalData = first; }
    }

    if (!isValidAIResponse(finalData)) {
      return res.json({ aiEnabled: true, aiUsed: false, error: 'Invalid AI response format', fallback: true });
    }

    res.json({ aiEnabled: true, aiUsed: true, data: finalData });
  } catch (e) {
    res.json({ aiEnabled: true, aiUsed: false, error: e?.message || 'AI analysis failed', fallback: true });
  }
});

app.listen(PORT, () => {
  console.log(`Dev AI API running at http://localhost:${PORT}`);
});
