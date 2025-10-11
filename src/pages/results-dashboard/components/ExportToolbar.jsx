import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ActionContextMenu from '../../../components/ui/ActionContextMenu';
import { useDataContext } from '../../../context/DataContext';

const ExportToolbar = ({ onExport, onShare, onSave }) => {
  const { metrics } = useDataContext();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (onExport) {
        onExport(format);
      }
      // Show success notification (would be handled by parent component)
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportActions = [
    {
      label: 'Export as PDF',
      icon: 'FileText',
      onClick: () => handleExport('pdf')
    },
    {
      label: 'Export as Excel',
      icon: 'FileSpreadsheet',
      onClick: () => handleExport('excel')
    },
    {
      label: 'Export as CSV',
      icon: 'Database',
      onClick: () => handleExport('csv')
    },
    { type: 'separator' },
    {
      label: 'Export Charts Only',
      icon: 'BarChart3',
      onClick: () => handleExport('charts')
    },
    {
      label: 'Export Insights Only',
      icon: 'Lightbulb',
      onClick: () => handleExport('insights')
    }
  ];

  const shareActions = [
    {
      label: 'Share via Email',
      icon: 'Mail',
      onClick: () => onShare && onShare('email')
    },
    {
      label: 'Generate Share Link',
      icon: 'Link',
      onClick: () => onShare && onShare('link')
    },
    {
      label: 'Share to Teams',
      icon: 'Users',
      onClick: () => onShare && onShare('teams')
    },
    { type: 'separator' },
    {
      label: 'Download for Presentation',
      icon: 'Presentation',
      onClick: () => onShare && onShare('presentation')
    }
  ];

  const quickActions = [
    {
      label: 'Print Report',
      icon: 'Printer',
      onClick: () => window.print()
    },
    {
      label: 'Bookmark Analysis',
      icon: 'Bookmark',
      onClick: () => onSave && onSave('bookmark')
    },
    { type: 'separator' },
    {
      label: 'Schedule Report',
      icon: 'Calendar',
      onClick: () => onSave && onSave('schedule')
    }
  ];

  return (
    <div className="glass rounded-xl p-4 border border-border shadow-layered">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        {/* Left Section - Export Options */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={20} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Export Results</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ActionContextMenu
              actions={exportActions}
              trigger={
                <Button
                  variant="default"
                  size="sm"
                  loading={isExporting}
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                  className="transition-spring hover:scale-105"
                >
                  {isExporting ? 'Exporting...' : 'Export Report'}
                </Button>
              }
              position="bottom-left"
            />
            
            <ActionContextMenu
              actions={shareActions}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Share"
                  iconPosition="left"
                  iconSize={16}
                  className="transition-spring hover:scale-105"
                >
                  Share
                </Button>
              }
              position="bottom-left"
            />
          </div>
        </div>

        {/* Center Section - Quick Stats */}
        <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={16} />
            <span>Generated: {new Date()?.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={16} />
            <span>{Number(metrics?.totalRecords || 0)?.toLocaleString()} records analyzed</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>Analysis time: 2.3s</span>
          </div>
        </div>

        {/* Right Section - Quick Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Save"
            iconPosition="left"
            iconSize={16}
            onClick={() => onSave && onSave('insights')}
            className="transition-spring hover:scale-105"
          >
            Save Insights
          </Button>
          
          <ActionContextMenu
            actions={quickActions}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                iconName="MoreHorizontal"
                iconSize={16}
                className="transition-spring hover:scale-105"
              />
            }
            position="bottom-right"
          />
        </div>
      </div>
      {/* Mobile Stats */}
      <div className="md:hidden mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
          <div>
            <div className="font-medium text-foreground">{Number(metrics?.totalRecords || 0)?.toLocaleString()}</div>
            <div>Records</div>
          </div>
          <div>
            <div className="font-medium text-foreground">{new Date()?.toLocaleDateString()}</div>
            <div>Generated</div>
          </div>
          <div>
            <div className="font-medium text-foreground">2.3s</div>
            <div>Analysis Time</div>
          </div>
        </div>
      </div>
      {/* Export Progress */}
      {isExporting && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse w-3/4"></div>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">Preparing export...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportToolbar;