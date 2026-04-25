'use client';

import React, { useEffect, useState, use } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Timer, 
  Trophy,
  Sparkles,
  AlertCircle,
  Clock,
  Layout,
  ZoomIn,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/Footer';
import { getQuizForPlayer } from '../actions';

export default function QuizPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      // 1. Check if already completed
      const { getUserCompletions } = await import('../actions');
      const completions = await getUserCompletions();
      if (completions.success && completions.data.includes(id)) {
        setIsFinished(true);
      }

      const result = await getQuizForPlayer(id);
      if (result.success) {
        setQuiz(result.data);
        setTimeLeft(result.data.questions[0].time_limit || 30);
      }
      setLoading(false);
    }
    loadQuiz();
  }, [id]);

  useEffect(() => {
    if (loading || isFinished || isAnswerChecked) return;

    if (timeLeft <= 0) {
      handleCheckAnswer(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, isFinished, isAnswerChecked]);

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerChecked) return;
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = async (isTimeout = false) => {
    if (isAnswerChecked) return;
    
    setIsAnswerChecked(true);
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedOption = currentQuestion.answer_options.find((o: any) => o.id === selectedOptionId);
    
    if (!isTimeout && selectedOption?.is_correct) {
      setScore(prev => prev + 1);
    }
  };

  const recordQuizCompletion = async () => {
    const { recordSubmission } = await import('../actions');
    await recordSubmission(id, score);

    const completed = JSON.parse(localStorage.getItem('completed_quizzes') || '[]');
    if (!completed.includes(id)) {
      completed.push(id);
      localStorage.setItem('completed_quizzes', JSON.stringify(completed));
    }

    const today = new Date().toLocaleDateString();
    const dailyStats = JSON.parse(localStorage.getItem('daily_stats') || '{"date": "", "count": 0}');
    
    if (dailyStats.date === today) {
      dailyStats.count += score;
    } else {
      dailyStats.date = today;
      dailyStats.count = score;
    }
    localStorage.setItem('daily_stats', JSON.stringify(dailyStats));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedOptionId(null);
      setIsAnswerChecked(false);
      setShowExplanation(false);
      setTimeLeft(quiz.questions[nextIndex].time_limit || 30);
    } else {
      recordQuizCompletion();
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-rose-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-rose-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Preparing Challenge</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-rose-100 border border-slate-100 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900 mb-2">Quiz Missing</h1>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">This quiz pack might have been removed or is currently unavailable.</p>
          <Link href="/quizzes" className="w-full inline-block py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200">
            Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (isFinished) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-2xl shadow-rose-100 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-rose-600"></div>
          
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border-2 border-rose-100">
              <Trophy className="w-14 h-14 text-rose-600" />
            </div>
            <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-amber-400 animate-bounce" />
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Challenge Complete!</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Final Assessment Result</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Score</p>
              <p className="text-4xl font-black text-slate-900">{score}<span className="text-lg text-slate-300">/{quiz.questions.length}</span></p>
            </div>
            <div className="p-8 bg-rose-50 rounded-3xl border border-rose-100">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Accuracy</p>
              <p className="text-4xl font-black text-rose-600">{percentage}%</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link 
              href="/quizzes"
              className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:bg-rose-600 active:scale-95 flex items-center justify-center gap-3"
            >
              Finish Challenge
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navigation Bar */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 px-6">
        <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-rose-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>
            <div className="hidden sm:block">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Currently Playing</p>
              <h1 className="text-sm font-black text-slate-900 truncate max-w-[200px]">{quiz.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Progress</p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-600 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-black text-slate-900">{currentQuestionIndex + 1}/{quiz.questions.length}</span>
              </div>
            </div>

            <div className={cn(
              "flex items-center gap-4 px-5 py-2.5 rounded-2xl border-2 transition-all duration-500 shadow-xl relative overflow-hidden group",
              timeLeft <= 5 
                ? "bg-rose-600 border-rose-400 ring-4 ring-rose-500/20 animate-pulse" 
                : "bg-white border-slate-100 hover:border-rose-100 hover:shadow-2xl hover:shadow-rose-100/50"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center relative transition-all duration-500",
                timeLeft <= 5 ? "bg-white/20" : "bg-rose-50 group-hover:bg-rose-600"
              )}>
                <Timer className={cn(
                  "w-5 h-5 transition-colors duration-500",
                  timeLeft <= 5 ? "text-white" : "text-rose-600 group-hover:text-white"
                )} />
                {timeLeft > 5 && (
                  <div className="absolute inset-0 rounded-xl border-2 border-rose-200/50 border-t-rose-600 animate-[spin_3s_linear_infinite]"></div>
                )}
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest leading-none mb-1",
                  timeLeft <= 5 ? "text-rose-100" : "text-slate-400"
                )}>Time Left</span>
                <span className={cn(
                  "text-xl font-black tabular-nums tracking-tighter leading-none",
                  timeLeft <= 5 ? "text-white" : "text-slate-900"
                )}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 md:py-16 w-full">
        {!showExplanation ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Question Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-rose-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <Sparkles className="w-32 h-32 text-rose-600 rotate-12" />
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg">
                        {currentQuestionIndex + 1}
                      </div>
                      <div className="h-px w-8 bg-slate-100"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600">Question Analysis</span>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                      <div className="w-4 h-4 bg-rose-600 rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-black text-white">A</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Amarasri Herath</span>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                    {currentQuestion.question_text}
                  </h2>

                  {currentQuestion.image_url && (
                    <div className="rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video relative group">
                      <img 
                        src={currentQuestion.image_url} 
                        alt="Visual Reference" 
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Options Side Column */}
            <div className="lg:col-span-4 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-4">Select the correct answer</p>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {currentQuestion.answer_options.map((option: any, idx: number) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = option.is_correct;
                  
                  let state = 'default';
                  if (isAnswerChecked) {
                    if (isCorrect) state = 'correct';
                    else if (isSelected) state = 'wrong';
                  } else if (isSelected) {
                    state = 'selected';
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={isAnswerChecked}
                      className={cn(
                        "group w-full p-4 lg:p-5 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden",
                        state === 'default' && "bg-white border-slate-100 hover:border-rose-200 hover:bg-rose-50/30",
                        state === 'selected' && "bg-rose-50 border-rose-600 shadow-lg shadow-rose-100",
                        state === 'correct' && "bg-emerald-50 border-emerald-500",
                        state === 'wrong' && "bg-rose-50 border-rose-500 opacity-80"
                      )}
                    >
                      <div className="flex flex-col lg:flex-row items-center lg:items-center gap-2 lg:gap-4 relative z-10">
                        {isAnswerChecked && (state === 'correct' || state === 'wrong') && (
                          <div className={cn(
                            "w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center font-black transition-all duration-300 shadow-sm",
                            state === 'correct' && "bg-emerald-500 text-white",
                            state === 'wrong' && "bg-rose-500 text-white"
                          )}>
                            {state === 'correct' ? <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5" /> : <XCircle className="w-4 h-4 lg:w-5 lg:h-5" />}
                          </div>
                        )}
                        <span className={cn(
                          "font-bold text-[10px] lg:text-sm leading-snug text-center lg:text-left",
                          state === 'default' && "text-slate-600 group-hover:text-slate-900",
                          state === 'selected' && "text-rose-900",
                          state === 'correct' && "text-emerald-900",
                          state === 'wrong' && "text-rose-900"
                        )}>
                          {option.option_text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="pt-6">
                {!isAnswerChecked ? (
                  <button
                    onClick={() => handleCheckAnswer(false)}
                    disabled={!selectedOptionId}
                    className="w-full py-5 bg-rose-600 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200 transition-all hover:bg-rose-700 active:scale-95 disabled:shadow-none"
                  >
                    Verify Answer
                  </button>
                ) : (
                  <button
                    onClick={quiz.questions[currentQuestionIndex].explanation ? () => setShowExplanation(true) : handleNextQuestion}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:bg-rose-600 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {quiz.questions[currentQuestionIndex].explanation 
                      ? 'View Explanation' 
                      : (currentQuestionIndex === quiz.questions.length - 1 ? 'Finalize Results' : 'Continue to Next Question')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Answer Feedback / Explanation Only */}
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                <Sparkles className="w-48 h-48 text-rose-400 rotate-12" />
              </div>

              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                    <Sparkles className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Expert Analysis</h4>
                    <p className="text-xl font-black text-white">Explanation</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {currentQuestion.explanation ? (
                    <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
                      {currentQuestion.explanation}
                    </p>
                  ) : (
                    <p className="text-slate-500 italic text-lg">No additional explanation provided for this challenge.</p>
                  )}
                  
                  {currentQuestion.explanation_image_url && (
                    <div 
                      className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl relative group cursor-zoom-in"
                      onClick={() => setIsImageZoomed(true)}
                    >
                      <img src={currentQuestion.explanation_image_url} alt="Explanation Detail" className="w-full h-auto" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                          <ZoomIn className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-10 border-t border-white/10">
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-4 md:py-6 bg-rose-600 text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-sm shadow-2xl shadow-rose-900/40 transition-all hover:bg-rose-500 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 md:gap-4"
                  >
                    {currentQuestionIndex === quiz.questions.length - 1 ? 'Finalize Results' : 'Continue to Next Question'}
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer isDark={true} simple={true} />

      {/* Image Zoom Modal */}
      {isImageZoomed && currentQuestion.explanation_image_url && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setIsImageZoomed(false)}
        >
          <button 
            className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            onClick={() => setIsImageZoomed(false)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <img 
              src={currentQuestion.explanation_image_url} 
              alt="Zoomed Explanation" 
              className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
