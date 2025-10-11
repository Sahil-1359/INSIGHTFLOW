import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const PreliminaryMetrics = ({ metrics }) => {
  const metricCards = [
    {
      label: 'Data Quality',
      value: metrics?.dataQuality || 0,
      suffix: '%',
      icon: 'Shield',
      color: 'text-success',
      bgColor: 'bg-success/20'
    },
    {
      label: 'Completeness',
      value: metrics?.completeness || 0,
      suffix: '%',
      icon: 'CheckCircle',
      color: 'text-primary',
      bgColor: 'bg-primary/20'
    },
    {
      label: 'Anomalies Found',
      value: metrics?.anomalies || 0,
      suffix: '',
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/20'
    },
    {
      label: 'Patterns Detected',
      value: metrics?.patterns || 0,
      suffix: '',
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/20'
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">Preliminary Analysis</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time metrics as analysis progresses
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards?.map((metric, index) => (
          <motion.div
            key={metric?.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass rounded-lg p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 ${metric?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={metric?.icon} size={16} className={metric?.color} />
              </div>
            </div>
            
            <div className="space-y-1">
              <motion.div
                key={metric?.value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-foreground"
              >
                {metric?.value}{metric?.suffix}
              </motion.div>
              <div className="text-xs text-muted-foreground">
                {metric?.label}
              </div>
            </div>
            
            {/* Animated progress bar for percentage values */}
            {metric?.suffix === '%' && (
              <div className="mt-3">
                <div className="w-full bg-muted/30 rounded-full h-1">
                  <motion.div
                    className={`h-1 rounded-full ${metric?.color?.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric?.value}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PreliminaryMetrics;