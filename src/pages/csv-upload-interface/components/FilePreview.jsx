import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilePreview = ({ file, onRemove, onAnalyze, isAnalyzing }) => {
  if (!file) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="FileCheck" size={20} className="text-success mr-2" />
        File Ready for Analysis
      </h3>
      {/* File Details Card */}
      <div className="glass rounded-xl border border-success/30 p-6 mb-6">
        <div className="flex items-start space-x-4">
          {/* File Icon */}
          <div className="w-16 h-16 bg-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="FileSpreadsheet" size={32} className="text-success" />
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-lg mb-1 truncate">
              {file?.name}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="HardDrive" size={14} />
                  <span>{formatFileSize(file?.size)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="FileType" size={14} />
                  <span>CSV File</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{formatDate(new Date())}</span>
                </div>
              </div>
              
              {/* File Status */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-success">Ready for Analysis</span>
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            iconName="X"
            iconSize={16}
            className="text-muted-foreground hover:text-destructive transition-spring"
            disabled={isAnalyzing}
          />
        </div>

        {/* File Preview Stats */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name="Database" size={20} className="text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Data Source</p>
              <p className="text-sm font-medium text-foreground">CSV File</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name="Zap" size={20} className="text-accent" />
              </div>
              <p className="text-xs text-muted-foreground">Processing</p>
              <p className="text-sm font-medium text-foreground">AI Analysis</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name="Shield" size={20} className="text-warning" />
              </div>
              <p className="text-xs text-muted-foreground">Security</p>
              <p className="text-sm font-medium text-foreground">Encrypted</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
              </div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-medium text-foreground">Validated</p>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          size="lg"
          onClick={onAnalyze}
          loading={isAnalyzing}
          iconName="Zap"
          iconPosition="left"
          iconSize={20}
          className="flex-1 transition-spring hover:scale-[1.02] shadow-layered hover:shadow-accent"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing Data...' : 'Start AI Analysis'}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onRemove}
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={20}
          className="sm:w-auto transition-spring hover:scale-[1.02]"
          disabled={isAnalyzing}
        >
          Choose Different File
        </Button>
      </div>
      {/* Analysis Info */}
      <div className="mt-6 glass rounded-lg border border-border p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong className="text-foreground">What happens next:</strong>
            </p>
            <ul className="space-y-1 text-xs">
              <li>• Your CSV data will be processed using advanced AI algorithms</li>
              <li>• We'll analyze patterns, trends, and generate actionable insights</li>
              <li>• Results will include data quality assessment and recommendations</li>
              <li>• Analysis typically takes 30-60 seconds depending on file size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;