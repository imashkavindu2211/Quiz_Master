'use client';

import React from 'react';
import {
  GraduationCap,
  Trophy,
  BookOpen,
  User,
  ArrowRight,
  Play,
  Star,
  Settings,
  LayoutDashboard,
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  LogOut,
  Sparkles,
  Search,
  Menu,
  ChevronRight,
  TrendingUp,
  Clock,
  Zap,
  Video,
  Smartphone,
  Globe,
  Users,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/Footer';

export default function UserHomePage() {
  const [stats, setStats] = React.useState({ today: 0, completed: 0, totalPacks: 0 });
  const [user, setUser] = React.useState<{ name: string } | null>(null);

  React.useEffect(() => {
    async function loadData() {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const displayName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Quiz Master User';
        setUser({ name: displayName });
      } else {
        setUser({ name: 'Guest User' });
      }

      const today = new Date().toLocaleDateString();
      const dailyStats = JSON.parse(localStorage.getItem('daily_stats') || '{"date": "", "count": 0}');
      const todayCount = dailyStats.date === today ? dailyStats.count : 0;
      const completed = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');

      const { getPublishedPacks } = await import('./quizzes/actions');
      const result = await getPublishedPacks();
      const realPackCount = result.success ? result.data.length : 0;

      setStats({ today: todayCount, completed: completed.length, totalPacks: realPackCount });
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    setUser({ name: 'Guest User' });
    window.location.reload();
  };

  if (!user || user.name === 'Guest User') {
    return <AuthOverlay onLoginSuccess={(name) => setUser({ name })} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="h-20 bg-white border-b border-slate-100 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-3">
          <div className="bg-rose-600 p-2 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tight">Quiz Master</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right mr-2">
              <p className="text-sm font-black text-slate-900">{user.name}</p>
              <button onClick={handleLogout} className="text-[10px] font-bold text-rose-600 uppercase tracking-widest hover:underline text-left">
                Logout
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-50 border-2 border-white shadow-sm flex items-center justify-center text-rose-600 overflow-hidden">
                <User className="w-6 h-6" />
              </div>
              <span className="md:hidden text-[9px] font-black text-slate-500 mt-1 uppercase tracking-tighter">
                {user.name.split(' ')[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="md:hidden p-2 text-slate-400 hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        <section className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Quiz Master <span className="text-rose-600">Amarasri Herath</span>
            </h2>
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full text-xs md:text-sm font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-200">
              “Challenge Yourself. Every Second Counts.”
            </div>
          </div>
          <div className="relative rounded-xl md:rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
            <img
              src="/banner.jpg"
              alt="Amarasri Herath - Master of IQ"
              className="w-full h-auto object-contain"
            />
          </div>
        </section>

        <div className="flex justify-center md:justify-start">
          <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Available Packs</p>
              <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{stats.totalPacks}</p>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {[
              { name: 'IQ Practice questions', packs: `${stats.totalPacks} Pack${stats.totalPacks !== 1 ? 's' : ''}`, color: 'bg-rose-600', slug: 'IQ' },
            ].map((cat, i) => (
              <Link key={i} href={`/quizzes?category=${cat.slug}`} className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200 hover:shadow-rose-100 transition-all group cursor-pointer overflow-hidden relative border border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <BookOpen className="w-48 h-48 text-rose-400" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl", cat.color)}>
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">{cat.name}</h3>
                      <p className="text-rose-500 font-black text-xs md:text-sm uppercase tracking-[0.3em] mt-3">Start Your IQ Mastery Journey</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 group-hover:bg-rose-600 transition-colors">
                    <span className="text-sm font-black text-white uppercase tracking-widest whitespace-nowrap">Explore All Packs</span>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer isDark={false} />
    </div>
  );
}

function AuthOverlay({ onLoginSuccess }: { onLoginSuccess: (name: string) => void }) {
  const [mode, setMode] = React.useState<'signin' | 'register' | 'forgot'>('register');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { supabase } = await import('@/lib/supabase');
      // Append domain to make it a valid email for Supabase Auth
      const pseudoEmail = `${email.trim()}@quiz.com`;

      if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const { registerUser } = await import('@/app/auth-actions');
        const result = await registerUser(email, password, name);

        if (!result.success) throw new Error(result.error);

        setSuccessMessage("Registration successful! Opening sign-in page...");
        setTimeout(() => {
          setMode('signin');
          setSuccessMessage(null);
          setPassword('');
          setConfirmPassword('');
        }, 2000);
      } else if (mode === 'signin') {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: pseudoEmail, password });
        if (authError) {
          if (authError.message.includes('Invalid login credentials')) {
            throw new Error("Incorrect ID Number or Password. Please try again.");
          }
          throw authError;
        }
        if (authData.user) {
          const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', authData.user.id).single();
          onLoginSuccess(profile?.full_name || authData.user.email?.split('@')[0] || 'User');
        }
      } else if (mode === 'forgot') {
        if (password !== confirmPassword) {
          throw new Error("New passwords do not match");
        }
        const { resetUserPassword } = await import('@/app/auth-actions');
        const result = await resetUserPassword(email, password);

        if (!result.success) throw new Error(result.error);

        setSuccessMessage("Password reset successful! Please sign in with your new password.");
        setTimeout(() => {
          setMode('signin');
          setSuccessMessage(null);
          setPassword('');
          setConfirmPassword('');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans overflow-y-auto">
      <div className="max-w-5xl w-full my-12 px-4 md:px-8">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative flex flex-col md:flex-row min-h-[700px] transition-all">

          {/* Animated Slider Panel */}
          <div
            className={cn(
              "hidden md:flex absolute top-0 bottom-0 w-[45%] bg-rose-600 z-30 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] p-12 text-white flex-col justify-between shadow-2xl",
              mode === 'signin' ? "translate-x-0 rounded-r-[3rem]" : "translate-x-[122.2%] rounded-l-[3rem]"
            )}
          >
            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-8 animate-bounce">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-5xl font-black leading-tight mb-6">
                {mode === 'signin' ? "Welcome Back!" : mode === 'forgot' ? "Reset Password" : "Sign In to Continue"}
              </h2>
              <p className="text-white/80 text-lg font-medium leading-relaxed">
                {mode === 'signin'
                  ? "Dive back into your IQ challenges and track your progress daily."
                  : mode === 'forgot'
                    ? "Enter your ID number and choose a new password to regain access."
                    : "Already have an account? Sign in to access your dashboard and results."}
              </p>
            </div>

            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-4">
                {mode === 'signin' ? "No Account?" : "Already Registered?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'register' : 'signin');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="px-10 py-4 bg-white text-rose-600 hover:bg-rose-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                {mode === 'signin' ? "Register Now" : "Sign In"}
              </button>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden bg-rose-600 p-8 text-white">
            <GraduationCap className="w-8 h-8 mb-4" />
            <h2 className="text-3xl font-black">
              {mode === 'signin' ? "Welcome Back!" : mode === 'forgot' ? "Reset Password" : "Join Us"}
            </h2>
          </div>

          <div className="flex-1 flex w-full relative min-h-[400px] md:h-full">
            {/* Sign In Form */}
            <div className={cn(
              "w-full h-full transition-opacity duration-500",
              mode === 'signin' ? "opacity-100 z-10 relative" : "opacity-0 z-0 absolute inset-0 pointer-events-none"
            )}>
              <div className={cn(
                "w-full md:w-[55%] min-h-full ml-auto flex flex-col items-center transition-transform duration-700 ease-out",
                mode === 'signin' ? "translate-x-0" : "translate-x-12"
              )}>
                <div className="max-w-sm w-full px-6 py-12 md:py-20 space-y-8 md:space-y-10">
                  {error && mode === 'signin' && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-600 uppercase tracking-widest animate-shake">
                      {error}
                    </div>
                  )}

                  {successMessage && mode === 'signin' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      {successMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center md:text-left mb-4">
                      <h3 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h3>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-3">Enter your details to continue</p>
                    </div>
                    <div className="space-y-2 group">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-rose-500 transition-colors">ID Number</label>
                        <span className="text-[9px] font-bold text-slate-400 italic">Numbers only</span>
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          required
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="e.g. 200512345678"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-rose-500 transition-colors">Password</label>
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot');
                            setSuccessMessage(null);
                            setError(null);
                          }}
                          className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline"
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input required type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:bg-rose-600 active:scale-95 flex items-center justify-center gap-3">
                      {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Authenticate <LogIn className="w-4 h-4" /></>}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Register Form */}
            <div className={cn(
              "w-full h-full transition-opacity duration-500",
              (mode === 'register' || mode === 'forgot') ? "opacity-100 z-10 relative" : "opacity-0 z-0 absolute inset-0 pointer-events-none"
            )}>
              <div className={cn(
                "w-full md:w-[55%] min-h-full mr-auto flex flex-col items-center transition-transform duration-700 ease-out",
                (mode === 'register' || mode === 'forgot') ? "translate-x-0" : "-translate-x-12"
              )}>
                <div className="max-w-sm w-full px-6 py-12 md:py-20 space-y-8 md:space-y-10">
                  <div className="text-center md:text-left">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                      {mode === 'register' ? "Create Account" : "Reset Password"}
                    </h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-3">
                      {mode === 'register' ? "Join thousands of learners today" : "Setup your new password"}
                    </p>
                  </div>

                  {(error && (mode === 'register' || mode === 'forgot')) && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-600 uppercase tracking-widest animate-shake">
                      {error}
                    </div>
                  )}

                  {(successMessage && (mode === 'register' || mode === 'forgot')) && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      {successMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === 'register' && (
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-rose-500 transition-colors">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input required type="text" placeholder="Nimal Perera" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 group">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-rose-500 transition-colors">ID Number</label>
                        <span className="text-[9px] font-bold text-slate-400 italic">Numbers only</span>
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          required
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="e.g. 200512345678"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-rose-500 transition-colors">
                        {mode === 'register' ? "Create Password" : "New Password"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input required type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-rose-500 transition-colors">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input required type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900" />
                      </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:bg-rose-600 active:scale-95 flex items-center justify-center gap-3">
                      {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>
                        {mode === 'register' ? "Register Now" : "Reset Password"}
                        <LogIn className="w-4 h-4" />
                      </>}
                    </button>
                    {mode === 'forgot' && (
                      <button type="button" onClick={() => setMode('signin')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors">
                        Back to Sign In
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden p-8 border-t border-slate-100 text-center bg-white">
            <p className="text-sm text-slate-500 mb-4">{mode === 'signin' ? "No Account?" : "Already Member?"}</p>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'register' : 'signin');
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-rose-600 font-black uppercase tracking-widest text-xs"
            >
              {mode === 'signin' ? "Register Now" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Footer isDark={true} />
      </div>
    </div>
  );
}

