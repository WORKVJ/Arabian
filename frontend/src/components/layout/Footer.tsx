import Link from 'next/link';
import { Mail, MapPin, Factory } from 'lucide-react';
import Image from 'next/image';

const footerLinks = {
  company: [
    { name: 'Company Profile', href: '/about/company' },
    { name: 'Manufacturing', href: '/about/manufacturing' },
    { name: 'Quality Policy', href: '/about/quality' },
    { name: 'Certifications', href: '/about/certifications' },
  ],
  products: [
    { name: 'FRP Gratings', href: '/products' },
    { name: 'Steel Gratings', href: '/products' },
    { name: 'Stair Treads', href: '/products' },
    { name: 'Grating Clamps', href: '/products' },
  ],
  industries: [
    { name: 'Oil & Gas', href: '/industries' },
    { name: 'Water & Wastewater', href: '/industries' },
    { name: 'Marine & Offshore', href: '/industries' },
    { name: 'Infrastructure', href: '/industries' },
  ],
  resources: [
    { name: 'Knowledge Hub', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ]
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-slate-350 border-t border-slate-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Logo & Corporate Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <Image
                src="/img/logo.png"
                alt="Arabian Gratings Logo"
                width={160}
                height={38}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Engineered access solutions. High-performance steel, aluminum, and FRP/GRP gratings for industrial and civil infrastructure installations in Saudi Arabia and Middle East.
            </p>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <strong>Head Office:</strong> Jeddah, Saudi Arabia<br />
                  Othman Bin Afan Street, Jeddah 22234
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <strong>Branch:</strong> Dammam, Saudi Arabia<br />
                  Petromin Business Center, Dammam 32214
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <a href="mailto:sales@arabiangratings.com" className="hover:text-accent transition-colors">
                  sales@arabiangratings.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-white shrink-0 w-4">TEL</span>
                <a href="tel:+966126576896" className="hover:text-accent transition-colors font-mono">
                  +966 12 657 6896
                </a>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-3 sm:grid-cols-4">
            <div>
              <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4 font-display">Company</h3>
              <ul className="space-y-2 text-xs">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-accent transition-colors text-slate-400">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4 font-display">Products</h3>
              <ul className="space-y-2 text-xs">
                {footerLinks.products.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-accent transition-colors text-slate-400">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4 font-display">Industries</h3>
              <ul className="space-y-2 text-xs">
                {footerLinks.industries.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-accent transition-colors text-slate-400">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-4 font-display">Resources</h3>
              <ul className="space-y-2 text-xs">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-accent transition-colors text-slate-400">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Copyright & Legal Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p className="mb-4 sm:mb-0">
            &copy; {currentYear} Arabian Gratings Saudi Arabia. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-slate-400">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
