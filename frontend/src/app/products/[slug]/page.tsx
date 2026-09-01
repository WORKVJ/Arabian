import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProduct, getProductCategory, getProducts } from '@/lib/api/client';
import { generatePageMetadata } from '@/lib/seo/config';
import { stripHtml } from '@/lib/seo/stripHtml';
import { Product, ProductCategory, ProductListItem } from '@/types';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import CategoryDetailClient from '@/components/products/CategoryDetailClient';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // 1. Try category first
  try {
    const category = await getProductCategory(slug);
    const title = category.seo_title || `${category.name} Supplier Saudi Arabia | Arabian Gratings`;
    const description = category.seo_description || `${category.short_description} Premium quality engineered grids by Arabian Gratings Saudi Arabia. Delivering across Jeddah, Dammam, Riyadh and the GCC.`;
    return generatePageMetadata(category, {
      title,
      description: description.slice(0, 160),
      path: `/products/${category.slug}`,
      ogImageFallback: category.image?.file || undefined,
    });
  } catch {
    // 2. Fall back to product
    try {
      const product = await getProduct(slug);
      const title = product.seo_title || `${product.name} Saudi Arabia | Arabian Gratings`;
      let description = product.seo_description || stripHtml(product.short_description);
      if (!product.seo_description && !description.includes('Saudi') && !description.includes('GCC')) {
        description = `${description} Premium industrial supply by Arabian Gratings Saudi Arabia, delivering across Jeddah, Dammam, Riyadh, and the GCC region.`;
      }
      return generatePageMetadata(product, {
        title,
        description: description.slice(0, 160),
        path: `/products/${product.slug}`,
        ogImageFallback:
          product.product_images?.[0]?.media?.file ||
          product.og_image ||
          undefined,
      });
    } catch {
      return { title: 'Product Details | Arabian Gratings Saudi Arabia' };
    }
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let category: ProductCategory | null = null;
  let categoryProducts: ProductListItem[] = [];

  // 1. Try resolving as a product category
  try {
    category = await getProductCategory(slug);
    if (category && category.is_active) {
      const prodRes = await getProducts({ category: slug, page_size: 100 });
      categoryProducts = prodRes.results || [];
    }
  } catch {
    // Not a category, will fallback to product
  }

  // Render category landing page if resolved
  if (category && category.is_active) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabiangratings.com';
    const categoryBreadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
        { '@type': 'ListItem', position: 3, name: category.name, item: `${SITE_URL}/products/${category.slug}` },
      ]
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryBreadcrumb) }}
        />
        <CategoryDetailClient category={category} products={categoryProducts} />
      </>
    );
  }

  // 2. Resolve as a single product
  let product: Product | null = null;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  if (!product || !product.is_active) {
    notFound();
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabiangratings.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category?.name || 'Category',
        item: `${SITE_URL}/products/${product.category?.slug || ''}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${SITE_URL}/products/${product.slug}`,
      },
    ],
  };

  const productSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: stripHtml(product.short_description),
    url: `${SITE_URL}/products/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'Arabian Gratings',
    },
    category: product.category?.name,
    ...(product.product_code ? { sku: product.product_code } : {}),
    ...(product.material ? { material: product.material } : {}),
    ...(product.product_images?.length > 0
      ? {
          image: product.product_images
            .slice(0, 5)
            .map((img) =>
              img.media.file.startsWith('http') ? img.media.file : `${SITE_URL}${img.media.file}`
            ),
        }
      : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Arabian Gratings LLC' },
    },
  };

  const faqSchema =
    product.faq && product.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: product.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* SEO hidden summary */}
      <div className="sr-only">
        <h1>{product.name}</h1>
        <p>{product.short_description}</p>
        <p>{product.description}</p>
        {product.material && <p>Material: {product.material}</p>}
        {product.finish && <p>Finish: {product.finish}</p>}
        {product.standard && <p>Standard: {product.standard}</p>}
        {product.applications && <p>Applications: {product.applications}</p>}
        {product.features && <p>Features: {product.features}</p>}
        {product.spec_rows?.map((row) => (
          <p key={row.id}>{row.name}: {row.value}</p>
        ))}
        {product.faq?.map((item, i) => (
          <div key={i}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
        {product.related_products?.map((rp) => (
          <a key={rp.id} href={`/products/${rp.slug}`}>{rp.name}</a>
        ))}
        <nav aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href={`/products/${product.category?.slug}`}>{product.category?.name}</Link></li>
            <li>{product.name}</li>
          </ol>
        </nav>
      </div>

      <ProductDetailClient product={product} />
    </>
  );
}
