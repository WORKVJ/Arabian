'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 p-3 bg-[#111318] text-white border border-[#E8612C]/40 hover:border-[#E8612C] shadow-lg rounded-none group flex items-center gap-1.5 transition-colors duration-300"
          aria-label="Scroll to top of page"
        >
          <ChevronUp className="w-4 h-4 text-[#E8612C] transition-transform duration-300 group-hover:-translate-y-0.5" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/80 group-hover:text-white hidden sm:inline-block pr-1 font-bold">
            TOP
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
