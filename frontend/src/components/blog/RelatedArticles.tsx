import { getBlogPosts } from '@/lib/api/client';
import { BlogPost } from '@/types';
import BlogCard from './BlogCard';
import Reveal from '@/components/animations/Reveal';

interface RelatedArticlesProps {
  currentPostSlug: string;
  categorySlug: string;
  explicitRelatedPosts?: BlogPost[];
}

export default async function RelatedArticles({
  currentPostSlug,
  categorySlug,
  explicitRelatedPosts = [],
}: RelatedArticlesProps) {
  let displayPosts: BlogPost[] = [];

  if (explicitRelatedPosts.length > 0) {
    displayPosts = explicitRelatedPosts.filter((post) => post.status === 'PUBLISHED');
  } else {
    try {
      const categoryPostsRes = await getBlogPosts({
        category: categorySlug,
        page_size: 4, // fetch slightly more to allow filtering current post
      });
      displayPosts = (categoryPostsRes.results || [])
        .filter((post) => post.slug !== currentPostSlug)
        .slice(0, 3);
    } catch (error) {
      console.warn('Failed to fetch related posts by category fallback:', error);
    }
  }

  if (displayPosts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border-color">
      <Reveal direction="up" delay={0.1}>
        <h2 className="text-2xl font-bold text-foreground uppercase tracking-wider mb-8">
          Related Articles
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayPosts.map((post, idx) => (
          <BlogCard key={post.id} post={post} index={idx} />
        ))}
      </div>
    </section>
  );
}
