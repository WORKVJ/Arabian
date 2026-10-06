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

function formatInlineMarkdown(text: string): string {
  if (!text) return '';
  return text
    // Markdown Images ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-4 object-cover" loading="lazy" />')
    // Markdown Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-700 font-semibold underline hover:text-amber-800 transition">$1</a>')
    // Bold **text**
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic *text*
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    // Inline code `code`
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-amber-700 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
}

function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  // If it already contains HTML tags (and not markdown ##), format any inline markdown links and return
  if (/<(h[1-6]|p|div|ul|ol|table)[\s\S]*>/i.test(markdown) && !markdown.includes('## ')) {
    return formatInlineMarkdown(markdown);
  }

  const lines = markdown.split('\n');
  const htmlLines: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      continue;
    }

    // Markdown Headers
    if (line.startsWith('### ')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(`<h3 class="text-lg font-bold text-foreground mt-6 mb-2">${formatInlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(`<h2 class="text-xl font-bold text-foreground mt-8 mb-3">${formatInlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(`<h1 class="text-2xl font-bold text-foreground mt-8 mb-4">${formatInlineMarkdown(line.slice(2))}</h1>`);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(`<blockquote class="border-l-4 border-amber-600 pl-4 py-2 my-4 italic text-slate-600 text-sm">${formatInlineMarkdown(line.slice(2))}</blockquote>`);
      continue;
    }

    // Bullet lists (* or -)
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        htmlLines.push('<ul class="list-disc pl-5 my-3 space-y-1">');
        inList = true;
      }
      const itemText = formatInlineMarkdown(line.slice(2));
      htmlLines.push(`<li>${itemText}</li>`);
      continue;
    } else if (inList) {
      htmlLines.push('</ul>');
      inList = false;
    }

    // Paragraph with inline markdown links and styles
    htmlLines.push(`<p class="mb-4 leading-relaxed">${formatInlineMarkdown(line)}</p>`);
  }

  if (inList) {
    htmlLines.push('</ul>');
  }

  return htmlLines.join('\n');
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

  // Convert markdown if needed, then sanitize HTML
  const parsedHtml = parseMarkdownToHtml(content);
  const cleanHtml = DOMPurify.sanitize(parsedHtml, {
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
