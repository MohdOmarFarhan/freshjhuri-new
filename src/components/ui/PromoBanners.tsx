"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, Zap } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="py-12 bg-white dark:bg-stone-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Promo Banner 1 */}
          <div className="relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden group">
            <Image 
              src="/images/honey.png" 
              alt="Promo Honey" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 dark:opacity-70"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
              <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-max mb-4 shadow-lg shadow-red-600/30">
                <Zap className="w-3.5 h-3.5" /> Wild Drop
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                Sundarban <br/> Raw Honey
              </h3>
              <p className="text-stone-300 mb-6 max-w-xs">
                Limited pristine harvest directly from deep forest combs.
              </p>
              <Link 
                href="/category/honey" 
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-stone-900 font-bold px-6 py-3 rounded-xl w-max transition-all hover:gap-3"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Promo Banner 2 */}
          <div className="relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden group">
            <Image 
              src="/images/dates.png" 
              alt="Promo Dates" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 dark:opacity-70"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 bg-honey-gold text-stone-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-max mb-4 shadow-lg shadow-honey-gold/30">
                <Tag className="w-3.5 h-3.5" /> Bulk Deal
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                Premium <br/> Saudi Medjool
              </h3>
              <p className="text-stone-300 mb-6 max-w-xs">
                Buy huge 5kg boxes and save up to 35% instantly.
              </p>
              <Link 
                href="/category/dates" 
                className="inline-flex items-center gap-2 bg-primary-green hover:bg-primary-green-hover text-white font-bold px-6 py-3 rounded-xl w-max transition-all shadow-lg shadow-primary-green/20 hover:gap-3"
              >
                Grab Offer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
