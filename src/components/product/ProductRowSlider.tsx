"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '@/data/mockData';

type Direction = 'left' | 'right';

const slideVariants = {
  enterFromRight: { x: 100, opacity: 0, scale: 0.92 },
  enterFromLeft:  { x: -100, opacity: 0, scale: 0.92 },
  center:         { x: 0,   opacity: 1, scale: 1 },
  exitToLeft:     { x: -100, opacity: 0, scale: 0.92 },
  exitToRight:    { x: 100, opacity: 0, scale: 0.92 },
};

const springTransition = {
  type: 'spring',
  stiffness: 120,
  damping: 22,
  mass: 1.1,
} as const;

interface ProductRowSliderProps {
  products: Product[];
  sectionId: string;
  accentColor?: string; // e.g. '#fbbf24' for honey, '#3d7a45' for green
}

export function ProductRowSlider({ products, sectionId, accentColor = '#3d7a45' }: ProductRowSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = products.length;

  const goTo = useCallback((index: number, dir: Direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setActiveIndex((index + total) % total);
  }, [isAnimating, total]);

  const next = useCallback(() => goTo(activeIndex + 1, 'right'), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1, 'left'), [activeIndex, goTo]);

  // Infinite cycle autoplay
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Stagger based on section to avoid "synchronous movement" fatigue
    const delay = 6000 + (sectionId.length * 200); 
    intervalRef.current = setInterval(next, delay);
  }, [next, sectionId]);

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startInterval]);

  const pause  = () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  const resume = () => startInterval();

  const handleMouseEnter = () => { setIsHovered(true);  pause(); };
  const handleMouseLeave = () => { setIsHovered(false); resume(); };

  const getProduct = (offset: number) => products[(activeIndex + offset + total) % total];

  const positions = [
    { offset: -1, pos: 'left' as const },
    { offset:  0, pos: 'center' as const },
    { offset:  1, pos: 'right' as const },
  ];

  return (
    <div
      className="relative w-full py-8 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3-card morphing row with natural white space (80% total width) */}
      <div className="flex items-end justify-center gap-3 md:gap-5 px-4 md:px-0">
        {positions.map(({ offset, pos }) => {
          const product = getProduct(offset);
          const isCenter = pos === 'center';

          return (
            <AnimatePresence
              key={pos}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={`${product.id}-${pos}`}
                layout
                initial={direction === 'right' ? slideVariants.enterFromRight : slideVariants.enterFromLeft}
                animate={{
                  ...slideVariants.center,
                  scale: isCenter ? 1.05 : 0.92,
                  opacity: isCenter ? 1 : 0.6,
                }}
                exit={direction === 'right' ? slideVariants.exitToLeft : slideVariants.exitToRight}
                transition={springTransition}
                className={[
                  'flex-shrink-0 transition-all duration-500',
                  isCenter
                    ? 'w-[44%] md:w-[35%] lg:w-[28%] z-20 shadow-xl rounded-2xl'
                    : 'w-[25%] md:w-[28%] lg:w-[24%] z-10',
                ].join(' ')}
              >
                {/* Accent glow on center focus */}
                {isCenter && (
                  <motion.div
                    layoutId={`glow-${sectionId}`}
                    className="absolute -inset-4 rounded-3xl blur-2xl opacity-40 z-[-1]"
                    style={{ backgroundColor: accentColor }}
                    transition={springTransition}
                  />
                )}
                <div className="relative h-full">
                  <ProductCard product={product} />
                </div>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>

      {/* Modern Dot Indicators */}
      <div className="flex items-center justify-center gap-2.5 mt-10">
        {products.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              if (i === activeIndex) return;
              goTo(i, i > activeIndex ? 'right' : 'left');
            }}
            animate={{
              width: i === activeIndex ? 22 : 7,
              backgroundColor: i === activeIndex ? accentColor : '#d1d1d1',
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="h-1.5 rounded-full"
          />
        ))}
      </div>

      {/* Luxurious Nav Buttons — Appear on Hover */}
      <motion.button
        onClick={prev}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -15 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-4 md:left-12 top-[46%] -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 dark:text-stone-100 shadow-lg border border-stone-200 dark:border-stone-800 z-30"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      <motion.button
        onClick={next}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 15 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 md:right-12 top-[46%] -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 dark:text-stone-100 shadow-lg border border-stone-200 dark:border-stone-800 z-30"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
