import { getOpenAPISpecs } from "@/lib/openapi-source";
import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
} from "fumadocs-ui/page";
import Link from "next/link";

export default async function APIReferenceIndexPage() {
  const specs = await getOpenAPISpecs();

  return (
    <DocsPage>
      <DocsTitle>API Reference</DocsTitle>
      <DocsDescription>
        Comprehensive API documentation for all available services
      </DocsDescription>
      <DocsBody>
        <div className='grid gap-4 mt-6'>
          {specs.map((spec) => (
            <Link
              key={spec.id}
              href={`/apireference/${spec.slug}`}
              className='block p-4 border rounded-lg hover:border-blue-500 transition-colors'
            >
              <h3 className='font-semibold text-lg'>{spec.title}</h3>
              {spec.description && (
                <p className='text-gray-600 dark:text-gray-400 mt-1'>
                  {spec.description}
                </p>
              )}
              {spec.version && (
                <span className='inline-block mt-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded'>
                  v{spec.version}
                </span>
              )}
            </Link>
          ))}
        </div>

        {specs.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            No API specifications available yet.
          </div>
        )}

        <div className='mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
          <p className='text-sm text-blue-700 dark:text-blue-300 mb-2'>
            🔌 <strong>OpenAPI Integration with Directus CMS</strong>
          </p>
          <p className='text-sm text-blue-600 dark:text-blue-400 mb-2'>
            API specifications are dynamically loaded from Directus CMS. The
            system falls back to test data during development.
          </p>
          <div className='text-xs text-blue-500 dark:text-blue-500'>
            <p>• Upload OpenAPI files to Directus Files collection</p>
            <p>
              • Create specs in the <code>openapi_specs</code> collection
            </p>
            <p>• Set status to &ldquo;published&rdquo; to make them visible</p>
            <p>
              • Run <code>npm run setup-openapi</code> to initialize the
              collection
            </p>
          </div>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export const metadata = {
  title: "API Reference",
  description: "Comprehensive API documentation for all available services",
};
