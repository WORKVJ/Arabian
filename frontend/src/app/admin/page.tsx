'use client';

import React, { useState, useEffect } from 'react';
import {
  AdminUser,
  getAuthToken,
  getStoredUser,
  adminMe,
  adminLogout,
} from '@/lib/api/adminApi';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminOverview from '@/components/admin/AdminOverview';
import EnquiriesManager from '@/components/admin/EnquiriesManager';
import BlogManager from '@/components/admin/BlogManager';
import ProjectManager from '@/components/admin/ProjectManager';

export default function AdminPortalPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'blogs' | 'projects'>('overview');

  useEffect(() => {
    async function verifyAuth() {
      const token = getAuthToken();
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      // Check stored user first for quick render
      const stored = getStoredUser();
      if (stored) {
        setUser(stored);
      }

      try {
        const currentUser = await adminMe();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    verifyAuth();
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    setUser(null);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400"></div>
          <p className="text-xs text-slate-400 mt-4 tracking-wider uppercase">Loading Portal...</p>
        </div>
      </div>
    );
  }

  // If unauthenticated, show custom branded Login Screen
  if (!user) {
    return <AdminLogin onSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-amber-500/20">
              AG
            </div>
            <div>
              <div className="text-sm font-black text-white tracking-wide uppercase">
                Arabian Gratings
              </div>
              <div className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                Content & Lead Management
              </div>
            </div>
          </div>

          {/* User Status & Actions */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 hover:text-white transition border border-slate-700"
            >
              <span>Preview Live Site</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white">{user.username}</div>
                <div className="text-[10px] text-slate-400">{user.is_superuser ? 'Super Administrator' : 'Staff Editor'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition"
              title="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'enquiries'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📬 Leads & Inquiries
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'blogs'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ✍️ Blog & Articles
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'projects'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🏗️ Showcase Projects
          </button>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <AdminOverview onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'enquiries' && <EnquiriesManager />}
        {activeTab === 'blogs' && <BlogManager />}
        {activeTab === 'projects' && <ProjectManager />}
      </main>
    </div>
  );
}
