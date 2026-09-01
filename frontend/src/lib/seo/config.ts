import { Metadata } from 'next';
import { SEOData } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Arabian Gratings Saudi Arabia | Premium Industrial Grating Solutions',
    template: '%s | Arabian Gratings Saudi Arabia'
  },
  description: 'Arabian Gratings is a leading supplier of premium industrial floor solutions, FRP/GRP gratings, steel, stainless steel, and aluminum grating installations in Saudi Arabia.',
  alternates: {
    canonical: './'
  },
  openGraph: {
    title: 'Arabian Gratings Saudi Arabia | Premium Industrial Grating Solutions',
    description: 'Leading supplier of premium industrial floor solutions, FRP/GRP gratings, steel, and aluminum installations in Saudi Arabia.',
    url: './',
    siteName: 'Arabian Gratings Saudi Arabia',
    locale: 'en_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arabian Gratings Saudi Arabia | Premium Industrial Grating Solutions',
    description: 'Leading supplier of premium industrial floor solutions, FRP/GRP gratings, and steel installations in Saudi Arabia.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export function generatePageMetadata(seoData: SEOData | null | undefined, fallback: {
  title: string;
  description: string;
  path: string;
  ogImageFallback?: string;
}): Metadata {
  if (!seoData) {
    return {
      title: fallback.title,
      description: fallback.description,
      alternates: {
        canonical: `${SITE_URL}${fallback.path}`
      },
      openGraph: {
        title: fallback.title,
        description: fallback.description,
        url: `${SITE_URL}${fallback.path}`,
        images: fallback.ogImageFallback ? [{ url: fallback.ogImageFallback }] : []
      }
    };
  }

  const title = seoData.seo_title || fallback.title;
  const description = seoData.seo_description || fallback.description;
  const canonical = seoData.canonical_url || `${SITE_URL}${fallback.path}`;
  const ogTitle = seoData.og_title || title;
  const ogDescription = seoData.og_description || description;
  const ogImg = seoData.og_image || fallback.ogImageFallback;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonical
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      images: ogImg ? [{ url: ogImg }] : []
    },
    robots: {
      index: !seoData.no_index,
      follow: !seoData.no_index,
    }
  };
}
