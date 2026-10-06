'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AdminBlogItem,
  getAdminBlogPosts,
  getAdminBlogPost,
  createAdminBlogPost,
  updateAdminBlogPost,
  deleteAdminBlogPost,
  getAdminBlogCategories,
  uploadMedia,
  getImageUrl
} from '@/lib/api/adminApi';
import BlogContentRenderer from '@/components/blog/BlogContentRenderer';
import { Edit3, Eye, Link2 } from 'lucide-react';

const INTERNAL_LINK_PRESETS = [
  // Products
  { category: 'Products', label: 'Steel Gratings', path: '/products/steel-gratings', defaultText: 'heavy-duty steel gratings' },
  { category: 'Products', label: 'FRP / GRP Products', path: '/products/frp-grp-products', defaultText: 'FRP/GRP grating solutions' },
  { category: 'Products', label: 'Stainless Steel Products', path: '/products/stainless-steel-products', defaultText: 'stainless steel gratings' },
  { category: 'Products', label: 'Aluminium Gratings', path: '/products/aluminium-gratings', defaultText: 'aluminium gratings' },
  { category: 'Products', label: 'Grating Fixing Clamps', path: '/products/grating-fixing-clamps', defaultText: 'grating fixing clamps' },
  { category: 'Products', label: 'Manhole Covers', path: '/products/manhole-covers', defaultText: 'industrial manhole covers' },
  { category: 'Products', label: 'Safety Step Irons', path: '/products/safety-step-irons', defaultText: 'safety step irons' },
  { category: 'Products', label: 'Tactile Warning Studs', path: '/products/tactile-warning-studs', defaultText: 'tactile warning studs' },
  { category: 'Products', label: 'All Products Overview', path: '/products', defaultText: 'complete range of grating products' },

  // Solutions
  { category: 'Solutions', label: 'Industrial Floor Grating', path: '/solutions/industrial-floor-grating', defaultText: 'industrial floor grating solutions' },
  { category: 'Solutions', label: 'Drainage Trench Covers', path: '/solutions/drainage-trench-covers', defaultText: 'drainage trench grating systems' },
  { category: 'Solutions', label: 'Manhole Access Safety', path: '/solutions/manhole-access-safety', defaultText: 'manhole access safety systems' },
  { category: 'Solutions', label: 'All Engineering Solutions', path: '/solutions', defaultText: 'engineered access solutions' },

  // Industries
  { category: 'Industries', label: 'Oil & Gas Sector', path: '/industries/oil-and-gas', defaultText: 'oil and gas grating applications' },
  { category: 'Industries', label: 'Marine & Offshore', path: '/industries/marine-offshore', defaultText: 'marine and offshore flooring' },
  { category: 'Industries', label: 'Chemical Processing', path: '/industries/chemical-processing', defaultText: 'chemical processing platforms' },
  { category: 'Industries', label: 'Water Treatment', path: '/industries/water-treatment', defaultText: 'water treatment plants' },
  { category: 'Industries', label: 'Power Generation', path: '/industries/power-generation', defaultText: 'power generation installations' },

  // Locations
  { category: 'Locations', label: 'Riyadh Supply & Projects', path: '/locations/riyadh', defaultText: 'grating supplier in Riyadh' },
  { category: 'Locations', label: 'Jeddah Supply & Projects', path: '/locations/jeddah', defaultText: 'grating supply in Jeddah' },
  { category: 'Locations', label: 'Dammam Supply & Projects', path: '/locations/dammam', defaultText: 'industrial grating in Dammam' },
  { category: 'Locations', label: 'Al Jubail Industrial City', path: '/locations/al-jubail', defaultText: 'grating solutions in Jubail' },
  { category: 'Locations', label: 'Yanbu Industrial City', path: '/locations/yanbu', defaultText: 'industrial access systems in Yanbu' },

  // Core Pages
  { category: 'Core Pages', label: 'Contact & RFQ Page', path: '/contact', defaultText: 'contact our sales engineering team' },
  { category: 'Core Pages', label: 'Showcase Projects', path: '/projects', defaultText: 'our completed industrial projects' },
  { category: 'Core Pages', label: 'Fabrication Services', path: '/services', defaultText: 'custom fabrication services' },
  { category: 'Core Pages', label: 'About Arabian Gratings', path: '/about', defaultText: 'about Arabian Gratings' },
  { category: 'Core Pages', label: 'Blog & Articles Index', path: '/blog', defaultText: 'technical knowledge base' },
];

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function BlogManager() {
  const [blogs, setBlogs] = useState<AdminBlogItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Content Editor & Internal Link Inserter State
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [contentViewMode, setContentViewMode] = useState<'edit' | 'preview'>('edit');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkCategoryFilter, setLinkCategoryFilter] = useState<string>('All');
  const [linkFilterQuery, setLinkFilterQuery] = useState<string>('');
  const [selectedLinkPath, setSelectedLinkPath] = useState<string>('/products/steel-gratings');
  const [linkAnchorText, setLinkAnchorText] = useState<string>('');
  const [isCustomPathMode, setIsCustomPathMode] = useState<boolean>(false);
  const [customPathInput, setCustomPathInput] = useState<string>('');

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: 0,
    excerpt: '',
    content: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
    is_featured: false,
    featured_image_id: null as number | null,
    featured_image_preview: '' as string,
    seo_title: '',
    seo_description: '',
  });

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAdminBlogPosts({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setBlogs(data.results || []);
    } catch (err) {
      console.error('Failed to load blog posts', err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getAdminBlogCategories();
      setCategories(data.results || []);
      if (data.results?.length && formData.category_id === 0) {
        setFormData(prev => ({ ...prev, category_id: data.results[0].id }));
      }
    } catch (err) {
      console.error('Failed to load blog categories', err);
    }
  }, [formData.category_id]);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [fetchBlogs, fetchCategories]);

  const handleOpenCreate = () => {
    setEditingBlogId(null);
    setFormData({
      title: '',
      slug: '',
      category_id: categories[0]?.id || 1,
      excerpt: '',
      content: '',
      status: 'PUBLISHED',
      is_featured: false,
      featured_image_id: null,
      featured_image_preview: '',
      seo_title: '',
      seo_description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (blog: AdminBlogItem) => {
    setEditingBlogId(blog.id);
    try {
      // Fetch full details
      const detail = await getAdminBlogPost(blog.slug || blog.id);
      setFormData({
        title: detail.title,
        slug: detail.slug,
        category_id: detail.category?.id || (detail as any).category_id || categories[0]?.id || 1,
        excerpt: detail.excerpt || '',
        content: detail.content || '',
        status: detail.status || 'PUBLISHED',
        is_featured: detail.is_featured || false,
        featured_image_id: detail.featured_image?.id || null,
        featured_image_preview: detail.featured_image ? (getImageUrl(detail.featured_image.file) || '') : '',
        seo_title: detail.seo_title || '',
        seo_description: detail.seo_description || '',
      });
      setIsModalOpen(true);
    } catch (err) {
      alert('Failed to retrieve full article details');
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
      alert('Please enter an article title.');
      return;
    }

    setIsSaving(true);
    try {
      const finalSlug = (formData.slug || slugify(formData.title)).trim();
      const payload = {
        title: formData.title,
        slug: finalSlug,
        category_id: formData.category_id && formData.category_id > 0 ? formData.category_id : undefined,
        excerpt: formData.excerpt,
        content: formData.content,
        status: formData.status,
        is_featured: formData.is_featured,
        featured_image_id: formData.featured_image_id,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
      };

      if (editingBlogId) {
        await updateAdminBlogPost(editingBlogId, payload);
      } else {
        await createAdminBlogPost(payload);
      }

      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      alert(err.message || 'Failed to save blog post');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to insert markdown or text at current cursor location in content textarea
  const insertTextAtCursor = (before: string, after: string = '', defaultMiddle: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) {
      setFormData(prev => ({ ...prev, content: (prev.content || '') + before + defaultMiddle + after }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultMiddle;
    const replacement = before + selectedText + after;

    const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const handleOpenLinkModal = () => {
    const textarea = contentTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end).trim();
      if (selected) {
        setLinkAnchorText(selected);
      } else {
        const found = INTERNAL_LINK_PRESETS.find(p => p.path === selectedLinkPath);
        setLinkAnchorText(found?.defaultText || 'learn more');
      }
    } else {
      setLinkAnchorText('learn more');
    }
    setIsLinkModalOpen(true);
  };

  const handleInsertInternalLink = (path: string, anchorText: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanText = anchorText.trim() || 'learn more';
    const linkMarkdown = `[${cleanText}](${cleanPath})`;

    const textarea = contentTextareaRef.current;
    if (!textarea) {
      setFormData(prev => ({ ...prev, content: prev.content ? `${prev.content}\n${linkMarkdown}` : linkMarkdown }));
      setIsLinkModalOpen(false);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = textarea.value.substring(0, start) + linkMarkdown + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));

    setIsLinkModalOpen(false);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + linkMarkdown.length, start + linkMarkdown.length);
    }, 50);
  };

  const handleQuickInsert = (preset: typeof INTERNAL_LINK_PRESETS[0]) => {
    const textarea = contentTextareaRef.current;
    let anchor = preset.defaultText;
    if (textarea) {
      const selected = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).trim();
      if (selected) {
        anchor = selected;
      }
    }
    const linkMarkdown = `[${anchor}](${preset.path})`;
    if (!textarea) {
      setFormData(prev => ({ ...prev, content: prev.content ? `${prev.content} ${linkMarkdown}` : linkMarkdown }));
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = textarea.value.substring(0, start) + linkMarkdown + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + linkMarkdown.length, start + linkMarkdown.length);
    }, 50);
  };

  const handleDelete = async (blog: AdminBlogItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${blog.title}"?`)) return;

    try {
      await deleteAdminBlogPost(blog.slug || blog.id);
      setBlogs(prev => prev.filter(b => b.id !== blog.id));
    } catch (err) {
      alert('Failed to delete article');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Blog & Article Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, and publish technical grating guides, industry news, and SEO articles.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Write New Article
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 transition cursor-pointer"
          >
            <option value="ALL">All Posts</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Drafts</option>
          </select>

          <button
            onClick={fetchBlogs}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Blog Posts List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Loading articles...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-xs">
          <p className="text-slate-500 text-sm">No blog articles found. Click &quot;Write New Article&quot; to publish your first post!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => {
            const img = blog.featured_image ? getImageUrl(blog.featured_image.file) : null;
            return (
              <div
                key={blog.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {img ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        No Cover Image
                      </div>
                    )}

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {blog.is_featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                          Featured
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        blog.status === 'PUBLISHED'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {blog.status}
                      </span>
                    </div>

                    {blog.category && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 backdrop-blur-md text-amber-700 border border-slate-200 shadow-xs">
                          {blog.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 hover:text-amber-600 transition">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {blog.excerpt || 'No excerpt provided.'}
                    </p>
                    <div className="text-[11px] text-slate-400 font-medium mt-3">
                      {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Draft'}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <a
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-amber-600 font-semibold transition"
                  >
                    View Live ↗
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(blog)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-xs font-semibold rounded-lg text-slate-700 transition border border-slate-300 shadow-2xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition text-xs cursor-pointer"
                      title="Delete Article"
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

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingBlogId ? 'Edit Article' : 'Write New Article'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your article content, upload high-res visuals, and adjust publishing parameters.
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
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        title: val,
                        slug: !editingBlogId && (!prev.slug || prev.slug === slugify(prev.title)) ? slugify(val) : prev.slug
                      }));
                    }}
                    placeholder="e.g. Complete Guide to Heavy Duty Floor Gratings"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug (Web address identifier)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="Auto-generated from title"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Website page link: /blog/<span className="font-mono text-amber-600 font-semibold">{formData.slug || slugify(formData.title) || 'your-article'}</span>
                  </p>
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Article Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={e => setFormData(prev => ({ ...prev, category_id: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 transition cursor-pointer"
                  >
                    {categories.length === 0 ? (
                      <option value={0}>Technical Standards (Default)</option>
                    ) : (
                      categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Topic section on the public blog
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 transition cursor-pointer"
                  >
                    <option value="PUBLISHED">Published (Live)</option>
                    <option value="DRAFT">Draft (Unlisted)</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span className="text-xs text-slate-700 font-medium">Pin as Featured Post</span>
                  </label>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Featured Cover Image
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
                      {isUploadingImage ? 'Uploading image...' : 'Click or drop image here (JPEG, PNG, WebP)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Excerpt (Teaser text for previews) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief 1-2 sentence overview of the article..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>

              {/* Content Body with Internal Link Toolbar */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Article Content (Markdown & HTML supported) *
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Insert internal links to connect articles with products, solutions, and services for maximum SEO.
                    </p>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setContentViewMode('edit')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                        contentViewMode === 'edit'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Edit3 className="w-3 h-3 text-slate-700" />
                      <span>Edit Content</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentViewMode('preview')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                        contentViewMode === 'preview'
                          ? 'bg-white text-amber-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3 h-3 text-amber-700" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="bg-slate-50 border border-slate-300 rounded-t-xl p-2.5 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Primary Insert Link Button */}
                    <button
                      type="button"
                      onClick={handleOpenLinkModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                      title="Insert Internal Link to product, solution, or category"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Insert Internal Link</span>
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

                    {/* Standard Markdown Formatting Tools */}
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('**', '**', 'bold text')}
                      className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded text-xs font-bold transition cursor-pointer"
                      title="Bold text (**text**)"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('*', '*', 'italic text')}
                      className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded text-xs italic font-serif transition cursor-pointer"
                      title="Italic text (*text*)"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('\n## ', '\n', 'Section Heading')}
                      className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded text-xs font-bold transition cursor-pointer"
                      title="Heading 2 (## Heading)"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('\n### ', '\n', 'Subsection Heading')}
                      className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded text-xs font-semibold transition cursor-pointer"
                      title="Heading 3 (### Heading)"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('\n- ', '', 'Bullet point')}
                      className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded text-xs transition cursor-pointer"
                      title="Bullet list (- item)"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('\n> ', '\n', 'Important note or quote')}
                      className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded text-xs transition cursor-pointer"
                      title="Quote (> quote)"
                    >
                      “ Quote
                    </button>
                  </div>

                  {/* 1-Click Quick Internal Link Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Links:
                    </span>
                    {INTERNAL_LINK_PRESETS.slice(0, 7).map((preset) => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => handleQuickInsert(preset)}
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
                        title={`Insert link to ${preset.path}`}
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editor or Preview */}
                {contentViewMode === 'edit' ? (
                  <textarea
                    ref={contentTextareaRef}
                    required
                    rows={10}
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your article content. Click 'Insert Internal Link' or use markdown [Anchor Text](/products/steel-gratings) to link internally..."
                    className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-b-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition font-mono leading-relaxed"
                  />
                ) : (
                  <div className="p-4 bg-white border border-slate-300 rounded-b-xl min-h-[200px] max-h-96 overflow-y-auto">
                    {formData.content ? (
                      <BlogContentRenderer content={formData.content} />
                    ) : (
                      <p className="text-xs text-slate-400 italic">No content entered yet to preview.</p>
                    )}
                  </div>
                )}
              </div>

              {/* SEO Extras Accordion */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-amber-800 block">SEO Meta Information (Optional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={e => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                      placeholder="SEO Meta Title (Default is article title)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.seo_description}
                      onChange={e => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                      placeholder="SEO Meta Description (Default is excerpt)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
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
                  {isSaving ? 'Saving Article...' : editingBlogId ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internal Link Inserter Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Insert Internal Link</h4>
                  <p className="text-[11px] text-slate-500">Select an Arabian Gratings page or product to link into your article</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mode: Preset vs Custom */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCustomPathMode(false)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                  !isCustomPathMode
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Browse Site Pages
              </button>
              <button
                type="button"
                onClick={() => setIsCustomPathMode(true)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                  isCustomPathMode
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Custom URL / Path
              </button>
            </div>

            {!isCustomPathMode ? (
              <>
                {/* Search & Category Filter */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={linkFilterQuery}
                    onChange={e => setLinkFilterQuery(e.target.value)}
                    placeholder="Search products, solutions, locations..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500"
                  />

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {['All', 'Products', 'Solutions', 'Industries', 'Locations', 'Core Pages', 'Blogs'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setLinkCategoryFilter(cat)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
                          linkCategoryFilter === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pages List */}
                <div className="flex-1 overflow-y-auto max-h-56 divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/50">
                  {[
                    ...INTERNAL_LINK_PRESETS,
                    ...blogs
                      .filter(b => b.slug && b.id !== editingBlogId)
                      .map(b => ({
                        category: 'Blogs',
                        label: b.title,
                        path: `/blog/${b.slug}`,
                        defaultText: b.title,
                      })),
                  ]
                    .filter(item => {
                      const matchesCat = linkCategoryFilter === 'All' || item.category === linkCategoryFilter;
                      const matchesQuery = !linkFilterQuery || 
                        item.label.toLowerCase().includes(linkFilterQuery.toLowerCase()) ||
                        item.path.toLowerCase().includes(linkFilterQuery.toLowerCase());
                      return matchesCat && matchesQuery;
                    })
                    .map(item => (
                      <div
                        key={item.path}
                        onClick={() => {
                          setSelectedLinkPath(item.path);
                          if (!linkAnchorText || linkAnchorText === 'learn more') {
                            setLinkAnchorText(item.defaultText);
                          }
                        }}
                        className={`p-2.5 flex items-center justify-between cursor-pointer transition text-xs ${
                          selectedLinkPath === item.path
                            ? 'bg-amber-50/80 border-l-4 border-amber-600'
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-900 truncate">{item.label}</div>
                          <div className="font-mono text-[10px] text-slate-500 truncate">{item.path}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-medium whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="space-y-3 py-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Path (must start with /)
                  </label>
                  <input
                    type="text"
                    value={customPathInput}
                    onChange={e => {
                      setCustomPathInput(e.target.value);
                      setSelectedLinkPath(e.target.value);
                    }}
                    placeholder="/products/your-slug"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Anchor Text */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Link Text (Anchor Text displayed in article) *
              </label>
              <input
                type="text"
                value={linkAnchorText}
                onChange={e => setLinkAnchorText(e.target.value)}
                placeholder="e.g. Heavy Duty Steel Gratings"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              />
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                Markdown preview: <span className="text-amber-700 font-semibold">[{linkAnchorText || 'anchor text'}]({selectedLinkPath})</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleInsertInternalLink(selectedLinkPath, linkAnchorText)}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
