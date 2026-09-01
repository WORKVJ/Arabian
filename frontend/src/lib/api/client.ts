/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Static data client — all data is served from local TypeScript files.
 * No backend server required. The API function signatures are preserved
 * so all page components work without modification.
 */
import {
  Product, ProductListItem, ProductCategory, Industry, Solution, Service,
  Project, BlogPost, PaginatedResponse, BlogCategory
} from '@/types';

import { STATIC_CATEGORIES, STATIC_PRODUCTS, STATIC_PRODUCTS_DETAIL } from '@/lib/data/products';
import { STATIC_INDUSTRIES } from '@/lib/data/industries';
import { STATIC_PROJECTS } from '@/lib/data/projects';
import { STATIC_BLOG_POSTS, STATIC_BLOG_CATEGORIES } from '@/lib/data/blog';
import { STATIC_SOLUTIONS, STATIC_SERVICES } from '@/lib/data/services';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000';

async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    let data: any = null;
    try {
      data = await res.json();
    } catch {}
    throw new APIError(data?.detail || `API error: ${res.statusText} (${res.status})`, res.status, data);
  }
  return await res.json() as T;
}

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/media/')) return `${API_BASE_URL}${path}`;
  return path;
}

// ─── Helper to wrap arrays in paginated format ───────────────────────────────
function paginate<T>(items: T[]): PaginatedResponse<T> {
  return { count: items.length, next: null, previous: null, results: items };
}

// ─── Error class kept for interface compatibility ────────────────────────────
export class APIError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ════════════════════════════════════════════════════════════════════════════

export async function getProducts(params?: {
  category?: string;
  is_featured?: boolean;
  search?: string;
  page_size?: number;
}): Promise<PaginatedResponse<ProductListItem>> {
  let results = [...STATIC_PRODUCTS];
  if (params?.category) {
    results = results.filter(p => p.category_slug === params.category);
  }
  if (params?.is_featured) {
    results = results.filter(p => p.is_featured);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q)
    );
  }
  return paginate(results);
}

export async function getProduct(slug: string): Promise<Product> {
  const product = STATIC_PRODUCTS_DETAIL.find(p => p.slug === slug);
  if (!product) throw new APIError(`Product not found: ${slug}`, 404);
  return product;
}

export async function getProductCategories(): Promise<PaginatedResponse<ProductCategory>> {
  return paginate(STATIC_CATEGORIES);
}

export async function getProductCategory(slug: string): Promise<ProductCategory> {
  const cat = STATIC_CATEGORIES.find(c => c.slug === slug);
  if (!cat) throw new APIError(`Category not found: ${slug}`, 404);
  return cat;
}

// ════════════════════════════════════════════════════════════════════════════
// INDUSTRIES
// ════════════════════════════════════════════════════════════════════════════

export async function getIndustries(): Promise<PaginatedResponse<Industry>> {
  return paginate(STATIC_INDUSTRIES);
}

export async function getIndustry(slug: string): Promise<Industry> {
  const industry = STATIC_INDUSTRIES.find(i => i.slug === slug);
  if (!industry) throw new APIError(`Industry not found: ${slug}`, 404);
  return industry;
}

// ════════════════════════════════════════════════════════════════════════════
// SOLUTIONS
// ════════════════════════════════════════════════════════════════════════════

export async function getSolutions(): Promise<PaginatedResponse<Solution>> {
  return paginate(STATIC_SOLUTIONS);
}

