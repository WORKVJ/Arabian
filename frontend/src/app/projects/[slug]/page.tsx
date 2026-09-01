import { getProject, getProjects, getBlogPosts } from '@/lib/api/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/animations/Reveal';
import BlogCard from '@/components/blog/BlogCard';
import ProjectGallery from '@/components/projects/ProjectGallery';
import { generatePageMetadata } from '@/lib/seo/config';
import { stripHtml } from '@/lib/seo/stripHtml';
import { Metadata } from 'next';
import { ChevronRight, ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { Industry, Project, BlogPost } from '@/types';

export const revalidate = 86400;

export async function generateStaticParams() {
  return [
    { slug: 'jazan-refinery-platform-gratings' },
    { slug: 'swcc-desalination-grp-walkways' },
    { slug: 'king-abdulaziz-port-marine-gratings' },
  ];
}

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProject(slug);
    return generatePageMetadata(project, {
      title: `${project.title} | Arabian Gratings Saudi Arabia`,
      description: stripHtml(project.description),
      path: `/projects/${project.slug}`,
      ogImageFallback: project.featured_image?.file || undefined,
    });
  } catch {
    return { title: 'Project | Arabian Gratings Saudi Arabia' };
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  let project: Project | null = null;

  try {
    project = await getProject(slug);
  } catch {
    notFound();
  }

  if (!project || !project.is_active) notFound();

  let relatedArticles: BlogPost[] = [];
  if (project.associated_industries && project.associated_industries.length > 0) {
    try {
      const articlesRes = await getBlogPosts({ industry: project.associated_industries[0].slug, page_size: 3 });
      relatedArticles = articlesRes.results || [];
    } catch (error) {
      console.warn('Failed to fetch related blog posts for project detail.', error);
    }
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let relatedProjects: Project[] = [];
  if (project.associated_industries && project.associated_industries.length > 0) {
    try {
      const relRes = await getProjects({ industry: project.associated_industries[0].slug });
      relatedProjects = (relRes.results || [])
        .filter((p: Project) => p.slug !== project!.slug)
        .slice(0, 3);
    } catch {
      // Silently omit related projects if unavailable
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
      { '@type': 'ListItem', position: 3, name: project.title, item: `${SITE_URL}/projects/${project.slug}` },
    ],
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-grey">
          <Link href="/projects" className="inline-flex items-center hover:text-accent transition-colors font-display uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Projects
          </Link>
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <Link href="/projects" className="hover:text-accent transition-colors">Projects</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <span className="text-foreground font-semibold">{project.title}</span>
          </nav>
        </div>

        {/* Project Hero */}
        <div className="mb-12">
          <Reveal direction="up" delay={0.1}>
            <div className="mb-4 flex flex-wrap items-center gap-4 text-[10px] font-mono font-bold">
              {project.associated_industries?.[0] && (
                <span className="text-accent uppercase">
                  {project.associated_industries[0].name}
                </span>
              )}
              {project.location && (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3" /> {project.location}
                </span>
              )}
              {project.project_date && (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3" /> {project.project_date}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-foreground uppercase mb-6 leading-tight">
              {project.title}
            </h1>
          </Reveal>

          {/* Featured Image */}
          {project.featured_image && (
            <Reveal direction="none" delay={0.2}>
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm border border-border-color bg-slate-105">
                <Image
                  src={project.featured_image.file}
                  alt={project.featured_image.alt_text || project.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            </Reveal>
          )}
        </div>

        {/* Overview + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

          {/* Overview */}
          <div className="lg:col-span-8">
            {project.description && (
              <section className="mb-12">
                <Reveal direction="up" delay={0.1}>
                  <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-4">
                    Project Overview
                  </h2>
                  <div className="text-sm text-slate-550 leading-relaxed space-y-3 font-sans">
                    <p>{project.description}</p>
                  </div>
                </Reveal>
              </section>
            )}

            {/* Products Used */}
            {project.products_used && project.products_used.length > 0 && (
              <section className="mb-12 border-t border-border-color pt-10">
                <Reveal direction="up" delay={0.1}>
                  <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                    Products Installed
                  </h2>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.products_used.map((prod, idx: number) => (
                    <Reveal key={prod.id} direction="up" delay={idx * 0.05}>
                      <div className="border border-border-color p-4 rounded-sm bg-white flex flex-col justify-between hover:border-accent transition-colors">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wider block mb-1">
                            {prod.category_name}
                          </span>
                          <h3 className="text-sm font-bold text-foreground mb-1 font-display uppercase tracking-wide">{prod.name}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{prod.short_description}</p>
                        </div>
                        <Link
                          href={`/products/${prod.slug}`}
                          className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center mt-3 uppercase tracking-wider font-display transition-colors"
                        >
                          View Product <ChevronRight className="w-4 h-4 ml-0.5" />
                        </Link>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar: Industry + Quote */}
          <aside className="lg:col-span-4 space-y-6">
            {project.associated_industries && project.associated_industries.length > 0 && (
              <Reveal direction="right" delay={0.2}>
                <div className="bg-charcoal text-white p-6 rounded-sm border border-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest mb-4 text-slate-350">
                    Industry Sector
                  </h3>
                  <ul className="space-y-2">
                    {project.associated_industries.map((ind: Industry) => (
                      <li key={ind.id}>
                        <Link
                          href={`/industries/${ind.slug}`}
                          className="text-xs text-slate-300 hover:text-accent transition-colors inline-flex items-center uppercase font-bold tracking-wider font-display"
                        >
                          <ChevronRight className="w-3.5 h-3.5 mr-1 text-accent" />
                          {ind.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal direction="right" delay={0.3}>
              <div className="border border-border-color p-6 rounded-sm bg-white text-center">
                <h3 className="font-display font-bold text-foreground text-sm uppercase tracking-wider mb-2">
                  Planning a Similar Project?
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">
                  Share your site layout and load requirements for a tailored quotation.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent font-display text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm"
                >
                  Contact Us
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>

        {/* Gallery */}
        {project.project_images && project.project_images.length > 0 && (
          <section className="mb-16 border-t border-border-color pt-12">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                Project Gallery
              </h2>
            </Reveal>
            <ProjectGallery
              images={project.project_images}
              projectTitle={project.title}
            />
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="mb-16 border-t border-border-color pt-12">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                Related Case Studies
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rel: Project, idx: number) => (
                <Reveal key={rel.id} direction="up" delay={idx * 0.05}>
                  <article className="group border border-border-color bg-white overflow-hidden rounded-sm hover:border-accent transition-colors">
                    {rel.featured_image && (
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-105">
                        <Image
                          src={rel.featured_image.file}
                          alt={rel.featured_image.alt_text || rel.title}
                          fill
                          loading="lazy"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-foreground mb-1 font-display uppercase tracking-wide">{rel.title}</h3>
                      {rel.location && (
                        <p className="text-xs text-slate-500 mb-3 font-mono">{rel.location}</p>
                      )}
                      <Link
                        href={`/projects/${rel.slug}`}
                        className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors"
                      >
                        View Project <ChevronRight className="w-4 h-4 ml-0.5" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Related Blog Articles */}
        {relatedArticles.length > 0 && (
          <section className="mb-16 border-t border-border-color pt-12">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                Technical Insights & Engineering Guides
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((post, idx) => (
                <BlogCard key={post.id} post={post} index={idx} headingLevel="h3" />
              ))}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <Reveal direction="none" delay={0.2}>
          <div className="premium-card-dark p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-display font-black uppercase tracking-wide">Planning a Similar Installation?</h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed font-sans">
                Our team assists with specification, layout coordination, and technical documentation for industrial grating projects.
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
