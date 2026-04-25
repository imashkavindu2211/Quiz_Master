'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Trophy, 
  Settings,
  GraduationCap,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Manage Quiz Packs', href: '/admin/quiz-packs', icon: Package },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 h-screen z-50 flex flex-col transition-transform duration-300 lg:sticky lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-rose-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              Quiz Master <span className="text-rose-600">Admin</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-rose-50 text-rose-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-rose-600" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

    </aside>
    </>
  );
}
