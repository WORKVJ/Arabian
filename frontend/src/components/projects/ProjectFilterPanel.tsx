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
    <div className="space-y-4">
      {/* Industry Sector Filter */}
      {industries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              Industry Sector
            </span>
            {isFiltered && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-600 hover:text-amber-700 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by industry">
            <button
              onClick={() => setParam('industry', '')}
              aria-pressed={!currentIndustry}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                !currentIndustry
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
              }`}
            >
              All Sectors
            </button>
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setParam('industry', currentIndustry === ind.slug ? '' : ind.slug)}
                aria-pressed={currentIndustry === ind.slug}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  currentIndustry === ind.slug
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                }`}
              >
                {ind.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Category Filter (Sleek dropdown + quick pills) */}
      {products.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
            Product Line:
          </span>
          <div className="relative min-w-[240px] max-w-xs">
            <select
              value={currentProduct}
              onChange={(e) => setParam('product', e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition cursor-pointer"
            >
              <option value="">All Products ({products.length} categories)</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.slug}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>

          {currentProduct && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-800">
              <span>{products.find(p => p.slug === currentProduct)?.name || currentProduct}</span>
              <button
                onClick={() => setParam('product', '')}
                className="hover:text-rose-600 transition p-0.5"
                title="Remove product filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
