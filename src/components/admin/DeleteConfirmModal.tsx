'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion",
  message = "This action is permanent and cannot be undone. Please enter the master password to authorize this deletion."
}: DeleteConfirmModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const ADMIN_PASSWORD = 'Admin@25258585';

  if (!isOpen) return null;

  const handleVerifyAndConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onConfirm();
      setPassword('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{message}</p>
          </div>

          <form onSubmit={handleVerifyAndConfirm} className="space-y-6">
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••••••"
                  className={cn(
                    "w-full bg-slate-50 border-2 py-4 pl-12 pr-4 rounded-2xl text-sm font-bold transition-all outline-none",
                    error ? "border-rose-500 focus:border-rose-600" : "border-transparent focus:border-rose-600/20 focus:bg-white"
                  )}
                />
              </div>
              {error && (
                <div className="absolute -bottom-6 left-1 flex items-center gap-1.5 text-rose-600 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Invalid Password</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col md:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Confirm Delete
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
