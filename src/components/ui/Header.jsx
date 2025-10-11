import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ contextActions = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Upload Data', path: '/csv-upload-interface', icon: 'Upload' },
    { label: 'Dashboard', path: '/results-dashboard', icon: 'BarChart3' },
    { label: 'Analysis', path: '/analysis-loading-screen', icon: 'Activity' },
  ];

  const handleLogoClick = () => {
    navigate('/landing-page');
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const Logo = () => (
    <div 
      onClick={handleLogoClick}
      className="flex items-center space-x-3 cursor-pointer group transition-spring hover:scale-105"
    >
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-layered group-hover:shadow-accent transition-spring">
          <Icon name="TrendingUp" size={24} color="white" strokeWidth={2.5} />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground tracking-tight">
          InsightFlow
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          AI Analytics Platform
        </span>
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-100 glass border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="transition-spring hover:scale-105"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Context Actions & Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* Context Actions */}
          {contextActions?.length > 0 && (
            <div className="hidden sm:flex items-center space-x-2">
              {contextActions?.map((action, index) => (
                <Button
                  key={index}
                  variant={action?.variant || "outline"}
                  size={action?.size || "sm"}
                  onClick={action?.onClick}
                  iconName={action?.icon}
                  iconPosition={action?.iconPosition || "left"}
                  iconSize={action?.iconSize || 16}
                  disabled={action?.disabled}
                  loading={action?.loading}
                  className="transition-spring hover:scale-105"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              iconName={isMenuOpen ? "X" : "Menu"}
              iconSize={20}
              className="transition-spring hover:scale-105"
            />
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-border animate-slide-in">
          <div className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                size="sm"
                fullWidth
                onClick={() => {
                  navigate(item?.path);
                  setIsMenuOpen(false);
                }}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                className="justify-start transition-spring hover:scale-[1.02]"
              >
                {item?.label}
              </Button>
            ))}
            
            {/* Mobile Context Actions */}
            {contextActions?.length > 0 && (
              <>
                <div className="border-t border-border my-3"></div>
                {contextActions?.map((action, index) => (
                  <Button
                    key={index}
                    variant={action?.variant || "outline"}
                    size="sm"
                    fullWidth
                    onClick={() => {
                      action?.onClick();
                      setIsMenuOpen(false);
                    }}
                    iconName={action?.icon}
                    iconPosition={action?.iconPosition || "left"}
                    iconSize={action?.iconSize || 16}
                    disabled={action?.disabled}
                    loading={action?.loading}
                    className="justify-start transition-spring hover:scale-[1.02]"
                  >
                    {action?.label}
                  </Button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;