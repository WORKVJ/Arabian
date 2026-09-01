import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBlogCategory, getBlogCategories } from '@/lib/api/client';
import BlogCard from '@/components/blog/BlogCard';
import BlogCategoryNav from '@/components/blog/BlogCategoryNav';
import Reveal from '@/components/animations/Reveal';
import { generatePageMetadata } from '@/lib/seo/config';
import { Metadata } from 'next';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { BlogPost, BlogCategory, PaginatedResponse } from '@/types';

export const revalidate = 86400; // 24 hours ISR

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sParams = await searchParams;
  const page = parseInt(sParams.page || '1', 10);
  try {
    const category = await getBlogCategory(slug);
    if (page > 1) {
      return {
        title: `${category.name} Articles - Page ${page} | Arabian Gratings Saudi Arabia`,
        robots: { index: false, follow: true },
      };
    }
    return generatePageMetadata(null, {
      title: `${category.name} Articles | Arabian Gratings Saudi Arabia`,
      description: category.description || `Read articles and guides related to ${category.name}.`,
      path: `/blog/category/${category.slug}`,
    });
  } catch {
    return { title: 'Category | Arabian Gratings Saudi Arabia' };
  }
}

export default async function BlogCategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const page = parseInt(sParams.page || '1', 10);
  const PAGE_SIZE = 9;

  let category: BlogCategory | null = null;
  try {
    category = await getBlogCategory(slug);
  } catch {
    notFound();
  }

  if (!category || category.is_active === false) {
    notFound();
  }

  let postsRes: PaginatedResponse<BlogPost> = { count: 0, next: null, previous: null, results: [] };
  let categoriesRes: PaginatedResponse<BlogCategory> = { count: 0, next: null, previous: null, results: [] };

  try {
    postsRes = await getBlogPosts({
      category: slug,
      page,
      page_size: PAGE_SIZE,
    });
  } catch (error) {
    console.warn('Failed to fetch posts for category page.', error);
  }

  try {
    categoriesRes = await getBlogCategories();
  } catch (error) {
    console.warn('Failed to fetch categories list for nav.', error);
  }

  const posts = postsRes.results || [];
  const categories = categoriesRes.results || [];

  const totalPages = Math.ceil(postsRes.count / PAGE_SIZE);
  const showPagination = totalPages > 1;

  const buildPageUrl = (targetPage: number) => {
    return `/blog/category/${slug}${targetPage > 1 ? `?page=${targetPage}` : ''}`;
  };

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${SITE_URL}/blog/category/${category.slug}` },
    ],
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center text-xs font-semibold text-slate-grey hover:text-accent transition-colors font-display uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Knowledge Hub
          </Link>
        </div>

        {/* Category Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">
              Knowledge Hub Category
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                {category.description}
              </p>
            )}
          </div>
        </Reveal>

        {/* Category Pills Navigation */}
        {categories.length > 0 && (
          <Reveal direction="none" delay={0.15}>
            <div className="mb-10 bg-white border border-border-color p-6 rounded-sm shadow-sm">
              <Suspense fallback={<div className="text-xs text-slate-555 font-mono">Loading navigation...</div>}>
                <BlogCategoryNav categories={categories} />
              </Suspense>
            </div>
          </Reveal>
        )}

        {/* Category Posts Grid */}
        {posts.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <BlogCard key={post.id} post={post} index={idx} headingLevel="h3" />
              ))}
            </div>

            {/* Pagination Controls */}
            {showPagination && (
              <nav aria-label="Category blog pagination" className="mt-12 flex justify-center items-center gap-4">
                {page > 1 ? (
                  <Link
                    href={buildPageUrl(page - 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-color text-xs font-bold uppercase tracking-wider text-slate-grey hover:bg-slate-50 transition-colors rounded-sm"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-color text-xs font-bold uppercase tracking-wider text-slate-300 pointer-events-none rounded-sm">
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </span>
                )}

                <span className="text-xs text-slate-500 font-mono font-semibold">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages ? (
                  <Link
                    href={buildPageUrl(page + 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-color text-xs font-bold uppercase tracking-wider text-slate-grey hover:bg-slate-50 transition-colors rounded-sm"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-color text-xs font-bold uppercase tracking-wider text-slate-300 pointer-events-none rounded-sm">
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </nav>
            )}
          </div>
        ) : (
          <Reveal direction="up" delay={0.2}>
            <div className="border border-dashed border-border-color rounded-sm p-16 text-center bg-slate-50 text-slate-500">
              <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">No Articles Available</h3>
              <p className="text-xs text-slate-550 max-w-md mx-auto mb-6 font-sans">
                No articles are currently cataloged under the {category.name} category. Check back soon for updates.
              </p>
              <Link href="/blog" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm">
                Back to Blog
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
