import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/animations/Reveal';
import ProjectFilterPanel from '@/components/projects/ProjectFilterPanel';
import { getProjects, getIndustries, getProducts } from '@/lib/api/client';
import { Project, Industry, ProductListItem, PaginatedResponse } from '@/types';
import { ChevronRight } from 'lucide-react';
import { defaultMetadata } from '@/lib/seo/config';
import { Metadata } from 'next';
import { stripHtml } from '@/lib/seo/stripHtml';

export const revalidate = 86400;

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Projects & Case Studies | Arabian Gratings Saudi Arabia',
  description: 'Browse the Arabian Gratings project portfolio — engineering case studies spanning industrial grating installations, walkway systems, and access flooring solutions.'
};

interface ProjectsPageProps {
  searchParams: Promise<{ industry?: string; product?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;

  let projectsRes: PaginatedResponse<Project> = { count: 0, next: null, previous: null, results: [] };
  let industriesRes: PaginatedResponse<Industry> = { count: 0, next: null, previous: null, results: [] };
  let productsRes: PaginatedResponse<ProductListItem> = { count: 0, next: null, previous: null, results: [] };

  try {
    projectsRes = await getProjects({
      industry: params.industry,
      product: params.product,
    });
  } catch {
    console.warn('Projects not available from backend. Using empty state.');
  }

  try {
    industriesRes = await getIndustries();
  } catch {
    console.warn('Industries not available for project filters.');
  }

  try {
    productsRes = await getProducts();
  } catch {
    console.warn('Products not available for project filters.');
  }

  const projects = projectsRes.results;
  const industries = industriesRes.results;
  const products = productsRes.results;
  const isFiltered = params.industry || params.product;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">
              Projects & Case Studies
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Engineering Projects
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Documentation of selected industrial grating installations and access flooring projects. Each case study reflects the site-specific requirements, product selections, and project delivery approach of Arabian Gratings.
            </p>
          </div>
        </Reveal>

        {/* Filter Panel */}
        {(industries.length > 0 || products.length > 0) && (
          <Reveal direction="none" delay={0.15}>
            <div className="mb-10 bg-white border border-border-color p-6 rounded-sm shadow-sm">
              <Suspense fallback={<div className="text-xs text-slate-500 font-mono">Loading filters...</div>}>
                <ProjectFilterPanel industries={industries} products={products} />
              </Suspense>
            </div>
          </Reveal>
        )}

        {/* Project Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: Project, idx: number) => (
              <Reveal key={project.id} direction="up" delay={idx * 0.05}>
                <article className="group bg-white border border-border-color flex flex-col h-full overflow-hidden rounded-sm hover:border-accent transition-colors">
                  {/* Featured Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    {project.featured_image ? (
                      <Image
                        src={project.featured_image.file}
                        alt={project.featured_image.alt_text || project.title}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <span className="text-[10px] text-slate-400 font-mono">No installation image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Industry + Location row */}
                      <div className="flex flex-wrap gap-3 mb-3 text-[10px] font-mono font-bold">
                        {project.associated_industries?.[0] && (
                          <span className="text-accent uppercase">
                            {project.associated_industries[0].name}
                          </span>
                        )}
                        {project.location && (
                          <span className="text-slate-400">{project.location}</span>
                        )}
                      </div>

                      <h2 className="text-base font-bold text-foreground mb-3 leading-snug font-display uppercase tracking-wide">
                        {project.title}
                      </h2>

                      {project.description && (
                        <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                          {stripHtml(project.description, 120)}
                        </p>
                      )}

                      {/* Products used chips */}
                      {project.products_used && project.products_used.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.products_used.slice(0, 3).map((prod) => (
                            <span
                              key={prod.id}
                              className="text-[9px] font-mono px-2 py-0.5 border border-border-color text-slate-600 bg-slate-50 rounded-sm"
                            >
                              {prod.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      View Case Study <ChevronRight className="w-4 h-4 ml-0.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          /* Empty States */
          isFiltered ? (
            <Reveal direction="up" delay={0.1}>
              <div className="border border-dashed border-border-color rounded-sm p-16 text-center bg-slate-50 text-slate-500">
                <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">No Projects Found</h3>
                <p className="text-xs text-slate-550 max-w-md mx-auto mb-6">
                  No published projects match your current filter selection.
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm"
                >
                  Clear Filters
                </Link>
              </div>
            </Reveal>
          ) : (
            <Reveal direction="up" delay={0.1}>
              <div className="border border-dashed border-border-color rounded-sm p-16 text-center bg-slate-50 text-slate-500">
                <span className="text-[10px] block mb-2 font-mono text-slate-400">Database Status: Synced</span>
                <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">Project Portfolio Initialized</h3>
                <p className="text-xs text-slate-550 max-w-lg mx-auto mb-6">
                  Our project portfolio is currently being compiled. Completed project case studies will appear here once published via the content management system.
                </p>
                <div className="flex justify-center">
                  <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm">
                    Contact Us
                  </Link>
                </div>
              </div>
            </Reveal>
          )
        )}

      </div>
    </div>
  );
}
