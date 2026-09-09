import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/animations/Reveal';
import ProjectFilterPanel from '@/components/projects/ProjectFilterPanel';
import { getProjects, getIndustries, getProducts } from '@/lib/api/client';
import { Project, Industry, ProductListItem, PaginatedResponse } from '@/types';
import { ChevronRight, MapPin, Calendar } from 'lucide-react';
import { defaultMetadata } from '@/lib/seo/config';
import { Metadata } from 'next';
import { stripHtml } from '@/lib/seo/stripHtml';

export const dynamic = 'force-dynamic';

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
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-10">
            <span className="text-amber-600 font-mono font-bold tracking-widest text-[11px] uppercase block mb-2.5">
              Portfolio & Engineering Case Studies
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Featured Installations
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore Arabian Gratings installations across major industrial, oil & gas, marine, and municipal infrastructure projects in Saudi Arabia and the GCC.
            </p>
          </div>
        </Reveal>

        {/* Filter Panel */}
        {(industries.length > 0 || products.length > 0) && (
          <Reveal direction="none" delay={0.15}>
            <div className="mb-10 bg-white border border-slate-200/90 p-5 sm:p-6 rounded-2xl shadow-xs">
              <Suspense fallback={<div className="text-xs text-slate-400 font-mono">Loading filters...</div>}>
                <ProjectFilterPanel industries={industries} products={products} />
              </Suspense>
            </div>
          </Reveal>
        )}

        {/* Project Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((project: Project, idx: number) => (
              <Reveal key={project.id} direction="up" delay={idx * 0.05}>
                <article className="group bg-white border border-slate-200/90 hover:border-amber-500/60 rounded-2xl flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Featured Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {project.featured_image ? (
                      <Image
                        src={project.featured_image.file}
                        alt={project.featured_image.alt_text || project.title}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-700 group-hover:scale-108"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <span className="text-xs text-slate-400 font-medium">Arabian Gratings Installation</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Location Badge */}
                    {project.location && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-sm">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{project.location}</span>
                      </div>
                    )}

                    {/* Sector Badge */}
                    {project.associated_industries?.[0] && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {project.associated_industries[0].name}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-2.5 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                        {project.title}
                      </h2>

                      {project.description && (
                        <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                          {stripHtml(project.description, 130)}
                        </p>
                      )}

                      {/* Products used chips */}
                      {project.products_used && project.products_used.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.products_used.slice(0, 3).map((prod) => (
                            <span
                              key={prod.id}
                              className="text-[10px] font-medium px-2.5 py-1 border border-slate-200 text-slate-600 bg-slate-50 rounded-lg"
                            >
                              {prod.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        {project.project_date && (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            {project.project_date}
                          </>
                        )}
                      </span>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 transition group/link"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
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
