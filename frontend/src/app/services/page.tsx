import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import { getServices } from '@/lib/api/client';
import { Service, PaginatedResponse } from '@/types';
import { ChevronRight } from 'lucide-react';
import { defaultMetadata } from '@/lib/seo/config';
import { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Services | Arabian Gratings Saudi Arabia',
  description: 'Arabian Gratings offers a range of industrial services including custom fabrication, layout coordination, technical drawing support, and project delivery assistance.'
};

export default async function ServicesPage() {
  let servicesRes: PaginatedResponse<Service> = { count: 0, next: null, previous: null, results: [] };

  try {
    servicesRes = await getServices();
  } catch {
    console.warn('Services not available from backend. Using empty state.');
  }

  const services = servicesRes.results;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-16">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">What We Do</span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Our Services
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Beyond product supply, Arabian Gratings supports projects from specification through delivery. Our team assists with layout coordination, custom fabrication requirements, and technical documentation.
            </p>
          </div>
        </Reveal>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: Service, idx: number) => (
              <Reveal key={service.id} direction="up" delay={idx * 0.05}>
                <div className="premium-card-light p-6 h-full flex flex-col justify-between bg-white border border-border-color rounded-sm hover:border-accent transition-colors">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-3 font-display uppercase tracking-wide">{service.name}</h2>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 mb-6">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Learn More <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border-color rounded-sm p-16 text-center bg-slate-50 text-slate-500">
            <span className="text-[10px] block mb-2 font-mono text-slate-400">Database Status: Synced</span>
            <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">No Services Published</h3>
            <p className="text-xs text-slate-550 max-w-md mx-auto mb-6">
              No active services are currently published. Services will appear dynamically once added via the content management system.
            </p>
            <div className="flex justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm">
                Contact Our Team
              </Link>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20">
          <Reveal direction="none" delay={0.2}>
            <div className="premium-card-dark p-8 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-display font-black uppercase tracking-wide">Have a Project in Mind?</h3>
                <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Our team is available to discuss drawing requirements, project timelines, and custom fabrication needs.
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
    </div>
  );
}
