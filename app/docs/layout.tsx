import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';
import { getDocsFromDirectus } from '@/lib/directus';
import { PageTree } from 'fumadocs-core/server';

export default async function Layout({ children }: { children: ReactNode }) {
  // Build navigation tree with both local and remote content
  const localTree = source.pageTree;
  
  try {
    const remoteDocs = await getDocsFromDirectus();
    
    // Create navigation items for remote content with slug-based hierarchy
    const remoteItems: PageTree.Node[] = [];
    
    // Function to build hierarchical navigation from slugs
    function buildHierarchicalNav(docs: typeof remoteDocs) {
      // Group by category first
      const categories = new Map<string, typeof remoteDocs>();
      
      docs.forEach(doc => {
        const category = doc.category || 'Remote Content';
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        categories.get(category)!.push(doc);
      });
      
      // Build navigation for each category
      for (const [category, categoryDocs] of categories.entries()) {
        if (categories.size > 1) {
          remoteItems.push({
            type: 'separator',
            name: category,
          });
        }
        
        // Group pages by hierarchy using slug
        const pageMap = new Map<string, typeof categoryDocs[0]>();
        const childrenMap = new Map<string, typeof categoryDocs>();
        
        categoryDocs.forEach(doc => {
          pageMap.set(doc.slug, doc);
          const slugParts = doc.slug.split('/');
          
          if (slugParts.length > 1) {
            // This is a child page
            const parentSlug = slugParts.slice(0, -1).join('/');
            if (!childrenMap.has(parentSlug)) {
              childrenMap.set(parentSlug, []);
            }
            childrenMap.get(parentSlug)!.push(doc);
          }
        });
        
        // Get root pages (no slash in slug)
        const rootPages = categoryDocs
          .filter(doc => !doc.slug.includes('/'))
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        rootPages.forEach(rootDoc => {
          const children = childrenMap.get(rootDoc.slug);
          
          if (children && children.length > 0) {
            // This is a folder with child pages
            remoteItems.push({
              type: 'folder',
              name: rootDoc.title,
              children: [
                // Include the parent page itself
                {
                  type: 'page',
                  name: 'Overview',
                  url: `/docs/remote/${rootDoc.slug}`,
                },
                // Add child pages
                ...children
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map(child => ({
                    type: 'page' as const,
                    name: child.title,
                    url: `/docs/remote/${child.slug}`,
                  }))
              ],
            });
          } else {
            // This is a standalone page
            remoteItems.push({
              type: 'page',
              name: rootDoc.title,
              url: `/docs/remote/${rootDoc.slug}`,
            });
          }
        });
      }
    }
    
    buildHierarchicalNav(remoteDocs);
    
    // Combine local and remote navigation
    const combinedTree = {
      ...localTree,
      children: [
        ...(localTree?.children || []),
        ...(remoteItems.length > 0 ? [
          {
            type: 'separator' as const,
            name: 'Remote Content',
          },
          ...remoteItems
        ] : [])
      ],
    };
    
    return (
      <DocsLayout tree={combinedTree} {...baseOptions}>
        {children}
      </DocsLayout>
    );
  } catch (error) {
    console.error('Error building navigation with remote content:', error);
    
    // Fallback to local navigation only
    return (
      <DocsLayout tree={source.pageTree} {...baseOptions}>
        {children}
      </DocsLayout>
    );
  }
}
