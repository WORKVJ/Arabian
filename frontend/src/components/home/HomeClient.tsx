'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
  animate,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCategory, Industry, Project, BlogPost } from '@/types';
import { getImageUrl } from '@/lib/api/client';

function StatCounter({ value, targetVal, noMotion, suffix = '+' }: { value: string; targetVal: number; noMotion: boolean; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px 0px' });

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !inView) return;
    if (noMotion) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setCount(targetVal);
      return;
    }

    const controls = animate(0, targetVal, {
      duration: 2.2,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latest) => {
        setCount(Math.floor(latest));
      }
    });

    return () => controls.stop();
  }, [targetVal, noMotion, hasMounted, inView]);

  if (!hasMounted) {
    return <span ref={ref}>{value}</span>;
  }

  return <span ref={ref}>{count}{suffix}</span>;
}

interface HomeClientProps {
  categories: ProductCategory[];
  industries: Industry[];
  projects: Project[];
  posts: BlogPost[];
}

const defaultCategories: ProductCategory[] = [
  { id: 1, name: 'Steel Grating Systems', slug: 'steel-gratings', short_description: 'Industrial heavy-duty metal floors galvanized to ISO 1461.', description: 'Industrial heavy-duty metal floors galvanized to ISO 1461. Fabricated using high-strength structural grade steels.', image: null, is_active: true, no_index: false, sort_order: 0, product_count: 0 },
  { id: 2, name: 'FRP / GRP Grating', slug: 'frp-gratings', short_description: 'Corrosion-proof fiberglass reinforced plastic grates.', description: 'Corrosion-proof fiberglass reinforced plastic grates built with isophthalic polyester or vinyl ester resins.', image: null, is_active: true, no_index: false, sort_order: 1, product_count: 0 },
  { id: 3, name: 'Industrial Stair Treads', slug: 'stair-treads', short_description: 'Grating steps with anti-slip nosing plates.', description: 'Grating steps with anti-slip nosing plates and standard welded end-plates for immediate field installation.', image: null, is_active: true, no_index: false, sort_order: 2, product_count: 0 },
  { id: 4, name: 'Custom Fabricated Grates', slug: 'custom-fabrications', short_description: 'Bespoke grating panels to match site drawings.', description: 'Bespoke grating panels with circular penetrations, notches, complex shapes and edge bandings to match site drawings.', image: null, is_active: true, no_index: false, sort_order: 3, product_count: 0 },
];

const defaultIndustries: Industry[] = [
  { id: 1, name: 'Oil & Gas', slug: 'oil-and-gas', short_description: 'High-load gratings and platforms engineered for extreme thermal fluctuations and coastal environments.', description: '', description_blocks: [], image: null, applications: '', related_products: [], is_active: true, no_index: false },
  { id: 2, name: 'Marine & Offshore', slug: 'marine-offshore', short_description: 'Corrosion-resistant GRP grids built to withstand seawater spray and wave impact loads.', description: '', description_blocks: [], image: null, applications: '', related_products: [], is_active: true, no_index: false },
  { id: 3, name: 'Desalination Plants', slug: 'water-treatment', short_description: 'Chemical-safe GRP grids and stainless floor plates for humid, chlorine-heavy utility yards.', description: '', description_blocks: [], image: null, applications: '', related_products: [], is_active: true, no_index: false },
  { id: 4, name: 'Infrastructure', slug: 'infrastructure-logistics', short_description: 'Heavy duty wheel-load rated trench covers and drainage grates for warehouse docks and road channels.', description: '', description_blocks: [], image: null, applications: '', related_products: [], is_active: true, no_index: false },
];

const defaultProjects: Project[] = [
  { id: 1, title: 'Mussafah Cargo Platform Layout', slug: 'mussafah-cargo-platform', location: 'Mussafah Industrial Port, Abu Dhabi', associated_industries: [defaultIndustries[1]], description: 'Hot-dip galvanized steel grids fabricated and tested for massive wheel load deflection standards across the cargo platform.', description_blocks: [], featured_image: null, project_images: [], products_used: [], project_date: '2025-06', is_featured: true, is_active: true, no_index: false, created_at: '', updated_at: '' },
  { id: 2, title: 'Ruwais Sulphur Trench Grates', slug: 'ruwais-sulphur-trench', location: 'Ruwais Refinery Complex, Abu Dhabi', associated_industries: [defaultIndustries[0]], description: 'Molded GRP fiberglass composite floor walkways with high chemical safety ratios designed for sulphur exposure.', description_blocks: [], featured_image: null, project_images: [], products_used: [], project_date: '2025-09', is_featured: true, is_active: true, no_index: false, created_at: '', updated_at: '' },
];

const defaultPosts: BlogPost[] = [
  { id: 1, title: 'Hot-Dip Galvanizing Deflection Standards in Coastal Saudi Docks', slug: 'hot-dip-galvanizing-deflection-standards', excerpt: 'Detailed analysis of corrosion fatigue on marine steel platforms and yield stress parameters in coastal environments.', content: '', content_blocks: [], featured_image: null, category: { id: 1, name: 'Technical Standards', slug: 'technical-standards', description: '', is_active: true }, author: { id: 1, name: 'Lead Structural Engineer' }, status: 'PUBLISHED', is_featured: true, published_at: '2025-05-12', created_at: '', updated_at: '', related_products: [], related_industries: [], related_posts: [], no_index: false },
  { id: 2, title: 'GRP/FRP Matrix Selection Guide for Sulphur Environments', slug: 'grp-frp-matrix-selection-guide', excerpt: 'A review of isophthalic polyester versus vinyl ester resin resistance profiles in local refineries and desalination plants.', content: '', content_blocks: [], featured_image: null, category: { id: 2, name: 'Material Engineering', slug: 'material-engineering', description: '', is_active: true }, author: { id: 1, name: 'Chemical Specialist' }, status: 'PUBLISHED', is_featured: false, published_at: '2025-08-22', created_at: '', updated_at: '', related_products: [], related_industries: [], related_posts: [], no_index: false },
];

const partnerLogos = [
  '/img/logo-01.png',
  '/img/logo-04.png',
  '/img/logo-05.png',
  '/img/logo-06.png',
  '/img/logo-08.png',
  '/img/logo-10.png',
  '/img/logo-11.png',
  '/img/logo-12.png',
];

