import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import heroAerial from "@/assets/hero-farm-aerial.jpg";
import heroHarvest from "@/assets/hero-harvest.jpg";
import heroPond from "@/assets/hero-pond.jpg";
import heroSunset from "@/assets/hero-sunset-farm.jpg";

const slides = [
  {
    image: heroPond,
    alt: "Premium aquaculture fish pond with healthy fish",
    badge: "100% Quality Guaranteed",
    title: (
      <>
        The Science of{" "}
        <span className="text-primary">Healthy</span> Fish Farming
      </>
    ),
    subtitle:
      "Supplying 100% Quality Tested Feeds and Medicines to Boost Your Harvest. Trusted by thousands of farmers nationwide.",
  },
  {
    image: heroAerial,
    alt: "Aerial view of commercial fish farm",
    badge: "Modern Aquaculture",
    title: (
      <>
        Scale Your Farm with{" "}
        <span className="text-primary">Premium</span> Nutrition
      </>
    ),
    subtitle:
      "From fingerlings to harvest-ready fish — our scientifically formulated feeds ensure maximum growth and profitability.",
  },
  {
    image: heroHarvest,
    alt: "Fresh fish harvest from pond",
    badge: "Trusted by 5000+ Farmers",
    title: (
      <>
        Maximize Your{" "}
        <span className="text-primary">Harvest</span> Potential
      </>
    ),
    subtitle:
      "Our feeds and medicines are designed to deliver healthier fish, faster growth, and higher yields every season.",
  },
  {
    image: heroSunset,
    alt: "Fish farm at sunset",
    badge: "Sustainable Farming",
    title: (
      <>
        Building a{" "}
        <span className="text-primary">Sustainable</span> Future
      </>
    ),
    subtitle:
      "Eco-friendly raw materials and advanced formulations that protect your pond ecosystem while boosting production.",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const imageVariants = {
    enter: (dir: number) => ({ opacity: 0, scale: 1.1, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, scale: 1.05, x: dir > 0 ? -60 : 60 }),
  };

  const contentVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images */}
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/70 via-forest/45 to-forest/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Animated ripple effect */}
      <div className="absolute bottom-20 left-1/4 w-32 h-32 rounded-full border-2 border-primary/20 animate-ripple z-10" />
      <div className="absolute bottom-32 right-1/3 w-24 h-24 rounded-full border-2 border-primary/15 animate-ripple [animation-delay:0.5s] z-10" />

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {slide.badge}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
                {slide.title}
              </h1>

              <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl text-lg hover:brightness-110 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              Shop Now
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground font-semibold rounded-2xl text-lg hover:bg-white/20 transition-all"
            >
              Consult an Expert
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 sm:gap-12 mt-16 pt-8 border-t border-white/10">
            {[
              { value: "5000+", label: "Farmers Served" },
              { value: "150+", label: "Products" },
              { value: "99%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/60 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground hover:bg-white/20 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground hover:bg-white/20 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-primary"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
