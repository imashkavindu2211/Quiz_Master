'use client';

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  MoreVertical, 
  Calendar, 
  Users, 
  BarChart3,
  FileEdit,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getAllQuizPacks, deleteQuizPack } from '../quiz-packs-actions';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';

export default function ManageQuizPacksPage() {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadPacks();
  }, []);

  async function loadPacks() {
    setLoading(true);
    const result = await getAllQuizPacks();
    if (result.success && result.data) {
      setPacks(result.data);
    }
    setLoading(false);
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    
    setDeletingId(idToDelete);
    const result = await deleteQuizPack(idToDelete);
    if (result.success) {
      setPacks(packs.filter(p => p.id !== idToDelete));
    } else {
      alert('Failed to delete: ' + result.error);
    }
    setDeletingId(null);
    setIdToDelete(null);
  };

  const filteredPacks = packs.filter(pack => {
    const matchesSearch = pack.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || pack.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Manage Quiz Packs
            {!loading && <span className="text-sm font-bold text-slate-400">({packs.length})</span>}
          </h1>
          <p className="text-slate-500 text-sm">Create, edit, and monitor your educational content library.</p>
        </div>
        
        <Link 
          href="/admin/create-quiz"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Pack
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search quiz packs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
          <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Loading Content...</p>
        </div>
      ) : filteredPacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPacks.map((pack) => (
            <div key={pack.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      pack.status === 'published' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
                    )}>
                      {pack.status}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">{pack.title}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">IQ Category</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{pack.questions?.[0]?.count || 0}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">0</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Participants</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(pack.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/admin/edit-quiz/${pack.id}`}
                      className="flex items-center gap-1 text-slate-600 hover:text-rose-600"
                    >
                      <FileEdit className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(pack.id)}
                      disabled={deletingId === pack.id}
                      className="flex items-center gap-1 text-slate-400 hover:text-rose-600 disabled:opacity-50"
                    >
                      {deletingId === pack.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-4 bg-slate-50 group-hover:bg-rose-600 group-hover:text-white transition-all text-sm font-bold text-slate-600 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View Detailed Analytics
              </button>
            </div>
          ))}

          {/* Add New Card */}
          <Link 
            href="/admin/create-quiz"
            className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 p-8 hover:border-rose-400 hover:bg-rose-50/30 transition-all group min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="font-black text-slate-900 text-lg">Create New Pack</p>
              <p className="text-sm text-slate-500 mt-1">Start building your next educational masterpiece.</p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 gap-4">
          <AlertCircle className="w-12 h-12 text-slate-300" />
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-900">No quiz packs found</h3>
            <p className="text-slate-500">You haven't created any quiz packs yet. Start by clicking "Create New Pack".</p>
          </div>
          <Link 
            href="/admin/create-quiz"
            className="mt-4 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
          >
            Create Your First Pack
          </Link>
        </div>
      )}
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Quiz Pack"
        message="Are you sure you want to permanently delete this quiz pack? All questions and participant results associated with this pack will be lost."
      />
    </div>
  );
}
