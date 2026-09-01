import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import { ArrowLeft, Home, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-24 pb-16 px-4">
      <div className="max-w-md w-full text-center space-y-8 border border-border-color p-8 md:p-12 bg-white rounded-sm shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] tech-grid-overlay" />
        
        <Reveal direction="up" delay={0.1}>
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-8 h-8" />
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <span className="text-[10px] font-mono font-bold text-accent tracking-[0.25em] uppercase block mb-2">
            Error Code 404 // Not Found
          </span>
          <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wide mb-4">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed font-sans mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Verify the URL or navigate back to safety.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.2}>
          <div className="flex flex-col gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white text-[10px] font-display font-bold uppercase tracking-widest transition-colors w-full rounded-sm shadow-sm"
            >
              Browse Product Catalogue
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-border-color text-foreground text-[10px] font-display font-bold uppercase tracking-widest bg-white hover:bg-slate-50 transition-colors w-full rounded-sm"
            >
              <Home className="w-3.5 h-3.5" /> Return to Homepage
            </Link>
          </div>
        </Reveal>

        <div className="pt-4 border-t border-border-color">
          <Link
            href="/contact"
            className="text-[10px] font-mono font-bold text-slate-400 hover:text-accent transition-colors uppercase tracking-wider inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Contact Support Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
