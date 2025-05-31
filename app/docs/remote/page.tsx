import { getDocsFromDirectus } from '@/lib/directus';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import Link from 'next/link';

export default async function RemoteIndexPage() {
  let docs: Awaited<ReturnType<typeof getDocsFromDirectus>> = [];
  let error: string | null = null;

  try {
    docs = await getDocsFromDirectus();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <DocsPage toc={[]}>
      <DocsTitle>Remote Content from Directus</DocsTitle>
      <DocsDescription>
        This page demonstrates content fetched from Directus CMS
      </DocsDescription>
      <DocsBody>
        <div className="space-y-6">
          {error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-300 mb-2">
                ⚠️ <strong>Connection Error</strong>
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                Could not connect to Directus: {error}
              </p>
              <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded text-sm">
                <p className="font-medium mb-2">To fix this:</p>
                <ol className="list-decimal list-inside space-y-1 text-red-700 dark:text-red-300">
                  <li>Set up your Directus instance</li>
                  <li>Update <code>.env.local</code> with your Directus URL and token</li>
                  <li>Create the required collections (docs, meta)</li>
                  <li>Add some content to test with</li>
                </ol>
              </div>
            </div>
          ) : docs.length === 0 ? (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-700 dark:text-yellow-300 mb-2">
                📝 <strong>No Content Found</strong>
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Connected to Directus successfully, but no published documents found.
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                Add some content to your Directus &quot;docs&quot; collection with status &quot;published&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300 mb-2">
                  ✅ <strong>Connected to Directus</strong>
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Found {docs.length} published document(s)
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      <Link
                        href={`/docs/remote/${doc.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {doc.title}
                      </Link>
                    </h3>
                    {doc.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <span>Status: {doc.status}</span>
                      {doc.category && <span>Category: {doc.category}</span>}
                      <span>Updated: {new Date(doc.date_updated).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📚 Setup Instructions
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              To get started with Directus remote content:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-600 dark:text-blue-400">
              <li>Follow the setup guide in <code>DIRECTUS_SETUP.md</code></li>
              <li>Configure your <code>.env.local</code> file</li>
              <li>Create the required collections in Directus</li>
              <li>Add some documentation content</li>
              <li>Visit <code>/docs/remote/[slug]</code> to view individual pages</li>
            </ol>
          </div>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export const metadata = {
  title: 'Remote Content from Directus',
  description: 'Demo page showing content fetched from Directus CMS',
};