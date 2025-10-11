import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useDataContext } from '../../../context/DataContext';

const RecommendationsPanel = () => {
  const { metrics, charts, aiData, aiLoading } = useDataContext();
  const [sortBy, setSortBy] = useState('priority');
  const [filterImpact, setFilterImpact] = useState('all');
  const [detailsRec, setDetailsRec] = useState(null);
  const [implementRec, setImplementRec] = useState(null);
  const [implementStep, setImplementStep] = useState(0);
  const mockFromData = useMemo(() => {
    const recs = [];
    if (!metrics) return recs;

    // Recommendation: Handle missing data
    if (Number.isFinite(metrics.completeness) && metrics.completeness < 90) {
      recs.push({
        id: 'r1',
        title: 'Improve Data Completeness',
        description: 'Fill missing values in key columns to raise completeness above 90%.',
        priority: metrics.completeness < 80 ? 'High' : 'Medium',
        impact: 'High',
        roiEstimate: Math.max(10, Math.round((90 - metrics.completeness) / 2)),
        implementationTime: '1-2 weeks',
        effort: 'Medium',
        category: 'Data Quality',
        steps: ['Identify columns with highest missing rate', 'Impute using mean/median for numeric columns', 'Re-run analysis to verify lift'],
        metrics: { expectedRevenue: 0, costReduction: 0, timeToROI: '2 weeks' },
        risks: ['Imputation may bias aggregates if not validated'],
      });
    }

    // Recommendation: Investigate anomalies
    if (Number.isFinite(metrics.anomalies) && metrics.anomalies > 5) {
      recs.push({
        id: 'r2',
        title: 'Investigate Outliers',
        description: 'Review outlier rows and decide whether to cap, remove, or keep as-is.',
        priority: metrics.anomalies > 15 ? 'High' : 'Medium',
        impact: 'Medium',
        roiEstimate: Math.min(30, Math.round(metrics.anomalies)),
        implementationTime: '1 week',
        effort: 'Low',
        category: 'Anomalies',
        steps: ['Export suspect rows', 'Validate with domain stakeholders', 'Apply winsorization or filtering if necessary'],
        metrics: { expectedRevenue: 0, costReduction: 0, timeToROI: '1 week' },
        risks: ['Removing legitimate extremes may hide true signals'],
      });
    }

    // Recommendation: Focus top category
    if (charts?.demographics?.length) {
      const top = charts.demographics[0];
      recs.push({
        id: 'r3',
        title: `Focus on top category: ${String(top.age)}`,
        description: 'Allocate additional effort to the leading category to maximize impact.',
        priority: 'Medium',
        impact: 'Medium',
        roiEstimate: 12,
        implementationTime: '2-3 weeks',
        effort: 'Medium',
        category: 'Segmentation',
        steps: ['Identify drivers for the top segment', 'Pilot targeted initiatives', 'Measure uplift vs control'],
        metrics: { expectedRevenue: 0, costReduction: 0, timeToROI: '3 weeks' },
        risks: ['May reduce focus on smaller but high-potential segments'],
      });
    }

    return recs;
  }, [metrics, charts]);

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

  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'low':
        return 'text-muted-foreground bg-muted/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const getEffortIcon = (effort) => {
    switch (effort?.toLowerCase()) {
      case 'high':
        return 'AlertCircle';
      case 'medium':
        return 'Clock';
      case 'low':
        return 'CheckCircle';
      default:
        return 'Circle';
    }
  };

  const sortRecommendations = (recs) => {
    return [...recs]?.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
        case 'roi':
          return b?.roiEstimate - a?.roiEstimate;
        case 'impact':
          const impactOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return impactOrder?.[b?.impact] - impactOrder?.[a?.impact];
        case 'time':
          return parseInt(a?.implementationTime) - parseInt(b?.implementationTime);
        default:
          return 0;
      }
    });
  };

  const filterRecommendations = (recs) => {
    if (filterImpact === 'all') return recs;
    return recs?.filter(rec => rec?.impact?.toLowerCase() === filterImpact);
  };

  const parseMoney = (val) => {
    if (typeof val === 'number' && isFinite(val)) return val;
    if (typeof val === 'string') {
      const n = Number(val.replace(/[$,\s]/g, ''));
      return isFinite(n) ? n : 0;
    }
    return 0;
  };

  const heuristicROI = (impact, effort) => {
    const base = (impact?.toLowerCase() === 'high') ? 15 : (impact?.toLowerCase() === 'medium') ? 8 : 3;
    const adj = (effort?.toLowerCase() === 'low') ? 2 : (effort?.toLowerCase() === 'high') ? -2 : 0;
    return Math.max(1, base + adj);
  };

  const aiRecs = (aiData?.recommendations || []).map((r, i) => {
    const priority = (r.priority || 'Medium')?.replace(/^./, c => c.toUpperCase());
    const impact = (r.impact || r.priority || 'Medium')?.replace(/^./, c => c.toUpperCase());
    let roi = 0;
    if (typeof r.expectedROI === 'string' && /%$/.test(r.expectedROI)) {
      roi = Number(r.expectedROI.replace('%','')) || 0;
    } else if (typeof r.expectedROI === 'number') {
      roi = r.expectedROI;
    }
    if (!roi) roi = heuristicROI(impact, r.effort);

    const expectedRevenue = parseMoney(r.expectedRevenue || r.estimatedRevenue || r.revenueImpact);
    const timelineText = r.timeToROI || r.timeline || '—';

    return {
      id: `ai-rec-${i}`,
      title: r.title,
      description: r.description,
      priority,
      impact,
      roiEstimate: roi,
      implementationTime: timelineText,
      effort: r.effort || 'Medium',
      category: 'AI',
      steps: r.steps || [],
      metrics: { expectedRevenue, timeToROI: timelineText },
      _source: 'ai',
    };
  });

  const processedRecommendations = sortRecommendations(
    filterRecommendations(aiRecs.length ? aiRecs : mockFromData)
  );

  // Simulate a small progress when implementation is active
  useEffect(() => {
    if (!implementRec) return;
    setImplementStep(0);
    let step = 0;
    const steps = 3; // align with default three steps we generate
    const id = setInterval(() => {
      step += 1;
      setImplementStep(step);
      if (step >= steps) clearInterval(id);
    }, 800);
    return () => clearInterval(id);
  }, [implementRec]);

  return (
    <div className="glass rounded-xl p-6 border border-border shadow-layered">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Actionable Recommendations</h2>
          <p className="text-sm text-muted-foreground">
            Strategic actions ranked by ROI potential and implementation priority
          </p>
        </div>
      {/* Details Modal */}
      {detailsRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl glass rounded-xl border border-border p-6 shadow-layered">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{detailsRec.title}</h3>
              <button className="text-muted-foreground hover:text-foreground" onClick={() => setDetailsRec(null)}>
                <Icon name="X" size={18} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{detailsRec.description}</p>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center space-x-2">
              <Icon name="ListChecks" size={16} />
              <span>Steps</span>
            </h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              {detailsRec.steps?.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground">{s}</li>
              ))}
            </ul>
            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setDetailsRec(null)}>Close</Button>
              <Button variant="default" size="sm" onClick={() => { setDetailsRec(null); setImplementRec(detailsRec); }}>Start Implementation</Button>
            </div>
          </div>
        </div>
      )}

      {/* Implementation Modal */}
      {implementRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-xl glass rounded-xl border border-border p-6 shadow-layered">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Implement: {implementRec.title}</h3>
              <button className="text-muted-foreground hover:text-foreground" onClick={() => setImplementRec(null)}>
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {implementRec.steps?.map((s, i) => (
                <div key={i} className={`flex items-start space-x-3 p-3 rounded-lg ${i < implementStep ? 'bg-success/10 border border-success/20' : 'bg-background/50 border border-border'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${i < implementStep ? 'bg-success text-foreground' : 'bg-muted text-foreground/70'}`}>{i+1}</div>
                  <div className="flex-1">
                    <div className="text-sm text-foreground">{s}</div>
                    {i < implementStep && <div className="text-xs text-success mt-1 flex items-center space-x-1"><Icon name="Check" size={12} /><span>Completed</span></div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">Progress: {Math.min(implementStep, (implementRec.steps?.length||0))}/{implementRec.steps?.length||0}</div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => setImplementRec(null)}>Close</Button>
                {implementStep < (implementRec.steps?.length||0) ? (
                  <Button variant="default" size="sm" onClick={() => setImplementStep(s => Math.min(s+1, implementRec.steps?.length||0))}>Mark Next Step Done</Button>
                ) : (
                  <Button variant="default" size="sm" onClick={() => setImplementRec(null)}>Finish</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
        
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="priority">Sort by Priority</option>
            <option value="roi">Sort by ROI</option>
            <option value="impact">Sort by Impact</option>
            <option value="time">Sort by Time</option>
          </select>
          
          <select
            value={filterImpact}
            onChange={(e) => setFilterImpact(e?.target?.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Impact Levels</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>
        </div>
      </div>
      <div className="space-y-6">
        {processedRecommendations?.map((rec, index) => (
          <div key={rec?.id} className="glass rounded-lg border border-border hover:border-accent/50 transition-spring">
            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-lg font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{rec?.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec?.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 sm:ml-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec?.priority)}`}>
                    {rec?.priority} Priority
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec?.impact)}`}>
                    {rec?.impact} Impact
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-success mb-1">
                    {rec?.roiEstimate ? `${rec?.roiEstimate?.toFixed(1)}%` : '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">Expected ROI</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {rec?.metrics?.expectedRevenue > 0 ? `$${rec?.metrics?.expectedRevenue?.toLocaleString()}` : '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">Revenue Impact</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {rec?.implementationTime || '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">Timeline</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Icon name={getEffortIcon(rec?.effort)} size={20} className="text-foreground" />
                  </div>
                  <div className="text-xs text-muted-foreground">{rec?.effort} Effort</div>
                </div>
              </div>

              {/* Implementation Steps */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="ListChecks" size={16} />
                  <span>Implementation Steps</span>
                </h4>
                <div className="space-y-2">
                  {rec?.steps?.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-accent/10 text-accent rounded-full text-xs font-medium mt-0.5">
                        {stepIndex + 1}
                      </div>
                      <span className="text-sm text-muted-foreground flex-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} />
                  <span>Potential Risks</span>
                </h4>
                <div className="space-y-2">
                  {rec?.risks?.map((risk, riskIndex) => (
                    <div key={riskIndex} className="flex items-start space-x-2">
                      <Icon name="Minus" size={14} className="text-warning mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Tag" size={14} />
                    <span>{rec?.category}</span>
                  </div>
                  {rec?.metrics?.timeToROI && rec?.metrics?.timeToROI !== '—' && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>ROI in {rec?.metrics?.timeToROI}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="BookOpen"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => setDetailsRec(rec)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Play"
                    iconPosition="left"
                    iconSize={14}
                    className="transition-spring hover:scale-105"
                    onClick={() => setImplementRec(rec)}
                  >
                    Start Implementation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {processedRecommendations?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Target" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No recommendations found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your impact filter to see more recommendations.
          </p>
        </div>
      )}
      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {processedRecommendations?.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Recommendations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">
              {processedRecommendations?.reduce((sum, rec) => sum + rec?.roiEstimate, 0)?.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Combined ROI Potential</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">
              ${processedRecommendations?.reduce((sum, rec) => sum + rec?.metrics?.expectedRevenue, 0)?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Revenue Impact</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">
              {processedRecommendations?.filter(rec => rec?.priority === 'High')?.length}
            </div>
            <div className="text-xs text-muted-foreground">High Priority Items</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPanel;