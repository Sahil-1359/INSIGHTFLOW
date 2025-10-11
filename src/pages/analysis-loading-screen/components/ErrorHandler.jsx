import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorHandler = ({ error, onRetry, onCancel }) => {
  const getErrorDetails = (errorType) => {
    switch (errorType) {
      case 'rate_limit':
        return {
          title: 'Rate Limit Exceeded',
          message: 'Too many requests. Please wait a moment before trying again.',
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/20',
          retryDelay: '30 seconds'
        };
      case 'api_error':
        return {
          title: 'Analysis Service Error',
          message: 'There was an issue with the AI analysis service. Please try again.',
          icon: 'AlertCircle',
          color: 'text-destructive',
          bgColor: 'bg-destructive/20',
          retryDelay: 'immediately'
        };
      case 'network_error':
        return {
          title: 'Network Connection Error',
          message: 'Unable to connect to the analysis service. Check your internet connection.',
          icon: 'Wifi',
          color: 'text-destructive',
          bgColor: 'bg-destructive/20',
          retryDelay: 'immediately'
        };
      default:
        return {
          title: 'Analysis Failed',
          message: 'An unexpected error occurred during analysis. Please try again.',
          icon: 'XCircle',
          color: 'text-destructive',
          bgColor: 'bg-destructive/20',
          retryDelay: 'immediately'
        };
    }
  };

  const errorDetails = getErrorDetails(error?.type || 'unknown');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass rounded-lg p-8 border border-destructive/20 text-center">
        <div className={`w-16 h-16 ${errorDetails?.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon name={errorDetails?.icon} size={32} className={errorDetails?.color} />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {errorDetails?.title}
        </h3>
        
        <p className="text-muted-foreground mb-6">
          {errorDetails?.message}
        </p>
        
        {error?.details && (
          <div className="bg-muted/20 rounded-lg p-3 mb-6 text-left">
            <div className="text-xs text-muted-foreground mb-1">Error Details:</div>
            <div className="text-sm text-foreground font-mono">
              {error?.details}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            onClick={onRetry}
            iconName="RefreshCw"
            iconPosition="left"
            className="transition-spring hover:scale-105"
          >
            Retry Analysis
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            iconName="ArrowLeft"
            iconPosition="left"
            className="transition-spring hover:scale-105"
          >
            Back to Upload
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          You can retry {errorDetails?.retryDelay}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorHandler;