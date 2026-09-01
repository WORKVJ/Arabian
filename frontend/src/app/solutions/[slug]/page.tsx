import { getSolution } from '@/lib/api/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import { generatePageMetadata } from '@/lib/seo/config';
import { stripHtml } from '@/lib/seo/stripHtml';
import { Metadata } from 'next';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Industry } from '@/types';

export const revalidate = 86400;

export async function generateStaticParams() {
  return [
    { slug: 'industrial-floor-grating' },
    { slug: 'drainage-trench-covers' },
    { slug: 'manhole-access-safety' },
  ];
}

interface SolutionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SolutionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const solution = await getSolution(slug);
    return generatePageMetadata(solution, {
      title: `${solution.name} | Arabian Gratings Saudi Arabia`,
      description: stripHtml(solution.description),
      path: `/solutions/${solution.slug}`,
    });
  } catch {
    return { title: 'Solution | Arabian Gratings Saudi Arabia' };
  }
}

export default async function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const { slug } = await params;
  let solution: Awaited<ReturnType<typeof getSolution>> | null = null;

  try {
    solution = await getSolution(slug);
  } catch {
    notFound();
  }

  if (!solution || !solution.is_active) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${SITE_URL}/solutions` },
      { '@type': 'ListItem', position: 3, name: solution.name, item: `${SITE_URL}/solutions/${solution.slug}` },
    ]
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-grey">
          <Link href="/solutions" className="inline-flex items-center hover:text-accent transition-colors font-display uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Solutions
          </Link>
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <Link href="/solutions" className="hover:text-accent transition-colors">Solutions</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <span className="text-foreground font-semibold">{solution.name}</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-8">
            <Reveal direction="left" delay={0.1}>
              <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">Engineering Solution</span>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
                {solution.name}
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                {solution.description}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent font-display text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm shadow-sm"
              >
                Contact Us
              </Link>
            </Reveal>
          </div>

          {/* Industries context panel */}
          {solution.related_industries && solution.related_industries.length > 0 && (
            <div className="lg:col-span-4 bg-charcoal text-white p-6 rounded-sm border border-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
              <Reveal direction="right" delay={0.2}>
                <h3 className="font-display font-bold text-xs uppercase tracking-widest mb-4 text-slate-350">Applicable Sectors</h3>
                <ul className="space-y-2.5">
                  {solution.related_industries.map((ind: Industry) => (
                    <li key={ind.id}>
                      <Link
                        href={`/industries/${ind.slug}`}
                        className="text-xs text-slate-300 hover:text-accent transition-colors inline-flex items-center font-display uppercase font-bold tracking-wider"
                      >
                        <ChevronRight className="w-3.5 h-3.5 mr-1 text-accent" />
                        {ind.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          )}
        </div>

        {/* Related Products */}
        {solution.related_products && solution.related_products.length > 0 && (
          <section className="mb-16 border-t border-border-color pt-12">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                Associated Product Range
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solution.related_products.map((prod, idx) => (
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

        {/* CTA */}
        <Reveal direction="none" delay={0.2}>
          <div className="premium-card-dark p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-display font-black uppercase tracking-wide">Ready to Specify This Solution?</h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed font-sans">
                Share your project scope, site drawings, or dimensional requirements for a tailored engineering quotation.
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
