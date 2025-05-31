import { getDocsFromDirectus } from '@/lib/directus';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';

// Helper function to parse markdown headings for TOC
function parseMarkdownToc(content: string) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: Array<{ title: string; url: string; depth: number }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2];
    const url = `#${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
    
    toc.push({
      title,
      url,
      depth: level,
    });
  }

  return toc;
}

// Helper function to convert markdown to HTML (basic)
function markdownToHtml(content: string) {
  return content
    .replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4 id="$1">$1</h4>')
    .replace(/^##### (.+)$/gm, '<h5 id="$1">$1</h5>')
    .replace(/^###### (.+)$/gm, '<h6 id="$1">$1</h6>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h1-6]|<\/p>)(.+)$/gm, '<p>$1</p>')
    .replace(/(<h[1-6][^>]*>)([^<]+)<\/h[1-6]>/g, (match, openTag, title) => {
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return openTag.replace('>', ` id="${id}">`) + title + openTag.replace('<', '</');
    });
}

export default async function RemotePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const docs = await getDocsFromDirectus();
  
  // Find page by matching the full slug path
  const page = docs.find(doc => doc.slug === slugPath);
  
  if (!page) notFound();

  const toc = parseMarkdownToc(page.content);
  const htmlContent = markdownToHtml(page.content);

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <DocsBody>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
            📡 <strong>Remote Content</strong>
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            This page is loaded from Directus CMS. Content ID: <code className="text-xs">{page.id}</code>
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">
            Last updated: {new Date(page.date_updated).toLocaleString()}
          </p>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  try {
    const docs = await getDocsFromDirectus();
    return docs.map((doc) => ({
      slug: doc.slug.split('/'),
    }));
  } catch (error) {
    console.error('Error generating static params for remote content:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  try {
    const { slug } = await params;
    const slugPath = slug.join('/');
    const docs = await getDocsFromDirectus();
    const page = docs.find(doc => doc.slug === slugPath);
    
    if (!page) {
      return {
        title: 'Page Not Found',
      };
    }

    return {
      title: page.title,
      description: page.description,
    };
  } catch (error) {
    console.error('Error generating metadata for remote content:', error);
    return {
      title: 'Remote Content',
    };
  }
}