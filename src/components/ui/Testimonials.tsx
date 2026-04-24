"use client";

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Ayesha Rahman",
    role: "Regular Customer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    text: "The Sundarban honey is exceptionally pure. You can literally smell the wild forest when you open the jar. Worth every penny!",
    rating: 5
  },
  {
    id: 2,
    name: "Kamrul Hasan",
    role: "Food Enthusiast",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    text: "I ordered the Rajshahi Fazli mangoes and they arrived perfectly ripe. Sweetest mangoes I've had all season without any chemical smell.",
    rating: 5
  },
  {
    id: 3,
    name: "Farhana Islam",
    role: "Mother of two",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1eb10a?auto=format&fit=crop&q=80&w=200",
    text: "Getting safe, unadulterated spices is so hard nowadays. The chilli powder here is raw, potent, and 100% natural. Highly recommended.",
    rating: 4
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-amber-50/50 dark:bg-stone-800/20 border-y border-amber-100 dark:border-stone-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">Loved by Families</h2>
          <p className="text-stone-600 dark:text-stone-400">
            Don't just take our word for it. Here is what our customers from all across Bangladesh have to say about our unadulterated organic products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 relative group hover:-translate-y-2 transition-transform duration-300"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-amber-100 dark:text-stone-800 rotate-180" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, index) => (
                  <Star 
                    key={index} 
                    className={`w-5 h-5 ${index < t.rating ? 'fill-honey-gold text-honey-gold' : 'fill-gray-200 text-gray-200 dark:fill-stone-700 dark:text-stone-700'}`} 
                  />
                ))}
              </div>
              
              <p className="text-stone-700 dark:text-stone-300 mb-8 relative z-10 leading-relaxed font-medium">
                "{t.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-100">{t.name}</h4>
                  <p className="text-sm text-stone-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
