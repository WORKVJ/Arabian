import { Suspense } from 'react';
// Force reload cache for images audit
import { Metadata } from 'next';
import { getProducts, getProductCategories } from '@/lib/api/client';
import { ProductListItem, ProductCategory, PaginatedResponse } from '@/types';
import ProductsClient from '@/components/products/ProductsClient';
import { getPageSEO } from '@/lib/seo/getPageSEO';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return await getPageSEO('/products', {
    title: 'Industrial Grating Systems | Product Catalog Saudi Arabia | Arabian Gratings',
    description: "Explore Arabian Gratings' complete range of industrial grating systems — steel, FRP, aluminium, stainless steel, stair treads, access covers and more. Engineered for Saudi, Jeddah, Dammam and GCC industrial applications.",
    keywords: ['industrial grating systems', 'gratings catalog saudi arabia', 'steel gratings', 'grp gratings'],
  });
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabiangratings.com';

const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Industrial Grating Systems — Product Catalog',
  description:
    'Complete range of engineered grating systems from Arabian Gratings Saudi Arabia, including steel, FRP, aluminium and stainless steel products.',
  url: `${SITE_URL}/products`,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
    ],
  },
};

export default async function ProductsPage() {
  let productsRes: PaginatedResponse<ProductListItem> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  let categoriesRes: PaginatedResponse<ProductCategory> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  try {
    [productsRes, categoriesRes] = await Promise.all([
      getProducts({ page_size: 100 }),
      getProductCategories(),
    ]);
  } catch {
    console.warn('Products API not available — rendering empty catalog state.');
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      <Suspense>
        <ProductsClient
          initialProducts={productsRes.results}
          categories={categoriesRes.results}
        />
      </Suspense>
    </>
  );
}
