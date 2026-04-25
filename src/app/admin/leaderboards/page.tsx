'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Trophy, 
  Target, 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  Star,
  Loader2,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllUsers } from '../actions';

export default function LeaderboardsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.data || []);
      }
      setIsLoading(false);
    }
    loadUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Syncing Rankings...</p>
      </div>
    );
  }

  const statsOverview = [
    { label: 'Total Participants', value: users.length.toLocaleString(), icon: Users, color: 'rose' },
    { label: 'Avg. Accuracy', value: '88.4%', icon: Trophy, color: 'emerald' },
    { label: 'Questions Solved', value: '12.5k', icon: Target, color: 'blue' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Leaderboards</h1>
          <p className="text-slate-500 text-sm">Monitor participant performance and global rankings across all categories.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsOverview.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                stat.color === 'rose' && "bg-rose-50 text-rose-600",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                stat.color === 'blue' && "bg-blue-50 text-blue-600",
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100">
              <Filter className="w-4 h-4" />
              Category: All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">ID Number</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user, i) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
                        i === 0 ? "bg-amber-100 text-amber-600" : 
                        i === 1 ? "bg-slate-100 text-slate-400" :
                        i === 2 ? "bg-orange-100 text-orange-600" : "text-slate-400"
                      )}>
                        {i + 1}
                      </span>
                      {i < 3 && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-500">{user.id_number}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-black text-slate-900 text-sm">{user.total_score || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No registered users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
