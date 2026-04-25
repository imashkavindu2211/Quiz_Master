'use client';

import React from 'react';
import { Trash2, Image as ImageIcon, Plus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuestionData {
  id: string;
  text: string;
  timeLimit: number;
  explanation: string;
  imageUrl: string;
  explanationImageUrl: string;
  options: { text: string; isCorrect: boolean }[];
}

interface QuestionCardProps {
  index: number;
  data: QuestionData;
  onUpdate: (data: QuestionData) => void;
  onDelete?: () => void;
}

export function QuestionCard({ index, data, onUpdate, onDelete }: QuestionCardProps) {
  const handleTextChange = (text: string) => onUpdate({ ...data, text });
  const handleTimeChange = (timeLimit: number) => onUpdate({ ...data, timeLimit });
  const handleExplanationChange = (explanation: string) => onUpdate({ ...data, explanation });
  const handleImageUrlChange = (imageUrl: string) => onUpdate({ ...data, imageUrl });
  const handleExplanationImageUrlChange = (explanationImageUrl: string) => onUpdate({ ...data, explanationImageUrl });
  
  const handleOptionChange = (optIndex: number, text: string) => {
    const newOptions = [...data.options];
    newOptions[optIndex] = { ...newOptions[optIndex], text };
    onUpdate({ ...data, options: newOptions });
  };

  const handleSetCorrect = (optIndex: number) => {
    const newOptions = data.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === optIndex
    }));
    onUpdate({ ...data, options: newOptions });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* ... header remains same ... */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-600 text-white font-bold text-sm">
            {index + 1}
          </span>
          <h3 className="font-semibold text-slate-800 uppercase tracking-wider text-xs">Question {index + 1}</h3>
        </div>
        <button 
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        {/* Question Text, Time & Main Image */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-6 space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Question Text</label>
            <textarea 
              value={data.text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter your question here..."
              className="w-full min-h-[120px] p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 transition-all text-slate-900 resize-none"
            />
          </div>
          <div className="lg:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Time (s)</label>
            <input 
              type="number" 
              value={data.timeLimit}
              onChange={(e) => handleTimeChange(Number(e.target.value))}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 transition-all text-slate-900 font-mono"
            />
          </div>
          <div className="lg:col-span-4 space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Question Image URL</label>
            <input 
              type="text" 
              value={data.imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              placeholder="https://cloudinary.com/..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 transition-all text-xs"
            />
          </div>
        </div>

        {/* ... options remains same ... */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-tight block">Answer Options</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.options.map((opt, i) => (
              <div 
                key={i}
                className={cn(
                  "relative flex items-center gap-4 p-1 rounded-2xl border transition-all duration-300",
                  opt.isCorrect 
                    ? "bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500/20" 
                    : "bg-slate-50 border-slate-200 hover:border-rose-200"
                )}
              >
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={opt.text}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="w-full bg-transparent border-none focus:ring-0 p-3 text-slate-800 font-medium"
                  />
                </div>
                <button
                  onClick={() => handleSetCorrect(i)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    opt.isCorrect 
                      ? "bg-emerald-500 text-white" 
                      : "bg-white text-slate-400 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                  )}
                >
                  {opt.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : null}
                  {opt.isCorrect ? 'Correct' : 'Mark Correct'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 pt-6 border-t border-slate-100">
          <div className="lg:col-span-8 space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Post-Question Comment (Explanation)</label>
            <textarea 
              value={data.explanation}
              onChange={(e) => handleExplanationChange(e.target.value)}
              placeholder="This text appears after the user answers..."
              className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 transition-all text-slate-900 resize-none"
            />
          </div>
          <div className="lg:col-span-4 space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Explanation Photo URL</label>
            <input 
              type="text" 
              value={data.explanationImageUrl}
              onChange={(e) => handleExplanationImageUrlChange(e.target.value)}
              placeholder="Photo for the explanation..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 transition-all text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
