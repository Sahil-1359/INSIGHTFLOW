import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const StatusMessages = ({ currentStatus, statusHistory = [] }) => {
  const statusIcons = {
    'Validating data structure': 'CheckCircle2',
    'Analyzing patterns': 'TrendingUp',
    'Processing with AI': 'Brain',
    'Generating insights': 'Lightbulb',
    'Finalizing results': 'FileCheck'
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Current Status */}
      <div className="glass rounded-lg p-6 border border-border">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon 
                name={statusIcons?.[currentStatus] || 'Activity'} 
                size={24} 
                className="text-primary animate-pulse" 
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping"></div>
          </div>
          
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.h4
                key={currentStatus}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-semibold text-foreground"
              >
                {currentStatus}
              </motion.h4>
            </AnimatePresence>
            <div className="text-sm text-muted-foreground mt-1">
              Processing your data with advanced AI algorithms...
            </div>
          </div>
        </div>
      </div>
      {/* Status History */}
      {statusHistory?.length > 0 && (
        <div className="mt-6 space-y-3">
          <h5 className="text-sm font-medium text-muted-foreground">Recent Activity</h5>
          <div className="space-y-2">
            {statusHistory?.slice(-3)?.map((status, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 glass rounded-lg border border-border/50"
              >
                <Icon 
                  name="Check" 
                  size={16} 
                  className="text-success flex-shrink-0" 
                />
                <span className="text-sm text-foreground">{status}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(Date.now() - (statusHistory.length - index) * 5000)?.toLocaleTimeString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusMessages;