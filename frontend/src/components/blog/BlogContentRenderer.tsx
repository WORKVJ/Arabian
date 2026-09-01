// Server Component — sanitizes and renders Django article HTML + content_blocks
// Uses isomorphic-dompurify for server-side HTML sanitization

import DOMPurify from 'isomorphic-dompurify';

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'subheading' | 'blockquote' | 'image' | 'list' | string;
  content?: string;
  items?: string[];
  src?: string;
  alt?: string;
  caption?: string;
  level?: number;
  ordered?: boolean;
}

interface BlogContentRendererProps {
  content: string;
  contentBlocks?: ContentBlock[];
}

// Allowed tags and attributes for DOMPurify
const ALLOWED_TAGS = [
  'p', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'li',
  'blockquote', 'strong', 'em', 'b', 'i', 'u', 'a',
  'img', 'figure', 'figcaption', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'br', 'hr', 'pre', 'code', 'span',
];
const ALLOWED_ATTR = ['href', 'src', 'alt', 'class', 'target', 'rel', 'title', 'width', 'height'];

function renderBlock(block: ContentBlock, idx: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return <p key={idx} className="mb-4 leading-relaxed text-steel-blue text-sm">{block.content}</p>;

    case 'heading':
      return <h2 key={idx} className="text-xl font-bold text-foreground mt-8 mb-3">{block.content}</h2>;

    case 'subheading':
      return <h3 key={idx} className="text-lg font-bold text-foreground mt-6 mb-2">{block.content}</h3>;

    case 'blockquote':
      return (
        <blockquote key={idx} className="border-l-4 border-accent pl-4 py-2 my-6 italic text-steel-blue text-sm">
          {block.content}
        </blockquote>
      );

    case 'list':
      if (block.ordered) {
        return (
          <ol key={idx} className="list-decimal list-outside ml-5 mb-4 space-y-1 text-sm text-steel-blue">
            {(block.items || []).map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        );
      }
      return (
        <ul key={idx} className="list-disc list-outside ml-5 mb-4 space-y-1 text-sm text-steel-blue">
          {(block.items || []).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );

    case 'image':
      return (
        <figure key={idx} className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt || ''} className="w-full rounded object-cover" loading="lazy" />
          {block.caption && <figcaption className="text-xs text-gray-400 text-center mt-2">{block.caption}</figcaption>}
        </figure>
      );

    default:
      // Unknown block type — silently skip
      return null;
  }
}

export default function BlogContentRenderer({ content, contentBlocks }: BlogContentRendererProps) {
  // If content_blocks exist and are populated, prefer structured rendering
  if (contentBlocks && contentBlocks.length > 0) {
    return (
      <div className="blog-content max-w-3xl">
        {contentBlocks.map((block, idx) => renderBlock(block, idx))}
      </div>
    );
  }

  // Fallback: sanitize and render HTML content field
  const cleanHtml = DOMPurify.sanitize(content, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });

  return (
    <div
      className="blog-content max-w-3xl prose-sm prose-headings:font-bold prose-headings:text-foreground prose-p:text-steel-blue prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-accent prose-ul:text-steel-blue prose-ol:text-steel-blue prose-table:text-sm overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
