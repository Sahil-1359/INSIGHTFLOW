import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CTASection = ({ onGetStarted }) => {
  const stats = [
    { value: '10,000+', label: 'Active Users', icon: 'Users' },
    { value: '50,000+', label: 'Files Analyzed', icon: 'FileText' },
    { value: '99.9%', label: 'Uptime', icon: 'Shield' },
    { value: '4.9/5', label: 'User Rating', icon: 'Star' }
  ];

  return (
    <section className="py-24 px-6 relative">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900 to-accent/20">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Main CTA Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8">
            <Icon name="Zap" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Start Your Analysis Journey</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Ready to Unlock Your{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Data's Potential?
            </span>
          </h2>

          {/* Supporting Text */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            Join thousands of professionals who trust InsightFlow to transform their CSV data 
            into actionable business insights. Start your free analysis today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              variant="default"
              size="xl"
              onClick={onGetStarted}
              iconName="Upload"
              iconPosition="left"
              iconSize={20}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-layered hover:shadow-accent transition-spring hover:scale-105 px-8 py-4 text-lg font-semibold"
            >
              Start Free Analysis
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              iconName="MessageCircle"
              iconPosition="left"
              iconSize={18}
              className="glass border-border hover:bg-accent/10 transition-spring hover:scale-105"
            >
              Contact Sales
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground mb-16">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm">Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-accent" />
              <span className="text-sm">60-Second Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CreditCard" size={16} className="text-success" />
              <span className="text-sm">No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Headphones" size={16} className="text-accent" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-2xl p-8 border border-border"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Trusted by Industry Leaders
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats?.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-spring shadow-layered">
                  <Icon name={stat?.icon} size={24} color="white" strokeWidth={2} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-accent transition-spring">
                  {stat?.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat?.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Message */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-muted-foreground">
              Join the growing community of data professionals who choose InsightFlow for reliable, 
              AI-powered data analysis. Your success story starts here.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;