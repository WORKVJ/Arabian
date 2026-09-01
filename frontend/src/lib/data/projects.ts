import { Project } from '@/types';
import { STATIC_INDUSTRIES } from './industries';

function makeMedia(id: number, file: string, alt: string) {
  return { id, file, alt_text: alt, title: alt, caption: '', created_at: '2025-01-01T00:00:00Z' };
}

export const STATIC_PROJECTS: Project[] = [
  {
    id: 1, title: 'Jazan Refinery Complex — Platform Gratings', slug: 'jazan-refinery-platform-gratings',
    location: 'Jazan Economic City, Saudi Arabia',
    associated_industries: [STATIC_INDUSTRIES.find(i => i.slug === 'oil-gas')!],
    description: 'Supply and installation of over 8,500 sqm of hot-dip galvanized electroforged steel grating panels across elevated process platforms, pipe rack access walkways, and stair treads within the Jazan Refinery Complex. Panels fabricated to ASTM A985 with ISO 1461 galvanizing and verified for 5kN/m² distributed live load compliance.',
    description_blocks: [],
    featured_image: makeMedia(1, '/project-refinery.jpg', 'Jazan Refinery Platform Gratings'),
    project_images: [{ id: 1, media: makeMedia(1, '/project-refinery.jpg', 'Jazan Refinery Gratings'), sort_order: 0 }],
    products_used: [],
    project_date: '2024-08',
    is_featured: true, is_active: true,
    created_at: '2024-08-01T00:00:00Z', updated_at: '2024-08-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 2, title: 'SWCC Desalination — GRP Grating Walkways', slug: 'swcc-desalination-grp-walkways',
    location: 'Jubail Industrial City, Saudi Arabia',
    associated_industries: [STATIC_INDUSTRIES.find(i => i.slug === 'water-treatment')!],
    description: 'Custom-cut Moulded GRP fiberglass composite floor walkways with gritted anti-slip surfaces and vinyl ester resin matrix for extreme chlorine exposure. Installed across evaporator decks, brine handling zones, and chemical dosing areas. Over 3,200 sqm delivered and installed in phased construction programme.',
    description_blocks: [],
    featured_image: makeMedia(2, '/project-marine.jpg', 'SWCC Desalination GRP Walkways'),
    project_images: [{ id: 2, media: makeMedia(2, '/project-marine.jpg', 'SWCC GRP Walkways'), sort_order: 0 }],
    products_used: [],
    project_date: '2024-11',
    is_featured: true, is_active: true,
    created_at: '2024-11-01T00:00:00Z', updated_at: '2024-11-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 3, title: 'King Abdulaziz Port — Marine Deck Gratings', slug: 'king-abdulaziz-port-marine-gratings',
    location: 'Dammam Port, Eastern Province, Saudi Arabia',
    associated_industries: [STATIC_INDUSTRIES.find(i => i.slug === 'marine-offshore')!],
    description: 'Supply of SS316 stainless steel floor gratings and hot-dip galvanized steel panels for marine jetty access walkways and cargo platform decking at King Abdulaziz Port, Dammam. Products specified for DNV GL seawater splash zone corrosion requirements. Full traceability documentation provided.',
    description_blocks: [],
    featured_image: makeMedia(3, '/project-marine.jpg', 'King Abdulaziz Port Marine Deck Gratings'),
    project_images: [{ id: 3, media: makeMedia(3, '/project-marine.jpg', 'Port Marine Gratings'), sort_order: 0 }],
    products_used: [],
    project_date: '2025-03',
    is_featured: false, is_active: true,
    created_at: '2025-03-01T00:00:00Z', updated_at: '2025-03-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
];
