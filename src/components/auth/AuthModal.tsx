"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Lock, ArrowRight, ShieldCheck, UserPlus, LogIn, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

type View = 'login' | 'signup' | 'verify';

export function AuthModal() {
  const { isAuthModalOpen, closeModal, login, signup } = useAuthStore();
  const [view, setView] = useState<View>('login');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    code: ''
  });

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: formData.phone || formData.email, password: formData.password });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'signup') {
      setView('verify');
    } else {
      signup({ 
        phone: formData.phone, 
        email: formData.email, 
        password: formData.password 
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-stone-950 rounded-[2rem] overflow-hidden shadow-2xl"
        >
          {/* Header with Background Blur Image */}
          <div className="relative h-32 bg-stone-100 dark:bg-stone-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-stone-950 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
              alt="Brand Header"
            />
            <div className="relative z-20 h-full flex items-center justify-between px-8">
              <div>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {view === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-stone-500 font-medium">
                  {view === 'login' ? 'Log in to track your orders' : 'Join our safe food community'}
                </p>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {view === 'login' ? (
                <motion.form 
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Identity</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="Mobile Number or Email"
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Security</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        required
                        type="password" 
                        placeholder="Secure Password"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <button className="w-full h-12 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:gap-3 transition-all">
                    Login securely <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between pt-2">
                    <button type="button" className="text-xs font-bold text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 italic font-sans italic">Forgot PIN/Password?</button>
                    <button 
                      type="button" 
                      onClick={() => setView('signup')}
                      className="text-xs font-bold text-primary-green hover:underline"
                    >
                      New here? Create account
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form 
                  key="signup"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSignup}
                  className="space-y-4"
                >
                  {view === 'signup' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Phone</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">+880</span>
                            <input 
                              required
                              type="tel" 
                              placeholder="1XXXXXXXXX"
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full h-12 pl-14 pr-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm font-medium"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input 
                              required
                              type="email" 
                              placeholder="you@example.com"
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full h-12 pl-12 pr-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <input 
                            required
                            type="password" 
                            placeholder="At least 6 characters"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full h-12 pl-12 pr-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-green/20 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <button className="w-full h-12 bg-primary-green hover:bg-primary-green-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                        Register & Verify <UserPlus className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="space-y-6 py-4 text-center">
                      <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-8 h-8 text-primary-green" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-stone-800 dark:text-gray-100">Verify Identity</h3>
                        <p className="text-xs text-stone-500 mt-1 max-w-[240px] mx-auto leading-relaxed">We've sent a 4-digit code to your phone and email. Enter it below to proceed.</p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-3">
                        {[1, 2, 3, 4].map(idx => (
                          <input 
                            key={idx}
                            type="text" 
                            maxLength={1}
                            className="w-12 h-14 bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl text-center text-xl font-black focus:border-primary-green focus:ring-0 outline-none transition-all"
                          />
                        ))}
                      </div>

                      <button 
                        onClick={handleSignup}
                        className="w-full h-12 bg-primary-green hover:bg-primary-green-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary-green/20"
                      >
                        Complete Secure Sign Up <ArrowRight className="w-4 h-4" />
                      </button>

                      <button 
                        type="button"
                        onClick={() => setView('signup')}
                        className="text-[10px] font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest"
                      >
                        Resend Code in 0:45
                      </button>
                    </div>
                  )}

                  {view === 'signup' && (
                    <div className="text-center pt-2">
                       <button 
                         type="button" 
                         onClick={() => setView('login')}
                         className="text-xs font-bold text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 italic font-sans italic"
                       >
                         Already have an account? Login here
                       </button>
                    </div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-center gap-2 opacity-60">
               <ShieldCheck className="w-4 h-4 text-stone-400" />
               <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">End-to-End Secure Identity Network</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
