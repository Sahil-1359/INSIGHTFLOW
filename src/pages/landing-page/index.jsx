import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import UseCasesSection from './components/UseCasesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/csv-upload-interface');
  };

  const contextActions = [
    {
      label: 'Sign In',
      variant: 'ghost',
      icon: 'LogIn',
      onClick: () => console.log('Sign in clicked'),
    },
    {
      label: 'Get Started',
      variant: 'default',
      icon: 'ArrowRight',
      onClick: handleGetStarted,
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header contextActions={contextActions} />
      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection onGetStarted={handleGetStarted} />

        {/* Features Section */}
        <FeaturesSection />

        {/* Use Cases Section */}
        <UseCasesSection />

        {/* Final CTA Section */}
        <CTASection onGetStarted={handleGetStarted} />
      </main>
      {/* Footer */}
      <Footer />
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-layered hover:shadow-accent transition-spring z-50"
        aria-label="Scroll to top"
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default LandingPage;