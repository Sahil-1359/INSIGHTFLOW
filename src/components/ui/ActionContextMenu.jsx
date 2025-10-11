import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ActionContextMenu = ({ 
  actions = [], 
  trigger = null, 
  position = 'bottom-right',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef?.current && 
        !menuRef?.current?.contains(event?.target) &&
        triggerRef?.current &&
        !triggerRef?.current?.contains(event?.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'top-full left-0 mt-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      default:
        return 'top-full right-0 mt-2';
    }
  };

  const handleActionClick = (action) => {
    if (action?.onClick && !action?.disabled) {
      action?.onClick();
      setIsOpen(false);
    }
  };

  const DefaultTrigger = () => (
    <Button
      variant="outline"
      size="sm"
      iconName="MoreVertical"
      iconSize={16}
      className="transition-spring hover:scale-105"
    />
  );

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger || <DefaultTrigger />}
      </div>
      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`
            absolute z-200 min-w-48 glass border border-border rounded-lg shadow-layered
            animate-scale-in ${getPositionClasses()}
          `}
        >
          <div className="py-2">
            {actions?.map((action, index) => {
              if (action?.type === 'separator') {
                return (
                  <div 
                    key={index} 
                    className="my-1 border-t border-border"
                  />
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  disabled={action?.disabled}
                  className={`
                    w-full px-4 py-2 text-left text-sm transition-spring
                    flex items-center space-x-3 hover:bg-accent/10
                    focus:bg-accent/10 focus:outline-none
                    ${action?.disabled 
                      ? 'text-muted-foreground cursor-not-allowed opacity-50' 
                      : 'text-foreground hover:text-accent cursor-pointer'
                    }
                    ${action?.destructive ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : ''}
                  `}
                >
                  {action?.icon && (
                    <Icon 
                      name={action?.icon} 
                      size={16} 
                      className={action?.destructive ? 'text-destructive' : ''} 
                    />
                  )}
                  <span className="flex-1">{action?.label}</span>
                  {action?.shortcut && (
                    <span className="text-xs text-muted-foreground">
                      {action?.shortcut}
                    </span>
                  )}
                  {action?.badge && (
                    <span className="px-2 py-0.5 text-xs bg-accent text-accent-foreground rounded-full">
                      {action?.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionContextMenu;