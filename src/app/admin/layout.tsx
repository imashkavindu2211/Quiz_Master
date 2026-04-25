'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';

import { AuthGuard } from '@/components/auth-guard';
import { AdminPasswordGuard } from '@/components/admin/AdminPasswordGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <AdminPasswordGuard>
        <div className="flex min-h-screen bg-slate-50 font-sans overflow-x-hidden">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </AdminPasswordGuard>
    </AuthGuard>
  );
}
