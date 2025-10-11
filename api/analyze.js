// /api/analyze.js - Serverless API route for AI insights (Vercel/Netlify-compatible)
// Accepts POST with raw CSV text in body and returns structured JSON insights.

import OpenAI from 'openai';

export const config = { runtime: 'edge' };

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

    // random unique indices for sampling
    const pool = body.slice(headRows, Math.max(headRows, body.length - tailRows));
    const sampled = [];
    const step = Math.max(1, Math.floor(pool.length / Math.max(1, randomRows)));
    for (let i = 0; i < pool.length && sampled.length < randomRows; i += step) sampled.push(pool[i]);

    const combined = [header, ...head, ...sampled, ...tail].join('\n');
    return combined.slice(0, maxBytes);
  } catch {
    return csvText.slice(0, maxBytes);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function parseRequestBody(req) {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return req.json();
  }
  return req.text();
}

async function callOpenAI(csvData, signal) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }
  const client = new OpenAI({ apiKey });

  const sampled = sampleCSV(csvData);
  const userPrompt = `Analyze this CSV and provide executive-grade insights. Be precise, quantify findings, and focus on business impact.\n\nCSV Sample (file may be larger; sample provided):\n${sampled}\n\nRequirements:\n- Provide at least 8 diverse insights spanning: trends, seasonalities, correlations, segmentation, anomalies/outliers, KPI drivers, cohort/retention (if dates), and risk flags.\n- Provide at least 6 actionable recommendations ranked by impact/ROI with realistic effort.\n- Use confidence (0-100) justified by sample size/signal strength.\n- Use clear business language with numbers, percentages, and time windows.\n- If a category is not applicable, substitute the closest meaningful analysis.\n\nReturn ONLY valid JSON with this exact structure:\n{\n"dataQuality": {\n"completeness": number (0-100),\n"accuracy": number (0-100),\n"anomalies": number (0-100),\n"summary": "brief quality assessment"\n},\n"insights": [\n{\n"title": "insight title",\n"description": "detailed finding with quantified evidence",\n"type": "trend|pattern|anomaly|correlation|segmentation|seasonality|cohort|risk|kpi",\n"impact": "high|medium|low",\n"confidence": number (0-100)\n}\n],\n"recommendations": [\n{\n"title": "recommendation title",\n"description": "actionable advice with how-to steps and guardrails",\n"priority": "high|medium|low",\n"effort": "low|medium|high",\n"expectedROI": "percentage or description"\n}\n],\n"summary": "executive summary of key findings"\n}\n\nHard constraints:\n- JSON must parse without errors.\n- Do not include markdown, code fences, or extra keys.\n- Keep numbers realistic and derived from the provided data.`;

  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  }, { signal });

  const content = resp?.choices?.[0]?.message?.content?.trim() || '{}';
  let first = {};
  try { first = JSON.parse(content); } catch { first = {}; }

  // If not enough items, ask the model to enrich while preserving schema
  const minInsights = 8;
  const minRecs = 6;
  const haveEnough = Array.isArray(first?.insights) && first.insights.length >= minInsights && Array.isArray(first?.recommendations) && first.recommendations.length >= minRecs;
  if (haveEnough) return first;

  const enrichPrompt = `You previously returned this JSON. Expand it to include AT LEAST ${minInsights} insights and AT LEAST ${minRecs} recommendations. Diversify categories (trend, seasonality, correlation, segmentation, anomaly, cohort, risk, KPI). Avoid duplicates, keep schema and keys exactly the same, keep numbers realistic and consistent with the CSV sample. Return ONLY the full JSON object.\n\nCURRENT_JSON:\n${JSON.stringify(first)}`;

  const resp2 = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: enrichPrompt }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  }, { signal });
  const content2 = resp2?.choices?.[0]?.message?.content?.trim() || '{}';
  try { return JSON.parse(content2); } catch { return first; }
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

export default async function handler(req) {
  if (req.method && req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = await parseRequestBody(req);
    const csvData = typeof body === 'string' ? body : body?.csvData;
    if (!csvData || typeof csvData !== 'string') {
      return jsonResponse({ error: 'csvData string is required in request body' }, 400);
    }

    // 60s timeout (large CSVs and enrichment pass may need more time)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort('Request timed out'), 60000);

    let ai;
    try {
      ai = await callOpenAI(csvData, controller.signal);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!isValidAIResponse(ai)) {
      return jsonResponse({
        aiEnabled: true,
        aiUsed: false,
        error: 'Invalid AI response format',
        fallback: true
      }, 200);
    }

    return jsonResponse({ aiEnabled: true, aiUsed: true, data: ai }, 200);
  } catch (err) {
    return jsonResponse({
      aiEnabled: true,
      aiUsed: false,
      error: err?.message || 'AI analysis failed',
      fallback: true
    }, 200);
  }
}
