'use client';

import React from 'react';
import { 
  Video, 
  Smartphone, 
  Globe, 
  Users, 
  Phone 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer({ isDark = true, simple = false }: { isDark?: boolean; simple?: boolean }) {
  return (simple ? (
    <footer className={cn(
      "py-8 px-6 md:px-12 border-t",
      isDark ? "bg-slate-950 text-white border-white/5" : "bg-slate-50 text-slate-900 border-slate-200"
    )}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className={cn("text-[10px] font-black uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
          © Copyright by Amarasri Herath Technical Team
        </p>
        <div className={cn("flex items-center gap-8 text-[10px] font-black uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
          <a href="#" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-slate-900")}>Privacy</a>
          <a href="#" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-slate-900")}>Compliance</a>
        </div>
      </div>
    </footer>
  ) : (
    <footer className={cn(
      "py-16 px-6 md:px-12 border-t",
      isDark ? "bg-slate-950 text-white border-white/5" : "bg-slate-50 text-slate-900 border-slate-200"
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center font-black text-xl text-white">A</div>
              <span className={cn("font-black text-lg tracking-tight leading-tight", isDark ? "text-white" : "text-slate-900")}>Quiz Master <br /> Amarasri Herath</span>
            </div>
            <p className={cn("text-sm leading-relaxed max-w-xs", isDark ? "text-slate-400" : "text-slate-500")}>
              Leading the way in professional teacher examinations with the largest online graduate community in Sri Lanka.
            </p>
          </div>

          {/* Social Registry */}
          <div className="space-y-6">
            <h4 className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isDark ? "text-slate-500" : "text-slate-400")}>Social Registry</h4>
            <div className="space-y-4">
              <a href="https://www.youtube.com/channel/UC6TYUtPYJLIcKIf03AtMvIg" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-rose-600", isDark ? "bg-white/5" : "bg-slate-200/50")}>
                  <Video className="w-5 h-5 text-rose-500 group-hover:text-white" />
                </div>
                <span className={cn("text-sm font-bold transition-colors", isDark ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-rose-600")}>YouTube Channel</span>
              </a>
              <a href="https://www.tiktok.com/@amarasri.hearath?_r=1&_t=ZS-94lHRFH7PUd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-rose-600", isDark ? "bg-white/5" : "bg-slate-200/50")}>
                  <Smartphone className="w-5 h-5 text-rose-500 group-hover:text-white opacity-60" />
                </div>
                <span className={cn("text-sm font-bold transition-colors", isDark ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-rose-600")}>TikTok Profile</span>
              </a>
            </div>
          </div>

          {/* Facebook Connect */}
          <div className="space-y-6">
            <h4 className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isDark ? "text-slate-500" : "text-slate-400")}>Facebook Connect</h4>
            <div className="space-y-4">
              <a href="https://www.facebook.com/amarasriherath.lk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-600", isDark ? "bg-white/5" : "bg-slate-200/50")}>
                  <Globe className="w-5 h-5 text-blue-500 group-hover:text-white" />
                </div>
                <span className={cn("text-sm font-bold transition-colors", isDark ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-blue-600")}>Official Page</span>
              </a>
              <a href="https://www.facebook.com/groups/1323185674446913" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-600", isDark ? "bg-white/5" : "bg-slate-200/50")}>
                  <Users className="w-5 h-5 text-blue-500 group-hover:text-white opacity-50" />
                </div>
                <span className={cn("text-sm font-bold transition-colors", isDark ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-blue-600")}>Academic Group</span>
              </a>
            </div>
          </div>

          {/* Direct Communication */}
          <div className="space-y-6">
            <h4 className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isDark ? "text-slate-500" : "text-slate-400")}>Direct Communication</h4>
            <div className="space-y-4">
              <a href="https://api.whatsapp.com/send/?phone=94760919526&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-emerald-600", isDark ? "bg-white/5" : "bg-slate-200/50")}>
                  <Phone className="w-5 h-5 text-emerald-500 group-hover:text-white" />
                </div>
                <span className={cn("text-sm font-bold transition-colors", isDark ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-emerald-600")}>WhatsApp Hotline</span>
              </a>
              <div className={cn("p-4 rounded-2xl border flex items-center gap-3", isDark ? "bg-white/5 border-white/5" : "bg-slate-100 border-slate-200")}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className={cn("pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6", isDark ? "border-white/5" : "border-slate-200")}>
          <p className={cn("text-[10px] font-black uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
            © Copyright by Amarasri Herath Technical Team
          </p>
          <div className={cn("flex items-center gap-8 text-[10px] font-black uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
            <a href="#" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-slate-900")}>Privacy</a>
            <a href="#" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-slate-900")}>Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  ));
}
