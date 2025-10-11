import React from 'react';
import Icon from '../../../components/AppIcon';

const UploadProgress = ({ progress = 0, status = 'uploading', fileName = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: 'Upload',
          color: 'text-primary',
          bgColor: 'bg-primary/20',
          message: 'Uploading file...',
          showProgress: true
        };
      case 'processing':
        return {
          icon: 'Loader2',
          color: 'text-accent',
          bgColor: 'bg-accent/20',
          message: 'Processing file...',
          showProgress: true
        };
      case 'validating':
        return {
          icon: 'Shield',
          color: 'text-warning',
          bgColor: 'bg-warning/20',
          message: 'Validating file format...',
          showProgress: false
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/20',
          message: 'File uploaded successfully!',
          showProgress: false
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-destructive',
          bgColor: 'bg-destructive/20',
          message: 'Upload failed. Please try again.',
          showProgress: false
        };
      default:
        return {
          icon: 'Upload',
          color: 'text-primary',
          bgColor: 'bg-primary/20',
          message: 'Preparing upload...',
          showProgress: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass rounded-xl border border-border p-6">
        {/* Status Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 ${config?.bgColor} rounded-full flex items-center justify-center`}>
            <Icon 
              name={config?.icon} 
              size={32} 
              className={`${config?.color} ${status === 'processing' || status === 'uploading' ? 'animate-spin' : ''}`} 
            />
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center mb-4">
          <h3 className="font-semibold text-foreground mb-1">{config?.message}</h3>
          {fileName && (
            <p className="text-sm text-muted-foreground truncate">{fileName}</p>
          )}
        </div>

        {/* Progress Bar */}
        {config?.showProgress && (
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ease-out ${
                  status === 'uploading' ? 'bg-primary' : 'bg-accent'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{status === 'uploading' ? 'Uploading' : 'Processing'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {(status === 'validating' || status === 'processing') && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Success/Error Actions */}
        {status === 'success' && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              File is ready for analysis
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Check file format and size requirements
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProgress;