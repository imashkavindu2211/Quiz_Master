'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminGatePage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const ADMIN_PASSWORD = 'admin@25258585';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        router.push('/admin');
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-rose-600 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-rose-100 hover:text-white mb-8 font-bold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Student Login
        </Link>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-50 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="relative">
            <div className="w-16 h-16 bg-rose-600 rounded-2xl shadow-xl shadow-rose-100 flex items-center justify-center text-white mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Administrative <br /> Authorization
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">Identity Verification Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3 text-rose-600" /> Master Key
              </label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className={cn(
                  "w-full px-6 py-5 bg-slate-50 border-2 rounded-2xl focus:outline-none transition-all text-lg font-bold text-slate-900 placeholder:text-slate-300",
                  error 
                    ? "border-rose-500 bg-rose-50 animate-shake" 
                    : "border-slate-100 focus:border-rose-500 focus:bg-white"
                )}
              />
              {error && (
                <div className="flex items-center gap-2 text-rose-600 animate-in fade-in slide-in-from-top-1 duration-300">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">Access Denied: Invalid Key</span>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3",
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-rose-600 hover:shadow-rose-100 active:scale-95"
              )}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">Secure Terminal • V4.0.2</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
