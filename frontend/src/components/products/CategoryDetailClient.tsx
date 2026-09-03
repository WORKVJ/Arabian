'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
import { ProductCategory, ProductListItem } from '@/types';
import { getImageUrl } from '@/lib/api/client';
import Reveal from '@/components/animations/Reveal';

interface CategoryDetailClientProps {
  category: ProductCategory;
  products: ProductListItem[];
}

export default function CategoryDetailClient({ category, products }: CategoryDetailClientProps) {
  const imageUrl = getImageUrl(category.image?.file);
  const imageAlt = category.image?.alt_text || `${category.name} Supplier Saudi Arabia — Arabian Gratings`;

  // Extracted lists for rich SEO block content matching category
  const technicalAdvantages = [
    {
      title: 'Certified Compliance',
      desc: 'All structural components undergo rigorous deflection & span stress tests matching BS, EN, and ASTM standards.'
    },
    {
      title: 'Optimized Span Deflections',
      desc: 'Manufactured precisely to match load criteria spanning pedestrian corridors up to heavy vehicular access layouts.'
    },
    {
      title: 'Weatherproof Galvanization',
      desc: 'Finished with chemical-grade hot-dip galvanization matching BS EN ISO 1461 to withstand extreme GCC humidity.'
    }
  ];

  const applications = [
    'Industrial & Oil Refinery Access Walks',
    'Offshore Seawater Intake Splash Platforms',
    'Wastewater & Sewerage Utility Trenches',
    'Suspended Facades & Ventilation Screens',
    'Subway Pavement Warning & Pedestrian Stairs'
  ];

  const industries = [
    'Oil & Gas / Petrochemical Refineries',
    'Water Desalination & Sewerage Treatment',
    'Civil Infrastructure & Commercial Highways',
    'Marine Vessels & Offshore Drill Rigs'
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-28 pb-16 border-b border-[#D9DDE1] relative overflow-hidden bg-[#F7F8F9]">
        <div className="absolute inset-0 opacity-[0.03] tech-grid-overlay" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Intro */}
            <div className="lg:col-span-7">
              <Reveal direction="left" delay={0.1}>
                <span className="text-[14px] font-display font-black text-[#E8612C] tracking-[0.3em] uppercase block mb-3">
                  Industrial Supply // Category
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-black uppercase leading-tight tracking-tight mb-5">
                  {category.name} <span className="text-black">Supplier in Saudi Arabia</span>
                </h1>
                <p className="text-sm text-black max-w-2xl leading-relaxed mb-6 font-sans">
                  {category.short_description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#E8612C] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#CF4D1B] transition-colors shadow-sm"
                  >
                    Contact Us <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right: Category Hero Image */}
            <div className="lg:col-span-5 relative aspect-[4/3] w-full bg-[#E0E1E3] overflow-hidden border border-[#D9DDE1]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#F0F1F3]">
                  <span className="text-[10px] text-slate-400 font-mono">No Image Available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SEO rich overview copy */}
      <section className="py-16 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#D9DDE1]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <span className="text-[9px] font-mono text-[#E8612C] tracking-widest uppercase block mb-2">01 // INTRODUCTION</span>
            <h2 className="text-xl font-display font-black text-[#111318] uppercase tracking-wide">
              Engineering Excellence for GCC Sites
            </h2>
          </div>
          <div className="lg:col-span-8 text-xs text-slate-500 leading-relaxed font-sans space-y-4">
            <p>
              {category.description || `Arabian Gratings delivers dynamic access solutions designed to operate under the high thermal cycles, chemical environments, and salt-laden humidity typical of Saudi coastal projects in Jeddah, Dammam, and the GCC region.`}
            </p>
            <p>
              Our complete systems are fabricated with strict quality control lines. Every layout corresponds to the structural safety margins requested by regional municipal planning councils and utility developers.
            </p>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-[10px] font-mono font-bold text-[#E8612C] tracking-[0.25em] uppercase block mb-2">
            Available Product Catalogue
          </span>
          <h2 className="text-3xl font-display font-black text-[#111318] uppercase tracking-tight">
            Explore {category.name} Specifications
          </h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod) => {
              const prodImg = getImageUrl(prod.primary_image?.media?.file);
              return (
                <div
                  key={prod.id}
                  className="flex flex-col bg-white border border-[#D9DDE1] hover:border-[#E8612C] transition-colors rounded-sm overflow-hidden h-full shadow-sm"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    {prodImg ? (
                      <Image
                        src={prodImg}
                        alt={prod.primary_image?.alt_text || prod.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-150">
                        <span className="text-[9px] text-slate-400 font-mono">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-[#E8612C] uppercase tracking-wider block mb-1">
                        Code: {prod.product_code}
                      </span>
                      <h3 className="text-base font-bold text-[#111318] font-display uppercase tracking-wide mb-3">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-6 font-sans">
                        {prod.short_description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-[#D9DDE1]">
                      <Link
                        href={`/products/${prod.slug}`}
                        className="inline-flex items-center justify-between text-xs font-bold text-[#E8612C] hover:text-[#CF4D1B] uppercase font-display tracking-wider transition-colors"
                      >
                        View Technical dossier <ChevronRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-between text-xs font-bold text-slate-650 hover:text-[#111318] uppercase font-display tracking-wider transition-colors mt-1"
                      >
                        Contact Us <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-[#D9DDE1] rounded-sm p-16 text-center bg-slate-50 text-slate-550">
            <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">No Products Published</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We are currently loading our specific product lines under this category category. Contact our sales desk directly for catalog downloads.
            </p>
          </div>
        )}
      </section>

      {/* Technical Advantages */}
      <section className="py-20 bg-[#F7F8F9] border-t border-b border-[#D9DDE1]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {technicalAdvantages.map((adv, idx) => (
              <div key={idx} className="border border-[#D9DDE1] p-6 bg-white flex flex-col justify-between h-full hover:border-[#E8612C] transition-colors rounded-sm">
                <div>
                  <ShieldCheck className="w-6 h-6 text-[#E8612C] mb-4" />
                  <h3 className="text-sm font-display font-black uppercase text-[#111318] mb-2">{adv.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications & Industries double-column */}
      <section className="py-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Applications */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-[#D9DDE1] pb-3 mb-6 font-display">
              Typical System Applications
            </h3>
            <ul className="space-y-3">
              {applications.map((app, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 font-sans leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-[#E8612C] rounded-full shrink-0 mt-1.5" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries served */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-[#D9DDE1] pb-3 mb-6 font-display">
              Sectors Served Across Saudi & GCC
            </h3>
            <ul className="space-y-3">
              {industries.map((ind, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 font-sans leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0 mt-1.5" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom CTA block */}
      <section className="bg-[#111318] py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-[9px] font-mono text-[#E8612C] tracking-[0.3em] uppercase block">
            Partner with Arabian Gratings
          </span>
          <h2 className="text-3xl font-display font-black uppercase leading-tight">
            Consult Our Engineering Desk
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed font-sans">
            Get structural drawings reviewed, load specifications calculated, or request bulk pricing for local and export GCC tenders.
          </p>
          <div className="flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#E8612C] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#CF4D1B] transition-colors"
            >
              Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
