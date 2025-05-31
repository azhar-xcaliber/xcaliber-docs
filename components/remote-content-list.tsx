'use client';

import { getDocsFromDirectus } from '@/lib/directus';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DirectusDoc {
  id: string;
  title: string;
  description?: string;
  slug: string;
  category?: string;
  date_updated: string;
}

export function RemoteContentList() {
  const [docs, setDocs] = useState<DirectusDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const remoteDocs = await getDocsFromDirectus();
        setDocs(remoteDocs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch remote content');
      } finally {
        setLoading(false);
      }
    }

    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">Loading remote content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-700 dark:text-yellow-300 font-medium mb-2">
          ⚠️ Remote Content Unavailable
        </p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          {error}
        </p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
          Make sure your Directus instance is configured properly.
        </p>
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
          📝 No Remote Content
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Connected to Directus, but no published documents found. Add some content to your Directus &quot;docs&quot; collection.
        </p>
      </div>
    );
  }

  // Group docs by category
  const groupedDocs = docs.reduce((acc, doc) => {
    const category = doc.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, DirectusDoc[]>);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-green-700 dark:text-green-300 font-medium mb-1">
          ✅ Connected to Directus
        </p>
        <p className="text-sm text-green-600 dark:text-green-400">
          Found {docs.length} published document(s)
        </p>
      </div>

      {Object.entries(groupedDocs).map(([category, categoryDocs]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
            {category}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {categoryDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/docs/remote/${doc.slug}`}
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
              >
                <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {doc.title}
                </h4>
                {doc.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {doc.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Updated: {new Date(doc.date_updated).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}