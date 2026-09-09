'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ContactLead, QuoteLead,
  getContactEnquiries, updateContactStatus, deleteContactEnquiry,
  getQuoteRequests, updateQuoteStatus, deleteQuoteRequest,
  getImageUrl
} from '@/lib/api/adminApi';

export default function EnquiriesManager() {
  const [activeType, setActiveType] = useState<'contact' | 'quote'>('contact');
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [quotes, setQuotes] = useState<QuoteLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal inspection states
  const [selectedContact, setSelectedContact] = useState<ContactLead | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteLead | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getContactEnquiries({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setContacts(data.results || []);
    } catch (err) {
      console.error('Failed to load contact enquiries', err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  const fetchQuotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getQuoteRequests({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setQuotes(data.results || []);
    } catch (err) {
      console.error('Failed to load quote requests', err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    if (activeType === 'contact') {
      fetchContacts();
    } else {
      fetchQuotes();
    }
  }, [activeType, fetchContacts, fetchQuotes]);

  const handleContactStatusChange = async (id: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await updateContactStatus(id, newStatus);
      setContacts(prev => prev.map(c => (c.id === id ? { ...c, status: updated.status } : c)));
      if (selectedContact?.id === id) {
        setSelectedContact(prev => (prev ? { ...prev, status: updated.status } : null));
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleQuoteStatusChange = async (id: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await updateQuoteStatus(id, newStatus);
      setQuotes(prev => prev.map(q => (q.id === id ? { ...q, status: updated.status } : q)));
      if (selectedQuote?.id === id) {
        setSelectedQuote(prev => (prev ? { ...prev, status: updated.status } : null));
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to permanently remove this enquiry?')) return;
    try {
      await deleteContactEnquiry(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
    } catch (err) {
      alert('Failed to delete enquiry');
    }
  };

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('Are you sure you want to permanently remove this quote request?')) return;
    try {
      await deleteQuoteRequest(id);
      setQuotes(prev => prev.filter(q => q.id !== id));
      if (selectedQuote?.id === id) setSelectedQuote(null);
    } catch (err) {
      alert('Failed to delete quote request');
    }
  };

  // Helper status badge renderer
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">New Lead</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Contacted</span>;
      case 'QUOTATION_SENT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">Quote Sent</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">In Progress</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">Closed</span>;
      case 'SPAM':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Spam</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Leads & Inquiries</h2>
          <p className="text-sm text-slate-500 mt-1">Review incoming quote RFQs and general website contact forms</p>
        </div>

        {/* Lead Type Switcher */}
        <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-2xl shadow-2xs">
          <button
            onClick={() => { setActiveType('contact'); setStatusFilter('ALL'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeType === 'contact'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contact Enquiries ({contacts.length})
          </button>
          <button
            onClick={() => { setActiveType('quote'); setStatusFilter('ALL'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeType === 'quote'
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RFQ Quote Requests ({quotes.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, company, email, phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition shadow-2xs"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition cursor-pointer font-medium shadow-2xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New Only</option>
            <option value="CONTACTED">Contacted</option>
            {activeType === 'quote' && (
              <>
                <option value="QUOTATION_SENT">Quotation Sent</option>
                <option value="IN_PROGRESS">In Progress</option>
              </>
            )}
            <option value="CLOSED">Closed</option>
            <option value="SPAM">Spam</option>
          </select>

          <button
            onClick={() => { if (activeType === 'contact') fetchContacts(); else fetchQuotes(); }}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Refresh list"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Loading inquiries...</p>
        </div>
      ) : activeType === 'contact' ? (
        /* Contact Enquiries Table */
        contacts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm">No contact enquiries match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Name & Company</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Message Preview</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.company || 'Individual / Not specified'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div><a href={`mailto:${c.email}`} className="text-amber-700 font-semibold hover:underline">{c.email}</a></div>
                      <div className="text-slate-500 mt-0.5"><a href={`tel:${c.phone}`} className="hover:text-slate-900">{c.phone}</a></div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                      {c.message}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderStatusBadge(c.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedContact(c)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold rounded-lg text-slate-700 transition border border-slate-200 cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="px-2 py-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs font-bold rounded-lg transition cursor-pointer"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* Quote Requests Table */
        quotes.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm">No quote RFQs match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Client / Company</th>
                  <th className="py-3.5 px-4">Product & Specs</th>
                  <th className="py-3.5 px-4">Quantity / Dimensions</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(q.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{q.name}</div>
                      <div className="text-xs text-amber-800 font-medium">{q.company}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{q.email} • {q.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-bold text-slate-900">{q.product || 'Standard Grating'}</div>
                      <div className="text-slate-500">Material: {q.material || 'Mild Steel / GI'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div>Qty: <span className="text-slate-900 font-bold">{q.quantity || 'N/A'}</span></div>
                      <div>Dims: {q.dimensions || 'Custom'}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderStatusBadge(q.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedQuote(q)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold rounded-lg text-slate-700 transition border border-slate-200 cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDeleteQuote(q.id)}
                        className="px-2 py-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs font-bold rounded-lg transition cursor-pointer"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* View Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Contact Enquiry #{selectedContact.id}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedContact.name}</h3>
                <p className="text-xs text-slate-500">{selectedContact.company || 'Individual Client'}</p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block mb-1 font-medium">Email Address</span>
                <a href={`mailto:${selectedContact.email}`} className="text-amber-700 font-bold hover:underline break-all">
                  {selectedContact.email}
                </a>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block mb-1 font-medium">Phone Number</span>
                <a href={`tel:${selectedContact.phone}`} className="text-slate-900 font-bold hover:underline">
                  {selectedContact.phone}
                </a>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-600 block mb-2 font-bold">Message Body:</span>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedContact.message}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Update Status:</span>
                <select
                  disabled={isUpdatingStatus}
                  value={selectedContact.status}
                  onChange={e => handleContactStatusChange(selectedContact.id, e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="NEW">New Lead</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CLOSED">Closed</option>
                  <option value="SPAM">Mark Spam</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedContact.email}?subject=Arabian Gratings Inquiry Response`}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Quote Request Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">RFQ Quote Request #{selectedQuote.id}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedQuote.name} — {selectedQuote.company}</h3>
                <p className="text-xs text-slate-500">Submitted on {new Date(selectedQuote.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1 font-medium">Product</span>
                <span className="text-slate-900 font-bold">{selectedQuote.product || 'Standard'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1 font-medium">Material</span>
                <span className="text-slate-900 font-bold">{selectedQuote.material || 'Mild Steel'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1 font-medium">Quantity</span>
                <span className="text-slate-900 font-bold">{selectedQuote.quantity || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1 font-medium">Dimensions</span>
                <span className="text-slate-900 font-bold">{selectedQuote.dimensions || 'N/A'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block mb-1 font-medium">Email Contact</span>
                <a href={`mailto:${selectedQuote.email}`} className="text-amber-700 font-bold hover:underline break-all">
                  {selectedQuote.email}
                </a>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block mb-1 font-medium">Phone / WhatsApp</span>
                <a href={`tel:${selectedQuote.phone}`} className="text-slate-900 font-bold hover:underline">
                  {selectedQuote.phone}
                </a>
              </div>
            </div>

            {selectedQuote.project_requirements && (
              <div>
                <span className="text-xs text-slate-600 block mb-2 font-bold">Project Requirements:</span>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedQuote.project_requirements}
                </div>
              </div>
            )}

            {selectedQuote.message && (
              <div>
                <span className="text-xs text-slate-600 block mb-2 font-bold">Additional Client Note:</span>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedQuote.message}
                </div>
              </div>
            )}

            {/* Attachments / CAD Drawings */}
            {(selectedQuote.drawing || (selectedQuote.attachments && selectedQuote.attachments.length > 0)) && (
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
                <span className="text-xs font-bold text-amber-900 block">Attached Technical Drawings & Specs:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedQuote.drawing && (
                    <a
                      href={getImageUrl(selectedQuote.drawing) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-bold transition shadow-2xs"
                    >
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Primary Drawing
                    </a>
                  )}
                  {selectedQuote.attachments?.map(att => (
                    <a
                      key={att.id}
                      href={getImageUrl(att.file) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-bold transition shadow-2xs"
                    >
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Attachment #{att.id}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Quote Status:</span>
                <select
                  disabled={isUpdatingStatus}
                  value={selectedQuote.status}
                  onChange={e => handleQuoteStatusChange(selectedQuote.id, e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="NEW">New RFQ</option>
                  <option value="CONTACTED">Contacted Client</option>
                  <option value="QUOTATION_SENT">Quotation Sent</option>
                  <option value="IN_PROGRESS">In Progress / Negotiation</option>
                  <option value="CLOSED">Closed / Completed</option>
                  <option value="SPAM">Spam</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedQuote.email}?subject=Official Quotation: Arabian Gratings RFQ #${selectedQuote.id}`}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
                >
                  Send Quotation Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

