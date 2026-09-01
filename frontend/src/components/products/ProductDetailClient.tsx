'use client';
// Force reload detail cache
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from 'lucide-react';
import { Product, ProductImage, RelatedProduct } from '@/types';
import { getImageUrl } from '@/lib/api/client';

interface ProductDetailClientProps {
  product: Product;
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const activeImg = images[activeIdx];

  const prev = useCallback(() =>
    setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() =>
    setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [lightboxOpen, prev, next]);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-[#F0F1F3] flex items-center justify-center">
        <div className="grid grid-cols-6 gap-1.5 opacity-[0.12]">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-5 h-5 bg-[#111318]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Main image */}
      <motion.div
        className="relative aspect-[4/3] overflow-hidden bg-[#F0F1F3] cursor-zoom-in"
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={isInView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={() => setLightboxOpen(true)}
        role="button"
        aria-label="Open image fullscreen"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={getImageUrl(activeImg.media.file) || ''}
              alt={
                activeImg.alt_text ||
                activeImg.media.alt_text ||
                `${productName} — view ${activeIdx + 1}`
              }
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
              priority={activeIdx === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom indicator */}
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm border border-[#D9DDE1] p-1.5 opacity-0 group-hover:opacity-100">
          <ZoomIn className="w-4 h-4 text-[#111318]" />
        </div>

        {/* Nav arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-[#D9DDE1] p-2 hover:bg-[#111318] hover:text-white transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-[#D9DDE1] p-2 hover:bg-[#111318] hover:text-white transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-[#D9DDE1] px-2 py-1">
            <span className="text-[9px] font-mono font-bold text-[#111318]">
              {String(activeIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </motion.div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(i)}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden border-2 transition-all duration-200 ${
                i === activeIdx ? 'border-[#1E3A5F]' : 'border-[#D9DDE1] hover:border-[#111318]'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={getImageUrl(img.media.file) || ''}
                alt={img.alt_text || img.media.alt_text || `${productName} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-[#1E3A5F] transition-colors"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#1E3A5F] transition-colors"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#1E3A5F] transition-colors"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-5xl max-h-[85vh] w-full mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getImageUrl(activeImg.media.file) || ''}
                alt={activeImg.alt_text || activeImg.media.alt_text || productName}
                width={1200}
                height={900}
                className="object-contain w-full h-full max-h-[85vh]"
              />
              {activeImg.alt_text && (
                <p className="text-center text-[11px] font-mono text-[#6B7280] mt-3">
                  {activeImg.alt_text}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Spec Row (animated) ─────────────────────────────────────────────────────

function SpecRow({ label, value, index }: { label: string; value: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
      className="flex items-start gap-4 py-3 border-b border-[#D9DDE1] last:border-0"
    >
      <span className="text-[10px] font-mono font-bold text-[#9CA3AF] uppercase tracking-widest w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-[12px] font-mono font-semibold text-[#111318]">{value}</span>
    </motion.div>
  );
}

// ─── Related Product Card ─────────────────────────────────────────────────────

function RelatedCard({ product, index }: { product: RelatedProduct; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col bg-white border border-[#D9DDE1] overflow-hidden hover:border-[#1E3A5F] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#1E3A5F] outline-none"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F0F1F3]">
          {product.primary_image ? (
            <Image
              src={getImageUrl(product.primary_image.media.file) || ''}
              alt={
                product.primary_image.alt_text ||
                product.primary_image.media.alt_text ||
                product.name
              }
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#F0F1F3]">
              <div className="grid grid-cols-3 gap-1 opacity-[0.15]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-[#111318]" />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <span className="text-[9px] font-mono text-[#1E3A5F] tracking-widest uppercase block mb-1">
            {product.category_name}
          </span>
          <h4 className="text-sm font-display font-black text-[#111318] uppercase tracking-wide mb-1.5 group-hover:text-[#1E3A5F] transition-colors">
            {product.name}
          </h4>
          <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed mb-3">
            {product.short_description}
          </p>
          <span className="inline-flex items-center gap-1 text-[10px] font-display font-bold text-[#1E3A5F] uppercase tracking-widest">
            Explore <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Sticky CTA Bar ───────────────────────────────────────────────────────────

function StickyCTA({ product, heroRef }: { product: Product; heroRef: React.RefObject<HTMLDivElement | null> }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [heroRef]);

  const contactHref = `/contact?subject=${encodeURIComponent(`Technical Inquiry for ${product.name}`)}`;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop Sticky Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-4 right-4 z-45 hidden lg:flex items-center gap-3 bg-[#111318] border border-[#3A3F4A] px-4 py-3 shadow-2xl rounded-sm"
          >
            <span className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-widest max-w-[140px] truncate">
              {product.name}
            </span>
            <Link
              href={contactHref}
              className="flex items-center gap-1.5 px-6 py-2 bg-[#1E3A5F] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#142838] transition-colors whitespace-nowrap rounded-sm"
            >
              Contact Us
            </Link>
          </motion.div>

          {/* Mobile Bottom Sticky Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-45 lg:hidden bg-[#111318] border-t border-[#3A3F4A] p-3 flex shadow-2xl"
          >
            <Link
              href={contactHref}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-[#1E3A5F] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#142838] transition-colors whitespace-nowrap rounded-sm"
            >
              Contact Us
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Section CTAs Inline Row ──────────────────────────────────────────────────

function SectionCTAs({ productName }: { productName: string }) {
  const contactHref = `/contact?subject=${encodeURIComponent(`Technical Inquiry for ${productName}`)}`;
  return (
    <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-[#D9DDE1]">
      <Link
        href={contactHref}
        className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#1E3A5F] text-white text-[9px] font-display font-bold uppercase tracking-widest hover:bg-[#142838] transition-colors rounded-sm"
      >
        Contact Us
      </Link>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroScrollRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  // Parse features from text (one per line)
  const featureList = product.features
    ? product.features.split('\n').map((f) => f.trim()).filter(Boolean)
    : [];

  // Parse applications from text (comma-separated or line-by-line)
  const applicationList = product.applications
    ? product.applications
        .split(/[,\n]/)
        .map((a) => a.trim())
        .filter(Boolean)
    : [];

  // Merge spec sources: structured rows first, then legacy JSON specs
  const allSpecs: { name: string; value: string }[] = [];
  if (product.spec_rows?.length > 0) {
    product.spec_rows.forEach((row) => allSpecs.push({ name: row.name, value: row.value }));
  } else if (product.specifications && Object.keys(product.specifications).length > 0) {
    Object.entries(product.specifications).forEach(([k, v]) =>
      allSpecs.push({ name: k.replace(/_/g, ' '), value: String(v) })
    );
  }

  const heroSpecs = [
    { label: 'Material', value: product.material },
    { label: 'Finish', value: product.finish },
    { label: 'Standard', value: product.standard },
    { label: 'Application', value: applicationList.slice(0, 2).join(' / ') },
  ].filter((s) => s.value);

  const hasDatasheet = product.documents?.some((d) => d.is_active);
  const quoteHref = `/quote?product=${product.slug}`;

  return (
    <div className="bg-white min-h-screen">
      <StickyCTA product={product} heroRef={heroRef} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div ref={heroRef} className="pt-24">
        <div ref={heroScrollRef} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-mono text-[#9CA3AF] mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#1E3A5F] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#1E3A5F] transition-colors">Products</Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category?.slug}`}
              className="hover:text-[#1E3A5F] transition-colors"
            >
              {product.category?.name}
            </Link>
            <span>/</span>
            <span className="text-[#111318] font-bold">{product.name}</span>
          </nav>

          {/* Split-screen hero grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* LEFT — Gallery */}
            <div className="lg:col-span-7">
              <motion.div style={{ y: heroY }}>
                <ProductGallery images={product.product_images || []} productName={product.name} />
              </motion.div>
            </div>

            {/* RIGHT — Product info */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Index + category */}
                <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.25em] uppercase block mb-3">
                  01 // {product.category?.name || 'Product System'}
                </span>

                {/* Product name — this is the visible H1 */}
                <h1 className="text-3xl sm:text-4xl font-display font-black text-[#111318] uppercase leading-tight tracking-tight mb-4">
                  {product.name}
                </h1>

                {/* Product code */}
                {product.product_code && (
                  <p className="text-[10px] font-mono text-[#9CA3AF] tracking-widest uppercase mb-4">
                    Ref: {product.product_code}
                  </p>
                )}

                {/* Short description */}
                <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
                  {product.short_description}
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link
                    href={`/contact?subject=${encodeURIComponent(`Inquiry: ${product.name}`)}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1E3A5F] text-white text-[11px] font-display font-bold uppercase tracking-widest hover:bg-[#142838] transition-colors"
                  >
                    Contact Us <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {hasDatasheet && (
                    <a
                      href={product.documents.find((d) => d.is_active)?.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#D9DDE1] text-[#111318] text-[11px] font-display font-bold uppercase tracking-widest hover:border-[#111318] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Datasheet
                    </a>
                  )}
                </div>

                {/* Technical spec strip */}
                {heroSpecs.length > 0 && (
                  <div className="border border-[#D9DDE1] divide-y divide-[#D9DDE1]">
                    {heroSpecs.map((spec) => (
                      <div key={spec.label} className="flex items-start gap-4 px-4 py-3">
                        <span className="text-[9px] font-mono font-bold text-[#9CA3AF] uppercase tracking-widest w-24 shrink-0 pt-0.5">
                          {spec.label}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-[#111318]">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* ── SECTION 01 — PRODUCT OVERVIEW ─────────────────────── */}
      <section className="border-t border-[#D9DDE1] py-20" aria-label="Product Overview">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-4">
                  01 // Overview
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#111318] uppercase tracking-wide leading-tight mb-6">
                  Product Overview
                </h2>
                <div className="text-sm text-[#6B7280] leading-relaxed space-y-4 prose-sm max-w-none">
                  {product.description.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                <SectionCTAs productName={product.name} />
              </motion.div>
            </div>

            {/* Features sidebar */}
            {featureList.length > 0 && (
              <div className="lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="bg-[#F7F8F9] border border-[#D9DDE1] p-6"
                >
                  <h3 className="text-[10px] font-mono font-bold text-[#111318] uppercase tracking-widest mb-4 pb-3 border-b border-[#D9DDE1]">
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    {featureList.map((feat, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex items-start gap-3 text-[12px] text-[#374151] leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F] shrink-0 mt-1.5" />
                        {feat}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 02 — TECHNICAL SPECIFICATIONS ──────────────── */}
      {allSpecs.length > 0 && (
        <section className="border-t border-[#D9DDE1] py-20 bg-[#F7F8F9]" aria-label="Technical Specifications">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px 0px' }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-3">
                02 // Technical Data
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-[#111318] uppercase tracking-wide">
                Technical Specifications
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#D9DDE1] bg-white divide-y lg:divide-y-0">
              <div className="divide-y divide-[#D9DDE1] lg:border-r lg:border-[#D9DDE1]">
                {allSpecs
                  .filter((_, i) => i % 2 === 0)
                  .map((spec, i) => (
                    <SpecRow key={spec.name} label={spec.name} value={spec.value} index={i} />
                  ))}
              </div>
              <div className="divide-y divide-[#D9DDE1]">
                {allSpecs
                  .filter((_, i) => i % 2 !== 0)
                  .map((spec, i) => (
                    <SpecRow key={spec.name} label={spec.name} value={spec.value} index={i} />
                  ))}
              </div>
            </div>

            {/* Mid-page CTA */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#D9DDE1] bg-white p-6">
              <div>
                <p className="text-xs font-display font-bold text-[#111318] uppercase tracking-wide">
                  Need custom specifications or a specific size?
                </p>
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Our engineering team can advise on load class, mesh size, bar spacing and finish options.
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto shrink-0">
                <Link
                  href={quoteHref}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E3A5F] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#142838] transition-colors rounded-sm"
                >
                  Request Quote
                </Link>
                <Link
                  href={`/contact?subject=${encodeURIComponent(`Technical Consultation for ${product.name}`)}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#D9DDE1] text-[#111318] text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#111318] hover:text-white hover:border-[#111318] transition-all rounded-sm"
                >
                  Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 03 — APPLICATIONS ────────────────────────── */}
      {applicationList.length > 0 && (
        <section className="border-t border-[#D9DDE1] py-20" aria-label="Applications">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px 0px' }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-3">
                03 // Where It Is Used
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-[#111318] uppercase tracking-wide">
                Product Applications
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {applicationList.map((app, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px 0px' }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="group border border-[#D9DDE1] p-5 hover:border-[#1E3A5F] transition-colors duration-200 cursor-default"
                >
                  <div className="w-3 h-0.5 bg-[#1E3A5F] mb-3 group-hover:w-6 transition-all duration-300" />
                  <p className="text-[11px] font-display font-bold text-[#111318] uppercase tracking-wide">
                    {app}
                  </p>
                </motion.div>
              ))}
            </div>
            <SectionCTAs productName={product.name} />
          </div>
        </section>
      )}

      {/* ── SECTION 04 — STANDARDS / DOCUMENTS ──────────────── */}
      {(product.standard || (product.documents && product.documents.length > 0)) && (() => {
        const activeDocs = product.documents ? product.documents.filter((d) => d.is_active) : [];
        const hasDocs = activeDocs.length > 0;
        
        const rawStandards = product.standard || '';
        const standardsList = rawStandards.includes(',') && rawStandards.length < 150
          ? rawStandards.split(',').map((s) => s.trim()).filter(Boolean)
          : rawStandards ? [rawStandards] : [];

        return (
          <section className="border-t border-[#D9DDE1] py-20 bg-[#F7F8F9]" aria-label="Standards and Documents">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className={hasDocs ? "grid grid-cols-1 lg:grid-cols-12 gap-12" : "max-w-4xl mx-auto"}>
                
                {/* Standards Column */}
                {standardsList.length > 0 && (
                  <div className={hasDocs ? "lg:col-span-7" : "w-full"}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px 0px' }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-4">
                        04 // Standards
                      </span>
                      <h2 className="text-lg font-display font-black text-[#111318] uppercase tracking-wide mb-8">
                        Engineering Standards &amp; Certifications
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {standardsList.map((std, idx) => (
                          <motion.div
                            key={std}
                            className="relative group bg-white border border-[#D9DDE1] p-5 transition-all duration-300 hover:bg-[#111318] hover:border-[#111318] hover:-translate-y-1 select-none shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(17,19,24,0.12)] rounded-sm"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                          >
                            {/* Left accent bar on hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#1E3A5F] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                            
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <div className="w-5 h-5 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center group-hover:bg-[#1E3A5F]/20 transition-colors">
                                  <svg className="w-3 h-3 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <span className="block font-mono text-[#1E3A5F] text-[9px] uppercase tracking-wider mb-1">
                                  Compliance Code
                                </span>
                                <h4 className="font-display font-black text-[#111318] text-[13px] group-hover:text-white uppercase tracking-tight transition-colors duration-200 leading-snug">
                                  {std}
                                </h4>
                                <p className="font-mono text-[#59616B] text-[8px] uppercase tracking-widest mt-1.5 group-hover:text-[#A3A9B0] transition-colors duration-200">
                                  International Standard
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Document Downloads Column */}
                {hasDocs && (
                  <div className="lg:col-span-5">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px 0px' }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-4">
                        Technical Documents
                      </span>
                      <h3 className="text-lg font-display font-black text-[#111318] uppercase tracking-wide mb-8">
                        Datasheets &amp; Catalogs
                      </h3>
                      <div className="space-y-3">
                        {activeDocs.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-[#D9DDE1] hover:border-[#111318] hover:bg-[#111318] transition-all duration-300 group shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(17,19,24,0.12)] hover:-translate-y-0.5 rounded-sm relative overflow-hidden"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#1E3A5F] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                            
                            <div className="pl-2">
                              <p className="text-[11px] font-display font-bold text-[#111318] uppercase tracking-wide group-hover:text-white transition-colors duration-200">
                                {doc.title}
                              </p>
                              <p className="text-[9px] font-mono text-[#9CA3AF] uppercase tracking-wider mt-0.5 group-hover:text-[#A3A9B0] transition-colors duration-200">
                                {doc.document_type}
                              </p>
                            </div>
                            <Download className="w-4 h-4 text-[#9CA3AF] group-hover:text-white transition-colors duration-200 shrink-0 mr-1" />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}

              </div>
              <SectionCTAs productName={product.name} />
            </div>
          </section>
        );
      })()}

      {/* ── SECTION 05 — FAQ ─────────────────────────────────── */}
      {product.faq && product.faq.length > 0 && (
        <section className="border-t border-[#D9DDE1] py-20" aria-label="Frequently Asked Questions">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px 0px' }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-3">
                05 // FAQ
              </span>
              <h2 className="text-2xl font-display font-black text-[#111318] uppercase tracking-wide">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="space-y-1">
              {product.faq.map((item, i) => (
                <motion.details
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="group border border-[#D9DDE1] bg-white"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none hover:bg-[#F7F8F9] transition-colors">
                    <span className="text-[12px] font-display font-bold text-[#111318] uppercase tracking-wide pr-4">
                      {item.question}
                    </span>
                    <span className="text-[#1E3A5F] text-lg font-mono shrink-0">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-[12px] text-[#6B7280] leading-relaxed border-t border-[#D9DDE1] pt-4">
                    {item.answer}
                  </div>
                </motion.details>
              ))}
            </div>
            <SectionCTAs productName={product.name} />
          </div>
        </section>
      )}

      {/* ── RELATED PRODUCTS ─────────────────────────────────── */}
      {product.related_products && product.related_products.length > 0 && (
        <section className="border-t border-[#D9DDE1] py-20 bg-[#F7F8F9]" aria-label="Related Products">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px 0px' }}
              transition={{ duration: 0.5 }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-3">
                  Related Systems
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#111318] uppercase tracking-wide">
                  Related Products
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-display font-bold text-[#111318] uppercase tracking-widest hover:text-[#1E3A5F] transition-colors"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {product.related_products.slice(0, 4).map((rp, i) => (
                <RelatedCard key={rp.id} product={rp} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="bg-[#111318] py-24" aria-label="Request a Quote">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px 0px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[9px] font-mono text-[#1E3A5F] tracking-[0.35em] uppercase block mb-5">
              Engineering Support // Saudi
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white uppercase leading-tight tracking-tight mb-4">
              Need This System<br />for Your Project?
            </h2>
            <p className="text-sm text-[#9CA3AF] max-w-xl mx-auto leading-relaxed mb-10">
              Talk to our engineering team about your load class requirements, environment conditions and project schedule. We supply across Saudi Arabia, Jeddah, Dammam and the wider GCC.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1E3A5F] text-white text-[11px] font-display font-bold uppercase tracking-widest hover:bg-[#142838] transition-colors"
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#3A3F4A] text-white text-[11px] font-display font-bold uppercase tracking-widest hover:border-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
