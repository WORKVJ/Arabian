'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { ProductCategory } from '@/types';
import { motion } from 'framer-motion';

interface FilterPanelProps {
  categories: ProductCategory[];
}

export default function FilterPanel({ categories }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  const [searchVal, setSearchVal] = useState(currentSearch);

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) {
      params.set('search', searchVal.trim());
    } else {
      params.delete('search');
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchVal('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-md">
        <input
          type="text"
          placeholder="Search product range..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-border-color rounded-sm bg-white text-xs text-foreground focus:outline-none focus:border-accent font-sans"
        />
        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        {searchVal && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 p-1 rounded-sm hover:bg-slate-50 text-slate-400 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 relative" aria-label="Product categories filter">
        <button
          onClick={() => handleCategorySelect('')}
          className={`relative px-4 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent z-10 cursor-pointer ${
            !currentCategory ? 'text-white' : 'text-slate-650 bg-white border border-border-color hover:bg-slate-50'
          }`}
        >
          {!currentCategory && (
            <motion.span
              layoutId="activeProductCategoryBg"
              className="absolute inset-0 bg-accent rounded-sm z-[-1]"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`relative px-4 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent z-10 cursor-pointer ${
              currentCategory === cat.slug ? 'text-white' : 'text-slate-650 bg-white border border-border-color hover:bg-slate-50'
            }`}
          >
            {currentCategory === cat.slug && (
              <motion.span
                layoutId="activeProductCategoryBg"
                className="absolute inset-0 bg-accent rounded-sm z-[-1]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
