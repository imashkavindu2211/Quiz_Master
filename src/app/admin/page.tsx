'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Key, 
  IdCard, 
  User as UserIcon,
  Loader2,
  Plus,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllUsers, registerUserAdmin, deleteUserAdmin, searchUserAdmin } from './actions';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  
  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regIdNumber, setRegIdNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data || []);
    }
    setIsLoading(false);
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const result = await registerUserAdmin(regIdNumber, regPassword, regFullName);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'User registered successfully!' });
      setRegFullName('');
      setRegIdNumber('');
      setRegPassword('');
      loadUsers();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to register user.' });
    }
    setIsSubmitting(false);
  };

  const handleDelete = (userId: string) => {
    setIdToDelete(userId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    
    const result = await deleteUserAdmin(idToDelete);
    if (result.success) {
      loadUsers();
      if (searchResult?.id === idToDelete) setSearchResult(null);
    } else {
      alert('Error deleting user: ' + result.error);
    }
    setIdToDelete(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    setIsLoading(true);
    const result = await searchUserAdmin(searchId);
    if (result.success) {
      setSearchResult(result.data);
    } else {
      setSearchResult(null);
      alert(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-rose-600" />
            User Management
          </h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Administrative Control Center</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Registration Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
              <UserPlus className="w-24 h-24 text-rose-600" />
            </div>
            
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-600" />
              Register New User
            </h2>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600/20 focus:bg-white py-4 pl-12 pr-4 rounded-2xl text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Number (NIC)</label>
                <div className="relative">
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={regIdNumber}
                    onChange={(e) => setRegIdNumber(e.target.value)}
                    placeholder="Enter ID number"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600/20 focus:bg-white py-4 pl-12 pr-4 rounded-2xl text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Set password"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600/20 focus:bg-white py-4 pl-12 pr-4 rounded-2xl text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              {message && (
                <div className={cn(
                  "p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
                  message.type === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <p className="text-[10px] font-black uppercase tracking-widest">{message.text}</p>
                </div>
              )}

              <button
                disabled={isSubmitting}
                className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200 transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Account'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* Search & List Section */}
        <div className="lg:col-span-8 space-y-8">
          {/* Search Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Search className="w-32 h-32 text-white" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
                Find User Records
              </h2>
              
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Student ID / NIC Number..."
                    className="w-full bg-white/10 border border-white/10 focus:border-rose-500 py-5 pl-12 pr-4 rounded-2xl text-sm font-bold transition-all outline-none"
                  />
                </div>
                <button className="px-8 py-5 bg-rose-600 hover:bg-rose-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-rose-900/40">
                  Search Record
                </button>
              </form>

              {searchResult && (
                <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-3xl animate-in fade-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Full Name</p>
                      <p className="text-lg font-black">{searchResult.full_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Identity ID</p>
                      <p className="text-lg font-black font-mono">{searchResult.id_number || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Current Password</p>
                      <p className="text-lg font-black font-mono bg-rose-600/20 px-3 py-1 rounded-lg w-fit">{searchResult.raw_password || '********'}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                    <button 
                      onClick={() => handleDelete(searchResult.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Revoke Access
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User List Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Users className="w-5 h-5 text-rose-600" />
                Active Accounts
              </h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {users.length} Total Users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/30">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Number</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center">
                        <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Records...</p>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                              <UserIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.full_name}</p>
                              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 font-mono">
                            {user.id_number || 'No ID Record'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
                            title="Delete User"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center space-y-4">
                        <ShieldAlert className="w-12 h-12 text-slate-200 mx-auto" />
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No participant records found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Revoke Access"
        message="Are you sure you want to permanently delete this user account? This will remove all their progress and access."
      />
    </div>
  );
}
