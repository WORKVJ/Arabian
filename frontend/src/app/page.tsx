import HomeClient from '@/components/home/HomeClient';
// Force reload cache for images audit
import { getProductCategories, getIndustries, getProjects, getBlogPosts } from '@/lib/api/client';
import { ProductCategory, Industry, Project, BlogPost } from '@/types';

export const revalidate = 86400; // Cache page for 24 hours

export default async function Home() {
  // Fetch data from Django API with try/catch to handle fallback cases gracefully
  let categories: ProductCategory[] = [];
  let industries: Industry[] = [];
  let projects: Project[] = [];
  let posts: BlogPost[] = [];

  try {
    const catRes = await getProductCategories();
    categories = catRes.results || [];
  } catch {
    console.warn("Product categories not available from backend. Using fallbacks.");
  }

  try {
    const indRes = await getIndustries();
    industries = indRes.results || [];
  } catch {
    console.warn("Industries not available from backend. Using fallbacks.");
  }

  try {
    const projRes = await getProjects({ is_featured: true });
    projects = projRes.results || [];
  } catch {
    console.warn("Featured projects not available from backend. Using fallbacks.");
  }

  try {
    const blogRes = await getBlogPosts({ page_size: 3 });
    posts = blogRes.results || [];
  } catch {
    console.warn("Featured blog posts not available from backend. Using fallbacks.");
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabiangratings.com';
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Arabian Gratings & Manufacturing Company',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Leading manufacturer and supplier of high-performance steel, GRP, and aluminium gratings in Saudi Arabia and GCC.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966 12 657 6896',
      contactType: 'sales',
      areaServed: ['SA', 'AE', 'BH', 'OM', 'KW', 'QA'],
      availableLanguage: ['en', 'ar']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Othman Bin Afan Street',
      addressLocality: 'Jeddah',
      postalCode: '22234',
      addressCountry: 'SA'
    }
  };

  const localBizSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Arabian Gratings & Manufacturing Company',
    image: `${SITE_URL}/logo.png`,
    '@id': `${SITE_URL}/#localbusiness`,
    url: SITE_URL,
    telephone: '+966 12 657 6896',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Othman Bin Afan Street',
      addressLocality: 'Jeddah',
      postalCode: '22234',
      addressCountry: 'SA'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      opens: '08:00',
      closes: '17:30'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }}
      />
      <HomeClient 
        categories={categories} 
        industries={industries} 
        projects={projects}
        posts={posts}
      />
    </>
  );
}

