"use client";

import { MapPin, Phone, Mail, Send } from 'lucide-react';

export function ContactSection() {
  return (
    <section className="py-20 bg-white dark:bg-stone-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Contact Details */}
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-6">Get in Touch</h2>
            <p className="text-stone-600 dark:text-stone-400 mb-10 leading-relaxed">
              Have questions about our sourcing, bulk orders, or want to know more about organic farming? We're always here to chat.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-primary-green rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-1">Our Farm / Office</h4>
                  <p className="text-stone-600 dark:text-stone-400">12/A, Dhanmondi 27,<br />Dhaka 1209, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-honey-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-1">Call Us</h4>
                  <p className="text-stone-600 dark:text-stone-400">+880 17XX XXXXXX<br />Sat-Thu: 9AM - 8PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-1">Email Us</h4>
                  <p className="text-stone-600 dark:text-stone-400">hello@mybazar.com.bd</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-stone-50 dark:bg-stone-900 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-stone-800">
              <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">Send a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Full Name</label>
                    <input type="text" className="w-full bg-white dark:bg-stone-950 border border-gray-200 dark:border-stone-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-green/50 dark:text-white transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Email Address</label>
                    <input type="email" className="w-full bg-white dark:bg-stone-950 border border-gray-200 dark:border-stone-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-green/50 dark:text-white transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Subject</label>
                  <input type="text" className="w-full bg-white dark:bg-stone-950 border border-gray-200 dark:border-stone-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-green/50 dark:text-white transition-all" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Message</label>
                  <textarea rows={4} className="w-full bg-white dark:bg-stone-950 border border-gray-200 dark:border-stone-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-green/50 dark:text-white transition-all resize-none" placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 bg-primary-green hover:bg-primary-green-hover text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary-green/20 transition-all w-full md:w-auto">
                  <Send className="w-5 h-5" /> Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
