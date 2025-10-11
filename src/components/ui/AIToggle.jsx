import React from 'react';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const AIToggle = ({ enabled, onChange }) => {
  return (
    <div className="glass rounded-lg p-4 border border-border">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Sparkles" size={16} className="text-accent" />
            <h4 className="font-medium text-foreground">Enhanced AI Insights</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {enabled ? 'AI will generate advanced insights, recommendations and quality assessment.' : 'Use fast rule-based analysis without AI overlay.'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange?.(!enabled)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            enabled ? 'bg-accent' : 'bg-muted'
          )}
        >
          <span
            className={cn('inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform', enabled ? 'translate-x-5' : 'translate-x-1')}
          />
        </button>
      </div>
      <div className="mt-3 flex items-center space-x-2 text-xs">
        <div className="px-2 py-1 rounded-full bg-accent/10 text-accent">AI Mode</div>
        <div className="px-2 py-1 rounded-full bg-muted/10 text-muted-foreground">Rule-based</div>
      </div>
    </div>
  );
};

export default AIToggle;
