import { Metadata } from 'next';
import { fetchPageSEO } from '@/lib/api/client';

export interface DefaultSEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const SITE_URL = 'https://arabiangratings.com';

export async function getPageSEO(
  pathname: string,
  fallback: DefaultSEOConfig
): Promise<Metadata> {
  const customSEO = await fetchPageSEO(pathname);

  const title = customSEO?.meta_title || fallback.title;
  const description = customSEO?.meta_description || fallback.description;
  const keywords = customSEO?.meta_keywords
    ? customSEO.meta_keywords.split(',').map((s) => s.trim()).filter(Boolean)
    : fallback.keywords || [];

  const canonical =
    customSEO?.canonical_url ||
    fallback.canonicalUrl ||
    `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

  const ogTitle =
    customSEO?.og_title ||
    customSEO?.meta_title ||
    fallback.ogTitle ||
    fallback.title;

  const ogDescription =
    customSEO?.og_description ||
    customSEO?.meta_description ||
    fallback.ogDescription ||
    fallback.description;

  const ogImage = customSEO?.og_image || fallback.ogImage || '/og-image.jpg';
  const noIndex = customSEO?.no_index !== undefined ? customSEO.no_index : !!fallback.noIndex;

  const formattedOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical,
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
      type: 'website',
      locale: 'en_US',
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
      },
    },
  };
}
