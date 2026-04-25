'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminPasswordGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const ADMIN_PASSWORD = 'Admin@25258585';

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authorized');
    if (auth === 'true') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    setIsChecking(false);

    // CLEANUP: Clear authorization when leaving the admin area
    return () => {
      sessionStorage.removeItem('admin_authorized');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authorized', 'true');
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
      // Shake effect or feedback
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-rose-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl text-center space-y-10">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-2 border border-white/5 relative group overflow-hidden">
              <div className="absolute inset-0 bg-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Lock className="w-10 h-10 text-rose-600 relative z-10" />
            </div>
            <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-amber-400 animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-8 bg-white/10"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Security Check</span>
              <div className="h-px w-8 bg-white/10"></div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Admin Portal</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Please enter the master password to access administrative controls.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Master Password"
                className={cn(
                  "w-full bg-slate-800/50 border-2 py-5 px-6 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none transition-all text-center font-bold tracking-widest",
                  error ? "border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)] animate-shake" : "border-white/5 focus:border-rose-600/50"
                )}
                autoFocus
              />
              {error && (
                <div className="absolute -bottom-6 inset-x-0 flex items-center justify-center gap-1.5 text-rose-500 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Access Denied</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-900/20 transition-all hover:bg-rose-500 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
            >
              Verify Identity
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="pt-4">
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Secured by Quiz Master</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
