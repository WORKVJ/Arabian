'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ProductCategory, ProductListItem } from '@/types';
import { getImageUrl } from '@/lib/api/client';

interface ProductsClientProps {
  initialProducts: ProductListItem[];
  categories: ProductCategory[];
}

// ─── Fallback images per category slug ───────────────────────────────────────
const CATEGORY_FALLBACKS: Record<string, string> = {
  'steel-gratings': '/product-steel-grating.jpg',
  'frp-grp-products': '/product-frp-grating.jpg',
  'aluminium': '/product-aluminium-grating.jpg',
  'stainless-steel-products': '/product-ss-grating.jpg',
  'manhole': '/product-manhole-cover.jpg',
  'ss-gi-grating-clamps': '/product-grating-clamp.jpg',
  'step-iron': '/product-step-iron.jpg',
  'stud-products': '/product-tactile-stud.jpg',
};

const DEFAULT_FALLBACK = '/product-steel-grating.jpg';

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({ category, index }: { category: ProductCategory; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' });

  const imageUrl =
    getImageUrl(category.image?.file) ||
    CATEGORY_FALLBACKS[category.slug] ||
    DEFAULT_FALLBACK;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.09,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative flex flex-col bg-white border border-[#D9DDE1] overflow-hidden hover:border-[#1E3A5F] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(232,97,44,0.12)]"
    >
      <Link
        href={`/products/${category.slug}`}
        className="flex flex-col flex-1 focus-visible:ring-2 focus-visible:ring-[#1E3A5F] outline-none"
        aria-label={`Explore ${category.name} products`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F0F1F3]">
          <Image
            src={imageUrl}
            alt={category.image?.alt_text || `${category.name} — Arabian Gratings Saudi Arabia`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />

          {/* Dark gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Product count badge */}
          {category.product_count > 0 && (
            <div className="absolute top-3 right-3 bg-[#111318]/80 backdrop-blur-sm px-2.5 py-1">
              <span className="text-[9px] font-mono font-bold text-white tracking-widest uppercase">
                {category.product_count} {category.product_count === 1 ? 'Product' : 'Products'}
              </span>
            </div>
          )}

          {/* Amber sweep line on hover */}
          <motion.div
            className="absolute bottom-0 left-0 h-[3px] bg-[#1E3A5F]"
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />

          {/* Hover CTA overlay */}
          <div className="absolute inset-0 flex items-end justify-start p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span className="inline-flex items-center gap-2 bg-[#1E3A5F] text-white text-[10px] font-display font-bold uppercase tracking-widest px-4 py-2">
              Explore Products <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-6">
          {/* Index */}
          <span className="text-[9px] font-mono text-[#1E3A5F] tracking-[0.25em] font-bold mb-2 block">
            {String(index + 1).padStart(2, '0')} // Category
          </span>

          {/* Category name */}
          <h2 className="text-lg font-display font-black text-[#111318] uppercase leading-tight tracking-tight mb-3 group-hover:text-[#1E3A5F] transition-colors duration-200">
            {category.name}
          </h2>

          {/* Short description */}
          {category.short_description && (
            <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 flex-1">
              {category.short_description}
            </p>
          )}

          {/* Footer link */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#D9DDE1]">
            <span className="text-[10px] font-display font-bold text-[#111318] uppercase tracking-widest group-hover:text-[#1E3A5F] transition-colors duration-200">
              View Products
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#1E3A5F] transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Default categories (shown when API is unavailable) ───────────────────────
const DEFAULT_CATEGORIES: ProductCategory[] = [
  { id: 1, name: 'Steel Gratings', slug: 'steel-gratings', short_description: 'Hot-dip galvanized welded steel gratings for heavy industrial access platforms across Saudi and GCC.', description: '', image: null, is_active: true, sort_order: 1, product_count: 0, no_index: false },
  { id: 2, name: 'FRP / GRP Products', slug: 'frp-grp-products', short_description: 'Corrosion-resistant fibre-reinforced plastic grating for chemical and marine environments.', description: '', image: null, is_active: true, sort_order: 2, product_count: 0, no_index: false },
  { id: 3, name: 'Aluminium', slug: 'aluminium', short_description: 'Lightweight aluminium access grating systems for infrastructure, utilities and public spaces.', description: '', image: null, is_active: true, sort_order: 3, product_count: 0, no_index: false },
  { id: 4, name: 'Stainless Steel Products', slug: 'stainless-steel-products', short_description: 'High-grade SS316 floor grating for hygienic and offshore applications.', description: '', image: null, is_active: true, sort_order: 4, product_count: 0, no_index: false },
  { id: 5, name: 'Manhole Covers', slug: 'manhole', short_description: 'Ductile iron double-sealed manhole covers for urban infrastructure and road applications.', description: '', image: null, is_active: true, sort_order: 5, product_count: 0, no_index: false },
  { id: 6, name: 'SS / GI Grating Clamps', slug: 'ss-gi-grating-clamps', short_description: 'M-clip stainless and galvanized grating fastening clamps for secure installation.', description: '', image: null, is_active: true, sort_order: 6, product_count: 0, no_index: false },
  { id: 7, name: 'Step Iron', slug: 'step-iron', short_description: 'Ductile iron plastic-encapsulated step irons for manhole and utility access shafts.', description: '', image: null, is_active: true, sort_order: 7, product_count: 0, no_index: false },
  { id: 8, name: 'Stud Products', slug: 'stud-products', short_description: 'Tactile warning studs and pavement guidance systems for pedestrian safety compliance.', description: '', image: null, is_active: true, sort_order: 8, product_count: 0, no_index: false },
];

// ─── Main Client Component ────────────────────────────────────────────────────
export default function ProductsClient({ categories }: ProductsClientProps) {
  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-[#111318]" aria-label="Products hero">
        {/* Background image with dark overlay */}
        <div className="absolute inset-0">
          <Image
            src="/hero-steel.jpg"
            alt="Arabian Gratings industrial grating products Saudi Arabia"
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111318]/60 via-[#111318]/40 to-[#111318]" />
        </div>

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-mono text-white/40 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#1E3A5F] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Products</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-5">
              Product Catalog // Saudi / GCC
            </span>
            <h1 className="font-display font-black text-white uppercase leading-[0.95] tracking-tighter text-[clamp(2.8rem,6vw,5rem)] max-w-3xl mb-6">
              Our Products
            </h1>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-2xl">
              Arabian Gratings supplies a comprehensive range of industrial grating systems — steel, FRP/GRP, aluminium, stainless steel, stair treads, and access covers — engineered to international standards and deployed across Saudi and GCC oil &amp; gas, infrastructure, marine and industrial projects.
            </p>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-white/10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              { value: displayCategories.length.toString(), label: 'Product Categories' },
              { value: '321+', label: 'Projects Delivered' },
              { value: 'ISO 9001', label: 'Quality Certified' },
              { value: 'Saudi / GCC', label: 'Regional Coverage' },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="block font-display font-black text-white text-2xl tracking-tighter">
                  {stat.value}
                </span>
                <span className="block font-mono text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ───────────────────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20" aria-label="Product categories">
        {/* Section header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-3">
            All Systems
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#111318] uppercase leading-tight tracking-tight">
              Browse by Category
            </h2>
            <span className="text-[10px] font-mono text-[#9CA3AF] tracking-widest uppercase">
              {displayCategories.length} {displayCategories.length === 1 ? 'Category' : 'Categories'} Available
            </span>
          </div>
          <div className="w-14 h-[2px] bg-[#1E3A5F] mt-4" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
        </div>
      </section>

      {/* ── TECHNICAL CAPABILITIES STRIP ──────────────────────────── */}
      <section className="border-t border-[#D9DDE1] py-16 bg-[#F7F8F9]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '⬡',
                title: 'ISO 9001 Quality',
                desc: 'Every batch tested to international structural load and deflection standards.',
              },
              {
                icon: '⟁',
                title: 'GCC Compliant',
                desc: 'All products comply with Saudi municipal and Gulf regional specifications.',
              },
              {
                icon: '✦',
                title: 'Site-Engineered',
                desc: 'Custom sizing, load ratings and finishes for your exact project requirements.',
              },
              {
                icon: '◈',
                title: 'Fast Delivery',
                desc: 'Stocked in Riyadh, Jeddah and Dammam for rapid deployment across the Kingdom.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px 0px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col gap-3"
              >
                <span className="text-2xl text-[#1E3A5F] font-mono">{item.icon}</span>
                <h3 className="text-[11px] font-display font-black text-[#111318] uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
      <section className="bg-[#111318] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px 0px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[9px] font-mono text-[#1E3A5F] tracking-[0.3em] uppercase block mb-4">
              Engineering Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase leading-tight mb-4">
              Can&apos;t Find What You Need?
            </h2>
            <p className="text-sm text-[#9CA3AF] max-w-xl mx-auto leading-relaxed mb-8">
              Our engineering team can recommend the right grating system for your specific load class, environment and project requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1E3A5F] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#142838] transition-colors"
              >
                Contact Us <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/20 text-white text-[10px] font-display font-bold uppercase tracking-widest hover:border-white/50 hover:bg-white/5 transition-all"
              >
                Request a Quote <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
