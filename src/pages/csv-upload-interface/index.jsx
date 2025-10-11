import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import FileUploadZone from './components/FileUploadZone';
import { RequirementsGrid, SupportedFormatsSection, TipsSection } from './components/FileRequirements';
import FilePreview from './components/FilePreview';
import UploadProgress from './components/UploadProgress';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useDataContext } from '../../context/DataContext';

const CSVUploadInterface = () => {
  const navigate = useNavigate();
  const { ingestCSV } = useDataContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = (file, error) => {
    if (error) {
      setUploadError(error);
      setSelectedFile(null);
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
    
    // Simulate file upload process
    if (file) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadStatus('validating');
          
          // Simulate validation
          setTimeout(() => {
            setUploadStatus('success');
            setIsUploading(false);
          }, 1000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setIsUploading(false);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    try {
      await ingestCSV(selectedFile);
      navigate('/analysis-loading-screen');
    } catch (e) {
      setUploadError(e?.message || 'Failed to read CSV. Please check the file.');
      setIsAnalyzing(false);
    }
  };

  const contextActions = [
    {
      label: 'Back to Home',
      icon: 'ArrowLeft',
      variant: 'ghost',
      onClick: () => navigate('/landing-page')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header contextActions={contextActions} />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-16 px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon name="Upload" size={16} />
              <span>Step 2 of 4</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Upload Your <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CSV Data</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Drag and drop your CSV file or click to browse. Our AI will analyze your data and provide actionable insights within minutes.
            </p>
            
            {/* Progress Indicator */}
            <div className="mb-12">
              <ProgressIndicator currentStep={2} />
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Zone - Takes 2 columns on large screens */}
              <div className="lg:col-span-2 space-y-8">
                {/* AI runs automatically on analyze; toggle removed */}
                {/* Error Message */}
                {uploadError && (
                  <div className="glass rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-destructive">Upload Error</h4>
                        <p className="text-sm text-destructive/80 mt-1">{uploadError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="flex justify-center">
                    <UploadProgress 
                      progress={uploadProgress}
                      status={uploadStatus}
                      fileName={selectedFile?.name}
                    />
                  </div>
                )}

                {/* File Preview or Upload Zone */}
                {selectedFile && !isUploading ? (
                  <FilePreview 
                    file={selectedFile}
                    onRemove={handleRemoveFile}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                  />
                ) : !isUploading ? (
                  <FileUploadZone 
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    isUploading={isUploading}
                  />
                ) : null}

                {/* File Requirements below the upload area */}
                <RequirementsGrid />
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-8">
                  <SupportedFormatsSection />
                  <TipsSection />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-muted/20 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Need Help Getting Started?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered analysis works best with clean, structured data. Here are some tips to get the most out of your analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-xl border border-border p-6 text-center hover:border-accent/50 transition-spring">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="FileSpreadsheet" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Sample Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download our sample CSV file to see the recommended format and structure.
                </p>
                <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                  Download Sample
                </Button>
              </div>

              <div className="glass rounded-xl border border-border p-6 text-center hover:border-accent/50 transition-spring">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="HelpCircle" size={24} className="text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn about supported formats, data preparation, and analysis features.
                </p>
                <Button variant="outline" size="sm" iconName="ExternalLink" iconPosition="left">
                  View Docs
                </Button>
              </div>

              <div className="glass rounded-xl border border-border p-6 text-center hover:border-accent/50 transition-spring">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageCircle" size={24} className="text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get help from our team if you encounter any issues with your upload.
                </p>
                <Button variant="outline" size="sm" iconName="Mail" iconPosition="left">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CSVUploadInterface;