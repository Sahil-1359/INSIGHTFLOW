import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'Upload',
      title: 'Smart CSV Upload',
      description: 'Drag & drop interface with instant validation. Supports files up to 5MB with real-time format checking and error handling.',
      benefits: ['Drag & Drop Interface', 'Format Validation', 'Size Optimization']
    },
    {
      icon: 'Brain',
      title: 'AI-Powered Analysis',
      description: 'Advanced OpenAI integration analyzes your data patterns, identifies anomalies, and generates actionable business insights.',
      benefits: ['Pattern Recognition', 'Anomaly Detection', 'Smart Recommendations']
    },
    {
      icon: 'BarChart3',
      title: 'Interactive Dashboard',
      description: 'Beautiful visualizations with animated charts, metrics counters, and exportable reports for data-driven decisions.',
      benefits: ['Real-time Charts', 'Animated Metrics', 'Export Options']
    },
    {
      icon: 'Target',
      title: 'ROI Recommendations',
      description: 'Get specific, actionable recommendations with estimated ROI impact and priority levels for immediate implementation.',
      benefits: ['ROI Estimates', 'Priority Scoring', 'Action Plans']
    },
    {
      icon: 'Shield',
      title: 'Data Security',
      description: 'Your data is processed securely and never stored. Full GDPR compliance with SSL encryption throughout.',
      benefits: ['Zero Data Storage', 'SSL Encryption', 'GDPR Compliant']
    },
    {
      icon: 'Zap',
      title: 'Instant Results',
      description: 'Get comprehensive analysis results in under 60 seconds with confidence scores and detailed explanations.',
      benefits: ['Sub-60s Analysis', 'Confidence Scores', 'Detailed Reports']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-800/30"></div>
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
            <Icon name="Sparkles" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need for{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Data Success
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From upload to insights, our platform provides a complete solution for transforming 
            your CSV data into actionable business intelligence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features?.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group glass rounded-2xl p-8 hover:shadow-accent transition-spring hover:scale-105 border border-border"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-spring shadow-layered">
                <Icon name={feature?.icon} size={28} color="white" strokeWidth={2} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-spring">
                {feature?.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature?.description}
              </p>

              {/* Benefits List */}
              <ul className="space-y-2">
                {feature?.benefits?.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Transform Your Data?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of professionals who trust InsightFlow for their data analysis needs.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-accent" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-accent" />
                <span>50,000+ Files Analyzed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Star" size={16} className="text-accent" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;