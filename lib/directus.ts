import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';

// Directus collections schema
interface DocsCollection {
  id: string;
  title: string;
  description?: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  date_created: string;
  date_updated: string;
  category?: string;
  tags?: string[];
  order?: number;
}

// Directus schema type
type DirectusSchema = {
  docs: DocsCollection[];
};

// Create Directus client
export const directus = createDirectus<DirectusSchema>(
  process.env.DIRECTUS_URL || 'http://localhost:8055'
)
  .with(rest())
  .with(staticToken(process.env.DIRECTUS_TOKEN || ''));

// Fetch docs from Directus
export async function getDocsFromDirectus() {
  try {
    const docs = await directus.request(
      readItems('docs', {
        filter: {
          status: {
            _eq: 'published',
          },
        },
        sort: ['order', 'date_created'],
      })
    );
    return docs;
  } catch (error) {
    console.error('Error fetching docs from Directus:', error);
    return [];
  }
}

// Transform Directus content to Fumadocs format
export function transformDirectusContent(docs: DocsCollection[]) {
  const transformedDocs = docs.map((doc) => ({
    url: `/docs/${doc.slug}`,
    slug: [doc.slug],
    file: {
      path: `${doc.slug}.mdx`,
      name: `${doc.slug}.mdx`,
    },
    data: {
      title: doc.title,
      description: doc.description,
      body: doc.content,
      structuredData: {
        headings: [], // You can parse headings from content if needed
        contents: doc.content,
      },
      exports: {},
      toc: [], // Table of contents can be generated from content
      load: async () => ({
        body: () => doc.content, // For MDX rendering, you might need to process this
        toc: [], // Parse TOC from content
      }),
    },
  }));

  return { docs: transformedDocs };
}