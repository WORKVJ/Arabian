'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const noMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products', isDropdown: true },
    { name: 'Industries', href: '/industries' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
  ];

  const productDropdownItems = [
    { name: 'FRP / GRP Products', href: '/products/frp-grp-products' },
    { name: 'Steel Gratings', href: '/products/steel-gratings' },
    { name: 'Stainless Steel Products', href: '/products/stainless-steel-products' },
    { name: 'Aluminium Solutions', href: '/products/aluminium' },
    { name: 'Manhole Covers', href: '/products/manhole' },
    { name: 'SS/GI Grating Clamps', href: '/products/ss-gi-grating-clamps' },
    { name: 'Step Irons', href: '/products/step-iron' },
    { name: 'Tactile Studs', href: '/products/stud-products' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 border-b border-[#E5E7EB] backdrop-blur-md ${
        scrolled ? 'py-2.5 shadow-md shadow-slate-100/50' : 'py-3'
      }`}
      style={{
        transition: 'padding 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <nav className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-8 flex items-center justify-between gap-6">
        {/* LOGO */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <Image
              src="/img/logo.png"
              alt="Arabian Gratings Logo"
              width={160}
              height={38}
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-102 brightness-0"
              priority
            />
          </Link>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="flex items-center space-x-4 xl:space-x-5">
            {menuItems.map((item) => {
              const isPageActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              if (item.isDropdown) {
                return (
                  <div key={item.name} className="relative group/dropdown py-2">
                    <Link
                      href={item.href}
                      className={`relative font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                        isPageActive ? 'text-[#E8612C]' : 'text-[#111318]/80 hover:text-[#111318]'
                      }`}
                    >
                      {item.name}
                      <span className="text-[8px] transition-transform duration-300 group-hover/dropdown:rotate-180">&#9662;</span>
                      <span
                        className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E8612C] transition-all duration-300 group-hover/dropdown:w-full"
                        style={isPageActive ? { width: '100%' } : {}}
                      />
                    </Link>

                    {/* Desktop Hover Dropdown Panel */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 pt-2 opacity-0 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:pointer-events-auto transition-all duration-200">
                      <div className="bg-white border border-[#E5E7EB] rounded-sm shadow-xl p-2 flex flex-col">
                        {productDropdownItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:text-[#E8612C] hover:bg-slate-50 px-3 py-2 transition-colors rounded-sm"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`relative font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors py-2 block ${
                      isPageActive ? 'text-[#E8612C]' : 'text-[#111318]/80 hover:text-[#111318]'
                    }`}
                  >
                    {item.name}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E8612C] transition-all duration-300 group-hover:w-full"
                      style={isPageActive ? { width: '100%' } : {}}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT CTA */}
        <div className="hidden lg:block shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#E8612C] hover:bg-[#CF4D1B] text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:translate-y-[-1px] shadow-sm"
          >
            <span>Contact Us &rarr;</span>
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 text-[#111318] hover:text-[#E8612C] focus:outline-none transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 bg-white flex flex-col p-6 overflow-y-auto border-t border-[#E5E7EB]"
            style={{ top: '60px', height: 'calc(100vh - 60px)' }}
            initial={noMotion ? {} : { opacity: 0, y: 15 }}
            animate={noMotion ? {} : { opacity: 1, y: 0 }}
            exit={noMotion ? {} : { opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex flex-col space-y-6 pt-4">
              {menuItems.map((item, idx) => {
                if (item.isDropdown) {
                  return (
                    <div key={item.name} className="border-b border-[#E5E7EB] pb-4">
                      <div className="flex items-center gap-3 font-sans text-base font-black uppercase tracking-wider text-[#111318] mb-3">
                        <span className="font-mono text-xs text-[#E8612C]">0{idx + 1}</span>
                        <span>{item.name}</span>
                      </div>
                      <div className="pl-6 flex flex-col space-y-3.5 border-l border-[#E5E7EB]">
                        {productDropdownItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="font-sans text-xs font-bold uppercase tracking-wider text-[#59616B] hover:text-[#E8612C] transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.name} className="border-b border-[#E5E7EB] pb-4">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 font-sans text-base font-black uppercase tracking-wider text-[#111318] hover:text-[#E8612C] transition-colors"
                    >
                      <span className="font-mono text-xs text-[#E8612C]">0{idx + 1}</span>
                      <span>{item.name}</span>
                    </Link>
                  </div>
                );
              })}

              <div className="pt-6">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-4 py-4 font-sans text-xs font-bold uppercase tracking-widest text-white bg-[#E8612C] hover:bg-[#CF4D1B] transition-colors rounded-[2px]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
