'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Hash, 
  ArrowRight, 
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="bg-rose-600 p-3 rounded-2xl shadow-lg shadow-rose-200">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <span className="font-black text-2xl text-slate-900 tracking-tight">
            Quiz Master <span className="text-rose-600">Student</span>
          </span>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-rose-100 border border-slate-100">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sign In</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Welcome back! Continue your progress.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 uppercase tracking-widest animate-pulse">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-3 h-3" /> Email Address
              </label>
              <input 
                required
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Password
                </label>
                <Link href="#" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2",
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-rose-700 active:scale-95"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account? {' '}
              <Link href="/register" className="text-rose-600 font-bold hover:underline">Register Now</Link>
            </p>
          </div>
        </div>


        <p className="mt-10 text-center text-xs font-black text-slate-300 uppercase tracking-widest">© 2026 Quiz Master Dashboard</p>
      </div>
    </div>
  );
}
