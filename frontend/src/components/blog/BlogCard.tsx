import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { stripHtml } from '@/lib/seo/stripHtml';
import { ChevronRight } from 'lucide-react';
import Reveal from '@/components/animations/Reveal';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  headingLevel?: 'h2' | 'h3';
}

export default function BlogCard({ post, index = 0, headingLevel: Heading = 'h3' }: BlogCardProps) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-AE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Reveal direction="up" delay={index * 0.05}>
      <article className="group bg-white border border-border-color flex flex-col h-full overflow-hidden rounded-sm hover:border-accent transition-colors">
        {/* Featured Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          {post.featured_image ? (
            <Image
              src={post.featured_image.file}
              alt={post.featured_image.alt_text || post.title}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <span className="text-[10px] text-slate-400 font-mono">No article image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1 justify-between">
          <div>
            {/* Category */}
            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="text-accent text-[10px] font-mono font-bold uppercase tracking-wider hover:text-accent-hover transition-colors block mb-2"
              >
                {post.category.name}
              </Link>
            )}

            <Heading className="text-base font-bold text-foreground mb-3 leading-snug font-display uppercase tracking-wide">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                {post.title}
              </Link>
            </Heading>

            <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed font-sans">
              {stripHtml(post.excerpt, 150)}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="text-[10px] text-slate-400 font-mono">
              {publishedDate && (
                <time dateTime={post.published_at || ''}>{publishedDate}</time>
              )}
              {post.author?.name && (
                <span className="ml-1 text-slate-450">· {post.author.name}</span>
              )}
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Read article: ${post.title}`}
            >
              Read <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
