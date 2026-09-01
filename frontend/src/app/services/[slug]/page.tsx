import { getService } from '@/lib/api/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import { generatePageMetadata } from '@/lib/seo/config';
import { stripHtml } from '@/lib/seo/stripHtml';
import { Metadata } from 'next';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export const revalidate = 86400;

export async function generateStaticParams() {
  return [
    { slug: 'custom-fabrication' },
    { slug: 'technical-consultation' },
    { slug: 'site-survey-installation' },
  ];
}

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const service = await getService(slug);
    return generatePageMetadata(service, {
      title: `${service.name} | Arabian Gratings Saudi Arabia`,
      description: stripHtml(service.description),
      path: `/services/${service.slug}`,
    });
  } catch {
    return { title: 'Service | Arabian Gratings Saudi Arabia' };
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  let service: Awaited<ReturnType<typeof getService>> | null = null;

  try {
    service = await getService(slug);
  } catch {
    notFound();
  }

  if (!service || !service.is_active) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: service.name, item: `${SITE_URL}/services/${service.slug}` },
    ]
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-grey">
          <Link href="/services" className="inline-flex items-center hover:text-accent transition-colors font-display uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Services
          </Link>
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <span className="text-foreground font-semibold">{service.name}</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <Reveal direction="left" delay={0.1}>
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">Service Division</span>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              {service.name}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              {service.description}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent font-display text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm shadow-sm"
            >
              Discuss Service Options
            </Link>
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal direction="none" delay={0.3}>
          <div className="premium-card-dark p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-display font-black uppercase tracking-wide">Ready to Work With Us?</h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed font-sans">
                Contact our team with your project scope and requirements for a dedicated response from our engineering support team.
              </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm"
                >
                  Contact Us
                </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
