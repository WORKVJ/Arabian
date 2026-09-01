import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, MapPin, Building } from 'lucide-react';
import Reveal from '@/components/animations/Reveal';

export const revalidate = 86400;

export async function generateStaticParams() {
  return Object.keys(LOCATIONS).map((slug) => ({ slug }));
}

interface LocationData {
  name: string;
  title: string;
  seoDescription: string;
  intro: string;
  projectContext: string;
  industries: string[];
  faqs: { question: string; answer: string }[];
  products: { name: string; slug: string; desc: string }[];
}

const LOCATIONS: Record<string, LocationData> = {
  'dubai': {
    name: 'Dubai',
    title: 'Industrial Grating Systems Supplier in Dubai | Arabian Gratings',
    seoDescription: 'Premium steel, GRP, and aluminium gratings supplier to Dubai, GCC. Serving commercial infrastructure, municipal roads, and metro access layouts.',
    intro: 'Dubai stands as the primary logistics and commercial hub of the Middle East, requiring state-of-the-art access systems. Arabian Gratings supplies precision-fabricated structural floor grids, architectural facade panels, and drainage manhole covers designed to fit the demanding architectural standards and fast-paced commercial developments across Dubai and the surrounding free zones.',
    projectContext: 'Our access panels are commonly specified for commercial skyscrapers, airport utility basements, metro station service rooms, and district cooling plants. We provide anodized aluminium facade systems and premium stainless steel safety grates for luxury architectural sites, ensuring clean aesthetic integration alongside structural load limits.',
    industries: [
      'Commercial Real Estate & Mixed-Use Infrastructure',
      'Urban Transport & Metro Utility Expansion Projects',
      'District Cooling & Sustainable Water Networks',
      'Retail & Airport Passenger Terminal Services'
    ],
    products: [
      { name: 'Aluminium Access Grating Walkway', slug: 'landscape-aluminium', desc: 'Lightweight, non-sparking walkways ideal for architectural facades and sunscreens.' },
      { name: 'Stainless Steel SS316 Floor Grating', slug: 'stainless-steel-ss316-floor-grating', desc: 'Hygienic, corrosion-resistant SS316 grids for commercial kitchens and high-end facades.' },
      { name: 'Stainless Steel Tactile Stud', slug: 'stainless-steel-tactile-stud', desc: 'Compliant tactile warning studs for pedestrian accessibility in metro zones and transit ports.' }
    ],
    faqs: [
      {
        question: 'Are tactile studs compliant with Dubai Universal Design Code?',
        "answer": 'Yes. Our stainless steel tactile warning studs are fully tested to conform to ISO 23599 and the Dubai Universal Design Code guidelines, ensuring compliant visual and tactile contrast at platform edges and stairwells.'
      },
      {
        question: 'What is the delivery timeline for projects in Dubai JAFZA or DAFZA?',
        "answer": 'We maintain stock parameters for standard electroforged steel panel sizes and GRP walkway meshes, allowing delivery within 2-4 working days to Dubai industrial zones. Custom fabrications require structural shop drawing review before production allocation.'
      }
    ]
  },
  'abu-dhabi': {
    name: 'Abu Dhabi',
    title: 'Heavy-Duty Steel & GRP Grating Supplier in Abu Dhabi | Arabian Gratings',
    seoDescription: 'Certified heavy-duty electroforged steel and Moulded GRP walkway grating supplier in Abu Dhabi, Mussafah and Ruwais refineries. ISO 1461 galvanized.',
    intro: 'Abu Dhabi contains the bulk of the regional energy and heavy industrial sectors, demanding access flooring with extreme chemical and load capabilities. Arabian Gratings supplies ISO 1461 hot-dip galvanized steel panels and vinyl ester GRP molded grids built to operate reliably in highly corrosive offshore drill platforms, oil refineries, and desalination zones.',
    projectContext: 'Our steel and composite structural platforms are engineered for extreme load spans. We support energy sector tenders in Mussafah Industrial Area, Ruwais Refinery utility corridors, and offshore gas processing platforms. Materials are supplied with complete raw material test certs and chemical load charts.',
    industries: [
      'Upstream Oil & Gas / Offshore Drill Platforms',
      'Petrochemical Refining & Downstream Utility Yards',
      'Seawater Desalination Plants & Intake Structures',
      'Heavy Industrial Smelters & Chemical Storage Areas'
    ],
    products: [
      { name: 'Electroforged Welded Steel Grating', slug: 'electroforged-welded-steel-grating', desc: 'ISO 1461 galvanized heavy-duty panels for intense loading spans.' },
      { name: 'Moulded GRP Walkway Grating', slug: 'molded-gratings', desc: 'Chemical-immune composite floor grids with anti-slip silicon carbide grit surfaces.' },
      { name: 'M-Clip Grating Fastening Clamp', slug: 'm-clip-grating-fastening-clamp', desc: 'Marine-grade SS316 clamping fasteners to secure panels without hot-work drilling.' }
    ],
    faqs: [
      {
        question: 'Do you supply certified raw material test certificates for Ruwais/Mussafah sites?',
        "answer": 'Yes, all shipments for oil and gas or infrastructure sites in Abu Dhabi are accompanied by mill test certificates, ISO 1461 galvanization thickness reports, and load-span test data matching ASTM standards.'
      },
      {
        question: 'Why is vinyl ester GRP specified over standard polyester in Abu Dhabi?',
        "answer": 'Vinyl ester resin offers enhanced chemical resistance to concentrated acids, chlorine, and hot salt-spray splash zones, making it the required standard for Abu Dhabi desalination and acid processing platforms.'
      }
    ]
  },
  'sharjah': {
    name: 'Sharjah',
    title: 'Industrial Grating and Drainage Supplier in Sharjah | Arabian Gratings',
    seoDescription: 'Ductile iron manhole covers, step irons, and industrial steel gratings supplier in Sharjah. Supplying Hamriyah Free Zone and Sajja industrial yards.',
    intro: 'Sharjah functions as a major manufacturing, shipping, and dry dock hub within the northern emirates. Arabian Gratings provides municipal-approved ductile iron access covers, sewer step irons, and heavy-duty steel trench covers to match the active industrial operations and logistics facilities across Sajja and Hamriyah Free Zone.',
    projectContext: 'We provide heavy-traffic D400 ductile iron cover plates and sewer utility step irons to municipalities, logistics terminals, and marine shipyards. Our products ensure safe access to stormwater drainage basins, utility shafts, and industrial storage yards with extreme environmental durability.',
    industries: [
      'Manufacturing Plants & Heavy Industrial Machinery',
      'Marine Dry Docks & Ship Repair Yards',
      'Municipal Sewerage & Stormwater Drainage Channels',
      'Warehouse Logistics & Container Storage Terminals'
    ],
    products: [
      { name: 'Ductile Iron Double Sealed Manhole Cover', slug: 'ductile-iron-double-sealed-manhole-cover', desc: 'D400 vehicular load covers with grease compression seals to eliminate odor.' },
      { name: 'Ductile Iron Plastic Encapsulated Step Iron', slug: 'ductile-iron-plastic-encapsulated-step-iron', desc: 'BS EN 13101 manhole step rungs encapsulated in corrosive-resistant bright yellow PP plastic.' },
      { name: 'Electroforged Welded Steel Grating', slug: 'electroforged-welded-steel-grating', desc: 'Hot-dip galvanized floor grids for heavy storage yards and machinery docks.' }
    ],
    faqs: [
      {
        question: 'Are your manhole covers approved for municipal roads in Sharjah?',
        "answer": 'Yes. Our double-sealed ductile iron manhole covers meet BS EN 124-2 Class D400 loading limits, making them suitable for public roads, commercial parking lots, and utility lines throughout Sharjah.'
      },
      {
        question: 'Does the plastic encapsulation on step irons prevent rust in sewage environments?',
        "answer": 'Yes, the virgin polypropylene plastic cover forms a chemical barrier that protects the ductile iron core from sewer gases (H2S), ensuring safe structural footholds for utility workers.'
      }
    ]
  },
  'ajman': {
    name: 'Ajman',
    title: 'Marine Grating & Clamping Solutions in Ajman | Arabian Gratings',
    seoDescription: 'Marine-grade SS316 grating panels and mounting clamps supplier to Ajman, GCC. Supplying access solutions for ports, shipyards, and coastal installations.',
    intro: 'Ajman\'s industrial base is closely aligned with maritime transport, port services, and ship repair yards along the Ajman Creek. Arabian Gratings delivers premium, seawater-tested stainless steel grating grids and secure saddle mounting clips designed to withstand high salinity, chemical washdowns, and structural vibrations.',
    projectContext: 'Our access grates are applied in marine access walkways, dry docks, and port passenger berths. We provide SS316 electroforge welded grids and vibration-proof clip fastening kits that prevent panels from loosening under wave actions or heavy marine machinery operation.',
    industries: [
      'Maritime Shipping & Creek Port Logistics',
      'Coastal Protection & Marina Boardwalk Installations',
      'Shipbuilding & Vessel Maintenance Services',
      'Water Distribution & Coastal Desalination Units'
    ],
    products: [
      { name: 'Stainless Steel SS316 Floor Grating', slug: 'stainless-steel-ss316-floor-grating', desc: 'Superior SS316 panels designed for high-salinity seawater decks.' },
      { name: 'M-Clip Grating Fastening Clamp', slug: 'm-clip-grating-fastening-clamp', desc: 'Vibration-immune SS316 saddle plates to secure grates without welding.' },
      { name: 'Aluminium Access Grating Walkway', slug: 'landscape-aluminium', desc: 'Lightweight, corrosion-resistant walkways for floating marine docks.' }
    ],
    faqs: [
      {
        question: 'Why is SS316 preferred over galvanized steel for Ajman marine decks?',
        "answer": 'Seawater contains high concentrations of chloride which breaks down the zinc coating on galvanized steel. SS316 contains molybdenum, which prevents chloride pitting corrosion in splash zones.'
      },
      {
        question: 'Are the SS316 M-Clips reusable during shipyard maintenance?',
        "answer": 'Yes. M-Clips use an M8 bolt system that allows quick loosening to lift grating panels for inspection or cable runs, and can be tightened back securely afterwards.'
      }
    ]
  },
  'ras-al-khaimah': {
    name: 'Ras Al Khaimah',
    title: 'Heavy Grating for Quarries & Cement Plants in RAK | Arabian Gratings',
    seoDescription: 'Heavy-duty steel gratings and industrial floor grates supplier in Ras Al Khaimah (RAK). Engineered for stone quarries, mining, and cement works.',
    intro: 'Ras Al Khaimah contains major stone quarrying, mining, and cement production facilities. These sites require access platforms capable of handling intense dust loading, abrasive materials, and heavy mechanical spans. Arabian Gratings supplies reinforced steel panels and dust-resistant access walkways.',
    projectContext: 'We provide heavy-duty platforms for stone crushing conveyors, cement kiln access towers, and mineral processing yards. The high load capability of our S235JR electroforged steel ensures safe spans for maintenance crews carrying heavy machinery parts.',
    industries: [
      'Stone Quarrying & Aggregate Processing Yards',
      'Cement Manufacturing & Silo Access Infrastructure',
      'Ceramics & Heavy Clay Production Facilities',
      'High-Load Industrial Conveyors & Mixing Towers'
    ],
    products: [
      { name: 'Electroforged Welded Steel Grating', slug: 'electroforged-welded-steel-grating', desc: 'Maximum-span galvanized steel panels with high deflection stiffness.' },
      { name: 'Ductile Iron Double Sealed Manhole Cover', slug: 'ductile-iron-double-sealed-manhole-cover', desc: 'Heavy-duty D400 ductile iron covers for quarry access roads.' },
      { name: 'Moulded GRP Walkway Grating', slug: 'molded-gratings', desc: 'Lightweight composite panels for chemical storage areas in cement plants.' }
    ],
    faqs: [
      {
        question: 'Can you supply serrated gratings to prevent slipping in RAK dusty quarries?',
        "answer": 'Yes. We recommend serrated load-bearing bars for quarry conveyor platforms and cement mixing structures to provide maximum traction even under heavy dust accumulation.'
      },
      {
        question: 'What is the standard load span capability of your electroforged panels?',
        "answer": 'Our standard GI-SG-30100 panel supports a Uniformly Distributed Load (UDL) of up to 45.8 kN/m² at a 1.2-meter span, complying with international NAAMM guidelines.'
      }
    ]
  },
  'fujairah': {
    name: 'Fujairah',
    title: 'Fuel Terminal & Port Grating Solutions in Fujairah | Arabian Gratings',
    seoDescription: 'ATEX-compliant non-sparking aluminium and GRP gratings supplier in Fujairah. Access solutions for oil storage terminals and bunkering ports.',
    intro: 'Fujairah hosts one of the largest oil bunkering ports and energy storage terminals globally. Working in close proximity to hydrocarbons demands non-sparking and fire-retardant access walkways. Arabian Gratings supplies safety-tested non-conductive GRP grids and lightweight non-sparking aluminium panels.',
    projectContext: 'Our access walkways are applied along fuel tank farm staircases, bunkering pipelines, and marine loading arms. The GRP moulded system ensures flame retardancy and electrical isolation in close proximity to fuel storage assets, meeting strict terminal safety standards.',
    industries: [
      'Fuel Bunkering & Crude Oil Storage Tank Farms',
      'Deepwater Ports & Maritime Shipping Services',
      'Power Plants & Seawater Desalination Channels',
      'Chemical Loading Terminals & Pipeline Walkways'
    ],
    products: [
      { name: 'Aluminium Access Grating Walkway', slug: 'landscape-aluminium', desc: 'Naturally non-sparking walkways for volatile fuel storage environments.' },
      { name: 'Moulded GRP Walkway Grating', slug: 'molded-gratings', desc: 'Fire-retardant ASTM E84 Class 1 composite panels with high chemical resistance.' },
      { name: 'Ductile Iron Plastic Encapsulated Step Iron', slug: 'ductile-iron-plastic-encapsulated-step-iron', desc: 'High-visibility yellow steps for underground utility chambers.' }
    ],
    faqs: [
      {
        question: 'Why are aluminium walkways required for Fujairah fuel storage terminals?',
        "answer": 'Aluminium is inherently non-sparking. Unlike steel, friction from dropped tools or steel boots against aluminium will not produce a spark, reducing fire hazards in ATEX-classified fuel vapor zones.'
      },
      {
        question: 'Do GRP gratings resist chemical exposure from petroleum products?',
        "answer": 'Yes, GRP molded panels using chemical-grade isophthalic or vinyl ester resins provide complete protection against petroleum fuels, crude oil, diesel, and common refinery solvents.'
      }
    ]
  },
  'umm-al-quwain': {
    name: 'Umm Al Quwain',
    title: 'Coastal Walkway & Desalination Grating in UAQ | Arabian Gratings',
    seoDescription: 'GRP walkway panels and corrosion-immune gratings supplier in Umm Al Quwain (UAQ). Access solutions for coastal zones and water treatment.',
    intro: 'Umm Al Quwain contains important water treatment plants, coastal lagoons, and mariculture research centres. These wetland and high-salinity zones require access platforms that will not degrade under direct marine exposure. Arabian Gratings supplies chemical-immune GRP walkway grids and lightweight access steps.',
    projectContext: 'We provide walk systems for desalination intake lines, lagoon observation bridges, and water processing tanks. The non-corrosive properties of our materials prevent rust water runoff from staining natural habitats, supporting UAQ\'s focus on coastal preservation.',
    industries: [
      'Water Filtration & Desalination Intake Lines',
      'Coastal Preservation & Eco-Tourism Boardwalks',
      'Mariculture & Marine Research Facility Walks',
      'Sewerage Pump Chambers & Stormwater Outlets'
    ],
    products: [
      { name: 'Moulded GRP Walkway Grating', slug: 'molded-gratings', desc: '100% corrosion-proof walkway grids designed for long-term marine contact.' },
      { name: 'Ductile Iron Plastic Encapsulated Step Iron', slug: 'ductile-iron-plastic-encapsulated-step-iron', desc: 'Polypropylene encapsulated step ladders for sewerage pump chambers.' },
      { name: 'Stainless Steel SS316 Floor Grating', slug: 'stainless-steel-ss316-floor-grating', desc: 'Premium passivated SS316 floor panels for water treatment chambers.' }
    ],
    faqs: [
      {
        question: 'Will GRP grating rust in direct contact with seawater?',
        "answer": 'No. GRP contains zero metal content. The fiberglass and resin formulation is completely immune to rust, rot, or corrosion, even under permanent immersion in hyper-saline water.'
      },
      {
        question: 'Are UAQ municipal approvals available for your step irons?',
        "answer": 'Yes, our ductile iron step irons are encapsulated in bright yellow polypropylene plastic matching BS EN 13101, compliant with municipality sewerage standards.'
      }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = LOCATIONS[slug];
  if (!location) {
    return { title: 'Industrial Gratings Saudi Arabia' };
  }
  return {
    title: location.title,
    description: location.seoDescription,
    alternates: {
      canonical: `/locations/${slug}`,
    },
    openGraph: {
      title: location.title,
      description: location.seoDescription,
      url: `/locations/${slug}`,
      locale: 'en_SA',
      type: 'website',
    }
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = LOCATIONS[slug];

  if (!location) {
    notFound();
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabiangratings.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Locations', item: `${SITE_URL}/locations` },
      { '@type': 'ListItem', position: 3, name: location.name, item: `${SITE_URL}/locations/${slug}` }
    ]
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb nav */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-grey">
          <Link href="/" className="inline-flex items-center hover:text-accent transition-colors font-display uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Home
          </Link>
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <span className="text-foreground font-semibold">Locations</span>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <span className="text-foreground font-semibold">{location.name}</span>
          </nav>
        </div>

        {/* Location Title & Intro */}
        <div className="max-w-3xl mb-16">
          <Reveal direction="left" delay={0.1}>
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">
              Saudi Supply Division // {location.name}
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Industrial Gratings Supplier in <span className="text-accent">{location.name}</span>
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-sans mb-8">
              {location.intro}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent font-display text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm shadow-sm"
            >
              Contact Us
            </Link>
          </Reveal>
        </div>

        {/* Local Project Context & Sector Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 border-t border-border-color pt-12">
          {/* Project context */}
          <div className="lg:col-span-7">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-accent" />
                Local Project Integration
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-sans mb-6">
                {location.projectContext}
              </p>
            </Reveal>
          </div>

          {/* Industry focus */}
          <div className="lg:col-span-5 bg-slate-55 p-6 rounded-sm border border-border-color">
            <Reveal direction="right" delay={0.15}>
              <h3 className="font-display font-bold text-foreground text-xs uppercase tracking-widest mb-4 flex items-center gap-1.5 border-b border-border-color pb-2">
                <MapPin className="w-4 h-4 text-accent" />
                Target Industry Sectors in {location.name}
              </h3>
              <ul className="space-y-2.5">
                {location.industries.map((ind, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 font-sans leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 mt-1.5" />
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Targeted Local Products */}
        <section className="mb-16 border-t border-border-color pt-12">
          <Reveal direction="up" delay={0.1}>
            <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
              Relevant Product Ranges for {location.name} Projects
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {location.products.map((prod, idx) => (
              <Reveal key={prod.slug} direction="up" delay={idx * 0.05}>
                <div className="border border-border-color p-5 bg-white flex flex-col justify-between h-full hover:border-accent transition-colors rounded-sm">
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-2 font-display uppercase tracking-wide">{prod.name}</h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">{prod.desc}</p>
                  </div>
                  <Link
                    href={`/products/${prod.slug}`}
                    className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors"
                  >
                    View Product Details <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16 border-t border-border-color pt-12">
          <Reveal direction="up" delay={0.1}>
            <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
              Frequently Asked Questions for {location.name} Supply
            </h2>
          </Reveal>
          <div className="max-w-4xl space-y-6">
            {location.faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-border-color pb-5 last:border-0">
                <h3 className="text-xs font-bold text-foreground font-display uppercase tracking-wide mb-2">
                  Q: {faq.question}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans pl-4 border-l-2 border-accent/20">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Banner */}
        <Reveal direction="none" delay={0.2}>
          <div className="premium-card-dark p-8 text-center text-white relative overflow-hidden rounded-sm">
            <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-display font-black uppercase tracking-wide">
                Get a Fast Quote for Your {location.name} Installation
              </h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed font-sans">
                Submit drawing files or dimensions directly to our sales team for quick, localized technical specifications and GCC pricing.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
