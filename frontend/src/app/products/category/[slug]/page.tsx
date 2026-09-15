import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { generateMetadata as getParentMetadata } from '../../[slug]/page';

const SLUG_MAP: Record<string, string> = {
  'gratings': 'steel-gratings',
  'ss-gratings': 'stainless-steel-products',
  'grp-products': 'frp-grp-products',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const targetSlug = SLUG_MAP[slug] || slug;
  return getParentMetadata({ params: Promise.resolve({ slug: targetSlug }) });
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const targetSlug = SLUG_MAP[slug] || slug;
  redirect(`/products/${targetSlug}`);
}
