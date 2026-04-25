'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  GraduationCap, 
  ArrowLeft, 
  Search, 
  LayoutGrid, 
  List, 
  Clock, 
  Trophy, 
  BookOpen,
  ArrowRight,
  Play,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getPublishedPacks } from './actions';

import { Footer } from '@/components/Footer';

function QuizzesContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedPacks, setCompletedPacks] = useState<string[]>([]);
  const [stats, setStats] = useState({ todayQuestions: 0 });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      // 1. Load Local Storage (Legacy/Fallback)
      const localCompleted = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
      
      // 2. Load Daily Stats
      const today = new Date().toLocaleDateString();
      const dailyStats = JSON.parse(localStorage.getItem('daily_stats') || '{"date": "", "count": 0}');
      if (dailyStats.date === today) {
        setStats({ todayQuestions: dailyStats.count });
      } else {
        setStats({ todayQuestions: 0 });
      }

      // 3. Load Packs and DB Completions in Parallel
      const { getUserCompletions } = await import('./actions');
      const [packsResult, completionsResult] = await Promise.all([
        getPublishedPacks(category || undefined),
        getUserCompletions()
      ]);

      if (packsResult.success) {
        setPacks(packsResult.data || []);
      }

      // 4. Use ONLY DB completions for the locked state (prevents local storage bleed between accounts)
      const dbCompleted = completionsResult.success ? completionsResult.data : [];
      setCompletedPacks(dbCompleted);
      
      setLoading(false);
    }

    loadData();
  }, [category]);

  const filteredPacks = packs.filter(p => 
    (p.title || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-rose-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {category ? `${category} Challenges` : 'All Quizzes'}
            </h1>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-md md:mx-12">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search quiz packs..."
                className="w-full bg-slate-50 border border-slate-200 py-3 pl-12 pr-4 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Global Rank Badge Removed */}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 space-y-12">
        {/* Stats Dashboard */}
        <section className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-rose-200 transition-colors">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-rose-600 transition-colors">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Quizzes</p>
              <h4 className="text-3xl font-black text-slate-900">{packs.length}</h4>
            </div>
          </div>
        </section>

        {/* Category Hero */}
        <section className="relative rounded-[2.5rem] bg-slate-900 p-8 md:p-12 overflow-hidden text-white shadow-2xl shadow-slate-200">
          <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" /> Trending Now
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              Master the art of <span className="text-rose-500">IQ & Logic.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              උපාධිධාරීන් වැඩිම පිරිසක් සහභාගීවන ලංකාවේ අති දැවැන්තම online උපාධි ගුරු විභාග පන්තිය
            </p>
          </div>
          
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-600/20 to-transparent"></div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px]"></div>
          <GraduationCap className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 text-white/5 rotate-12" />
        </section>

        {/* Content Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Available Packs</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                Showing {filteredPacks.length} result{filteredPacks.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'grid' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'list' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className={cn(
              "grid gap-8",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-[2rem] h-64 animate-pulse border border-slate-100 shadow-sm"></div>
              ))}
            </div>
          ) : filteredPacks.length > 0 ? (
            <div className={cn(
              "grid gap-8",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredPacks.map((pack) => {
                const isCompleted = completedPacks.includes(pack.id);
                return (
                  <div key={pack.id} className={cn(
                    "group bg-white border border-slate-200 transition-all duration-500 relative overflow-hidden flex",
                    viewMode === 'grid' 
                      ? "flex-col rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2" 
                      : "flex-col md:flex-row md:items-center rounded-xl p-1.5 md:p-2 hover:shadow-xl hover:bg-slate-50/50",
                    isCompleted ? "opacity-75 grayscale-[0.5]" : ""
                  )}>
                    <div className={cn(
                      "absolute top-0 right-0 rounded-bl-[5rem] transition-transform duration-700",
                      viewMode === 'grid' ? "w-32 h-32 -mr-8 -mt-8" : "w-16 h-16 opacity-0 md:opacity-100",
                      isCompleted ? "bg-emerald-600" : "bg-rose-50 group-hover:scale-150"
                    )}>
                      {isCompleted && (
                        <div className="absolute bottom-6 left-6 text-white animate-in zoom-in-50 duration-500">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    
                    <div className={cn(
                      "relative z-10 flex items-center",
                      viewMode === 'grid' ? "mb-6" : "mb-4 md:mb-0 md:mr-6"
                    )}>
                      <div className={cn(
                        "rounded-2xl shadow-xl shadow-slate-200 transition-colors flex items-center justify-center",
                        viewMode === 'grid' ? "p-4 w-14 h-14" : "p-1.5 w-7 h-7",
                        isCompleted ? "bg-slate-400 text-white" : "bg-slate-900 text-white group-hover:bg-rose-600"
                      )}>
                        {isCompleted ? <Lock className={viewMode === 'grid' ? "w-6 h-6" : "w-5 h-5"} /> : <BookOpen className={viewMode === 'grid' ? "w-6 h-6" : "w-5 h-5"} />}
                      </div>
                    </div>

                    <div className="flex-1 relative z-10">
                      <div className={cn("flex flex-col", viewMode === 'grid' ? "mb-4" : "mb-0")}>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-flex items-center gap-1.5 w-fit mb-1.5",
                            isCompleted ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                          )}>
                            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {isCompleted ? 'Answered' : (pack.category_id || 'IQ')}
                          </span>
                          <h4 className={cn(
                            "font-black transition-colors leading-tight",
                            viewMode === 'grid' ? "text-2xl" : "text-sm md:text-base",
                            isCompleted ? "text-slate-500" : "text-slate-900 group-hover:text-rose-600"
                          )}>
                            {pack.title}
                          </h4>
                        </div>
                        
                        <div className={cn("flex flex-wrap items-center gap-4 md:gap-6", viewMode === 'grid' ? "mt-4" : "mt-2")}>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{pack.questions?.length || 0} Questions</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Trophy className="w-4 h-4" />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Premium</span>
                          </div>
                          
                          {/* Master Signature Mark */}
                          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100/50">
                            <div className="w-4 h-4 bg-rose-600 rounded-full flex items-center justify-center">
                              <span className="text-[8px] font-black text-white">A</span>
                            </div>
                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter">Amarasri Herath</span>
                          </div>
                        </div>
                      </div>

                      <div className={cn("relative z-10 w-full md:w-auto", viewMode === 'grid' ? "mt-8" : "mt-2 md:mt-0 md:ml-6")}>
                        <Link
                          href={isCompleted ? '#' : `/quizzes/${pack.id}`}
                          className={cn(
                            "w-full rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all",
                            viewMode === 'grid' ? "py-4" : "py-2",
                            isCompleted 
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                              : "bg-slate-900 text-white group-hover:bg-rose-600 group-hover:shadow-xl group-hover:shadow-rose-100 active:scale-95 px-8"
                          )}
                        >
                          {isCompleted ? 'Challenge Locked' : 'Start Challenge'}
                          {!isCompleted && <ArrowRight className="w-4 h-4" />}
                        </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100">
              <LayoutGrid className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-900 mb-2">No Challenges Found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </main>
      <Footer isDark={false} simple={true} />
    </div>
  );
}

export default function QuizzesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizzesContent />
    </Suspense>
  );
}
