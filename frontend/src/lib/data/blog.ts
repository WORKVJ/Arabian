import { BlogPost, BlogCategory } from '@/types';

function makeMedia(id: number, file: string, alt: string) {
  return { id, file, alt_text: alt, title: alt, caption: '', created_at: '2025-01-01T00:00:00Z' };
}

export const STATIC_BLOG_CATEGORIES: BlogCategory[] = [
  { id: 1, name: 'Technical Standards', slug: 'technical-standards', description: 'Industry specifications, deflection limits, and compliance guides.', is_active: true },
  { id: 2, name: 'Material Engineering', slug: 'material-engineering', description: 'Resin selection, alloy comparisons, and material science deep-dives.', is_active: true },
  { id: 3, name: 'Project Insights', slug: 'project-insights', description: 'Behind-the-scenes case studies from Arabian Gratings installations.', is_active: true },
];

export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    id: 1, title: 'Hot-Dip Galvanizing Deflection Standards in Saudi Industrial Docks',
    slug: 'hot-dip-galvanizing-deflection-standards',
    excerpt: 'Detailed analysis of corrosion fatigue on marine steel platforms and yield stress parameters in coastal environments across the GCC region.',
    content: `## Introduction\n\nHot-dip galvanized steel gratings are the workhorse of Saudi Arabia's industrial dock infrastructure. Understanding deflection parameters is critical to ensuring structural integrity under dynamic wheel loads.\n\n## Key Standards\n\n- **ISO 1461** — Hot-dip galvanizing specification\n- **BS EN 14122-2** — Industrial walkway deflection limits (maximum L/200)\n- **ASTM A123** — Galvanizing quality requirements\n\n## Coastal Environment Factors\n\nSaudi coastal environments (Red Sea and Arabian Gulf) present unique corrosion challenges. Salt fog concentration can be 3-5x higher than inland facilities, requiring zinc coating weights of minimum 85 μm.\n\n## Conclusion\n\nProper galvanizing combined with engineered deflection calculations ensures 25+ year service life for steel grating platforms in Saudi coastal environments. Arabian Gratings provides full third-party certification for all galvanizing work.`,
    content_blocks: [],
    featured_image: makeMedia(1, '/facility-overview.jpg', 'Steel Grating Technical Standards'),
    category: { id: 1, name: 'Technical Standards', slug: 'technical-standards', description: '', is_active: true },
    author: { id: 1, name: 'Lead Structural Engineer' },
    status: 'PUBLISHED',
    is_featured: true,
    published_at: '2025-05-12',
    created_at: '2025-05-12T00:00:00Z', updated_at: '2025-05-12T00:00:00Z',
    related_products: [], related_industries: [], related_posts: [],
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 2, title: 'GRP/FRP Matrix Selection Guide for Sulphur Environments',
    slug: 'grp-frp-matrix-selection-guide',
    excerpt: 'A comprehensive review of isophthalic polyester versus vinyl ester resin resistance profiles in local refineries and desalination plants.',
    content: `## Why Resin Selection Matters\n\nIn sulphur-heavy refinery environments, incorrect resin matrix selection can lead to premature GRP grating failure within 2-3 years. This guide covers the key decision factors.\n\n## Isophthalic Polyester\n\nSuitable for: Light chemical exposure, general industrial use, lower cost applications.\nNot recommended for: High H2S exposure, chlorine environments above 200 ppm, strong acid splash.\n\n## Vinyl Ester Resin\n\nSuitable for: Strong acid/alkali environments, desalination chlorine zones, refinery sulfur units.\nAdvantages: Superior chemical resistance, higher temperature tolerance (up to 100°C continuous).\n\n## Selection Matrix\n\n| Environment | Recommended Resin | Notes |\n|-------------|------------------|-------|\n| Oil Refinery (H2S) | Vinyl Ester | Mandatory for sour service |\n| Desalination (Chlorine) | Vinyl Ester | Brine pH < 4 |\n| Wastewater | Isophthalic | Sufficient for municipal |\n| General Industry | Isophthalic | Cost-effective choice |\n\n## Conclusion\n\nAlways specify vinyl ester resin for Saudi refinery and desalination applications. The cost premium is 15-20% but extends service life from 5 to 25+ years.`,
    content_blocks: [],
    featured_image: makeMedia(2, '/product-frp-grating.jpg', 'GRP FRP Matrix Selection'),
    category: { id: 2, name: 'Material Engineering', slug: 'material-engineering', description: '', is_active: true },
    author: { id: 2, name: 'Chemical Specialist' },
    status: 'PUBLISHED',
    is_featured: false,
    published_at: '2025-08-22',
    created_at: '2025-08-22T00:00:00Z', updated_at: '2025-08-22T00:00:00Z',
    related_products: [], related_industries: [], related_posts: [],
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 3, title: 'Jazan Refinery Case Study: 8,500 sqm Steel Grating Installation',
    slug: 'jazan-refinery-case-study',
    excerpt: 'How Arabian Gratings delivered a phased supply of electroforged steel grating panels for the Jazan Refinery Complex process platforms.',
    content: `## Project Overview\n\nThe Jazan Refinery Complex, located in Saudi Arabia's Jazan Economic City, required over 8,500 sqm of industrial floor grating across its elevated process platforms.\n\n## Challenge\n\nDelivery of custom-cut panels to an active construction site with strict load-bearing requirements and a tight 6-month installation window.\n\n## Solution\n\nArabian Gratings fabricated electroforged welded steel grating panels in our Saudi workshop using ASTM A36 carbon steel. All panels were hot-dip galvanized to ISO 1461 and pre-cut to site-specific dimensions with edge banding to prevent fraying.\n\n## Results\n\n- 8,500 sqm delivered across 3 phases\n- Zero defects or site rejections\n- Completed 3 weeks ahead of schedule\n- Full traceability certificates provided for each panel batch\n\n## Client Feedback\n\n"Arabian Gratings delivered exactly what was specified, on time and within budget. Their technical support during the design phase was invaluable." — Senior Project Engineer, EPC Contractor`,
    content_blocks: [],
    featured_image: makeMedia(3, '/project-refinery.jpg', 'Jazan Refinery Installation'),
    category: { id: 3, name: 'Project Insights', slug: 'project-insights', description: '', is_active: true },
    author: { id: 1, name: 'Lead Structural Engineer' },
    status: 'PUBLISHED',
    is_featured: false,
    published_at: '2025-09-15',
    created_at: '2025-09-15T00:00:00Z', updated_at: '2025-09-15T00:00:00Z',
    related_products: [], related_industries: [], related_posts: [],
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
];
