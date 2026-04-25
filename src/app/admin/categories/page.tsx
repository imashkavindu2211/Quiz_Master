'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Search, 
  Plus, 
  MoreVertical, 
  BookOpen, 
  Target,
  ArrowRight,
  TrendingUp,
  Brain,
  Globe2,
  Cpu,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockCategories = [
  { id: 1, name: 'IQ (Intelligence Quotient)', slug: 'IQ', count: 42, growth: '+12%', icon: Brain, color: 'rose' },
];

export default function CategoriesPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Content Categories
            <span className="text-sm font-bold text-slate-400">({mockCategories.length})</span>
          </h1>
          <p className="text-slate-500 text-sm">Organize and manage quiz content types for better discoverability.</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockCategories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-xl transition-all group relative overflow-hidden col-span-2">
            <div className={cn(
              "absolute -right-4 -top-4 w-24 h-24 opacity-5 group-hover:scale-150 group-hover:opacity-10 transition-all duration-500",
              cat.color === 'rose' && "text-rose-600",
            )}>
              <cat.icon className="w-full h-full" />
            </div>

            <div className="flex items-start justify-between mb-6">
              <div className={cn(
                "p-4 rounded-2xl",
                cat.color === 'rose' && "bg-rose-50 text-rose-600",
              )}>
                <cat.icon className="w-8 h-8" />
              </div>
              <button className="p-2 text-slate-300 hover:text-slate-900 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">{cat.name}</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Slug: {cat.slug}</p>
            </div>

            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className="text-2xl font-black text-slate-900">{cat.count}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Packs</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                  <TrendingUp className="w-3 h-3" />
                  {cat.growth}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Growth</p>
              </div>
            </div>

            <Link href="/admin/quiz-packs" className="w-full mt-6 py-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-bold text-slate-500 transition-all flex items-center justify-center gap-2 group/btn">
              Explore Packs
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>

      {/* Featured Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="bg-rose-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-rose-100">
          <div className="relative z-10">
            <Target className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-2xl font-black mb-2">Category Optimization</h3>
            <p className="text-rose-100 mb-6 text-sm max-w-md">Your IQ category is performing exceptionally well. Consider creating more packs to drive engagement.</p>
            <button className="px-6 py-3 bg-white text-rose-600 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
              View Analytics
            </button>
          </div>
          <Layers className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-600" />
            Quick Guidelines
          </h3>
          <ul className="space-y-4">
            {[
              'Use clear, descriptive names for categories.',
              'Limit categories to 10 for better navigation.',
              'Categorize quizzes based on educational standards.',
              'Monitor category performance weekly.'
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-[10px] font-black mt-0.5 shrink-0">
                  {i + 1}
                </div>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
