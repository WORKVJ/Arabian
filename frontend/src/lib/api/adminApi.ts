/**
 * Arabian Gratings - Custom Client Admin API Client
 * Manages authentication, dashboard metrics, blog CRUD, project showcase CRUD,
 * and incoming contact & quote enquiries.
 */

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface DashboardStats {
  total_enquiries: number;
  unread_enquiries: number;
  total_quotes: number;
  unread_quotes: number;
  total_blogs: number;
  published_blogs: number;
  total_projects: number;
}

export interface ContactLead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'SPAM' | 'CLOSED';
  created_at: string;
}

export interface QuoteLead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  material: string;
  quantity: string;
  dimensions: string;
  project_requirements: string;
  drawing: string | null;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTATION_SENT' | 'IN_PROGRESS' | 'CLOSED' | 'SPAM';
  attachments: Array<{ id: number; file: string; created_at: string }>;
  created_at: string;
}

export interface AdminBlogItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: { id: number; file: string; title: string; alt_text: string } | null;
  category?: { id: number; name: string; slug: string } | null;
  category_id?: number;
  author?: { id: number; name: string } | null;
  status: 'DRAFT' | 'PUBLISHED';
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  seo_title?: string;
  seo_description?: string;
}

export interface AdminProjectItem {
  id: number;
  title: string;
  slug: string;
  location: string;
  description: string;
  featured_image?: { id: number; file: string; title: string; alt_text: string } | null;
  project_date: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  seo_title?: string;
  seo_description?: string;
}

const TOKEN_KEY = 'arabian_admin_token';
const USER_KEY = 'arabian_admin_user';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as AdminUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AdminUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api/v1';
    }
    return `${window.location.origin}/api/v1`;
  }
  return 'http://127.0.0.1:8000/api/v1';
}

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl = getApiUrl().replace('/api/v1', '');
  if (path.startsWith('/media/')) return `${baseUrl}${path}`;
  return path;
}

export async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Token ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${getApiUrl()}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeAuthToken();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      // do not loop redirect, handled in UI
    }
    throw new Error('Unauthorized. Please log in again.');
  }

  if (!response.ok) {
    let errorDetail = `Request failed: ${response.statusText} (${response.status})`;
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.error || JSON.stringify(errJson);
    } catch {}
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

// ─── AUTHENTICATION ───────────────────────────────────────────────

export async function adminLogin(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const url = `${getApiUrl()}/auth/login/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let msg = 'Invalid credentials';
    try {
      const err = await res.json();
      msg = err.error || err.detail || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  setAuthToken(data.token);
  setStoredUser(data.user);
  return data;
}

export async function adminMe(): Promise<AdminUser> {
  return await adminFetch<AdminUser>('/auth/me/');
}

export async function adminLogout(): Promise<void> {
  try {
    await adminFetch('/auth/logout/', { method: 'POST' });
  } catch {}
  removeAuthToken();
}

export async function getDashboardStats(): Promise<{ stats: DashboardStats; recent_enquiries: any[] }> {
  return await adminFetch('/auth/stats/');
}

// ─── MEDIA UPLOAD ─────────────────────────────────────────────────

export async function uploadMedia(file: File, title?: string, altText?: string): Promise<{ id: number; file: string; title: string }> {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  if (altText) formData.append('alt_text', altText);

  return await adminFetch('/auth/upload/', {
    method: 'POST',
    body: formData,
  });
}

// ─── CONTACT ENQUIRIES ───────────────────────────────────────────

export async function getContactEnquiries(params?: { status?: string; search?: string; page?: number }): Promise<{ count: number; results: ContactLead[] }> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));

  const qs = query.toString() ? `?${query.toString()}` : '';
  return await adminFetch(`/enquiries/contact/${qs}`);
}

export async function updateContactStatus(id: number, status: string): Promise<ContactLead> {
  return await adminFetch(`/enquiries/contact/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteContactEnquiry(id: number): Promise<void> {
  await adminFetch(`/enquiries/contact/${id}/`, {
    method: 'DELETE',
  });
}

// ─── QUOTE REQUESTS ───────────────────────────────────────────────

export async function getQuoteRequests(params?: { status?: string; search?: string; page?: number }): Promise<{ count: number; results: QuoteLead[] }> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));

  const qs = query.toString() ? `?${query.toString()}` : '';
  return await adminFetch(`/enquiries/quote/${qs}`);
}

export async function updateQuoteStatus(id: number, status: string): Promise<QuoteLead> {
  return await adminFetch(`/enquiries/quote/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteQuoteRequest(id: number): Promise<void> {
  await adminFetch(`/enquiries/quote/${id}/`, {
    method: 'DELETE',
  });
}

// ─── BLOG POSTS ───────────────────────────────────────────────────

export async function getAdminBlogPosts(params?: { status?: string; search?: string; page?: number }): Promise<{ count: number; results: AdminBlogItem[] }> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));

  const qs = query.toString() ? `?${query.toString()}` : '';
  return await adminFetch(`/blog/posts/${qs}`);
}

export async function getAdminBlogPost(slugOrId: string | number): Promise<AdminBlogItem> {
  return await adminFetch(`/blog/posts/${slugOrId}/`);
}

export async function createAdminBlogPost(data: Partial<AdminBlogItem> & { category_id?: number; featured_image_id?: number | null }): Promise<AdminBlogItem> {
  return await adminFetch('/blog/posts/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminBlogPost(slugOrId: string | number, data: Partial<AdminBlogItem> & { category_id?: number; featured_image_id?: number | null }): Promise<AdminBlogItem> {
  return await adminFetch(`/blog/posts/${slugOrId}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminBlogPost(slugOrId: string | number): Promise<void> {
  await adminFetch(`/blog/posts/${slugOrId}/`, {
    method: 'DELETE',
  });
}

export async function getAdminBlogCategories(): Promise<{ count: number; results: Array<{ id: number; name: string; slug: string }> }> {
  return await adminFetch('/blog/categories/');
}

// ─── SHOWCASE PROJECTS ────────────────────────────────────────────

export async function getAdminProjects(params?: { search?: string; page?: number }): Promise<{ count: number; results: AdminProjectItem[] }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));

  const qs = query.toString() ? `?${query.toString()}` : '';
  return await adminFetch(`/projects/${qs}`);
}

export async function getAdminProject(slugOrId: string | number): Promise<AdminProjectItem> {
  return await adminFetch(`/projects/${slugOrId}/`);
}

export async function createAdminProject(data: Partial<AdminProjectItem> & { featured_image_id?: number | null }): Promise<AdminProjectItem> {
  return await adminFetch('/projects/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminProject(slugOrId: string | number, data: Partial<AdminProjectItem> & { featured_image_id?: number | null }): Promise<AdminProjectItem> {
  return await adminFetch(`/projects/${slugOrId}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminProject(slugOrId: string | number): Promise<void> {
  await adminFetch(`/projects/${slugOrId}/`, {
    method: 'DELETE',
  });
}
