import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API Documentation', href: '#api' },
      { label: 'Integrations', href: '#integrations' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Press Kit', href: '#press' }
    ],
    support: [
      { label: 'Help Center', href: '#help' },
      { label: 'Contact Support', href: '#contact' },
      { label: 'Status Page', href: '#status' },
      { label: 'Community', href: '#community' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'GDPR Compliance', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', href: '#twitter' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#linkedin' },
    { name: 'GitHub', icon: 'Github', href: '#github' },
    { name: 'Discord', icon: 'MessageSquare', href: '#discord' }
  ];

  return (
    <footer className="relative py-16 px-6 border-t border-border">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-layered">
                  <Icon name="TrendingUp" size={24} color="white" strokeWidth={2.5} />
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

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Transform your CSV data into actionable business insights with our AI-powered 
                analytics platform. Trusted by thousands of professionals worldwide.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Stay Updated</h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Send"
                    iconSize={14}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks)?.map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h4 className="text-sm font-semibold text-foreground mb-4 capitalize">
                {category}
              </h4>
              <ul className="space-y-3">
                {links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link?.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-spring cursor-pointer"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {currentYear} InsightFlow. All rights reserved.</span>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={14} className="text-success" />
                <span>SOC 2 Compliant</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground mr-2">Follow us:</span>
              {socialLinks?.map((social, index) => (
                <a
                  key={index}
                  href={social?.href}
                  className="w-8 h-8 bg-muted hover:bg-accent/20 rounded-lg flex items-center justify-center transition-spring hover:scale-110 group"
                  aria-label={social?.name}
                >
                  <Icon 
                    name={social?.icon} 
                    size={16} 
                    className="text-muted-foreground group-hover:text-accent transition-spring" 
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Additional Trust Signals */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Lock" size={12} className="text-success" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Database" size={12} className="text-success" />
              <span>Zero Data Retention</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Globe" size={12} className="text-success" />
              <span>GDPR & CCPA Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Zap" size={12} className="text-accent" />
              <span>Powered by OpenAI GPT-4</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;