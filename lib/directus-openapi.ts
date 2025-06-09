import { createDirectus, rest, readItems, staticToken } from "@directus/sdk";
import { cache } from "react";

// OpenAPI Specs collection interface
interface OpenAPISpecCollection {
  id: string;
  title: string;
  description?: string;
  slug: string;
  openapi_file: string;
  status: "published" | "draft";
  version?: string;
  category?: string;
  order?: number;
  date_created: string;
  date_updated: string;
}

// Extend existing Directus schema
type ExtendedDirectusSchema = {
  docs: {
    id: string;
    title: string;
    description?: string;
    slug: string;
    content: string;
    status: "published" | "draft";
    date_created: string;
    date_updated: string;
    category?: string;
    tags?: string[];
    order?: number;
  }[];
  openapi_specs: OpenAPISpecCollection[];
};

// Use existing directus client configuration
export const directus = createDirectus<ExtendedDirectusSchema>(
  process.env.DIRECTUS_URL || "http://localhost:8055"
)
  .with(rest())
  .with(staticToken(process.env.DIRECTUS_TOKEN || ""));

// Fetch all published OpenAPI specs
export const getOpenAPISpecs = cache(async () => {
  try {
    const specs = await directus.request(
      readItems("openapi_specs", {
        filter: {
          status: { _eq: "published" },
        },
        sort: ["order", "title"],
      })
    );
    return specs;
  } catch (error) {
    console.error("Error fetching OpenAPI specs from Directus:", error);
    // Fallback to mock data if Directus is not available or collection doesn't exist
    return [
      {
        id: "1",
        title: "Pet Store API",
        description: "A sample API for testing OpenAPI integration",
        slug: "pet-store",
        openapi_file: "mock-file-id",
        status: "published" as const,
        version: "1.0.0",
        category: "Sample",
        order: 1,
        date_created: new Date().toISOString(),
        date_updated: new Date().toISOString(),
      },
    ];
  }
});

// Fetch specific OpenAPI spec by slug
export const getOpenAPISpec = cache(async (slug: string) => {
  try {
    const specs = await directus.request(
      readItems("openapi_specs", {
        filter: {
          slug: { _eq: slug },
          status: { _eq: "published" },
        },
        limit: 1,
      })
    );
    return specs[0] || null;
  } catch (error) {
    console.error(
      `Error fetching OpenAPI spec '${slug}' from Directus:`,
      error
    );
    // Fallback to mock data
    if (slug === "pet-store") {
      return {
        id: "1",
        title: "Pet Store API",
        description: "A sample API for testing OpenAPI integration",
        slug: "pet-store",
        openapi_file: "mock-file-id",
        status: "published" as const,
        version: "1.0.0",
        category: "Sample",
        order: 1,
        date_created: new Date().toISOString(),
        date_updated: new Date().toISOString(),
      };
    }
    return null;
  }
});

// Fetch OpenAPI file content
export const getOpenAPIFileContent = cache(async (fileId: string) => {
  try {
    // Try to fetch actual file content from Directus
    // The Directus readFile function should get the raw file content
    const response = await fetch(
      `${process.env.DIRECTUS_URL}/assets/${fileId}?access_token=${process.env.DIRECTUS_TOKEN}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      );
    }

    const fileContent = await response.text();

    // Parse JSON or YAML content
    try {
      return JSON.parse(fileContent);
    } catch {
      // If JSON parsing fails, try to handle as YAML (basic support)
      // For production, you might want to add a YAML parser
      console.warn("YAML parsing not implemented, treating as raw content");
      return fileContent;
    }
  } catch (error) {
    console.error(`Error fetching OpenAPI file '${fileId}':`, error);

    // Fallback to local test file for development
    if (fileId === "mock-file-id") {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const filePath = path.join(
          process.cwd(),
          "test-data",
          "sample-api.json"
        );
        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent);
      } catch (localError) {
        console.error("Error loading local fallback file:", localError);
        return null;
      }
    }
    return null;
  }
});

// Get complete OpenAPI document with metadata
export const getOpenAPIDocument = cache(async (slug: string) => {
  const spec = await getOpenAPISpec(slug);
  if (!spec) return null;

  const document = await getOpenAPIFileContent(spec.openapi_file);
  if (!document) return null;

  return {
    spec,
    document,
  };
});

// Utility function to validate OpenAPI specification
export function validateOpenAPISpec(document: unknown): boolean {
  if (!document || typeof document !== "object") {
    return false;
  }

  const doc = document as Record<string, unknown>;

  // Check for OpenAPI 3.x or Swagger 2.x
  const hasOpenAPI = Boolean(doc.openapi && typeof doc.openapi === "string");
  const hasSwagger = Boolean(doc.swagger && typeof doc.swagger === "string");

  // Must have info object
  const hasInfo = Boolean(doc.info && typeof doc.info === "object");

  return (hasOpenAPI || hasSwagger) && hasInfo;
}

// Get OpenAPI specs by category
export const getOpenAPISpecsByCategory = cache(async () => {
  const specs = await getOpenAPISpecs();

  const categorized: Record<string, typeof specs> = {};
  const uncategorized: typeof specs = [];

  specs.forEach((spec) => {
    if (spec.category) {
      if (!categorized[spec.category]) {
        categorized[spec.category] = [];
      }
      categorized[spec.category].push(spec);
    } else {
      uncategorized.push(spec);
    }
  });

  return {
    categorized,
    uncategorized,
  };
});
