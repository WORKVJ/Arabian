'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';
  const [value, setValue] = useState(currentSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    router.push(`/blog?${params.toString()}`);
  };

  const clearSearch = () => {
    setValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('page');
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="relative flex w-full max-w-md">
      <label htmlFor="blog-search" className="sr-only">Search articles</label>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          id="blog-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-9 pr-10 py-2.5 text-sm border border-border-color rounded-l bg-white text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-r transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
      >
        Search
      </button>
    </form>
  );
}
