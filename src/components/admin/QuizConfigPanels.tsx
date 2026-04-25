'use client';

import React from 'react';
import { Calendar, Tag, Type, Trophy, Info, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuizMetaData {
  title: string;
  publishDate: string;
  categoryId: string;
}

interface QuizMetaFormProps {
  data: QuizMetaData;
  onUpdate: (data: QuizMetaData) => void;
}

export function QuizMetaForm({ data, onUpdate }: QuizMetaFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-rose-50 rounded-lg">
          <Settings2 className="w-5 h-5 text-rose-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Pack Configuration</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Type className="w-3 h-3" /> Pack Title
          </label>
          <input 
            type="text" 
            value={data.title}
            onChange={(e) => onUpdate({ ...data, title: e.target.value })}
            placeholder="e.g. World History Masters"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-900 font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="w-3 h-3" /> Publish Date
          </label>
          <input 
            type="date" 
            value={data.publishDate}
            onChange={(e) => onUpdate({ ...data, publishDate: e.target.value })}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-900 font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Tag className="w-3 h-3" /> Topic Category
          </label>
          <select 
            value={data.categoryId}
            onChange={(e) => onUpdate({ ...data, categoryId: e.target.value })}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-900 font-medium appearance-none"
          >
            <option value="">Select Category</option>
            <option value="IQ">IQ (Intelligence Quotient)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

interface LeaderboardRulesProps {
  isPublic: boolean;
  onPublicChange: (val: boolean) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  isLoading?: boolean;
}

export function LeaderboardRules({ 
  isPublic, 
  onPublicChange, 
  onPublish, 
  onSaveDraft,
  isLoading 
}: LeaderboardRulesProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-50 rounded-lg">
          <Trophy className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Leaderboard Rules</h2>
      </div>

      <div className="space-y-6">

        <div className="pt-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">Public Leaderboard</p>
            <p className="text-xs text-slate-500">Visible to all users on site</p>
          </div>
          <button 
            onClick={() => onPublicChange(!isPublic)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-transparent",
              isPublic ? "bg-rose-600" : "bg-slate-200"
            )}
          >
            <span 
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isPublic ? "translate-x-6" : "translate-x-1"
              )} 
            />
          </button>
        </div>

        <button 
          onClick={onPublish}
          disabled={isLoading}
          className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'Publishing...' : 'Publish Quiz Pack'}
        </button>
        
        <button 
          onClick={onSaveDraft}
          disabled={isLoading}
          className="w-full py-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          Save as Draft
        </button>
      </div>
    </div>
  );
}
