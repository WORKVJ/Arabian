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
    <div className="space-y-6">
      {/* Executive KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Contact Enquiries */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="cursor-pointer bg-white hover:border-amber-400 border border-slate-200 rounded-2xl p-5 transition group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Leads</span>
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-amber-50 group-hover:border-amber-300 group-hover:text-amber-800 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLoading ? '...' : stats?.total_enquiries ?? 0}
            </span>
            {stats && stats.unread_enquiries > 0 ? (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                {stats.unread_enquiries} New
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400">Total</span>
            )}
          </div>
        </div>

        {/* RFQ Quotes */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="cursor-pointer bg-white hover:border-amber-400 border border-slate-200 rounded-2xl p-5 transition group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">RFQ Quote Requests</span>
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-amber-50 group-hover:border-amber-300 group-hover:text-amber-800 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLoading ? '...' : stats?.total_quotes ?? 0}
            </span>
            {stats && stats.unread_quotes > 0 ? (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                {stats.unread_quotes} Pending
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400">Total</span>
            )}
          </div>
        </div>

        {/* Published Articles */}
        <div
          onClick={() => onNavigateTab('blogs')}
          className="cursor-pointer bg-white hover:border-amber-400 border border-slate-200 rounded-2xl p-5 transition group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Technical Articles</span>
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-amber-50 group-hover:border-amber-300 group-hover:text-amber-800 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLoading ? '...' : stats?.total_blogs ?? 0}
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {stats?.published_blogs ?? 0} Live
            </span>
          </div>
        </div>

        {/* Showcase Projects */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="cursor-pointer bg-white hover:border-amber-400 border border-slate-200 rounded-2xl p-5 transition group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Showcase Projects</span>
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-amber-50 group-hover:border-amber-300 group-hover:text-amber-800 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLoading ? '...' : stats?.total_projects ?? 0}
            </span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Latest Incoming Inquiries</h2>
            <p className="text-xs text-slate-500 mt-0.5">Recent prospect inquiries submitted via the live website</p>
          </div>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition cursor-pointer self-start sm:self-auto"
          >
            <span>View All Leads</span>
            <span>→</span>
          </button>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="py-14 text-center text-xs text-slate-400 font-medium">
            No submissions recorded yet. Client forms submitted on the website will display here in real-time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentEnquiries.map((e, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{e.name}</div>
                      <div className="text-[11px] text-slate-400">{e.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {e.company || 'Direct Client'}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                      {e.message || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        e.status === 'NEW'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onNavigateTab('enquiries')}
                        className="text-amber-700 hover:text-amber-900 font-bold hover:underline"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
