import { MetadataRoute } from 'next';
import { getProducts, getIndustries, getSolutions, getServices, getProjects } from '@/lib/api/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: '', priority: 1.0 },
    { path: '/products', priority: 0.9 },
    { path: '/industries', priority: 0.9 },
    { path: '/solutions', priority: 0.9 },
    { path: '/services', priority: 0.9 },
    { path: '/projects', priority: 0.8 },
    { path: '/blog', priority: 0.8 },
    { path: '/about', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority,
  }));

  // Dynamic: Products
  try {
    const res = await getProducts({ page_size: 500 });
    (res.results || []).forEach((item) => {
      if (item.is_active) {
        entries.push({
          url: `${SITE_URL}/products/${item.slug}`,
          lastModified: new Date(item.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.85,
        });
      }
    });
  } catch {
    console.warn('Products unavailable for sitemap generation.');
  }

  // Dynamic: Industries
  try {
    const res = await getIndustries();
    (res.results || []).forEach((item) => {
      if (item.is_active) {
        entries.push({
          url: `${SITE_URL}/industries/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      }
    });
  } catch {
    console.warn('Industries unavailable for sitemap generation.');
  }

  // Dynamic: Solutions
  try {
    const res = await getSolutions();
    (res.results || []).forEach((item) => {
      if (item.is_active) {
        entries.push({
          url: `${SITE_URL}/solutions/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      }
    });
  } catch {
    console.warn('Solutions unavailable for sitemap generation.');
  }

  // Dynamic: Services
  try {
    const res = await getServices();
    (res.results || []).forEach((item) => {
      if (item.is_active) {
        entries.push({
          url: `${SITE_URL}/services/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      }
    });
  } catch {
    console.warn('Services unavailable for sitemap generation.');
  }

  // Dynamic: Projects
  try {
    const res = await getProjects();
    (res.results || []).forEach((item) => {
      if (item.is_active) {
        entries.push({
          url: `${SITE_URL}/projects/${item.slug}`,
          lastModified: new Date(item.updated_at),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      }
    });
  } catch {
    console.warn('Projects unavailable for sitemap generation.');
  }

  // Dynamic: Blog Categories
  try {
    const { getBlogCategories } = await import('@/lib/api/client');
    const res = await getBlogCategories();
    (res.results || []).forEach((item) => {
      if (item.is_active) {
        entries.push({
          url: `${SITE_URL}/blog/category/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        });
      }
    });
  } catch {
    console.warn('Blog Categories unavailable for sitemap generation.');
  }

  // Dynamic: Blog Posts
  try {
    const { getBlogPosts } = await import('@/lib/api/client');
    const res = await getBlogPosts();
    (res.results || []).forEach((item) => {
      // Exclude posts marked as no_index
      if (!item.no_index) {
        entries.push({
          url: `${SITE_URL}/blog/${item.slug}`,
          lastModified: new Date(item.updated_at || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      }
    });
  } catch {
    console.warn('Blog Posts unavailable for sitemap generation.');
  }

  // Location Pages
  const locations = ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'ras-al-khaimah', 'fujairah', 'umm-al-quwain'];
  locations.forEach((loc) => {
    entries.push({
      url: `${SITE_URL}/locations/${loc}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    });
  });

  return entries;
}

