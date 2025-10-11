import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { useDataContext } from '../../../context/DataContext';

const DataQualityOverview = () => {
  const { metrics, aiData, aiLoading } = useDataContext();
  const [animatedValues, setAnimatedValues] = useState({
    completeness: 0,
    accuracy: 0,
    anomalies: 0
  });

  const aiQ = aiData?.dataQuality;
  const useAI = !!aiQ;
  const targetValues = {
    completeness: Number.isFinite((useAI ? aiQ?.completeness : metrics?.completeness)) ? (useAI ? aiQ?.completeness : metrics?.completeness) : 0,
    accuracy: Number.isFinite((useAI ? aiQ?.accuracy : metrics?.accuracy)) ? (useAI ? aiQ?.accuracy : metrics?.accuracy) : 0,
    anomalies: Number.isFinite((useAI ? aiQ?.anomalies : metrics?.anomalies)) ? (useAI ? aiQ?.anomalies : metrics?.anomalies) : 0
  };

  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setAnimatedValues({
          completeness: targetValues?.completeness * easeOutQuart,
          accuracy: targetValues?.accuracy * easeOutQuart,
          anomalies: targetValues?.anomalies * easeOutQuart
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues(targetValues);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateCounters, 300);
    return () => clearTimeout(timer);
  }, [metrics?.completeness, metrics?.accuracy, metrics?.anomalies]);

  const getQualityStatus = (value, type) => {
    if (type === 'anomalies') {
      if (value < 5) return { status: 'excellent', color: 'text-success', bg: 'bg-success/10' };
      if (value < 15) return { status: 'good', color: 'text-warning', bg: 'bg-warning/10' };
      return { status: 'needs attention', color: 'text-destructive', bg: 'bg-destructive/10' };
    } else {
      if (value >= 95) return { status: 'excellent', color: 'text-success', bg: 'bg-success/10' };
      if (value >= 80) return { status: 'good', color: 'text-warning', bg: 'bg-warning/10' };
      return { status: 'needs attention', color: 'text-destructive', bg: 'bg-destructive/10' };
    }
  };

  const qualityMetrics = [
    {
      id: 'completeness',
      label: 'Data Completeness',
      value: animatedValues?.completeness,
      icon: 'Database',
      description: 'Percentage of complete records'
    },
    {
      id: 'accuracy',
      label: 'Data Accuracy',
      value: animatedValues?.accuracy,
      icon: 'Target',
      description: 'Estimated accuracy score'
    },
    {
      id: 'anomalies',
      label: 'Anomalies Detected',
      value: animatedValues?.anomalies,
      icon: 'AlertTriangle',
      description: 'Percentage of anomalous data points'
    }
  ];

  return (
    <div className="glass rounded-xl p-6 border border-border shadow-layered">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Data Quality Overview</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive analysis of your dataset quality metrics
          </p>
        </div>
          <div className="flex items-center space-x-2">
          {useAI ? (
            <>
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm text-accent font-medium">AI Insights {aiLoading ? 'Loading…' : 'Applied'}</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-medium">Rule-based</span>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {qualityMetrics?.map((metric) => {
          const qualityInfo = getQualityStatus(metric?.value, metric?.id);
          
          return (
            <div key={metric?.id} className="glass rounded-lg p-5 border border-border hover:border-accent/50 transition-spring">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${qualityInfo?.bg}`}>
                  <Icon 
                    name={metric?.icon} 
                    size={24} 
                    className={qualityInfo?.color}
                  />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${qualityInfo?.bg} ${qualityInfo?.color}`}>
                  {qualityInfo?.status}
                </div>
              </div>
              <div className="mb-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-foreground">
                    {metric?.value?.toFixed(1)}
                  </span>
                  <span className="text-lg text-muted-foreground">%</span>
                </div>
                <h3 className="text-sm font-medium text-foreground mt-1">
                  {metric?.label}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {metric?.description}
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    metric?.id === 'anomalies' ?'bg-gradient-to-r from-destructive to-warning' :'bg-gradient-to-r from-primary to-accent'
                  }`}
                  style={{ 
                    width: `${metric?.id === 'anomalies' ? Math.min(metric?.value * 2, 100) : metric?.value}%` 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        {useAI && (
          <div className="mb-4 text-xs text-muted-foreground">
            AI summary: {aiQ?.summary}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Number(metrics?.totalRecords || 0)?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Records</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Number(metrics?.columns || 0)}
            </div>
            <div className="text-xs text-muted-foreground">Columns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {Number(metrics?.validRecords || 0)?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Valid Records</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {Number(metrics?.issuesFound || 0)}
            </div>
            <div className="text-xs text-muted-foreground">Issues Found</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataQualityOverview;