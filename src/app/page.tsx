"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import { CategoryRibbon } from '@/components/product/CategoryRibbon';
import { ProductCard } from '@/components/product/ProductCard';
import { FloatingParticles } from '@/components/layout/FloatingParticles';
import { Testimonials } from '@/components/ui/Testimonials';
import { ContactSection } from '@/components/ui/ContactSection';
import { BrandMarquee } from '@/components/ui/BrandMarquee';
import { PromoBanners } from '@/components/ui/PromoBanners';
import { TopSellingSlider } from '@/components/product/TopSellingSlider';
import { ProductRowSlider } from '@/components/product/ProductRowSlider';
import { mockProducts } from '@/data/mockData';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const honeyProducts = mockProducts.filter(p => p.category === 'honey');
  const fruitProducts = mockProducts.filter(p => p.category === 'fruits');
  const spicesProducts = mockProducts.filter(p => p.category === 'spices');
  const datesProducts = mockProducts.filter(p => p.category === 'dates');
  const topSellingProducts = mockProducts.filter(p => p.isTopSelling);

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-stone-900 overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="relative w-full h-full bg-stone-950">
              <Image 
                src="/images/honey.png"
                alt="Premium Honey"
                fill
                className="object-cover opacity-60"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 md:px-12">
                  <div className="max-w-xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-honey-gold/20 text-honey-gold border border-honey-gold/30 text-sm font-bold tracking-wider uppercase mb-4 backdrop-blur-md">
                      100% Pure & Organic
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-sans">
                      Nature's Liquid Gold, <br/>
                      <span className="text-honey-gold font-bengali">খাঁটি সুন্দরবনের মধু</span>
                    </h1>
                    <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                      Experience the raw, unfiltered goodness of our premium Black Seed and Sundarban honey collections.
                    </p>
                    <Link href="/category/honey" className="inline-flex items-center justify-center gap-2 bg-primary-green hover:bg-primary-green-hover text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-primary-green/20 transition-all hover:gap-4">
                      Shop Honey <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          
          {/* Slide 2 */}
          <SwiperSlide>
            <div className="relative w-full h-full bg-stone-950">
              <Image 
                src="/images/mango.png"
                alt="Fresh Mangoes"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 md:px-12">
                  <div className="max-w-xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-bold tracking-wider uppercase mb-4 backdrop-blur-md">
                      Seasonal Harvest
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-sans">
                      The King of Fruits, <br/>
                      <span className="text-green-400 font-bengali">রাজশাহীর আম</span>
                    </h1>
                    <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                      Handpicked Gopalbhog and Fazli mangoes, delivered directly from the orchards of Rajshahi.
                    </p>
                    <Link href="/category/fruits" className="inline-flex items-center justify-center gap-2 bg-honey-gold hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-honey-gold/20 transition-all hover:gap-4">
                      Explore Fruits <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Categories */}
      <CategoryRibbon />

      {/* Trust Badges */}
      <BrandMarquee />

      {/* Top Selling Products Section */}
      <section className="py-20 relative bg-white dark:bg-stone-950">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <h2 className="text-3xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4 tracking-tight">Top Selling Products</h2>
            <div className="w-24 h-1 bg-honey-gold rounded-full"></div>
          </div>

          <TopSellingSlider products={topSellingProducts} />
          
          <div className="mt-6 text-center flex justify-center">
            <Link href="/category/all" className="inline-flex items-center gap-2 border-2 border-stone-800 dark:border-stone-400 text-stone-800 dark:text-stone-300 font-bold px-10 py-3.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors">
              Explore All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Selling Honey Section */}
      <section className="py-20 relative bg-amber-50/20 overflow-hidden">
        <FloatingParticles type="honey" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">Pure Honey Collection</h2>
              <p className="text-stone-500 dark:text-stone-400">Ethically sourced from deep within nature.</p>
            </div>
            <Link href="/category/honey" className="hidden md:flex items-center gap-2 text-primary-green hover:text-primary-green-hover font-semibold transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductRowSlider products={honeyProducts} sectionId="honey" accentColor="#fbbf24" />
          
          <div className="mt-8 md:hidden">
            <Link href="/category/honey" className="block w-full text-center border-2 border-primary-green text-primary-green font-bold py-3.5 rounded-xl hover:bg-primary-green/5 transition-colors">
              View All Honey
            </Link>
          </div>
        </div>
      </section>

      {/* Fresh Flash Sales Section */}
      <section className="py-20 relative bg-green-50/30 overflow-hidden">
        <FloatingParticles type="fruits" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  Flash Sale
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100">Fresh Harvest Arrivals</h2>
            </div>
            <Link href="/category/fruits" className="hidden md:flex items-center gap-2 text-primary-green hover:text-primary-green-hover font-semibold transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductRowSlider products={fruitProducts} sectionId="fruits" accentColor="#3d7a45" />
          
          <div className="mt-8 md:hidden">
            <Link href="/category/fruits" className="block w-full text-center border-2 border-primary-green text-primary-green font-bold py-3.5 rounded-xl hover:bg-primary-green/5 transition-colors">
              Explore All Fruits
            </Link>
          </div>
        </div>
      </section>

      {/* Mid-Page Promo Breaks */}
      <PromoBanners />

      {/* Masala & Spices Section */}
      <section className="py-20 relative bg-red-50/30 overflow-hidden">
        <FloatingParticles type="spices" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">Authentic Whole Spices</h2>
              <p className="text-stone-500 dark:text-stone-400">Pure, unadulterated ground and whole spices for rich flavors.</p>
            </div>
            <Link href="/category/spices" className="hidden md:flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductRowSlider products={spicesProducts} sectionId="spices" accentColor="#ef4444" />
          
          <div className="mt-8 md:hidden">
            <Link href="/category/spices" className="block w-full text-center border-2 border-red-600 text-red-600 font-bold py-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              View All Spices
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Dates Section */}
      <section className="py-20 relative bg-stone-100/50 dark:bg-stone-900/10 overflow-hidden">
        <FloatingParticles type="fruits" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-stone-800 dark:bg-stone-700 text-honey-gold px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  Imported
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-2">Premium Dates Collection</h2>
              <p className="text-stone-500 dark:text-stone-400">Handpicked imported Medjool and Ajwa dates.</p>
            </div>
            <Link href="/category/dates" className="hidden md:flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-semibold transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductRowSlider products={datesProducts} sectionId="dates" accentColor="#78350f" />
          
          <div className="mt-8 md:hidden">
            <Link href="/category/dates" className="block w-full text-center border-2 border-stone-800 dark:border-stone-400 text-stone-800 dark:text-stone-300 font-bold py-3.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              View All Dates
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
      <ContactSection />
    </div>
  );
}
