import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { useDataContext } from '../../../context/DataContext';

const InteractiveCharts = () => {
  const [activeChart, setActiveChart] = useState('trends');
  const [mounted, setMounted] = useState(false);
  const pieContainerRef = useRef(null);
  const [pieWidth, setPieWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { charts, rows, columns } = useDataContext();
  const [demographicColumn, setDemographicColumn] = useState('');

  useEffect(() => {
    // Attach observer once the element exists; re-run on tab or category changes
    const el = pieContainerRef.current;
    if (!el) {
      const id = requestAnimationFrame(() => {
        const w = pieContainerRef.current?.clientWidth || 0;
        setPieWidth(w);
      });
      return () => cancelAnimationFrame(id);
    }
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry?.contentRect?.width || 0;
        setPieWidth(w);
      }
    });
    obs.observe(el);
    // Initialize immediately
    setPieWidth(el.clientWidth || 0);
    return () => obs.disconnect();
  }, [mounted, pieContainerRef, activeChart, demographicColumn]);

  // Sanitize data to avoid NaN/invalid values causing SVG errors
  // Helper: build demographics from a chosen categorical column
  const buildDemographicsFrom = (col) => {
    if (!col || !rows?.length) return [];
    const counts = new Map();
    for (const r of rows) {
      const v = r?.[col];
      if (v === '' || v === null || v === undefined) continue;
      const key = String(v);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a,b)=> b[1]-a[1])
      .slice(0,8)
      .map(([age, value]) => ({ age: String(age), value: Number(value) }))
      .filter(d => Number.isFinite(d.value) && d.value > 0);
  };

  const safe = useMemo(() => ({
    trends: (charts?.trends || []).map(d => ({
      month: String(d.month),
      revenue: Number.isFinite(d.revenue) && d.revenue >= 0 ? d.revenue : 0,
    })).filter(d => Number.isFinite(d.revenue)),
    demographics: (demographicColumn ? buildDemographicsFrom(demographicColumn) : (charts?.demographics || [])).map(d => ({
      age: String(d.age ?? ''),
      // Clamp tiny positives to avoid zero-total pies creating invalid arc flags
      value: Number.isFinite(d.value) && d.value > 0 ? d.value : 0,
      color: d.color || undefined,
    })).filter(d => Number.isFinite(d.value)),
    performance: (charts?.performance || []).map(d => ({
      category: String(d.category ?? ''),
      current: Number.isFinite(d.current) && d.current >= 0 ? d.current : 0,
      target: Number.isFinite(d.target) && d.target >= 0 ? d.target : 0,
      budget: Number.isFinite(d.budget) && d.budget >= 0 ? d.budget : 0,
    })),
    growth: (charts?.growth || []).map(d => ({
      quarter: String(d.quarter ?? ''),
      growth: Number.isFinite(d.growth) && d.growth >= 0 ? d.growth : 0,
      forecast: Number.isFinite(d.forecast) && d.forecast >= 0 ? d.forecast : 0,
    })).filter(d => Number.isFinite(d.growth) && Number.isFinite(d.forecast)),
  }), [charts, rows, demographicColumn]);

  const chartTypes = [
    { id: 'trends', label: 'Revenue Trends', icon: 'TrendingUp', type: 'line' },
    { id: 'demographics', label: 'Demographics', icon: 'PieChart', type: 'pie' },
    { id: 'performance', label: 'Performance', icon: 'BarChart3', type: 'bar' },
    { id: 'growth', label: 'Growth Analysis', icon: 'Activity', type: 'area' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass rounded-lg p-3 border border-border shadow-layered">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
              <span className="text-foreground font-medium">
                {typeof entry?.value === 'number' ? 
                  (entry?.dataKey === 'revenue' ? `$${entry?.value?.toLocaleString()}` :
                   entry?.dataKey?.includes('conversion') || entry?.dataKey?.includes('growth') ? `${entry?.value}%` :
                   entry?.value?.toLocaleString()) : entry?.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const data = safe?.[activeChart] || [];
    
    switch (activeChart) {
      case 'trends':
        if (!data.length) return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No trend data</div>;
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'demographics': {
        if (!data.length) return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No demographic data</div>;
        // Remove zero/near-zero slices to avoid degenerate arcs
        const filtered = data.filter(d => Number.isFinite(d.value) && d.value > 0).slice(0, 8);
        const total = filtered.reduce((s, v) => s + v.value, 0);
        if (!Number.isFinite(total) || total <= 0 || filtered.length < 2) {
          return (
            <div className="h-full flex items-center justify-center text-sm text-foreground/80">
              No demographic data (need at least 2 non-zero categories)
            </div>
          );
        }
        return (
          <div ref={pieContainerRef} className="relative w-full h-[400px]">
          {(!mounted || pieWidth < 50) && (
            <div className="absolute inset-0 flex items-center justify-center text-foreground/70 text-sm pointer-events-none">Preparing chart...</div>
          )}
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={filtered}
                nameKey="age"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                minAngle={2}
                isAnimationActive={false}
                paddingAngle={1}
                label={({ age, value }) => {
                  const val = Number(value) || 0;
                  const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                  return `${age}: ${pct}%`;
                }}
                labelLine={false}
              >
                {filtered?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color || '#06b6d4'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          </div>
        );
      }

      case 'performance':
        if (!data.length) return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No performance data</div>;
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="category" 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="current" fill="#1e40af" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'growth':
        if (!data.length) return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No growth data</div>;
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="quarter" 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="growth" 
                stackId="1"
                stroke="#1e40af" 
                fill="url(#colorGrowth)" 
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                stackId="2"
                stroke="#06b6d4" 
                fill="url(#colorForecast)" 
              />
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1e40af" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartInsight = () => {
    switch (activeChart) {
      case 'trends':
        return safe.trends.length ? `Showing ${safe.trends.length} periods of trend data.` : 'No trend data available.';
      case 'demographics':
        return safe.demographics.length ? 'Distribution by top categories.' : 'No demographic data available.';
      case 'performance':
        return safe.performance.length ? 'Current vs target overview for numeric columns.' : 'No performance data available.';
      case 'growth':
        return safe.growth.length ? 'Recent growth trajectory and forecast.' : 'No growth data available.';
      default:
        return "";
    }
  };

  return (
    <div className="glass rounded-xl p-6 border border-border shadow-layered">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Interactive Data Visualization</h2>
          <p className="text-sm text-muted-foreground">
            Explore your data patterns through interactive charts
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="MousePointer" size={16} className="text-accent" />
          <span className="text-sm text-muted-foreground">Click and hover to explore</span>
        </div>
      </div>
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {chartTypes?.map((chart) => (
          <Button
            key={chart?.id}
            variant={activeChart === chart?.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChart(chart?.id)}
            iconName={chart?.icon}
            iconPosition="left"
            iconSize={16}
            className="transition-spring hover:scale-105"
          >
            {chart?.label}
          </Button>
        ))}
        {activeChart === 'demographics' && (
          <div className="ml-auto w-full sm:w-64">
            <Select
              label="Category"
              placeholder="Pick a categorical column"
              value={demographicColumn}
              onChange={setDemographicColumn}
              searchable
              clearable
              options={(columns||[])
                .filter(c => !/date|time|timestamp|day|month|year/i.test(String(c)))
                .map(c => ({ label: c, value: c }))}
            />
          </div>
        )}
      </div>
      {/* Chart Container */}
      <div className="glass rounded-lg p-4 border border-border mb-4 bg-background/20">
        <div className="w-full h-96">
          {renderChart()}
        </div>
      </div>
      {/* Chart Insight */}
      <div className="flex items-start space-x-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
        <Icon name="Lightbulb" size={20} className="text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">Key Insight</h4>
          <p className="text-sm text-muted-foreground">{getChartInsight()}</p>
        </div>
      </div>
      {/* Chart Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-foreground">
              {activeChart === 'trends' ? '$95K' : 
               activeChart === 'demographics' ? '32%' :
               activeChart === 'performance' ? '87%' : '35.4%'}
            </div>
            <div className="text-xs text-muted-foreground">
              {activeChart === 'trends' ? 'Peak Revenue' : 
               activeChart === 'demographics' ? 'Top Segment' :
               activeChart === 'performance' ? 'Avg Performance' : 'Current Growth'}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">
              {activeChart === 'trends' ? '+34%' : 
               activeChart === 'demographics' ? '5 Groups' :
               activeChart === 'performance' ? '2/5 Targets' : '+180%'}
            </div>
            <div className="text-xs text-muted-foreground">
              {activeChart === 'trends' ? 'YoY Growth' : 
               activeChart === 'demographics' ? 'Age Groups' :
               activeChart === 'performance' ? 'Met Targets' : 'Total Growth'}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {activeChart === 'trends' ? '2.9%' : 
               activeChart === 'demographics' ? '60%' :
               activeChart === 'performance' ? '3/5 Areas' : '6 Quarters'}
            </div>
            <div className="text-xs text-muted-foreground">
              {activeChart === 'trends' ? 'Avg Monthly' : 
               activeChart === 'demographics' ? 'Core Market' :
               activeChart === 'performance' ? 'Need Attention' : 'Tracked Period'}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent">
              {activeChart === 'trends' ? '12 Months' : 
               activeChart === 'demographics' ? '2.3K' :
               activeChart === 'performance' ? '$242K' : '38.2%'}
            </div>
            <div className="text-xs text-muted-foreground">
              {activeChart === 'trends' ? 'Data Points' : 
               activeChart === 'demographics' ? 'Total Users' :
               activeChart === 'performance' ? 'Total Budget' : 'Forecast'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCharts;