import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFileSelect, selectedFile, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e?.dataTransfer?.items && e?.dataTransfer?.items?.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = e?.dataTransfer?.files;
    if (files && files?.length > 0) {
      handleFileSelection(files?.[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (file) {
      // Validate file type
      if (!file?.name?.toLowerCase()?.endsWith('.csv')) {
        onFileSelect(null, 'Please select a CSV file only.');
        return;
      }

      // Validate file size (30MB limit)
      const maxSize = 30 * 1024 * 1024; // 30MB in bytes
      if (file?.size > maxSize) {
        onFileSelect(null, 'File size must be less than 30MB.');
        return;
      }

      onFileSelect(file, null);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    handleFileSelection(file);
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef?.current?.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="w-full">
      {/* Upload Zone */}
      <div
        className={`
          relative w-full h-80 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
          glass backdrop-blur-xl overflow-hidden group
          ${isDragOver 
            ? 'border-accent bg-accent/10 scale-[1.02] shadow-accent' 
            : selectedFile 
              ? 'border-success bg-success/5 shadow-soft' 
              : 'border-border hover:border-accent/50 hover:bg-accent/5'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Content: absolute-centered to avoid any padding drift */}
        <div className="absolute inset-0 z-10 grid place-items-center text-center p-0">
          <div className="flex flex-col items-center justify-center">
          {selectedFile ? (
            // File Selected State
            (<div className="space-y-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                <Icon name="FileCheck" size={32} className="text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-success mb-2">File Ready</h3>
                <p className="text-sm text-foreground font-medium">{selectedFile?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(selectedFile?.size)} • CSV File
                </p>
              </div>
            </div>)
          ) : isDragOver ? (
            // Drag Over State
            (<div className="space-y-4 animate-bounce">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                <Icon name="Download" size={32} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">Drop Your File</h3>
                <p className="text-sm text-muted-foreground">Release to upload your CSV file</p>
              </div>
            </div>)
          ) : (
            // Default State
            (<div className="space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Icon name="Upload" size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drag & Drop Your CSV File
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Or click to browse and select your file
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  iconName="FolderOpen"
                  iconPosition="left"
                  iconSize={16}
                  className="pointer-events-none mx-auto"
                >
                  Choose File
                </Button>
              </div>
            </div>)
          )}
          </div>
        </div>

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-muted-foreground">Processing file...</p>
            </div>
          </div>
        )}
      </div>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadZone;