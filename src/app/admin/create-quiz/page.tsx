'use client';

import React, { useState } from 'react';
import { Plus, ArrowLeft, Sparkles, Save, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { QuizMetaForm, LeaderboardRules, QuizMetaData } from '@/components/admin/QuizConfigPanels';
import { QuestionCard, QuestionData } from '@/components/admin/QuestionCard';
import { saveQuizPack } from './actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const initialQuestion = (index: number): QuestionData => ({
  id: Math.random().toString(36).substr(2, 9),
  text: '',
  timeLimit: 30,
  explanation: '',
  imageUrl: '',
  explanationImageUrl: '',
  options: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]
});

export default function CreateQuizPage() {
  const [metaData, setMetaData] = useState<QuizMetaData>({
    title: '',
    publishDate: '',
    categoryId: ''
  });
  const [questions, setQuestions] = useState<QuestionData[]>([initialQuestion(0)]);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const router = useRouter();

  const addQuestion = () => {
    setQuestions([...questions, initialQuestion(questions.length)]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (index: number, updatedData: QuestionData) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedData;
    setQuestions(newQuestions);
  };

  const handlePublish = async () => {
    if (!metaData.title || !metaData.categoryId) {
      setStatus({ type: 'error', message: 'Please fill in the pack title and category.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    const result = await saveQuizPack({
      title: metaData.title,
      category_id: metaData.categoryId, // In a real app, you'd fetch the UUID for this slug
      publish_date: metaData.publishDate,
      questions: questions.map(q => ({
        text: q.text,
        timeLimit: q.timeLimit,
        explanation: q.explanation,
        imageUrl: q.imageUrl,
        explanationImageUrl: q.explanationImageUrl,
        options: q.options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect }))
      }))
    });

    if (result.success) {
      setStatus({ type: 'success', message: 'Quiz pack published successfully!' });
      setTimeout(() => router.push('/admin/quiz-packs'), 2000);
    } else {
      setStatus({ type: 'error', message: result.error || 'Failed to publish quiz pack.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-8 pb-24 relative">
      {/* Notifications */}
      {status && (
        <div className={cn(
          "fixed top-24 right-8 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300",
          status.type === 'success' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-bold text-sm">{status.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="max-w-[1400px] mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors mb-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-3">
              Create New Quiz Pack
              <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[10px] uppercase font-bold rounded-full tracking-widest border border-rose-200">
                Builder v2.0
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm md:text-base">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button 
              onClick={handlePublish}
              disabled={isSubmitting}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all active:scale-95 text-sm md:text-base disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Publishing...' : 'Publish Pack'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Builder Area */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Section 1: Meta Data */}
          <QuizMetaForm data={metaData} onUpdate={setMetaData} />

          {/* Section 2: Question Builder */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Questions
                <span className="text-sm font-bold text-slate-400">({questions.length})</span>
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-100">
                <Sparkles className="w-3 h-3" /> Auto-Save Enabled
              </div>
            </div>

            <div className="space-y-8">
              {questions.map((q, index) => (
                <QuestionCard 
                  key={q.id} 
                  index={index} 
                  data={q}
                  onUpdate={(updatedData) => updateQuestion(index, updatedData)}
                  onDelete={() => removeQuestion(q.id)} 
                />
              ))}
            </div>

            {/* Add Question Button */}
            <button 
              onClick={addQuestion}
              className="w-full py-10 border-2 border-dashed border-slate-200 rounded-2xl hover:border-rose-400 hover:bg-rose-50/30 transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700">Add Another Question</p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Total questions limited by plan</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="col-span-12 lg:col-span-4">
          <LeaderboardRules 
            isPublic={isPublic} 
            onPublicChange={setIsPublic}
            onPublish={handlePublish}
            onSaveDraft={() => console.log('Save draft')}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
