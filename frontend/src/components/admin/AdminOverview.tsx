'use client';

import React, { useState, useEffect } from 'react';
import { getDashboardStats, DashboardStats } from '@/lib/api/adminApi';

interface AdminOverviewProps {
  onNavigateTab: (tab: 'enquiries' | 'blogs' | 'projects') => void;
}

export default function AdminOverview({ onNavigateTab }: AdminOverviewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data.stats);
        setRecentEnquiries(data.recent_enquiries || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50 via-white to-orange-50/50 border border-amber-200/70 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-bold mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            Arabian Gratings Executive Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome to Your Content & Lead Hub
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Monitor incoming client quotations, update product showcase installations, and publish technical grating blogs across Saudi Arabia & UAE.
          </p>
        </div>

        {/* Decorative subtle background circle */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Contact Enquiries */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 rounded-2xl p-5 transition group shadow-sm shadow-slate-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Leads</span>
            <span className="p-2.5 rounded-xl bg-amber-100 text-amber-800 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : stats?.total_enquiries ?? 0}
            </span>
            {stats && stats.unread_enquiries > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                {stats.unread_enquiries} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Incoming general contact queries</p>
        </div>

        {/* RFQ Quotes */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 rounded-2xl p-5 transition group shadow-sm shadow-slate-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">RFQ Quote Requests</span>
            <span className="p-2.5 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : stats?.total_quotes ?? 0}
            </span>
            {stats && stats.unread_quotes > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                {stats.unread_quotes} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">High-intent project RFQs & drawings</p>
        </div>

        {/* Published Articles */}
        <div
          onClick={() => onNavigateTab('blogs')}
          className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 rounded-2xl p-5 transition group shadow-sm shadow-slate-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Technical Blogs</span>
            <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : stats?.total_blogs ?? 0}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {stats?.published_blogs ?? 0} Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Published guides & industry updates</p>
        </div>

        {/* Showcase Projects */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 rounded-2xl p-5 transition group shadow-sm shadow-slate-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Showcase Projects</span>
            <span className="p-2.5 rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {isLoading ? '...' : stats?.total_projects ?? 0}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Completed installations & contracts</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateTab('blogs')}
          className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 hover:border-amber-500/60 hover:shadow-md rounded-2xl transition group text-left cursor-pointer shadow-2xs"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl group-hover:scale-110 transition">
            ✍️
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">Write New Article</div>
            <div className="text-xs text-slate-500">Post a new blog or technical guide</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('projects')}
          className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 hover:border-amber-500/60 hover:shadow-md rounded-2xl transition group text-left cursor-pointer shadow-2xs"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl group-hover:scale-110 transition">
            🏗️
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">Add Installation Project</div>
            <div className="text-xs text-slate-500">Showcase a new GCC infrastructure job</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('enquiries')}
          className="flex items-center gap-3.5 p-5 bg-white border border-slate-200 hover:border-amber-500/60 hover:shadow-md rounded-2xl transition group text-left cursor-pointer shadow-2xs"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl group-hover:scale-110 transition">
            📬
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">Manage All RFQs & Leads</div>
            <div className="text-xs text-slate-500">Review quotes and customer responses</div>
          </div>
        </button>
      </div>

      {/* Recent Enquiries Preview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Submissions</h3>
            <p className="text-xs text-slate-500">Latest enquiries received through website contact forms</p>
          </div>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
          >
            View All Leads →
          </button>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 font-medium">
            No submissions recorded yet. Forms submitted through the website will appear here in real-time.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentEnquiries.map((e, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{e.name} — <span className="text-slate-500 font-normal">{e.company || 'Direct'}</span></div>
                  <div className="text-slate-500 mt-0.5">{e.email} • {e.phone}</div>
                  <div className="text-slate-700 mt-1 italic line-clamp-1">&quot;{e.message}&quot;</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(e.created_at).toLocaleDateString()}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    e.status === 'NEW' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
