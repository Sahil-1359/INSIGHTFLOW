import React from 'react';
import Icon from '../../../components/AppIcon';

const requirements = [
    {
      icon: 'FileText',
      title: 'CSV Format Only',
      description: 'File must have .csv extension with comma-separated values'
    },
    {
      icon: 'HardDrive',
      title: 'Maximum 5MB',
      description: 'File size should not exceed 5 megabytes for optimal processing'
    },
    {
      icon: 'Table',
      title: 'Structured Data',
      description: 'First row should contain column headers for better analysis'
    },
    {
      icon: 'Shield',
      title: 'Data Security',
      description: 'Your data is processed securely and not stored permanently'
    }
  ];

const supportedFormats = [
    { format: 'CSV', description: 'Comma Separated Values', supported: true },
    { format: 'Excel', description: '.xlsx, .xls files', supported: false },
    { format: 'JSON', description: 'JavaScript Object Notation', supported: false },
    { format: 'XML', description: 'Extensible Markup Language', supported: false }
  ];

export const RequirementsGrid = () => (
  <div>
    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
      <Icon name="CheckCircle" size={20} className="text-success mr-2" />
      File Requirements
    </h3>
    <div className="grid grid-cols-1 gap-4 items-stretch">
      {requirements?.map((req, index) => (
        <div key={index} className="glass rounded-lg p-4 border border-border hover:border-accent/50 transition-spring h-full">
          <div className="flex items-start space-x-3 h-full">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={req?.icon} size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="font-medium text-foreground text-sm">{req?.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {req?.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SupportedFormatsSection = () => (
  <div>
    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
      <Icon name="FileType" size={20} className="text-accent mr-2" />
      Supported Formats
    </h3>
    <div className="glass rounded-lg border border-border overflow-hidden">
      {supportedFormats?.map((format, index) => (
        <div 
          key={index} 
          className={`
            flex items-center justify-between p-4 transition-spring
            ${index !== supportedFormats?.length - 1 ? 'border-b border-border' : ''}
            ${format?.supported ? 'hover:bg-success/5' : 'hover:bg-muted/5'}
          `}
        >
          <div className="flex items-center space-x-3">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              ${format?.supported ? 'bg-success/20' : 'bg-muted/20'}
            `}>
              <Icon 
                name={format?.supported ? "Check" : "X"} 
                size={16} 
                className={format?.supported ? "text-success" : "text-muted-foreground"} 
              />
            </div>
            <div>
              <p className={`font-medium text-sm ${format?.supported ? 'text-foreground' : 'text-muted-foreground'}`}>
                {format?.format}
              </p>
              <p className="text-xs text-muted-foreground">{format?.description}</p>
            </div>
          </div>
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${format?.supported 
              ? 'bg-success/20 text-success' :'bg-muted/20 text-muted-foreground'
            }
          `}>
            {format?.supported ? 'Supported' : 'Coming Soon'}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const TipsSection = () => (
  <div className="glass rounded-lg border border-border p-6">
    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
      <Icon name="Lightbulb" size={20} className="text-warning mr-2" />
      Tips for Better Results
    </h3>
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <Icon name="ArrowRight" size={16} className="text-accent mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          Ensure your CSV has clear column headers in the first row
        </p>
      </div>
      <div className="flex items-start space-x-3">
        <Icon name="ArrowRight" size={16} className="text-accent mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          Remove any empty rows or columns to improve analysis accuracy
        </p>
      </div>
      <div className="flex items-start space-x-3">
        <Icon name="ArrowRight" size={16} className="text-accent mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          Use consistent date formats throughout your dataset
        </p>
      </div>
      <div className="flex items-start space-x-3">
        <Icon name="ArrowRight" size={16} className="text-accent mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          Larger datasets (1000+ rows) provide more comprehensive insights
        </p>
      </div>
    </div>
  </div>
);

// Default export preserves previous usage (all sections, original order)
const FileRequirements = () => (
  <div className="space-y-8">
    <RequirementsGrid />
    <SupportedFormatsSection />
    <TipsSection />
  </div>
);

export default FileRequirements;