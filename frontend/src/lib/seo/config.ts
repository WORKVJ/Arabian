import { Metadata } from 'next';
import { SEOData } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabiangratings.com';

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
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: 'zgiWyXeHgPHmCv9VJuttjcKiftoMpO7JTwz1o4Isdvs',
  },
};

import { fetchPageSEO } from '@/lib/api/client';

export async function generatePageMetadata(
  seoData: SEOData | null | undefined,
  fallback: {
    title: string;
    description: string;
    path: string;
    ogImageFallback?: string;
  }
): Promise<Metadata> {
  // 1. Check if custom SEO was defined in Admin Panel (PageSEO) for this URL path
  let customSEO: any = null;
  try {
    customSEO = await fetchPageSEO(fallback.path);
  } catch {
    // Graceful fallback to model / static props
  }

  const title = customSEO?.meta_title || seoData?.seo_title || fallback.title;
  const description = customSEO?.meta_description || seoData?.seo_description || fallback.description;
  const keywords = customSEO?.meta_keywords
    ? customSEO.meta_keywords.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [];

  const canonical =
    customSEO?.canonical_url ||
    seoData?.canonical_url ||
    `${SITE_URL}${fallback.path.startsWith('/') ? fallback.path : `/${fallback.path}`}`;

  const ogTitle =
    customSEO?.og_title ||
    customSEO?.meta_title ||
    seoData?.og_title ||
    seoData?.seo_title ||
    fallback.title;

  const ogDescription =
    customSEO?.og_description ||
    customSEO?.meta_description ||
    seoData?.og_description ||
    seoData?.seo_description ||
    fallback.description;

  const ogImg =
    customSEO?.og_image ||
    seoData?.og_image ||
    fallback.ogImageFallback ||
    '/og-image.jpg';

  const noIndex =
    customSEO?.no_index !== undefined
      ? customSEO.no_index
      : (seoData?.no_index !== undefined ? seoData.no_index : false);

  const formattedOgImage = ogImg.startsWith('http')
    ? ogImg
    : `${SITE_URL}${ogImg.startsWith('/') ? ogImg : `/${ogImg}`}`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical,
    },
    verification: {
      google: 'zgiWyXeHgPHmCv9VJuttjcKiftoMpO7JTwz1o4Isdvs',
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: 'Arabian Gratings',
      images: [
        {
          url: formattedOgImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      type: fallback.path.startsWith('/blog/') ? 'article' : 'website',
      locale: 'en_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [formattedOgImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
