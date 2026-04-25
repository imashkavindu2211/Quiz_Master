'use client';

import React from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard,
  ChevronRight,
  LogOut,
  Camera,
  Save,
  Moon,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Admin Settings
          <div className="p-2 bg-slate-100 rounded-lg">
            <Settings className="w-5 h-5 text-slate-600" />
          </div>
        </h1>
        <p className="text-slate-500 text-sm">Manage your account preferences and application security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          {[
            { name: 'Profile', icon: User, active: true },
            { name: 'Security', icon: Shield, active: false },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'Appearance', icon: Moon, active: false },
            { name: 'Billing', icon: CreditCard, active: false },
            { name: 'Integrations', icon: Globe, active: false },
          ].map((item) => (
            <button 
              key={item.name}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all group",
                item.active 
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-200" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", item.active ? "text-white" : "text-slate-400")} />
                {item.name}
              </div>
              <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", item.active && "opacity-100")} />
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">Profile Information</h2>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-rose-100 border-4 border-white shadow-md flex items-center justify-center text-rose-600 overflow-hidden">
                    <User className="w-12 h-12" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-rose-600 text-white rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">Admin User</h3>
                  <p className="text-sm text-slate-500">Super Admin • Joined Oct 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">First Name</label>
                  <input 
                    type="text" 
                    defaultValue="Admin"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Name</label>
                  <input 
                    type="text" 
                    defaultValue="User"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="admin@quizmaster.com"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-6">Preferences</h2>
            
            {[
              { title: 'System Notifications', desc: 'Receive alerts for new submissions', icon: Bell, checked: true },
              { title: 'Mobile Synchronization', desc: 'Sync data across mobile devices', icon: Smartphone, checked: false },
              { title: 'Two-Factor Auth', desc: 'Add extra layer of security', icon: Shield, checked: true },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                    <pref.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{pref.title}</p>
                    <p className="text-xs text-slate-500">{pref.desc}</p>
                  </div>
                </div>
                <button 
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    pref.checked ? "bg-rose-600" : "bg-slate-200"
                  )}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    pref.checked ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            ))}
          </section>

          <div className="flex justify-end gap-4">
            <button className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
              Cancel
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
