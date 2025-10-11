import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import ProgressDisplay from './components/ProgressDisplay';
import StatusMessages from './components/StatusMessages';
import FileDetails from './components/FileDetails';
import PreliminaryMetrics from './components/PreliminaryMetrics';
import ErrorHandler from './components/ErrorHandler';
import LoadingAnimation from './components/LoadingAnimation';
import { useDataContext } from '../../context/DataContext';


const AnalysisLoadingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileInfo, metrics } = useDataContext();
  
  // File details from context
  const fileData = {
    fileName: fileInfo?.name || location?.state?.fileName || 'data.csv',
    fileSize: fileInfo?.size || location?.state?.fileSize || 0,
    rowCount: metrics?.totalRecords || 0,
    columns: []
  };

  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('Validating data structure');
  const [statusHistory, setStatusHistory] = useState([]);
  const [preliminaryMetrics, setPreliminaryMetrics] = useState({
    dataQuality: metrics?.accuracy || 0,
    completeness: metrics?.completeness || 0,
    anomalies: metrics?.anomalies || 0,
    patterns: 0
  });
  const [error, setError] = useState(null);
  const [canCancel, setCanCancel] = useState(true);

  const stages = [
    { name: 'Validating data structure', duration: 2000, progress: 15 },
    { name: 'Analyzing patterns', duration: 3000, progress: 35 },
    { name: 'Processing with AI', duration: 4000, progress: 70 },
    { name: 'Generating insights', duration: 2500, progress: 90 },
    { name: 'Finalizing results', duration: 1500, progress: 100 }
  ];

  const [stageIndex, setStageIndex] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('2-3 minutes');

  useEffect(() => {
    // Simulate analysis progress
    const simulateAnalysis = async () => {
      try {
        for (let i = 0; i < stages?.length; i++) {
          const stage = stages?.[i];
          setCurrentStage(stage?.name);
          setStageIndex(i);
          
          // Update estimated time
          const remainingStages = stages?.length - i - 1;
          const avgTimePerStage = 2500;
          const remainingTime = Math.ceil((remainingStages * avgTimePerStage) / 1000);
          setEstimatedTime(remainingTime > 0 ? `${remainingTime} seconds` : 'Almost done');
          
          // Disable cancel after critical processing starts
          if (i >= 2) setCanCancel(false);
          
          // Animate progress
          const startProgress = i === 0 ? 0 : stages?.[i - 1]?.progress;
          const targetProgress = stage?.progress;
          const progressDuration = stage?.duration;
          const progressSteps = 20;
          const progressIncrement = (targetProgress - startProgress) / progressSteps;
          
          for (let step = 0; step < progressSteps; step++) {
            await new Promise(resolve => setTimeout(resolve, progressDuration / progressSteps));
            setProgress(prev => Math.min(targetProgress, prev + progressIncrement));
          }
          
          // Add to status history
          setStatusHistory(prev => [...prev, stage?.name]);
        }
        
        // Analysis complete - navigate to results
        setTimeout(() => {
          navigate('/results-dashboard');
        }, 1000);
        
      } catch (err) {
        setError({
          type: err?.message || 'api_error',
          details: 'Analysis service temporarily unavailable'
        });
      }
    };

    simulateAnalysis();
  }, []);

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setStageIndex(0);
    setCurrentStage('Validating data structure');
    setStatusHistory([]);
    setPreliminaryMetrics({ dataQuality: 0, completeness: 0, anomalies: 0, patterns: 0 });
    setCanCancel(true);
    // Restart analysis simulation
    window.location?.reload();
  };

  const handleCancel = () => {
    navigate('/csv-upload-interface');
  };

  const contextActions = [
    ...(canCancel ? [{
      label: 'Cancel Analysis',
      icon: 'X',
      variant: 'outline',
      onClick: handleCancel
    }] : [])
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header contextActions={contextActions} />
        <div className="pt-16 min-h-screen flex items-center justify-center p-6">
          <ErrorHandler 
            error={error}
            onRetry={handleRetry}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header contextActions={contextActions} />
      <div className="pt-16 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Analyzing Your Data
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI is processing your CSV file to generate comprehensive insights and actionable recommendations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Progress Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-lg p-8 border border-border text-center"
              >
                <ProgressDisplay 
                  progress={Math.round(progress)}
                  stage={currentStage}
                  estimatedTime={estimatedTime}
                />
                
                <div className="mt-8">
                  <LoadingAnimation stage={currentStage} />
                </div>
              </motion.div>

              {/* Status Messages */}
              <StatusMessages 
                currentStatus={currentStage}
                statusHistory={statusHistory}
              />

              {/* Preliminary Metrics */}
              {progress > 20 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PreliminaryMetrics metrics={preliminaryMetrics} />
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* File Details */}
              <FileDetails 
                fileName={fileData?.fileName}
                fileSize={fileData?.fileSize}
                rowCount={fileData?.rowCount}
                columns={fileData?.columns}
              />

              {/* Analysis Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass rounded-lg p-6 border border-border"
              >
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  What We're Analyzing
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Data quality and completeness assessment
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Pattern recognition and trend analysis
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Anomaly detection and outlier identification
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">
                      Business insights and recommendations
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass rounded-lg p-6 border border-border"
              >
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  Pro Tips
                </h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Keep this tab open to monitor progress</p>
                  <p>• Analysis time depends on data complexity</p>
                  <p>• Results will include interactive visualizations</p>
                  <p>• You can export insights in multiple formats</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoadingScreen;