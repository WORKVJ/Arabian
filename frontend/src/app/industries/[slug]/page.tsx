import { getIndustry, getBlogPosts } from '@/lib/api/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import BlogCard from '@/components/blog/BlogCard';
import { generatePageMetadata } from '@/lib/seo/config';
import { stripHtml } from '@/lib/seo/stripHtml';
import { Metadata } from 'next';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Industry, BlogPost } from '@/types';

export const revalidate = 86400;

export async function generateStaticParams() {
  return [
    { slug: 'oil-gas' },
    { slug: 'marine-offshore' },
    { slug: 'water-treatment' },
    { slug: 'infrastructure' },
  ];
}

interface IndustryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: IndustryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const industry = await getIndustry(slug);
    return generatePageMetadata(industry, {
      title: `${industry.name} | Arabian Gratings Saudi Arabia`,
      description: stripHtml(industry.short_description),
      path: `/industries/${industry.slug}`,
    });
  } catch {
    return { title: 'Industry | Arabian Gratings Saudi Arabia' };
  }
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const { slug } = await params;
  let industry: Industry | null = null;
  try {
    industry = await getIndustry(slug);
  } catch {
    notFound();
  }

  if (!industry || !industry.is_active) notFound();

  let relatedArticles: BlogPost[] = [];
  try {
    const articlesRes = await getBlogPosts({ industry: industry.slug, page_size: 3 });
    relatedArticles = articlesRes.results || [];
  } catch (error) {
    console.warn('Failed to fetch related blog posts for industry detail.', error);
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Industries', item: `${SITE_URL}/industries` },
      { '@type': 'ListItem', position: 3, name: industry.name, item: `${SITE_URL}/industries/${industry.slug}` },
    ]
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-grey">
          <Link href="/industries" className="inline-flex items-center hover:text-accent transition-colors font-display uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Industries
          </Link>
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <Link href="/industries" className="hover:text-accent transition-colors">Industries</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <span className="text-foreground font-semibold">{industry.name}</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <Reveal direction="left" delay={0.1}>
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">Industry Sector</span>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              {industry.name}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              {industry.short_description}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent font-display text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm shadow-sm"
            >
              Contact Us
            </Link>
          </Reveal>
        </div>

        {/* Description */}
        {industry.description && (
          <section className="mb-16 border-t border-border-color pt-12">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-4">
                Sector Overview
              </h2>
              <div className="text-sm text-slate-500 leading-relaxed max-w-4xl space-y-4 font-sans">
                <p>{industry.description}</p>
                {industry.applications && (
                  <div className="mt-6 border-t border-border-color pt-6">
                    <h3 className="font-display font-bold text-foreground text-xs uppercase tracking-wider mb-2">Common Applications</h3>
                    <p>{industry.applications}</p>
                  </div>
                )}
              </div>
            </Reveal>
          </section>
        )}

        {/* Related Products */}
        {industry.related_products && industry.related_products.length > 0 && (
          <section className="mb-16 border-t border-border-color pt-12">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                Relevant Product Ranges
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industry.related_products.map((prod, idx: number) => (
                <Reveal key={prod.id} direction="up" delay={idx * 0.05}>
                  <div className="border border-border-color p-5 rounded-sm bg-white flex flex-col justify-between h-full hover:border-accent transition-colors">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block mb-1">
                        {prod.category_name}
                      </span>
                      <h3 className="text-sm font-bold text-foreground mb-2 font-display uppercase tracking-wide">{prod.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{prod.short_description}</p>
                    </div>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors"
                    >
                      View Specifications <ChevronRight className="w-4 h-4 ml-0.5" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* View Projects link */}
        <Reveal direction="none" delay={0.15}>
          <div className="mb-8 border border-border-color rounded-sm p-4 bg-slate-50 inline-flex items-center justify-between w-full">
            <span className="text-xs font-semibold text-slate-grey">Project installations in this sector</span>
            <Link
              href={`/projects?industry=${industry.slug}`}
              className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors"
            >
              View Projects <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
        </Reveal>

        {/* Related Blog Articles */}
        {relatedArticles.length > 0 && (
          <section className="mb-16 border-t border-border-color pt-12">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                Technical Insights & Sector Guides
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((post, idx) => (
                <BlogCard key={post.id} post={post} index={idx} headingLevel="h3" />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Reveal direction="none" delay={0.2}>
          <div className="premium-card-dark p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-display font-black uppercase tracking-wide">Specify the Right Grating for Your Site</h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                Share your project requirements, drawing dimensions, or load specifications for a tailored quotation.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
