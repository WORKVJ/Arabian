import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import { getIndustries } from '@/lib/api/client';
import { Industry, PaginatedResponse } from '@/types';
import {
  ChevronRight,
  Fuel,
  Anchor,
  Droplet,
  Zap,
  Building2,
  Mountain,
  FlaskConical,
  Factory,
  type LucideIcon,
} from 'lucide-react';
import { defaultMetadata } from '@/lib/seo/config';
import { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Industries Served | Arabian Gratings Saudi Arabia',
  description: 'Arabian Gratings supplies industrial grating solutions across Oil & Gas, Water Treatment, Power, Infrastructure, and other demanding sectors across Saudi Arabia and GCC.'
};

/** Maps an industry name to a representative sector icon. Falls back to a generic factory icon. */
function getIndustryIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes('oil') || n.includes('gas') || n.includes('petro')) return Fuel;
  if (n.includes('marine') || n.includes('offshore') || n.includes('port')) return Anchor;
  if (n.includes('desalination') || n.includes('water')) return Droplet;
  if (n.includes('power') || n.includes('energy') || n.includes('electric')) return Zap;
  if (n.includes('infrastructure') || n.includes('municipal') || n.includes('construction')) return Building2;
  if (n.includes('mining') || n.includes('quarry') || n.includes('cement')) return Mountain;
  if (n.includes('chemical') || n.includes('food')) return FlaskConical;
  return Factory;
}

export default async function IndustriesPage() {
  let industriesRes: PaginatedResponse<Industry> = { count: 0, next: null, previous: null, results: [] };

  try {
    industriesRes = await getIndustries();
  } catch {
    console.warn('Industries not available from backend. Using empty state.');
  }

  const industries = industriesRes.results;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 pb-10 border-b border-border-color">
            <div className="max-w-3xl">
              <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">
                01 // Sectors Served
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-5 leading-tight">
                Industries Served
              </h1>
              <div className="w-12 h-[2px] bg-accent/50 mb-5" />
              <p className="text-sm text-slate-500 leading-relaxed">
                Arabian Gratings provides access flooring, walkway, and structural grating systems for a range of demanding industrial environments. Each application calls for specific material selections, load ratings, and surface characteristics.
              </p>
            </div>

            {industries.length > 0 && (
              <div className="font-mono text-right shrink-0">
                <span className="block text-foreground text-4xl sm:text-5xl font-display font-black leading-none mb-2">
                  {String(industries.length).padStart(2, '0')}
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-slate-500">
                  Active Sectors<br />Saudi &amp; GCC
                </span>
              </div>
            )}
          </div>
        </Reveal>

        {/* Industries Grid */}
        {industries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry: Industry, idx: number) => {
              const Icon = getIndustryIcon(industry.name);
              return (
                <Reveal key={industry.id} direction="up" delay={idx * 0.05}>
                  <div className="group relative premium-card-light p-7 h-full flex flex-col justify-between bg-white border border-border-color rounded-sm hover:border-accent transition-colors">
                    <span className="absolute top-6 right-6 font-mono text-[10px] text-slate-300 group-hover:text-accent/60 transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="w-12 h-12 flex items-center justify-center border border-border-color rounded-sm mb-6 text-accent group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors duration-300">
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <h2 className="text-lg font-bold text-foreground mb-3 font-display uppercase tracking-wide">{industry.name}</h2>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 mb-6">
                        {industry.short_description}
                      </p>
                    </div>
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      Explore Sector Applications
                      <ChevronRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-border-color rounded-sm p-16 text-center bg-slate-50 text-slate-500">
            <span className="text-[10px] block mb-2 font-mono text-slate-400">Database Status: Synced</span>
            <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">No Industries Registered</h3>
            <p className="text-xs text-slate-550 max-w-md mx-auto">
              No active industry sectors are currently published. Sectors will appear dynamically once added via the content management system.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20">
          <Reveal direction="none" delay={0.2}>
            <div className="premium-card-dark p-8 sm:p-12 text-center text-white relative overflow-hidden rounded-sm">
              <div className="absolute inset-0 opacity-20 tech-dot-grid pointer-events-none" />
              <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                <span className="font-mono text-accent text-[10px] uppercase tracking-widest block">
                  Don&apos;t See Your Sector?
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wide">
                  We Engineer For Every Environment
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
                  Our team can advise on material selection, load ratings, and finish for applications outside the sectors listed above.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-1.5 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm"
                  >
                    Contact Us
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </div>
  );
}
