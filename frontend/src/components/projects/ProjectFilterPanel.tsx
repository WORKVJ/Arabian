'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Industry, ProductListItem } from '@/types';
import { motion } from 'framer-motion';

interface ProjectFilterPanelProps {
  industries: Industry[];
  products: ProductListItem[];
}

export default function ProjectFilterPanel({ industries, products }: ProjectFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentIndustry = searchParams.get('industry') || '';
  const currentProduct = searchParams.get('product') || '';

  const isFiltered = currentIndustry || currentProduct;

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/projects?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => router.push('/projects', { scroll: false });

  return (
    <div className="space-y-6">
      {/* Industry filter */}
      {industries.length > 0 && (
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-grey uppercase tracking-wider block mb-2">
            Filter by Industry Sector
          </span>
          <div className="flex flex-wrap gap-2 relative" role="group" aria-label="Filter by industry">
            <button
              onClick={() => setParam('industry', '')}
              aria-pressed={!currentIndustry}
              className={`relative px-4 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent z-10 cursor-pointer ${
                !currentIndustry ? 'text-white' : 'text-slate-650 bg-white border border-border-color hover:bg-slate-50'
              }`}
            >
              {!currentIndustry && (
                <motion.span
                  layoutId="activeIndustryBg"
                  className="absolute inset-0 bg-accent rounded-sm z-[-1]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              All Sectors
            </button>
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setParam('industry', currentIndustry === ind.slug ? '' : ind.slug)}
                aria-pressed={currentIndustry === ind.slug}
                className={`relative px-4 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent z-10 cursor-pointer ${
                  currentIndustry === ind.slug ? 'text-white' : 'text-slate-650 bg-white border border-border-color hover:bg-slate-50'
                }`}
              >
                {currentIndustry === ind.slug && (
                  <motion.span
                    layoutId="activeIndustryBg"
                    className="absolute inset-0 bg-accent rounded-sm z-[-1]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {ind.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product filter */}
      {products.length > 0 && (
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-grey uppercase tracking-wider block mb-2">
            Filter by Product Range
          </span>
          <div className="flex flex-wrap gap-2 relative" role="group" aria-label="Filter by product">
            <button
              onClick={() => setParam('product', '')}
              aria-pressed={!currentProduct}
              className={`relative px-4 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent z-10 cursor-pointer ${
                !currentProduct ? 'text-white' : 'text-slate-650 bg-white border border-border-color hover:bg-slate-50'
              }`}
            >
              {!currentProduct && (
                <motion.span
                  layoutId="activeProductBg"
                  className="absolute inset-0 bg-accent rounded-sm z-[-1]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              All Products
            </button>
            {products.map((prod) => (
              <button
                key={prod.id}
                onClick={() => setParam('product', currentProduct === prod.slug ? '' : prod.slug)}
                aria-pressed={currentProduct === prod.slug}
                className={`relative px-4 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent z-10 cursor-pointer ${
                  currentProduct === prod.slug ? 'text-white' : 'text-slate-650 bg-white border border-border-color hover:bg-slate-50'
                }`}
              >
                {currentProduct === prod.slug && (
                  <motion.span
                    layoutId="activeProductBg"
                    className="absolute inset-0 bg-accent rounded-sm z-[-1]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {prod.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters indicator */}
      {isFiltered && (
        <div className="pt-2 border-t border-border-color">
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-accent hover:text-accent-hover uppercase tracking-wider cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear All Active Filters
          </button>
        </div>
      )}
    </div>
  );
}
