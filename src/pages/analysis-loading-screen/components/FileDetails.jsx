import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FileDetails = ({ fileName, fileSize, rowCount, columns }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-lg p-6 border border-border"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="FileText" size={24} className="text-accent" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-foreground truncate">
            {fileName}
          </h4>
          
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Icon name="HardDrive" size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {formatFileSize(fileSize)}
                </div>
                <div className="text-xs text-muted-foreground">File Size</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Hash" size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {rowCount?.toLocaleString() || '0'}
                </div>
                <div className="text-xs text-muted-foreground">Rows</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Columns" size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {columns?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Columns</div>
              </div>
            </div>
          </div>
          
          {columns && columns?.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-muted-foreground mb-2">Column Names</div>
              <div className="flex flex-wrap gap-1">
                {columns?.slice(0, 6)?.map((column, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted/50 text-xs text-foreground rounded-md"
                  >
                    {column}
                  </span>
                ))}
                {columns?.length > 6 && (
                  <span className="px-2 py-1 bg-muted/50 text-xs text-muted-foreground rounded-md">
                    +{columns?.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileDetails;