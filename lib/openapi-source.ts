import { createOpenAPI } from "fumadocs-openapi/server";
import {
  getOpenAPISpecs as getDirectusOpenAPISpecs,
  getOpenAPISpec as getDirectusOpenAPISpec,
  getOpenAPIDocument as getDirectusOpenAPIDocument,
  validateOpenAPISpec,
} from "./directus-openapi";

// Create OpenAPI instance for fumadocs
export const openapi = createOpenAPI({
  // Configure basic settings
});

// Export Directus functions with validation
export async function getOpenAPISpecs() {
  return getDirectusOpenAPISpecs();
}

export async function getOpenAPISpec(slug: string) {
  return getDirectusOpenAPISpec(slug);
}

export async function getOpenAPIDocument(slug: string) {
  const result = await getDirectusOpenAPIDocument(slug);

  // Validate the OpenAPI document
  if (result && !validateOpenAPISpec(result.document)) {
    console.warn(`Invalid OpenAPI specification for ${slug}`);
    return null;
  }

  return result;
}

// Generate navigation tree for API reference
export async function generateAPIReferenceTree() {
  const specs = await getOpenAPISpecs();

  const pages = specs.map((spec) => ({
    type: "page" as const,
    name: spec.title,
    url: `/apireference/${spec.slug}`,
    description: spec.description,
  }));

  return {
    name: "API Reference",
    children: pages,
  };
}

// Get OpenAPI page props for fumadocs
export async function getAPIPageProps(slug: string) {
  const data = await getOpenAPIDocument(slug);
  if (!data) return null;

  // Extract operations from the OpenAPI document
  const operations: Array<{ path: string; method: string }> = [];
  const webhooks: never[] = [];

  if (data.document.paths) {
    for (const [path, methods] of Object.entries(data.document.paths)) {
      if (typeof methods === "object" && methods !== null) {
        for (const [method] of Object.entries(methods)) {
          if (
            [
              "get",
              "post",
              "put",
              "delete",
              "patch",
              "head",
              "options",
            ].includes(method)
          ) {
            operations.push({ path, method });
          }
        }
      }
    }
  }

  return {
    document: data.document,
    operations,
    webhooks,
    hasHead: false,
  };
}
