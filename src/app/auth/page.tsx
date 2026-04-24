"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Phone, Lock, ArrowRight, ShieldCheck, Mail, UserPlus, LogIn, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthView = 'login' | 'signup' | 'verify';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup } = useAuthStore();
  const [view, setView] = useState<AuthView>('login');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    code: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: formData.phone || formData.email, password: formData.password });
    router.push('/my-account');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'signup') {
      setView('verify');
    } else {
      signup({ 
        phone: formData.phone, 
        email: formData.email, 
        name: 'New User' // Mock name for signup
      });
      router.push('/my-account');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-stone-950">
      {/* Left Column: Immersive Content (Desktop Only) */}
      <div className="hidden lg:flex lg:col-span-6 relative overflow-hidden bg-stone-900">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200" 
          alt="Premium Honey"
          className="absolute inset-0 w-full h-full object-cover transform scale-110 hover:scale-125 transition-transform duration-[20000ms]"
        />
        <div className="relative z-20 h-full flex flex-col justify-end p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-white tracking-tight font-sans leading-none">
                my<span className="text-honey-gold">Bazar</span>
              </h1>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-sm font-bold text-white/60 uppercase tracking-[0.2em]">Safe Food Choice</span>
            </div>
            <h2 className="text-6xl font-black text-white leading-[1.1] italic font-sans">
              Protecting what's <br/>
              <span className="text-primary-green">Pure</span> and <span className="text-honey-gold">Natural</span>.
            </h2>
            <p className="text-white/70 max-w-md text-lg leading-relaxed">
              Join the community of thousands of families in Bangladesh who prioritze chemical-free, authentic farm-fresh products.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative">
        <Link 
          href="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-bold transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to browsing
        </Link>
        
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <h3 className="text-3xl font-black text-stone-900 dark:text-stone-50 mb-3 italic font-sans">
              {view === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-stone-500 font-medium">
              {view === 'login' 
                ? 'Sign in to access your dashboard and saved addresses.' 
                : 'Join us for a safer, frictionless shopping experience.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {view === 'login' ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Mobile or Email</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 017XXXXXXXX"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full h-14 pl-12 pr-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full h-14 pl-12 pr-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <button className="w-full h-14 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black flex items-center justify-center gap-2 hover:gap-4 transition-all shadow-xl shadow-stone-200 dark:shadow-none">
                  Login Securely <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button type="button" className="text-xs font-bold text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline decoration-stone-200 underline-offset-4 decoration-2 italic font-sans italic">Forgot Password?</button>
                  <button 
                    type="button" 
                    onClick={() => setView('signup')}
                    className="text-xs font-bold text-primary-green hover:underline decoration-primary-green/30 decoration-2 underline-offset-4"
                  >
                    Create a new account
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-5"
              >
                {view === 'signup' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Mobile Number</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">+880</span>
                        <input 
                          required
                          type="tel" 
                          placeholder="1XXXXXXXXX"
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full h-14 pl-14 pr-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Email Address (Optional)</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                          type="email" 
                          placeholder="you@domain.com"
                          className="w-full h-14 pl-12 pr-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                    <button className="w-full h-14 bg-primary-green hover:bg-primary-green-hover text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-green/20">
                      Sign Up & Verify <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-8 h-8 text-primary-green" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">Enter OTP Code</h3>
                      <p className="text-xs text-stone-500 mt-1">We've sent a code to your mobile number.</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {[1,2,3,4].map(i => (
                        <input 
                          key={i}
                          type="text" 
                          maxLength={1}
                          className="w-12 h-14 bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl text-center text-xl font-black focus:border-primary-green focus:ring-0 outline-none transition-all"
                        />
                      ))}
                    </div>
                    <button className="w-full h-14 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black flex items-center justify-center gap-2 transition-all">
                      Confirm & Create Account
                    </button>
                    <button type="button" onClick={() => setView('signup')} className="text-xs font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest">Resend Code in 0:45</button>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={() => setView('login')}
                    className="text-xs font-bold text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 italic font-sans italic"
                  >
                    Already have an account? Login here
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-stone-100 dark:border-stone-800 flex items-center justify-center gap-2 opacity-50">
            <ShieldCheck className="w-4 h-4 text-primary-green" />
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">100% Encrypted & Secure Identity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
