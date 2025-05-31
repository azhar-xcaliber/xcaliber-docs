import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { getDocsFromDirectus } from '@/lib/directus';
import { compileMDX } from '@fumadocs/mdx-remote';


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

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  
  // First try local content
  const localPage = source.getPage(params.slug);
  if (localPage) {
    const MDXContent = localPage.data.body;
    return (
      <DocsPage toc={localPage.data.toc} full={localPage.data.full}>
        <DocsTitle>{localPage.data.title}</DocsTitle>
        <DocsDescription>{localPage.data.description}</DocsDescription>
        <DocsBody>
          <MDXContent
            components={getMDXComponents({
              a: createRelativeLink(source, localPage),
            })}
          />
        </DocsBody>
      </DocsPage>
    );
  }
  
  // If no local content, try remote content
  const slugPath = params.slug?.join('/') || '';
  const remoteDocs = await getDocsFromDirectus();
  const remotePage = remoteDocs.find(doc => doc.slug === slugPath);
  
  if (!remotePage) notFound();

  const compiled = await compileMDX({
    source: remotePage.content,
  });

  const MdxContent = compiled.body;

  const toc = parseMarkdownToc(remotePage.content);

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{remotePage.title}</DocsTitle>
      <DocsDescription>{remotePage.description}</DocsDescription>
      <DocsBody>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
           <MdxContent components={getMDXComponents()} />
        </div>
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
            📡 <strong>Remote Content</strong>
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            This page is loaded from Directus CMS. Content ID: <code className="text-xs">{remotePage.id}</code>
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">
            Last updated: {new Date(remotePage.date_updated).toLocaleString()}
          </p>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const localParams = source.generateParams();
  
  try {
    const remoteDocs = await getDocsFromDirectus();
    const remoteParams = remoteDocs.map((doc) => ({
      slug: doc.slug.split('/'),
    }));
    
    return [...localParams, ...remoteParams];
  } catch (error) {
    console.error('Error generating static params for remote content:', error);
    return localParams;
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  
  // Try local content first
  const localPage = source.getPage(params.slug);
  if (localPage) {
    return {
      title: localPage.data.title,
      description: localPage.data.description,
    };
  }
  
  // Try remote content
  try {
    const slugPath = params.slug?.join('/') || '';
    const remoteDocs = await getDocsFromDirectus();
    const remotePage = remoteDocs.find(doc => doc.slug === slugPath);
    
    if (remotePage) {
      return {
        title: remotePage.title,
        description: remotePage.description,
      };
    }
  } catch (error) {
    console.error('Error generating metadata for remote content:', error);
  }
  
  return {
    title: 'Page Not Found',
  };
}
