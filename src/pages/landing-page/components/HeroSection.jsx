import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Logo Badge */}
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium text-foreground">InsightFlow AI Analytics</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Transform Your Data Into{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Actionable Insights
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            Upload your CSV files and let our AI-powered platform analyze your data, identify patterns, 
            and generate business-ready insights with ROI recommendations in minutes.
          </p>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: 'Zap', text: 'AI-Powered Analysis' },
              { icon: 'Shield', text: 'Secure & Private' },
              { icon: 'TrendingUp', text: 'ROI Focused' },
              { icon: 'Clock', text: 'Instant Results' }
            ]?.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex items-center space-x-2 glass rounded-full px-4 py-2"
              >
                <Icon name={benefit?.icon} size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">{benefit?.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="default"
            size="xl"
            onClick={onGetStarted}
            iconName="Upload"
            iconPosition="left"
            iconSize={20}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-layered hover:shadow-accent transition-spring hover:scale-105 px-8 py-4 text-lg font-semibold"
          >
            Start Analyzing Your Data
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            iconName="Play"
            iconPosition="left"
            iconSize={18}
            className="glass border-border hover:bg-accent/10 transition-spring hover:scale-105"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-muted-foreground"
        >
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm">SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={16} className="text-success" />
            <span className="text-sm">GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={16} className="text-success" />
            <span className="text-sm">Data Never Stored</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-accent" />
            <span className="text-sm">Powered by OpenAI</span>
          </div>
        </motion.div>
      </div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2 text-muted-foreground"
        >
          <span className="text-sm">Scroll to explore</span>
          <Icon name="ChevronDown" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;