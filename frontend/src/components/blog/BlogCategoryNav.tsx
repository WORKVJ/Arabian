'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

interface BlogCategoryNavProps {
  categories: BlogCategory[];
}

export default function BlogCategoryNav({ categories }: BlogCategoryNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset pagination on category change
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  if (categories.length === 0) return null;

  return (
    <nav aria-label="Blog categories" className="flex flex-wrap gap-2 relative">
      <button
        onClick={() => setCategory('')}
        aria-pressed={!currentCategory}
        className={`relative px-4 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent z-10 cursor-pointer ${
          !currentCategory ? 'text-white' : 'text-slate-650 bg-white border border-border-color hover:bg-slate-50'
        }`}
      >
        {!currentCategory && (
          <motion.span
            layoutId="activeCategoryBg"
            className="absolute inset-0 bg-accent rounded-sm z-[-1]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        All
      </button>
      
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(currentCategory === cat.slug ? '' : cat.slug)}
          aria-pressed={currentCategory === cat.slug}
          className={`relative px-4 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent z-10 cursor-pointer ${
            currentCategory === cat.slug ? 'text-white' : 'text-slate-650 bg-white border border-border-color hover:bg-slate-50'
          }`}
        >
          {currentCategory === cat.slug && (
            <motion.span
              layoutId="activeCategoryBg"
              className="absolute inset-0 bg-accent rounded-sm z-[-1]"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          {cat.name}
        </button>
      ))}

      {/* Static category links for SEO — visible to crawlers */}
      <div className="sr-only" aria-hidden="true">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/blog/category/${cat.slug}`}>{cat.name}</Link>
        ))}
      </div>
    </nav>
  );
}
