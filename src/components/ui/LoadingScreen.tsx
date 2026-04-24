"use client";

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-amber-50/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="honey-drop-container mb-8">
        <div className="honey-drop"></div>
      </div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-primary-green tracking-wide"
      >
        my<span className="text-honey-gold">Bazar</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-stone-500 mt-2 font-medium"
      >
        Preparing fresh natural goodness...
      </motion.p>
    </div>
  );
}
