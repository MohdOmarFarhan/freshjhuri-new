"use client";

import { CheckCircle, ShieldCheck, Leaf, Award, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const badges = [
  { id: 1, text: "100% Organic Certified", icon: Leaf, color: "text-green-500", bg: "bg-green-500/10" },
  { id: 2, text: "BSTI Approved quality", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 3, text: "Halal Guaranteed", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 4, text: "Farm Fresh Sourced", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 5, text: "Premium Packaging", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: 6, text: "Chemical Free", icon: Shield, color: "text-rose-500", bg: "bg-rose-500/10" }
];

// Duplicate for infinite scroll loop without gap jumps
const marqueeBadges = [...badges, ...badges];

export function BrandMarquee() {
  return (
    <div className="w-full bg-white dark:bg-stone-950 border-y border-stone-200 dark:border-stone-800 py-6 overflow-hidden flex relative">
      {/* Background Fade Fringes */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-stone-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-stone-950 to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex items-center gap-8 w-max shrink-0"
        animate={{ x: [0, -1035] }} // Approximated width to loop through the first set
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 30, // Slow, elegant scroll
          ease: "linear"
        }}
      >
        {marqueeBadges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <div 
              key={`${badge.id}-${i}`} 
              className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 group hover:shadow-md transition-all cursor-default"
            >
              <div className={`p-2 rounded-full ${badge.bg}`}>
                <Icon className={`w-5 h-5 ${badge.color}`} />
              </div>
              <span className="font-bold text-stone-700 dark:text-stone-300 text-sm md:text-base whitespace-nowrap">
                {badge.text}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
