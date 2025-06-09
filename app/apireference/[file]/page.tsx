import { APIPage } from "fumadocs-openapi/ui";
import {
  openapi,
  getAPIPageProps,
  getOpenAPISpec,
  getOpenAPISpecs,
} from "@/lib/openapi-source";
import { notFound } from "next/navigation";
import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
} from "fumadocs-ui/page";

export default async function APIReferencePage({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  const { file } = await params;

  const spec = await getOpenAPISpec(file);
  if (!spec) notFound();

  const apiPageProps = await getAPIPageProps(file);
  if (!apiPageProps) notFound();

  return (
    <DocsPage>
      <DocsTitle>{spec.title}</DocsTitle>
      <DocsDescription>{spec.description}</DocsDescription>
      <DocsBody>
        <APIPage {...openapi.getAPIPageProps(apiPageProps)} />

        {/* Metadata footer */}
        <div className='mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
          <p className='text-sm text-blue-700 dark:text-blue-300 mb-2'>
            🔌 <strong>API Reference - Proof of Concept</strong>
          </p>
          <div className='flex items-center gap-4 text-sm text-blue-600 dark:text-blue-400'>
            {spec.version && <span>Version: {spec.version}</span>}
            <span>
              Last updated: {new Date(spec.date_updated).toLocaleString()}
            </span>
          </div>
          <p className='text-xs text-blue-500 dark:text-blue-500 mt-1'>
            In production, this would be loaded from Directus CMS
          </p>
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const specs = await getOpenAPISpecs();
  return specs.map((spec) => ({ file: spec.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  const { file } = await params;
  const spec = await getOpenAPISpec(file);

  if (!spec) {
    return { title: "API Reference Not Found" };
  }

  return {
    title: `${spec.title} - API Reference`,
    description: spec.description,
    openGraph: {
      title: `${spec.title} - API Reference`,
      description: spec.description,
      type: "website",
    },
  };
}

// Optional: Enable revalidation for dynamic content
export const revalidate = 3600; // Revalidate every hour
