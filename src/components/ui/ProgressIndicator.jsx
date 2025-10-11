import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentStep = 1, 
  totalSteps = 4, 
  steps = [
    { label: 'Welcome', icon: 'Home' },
    { label: 'Upload', icon: 'Upload' },
    { label: 'Processing', icon: 'Activity' },
    { label: 'Results', icon: 'BarChart3' }
  ],
  className = '' 
}) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-success border-success text-success-foreground shadow-soft',
          line: 'bg-success',
          label: 'text-success font-medium'
        };
      case 'current':
        return {
          circle: 'bg-primary border-primary text-primary-foreground shadow-accent animate-pulse-slow',
          line: 'bg-muted',
          label: 'text-primary font-semibold'
        };
      default:
        return {
          circle: 'bg-muted border-muted text-muted-foreground',
          line: 'bg-muted',
          label: 'text-muted-foreground'
        };
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="flex items-center justify-between relative">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const status = getStepStatus(stepNumber);
          const styles = getStepStyles(status);
          const isLast = index === steps?.length - 1;

          return (
            <div key={index} className="flex items-center flex-1 relative">
              {/* Step Circle */}
              <div className="relative z-10 flex flex-col items-center">
                <div 
                  className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center
                    transition-spring hover:scale-110 ${styles?.circle}
                  `}
                >
                  {status === 'completed' ? (
                    <Icon name="Check" size={20} strokeWidth={2.5} />
                  ) : (
                    <Icon name={step?.icon} size={20} strokeWidth={2} />
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <div className={`text-sm transition-spring ${styles?.label}`}>
                    {step?.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Step {stepNumber}
                  </div>
                </div>
              </div>
              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-4 relative">
                  <div className="absolute inset-0 bg-muted rounded-full"></div>
                  <div 
                    className={`
                      absolute inset-0 rounded-full transition-all duration-500 ease-out
                      ${status === 'completed' ? styles?.line : 'w-0'}
                    `}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Progress Bar */}
      <div className="mt-8 w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700 ease-out shadow-accent"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      {/* Progress Text */}
      <div className="mt-3 flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          Progress: {currentStep} of {totalSteps}
        </span>
        <span className="text-primary font-medium">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;