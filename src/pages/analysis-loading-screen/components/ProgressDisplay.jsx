import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ProgressDisplay = ({ progress, stage, estimatedTime }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Circular Progress */}
      <div className="relative">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="var(--color-muted)"
            strokeWidth="8"
            fill="transparent"
            className="opacity-20"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={progress}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-primary"
          >
            {progress}%
          </motion.div>
          <div className="text-sm text-muted-foreground">Complete</div>
        </div>
      </div>
      {/* Stage Information */}
      <div className="text-center space-y-2">
        <motion.h3
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-semibold text-foreground"
        >
          {stage}
        </motion.h3>
        
        {estimatedTime && (
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span className="text-sm">Estimated time: {estimatedTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDisplay;