import { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import { ArrowRight, ShieldCheck, Award, Users, HardHat } from 'lucide-react';
import { defaultMetadata } from '@/lib/seo/config';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'About Arabian Gratings | Industrial Grating Manufacturer Saudi Arabia',
  description: 'Arabian Gratings is a premier manufacturer and supplier of heavy-duty metal and FRP/GRP grating systems in Saudi Arabia and wider GCC region.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Hero */}
      <section className="pt-28 pb-16 border-b border-[#D9DDE1] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(#111318 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" delay={0.1}>
            <span className="text-[10px] font-mono font-bold text-[#1E3A5F] tracking-[0.3em] uppercase block mb-4">
              Company Overview // Saudi Arabia
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#111318] uppercase leading-tight tracking-tight max-w-3xl mb-5">
              Pioneering Grating Systems in the GCC.
            </h1>
            <p className="text-sm text-[#6B7280] max-w-2xl leading-relaxed">
              Based in Saudi Arabia, Arabian Gratings manufactures and distributes premium metal and fiberglass reinforced plastic (GRP/FRP) grating solutions. We partner with the region&apos;s leading developers, contractors, and industrial plants to deliver certified floor and access systems.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Corporate Pillars */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: HardHat,
              title: 'Engineering Rigor',
              desc: 'Every floor grid is designed for specific load spans and deflection limits, backed by certified load test reports.',
            },
            {
              icon: ShieldCheck,
              title: 'Premium Materials',
              desc: 'From ISO 1461 hot-dip galvanization to chemical-grade vinyl ester GRP resins, we compile with international standards.',
            },
            {
              icon: Award,
              title: 'Certified Production',
              desc: 'All structural components undergo testing to ensure compliance with EN, BS, and ASTM standards.',
            },
            {
              icon: Users,
              title: 'GCC Footprint',
              desc: 'Strategically located in Saudi Arabia to support infrastructure, desalination, oil & gas, and marine operations regionwide.',
            },
          ].map((item, idx) => (
            <Reveal key={item.title} direction="up" delay={idx * 0.08}>
              <div className="border border-[#D9DDE1] p-6 hover:border-[#1E3A5F] transition-colors duration-300 h-full flex flex-col">
                <item.icon className="w-6 h-6 text-[#1E3A5F] mb-4 shrink-0" />
                <h3 className="text-sm font-display font-black uppercase text-[#111318] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed flex-1">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Editorial Content Block */}
      <section className="border-t border-[#D9DDE1] py-20 bg-[#F7F8F9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <Reveal direction="left" delay={0.1}>
                <span className="text-[9px] font-mono text-[#1E3A5F] tracking-widest uppercase block mb-2">
                  01 // Infrastructure
                </span>
                <h2 className="text-2xl font-display font-black text-[#111318] uppercase tracking-wide leading-tight">
                  Fabricated for Demanding Climates
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 space-y-4 text-xs text-[#6B7280] leading-relaxed">
              <Reveal direction="up" delay={0.15}>
                <p>
                  Industrial facilities in the GCC face challenging atmospheric conditions, including elevated ambient temperatures, marine moisture, and chemical exposure. Arabian Gratings supplies floor gratings designed to mitigate structural deterioration.
                </p>
                <p>
                  Our hot-dip galvanization thickness matches international standards, ensuring longevity in salt-spray marine zones. For corrosive chemical plants and desalination works, our FRP/GRP moulded grids offer complete non-conductive, fire-retardant structural alternatives.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#111318] py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-6">
          <span className="text-[9px] font-mono text-[#1E3A5F] tracking-[0.3em] uppercase block">
            Partner with Arabian Gratings
          </span>
          <h2 className="text-3xl font-display font-black uppercase leading-tight">
            Consult Our Engineering Desk
          </h2>
          <p className="text-xs text-[#9CA3AF] max-w-lg mx-auto leading-relaxed">
            Get structural drawings reviewed, deflection ratios calculated, or load parameter spans confirmed for your GCC project.
          </p>
          <div className="flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#1E3A5F] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#142838] transition-colors"
            >
              Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
