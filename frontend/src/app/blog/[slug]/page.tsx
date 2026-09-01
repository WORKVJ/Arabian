import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPost } from '@/lib/api/client';
import BlogContentRenderer from '@/components/blog/BlogContentRenderer';
import RelatedArticles from '@/components/blog/RelatedArticles';
import Reveal from '@/components/animations/Reveal';
import { generatePageMetadata } from '@/lib/seo/config';
import { stripHtml } from '@/lib/seo/stripHtml';
import { Metadata } from 'next';
import { ChevronRight, ArrowLeft, User, Calendar } from 'lucide-react';
import { Industry, BlogPost } from '@/types';

export const revalidate = 86400; // 24 hours ISR

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogPost(slug);
    return generatePageMetadata(post, {
      title: `${post.title} | Arabian Gratings Saudi Arabia`,
      description: stripHtml(post.excerpt || post.content),
      path: `/blog/${post.slug}`,
      ogImageFallback: post.featured_image?.file || undefined,
    });
  } catch {
    return { title: 'Article | Arabian Gratings Saudi Arabia' };
  }
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  let post: BlogPost | null = null;

  try {
    post = await getBlogPost(slug);
  } catch {
    notFound();
  }

  // Double check publish status
  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = post.canonical_url || `${SITE_URL}/blog/${post.slug}`;

  // Date formatting
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-AE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      ...(post.category
        ? [{ '@type': 'ListItem', position: 3, name: post.category.name, item: `${SITE_URL}/blog/category/${post.category.slug}` }]
        : []),
      { '@type': 'ListItem', position: post.category ? 4 : 3, name: post.title, item: canonicalUrl },
    ],
  };

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: stripHtml(post.excerpt || post.content, 160),
    image: post.featured_image?.file || `${SITE_URL}/og-fallback.png`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Arabian Gratings Engineering Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Arabian Gratings Saudi Arabia',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation & Breadcrumbs */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-grey">
          <Link href="/blog" className="inline-flex items-center hover:text-accent transition-colors font-display uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Knowledge Hub
          </Link>
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
            {post.category && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-350" />
                <Link href={`/blog/category/${post.category.slug}`} className="hover:text-accent transition-colors">
                  {post.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <span className="text-foreground font-semibold line-clamp-1">{post.title}</span>
          </nav>
        </div>

        {/* Article Title & Meta */}
        <div className="mb-12">
          <Reveal direction="up" delay={0.1}>
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono font-bold mb-4">
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="bg-accent/10 text-accent uppercase tracking-wider px-2.5 py-1 rounded-sm hover:bg-accent/20 transition-colors"
                >
                  {post.category.name}
                </Link>
              )}
              {publishedDate && (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.published_at || undefined}>{publishedDate}</time>
                </span>
              )}
              {post.author?.name && (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <User className="w-3.5 h-3.5" />
                  {post.author.name}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-foreground uppercase mb-6 leading-tight">
              {post.title}
            </h1>
          </Reveal>

          {/* Featured Image */}
          {post.featured_image && (
            <Reveal direction="none" delay={0.2}>
              <div className="relative w-full aspect-[21/9] overflow-hidden rounded-sm border border-border-color bg-slate-105">
                <Image
                  src={post.featured_image.file}
                  alt={post.featured_image.alt_text || post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            </Reveal>
          )}
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Main Article Content */}
          <main className="lg:col-span-8">
            <Reveal direction="up" delay={0.15}>
              <article className="prose max-w-none prose-slate">
                <BlogContentRenderer
                  content={post.content}
                  contentBlocks={post.content_blocks as Parameters<typeof BlogContentRenderer>[0]['contentBlocks']}
                />
              </article>
            </Reveal>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Related Products */}
            {post.related_products && post.related_products.length > 0 && (
              <Reveal direction="right" delay={0.2}>
                <div className="bg-white border border-border-color p-6 rounded-sm shadow-sm">
                  <h3 className="font-display font-bold text-foreground text-xs uppercase tracking-widest mb-4 border-b border-border-color pb-2">
                    Related Products
                  </h3>
                  <ul className="space-y-3 font-display text-xs font-bold uppercase tracking-wider">
                    {post.related_products.map((prod) => (
                      <li key={prod.id} className="flex items-center justify-between">
                        <Link href={`/products/${prod.slug}`} className="text-slate-grey hover:text-accent transition-colors">
                          {prod.name}
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {/* Related Industries */}
            {post.related_industries && post.related_industries.length > 0 && (
              <Reveal direction="right" delay={0.25}>
                <div className="bg-white border border-border-color p-6 rounded-sm shadow-sm">
                  <h3 className="font-display font-bold text-foreground text-xs uppercase tracking-widest mb-4 border-b border-border-color pb-2">
                    Sectors Served
                  </h3>
                  <ul className="space-y-3 font-display text-xs font-bold uppercase tracking-wider">
                    {post.related_industries.map((ind: Industry) => (
                      <li key={ind.id} className="flex items-center justify-between">
                        <Link href={`/industries/${ind.slug}`} className="text-slate-grey hover:text-accent transition-colors">
                          {ind.name}
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {/* General CTA */}
            <Reveal direction="right" delay={0.3}>
              <div className="bg-charcoal text-white p-6 rounded-sm border border-slate-800 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
                <div className="relative z-10 space-y-4">
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest text-slate-350">
                    Engineering Solutions
                  </h3>
                  <p className="text-xs text-slate-450 leading-relaxed font-sans">
                    Speak directly with an engineer for spacing, span calculations, and coating recommendations.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </Reveal>

          </aside>
        </div>

        {/* Related Articles list */}
        {post.category && (
          <RelatedArticles
            currentPostSlug={post.slug}
            categorySlug={post.category.slug}
            explicitRelatedPosts={post.related_posts}
          />
        )}

      </div>
    </div>
  );
}
