import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import DataQualityOverview from './components/DataQualityOverview';
import InsightsSection from './components/InsightsSection';
import InteractiveCharts from './components/InteractiveCharts';
import ExportToolbar from './components/ExportToolbar';

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExport = (format) => {
    showNotification(`Report exported successfully as ${format?.toUpperCase()}`, 'success');
  };

  const handleShare = (method) => {
    switch (method) {
      case 'email':
        showNotification('Email sharing dialog opened', 'info');
        break;
      case 'link':
        showNotification('Share link copied to clipboard', 'success');
        break;
      case 'teams':
        showNotification('Shared to team workspace', 'success');
        break;
      case 'presentation':
        showNotification('Presentation format downloaded', 'success');
        break;
      default:
        showNotification('Sharing initiated', 'info');
    }
  };

  const handleSave = (type) => {
    switch (type) {
      case 'insights':
        showNotification('Insights saved to your workspace', 'success');
        break;
      case 'bookmark':
        showNotification('Analysis bookmarked successfully', 'success');
        break;
      case 'schedule':
        showNotification('Report scheduling dialog opened', 'info');
        break;
      default:
        showNotification('Saved successfully', 'success');
    }
  };

  const contextActions = [
    {
      label: 'Analyze New File',
      icon: 'Upload',
      variant: 'outline',
      onClick: () => navigate('/csv-upload-interface')
    },
    {
      label: 'Export Report',
      icon: 'Download',
      variant: 'default',
      onClick: () => handleExport('pdf')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header contextActions={contextActions} />
        <div className="pt-16">
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Loading Dashboard</h2>
              <p className="text-sm text-muted-foreground">Preparing your analysis results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header contextActions={contextActions} />
      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 glass rounded-lg p-4 border shadow-layered animate-slide-in ${
          notification?.type === 'success' ? 'border-success/20 bg-success/5' :
          notification?.type === 'error'? 'border-destructive/20 bg-destructive/5' : 'border-accent/20 bg-accent/5'
        }`}>
          <div className="flex items-center space-x-3">
            <Icon 
              name={notification?.type === 'success' ? 'CheckCircle' : 
                   notification?.type === 'error' ? 'XCircle' : 'Info'} 
              size={20} 
              className={notification?.type === 'success' ? 'text-success' :
                        notification?.type === 'error'? 'text-destructive' : 'text-accent'} 
            />
            <span className="text-sm text-foreground">{notification?.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Analysis Results</h1>
                <p className="text-muted-foreground">
                  Comprehensive insights from your CSV data analysis • Generated on {new Date()?.toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 text-success rounded-lg border border-success/20">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm font-medium">Analysis Complete</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/csv-upload-interface')}
                  iconName="Upload"
                  iconPosition="left"
                  iconSize={16}
                  className="transition-spring hover:scale-105"
                >
                  Analyze New File
                </Button>
              </div>
            </div>
          </div>

          {/* Export Toolbar */}
          <div className="mb-8">
            <ExportToolbar 
              onExport={handleExport}
              onShare={handleShare}
              onSave={handleSave}
            />
          </div>

          {/* Dashboard Content */}
          <div className="space-y-8">
            {/* Data Quality Overview */}
            <DataQualityOverview />

            {/* Interactive Charts */}
            <InteractiveCharts />

            {/* AI Insights Section */}
            <InsightsSection />

          </div>

          {/* Bottom Actions */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-muted-foreground">
                Analysis powered by InsightFlow AI • {new Date()?.getFullYear()} InsightFlow Analytics
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/analysis-loading-screen')}
                  iconName="RotateCcw"
                  iconPosition="left"
                  iconSize={16}
                >
                  Re-analyze Data
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave('insights')}
                  iconName="Save"
                  iconPosition="left"
                  iconSize={16}
                  className="transition-spring hover:scale-105"
                >
                  Save Insights
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/csv-upload-interface')}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                  className="transition-spring hover:scale-105"
                >
                  New Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;