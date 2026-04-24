"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockProducts, Product } from '@/data/mockData';
import { ProductGallery } from '@/components/product/ProductGallery';
import { BuyBox } from '@/components/product/BuyBox';
import { StickyMobileBuyBar } from '@/components/product/StickyMobileBuyBar';
import { ProductTabs } from '@/components/product/ProductTabs';
import { FrequentlyBoughtTogether } from '@/components/product/FrequentlyBoughtTogether';
import { FloatingParticles } from '@/components/layout/FloatingParticles';
import { Testimonials } from '@/components/ui/Testimonials';
import { CategoryRibbon } from '@/components/product/CategoryRibbon';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  // Find current product
  const product = mockProducts.find(p => p.id === resolvedParams.id) || mockProducts[0];
  
  // Find variant siblings (same name or subcategory but different weights)
  const variants = mockProducts.filter(p => 
    p.subCategory === product.subCategory && 
    p.category === product.category
  ).sort((a, b) => {
    // Basic weight sort: 250g < 500g < 1kg < 5kg
    const weights = { '250g': 1, '500g': 2, '1kg': 3, '5kg': 4 };
    return (weights[a.weight as keyof typeof weights] || 0) - (weights[b.weight as keyof typeof weights] || 0);
  });

  const handleVariantChange = (id: string) => {
    router.push(`/product/${id}`);
  };

  // Mock related products based on category
  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50/30 dark:bg-stone-950/20 pb-20 md:pb-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-50/50 dark:from-stone-900/50 to-transparent z-[-1]" />
      <FloatingParticles type={product.category as any} />

      <div className="container mx-auto px-4 pt-4 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Gallery (Sticky on Desktop) */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-40">
              <ProductGallery images={product.images || [product.image]} />
            </div>
          </div>

          {/* Right Column: Buy Box */}
          <div className="lg:col-span-5">
            <BuyBox 
              product={product} 
              variants={variants} 
              onVariantChange={handleVariantChange} 
            />
            
            <div className="mt-12 hidden lg:block">
              <FrequentlyBoughtTogether currentProduct={product} />
            </div>
          </div>
        </div>

        {/* Detailed Content Section */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            {/* Story & Specs */}
            <section id="details">
              <ProductTabs product={product} />
            </section>

            {/* Mobile Frequently Bought Together */}
            <div className="lg:hidden">
              <FrequentlyBoughtTogether currentProduct={product} />
            </div>

            {/* Reviews Placeholder Section */}
            <section id="reviews" className="bg-white dark:bg-stone-900/50 p-8 rounded-3xl border border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 italic font-sans italic">Verified Customer Reviews</h3>
                <button className="text-primary-green font-bold text-sm border-b-2 border-primary-green">Write a Review</button>
              </div>
              <div className="flex flex-col items-center justify-center py-12 text-center bg-stone-50 dark:bg-stone-800/50 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-700">
                <p className="text-stone-500 mb-2">Build trust with photo reviews.</p>
                <div className="text-lg font-bold text-stone-800 dark:text-stone-300 italic font-sans italic">Showing {product.reviews?.count || 0} authentic reviews</div>
              </div>
            </section>
          </div>

          {/* Sidebar / Extra Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-primary-green/5 p-6 rounded-3xl border border-primary-green/20">
              <h4 className="font-bold text-primary-green mb-3">Health Benefits</h4>
              <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                <li className="flex gap-2"><span>✔</span> Natural immunity booster</li>
                <li className="flex gap-2"><span>✔</span> Lab-tested chemical free</li>
                <li className="flex gap-2"><span>✔</span> Traditional harvest methods</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-3">Delivery Information</h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                Dhaka: 24-48 Hours <br/>
                Outside Dhaka: 3-5 Days
              </p>
              <div className="flex items-center gap-2 text-primary-green font-bold text-xs uppercase">
                <span>Free Delivery on orders above ৳2500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="mt-24 border-t border-stone-100 dark:border-stone-800 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 italic font-sans italic">You May Also Like</h2>
          </div>
          <CategoryRibbon />
        </div>
      </div>

      {/* Sticky Mobile Bar */}
      <StickyMobileBuyBar product={product} />

      {/* Standard Sections to maintain consistency */}
      <Testimonials />
    </div>
  );
}