const productImages = ['/product-steel-grating.jpg', '/product-frp-grating.jpg', '/product-steel-grating.jpg', '/product-frp-grating.jpg'];
const productSpecs: Record<string, { label: string; value: string }[]> = {
  'steel-gratings': [
    { label: 'MATERIAL', value: 'ASTM A36 CARBON STEEL' },
    { label: 'DEFLECTION', value: 'BS EN 14122 COMPLIANT' },
    { label: 'FINISH', value: 'ISO 1461 HOT-DIP GALVANIZED' }
  ],
  'frp-grp-products': [
    { label: 'MATRIX', value: 'GRP / FIBERGLASS' },
    { label: 'CORROSION', value: 'ISOPHTHALIC ACID IMMUNITY' },
    { label: 'SAFETY', value: 'SLIP-RESISTANT GRIT SURFACE' }
  ],
  'stainless-steel-products': [
    { label: 'GRADE', value: 'STAINLESS STEEL SS316 / SS304' },
    { label: 'APPLICATION', value: 'HYGIENIC & OFFSHORE DRAINS' },
    { label: 'FINISH', value: 'PICKLED & PASSIVATED' }
  ],
  'aluminium': [
    { label: 'MATERIAL', value: 'ALUMINIUM ALLOY 6063-T6' },
    { label: 'NOSING', value: 'SERRATED SHIFTING SAFETY' },
    { label: 'LOAD RATING', value: 'LIGHTWEIGHT PEDESTRIAN ACCESS' }
  ],
  'manhole': [
    { label: 'MATERIAL', value: 'DUCTILE IRON GJS500/7' },
    { label: 'STANDARDS', value: 'BS EN 124 CLASS D400' },
    { label: 'SEAL', value: 'DOUBLE SEALED O-RING GAS TIGHT' }
  ],
  'ss-gi-grating-clamps': [
    { label: 'TYPE', value: 'M-CLIP / SADDLE CLAMP SYSTEM' },
    { label: 'COMPATIBILITY', value: '30MM TO 41MM GRATING PITCH' },
    { label: 'FASTENER', value: 'M8 BOLT WITH SQUARE NUT' }
  ],
  'step-iron': [
    { label: 'CORE', value: 'STRUCTURAL STEEL / DUCTILE IRON' },
    { label: 'ENCAPSULATION', value: 'VIRGIN POLYPROPYLENE PLASTIC' },
    { label: 'STANDARDS', value: 'BS EN 13101 COMPLIANT' }
  ],
  'stud-products': [
    { label: 'MATERIAL', value: 'STAINLESS STEEL SS316L' },
    { label: 'PATTERN', value: 'TACTILE DOME / CONCENTRIC RING' },
    { label: 'STEM', value: 'PIN STEM FOR ADHESIVE INJECTION' }
  ]
};
const industryImages = ['/img/real2/new (12).jpeg', '/img/real1/img (8).jpeg', '/img/real1/img (13).jpeg', '/img/real2/new (2).jpeg'];
const projectImages = ['/img/real1/img (1).jpeg', '/img/real2/new (10).jpeg'];
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
const springCfg = { stiffness: 70, damping: 20, mass: 0.9 };

const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const staggerItem = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } } };

