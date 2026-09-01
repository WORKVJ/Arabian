import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getBlogCategories } from '@/lib/api/client';
import BlogCard from '@/components/blog/BlogCard';
import BlogCategoryNav from '@/components/blog/BlogCategoryNav';
import BlogSearch from '@/components/blog/BlogSearch';
import Reveal from '@/components/animations/Reveal';
import { defaultMetadata } from '@/lib/seo/config';
import { Metadata } from 'next';
import { stripHtml } from '@/lib/seo/stripHtml';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { BlogPost, BlogCategory, PaginatedResponse } from '@/types';

export const revalidate = 86400; // ISR for 24 hours

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);

  if (params.search) {
    return {
      title: `Search results for "${params.search}" | Arabian Gratings Saudi Arabia`,
      robots: { index: false, follow: true },
    };
  }
  if (page > 1) {
    return {
      title: `Engineering Insights & Knowledge Hub - Page ${page} | Arabian Gratings Saudi Arabia`,
      robots: { index: false, follow: true },
    };
  }
  if (params.category) {
    return {
      title: `Category: ${params.category} | Arabian Gratings Saudi Arabia`,
      description: `Browse engineering insights and articles related to ${params.category}.`,
    };
  }
  return {
    ...defaultMetadata,
    title: 'Engineering Insights & Knowledge Hub | Arabian Gratings Saudi Arabia',
    description: 'Read technical articles, installation guides, and manufacturing insights on industrial steel and FRP gratings by Arabian Gratings.',
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const category = params.category || '';

  const PAGE_SIZE = 9;

  let postsRes: PaginatedResponse<BlogPost> = { count: 0, next: null, previous: null, results: [] };
  let categoriesRes: PaginatedResponse<BlogCategory> = { count: 0, next: null, previous: null, results: [] };
  let featuredRes: PaginatedResponse<BlogPost> = { count: 0, next: null, previous: null, results: [] };

  try {
    postsRes = await getBlogPosts({
      category,
      search,
      page,
      page_size: PAGE_SIZE,
    });
  } catch (error) {
    console.warn('Blog posts not available from API. Sourcing empty/fallback state.', error);
  }

  try {
    categoriesRes = await getBlogCategories();
  } catch (error) {
    console.warn('Blog categories not available from API.', error);
  }

  if (page === 1 && !category && !search) {
    try {
      featuredRes = await getBlogPosts({
        is_featured: true,
        page_size: 1,
      });
    } catch (error) {
      console.warn('Featured post not available from API.', error);
    }
  }

  const posts = postsRes.results || [];
  const categories = categoriesRes.results || [];
  const featuredPost = featuredRes.results?.[0];

  const totalPages = Math.ceil(postsRes.count / PAGE_SIZE);
  const showPagination = totalPages > 1;

  const gridPosts = featuredPost && page === 1 && !category && !search
    ? posts.filter((p) => p.slug !== featuredPost.slug).slice(0, PAGE_SIZE - 1)
    : posts;

  const buildPageUrl = (targetPage: number) => {
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (search) query.set('search', search);
    if (targetPage > 1) query.set('page', String(targetPage));
    const qs = query.toString();
    return `/blog${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Blog Hero section */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">
              Industry Insights
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Engineering Knowledge Hub
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Technical articles, specification guides, and engineering discussions for access solutions, industrial grating types, safety standards, and project layout design.
            </p>
          </div>
        </Reveal>

        {/* Categories and Search row */}
        <Reveal direction="none" delay={0.15}>
          <div className="mb-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white border border-border-color p-6 rounded-sm shadow-sm">
            <Suspense fallback={<div className="text-xs text-slate-555 font-mono">Loading navigation...</div>}>
              <BlogCategoryNav categories={categories} />
            </Suspense>
            <Suspense fallback={<div className="text-xs text-slate-555 font-mono">Loading search...</div>}>
              <BlogSearch />
            </Suspense>
          </div>
        </Reveal>

        {/* Search status summary */}
        {search && (
          <Reveal direction="up" delay={0.1}>
            <div className="mb-8 p-4 bg-slate-50 border border-border-color rounded-sm flex items-center justify-between text-xs text-slate-600 font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Search className="w-4 h-4 text-accent" />
                Found {postsRes.count} results for search term &quot;<strong>{search}</strong>&quot;
              </span>
              <Link href="/blog" className="text-accent font-bold uppercase tracking-wider font-display hover:text-accent-hover text-xs">
                Clear search
              </Link>
            </div>
          </Reveal>
        )}

        {/* Featured Post Card (Page 1, no filters) */}
        {featuredPost && page === 1 && !category && !search && (
          <Reveal direction="up" delay={0.2}>
            <div className="mb-12">
              <article className="group grid grid-cols-1 lg:grid-cols-12 border border-border-color bg-white overflow-hidden rounded-sm hover:border-accent transition-colors">
                <div className="relative lg:col-span-7 aspect-[16/9] lg:aspect-auto min-h-[300px] bg-slate-105">
                  {featuredPost.featured_image ? (
                    <Image
                      src={featuredPost.featured_image.file}
                      alt={featuredPost.featured_image.alt_text || featuredPost.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <span className="text-[10px] text-slate-400 font-mono">No cover image</span>
                    </div>
                  )}
                </div>
                <div className="p-8 lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-accent text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                        Featured
                      </span>
                      {featuredPost.category && (
                        <span className="text-slate-400 text-[10px] font-mono font-bold uppercase">
                          {featuredPost.category.name}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-wide font-display leading-tight">
                      <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      {stripHtml(featuredPost.excerpt, 180)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-border-color pt-4">
                    <span className="text-[10px] text-slate-450 font-mono">
                      {featuredPost.published_at && (
                        <time dateTime={featuredPost.published_at}>
                          {new Date(featuredPost.published_at).toLocaleDateString('en-AE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                    </span>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors"
                    >
                      Read Article <ChevronRight className="w-4 h-4 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </Reveal>
        )}

        {/* Blog Post Grid */}
        {gridPosts.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post: BlogPost, idx: number) => (
                <BlogCard key={post.id} post={post} index={idx} headingLevel="h3" />
              ))}
            </div>

            {/* Pagination Controls */}
            {showPagination && (
              <nav aria-label="Blog pagination" className="mt-12 flex justify-center items-center gap-4">
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
          /* Empty States */
          <Reveal direction="up" delay={0.2}>
            <div className="border border-dashed border-border-color rounded-sm p-16 text-center bg-slate-50 text-slate-500">
              <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">
                {search ? 'No Articles Match Your Search' : 'No Insights Published Yet'}
              </h3>
              <p className="text-xs text-slate-550 max-w-md mx-auto mb-6">
                {search
                  ? 'We could not find any articles matching your search criteria. Please try a different query or clear the filter.'
                  : 'Our knowledge hub is currently being compiled. New technical articles and engineering guides will be published shortly.'}
              </p>
              {search ? (
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm"
                >
                  Clear Search
                </Link>
              ) : (
                  <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm">
                    Contact Us
                  </Link>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
