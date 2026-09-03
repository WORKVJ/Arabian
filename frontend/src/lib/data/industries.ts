import { Industry } from '@/types';

function makeMedia(id: number, file: string, alt: string) {
  return { id, file, alt_text: alt, title: alt, caption: '', created_at: '2025-01-01T00:00:00Z' };
}

export const STATIC_INDUSTRIES: Industry[] = [
  {
    id: 1, name: 'Oil & Gas', slug: 'oil-gas',
    short_description: 'Exploration platforms, processing yards, and seawater splash zones requiring premium corrosion resistance.',
    description: 'Arabian Gratings supplies high-performance safety flooring and access systems specifically engineered for the demanding conditions of the onshore and offshore Oil & Gas sector. From offshore drilling rigs and FPSO vessels to onshore refineries, gas processing plants, and sulfur storage facilities, our industrial grating products deliver unparalleled durability and compliance with strict API, ISO, and ASTM regulations. Our GRP/FRP gratings excel in high H2S and chemical exposure environments while our hot-dip galvanized steel gratings provide the structural rigidity demanded by heavy process equipment platforms.',
    description_blocks: [],
    image: makeMedia(1, '/img/real2/new (12).jpeg', 'Oil and Gas Industrial Grating Platforms'),
    applications: 'Drilling Platforms, Refineries, Gas Processing Plants, FPSO Vessels, Sulfur Recovery Units',
    related_products: [],
    is_active: true,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 2, name: 'Marine & Offshore', slug: 'marine-offshore',
    short_description: 'Vessel decks, cargo bays, coastal jetties, and mooring structures subject to harsh salt spray.',
    description: 'Access walkways, gangways, vessel decks, and dock structures are continuously exposed to saltwater, tidal waves, and severe atmospheric moisture. Arabian Gratings provides hot-dip galvanized steel grids and advanced GRP molded gratings that resist marine corrosion and salt spray fatigue, ensuring structural integrity and slip-resistant footing for crews. Our marine-grade stainless steel gratings meet DNV GL and Lloyd\'s Register requirements for offshore floating structures.',
    description_blocks: [],
    image: makeMedia(2, '/img/real1/img (8).jpeg', 'Marine Offshore Grating Walkways Over Sea'),
    applications: 'Ship Decks, Offshore Rigs, Jetties, Port Facilities, Coastal Walkways',
    related_products: [],
    is_active: true,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 3, name: 'Desalination Plants', slug: 'water-treatment',
    short_description: 'Chemical-safe GRP grids and stainless floor plates for humid, chlorine-heavy utility yards.',
    description: 'Desalination plants and wastewater treatment facilities handle highly corrosive chemicals, chlorine-heavy environments, and high humidity levels. Our GRP/FRP gratings and stainless steel gratings are designed with vinyl ester resin matrices and pickling finishes to offer complete resistance to chemical splash and acidic attacks, securing safe walking platforms in water utilities. Arabian Gratings has supplied over 100,000 sqm of GRP grating to desalination facilities across the GCC region.',
    description_blocks: [],
    image: makeMedia(3, '/img/real1/img (13).jpeg', 'Desalination Plant Grating Platforms and Piping Decks'),
    applications: 'RO Plants, Evaporator Decks, Chemical Dosing Areas, Brine Handling Zones',
    related_products: [],
    is_active: true,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 4, name: 'Infrastructure', slug: 'infrastructure',
    short_description: 'Trench covers, utility ducts, access walkways, and ventilation screens for municipal projects.',
    description: 'Arabian Gratings supplies heavy-duty trench covers, drainage grates, manhole covers, and utility duct frames for roads, railways, airports, and municipal construction projects. Engineered for heavy wheel loads (such as D400 and E600 classes), our access systems ensure safe traffic flow and long service life across urban municipal networks. Our products are specified by major Saudi government infrastructure contractors and vision 2030 mega-projects.',
    description_blocks: [],
    image: makeMedia(4, '/img/real2/new (2).jpeg', 'Infrastructure Galvanized Stair Treads and Trench Grates'),
    applications: 'Road Drainage, Airport Taxiways, Railway Platforms, Smart City Projects',
    related_products: [],
    is_active: true,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
];