// Reusable ImageReveal with clip-path, scale and parallax
function ImageReveal({ src, alt, className = '', parallaxSpeed = 0.05, aspectClass = 'aspect-[4/3]' }: { src: string; alt: string; className?: string; parallaxSpeed?: number; aspectClass?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const noMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const rawY = useTransform(scrollYProgress, [0, 1], [`${parallaxSpeed * -100}px`, `${parallaxSpeed * 100}px`]);
  const y = useSpring(rawY, springCfg);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.04, 1]);
  const clipPercent = useTransform(scrollYProgress, [0, 0.45], [10, 0]);
  const smoothScale = useSpring(scale, springCfg);
  const smoothClip = useSpring(clipPercent, springCfg);

  const [clipVal, setClipVal] = useState(10);
  useEffect(() => {
    if (noMotion) return;
    return smoothClip.on('change', (latest) => setClipVal(latest));
  }, [smoothClip, noMotion]);

  const clipPathStyle = noMotion ? {} : { clipPath: `inset(0% ${clipVal}% 0% ${clipVal}%)` };

  return (
    <div ref={ref} className={`relative overflow-hidden bg-slate-100 ${aspectClass} ${className}`}>
      <motion.div
        className="w-full h-full relative"
        style={noMotion ? {} : { y, scale: smoothScale, ...clipPathStyle }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 hover:scale-[1.04]"
        />
      </motion.div>
    </div>
  );
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const noMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={noMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.75, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

function MaskReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const noMotion = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={noMotion ? false : { y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-6%' }}
        transition={{ duration: 0.85, delay, ease: easeOut }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// CTA Section — intentional dark contrast anchor, kept exactly as designed
function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  const noMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.06]);
  const smoothScale = useSpring(scale, { stiffness: 55, damping: 18 });
  return (
    <section ref={ref} className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-[#111318]" aria-label="Request a quote">
      <motion.div className="absolute inset-0 z-0" style={noMotion ? {} : { scale: smoothScale }}>
        <Image src="/cta-factory.jpg" alt="Arabian Gratings factory — submit RFQ" fill sizes="100vw" className="object-cover saturate-[0.8]" />
        <div className="absolute inset-0 bg-[#111318]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/30 to-[#111318]/10" />
      </motion.div>
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10 z-10" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center space-y-8">
        <FadeUp delay={0.05}>
          <span className="font-mono text-[#E8612C] text-[10px] uppercase tracking-[0.25em] block">08 // Get In Touch</span>
        </FadeUp>
        <MaskReveal delay={0.12}>
          <h2 className="font-display font-black text-white text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] tracking-tighter uppercase">
            Let&apos;s Build<br />What The Industry<br />Requires.
          </h2>
        </MaskReveal>
        <FadeUp delay={0.3}>
          <p className="font-sans text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
            Submit your grating dimensions, material configurations, and target spans. Our engineering desk verifies weight deflection limits and responds within 24 hours.
          </p>
        </FadeUp>
        <FadeUp delay={0.42}>
          <div className="flex justify-center">
            <Link href="/contact" className="group inline-flex items-center gap-3 bg-[#E8612C] hover:bg-[#CF4D1B] text-white font-display font-bold text-xs uppercase tracking-[0.15em] px-10 py-5 transition-colors duration-300 shadow-2xl">
              Contact Us
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeUp>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-10" />
    </section>
  );
}


const heroSlides = [
  { src: '/img/img1.png', label: 'OFFSHORE & INDUSTRIAL // ACCESS SYSTEMS', alt: 'Arabian Gratings industrial walkway and offshore access' },
  { src: '/img/img2.png', label: 'TESTED STANDARDS // ISO 9001 CERTIFIED', alt: 'Arabian Gratings testing standards and stair tread installations' },
];

export default function HomeClient({ categories: rawCategories, industries: rawIndustries, projects: rawProjects, posts: rawPosts }: HomeClientProps) {
  const categories = rawCategories.length > 0 ? rawCategories : defaultCategories;
  const industries = rawIndustries.length > 0 ? rawIndustries : defaultIndustries;
  const projects = rawProjects.length > 0 ? rawProjects : defaultProjects;
  const posts = rawPosts.length > 0 ? rawPosts : defaultPosts;

  const heroRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const industriesRef = useRef<HTMLElement>(null);
  const capabilitiesRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const insightsRef = useRef<HTMLElement>(null);
  const noMotion = useReducedMotion();

  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [isHoveredStat, setIsHoveredStat] = useState<number | null>(null);
  const [activeMatIndex, setActiveMatIndex] = useState(0);
  const [isHoveredMat, setIsHoveredMat] = useState<number | null>(null);
  const [activeProdIndex, setActiveProdIndex] = useState(0);
  const [isHoveredProd, setIsHoveredProd] = useState<number | null>(null);
  const [isHoveredInd, setIsHoveredInd] = useState<number | null>(null);
  const [activeIndStatIndex, setActiveIndStatIndex] = useState(0);
  const [isHoveredIndStat, setIsHoveredIndStat] = useState<number | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [visSpecIndex, setVisSpecIndex] = useState(0);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      if (isHoveredStat === null) setActiveStatIndex((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [isHoveredStat, noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      if (isHoveredMat === null) setActiveMatIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHoveredMat, noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      if (isHoveredProd === null) setActiveProdIndex((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, [isHoveredProd, noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      if (isHoveredIndStat === null) setActiveIndStatIndex((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHoveredIndStat, noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      setVisSpecIndex((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(interval);
  }, [noMotion]);

  // Hero scroll tracking — for content parallax and amber progress bar
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(heroScrollProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(heroScrollProgress, [0, 0.75], [1, 0]);
  const springConfig = { stiffness: 70, damping: 24, mass: 1 };
  const smoothContentY = useSpring(contentY, springConfig);
  const smoothContentOpacity = useSpring(contentOpacity, springConfig);

  const visSpecsList = [
    { label: 'SPAN LOAD', val: '45.8 kN/m²' },
    { label: 'YIELD POINT', val: 'E235 GRADE' },
    { label: 'MESH SPAN', val: '30 × 100 MM' },
    { label: 'GALV ANNEAL', val: 'ISO 1461' },
  ];

  return (
    <div className="flex flex-col bg-white overflow-x-clip">

      {/* ─── 01 HERO — Premium 50/50 Editorial Grid Layout ─── */}
      <section
        ref={heroRef}
        className="relative bg-white min-h-screen flex items-center overflow-hidden"
        aria-label="Arabian Gratings hero"
      >
        {/* Subtle technical dot-grid background */}
        <div className="absolute inset-0 tech-dot-grid-light opacity-60 pointer-events-none" />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 pt-[90px] pb-10 lg:pb-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center w-full">
          
          {/* LEFT COLUMN — Editorial engineering copy */}
          <motion.div
            className="flex flex-col justify-center max-w-[580px] -mt-3"
            style={noMotion ? {} : { y: smoothContentY, opacity: smoothContentOpacity }}
          >
            <div className="w-full">
              {/* Eyebrow */}
              <motion.div
                className="mb-6 flex items-center gap-4"
                initial={noMotion ? false : { opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: easeOut }}
              >
                <span className="block font-mono text-[#E8612C] text-[10px] tracking-[0.25em] uppercase">
                  Arabian Gratings Saudi / Industrial Grating Systems
                </span>
                <motion.div
                  className="h-px bg-[#E8612C] shrink-0"
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                />
              </motion.div>

              {/* H1 */}
              <div className="space-y-0 mb-6">
                <div className="overflow-hidden">
                  <motion.h1
                    className="font-display font-black text-[#111318] text-[clamp(2.3rem,4vw,3.6rem)] leading-[0.98] tracking-tighter uppercase"
                    initial={noMotion ? false : { opacity: 0, y: 70, clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
                    transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
                  >
                    Engineered For
                  </motion.h1>
                </div>
                <div className="overflow-hidden">
                  <motion.span
                    className="font-display font-black text-[#111318] text-[clamp(2.3rem,4vw,3.6rem)] leading-[0.98] tracking-tighter uppercase block"
                    initial={noMotion ? false : { opacity: 0, y: 70, clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
                    transition={{ duration: 0.9, delay: 0.27, ease: easeOut }}
                  >
                    Demanding
                  </motion.span>
                </div>
                <div className="overflow-hidden relative pb-2.5">
                  <motion.span
                    className="font-display font-black text-[#E8612C] text-[clamp(2.3rem,4vw,3.6rem)] leading-[0.98] tracking-tighter uppercase block"
                    initial={noMotion ? false : { opacity: 0, y: 70, clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
                    transition={{ duration: 0.9, delay: 0.39, ease: easeOut }}
                  >
                    Industries<span className="text-[#111318]">.</span>
                  </motion.span>
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-[#E8612C]"
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ duration: 0.6, delay: 1.0, ease: easeOut }}
                  />
                </div>
              </div>

              {/* Description */}
              <motion.p
                className="text-[#59616B] text-sm font-sans leading-relaxed max-w-md mb-10"
                initial={noMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: easeOut }}
              >
                Industrial flooring, access platforms, grating systems and engineered access solutions built for demanding industrial environments across Saudi and GCC.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 items-start mb-14"
                initial={noMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: easeOut }}
              >
                <Link
                  href="/contact"
                  className="group relative overflow-hidden inline-flex items-center gap-3 bg-[#E8612C] hover:bg-[#CF4D1B] text-white font-display text-xs font-bold uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 hover:scale-[1.02] shadow-sm"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 text-[#111318] hover:text-[#E8612C] font-display text-xs font-bold uppercase tracking-[0.15em] px-4 py-4 transition-all duration-300 border border-[#D9DDE1] hover:border-[#E8612C]"
                >
                  Explore Products
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                </Link>
              </motion.div>

              {/* Credentials */}
              <div className="relative pt-8 mt-8 border-t border-[#D9DDE1] overflow-hidden rounded-sm">
                {/* Subtle blueprint grid texture */}
                <div className="absolute inset-0 opacity-[0.015] tech-dot-grid-light pointer-events-none" />
                
                {/* Horizontal scan line */}
                {!noMotion && (
                  <motion.div
                    className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8612C]/8 to-transparent pointer-events-none"
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
                  />
                )}

                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-8 relative z-10 p-4 -m-4 rounded-sm"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.15
                      }
                    }
                  }}
                  initial={noMotion ? undefined : "hidden"}
                  whileInView={noMotion ? undefined : "visible"}
                  viewport={{ once: true, margin: "-50px 0px" }}
                >
                  {[
                    { value: '10+', label: 'Years in Saudi' },
                    { value: 'ISO 9001', label: 'Quality Certified' },
                    { value: '321+', label: 'Projects Delivered' },
                    { value: 'Saudi / GCC', label: 'Regional Coverage' },
                  ].map((stat, idx) => {
                    const isHighlighted = (isHoveredStat !== null ? isHoveredStat === idx : activeStatIndex === idx) && !noMotion;
                    const opacityVal = noMotion ? 1.0 : (isHighlighted ? 1.0 : 0.6);
                    const yVal = noMotion ? 0 : (isHighlighted ? -3 : 0);
                    const lineColor = noMotion ? '#D9DDE1' : (isHighlighted ? '#E8612C' : '#D9DDE1');
                    const lineHeight = isHighlighted ? '2px' : '1px';

                    const isNumeric = stat.value === '10+' || stat.value === '500+' || stat.value === '321+';
                    const targetVal = stat.value === '10+' ? 10 : (stat.value === '500+' || stat.value === '321+') ? 321 : 0;

                    return (
                      <motion.div
                        key={stat.label}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.6, ease: 'easeOut' }
                          }
                        }}
                        className="relative cursor-pointer select-none py-4 px-3 rounded-sm"
                        onMouseEnter={() => setIsHoveredStat(idx)}
                        onMouseLeave={() => setIsHoveredStat(null)}
                        animate={{
                          opacity: opacityVal,
                          y: yVal,
                          backgroundColor: isHighlighted ? '#111318' : 'rgba(17, 19, 24, 0)',
                          boxShadow: isHighlighted 
                            ? '0 6px 20px rgba(17, 19, 24, 0.15)' 
                            : '0 6px 20px rgba(0, 0, 0, 0)'
                        }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <span className={`block font-display font-black tracking-tighter whitespace-nowrap transition-colors duration-200 ${stat.value.length > 8 ? 'text-base sm:text-lg lg:text-xl' : 'text-xl sm:text-2xl'} ${isHighlighted ? 'text-white' : 'text-[#111318]'}`}>
                          {isNumeric ? (
                            <StatCounter value={stat.value} targetVal={targetVal} noMotion={!!noMotion} />
                          ) : (
                            stat.value
                          )}
                        </span>
                        <span className={`block font-mono text-[9px] uppercase tracking-widest mt-1 transition-colors duration-200 ${isHighlighted ? 'text-[#A3A9B0]' : 'text-[#59616B]'}`}>
                          {stat.label}
                        </span>
                        
                        <div 
                          className="absolute bottom-2 left-3 right-3 overflow-hidden" 
                          style={{ height: lineHeight }}
                        >
                          <motion.div
                            className="h-full"
                            style={{ 
                              originX: 0, 
                              backgroundColor: lineColor,
                              width: '100%' 
                            }}
                            initial={noMotion ? { scaleX: 1 } : { scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.15 + 0.1 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN — Integrated visual module */}
          <div className="flex flex-col gap-2 max-w-[580px] w-full">
            {/* Hero Visual Slideshow — 16:9 Aspect Ratio */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0D0F12] border border-[#D9DDE1] shadow-sm">
              {heroSlides.map((slide, idx) => {
                const isCurrent = activeHeroSlide === idx;
                return (
                  <motion.div
                    key={slide.src}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isCurrent ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                      priority={idx === 0}
                    />
                  </motion.div>
                );
              })}
              {/* Technical corner accents */}
              <div className="absolute top-4 left-4 border-t border-l border-[#D9DDE1] w-5 h-5 z-10" />
              <div className="absolute top-4 right-4 border-t border-r border-[#D9DDE1] w-5 h-5 z-10" />
              <div className="absolute top-4 left-12 z-10 flex items-center gap-1.5">
                <span className="font-mono text-[8px] text-[#E8612C] uppercase tracking-widest bg-white border border-[#D9DDE1] px-2 py-0.5 font-bold transition-all duration-300">
                  {heroSlides[activeHeroSlide]?.label}
                </span>
              </div>

              {/* Navigation dots on the bottom-right of the image */}
              <div className="absolute bottom-4 right-4 z-10 flex space-x-1.5 bg-[#111318]/70 px-2.5 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHeroSlide(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeHeroSlide === idx ? 'bg-[#E8612C] w-3.5' : 'bg-white/60'}`}
                    aria-label={`Go to hero slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* SVG Technical Drawing Panel — compact 240px height */}
            <div className="bg-white border border-[#D9DDE1] px-6 py-4 flex-col gap-2 h-[207px] flex justify-between">
              {/* Top parameters */}
              <div className="flex justify-between items-start font-mono text-[9px] text-[#59616B] uppercase tracking-widest">
                <div className="leading-relaxed">
                  SYSTEM STATUS:{' '}
                  <span className="text-[#E8612C]">ACTIVE</span>
                  <br />
                  GRID SPAN: 1200 × 3000 MM
                </div>
                <div className="text-right leading-relaxed">
                  DEVIATION: ±0.5MM
                  <br />
                  CODE: S235JR
                </div>
              </div>

              {/* Centered SVG drawing */}
              <div className="flex-1 flex items-center min-h-0 justify-center">
                <svg viewBox="0 0 500 130" className="w-full max-w-[420px] h-full" aria-hidden="true" style={{ overflow: 'visible' }}>
                  <line x1="50" y1="105" x2="450" y2="105" stroke="#D9DDE1" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="90" y1="25" x2="410" y2="25" stroke="#D9DDE1" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="50" y1="105" x2="90" y2="25" stroke="#D9DDE1" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="450" y1="105" x2="410" y2="25" stroke="#D9DDE1" strokeWidth="1" strokeDasharray="4 3" />
                  {Array.from({ length: 9 }).map((_, i) => {
                    const bx1 = 90 + i * 40;
                    const bx2 = 50 + i * 50;
                    return (
                      <motion.line
                        key={i}
                        x1={bx1} y1="25" x2={bx2} y2="105"
                        stroke="#D9DDE1" strokeWidth="1.2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.6, delay: 0.4 + i * 0.08 }}
                      />
                    );
                  })}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const hy = 25 + i * 26.7;
                    const hxL = 90 - i * 10;
                    const hxR = 410 + i * 10;
                    return (
                      <motion.line
                        key={i}
                        x1={hxL} y1={hy} x2={hxR} y2={hy}
                        stroke="#D9DDE1" strokeWidth="0.8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.4, delay: 0.2 + i * 0.1 }}
                      />
                    );
                  })}
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                    <line x1="38" y1="116" x2="462" y2="116" stroke="#E8612C" strokeWidth="0.8" />
                    <line x1="38" y1="112" x2="38" y2="120" stroke="#E8612C" strokeWidth="0.8" />
                    <line x1="462" y1="112" x2="462" y2="120" stroke="#E8612C" strokeWidth="0.8" />
                    <text x="250" y="128" fill="#E8612C" fontSize="7" textAnchor="middle" style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>SPAN: 3000 MM</text>
                  </motion.g>
                  <motion.line
                    x1="50" y1="20" x2="50" y2="110"
                    stroke="#E8612C" strokeWidth="1.5" opacity="0.65"
                    animate={{ x: [0, 400, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </div>

              {/* Bottom telemetry */}
              <div className="flex justify-between items-end border-t border-[#D9DDE1] pt-2.5">
                <div>
                  <span className="block font-mono text-[#59616B] text-[8px] uppercase tracking-widest">ACTIVE PARAMETER</span>
                  <span className="block font-mono text-[#E8612C] text-[10px] font-black tracking-wider uppercase mt-0.5">
                    {visSpecsList[visSpecIndex].label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[#59616B] text-[8px] uppercase tracking-widest">READ VALUE</span>
                  <span className="block font-mono text-[#111318] text-[10px] font-black tracking-wider uppercase mt-0.5">
                    {visSpecsList[visSpecIndex].val}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>


      {/* ─── 02 PRODUCTS ─── */}
      <section ref={productsRef} className="bg-[#F5F6F7] py-32 relative z-20 border-b border-[#D9DDE1]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* LEFT — sticky navigator */}
            <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-28">
              <div>
                <FadeUp delay={0.05}>
                  <span className="font-mono text-[#E8612C] text-[10px] uppercase tracking-[0.25em] block mb-4">
                    01 // PRODUCT CATALOG
                  </span>
                </FadeUp>
                <MaskReveal delay={0.1}>
                  <h2 className="font-display font-black text-[#111318] text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.92] tracking-tighter uppercase mb-6">
                    Engineered<br />For Every<br />Application.
                  </h2>
                </MaskReveal>
                <FadeUp delay={0.2}>
                  <p className="text-[#59616B] text-xs leading-relaxed max-w-sm">
                    From heavy-duty steel grating to lightweight FRP and aluminium systems, Arabian Gratings delivers access and flooring solutions for GCC industrial environments.
                  </p>
                </FadeUp>
              </div>

              {/* Category index */}
              <div className="space-y-6 pt-4 border-t border-[#D9DDE1]">
                {categories.map((cat, idx) => {
                  const isActive = isHoveredProd !== null ? isHoveredProd === idx : activeProdIndex === idx;
                  return (
                    <div
                      key={cat.id}
                      className="relative cursor-pointer transition-all duration-300 pl-4 select-none py-2"
                      onMouseEnter={() => setIsHoveredProd(idx)}
                      onMouseLeave={() => setIsHoveredProd(null)}
                      onClick={() => setActiveProdIndex(idx)}
                      style={{ transform: isActive ? 'translateX(10px)' : 'translateX(0)' }}
                    >
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-[#D9DDE1]">
                        <motion.div
                          className="w-full bg-[#E8612C]"
                          initial={{ height: '0%' }}
                          animate={{ height: isActive ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className={`block font-mono text-[9px] uppercase tracking-widest ${isActive ? 'text-[#E8612C]' : 'text-[#59616B]'}`}>
                        0{idx + 1} {'//'} SYSTEMS
                      </span>
                      <h3 className={`font-display font-black text-sm uppercase tracking-tight mt-0.5 ${isActive ? 'text-[#E8612C]' : 'text-[#111318]'}`}>
                        {cat.name}
                      </h3>
                    </div>
                  );
                })}
              </div>

              <FadeUp delay={0.35}>
                <Link href="/products" className="group inline-flex items-center gap-2 font-mono text-[10px] text-[#E8612C] uppercase tracking-widest hover:text-[#111318] transition-colors duration-300">
                  All Systems &rarr;
                </Link>
              </FadeUp>
            </div>

            {/* RIGHT — image stage + specs */}
            <div className="lg:col-span-7 space-y-6">

              {/* Product image */}
              <div className="relative w-full aspect-[4/3] min-h-[380px] sm:min-h-[460px] overflow-hidden bg-slate-100 border border-[#D9DDE1] shadow-sm">
                {categories.map((cat, idx) => {
                  const isActive = isHoveredProd !== null ? isHoveredProd === idx : activeProdIndex === idx;
                  const imgSrc = getImageUrl(cat.image?.file) || productImages[idx % productImages.length];
                  return (
                    <motion.div
                      key={cat.id}
                      className="absolute inset-0 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.9, ease: easeOut }}
                    >
                      <Image
                        src={imgSrc}
                        alt={cat.name}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                      {/* Subtle bottom gradient for text legibility only */}
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#111318]/55 to-transparent" />

                      {/* Top metadata */}
                      <div className="absolute top-4 left-4 font-mono text-white/75 text-[9px] uppercase tracking-widest leading-relaxed">
                        SYSTEM INDEX: 0{idx + 1} / 04<br />
                        REGULATORY: ISO 9001 APPROVED
                      </div>

                      <div className="absolute bottom-5 left-5">
                        <span className="block font-mono text-[#E8612C] text-[9px] uppercase tracking-widest mb-1">
                          PRODUCT TYPE // OVERVIEW
                        </span>
                        <h4 className="font-display font-black text-white text-xl sm:text-2xl uppercase tracking-tight">
                          {cat.name}
                        </h4>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Specs table */}
              <div className="bg-white border border-[#D9DDE1] p-5">
                <span className="block font-mono text-[#3F4750] text-[11px] font-semibold uppercase tracking-wide mb-4">
                  Technical Specifications &mdash; Active System
                </span>
                {categories.map((cat, idx) => {
                  const isActive = isHoveredProd !== null ? isHoveredProd === idx : activeProdIndex === idx;
                  const specs = productSpecs[cat.slug] ?? productSpecs['steel-gratings'];
                  if (!isActive) return null;
                  return (
                    <div key={cat.id} className="space-y-0">
                      {specs.map((spec, sIdx) => (
                        <motion.div
                          key={spec.label}
                          className="flex justify-between items-center py-3 border-b border-[#D9DDE1] last:border-0"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: sIdx * 0.1, ease: easeOut }}
                        >
                          <span className="font-mono text-[#3F4750] text-[11px] font-semibold uppercase tracking-wide">{spec.label}</span>
                          <span className="font-mono text-[#111318] text-[11px] uppercase tracking-wide font-semibold">{spec.value}</span>
                        </motion.div>
                      ))}
                      
                      {/* CTAs */}
                      <div className="flex gap-3 pt-5 border-t border-[#D9DDE1] mt-4">
                        <Link
                          href={`/products/${cat.slug}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#E8612C] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#CF4D1B] transition-colors"
                        >
                          View Products
                        </Link>
                        <Link
                          href="/contact"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-[#D9DDE1] text-[#111318] text-[10px] font-display font-bold uppercase tracking-widest hover:border-[#111318] transition-colors"
                        >
                          Contact Us
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS MARQUEE ─── */}
      <section className="bg-background py-16 border-b border-[#E5E7EB] overflow-hidden relative z-25">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 mb-8">
          <FadeUp delay={0.05}>
            <span className="font-mono text-[#E8612C] text-[9px] uppercase tracking-[0.25em] block mb-1">
              02 // Trusted Partners
            </span>
            <h2 className="font-display font-black text-foreground text-[clamp(1.6rem,3vw,2.6rem)] leading-none tracking-tighter uppercase">
              Trusted By Industry Leaders
            </h2>
          </FadeUp>
        </div>
        <div className="relative w-full overflow-hidden select-none py-4">
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee-infinite flex items-center gap-20 sm:gap-32 px-12">
            {partnerLogos.map((logo, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`pl1-${idx}`}
                src={logo}
                alt={`Partner ${idx + 1}`}
                className="h-24 w-auto max-w-[240px] object-contain transition-all duration-300 cursor-pointer flex-shrink-0 hover:scale-105"
              />
            ))}
            {partnerLogos.map((logo, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`pl2-${idx}`}
                src={logo}
                alt={`Partner ${idx + 1}`}
                className="h-24 w-auto max-w-[240px] object-contain transition-all duration-300 cursor-pointer flex-shrink-0 hover:scale-105"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 03 ENGINEERING INTRO ─── */}
      <section ref={introRef} className="bg-white py-32 relative z-10 border-b border-[#D9DDE1]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* LEFT */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
              <FadeUp delay={0.05}>
                <span className="font-mono text-[#E8612C] text-[10px] uppercase tracking-[0.25em] block">
                  03 // ENGINEERING &mdash; SAUDI / GCC
                </span>
              </FadeUp>
              <div className="w-12 h-[2px] bg-[#E8612C]/40" />
              <div className="space-y-2">
                <span className="block font-mono text-[#3F4750] text-[11px] font-medium uppercase tracking-wide leading-loose">
                  SYSTEM TYPE: STRUCTURAL SYSTEMS<br />
                  MATERIALS: STEEL / FRP / ALUMINIUM<br />
                  DESIGN BASE: SITE ENGINEERED ACCESS<br />
                  REGULATORY: GCC MUNICIPAL COMPLIANT
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-6">
                <MaskReveal delay={0.12}>
                  <h2 className="font-display font-black text-[#111318] text-[clamp(2.2rem,4.8vw,4rem)] leading-[0.95] tracking-tighter uppercase">
                    Engineered For<br />The Environments<br />That Demand More.
                  </h2>
                </MaskReveal>
                <FadeUp delay={0.25} className="max-w-2xl">
                  <p className="text-[#59616B] text-sm leading-relaxed">
                    Arabian Gratings supplies site-engineered platform floor structures to steel suppliers, fabricators, and engineering firms across the GCC. Each batch complies with structural safety ratios and local Saudi municipal specifications.
                  </p>
                </FadeUp>
              </div>

              {/* Material selector tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#D9DDE1]">
                {[
                  { id: 0, num: '01', title: 'STEEL', desc: 'CARBON & ALLOY' },
                  { id: 1, num: '02', title: 'FRP', desc: 'FIBERGLASS MATRIX' },
                  { id: 2, num: '03', title: 'ALUMINIUM', desc: 'LIGHTWEIGHT' },
                ].map((item) => {
                  const isActive = isHoveredMat !== null ? isHoveredMat === item.id : activeMatIndex === item.id;
                  return (
                    <div
                      key={item.id}
                      className="relative cursor-pointer transition-all duration-300 py-4 select-none"
                      onMouseEnter={() => setIsHoveredMat(item.id)}
                      onMouseLeave={() => setIsHoveredMat(null)}
                      style={{ transform: isActive ? 'translateX(8px)' : 'translateX(0)' }}
                    >
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-[#D9DDE1]">
                        <motion.div
                          className="w-full bg-[#E8612C]"
                          initial={{ height: '0%' }}
                          animate={{ height: isActive ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="pl-4">
                        <span className={`block font-mono text-[9px] uppercase tracking-widest ${isActive ? 'text-[#E8612C]' : 'text-[#59616B]'}`}>
                          {item.num} {'//'} SPEC
                        </span>
                        <h3 className={`font-display font-black text-lg uppercase tracking-tight mt-1 ${isActive ? 'text-[#E8612C]' : 'text-[#111318]'}`}>
                          {item.title}
                        </h3>
                        <span className="block font-sans text-[11px] text-[#59616B] uppercase tracking-wider mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 border border-[#D9DDE1]">
                {['/img/real2/new (1).jpeg', '/img/real1/img (8).jpeg', '/img/real2/new (2).jpeg'].map((imgSrc, idx) => {
                  const isActive = isHoveredMat !== null ? isHoveredMat === idx : activeMatIndex === idx;
                  return (
                    <motion.div
                      key={imgSrc}
                      className="absolute inset-0 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.8, ease: easeOut }}
                    >
                      <Image
                        src={imgSrc}
                        alt="Arabian Gratings structural material overview"
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 font-mono text-white/80 text-[9px] uppercase tracking-widest">
                        METRIC STABILITY // SAUDI
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 03 INDUSTRIES ─── */}
      <section ref={industriesRef} className="bg-[#0D0F12] py-32 relative z-20 overflow-hidden">

        {/* Subtle dot grid texture */}
        <div className="absolute inset-0 tech-dot-grid opacity-20 pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">

          {/* ── Header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 border-b border-white/10 pb-14">
            <div className="lg:max-w-2xl">
              <FadeUp delay={0.05}>
                <span className="font-mono text-[#E8612C] text-[10px] uppercase tracking-[0.25em] block mb-5">
                  03 // Industries &mdash; Saudi / GCC
                </span>
              </FadeUp>
              <MaskReveal delay={0.1}>
                <h2 className="font-display font-black text-white text-[clamp(2.8rem,5.5vw,5rem)] leading-[0.9] tracking-tighter uppercase">
                  Built For<br />Harsh<br />Atmospheres.
                </h2>
              </MaskReveal>
            </div>
            <div className="lg:max-w-xs space-y-6">
              <FadeUp delay={0.2}>
                <p className="text-white/50 text-sm leading-relaxed">
                  Engineered access systems for the most demanding environments across energy, infrastructure, marine, and industrial facilities in Saudi Arabia and GCC.
                </p>
              </FadeUp>
              <FadeUp delay={0.28}>
                <Link href="/industries" className="group inline-flex items-center gap-3 font-mono text-[10px] text-[#E8612C] uppercase tracking-widest hover:text-white transition-colors duration-300">
                  Explore All Industries
                  <span className="w-6 h-px bg-[#E8612C] group-hover:w-10 transition-all duration-300 block" />
                </Link>
              </FadeUp>
            </div>
          </div>

          {/* ── 2×2 Industry Cards Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {industries.map((ind, idx) => {
              const imgSrc = getImageUrl(ind.image?.file) || industryImages[idx % industryImages.length];
              const isActive = isHoveredInd === idx;
              const stats = [
                { val: '8,500+', unit: 'sqm Installed' },
                { val: '98%', unit: 'Client Retention' },
                { val: '15+', unit: 'Active Projects' },
                { val: '24hr', unit: 'Response Time' },
              ];
              return (
                <motion.div
                  key={ind.id}
                  className="relative overflow-hidden cursor-pointer group"
                  style={{ height: '380px' }}
                  onHoverStart={() => setIsHoveredInd(idx)}
                  onHoverEnd={() => setIsHoveredInd(null)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={imgSrc}
                      alt={ind.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Dark overlays */}
                  <div className="absolute inset-0 bg-[#0D0F12]/60 z-10 transition-opacity duration-500 group-hover:bg-[#0D0F12]/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F12]/95 via-[#0D0F12]/30 to-transparent z-10" />

                  {/* Left accent bar on hover */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#E8612C] z-20"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    style={{ originY: 0 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
                    {/* Top: number + tag */}
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[#E8612C] text-[11px] font-black tracking-widest">
                        0{idx + 1}
                      </span>
                      <span className="font-mono text-white/30 text-[9px] uppercase tracking-widest">
                        {stats[idx].val} {stats[idx].unit}
                      </span>
                    </div>

                    {/* Bottom: title + description + CTA */}
                    <div className="space-y-3">
                      <h3 className="font-display font-black text-white text-2xl uppercase tracking-tight leading-none">
                        {ind.name}
                      </h3>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                      >
                        <p className="font-sans text-white/65 text-xs leading-relaxed mb-4 max-w-sm">
                          {ind.short_description}
                        </p>
                        <Link
                          href={`/industries/${ind.slug}`}
                          className="inline-flex items-center gap-2 font-mono text-[10px] text-[#E8612C] uppercase tracking-[0.2em] hover:text-white transition-colors duration-200"
                        >
                          View Industry
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>

                      {/* Bottom progress bar when active */}
                      {isActive && (
                        <div className="h-[1px] bg-white/10 overflow-hidden mt-3">
                          <motion.div
                            className="h-full bg-[#E8612C]"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3, ease: 'linear' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Bottom Stats Strip ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-4 border border-white/10 overflow-hidden"
          >
            {[
              { num: '10+', target: 10, suffix: '+', label: 'Years in Saudi Arabia' },
              { num: '321+', target: 321, suffix: '+', label: 'Projects Delivered' },
              { num: '4', target: 4, suffix: '', label: 'Core Industries Served' },
              { num: 'ISO', target: 0, suffix: '', label: '9001 Certified Quality' },
            ].map((stat, idx) => {
              const isNumeric = stat.target > 0;
              const isActive = (isHoveredIndStat !== null ? isHoveredIndStat === idx : activeIndStatIndex === idx) && !noMotion;
              return (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="px-8 py-7 flex flex-col gap-1 cursor-pointer select-none relative overflow-hidden"
                  onMouseEnter={() => setIsHoveredIndStat(idx)}
                  onMouseLeave={() => setIsHoveredIndStat(null)}
                  animate={{
                    backgroundColor: isActive ? '#E8612C' : 'rgba(255, 255, 255, 0.04)',
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {/* Subtle active line indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 3.0, ease: 'linear' }}
                    />
                  )}

                  <span className="font-display font-black text-white text-3xl tracking-tighter block transition-transform duration-300 group-hover:scale-105">
                    {isNumeric ? (
                      <StatCounter value={stat.num} targetVal={stat.target} noMotion={!!noMotion} suffix={stat.suffix} />
                    ) : (
                      stat.num
                    )}
                  </span>
                  <motion.span
                    className="font-mono text-[9px] uppercase tracking-widest block"
                    animate={{
                      color: isActive ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.4)',
                    }}
                    transition={{ duration: 0.35 }}
                  >
                    {stat.label}
                  </motion.span>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ─── 05 CAPABILITIES ─── */}
      <section ref={capabilitiesRef} className="bg-[#F0F1F2] py-28 relative z-20">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <FadeUp delay={0.05}>
                <span className="font-mono text-[#E8612C] text-[10px] uppercase tracking-[0.25em] block mb-6">
                  04 // Quality Assurance
                </span>
              </FadeUp>
              <MaskReveal delay={0.12}>
                <h2 className="font-display font-black text-[#111318] text-[clamp(1.8rem,3.5vw,3rem)] leading-none tracking-tighter uppercase">
                  Built Around<br />Engineering<br />Precision.
                </h2>
              </MaskReveal>
              <FadeUp delay={0.3}>
                <p className="mt-6 text-[#59616B] text-sm leading-relaxed">
                  From raw material selection through to load testing and quality certification &mdash; every step is traceable and documented.
                </p>
              </FadeUp>
              <FadeUp delay={0.38}>
                <div className="mt-8 relative w-full aspect-[16/10] overflow-hidden bg-[#0D0F12] border border-[#D9DDE1] shadow-sm group">
                  <Image
                    src="/img/real2/new (8).jpeg"
                    alt="Real ISO 1461 zinc coating thickness verification on steel grating"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F12]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-[#E8612C] uppercase tracking-widest font-bold bg-[#0D0F12]/90 px-2 py-0.5 border border-[#E8612C]/30">
                      QA // 139 µm COATING TEST
                    </span>
                    <span className="font-mono text-white/70 text-[9px]">BS EN ISO 1461</span>
                  </div>
                </div>
              </FadeUp>
            </div>
            <div className="lg:col-span-8">
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10%' }}>
                {[
                  { num: '01', title: 'Materials Selection', detail: 'ASTM A36 / S355JR / ISO 898-1', sub: 'Carbon steel, alloy steel, stainless, and fiberglass matrix sourcing.' },
                  { num: '02', title: 'Fabrication Engineering', detail: 'Hydraulic Press Fusion', sub: 'Cross rods and load bars fused into single-piece floor sheets under hydraulic pressure.' },
                  { num: '03', title: 'Testing Standards', detail: 'BS EN 14122-2 / ASTM A985', sub: 'All panels verified against deflection metrics.' },
                  { num: '04', title: 'Surface Finishing', detail: 'ISO 1461 Hot-Dip Galvanizing', sub: 'Zinc coating parameters optimized to withstand seawater spray and chemical exposure.' },
                ].map((cap) => (
                  <motion.div
                    key={cap.num}
                    variants={staggerItem}
                    className="group border-t border-[#D9DDE1] py-7 grid grid-cols-12 gap-4 sm:gap-6 items-start transition-all duration-300 hover:border-[#E8612C]/50 cursor-default"
                    whileHover={noMotion ? {} : { x: 10 }}
                  >
                    <span className="col-span-1 font-mono text-[#E8612C]/70 text-xs pt-0.5 group-hover:translate-x-1 transition-transform duration-300">{cap.num}</span>
                    <div className="col-span-5 pr-4">
                      <h3 className="font-display font-black text-[#111318] text-base uppercase tracking-wide group-hover:text-[#E8612C] transition-colors duration-300">{cap.title}</h3>
                      <span className="font-mono text-[#59616B] text-[9px] uppercase tracking-widest mt-1 block">{cap.detail}</span>
                    </div>
                    <p className="col-span-6 font-sans text-[#59616B] text-xs leading-relaxed group-hover:opacity-100 opacity-85 transition-opacity duration-300">{cap.sub}</p>
                  </motion.div>
                ))}
                <div className="border-t border-[#D9DDE1]" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>



      {/* ─── 06 PROJECTS ─── */}
      <section ref={projectsRef} className="bg-[#f8fafc] py-28 relative z-20">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#D9DDE1] pb-8 mb-20">
            <div>
              <FadeUp delay={0.05}>
                <span className="font-mono text-[#E8612C] text-[10px] uppercase tracking-[0.25em] block mb-4">05 // Case Installations</span>
              </FadeUp>
              <MaskReveal delay={0.1}>
                <h2 className="font-display font-black text-[#111318] text-[clamp(2rem,4.5vw,3.5rem)] leading-none tracking-tighter uppercase">Selected Installations</h2>
              </MaskReveal>
            </div>
            <FadeUp delay={0.2}>
              <Link href="/projects" className="group inline-flex items-center gap-2 font-mono text-[10px] text-[#E8612C] uppercase tracking-widest mt-6 sm:mt-0 hover:text-[#111318] transition-colors duration-300">
                All Projects
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {projects.map((proj, idx) => {
              const imgSrc = getImageUrl(proj.featured_image?.file) || projectImages[idx % projectImages.length];
              const isFirst = idx === 0;
              return (
                <div key={proj.id} className={`group ${isFirst ? 'lg:col-span-7' : 'lg:col-span-5 lg:mt-24'}`}>
                  <ImageReveal
                    src={imgSrc}
                    alt={proj.title}
                    parallaxSpeed={0.04}
                    aspectClass={isFirst ? 'aspect-[16/10]' : 'aspect-[4/3]'}
                    className="mb-6"
                  />
                  <FadeUp delay={0.18 + idx * 0.1}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                        <span className="text-[#59616B]">{proj.project_date || 'Saudi Arabia'}</span>
                        <span className="text-[#59616B] text-right">{proj.location}</span>
                      </div>
                      <h3 className="font-display font-black text-[#111318] text-xl sm:text-2xl uppercase tracking-tight leading-tight group-hover:text-[#E8612C] transition-colors duration-300">
                        <Link href={`/projects/${proj.slug}`}>{proj.title}</Link>
                      </h3>
                      <p className="font-sans text-[#59616B] text-xs leading-relaxed">{proj.description}</p>
                      <Link href={`/projects/${proj.slug}`} className="group/link inline-flex items-center gap-2 font-mono text-[10px] text-[#E8612C] uppercase tracking-[0.2em] hover:gap-3 transition-all duration-300">
                        View Project
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </FadeUp>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 07 INSIGHTS ─── */}
      <section ref={insightsRef} className="bg-white py-28 border-t border-[#D9DDE1] relative z-20">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#D9DDE1] pb-8 mb-16">
            <div>
              <FadeUp delay={0.05}>
                <span className="font-mono text-[#E8612C] text-[10px] uppercase tracking-[0.25em] block mb-4">06 // Technical Reports</span>
              </FadeUp>
              <MaskReveal delay={0.1}>
                <h2 className="font-display font-black text-[#111318] text-[clamp(2rem,4.5vw,3.5rem)] leading-none tracking-tighter uppercase">Industry Insights</h2>
              </MaskReveal>
            </div>
            <FadeUp delay={0.2}>
              <Link href="/blog" className="group inline-flex items-center gap-2 font-mono text-[10px] text-[#E8612C] uppercase tracking-widest mt-6 sm:mt-0 hover:text-[#111318] transition-colors duration-300">
                Knowledge Hub
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {posts[0] && (() => {
              const imgSrc = getImageUrl(posts[0].featured_image?.file) || '/facility-overview.jpg';
              return (
                <FadeUp delay={0.1} className="lg:col-span-7">
                  <Link href={`/blog/${posts[0].slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F6F7] border border-[#D9DDE1] mb-6">
                      <Image
                        src={imgSrc}
                        alt={posts[0].title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/30 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8612C]" />
                    </div>
                    <div className="space-y-3">
                    <div className="flex items-center gap-4 font-mono text-[10px] text-[#59616B] uppercase tracking-widest">
                      <span>{posts[0].published_at}</span>
                      <span className="w-1 h-1 rounded-full bg-[#E8612C]" />
                      <span className="text-[#E8612C] font-bold">{posts[0].category?.name}</span>
                    </div>
                    <h3 className="font-display font-black text-[#111318] text-2xl sm:text-3xl leading-tight uppercase tracking-tight group-hover:text-[#E8612C] transition-colors duration-300">
                      {posts[0].title}
                    </h3>
                    <p className="font-sans text-[#59616B] text-sm leading-relaxed">{posts[0].excerpt}</p>
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] text-[#E8612C] uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </FadeUp>
            );
          })()}

            <div className="lg:col-span-5 flex flex-col gap-8">
              {posts.slice(1).map((post, i) => (
                <FadeUp key={post.id} delay={0.2 + i * 0.12}>
                  <Link href={`/blog/${post.slug}`} className="group block border-b border-[#D9DDE1] pb-7 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 font-mono text-[9px] text-[#59616B] uppercase tracking-widest mb-3">
                      <span>{post.published_at}</span>
                      <span className="text-[#E8612C] font-bold">{post.category?.name}</span>
                    </div>
                    <h4 className="font-display font-black text-[#111318] text-base sm:text-lg uppercase tracking-tight leading-tight group-hover:text-[#E8612C] transition-colors duration-300 mb-2">
                      {post.title}
                    </h4>
                    <p className="font-sans text-[#59616B] text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </Link>
                </FadeUp>
              ))}

              {/* Quality callout — light card (replaced old dark block) */}
              <FadeUp delay={0.4}>
                <div className="bg-[#F5F6F7] border border-[#D9DDE1] p-6">
                  <span className="font-mono text-[#E8612C] text-[9px] uppercase tracking-widest block mb-2">Standard // Quality</span>
                  <p className="font-sans text-[#59616B] text-xs leading-relaxed">
                    Mill Test Certificates (MTC) matching standard alloy classifications are enclosed with every delivery in the GCC region.
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 08 CTA — Intentional dark contrast section ─── */}
      <CtaSection />

    </div>
  );
}
