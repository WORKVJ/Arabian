'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AdminProjectItem,
  getAdminProjects,
  getAdminProject,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  uploadMedia,
  getImageUrl
} from '@/lib/api/adminApi';

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function ProjectManager() {
  const [projects, setProjects] = useState<AdminProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    location: '',
    description: '',
    project_date: '',
    is_featured: false,
    is_active: true,
    featured_image_id: null as number | null,
    featured_image_preview: '' as string,
    seo_title: '',
    seo_description: '',
  });

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAdminProjects({
        search: searchQuery || undefined,
      });
      setProjects(data.results || []);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenCreate = () => {
    setEditingProjectId(null);
    setFormData({
      title: '',
      slug: '',
      location: '',
      description: '',
      project_date: new Date().toISOString().split('T')[0],
      is_featured: false,
      is_active: true,
      featured_image_id: null,
      featured_image_preview: '',
      seo_title: '',
      seo_description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (proj: AdminProjectItem) => {
    setEditingProjectId(proj.id);
    try {
      const detail = await getAdminProject(proj.slug || proj.id);
      setFormData({
        title: detail.title,
        slug: detail.slug,
        location: detail.location || '',
        description: detail.description || '',
        project_date: detail.project_date || '',
        is_featured: detail.is_featured || false,
        is_active: detail.is_active ?? true,
        featured_image_id: detail.featured_image?.id || null,
        featured_image_preview: detail.featured_image ? (getImageUrl(detail.featured_image.file) || '') : '',
        seo_title: detail.seo_title || '',
        seo_description: detail.seo_description || '',
      });
      setIsModalOpen(true);
    } catch (err) {
      alert('Failed to load project details');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const media = await uploadMedia(file, formData.title || file.name);
      setFormData(prev => ({
        ...prev,
        featured_image_id: media.id,
        featured_image_preview: getImageUrl(media.file) || URL.createObjectURL(file),
      }));
    } catch (err: any) {
      alert(err.message || 'Image upload failed.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a project title');
      return;
    }

    setIsSaving(true);
    try {
      const finalSlug = (formData.slug || slugify(formData.title)).trim();
      const payload = {
        title: formData.title,
        slug: finalSlug,
        location: formData.location,
        description: formData.description,
        project_date: formData.project_date || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        featured_image_id: formData.featured_image_id,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
      };

      if (editingProjectId) {
        await updateAdminProject(editingProjectId, payload);
      } else {
        await createAdminProject(payload);
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (proj: AdminProjectItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${proj.title}"?`)) return;

    try {
      await deleteAdminProject(proj.slug || proj.id);
      setProjects(prev => prev.filter(p => p.id !== proj.id));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Showcase Projects & Installations</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your industrial grating installations across Saudi Arabia, UAE, and GCC infrastructure projects.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search projects by title or location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          onClick={fetchProjects}
          className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 transition cursor-pointer"
          title="Refresh"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-xs">
          <p className="text-slate-500 text-sm">No showcase projects registered yet. Click &quot;Add New Project&quot; to highlight your work!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => {
            const img = proj.featured_image ? getImageUrl(proj.featured_image.file) : null;
            return (
              <div
                key={proj.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {img ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={img} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        No Image
                      </div>
                    )}

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {proj.is_featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                          Featured
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        proj.is_active
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {proj.is_active ? 'Active' : 'Archived'}
                      </span>
                    </div>

                    {proj.location && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200 shadow-xs flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {proj.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 hover:text-amber-600 transition">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {proj.description || 'No description provided.'}
                    </p>
                    {proj.project_date && (
                      <div className="text-[11px] text-slate-400 font-medium mt-3">
                        Installed: {new Date(proj.project_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <a
                    href={`/projects/${proj.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-amber-600 font-semibold transition"
                  >
                    View Live ↗
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-xs font-semibold rounded-lg text-slate-700 transition border border-slate-300 shadow-2xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(proj)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition text-xs cursor-pointer"
                      title="Delete Project"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProjectId ? 'Edit Project' : 'Add New Showcase Project'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showcase installations, specify location, and upload architectural or on-site photographs.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => {
                      const newTitle = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        title: newTitle,
                        slug: !prev.slug || prev.slug === slugify(prev.title) ? slugify(newTitle) : prev.slug,
                      }));
                    }}
                    placeholder="e.g. Riyadh Metro Line 3 Walkway Gratings"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Address (Web Link Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                    placeholder="e.g. riyadh-metro-line-3"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Website page link: /projects/<strong>{formData.slug || 'your-title'}</strong>
                  </span>
                </div>
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Riyadh, Saudi Arabia / Dubai, UAE"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Installation / Completion Date
                  </label>
                  <input
                    type="date"
                    value={formData.project_date}
                    onChange={e => setFormData(prev => ({ ...prev, project_date: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 font-medium">Visible on Website (Active)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={e => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 font-medium">Feature on Homepage</span>
                </label>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Installation Image
                </label>
                <div className="flex items-center gap-4">
                  {formData.featured_image_preview ? (
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 flex-shrink-0 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.featured_image_preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, featured_image_id: null, featured_image_preview: '' }))}
                        className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 text-[10px] hover:bg-rose-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ) : null}

                  <label className="flex-1 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-3.5 text-center cursor-pointer transition bg-slate-50 hover:bg-amber-50/20">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      {isUploadingImage ? 'Uploading photo...' : 'Click or drop project photo (JPEG, PNG, WebP)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Scope & Technical Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the grating solutions deployed, load rating specifications, industrial environment requirements..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-xl text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Saving Project...' : editingProjectId ? 'Update Project' : 'Save & Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
