"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '@/data/mockData';

type Direction = 'left' | 'right';

const slideVariants = {
  enterFromRight: { x: 80, opacity: 0, scale: 0.88 },
  enterFromLeft:  { x: -80, opacity: 0, scale: 0.88 },
  center:         { x: 0, opacity: 1, scale: 1 },
  exitToLeft:     { x: -80, opacity: 0, scale: 0.88 },
  exitToRight:    { x: 80, opacity: 0, scale: 0.88 },
};

const springTransition = {
  type: 'spring',
  stiffness: 120, // Lowered for a more fluid, luxurious feel
  damping: 22,    // Balanced to prevent excessive bouncing
  mass: 1.1,      // Sightly increased for a more "expensive" motion
} as const;

export function TopSellingSlider({ products }: { products: Product[] }) {
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

  // Luxurious 5s auto-play
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 5000);
  }, [next]);

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
      className="relative w-full py-6 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3-card row */}
      <div className="flex items-end justify-center gap-4 md:gap-6 px-6 md:px-12">
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
                  scale: isCenter ? 1.06 : 0.93,
                  opacity: isCenter ? 1 : 0.65,
                }}
                exit={direction === 'right' ? slideVariants.exitToLeft : slideVariants.exitToRight}
                transition={springTransition}
                className={[
                  'flex-shrink-0',
                  isCenter
                    ? 'w-[46%] md:w-[36%] lg:w-[30%] z-20 shadow-2xl rounded-2xl'
                    : 'w-[26%] md:w-[28%] lg:w-[26%] z-10',
                ].join(' ')}
              >
                {/* Morph glow only on center */}
                {isCenter && (
                  <motion.div
                    layoutId="center-glow"
                    className="absolute -inset-3 rounded-3xl bg-primary-green/10 dark:bg-primary-green/5 blur-xl"
                    transition={springTransition}
                  />
                )}
                <div className="relative">
                  <ProductCard product={product} />
                </div>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {products.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i, i > activeIndex ? 'right' : 'left')}
            animate={{
              width: i === activeIndex ? 24 : 8,
              backgroundColor: i === activeIndex ? '#3d7a45' : '#d4d4aa',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="h-2 rounded-full"
          />
        ))}
      </div>

      {/* Side arrows — completely hidden, slide in on section hover */}
      <motion.button
        onClick={prev}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="absolute left-2 md:left-6 top-[45%] -translate-y-1/2 w-10 h-10 bg-white dark:bg-stone-900 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-300 shadow-md border border-stone-200 dark:border-stone-800 z-30 pointer-events-auto"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      <motion.button
        onClick={next}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="absolute right-2 md:right-6 top-[45%] -translate-y-1/2 w-10 h-10 bg-white dark:bg-stone-900 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-300 shadow-md border border-stone-200 dark:border-stone-800 z-30 pointer-events-auto"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
