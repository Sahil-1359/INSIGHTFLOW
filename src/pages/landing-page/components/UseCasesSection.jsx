import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const UseCasesSection = () => {
  const useCases = [
    {
      icon: 'TrendingUp',
      title: 'Business Analysts',
      description: 'Transform complex datasets into clear business insights with automated pattern recognition and trend analysis.',
      example: 'Analyze quarterly sales data to identify top-performing products and seasonal trends',
      metrics: ['40% faster analysis', '95% accuracy rate', '60+ data points'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'Target',
      title: 'Marketing Professionals',
      description: 'Optimize campaign performance with AI-driven insights on customer behavior and conversion patterns.',
      example: 'Evaluate email campaign metrics to improve open rates and customer engagement',
      metrics: ['3x ROI improvement', '85% prediction accuracy', '25+ KPIs tracked'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'Settings',
      title: 'Operations Managers',
      description: 'Streamline processes and identify efficiency bottlenecks with comprehensive operational data analysis.',
      example: 'Monitor production metrics to reduce waste and optimize resource allocation',
      metrics: ['30% cost reduction', '50% time savings', '99% uptime tracking'],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // Testimonials section removed per request

  return (
    <section className="py-24 px-6 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 to-slate-900/50"></div>
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
            <Icon name="Users" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Use Cases</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professionals
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how different professionals use InsightFlow to make data-driven decisions 
            and achieve measurable business results.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {useCases?.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group glass rounded-2xl p-8 hover:shadow-accent transition-spring hover:scale-105 border border-border"
            >
              {/* Icon with Gradient */}
              <div className={`w-16 h-16 bg-gradient-to-br ${useCase?.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-spring shadow-layered`}>
                <Icon name={useCase?.icon} size={28} color="white" strokeWidth={2} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-spring">
                {useCase?.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {useCase?.description}
              </p>

              {/* Example */}
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-border/50">
                <p className="text-sm text-muted-foreground italic">
                  "{useCase?.example}"
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                {useCase?.metrics?.map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    <span className="text-foreground font-medium">{metric}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials removed */}
      </div>
    </section>
  );
};

export default UseCasesSection;