export async function getSolution(slug: string): Promise<Solution> {
  const sol = STATIC_SOLUTIONS.find(s => s.slug === slug);
  if (!sol) throw new APIError(`Solution not found: ${slug}`, 404);
  return sol;
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICES
// ════════════════════════════════════════════════════════════════════════════

export async function getServices(): Promise<PaginatedResponse<Service>> {
  return paginate(STATIC_SERVICES);
}

export async function getService(slug: string): Promise<Service> {
  const svc = STATIC_SERVICES.find(s => s.slug === slug);
  if (!svc) throw new APIError(`Service not found: ${slug}`, 404);
  return svc;
}

// ════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ════════════════════════════════════════════════════════════════════════════

export async function getProjects(params?: {
  industry?: string;
  product?: string;
  is_featured?: boolean;
}): Promise<PaginatedResponse<Project>> {
  try {
    const query = new URLSearchParams();
    if (params?.industry) query.append('industry', params.industry);
    if (params?.product) query.append('product', params.product);
    if (params?.is_featured) query.append('is_featured', String(params.is_featured));
    
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await fetchFromAPI<PaginatedResponse<Project>>(`/projects/${queryString}`, {
      next: { tags: ['projects'], revalidate: 86400 }
    });
  } catch (error) {
    console.warn("getProjects backend failed, falling back to static data", error);
    let results = [...STATIC_PROJECTS];
    if (params?.industry) {
      results = results.filter(p =>
        p.associated_industries.some(i => i.slug === params.industry)
      );
    }
    if (params?.is_featured) {
      results = results.filter(p => p.is_featured);
    }
    return paginate(results);
  }
}

export async function getProject(slug: string): Promise<Project> {
  try {
    return await fetchFromAPI<Project>(`/projects/${slug}/`, {
      next: { tags: [`project-${slug}`], revalidate: 86400 }
    });
  } catch (error) {
    console.warn(`getProject backend for slug: ${slug} failed, falling back to static data`, error);
    const project = STATIC_PROJECTS.find(p => p.slug === slug);
    if (!project) throw new APIError(`Project not found: ${slug}`, 404);
    return project;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// BLOG
// ════════════════════════════════════════════════════════════════════════════

export async function getBlogPosts(params?: {
  category?: string;
  product?: string;
  industry?: string;
  is_featured?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<BlogPost>> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.product) query.append('product', params.product);
    if (params?.industry) query.append('industry', params.industry);
    if (params?.is_featured) query.append('is_featured', String(params.is_featured));
    if (params?.search) query.append('search', params.search);
    if (params?.page && params.page > 1) query.append('page', String(params.page));
    if (params?.page_size) query.append('page_size', String(params.page_size));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await fetchFromAPI<PaginatedResponse<BlogPost>>(`/blog/${queryString}`, {
      next: { tags: ['blog'], revalidate: 86400 }
    });
  } catch (error) {
    console.warn("getBlogPosts backend failed, falling back to static data", error);
    let results = STATIC_BLOG_POSTS.filter(p => p.status === 'PUBLISHED');
    if (params?.category) {
      results = results.filter(p => p.category.slug === params.category);
    }
    if (params?.is_featured) {
      results = results.filter(p => p.is_featured);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
    }
    return paginate(results);
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  try {
    return await fetchFromAPI<BlogPost>(`/blog/${slug}/`, {
      next: { tags: [`blog-${slug}`], revalidate: 86400 }
    });
  } catch (error) {
    console.warn(`getBlogPost backend for slug: ${slug} failed, falling back to static data`, error);
    const post = STATIC_BLOG_POSTS.find(p => p.slug === slug);
    if (!post) throw new APIError(`Blog post not found: ${slug}`, 404);
    return post;
  }
}

export async function getBlogCategories(): Promise<PaginatedResponse<BlogCategory>> {
  try {
    return await fetchFromAPI<PaginatedResponse<BlogCategory>>('/blog/categories/', {
      next: { tags: ['blog-categories'], revalidate: 86400 }
    });
  } catch (error) {
    console.warn("getBlogCategories backend failed, falling back to static data", error);
    return paginate(STATIC_BLOG_CATEGORIES);
  }
}

export async function getBlogCategory(slug: string): Promise<BlogCategory> {
  try {
    return await fetchFromAPI<BlogCategory>(`/blog/categories/${slug}/`, {
      next: { tags: [`blog-category-${slug}`], revalidate: 86400 }
    });
  } catch (error) {
    console.warn(`getBlogCategory backend for slug: ${slug} failed, falling back to static data`, error);
    const cat = STATIC_BLOG_CATEGORIES.find(c => c.slug === slug);
    if (!cat) throw new APIError(`Blog category not found: ${slug}`, 404);
    return cat;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// FORM SUBMISSIONS
// ════════════════════════════════════════════════════════════════════════════

export async function submitContactEnquiry(data: {
  name: string;
  company?: string;
  email: string;
  phone: string;
  message: string;
}): Promise<any> {
  try {
    return await fetchFromAPI('/enquiries/contact/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn("submitContactEnquiry backend failed, falling back to email mailto client", error);
    const subject = encodeURIComponent(`Contact Enquiry from ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nCompany: ${data.company || 'N/A'}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage:\n${data.message}`
    );
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:sales@arabiangratings.com?subject=${subject}&body=${body}`;
    }
    return { success: true, fallback: true };
  }
}

export async function submitQuoteRequest(formData: FormData): Promise<any> {
  try {
    return await fetchFromAPI('/enquiries/quote/', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.warn("submitQuoteRequest backend failed, falling back to email mailto client", error);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const company = formData.get('company') || '';
    const phone = formData.get('phone') || '';
    const product = formData.get('product_category') || formData.get('product') || '';
    const message = formData.get('message') || formData.get('project_description') || '';

    const subject = encodeURIComponent(`Quote Request — ${product || 'General'} — ${company || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nProduct: ${product}\n\nDetails:\n${message}`
    );
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:sales@arabiangratings.com?subject=${subject}&body=${body}`;
    }
    return { success: true, fallback: true };
  }
}
