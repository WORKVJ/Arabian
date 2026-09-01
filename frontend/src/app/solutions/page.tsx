import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import { getSolutions } from '@/lib/api/client';
import { Solution, PaginatedResponse } from '@/types';
import { ChevronRight } from 'lucide-react';
import { defaultMetadata } from '@/lib/seo/config';
import { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Engineering Solutions | Arabian Gratings Saudi Arabia',
  description: 'Explore Arabian Gratings engineering solutions for industrial access flooring, corrosion-resistant platforms, safety walkways, and structural grating systems.'
};

export default async function SolutionsPage() {
  let solutionsRes: PaginatedResponse<Solution> = { count: 0, next: null, previous: null, results: [] };

  try {
    solutionsRes = await getSolutions();
  } catch {
    console.warn('Solutions not available from backend. Using empty state.');
  }

  const solutions = solutionsRes.results;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-16">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">Engineering Solutions</span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Industrial Solutions
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              We provide engineering-led access and safety solutions tailored for complex industrial environments. Each solution addresses specific site challenges through material selection, load design, and fabrication precision.
            </p>
          </div>
        </Reveal>

        {/* Solutions Grid */}
        {solutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution: Solution, idx: number) => (
              <Reveal key={solution.id} direction="up" delay={idx * 0.05}>
                <div className="premium-card-light p-8 h-full flex flex-col justify-between bg-white border border-border-color rounded-sm hover:border-accent transition-colors">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-3 font-display uppercase tracking-wide">{solution.name}</h2>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 mb-6">
                      {solution.description}
                    </p>
                  </div>
                  <Link
                    href={`/solutions/${solution.slug}`}
                    className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Explore Solution <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border-color rounded-sm p-16 text-center bg-slate-50 text-slate-500">
            <span className="text-[10px] block mb-2 font-mono text-slate-400">Database Status: Synced</span>
            <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">No Solutions Published</h3>
            <p className="text-xs text-slate-550 max-w-md mx-auto mb-6">
              No active solutions are currently published. Solutions will appear dynamically once added via the content management system.
            </p>
            <div className="flex justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm">
                Contact Us
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
