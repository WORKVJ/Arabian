'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PageSEOItem,
  getAdminPageSEOs,
  updateAdminPageSEO,
  createAdminPageSEO,
  deleteAdminPageSEO,
  uploadMedia,
  getImageUrl,
} from '@/lib/api/adminApi';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Pages' },
  { id: 'core', label: 'Core Pages' },
  { id: 'product', label: 'Products' },
  { id: 'industry', label: 'Industries' },
  { id: 'location', label: 'Locations' },
  { id: 'other', label: 'Other' },
] as const;

export default function SEOManager() {
  const [seoPages, setSeoPages] = useState<PageSEOItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusNotification, setStatusNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewPage, setIsNewPage] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewTab, setPreviewTab] = useState<'google' | 'social'>('google');
  const [googleView, setGoogleView] = useState<'desktop' | 'mobile'>('desktop');

  // Form State
  const [formData, setFormData] = useState<{
    path: string;
    page_name: string;
    category: 'core' | 'product' | 'industry' | 'location' | 'other';
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    canonical_url: string;
    og_title: string;
    og_description: string;
    og_image: string;
    og_image_id: number | null;
    no_index: boolean;
  }>({
    path: '',
    page_name: '',
    category: 'core',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    og_image_id: null,
    no_index: false,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setStatusNotification({ type, message });
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const fetchPages = useCallback(async () => {
    try {
      setIsLoading(true);
      const data: any = await getAdminPageSEOs({
        category: selectedCategory,
        search: searchQuery || undefined,
      });
      const list = Array.isArray(data) ? data : (data?.results || []);
      setSeoPages(list);
    } catch (err) {
      console.error('Failed to load SEO pages:', err);
      showToast('Failed to load SEO pages. Please refresh.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleOpenEdit = (item: PageSEOItem) => {
    setIsNewPage(false);
    setEditingId(item.id);
    setFormData({
      path: item.path,
      page_name: item.page_name,
      category: item.category,
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      meta_keywords: item.meta_keywords || '',
      canonical_url: item.canonical_url || '',
      og_title: item.og_title || '',
      og_description: item.og_description || '',
      og_image: item.og_image || '',
      og_image_id: item.og_image_id || null,
      no_index: item.no_index || false,
    });
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setIsNewPage(true);
    setEditingId(null);
    setFormData({
      path: '/',
      page_name: '',
      category: 'core',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      canonical_url: '',
      og_title: '',
      og_description: '',
      og_image: '',
      og_image_id: null,
      no_index: false,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const media = await uploadMedia(file, `${formData.page_name || 'seo'}-og-image`);
      const fullUrl = getImageUrl(media.file) || media.file;
      setFormData((prev) => ({
        ...prev,
        og_image: fullUrl,
        og_image_id: media.id,
      }));
      showToast('Social image uploaded successfully!');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Failed to upload image.', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.path || !formData.page_name) {
      showToast('Path and Page Name are required.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        canonical_url: formData.canonical_url || `https://arabiangratings.com${formData.path.startsWith('/') ? formData.path : `/${formData.path}`}`,
      };

      if (isNewPage) {
        await createAdminPageSEO(payload);
        showToast(`SEO tags for "${formData.page_name}" created successfully!`);
      } else if (editingId) {
        await updateAdminPageSEO(editingId, payload);
        showToast(`SEO tags for "${formData.page_name}" updated!`);
      }

      setIsModalOpen(false);
      fetchPages();
    } catch (err: any) {
      console.error('Failed to save SEO tags:', err);
      showToast(err?.message || 'Failed to save SEO tags.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the SEO configuration for "${name}"?`)) {
      return;
    }

    try {
      await deleteAdminPageSEO(id);
      showToast(`Removed SEO configuration for "${name}".`);
      fetchPages();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete SEO page.', 'error');
    }
  };

  // Metrics summary
  const stats = useMemo(() => {
    const total = seoPages.length;
    const indexable = seoPages.filter((p) => !p.no_index).length;
    const optimized = seoPages.filter(
      (p) => p.meta_title && p.meta_description && p.meta_description.length >= 100
    ).length;
    return { total, indexable, optimized };
  }, [seoPages]);

  // Character counter helpers
  const titleLength = formData.meta_title.length;
  const descLength = formData.meta_description.length;

  const getTitleStatus = () => {
    if (titleLength === 0) return { label: 'Empty', color: 'text-slate-400', bar: 'bg-slate-200' };
    if (titleLength < 35) return { label: 'Too Short (<35)', color: 'text-amber-500', bar: 'bg-amber-400' };
    if (titleLength <= 65) return { label: 'Ideal (35-65)', color: 'text-emerald-600', bar: 'bg-emerald-500' };
    return { label: 'Too Long (>65)', color: 'text-rose-500', bar: 'bg-rose-500' };
  };

  const getDescStatus = () => {
    if (descLength === 0) return { label: 'Empty', color: 'text-slate-400', bar: 'bg-slate-200' };
    if (descLength < 100) return { label: 'Too Short (<100)', color: 'text-amber-500', bar: 'bg-amber-400' };
    if (descLength <= 165) return { label: 'Ideal (100-165)', color: 'text-emerald-600', bar: 'bg-emerald-500' };
    return { label: 'Too Long (>165)', color: 'text-rose-500', bar: 'bg-rose-500' };
  };

  const titleStatus = getTitleStatus();
  const descStatus = getDescStatus();

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusNotification && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform animate-in fade-in slide-in-from-top-4 ${
            statusNotification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusNotification.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{statusNotification.message}</span>
          </div>
        </div>
      )}

      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Configured Pages</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
          <div className="text-xs text-slate-400 mt-1">Across all categories</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Search Indexed</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{stats.indexable}</div>
          <div className="text-xs text-slate-400 mt-1">Crawled & indexed by Google</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Fully Optimized</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{stats.optimized}</div>
          <div className="text-xs text-slate-400 mt-1">With 100+ char descriptions</div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl text-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-amber-400 uppercase tracking-wider">Live Dynamic SEO</div>
            <p className="text-xs text-slate-300 mt-1">Edits take effect immediately on live pages without redeployment.</p>
          </div>
          <button
            onClick={handleOpenNew}
            className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Page SEO
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === tab.id
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 md:max-w-xs">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, page name, path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <p className="text-xs text-slate-500 font-semibold mt-3">Loading SEO configuration...</p>
          </div>
        ) : seoPages.length === 0 ? (
          <div className="py-20 text-center px-4">
            <svg className="w-12 h-12 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-bold text-slate-900 mt-2">No SEO pages found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or category filter, or click "Add New Page SEO".
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {seoPages.map((page) => (
              <div
                key={page.id}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Left Page Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{page.page_name}</span>
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-amber-700 bg-slate-100 px-2 py-0.5 rounded-md hover:bg-slate-200 transition"
                    >
                      <span>{page.path}</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        page.category === 'core'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : page.category === 'product'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : page.category === 'industry'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : page.category === 'location'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {page.category}
                    </span>

                    {page.no_index ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                        No-Index
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        Indexed
                      </span>
                    )}
                  </div>

                  {/* Meta Title */}
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-slate-400 font-normal">Title:</span>
                    <span className="truncate max-w-xl">{page.meta_title || <span className="text-slate-400 italic">No custom title (default used)</span>}</span>
                    <span className="text-[10px] text-slate-400">({page.meta_title.length} chars)</span>
                  </div>

                  {/* Meta Description */}
                  <div className="text-xs text-slate-600 line-clamp-1">
                    <span className="text-slate-400 font-normal">Description: </span>
                    {page.meta_description || <span className="text-slate-400 italic">No custom description</span>}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => handleOpenEdit(page)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit SEO
                  </button>

                  <button
                    onClick={() => handleDelete(page.id, page.page_name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete custom SEO configuration"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full my-8 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {isNewPage ? 'Add New Page SEO' : `Edit SEO — ${formData.page_name}`}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{formData.path}</p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: Split view (Form Left, Live Preview Right) */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Edit Form (7 cols) */}
              <form id="seo-form" onSubmit={handleSave} className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Page Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.page_name}
                      onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                      placeholder="e.g. Stainless Steel Gratings"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                    >
                      <option value="core">Core Page</option>
                      <option value="product">Product</option>
                      <option value="industry">Industry</option>
                      <option value="location">Location</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Path * <span className="text-slate-400 font-normal">(must start with /)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    placeholder="/products/stainless-steel-gratings"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Meta Title Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Meta Title</label>
                    <span className={`text-[11px] font-semibold ${titleStatus.color}`}>
                      {titleLength}/65 chars — {titleStatus.label}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="e.g. Stainless Steel Gratings Saudi Arabia | Arabian Gratings"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${titleStatus.bar}`}
                      style={{ width: `${Math.min(100, (titleLength / 65) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meta Description Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Meta Description</label>
                    <span className={`text-[11px] font-semibold ${descStatus.color}`}>
                      {descLength}/165 chars — {descStatus.label}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="Enter an engaging description with relevant keywords summarizing the page content for search engines..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 leading-relaxed"
                  />
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${descStatus.bar}`}
                      style={{ width: `${Math.min(100, (descLength / 165) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meta Keywords <span className="text-slate-400 font-normal">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    placeholder="gratings, stainless steel gratings, saudi arabia, riyadh, jeddah"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Canonical URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Canonical URL</label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          canonical_url: `https://arabiangratings.com${formData.path.startsWith('/') ? formData.path : `/${formData.path}`}`,
                        })
                      }
                      className="text-[10px] text-amber-700 hover:underline font-semibold"
                    >
                      Generate Default
                    </button>
                  </div>
                  <input
                    type="url"
                    value={formData.canonical_url}
                    onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                    placeholder="https://arabiangratings.com/..."
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Open Graph / Social Media Accordion */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800">Open Graph / Social Media Card</div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          og_title: formData.meta_title,
                          og_description: formData.meta_description,
                        })
                      }
                      className="text-[10px] text-amber-700 hover:underline font-semibold"
                    >
                      Copy from Meta Tags
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Social Card Title</label>
                    <input
                      type="text"
                      value={formData.og_title}
                      onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                      placeholder="Leave blank to use Meta Title"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Social Card Description</label>
                    <textarea
                      rows={2}
                      value={formData.og_description}
                      onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                      placeholder="Leave blank to use Meta Description"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Social Banner Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.og_image}
                        onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                        placeholder="/og-image.jpg or https://..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                      />
                      <label className="cursor-pointer px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1">
                        {isUploadingImage ? 'Uploading...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Indexing Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Search Engine Indexing</div>
                    <div className="text-[11px] text-slate-500">
                      {formData.no_index ? 'Blocked (noindex, nofollow)' : 'Active (search engines will index this page)'}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!formData.no_index}
                      onChange={(e) => setFormData({ ...formData, no_index: !e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </form>

              {/* Right Column: Live Search & Social Previews (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Live Result Previews
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('google')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                        previewTab === 'google' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('social')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                        previewTab === 'social' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      WhatsApp / Social
                    </button>
                  </div>
                </div>

                {previewTab === 'google' ? (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-600">Google SERP Snippet</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setGoogleView('desktop')}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            googleView === 'desktop' ? 'bg-slate-200 text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setGoogleView('mobile')}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            googleView === 'mobile' ? 'bg-slate-200 text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          Mobile
                        </button>
                      </div>
                    </div>

                    {/* Google Search Card Preview */}
                    <div
                      className={`p-4 bg-white rounded-xl border border-slate-100 shadow-xs font-sans ${
                        googleView === 'mobile' ? 'max-w-[320px] mx-auto border-dashed' : ''
                      }`}
                    >
                      {/* Breadcrumb / Favicon */}
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center p-0.5 border border-slate-200">
                          <span className="text-[10px] font-bold text-amber-700">AG</span>
                        </div>
                        <div className="leading-tight">
                          <div className="text-[12px] font-medium text-slate-900">Arabian Gratings</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[280px]">
                            https://arabiangratings.com{formData.path}
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="text-base sm:text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug break-words">
                        {formData.meta_title || `${formData.page_name || 'Page Title'} | Arabian Gratings`}
                      </div>

                      {/* Description */}
                      <div className="text-xs text-[#4d5156] mt-1.5 leading-relaxed break-words">
                        {formData.meta_description ||
                          'Explore high quality grating solutions manufactured in Saudi Arabia. View specifications, certifications, and request custom quotes.'}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 italic">
                      Live preview updates instantly as you edit title and description.
                    </div>
                  </div>
                ) : (
                  /* Social Media / WhatsApp Card Preview */
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="text-[11px] font-semibold text-slate-600">
                      Social Card (LinkedIn, Facebook, WhatsApp, X)
                    </div>

                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs max-w-sm mx-auto">
                      {/* Banner Image */}
                      <div className="h-44 bg-slate-200 relative overflow-hidden flex items-center justify-center">
                        {formData.og_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={formData.og_image}
                            alt="Social banner preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4 text-slate-400">
                            <svg className="w-10 h-10 mx-auto mb-1 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[11px]">Default brand banner (/og-image.jpg)</span>
                          </div>
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="p-3 bg-white space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          arabiangratings.com
                        </div>
                        <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {formData.og_title || formData.meta_title || formData.page_name}
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {formData.og_description || formData.meta_description || 'High-load gratings & industrial flooring engineered in Saudi Arabia.'}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 italic">
                      This is how link previews appear when shared in client messaging apps.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="seo-form"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save SEO Tags</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
