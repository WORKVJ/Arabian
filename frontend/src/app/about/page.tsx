import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/animations/Reveal';
import { ArrowRight, ShieldCheck, Award, Users, HardHat, CheckCircle2 } from 'lucide-react';
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
            <span className="text-[10px] font-mono font-bold text-[#E8612C] tracking-[0.3em] uppercase block mb-4">
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
              <div className="border border-[#D9DDE1] p-6 hover:border-[#E8612C] transition-colors duration-300 h-full flex flex-col">
                <item.icon className="w-6 h-6 text-[#E8612C] mb-4 shrink-0" />
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

      {/* Editorial Content Block with Real Plant Image */}
      <section className="border-t border-[#D9DDE1] py-20 bg-[#F7F8F9]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Reveal direction="left" delay={0.1}>
                <span className="text-[9px] font-mono text-[#E8612C] tracking-widest uppercase block mb-2">
                  01 // Harsh Climates & High Loads
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-[#111318] uppercase tracking-wide leading-tight">
                  Fabricated for Demanding Coastal & Desert Climates
                </h2>
              </Reveal>
              <div className="space-y-4 text-xs text-[#6B7280] leading-relaxed">
                <Reveal direction="up" delay={0.15}>
                  <p>
                    Industrial facilities in the GCC face challenging atmospheric conditions, including elevated ambient temperatures, marine moisture, and chemical exposure. Arabian Gratings supplies floor gratings designed to mitigate structural deterioration.
                  </p>
                  <p>
                    Our hot-dip galvanization thickness matches international standards, ensuring longevity in salt-spray marine zones. For corrosive chemical plants and desalination works, our FRP/GRP moulded grids offer complete non-conductive, fire-retardant structural alternatives.
                  </p>
                  <div className="pt-3 grid grid-cols-2 gap-4">
                    <div className="border-l-2 border-[#E8612C] pl-3">
                      <span className="font-mono text-[10px] text-[#111318] font-bold block uppercase">139 µm Coating</span>
                      <span className="text-[11px] text-[#59616B]">Exceeds ISO 1461 requirements</span>
                    </div>
                    <div className="border-l-2 border-[#E8612C] pl-3">
                      <span className="font-mono text-[10px] text-[#111318] font-bold block uppercase">100% Traceable</span>
                      <span className="text-[11px] text-[#59616B]">Mill certified batch tracking</span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Reveal direction="right" delay={0.2}>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0D0F12] border border-[#D9DDE1] shadow-md group">
                  <Image
                    src="/img/real1/img (13).jpeg"
                    alt="Real industrial piping and safety grating platforms in Saudi industrial facility"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F12]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#E8612C] font-bold bg-[#0D0F12]/90 px-2.5 py-1 border border-[#E8612C]/30">
                      OPERATIONAL PLATFORM // SAUDI ARABIA
                    </span>
                    <span className="font-mono text-[9px] text-white/70">ISO 9001 / BS EN 14122</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Real Operations & Verification Gallery */}
      <section className="py-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#D9DDE1]">
        <div className="mb-14">
          <Reveal direction="up" delay={0.05}>
            <span className="text-[9px] font-mono text-[#E8612C] tracking-widest uppercase block mb-3">
              02 // Field Operations & Verification
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#111318] uppercase tracking-tight leading-none">
              Client Sites & Certified Quality
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              img: '/img/real1/img (8).jpeg',
              tag: 'MARINE WALKWAYS',
              title: 'On-Site Catwalk Assessment',
              desc: 'Direct field inspection on heavy container crane catwalks installed over coastal seawater.',
              badge: 'KING ABDULAZIZ PORT',
            },
            {
              img: '/img/real2/new (1).jpeg',
              tag: 'PRODUCTION CONTROL',
              title: 'Batch Coded Fabrication',
              desc: 'Every stack of hot-dip galvanized panels carries reference markings for complete project traceability.',
              badge: 'REF#01 // 40 PCS BUNDLES',
            },
            {
              img: '/img/real2/new (8).jpeg',
              tag: 'QA / COATING VERIFICATION',
              title: 'Calibrated Thickness Testing',
              desc: 'Digital gauge measurements confirming 139 µm zinc protection to exceed regional marine lifetime specs.',
              badge: 'BS EN ISO 1461 // 139 µm',
            },
          ].map((card, i) => (
            <Reveal key={card.title} direction="up" delay={i * 0.1}>
              <div className="border border-[#D9DDE1] bg-white overflow-hidden group hover:border-[#E8612C] transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0D0F12]">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="font-mono text-[8px] font-bold text-[#E8612C] bg-[#0D0F12]/90 border border-[#E8612C]/30 px-2 py-0.5 tracking-wider uppercase">
                      {card.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-3 z-10">
                    <span className="font-mono text-[8px] text-white/80 bg-black/60 px-2 py-0.5 tracking-widest uppercase">
                      {card.badge}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-display font-black text-[#111318] text-base uppercase tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#111318] py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-6">
          <span className="text-[9px] font-mono text-[#E8612C] tracking-[0.3em] uppercase block">
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
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#E8612C] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#CF4D1B] transition-colors"
            >
              Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
