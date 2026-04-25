'use client';

import React from 'react';
import { Bell, LogOut, Search, User, Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:text-rose-600 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative w-48 md:w-96 hidden sm:block">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <button className="relative p-2 text-slate-500 hover:text-rose-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">Admin User</p>
            <p className="text-xs text-slate-500 mt-1">Super Admin</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-rose-100 border-2 border-white shadow-sm flex items-center justify-center text-rose-600">
            <User className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
