import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const LoadingAnimation = ({ stage }) => {
  const animations = {
    'Validating data structure': {
      icon: 'FileCheck',
      particles: 3,
      color: 'text-primary'
    },
    'Analyzing patterns': {
      icon: 'TrendingUp',
      particles: 5,
      color: 'text-accent'
    },
    'Processing with AI': {
      icon: 'Brain',
      particles: 8,
      color: 'text-success'
    },
    'Generating insights': {
      icon: 'Lightbulb',
      particles: 6,
      color: 'text-warning'
    },
    'Finalizing results': {
      icon: 'CheckCircle',
      particles: 4,
      color: 'text-success'
    }
  };

  const currentAnimation = animations?.[stage] || animations?.['Processing with AI'];

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Central Icon */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-layered">
          <Icon 
            name={currentAnimation?.icon} 
            size={28} 
            className="text-white" 
          />
        </div>
      </motion.div>
      {/* Orbiting Particles */}
      {Array.from({ length: currentAnimation?.particles })?.map((_, index) => {
        const angle = (360 / currentAnimation?.particles) * index;
        const delay = index * 0.2;
        
        return (
          <motion.div
            key={index}
            className="absolute w-3 h-3 bg-accent rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 0'
            }}
            animate={{
              rotate: 360,
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              rotate: { 
                duration: 4, 
                repeat: Infinity, 
                ease: "linear",
                delay 
              },
              scale: { 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay 
              }
            }}
            initial={{
              x: Math.cos((angle * Math.PI) / 180) * 50,
              y: Math.sin((angle * Math.PI) / 180) * 50
            }}
          />
        );
      })}
      {/* Pulsing Ring */}
      <motion.div
        className="absolute inset-0 border-2 border-accent/30 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default LoadingAnimation;