import React, { useMemo, useRef, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useDataContext } from '../../../context/DataContext';

const InsightsSection = () => {
  const { metrics, charts, aiData, aiLoading, rows, columns } = useDataContext();
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [filterConfidence, setFilterConfidence] = useState('all');
  const [typeFilters, setTypeFilters] = useState([]); // ['Trend','Seasonality',...]
  const [rowsByInsight, setRowsByInsight] = useState({}); // id -> array
  const [rowsTitleByInsight, setRowsTitleByInsight] = useState({});
  const rowsRefMap = useRef({});

  const generatedInsights = useMemo(() => {
    if (aiData?.insights?.length) {
      return aiData.insights.map((it, idx) => ({
        id: `ai-${idx}`,
        title: it.title,
        summary: it.description,
        confidence: Number(it.confidence ?? 80),
        priority: (it.impact || 'medium')?.replace(/^./, c => c.toUpperCase()),
        category: (it.type || 'Pattern')?.replace(/^./, c => c.toUpperCase()),
        impact: (it.impact || 'medium')?.replace(/^./, c => c.toUpperCase()),
        details: it.description,
        recommendations: [],
        supportingData: {},
        _source: 'ai'
      }));
    }
    const list = [];
    if (!metrics) return list;

    // Insight 1: Data completeness
    if (Number.isFinite(metrics.completeness)) {
      list.push({
        id: 'i1',
        title: 'Data Completeness Overview',
        summary: `Your dataset is ${metrics.completeness.toFixed(1)}% complete across ${metrics.columns} columns and ${metrics.totalRecords} records.`,
        confidence: 95,
        priority: metrics.completeness < 85 ? 'High' : 'Medium',
        category: 'Data Quality',
        impact: metrics.completeness < 85 ? 'High' : 'Medium',
        details: `Completeness is calculated as the share of non-empty cells. Consider filling missing values or removing sparse columns to improve quality.`,
        recommendations: [
          metrics.completeness < 90 ? 'Impute missing values for key numeric columns.' : 'Completeness looks good; monitor over time.',
        ],
        supportingData: { completeness: metrics.completeness },
      });
    }

    // Insight 2: Anomalies
    if (Number.isFinite(metrics.anomalies)) {
      list.push({
        id: 'i2',
        title: 'Potential Outliers Detected',
        summary: `${metrics.anomalies.toFixed(1)}% of numeric points look anomalous based on a 3σ rule.`,
        confidence: 80,
        priority: metrics.anomalies > 10 ? 'High' : 'Low',
        category: 'Anomalies',
        impact: metrics.anomalies > 10 ? 'High' : 'Low',
        details: `We compute outliers for the leading numeric column using mean ± 3×std deviation.`,
        recommendations: [
          'Review the values and confirm whether they are data-entry errors or real extremes.',
        ],
        supportingData: { anomaliesPct: metrics.anomalies },
      });
    }

    // Insight 3: Trend summary if available
    if (charts?.trends?.length) {
      const last = charts.trends[charts.trends.length - 1]?.revenue ?? 0;
      list.push({
        id: 'i3',
        title: 'Recent Trend Summary',
        summary: `Latest period shows value ${Number(last).toLocaleString()}.`,
        confidence: 85,
        priority: 'Medium',
        category: 'Trends',
        impact: 'Medium',
        details: `Trends are built by aggregating the first numeric column by month (if date column exists).`,
        recommendations: ['Compare against previous periods to validate seasonality or campaign effects.'],
        supportingData: { latest: last },
      });
    }

    return list;
  }, [metrics, charts, aiData]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  // Build a small chart dataset based on category
  const getMiniChart = (insight) => {
    const category = String(insight?.category || '').toLowerCase();
    // Trend: sparkline from charts.trends
    if ((category.includes('trend') || category.includes('season')) && charts?.trends?.length) {
      const data = charts.trends.slice(-12).map(d => ({ x: d.month, y: Number(d.revenue)||0 }));
      return (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="x" stroke="#94a3b8" fontSize={11} label={{ value: 'Time (month)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
            <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Revenue', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v)=> v.toLocaleString()} labelFormatter={(l)=> String(l)} />
            <Line type="monotone" dataKey="y" stroke="#06b6d4" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    // Anomaly: histogram of first numeric col
    const num = getFirstNumericCol;
    if (category.includes('anomaly') && num) {
      const vals = (rows||[]).map(r=>Number(r?.[num])).filter(Number.isFinite);
      if (vals.length >= 5) {
        const min = Math.min(...vals); const max = Math.max(...vals); const bins = 8;
        const step = (max - min) / (bins || 1) || 1;
        const counts = Array.from({length: bins}, (_,i)=>({x: (min+i*step), c:0}));
        for (const v of vals) { const idx = Math.min(bins-1, Math.max(0, Math.floor((v-min)/step))); counts[idx].c++; }
        const data = counts.map((b,i)=>({ x: `B${i+1}`, y: b.c }));
        return (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="x" stroke="#94a3b8" fontSize={11} label={{ value: 'Bins', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Frequency', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="y" fill="#1e40af" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      }
    }
    // Segmentation: bar by top categories of detected categorical col
    const ccol = detectCategorical;
    if ((category.includes('segment') || category.includes('category')) && ccol) {
      const counts = new Map();
      (rows||[]).forEach(r=>{ const v = r?.[ccol]; if (v!==''&&v!==null&&v!==undefined){ counts.set(String(v),(counts.get(String(v))||0)+1);} });
      const data = Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,c])=>({ x: k, y: c }));
      return (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="x" stroke="#94a3b8" fontSize={11} interval={0} tickLine={false} angle={0} height={30} label={{ value: ccol, position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
            <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Rows', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Bar dataKey="y" fill="#06b6d4" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    return null;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success bg-success/10';
    if (confidence >= 75) return 'text-warning bg-warning/10';
    return 'text-destructive bg-destructive/10';
  };

  const getImpactIcon = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'TrendingUp';
      case 'medium':
        return 'BarChart3';
      case 'low':
        return 'Minus';
      default:
        return 'Activity';
    }
  };

  const filteredInsights = generatedInsights?.filter(insight => {
    if (filterConfidence === 'all') return true;
    if (filterConfidence === 'high') return insight?.confidence >= 90;
    if (filterConfidence === 'medium') return insight?.confidence >= 75 && insight?.confidence < 90;
    if (filterConfidence === 'low') return insight?.confidence < 75;
    return true;
  }).filter(insight => {
    if (!typeFilters?.length) return true;
    return typeFilters.includes(String(insight?.category || '').split(' ')[0]);
  });

  const toggleExpanded = (insightId) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId);
  };

  const typeOptions = ['Trend','Seasonality','Correlation','Segmentation','Anomaly','Cohort','Risk','KPI','Data','Trends','Anomalies'];

  // Helpers for drilldown
  const getFirstNumericCol = useMemo(() => (metrics?.numericCols?.[0] || null), [metrics]);
  const getDateCol = useMemo(() => (columns?.find(c => /date|time|timestamp|day|month|year/i.test(String(c))) || null), [columns]);
  const detectCategorical = useMemo(() => {
    if (!columns) return null;
    const numericSet = new Set(metrics?.numericCols || []);
    const candidates = columns.filter(c => !numericSet.has(c) && !/date|time|timestamp|day|month|year/i.test(String(c)));
    return candidates[0] || null;
  }, [columns, metrics]);

  const computeAnomalyThresholds = () => {
    try {
      const col = getFirstNumericCol; if (!col) return null;
      const vals = (rows || []).map(r => Number(r?.[col])).filter(Number.isFinite);
      if (vals.length < 4) return null;
      const mean = vals.reduce((a,b)=>a+b,0)/vals.length;
      const variance = vals.reduce((a,b)=>a+(b-mean)*(b-mean),0)/vals.length;
      const std = Math.sqrt(variance)||0;
      return { col, mean, std };
    } catch { return null; }
  };

  // Infer supporting rows for an insight by mining referenced columns/values and category
  const extractMentionedTokens = (text) => {
    if (!text) return [];
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9_%\-\s]/g,' ')
      .split(/\s+/)
      .filter(Boolean);
  };

  const openSupportingRows = (insight) => {
    if (!rows || !columns) return;
    // Toggle: if already open for this insight, hide it
    if (Array.isArray(rowsByInsight[insight.id])) {
      setRowsByInsight(prev => { const n = { ...prev }; delete n[insight.id]; return n; });
      return;
    }
    const category = String(insight?.category || '').toLowerCase();
    const tokens = new Set([...extractMentionedTokens(insight?.title), ...extractMentionedTokens(insight?.summary)]);
    let subset = rows;
    let title = `${insight?.title} • Supporting rows`;

    // 1) Anomaly/outlier filter (3σ) on first numeric col or mentioned numeric column
    if (category.includes('anomaly') || tokens.has('outlier') || tokens.has('anomalies')) {
      const th = computeAnomalyThresholds();
      if (th && th.std > 0) {
        subset = rows.filter(r => {
          const v = Number(r?.[th.col]);
          return Number.isFinite(v) && Math.abs(v - th.mean) > 3*th.std;
        });
        title = `${insight?.title} • Outliers on ${th.col}`;
      }
    }

    // 2) Trend/Seasonality: use date col and restrict to latest period window
    else if (category.includes('trend') || category.includes('season')) {
      const dcol = getDateCol;
      if (dcol) {
        const valid = rows.filter(r => Number.isFinite(new Date(r?.[dcol]).getTime()));
        valid.sort((a,b)=> new Date(b[dcol]) - new Date(a[dcol]));
        const latest = valid[0]?.[dcol];
        const latestMonth = latest ? new Date(latest).getMonth() : null;
        subset = latestMonth === null ? valid.slice(0,100) : valid.filter(r => new Date(r?.[dcol]).getMonth() === latestMonth);
        title = `${insight?.title} • Latest period (${dcol})`;
      }
    }

    // 3) Segmentation: find categorical column mentioned in text and filter to top or named segment
    else if (category.includes('segment') || tokens.has('segment') || tokens.has('category')) {
      const ccol = detectCategorical;
      if (ccol) {
        let target = null;
        // Attempt to detect named segment in text
        const values = new Set(rows.map(r => String(r?.[ccol])).filter(v => v && v!=='undefined'));
        for (const v of values) { if (tokens.has(String(v).toLowerCase())) { target = v; break; } }
        if (!target) {
          const counts = new Map();
          rows.forEach(r=>{ const v = r?.[ccol]; if (v!==''&&v!==null&&v!==undefined){ counts.set(String(v),(counts.get(String(v))||0)+1);} });
          target = Array.from(counts.entries()).sort((a,b)=>b[1]-a[1])[0]?.[0];
        }
        subset = rows.filter(r => String(r?.[ccol]) === String(target));
        title = `${insight?.title} • ${ccol} = ${target}`;
      }
    }

    // 4) Correlation/KPI: pick first two numeric cols and show rows with both present
    else if (category.includes('correlation') || category.includes('kpi')) {
      const nums = metrics?.numericCols || [];
      if (nums.length >= 2) {
        const [a,b] = nums;
        subset = rows.filter(r => Number.isFinite(Number(r?.[a])) && Number.isFinite(Number(r?.[b])));
        title = `${insight?.title} • Rows with ${a} & ${b}`;
      }
    }

    // Fallback: keep small sample not full table
    subset = (subset || []).slice(0, 100);
    setRowsByInsight(prev => ({ ...prev, [insight.id]: subset }));
    setRowsTitleByInsight(prev => ({ ...prev, [insight.id]: title }));

    // Scroll into view
    requestAnimationFrame(() => {
      const el = rowsRefMap.current[insight.id];
      if (el?.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  // Build richer detailed text when expanded using current data
  const buildDetailedText = (insight) => {
    try {
      const parts = [];
      const category = String(insight?.category || '').toLowerCase();
      const num = getFirstNumericCol;
      if (num) {
        const vals = (rows||[]).map(r=>Number(r?.[num])).filter(Number.isFinite);
        if (vals.length) {
          const mean = vals.reduce((a,b)=>a+b,0)/vals.length;
          const min = Math.min(...vals);
          const max = Math.max(...vals);
          parts.push(`Distribution on ${num}: min ${min.toLocaleString()}, mean ${mean.toFixed(2)}, max ${max.toLocaleString()}.`);
        }
      }
      const dcol = getDateCol;
      if (dcol) {
        const valid = (rows||[]).filter(r=>Number.isFinite(new Date(r?.[dcol]).getTime()));
        valid.sort((a,b)=> new Date(a[dcol]) - new Date(b[dcol]));
        const last = valid.at(-1);
        const first = valid[0];
        if (last && first && num) {
          const firstVal = Number(first?.[num]);
          const lastVal = Number(last?.[num]);
          const abs = lastVal - firstVal;
          const pct = firstVal !== 0 ? (abs/Math.abs(firstVal))*100 : 0;
          parts.push(`First vs latest on ${num} by ${dcol}: ${abs>=0?'+':''}${abs.toLocaleString()} (${pct.toFixed(1)}%).`);
          // MoM change if we have at least 3 periods
          if (valid.length >= 3) {
            const recent = valid.slice(-3).map(r=>Number(r?.[num])).filter(Number.isFinite);
            const mom = recent[recent.length-1] - recent[recent.length-2];
            parts.push(`Most recent period change (MoM): ${mom>=0?'+':''}${mom.toLocaleString()}.`);
          }
        }
      }
      const ccol = detectCategorical;
      if (ccol) {
        const counts = new Map();
        (rows||[]).forEach(r=>{ const v = r?.[ccol]; if (v!==''&&v!==null&&v!==undefined){ counts.set(String(v),(counts.get(String(v))||0)+1);} });
        const total = Array.from(counts.values()).reduce((a,b)=>a+b,0) || 1;
        const top = Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,c])=>`${k} (${Math.round((c/total)*100)}%)`).join(', ');
        parts.push(`Top segments by ${ccol}: ${top}.`);
      }
      // Category-specific rationale
      if (category.includes('trend') && charts?.trends?.length) {
        const t = charts.trends;
        const first = t[0]?.revenue || 0; const last = t.at(-1)?.revenue || 0;
        const abs = last - first; const pct = first !== 0 ? (abs/Math.abs(first))*100 : 0;
        parts.unshift(`Computed as month aggregation over ${t.length} periods. Change from first to last: ${abs>=0?'+':''}${abs.toLocaleString()} (${pct.toFixed(1)}%).`);
      } else if (category.includes('anomaly')) {
        const th = computeAnomalyThresholds();
        if (th) parts.unshift(`Outliers flagged where |${th.col} - mean| > 3×std (mean ${th.mean.toFixed(2)}, std ${th.std.toFixed(2)}).`);
      } else if (category.includes('segment') && ccol) {
        parts.unshift(`Segment comparison performed on '${ccol}' by counting row frequency and ranking top contributors.`);
      } else if (category.includes('correlation')) {
        const nums = metrics?.numericCols || [];
        if (nums.length >= 2) {
          const [a,b] = nums;
          const pairs = (rows||[]).map(r=>[Number(r?.[a]), Number(r?.[b])]).filter(([x,y])=>Number.isFinite(x)&&Number.isFinite(y));
          if (pairs.length >= 3) {
            const ax = pairs.map(p=>p[0]); const ay = pairs.map(p=>p[1]);
            const meanX = ax.reduce((s,v)=>s+v,0)/ax.length; const meanY = ay.reduce((s,v)=>s+v,0)/ay.length;
            const nume = pairs.reduce((s,[x,y])=> s + (x-meanX)*(y-meanY), 0);
            const den = Math.sqrt(ax.reduce((s,x)=> s + (x-meanX)**2,0) * ay.reduce((s,y)=> s + (y-meanY)**2,0)) || 1;
            const r = nume/den;
            parts.unshift(`Correlation assessed between ${a} and ${b}: r = ${r.toFixed(2)} (Pearson).`);
          }
        }
      }
      // Avoid repeating the summary verbatim; only include extended rationale
      return parts.join('\n\n');
    } catch { return insight?.summary; }
  };

  return (
    <div className="glass rounded-xl p-6 border border-border shadow-layered">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Insights</h2>
          <p className="text-sm text-muted-foreground">
            Key findings and patterns discovered in your data {aiData?.insights?.length ? '(Generated by AI)' : '(Rule-based)'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filterConfidence}
            onChange={(e) => setFilterConfidence(e?.target?.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Confidence Levels</option>
            <option value="high">High Confidence (90%+)</option>
            <option value="medium">Medium Confidence (75-89%)</option>
            <option value="low">Low Confidence (&lt;75%)</option>
          </select>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Sparkles" size={16} className="text-accent" />
            <span>{filteredInsights?.length} insights found</span>
            {aiLoading && <span className="ml-2 text-xs">Generating AI insights…</span>}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {filteredInsights?.map((insight) => (
          <div key={insight?.id} className="glass rounded-lg border border-border hover:border-accent/50 transition-spring">
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{insight?.title}</h3>
                    <Icon 
                      name={getImpactIcon(insight?.impact)} 
                      size={16} 
                      className="text-accent" 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight?.summary}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 sm:ml-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight?.priority)}`}>
                    {insight?.priority} Priority
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(insight?.confidence)}`}>
                    {insight?.confidence}% Confidence
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Tag" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{insight?.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Target" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{insight?.impact} Impact</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(insight?.id)}
                  iconName={expandedInsight === insight?.id ? "ChevronUp" : "ChevronDown"}
                  iconPosition="right"
                  iconSize={16}
                  >
                    {expandedInsight === insight?.id ? 'Show Less' : 'Show Details'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Table"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => openSupportingRows(insight)}
                  >
                    {Array.isArray(rowsByInsight[insight.id]) ? 'Hide Supporting Rows' : 'View Supporting Rows'}
                  </Button>
                </div>
              </div>
            </div>

            {expandedInsight === insight?.id && (
              <div className="border-t border-border p-5 bg-muted/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                      <Icon name="FileText" size={16} />
                      <span>Detailed Analysis</span>
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                      {buildDetailedText(insight)}
                    </div>
                    
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                      <Icon name="Lightbulb" size={16} />
                      <span>Recommendations</span>
                    </h4>
                    <ul className="space-y-2">
                      {insight?.recommendations?.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <Icon name="ArrowRight" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div ref={el => { rowsRefMap.current[insight.id] = el; }}>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                      <Icon name="BarChart3" size={16} />
                      <span>Supporting Metrics</span>
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(insight?.supportingData)?.map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                          <span className="text-sm text-muted-foreground capitalize">
                            {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {typeof value === 'number' ? (key?.includes('Cost') ? `$${value?.toFixed(2)}` : 
                               key?.includes('Rate') || key?.includes('ROI') || key?.includes('Increase') || key?.includes('Gain') || key?.includes('Utilization') || key?.includes('Correlation') || key?.includes('Alignment') || key?.includes('Gap') || key?.includes('Optimization') ? `${value?.toFixed(1)}%` :
                               key?.includes('Time') ? `${value?.toFixed(1)} hrs` : value?.toLocaleString()) 
                              : value}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Mini chart for this insight */}
                    <div className="mt-4">
                      {getMiniChart(insight)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inline supporting rows table */}
            {Array.isArray(rowsByInsight[insight.id]) && (
              <div ref={el => { rowsRefMap.current[`${insight.id}-table`] = el; }} className="border-t border-border p-5">
                <h4 className="text-sm font-semibold text-foreground mb-3">{rowsTitleByInsight[insight.id] || 'Supporting rows'}</h4>
                <div className="overflow-auto" style={{maxHeight:'60vh'}}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {columns?.slice(0,12)?.map(col => (
                          <th key={col} className="text-left px-2 py-1 border-b border-border text-muted-foreground">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rowsByInsight[insight.id].length ? rowsByInsight[insight.id].map((r, idx) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          {columns?.slice(0,12)?.map(col => (
                            <td key={col} className="px-2 py-1 border-b border-border truncate max-w-[200px]">{String(r?.[col] ?? '')}</td>
                          ))}
                        </tr>
                      )) : (
                        <tr>
                          <td className="text-center text-sm text-muted-foreground py-6" colSpan={columns?.slice(0,12)?.length || 1}>No matching rows for this insight.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{rowsByInsight[insight.id]?.length || 0} rows (showing up to 100)</div>
              </div>
            )}
          </div>
        ))}
      </div>
      {filteredInsights?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No insights found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your confidence level filter to see more results.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightsSection;