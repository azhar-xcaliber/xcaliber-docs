const {
  createDirectus,
  rest,
  staticToken,
  createCollection,
  createField,
} = require("@directus/sdk");

async function setupOpenAPICollection() {
  console.log("🚀 Setting up OpenAPI collection in Directus...");

  const directus = createDirectus(
    process.env.DIRECTUS_URL || "https://xcaliber-health.directus.app"
  )
    .with(rest())
    .with(staticToken(process.env.DIRECTUS_TOKEN || ""));

  try {
    // Create the openapi_specs collection
    console.log("📦 Creating openapi_specs collection...");
    await directus.request(
      createCollection({
        collection: "openapi_specs",
        meta: {
          collection: "openapi_specs",
          icon: "api",
          note: "OpenAPI specifications for API reference documentation",
          display_template: "{{title}} ({{version}})",
          hidden: false,
          singleton: false,
          translations: [],
          archive_field: null,
          archive_app_filter: true,
          archive_value: null,
          unarchive_value: null,
          sort_field: "order",
          accountability: "all",
          color: "#2563EB",
          item_duplication_fields: null,
          sort: 1,
          group: null,
          collapse: "open",
        },
        schema: {
          name: "openapi_specs",
        },
      })
    );

    // Create fields for the collection
    const fields = [
      {
        field: "id",
        type: "uuid",
        meta: {
          field: "id",
          special: ["auto-increment"],
          interface: "input",
          options: null,
          display: null,
          display_options: null,
          readonly: true,
          hidden: true,
          sort: 1,
          width: "full",
          translations: null,
          note: null,
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: "id",
          table: "openapi_specs",
          data_type: "integer",
          default_value: null,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: true,
          is_generated: false,
          generation_expression: null,
          has_auto_increment: true,
          foreign_key_column: null,
          foreign_key_table: null,
        },
      },
      {
        field: "title",
        type: "string",
        meta: {
          field: "title",
          special: null,
          interface: "input",
          options: {
            placeholder: "API Name",
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 2,
          width: "full",
          translations: null,
          note: "The display name for the API",
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: "title",
          table: "openapi_specs",
          data_type: "varchar",
          default_value: null,
          max_length: 255,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          is_generated: false,
          generation_expression: null,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
        },
      },
      {
        field: "description",
        type: "text",
        meta: {
          field: "description",
          special: null,
          interface: "input-multiline",
          options: {
            placeholder: "Brief description of the API",
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 3,
          width: "full",
          translations: null,
          note: "Brief description of the API",
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: "description",
          table: "openapi_specs",
          data_type: "text",
          default_value: null,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          is_generated: false,
          generation_expression: null,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
        },
      },
      {
        field: "slug",
        type: "string",
        meta: {
          field: "slug",
          special: null,
          interface: "input",
          options: {
            slug: true,
            placeholder: "url-friendly-name",
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 4,
          width: "half",
          translations: null,
          note: "URL-friendly identifier (used in /apireference/{slug})",
          conditions: null,
          required: true,
          group: null,
          validation: {
            _and: [
              {
                slug: {
                  _regex: "^[a-z0-9-]+$",
                },
              },
            ],
          },
          validation_message:
            "Slug must contain only lowercase letters, numbers, and hyphens",
        },
        schema: {
          name: "slug",
          table: "openapi_specs",
          data_type: "varchar",
          default_value: null,
          max_length: 255,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: true,
          is_primary_key: false,
          is_generated: false,
          generation_expression: null,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
        },
      },
      {
        field: "openapi_file",
        type: "uuid",
        meta: {
          field: "openapi_file",
          special: ["file"],
          interface: "file",
          options: {
            accept:
              "application/json,text/yaml,application/x-yaml,application/yaml",
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 5,
          width: "full",
          translations: null,
          note: "OpenAPI specification file (JSON or YAML)",
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: "openapi_file",
          table: "openapi_specs",
          data_type: "char",
          default_value: null,
          max_length: 36,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          is_generated: false,
          generation_expression: null,
          has_auto_increment: false,
          foreign_key_column: "id",
          foreign_key_table: "directus_files",
        },
      },
      {
        field: "status",
        type: "string",
        meta: {
          field: "status",
          special: null,
          interface: "select-dropdown",
          options: {
            choices: [
              { text: "Published", value: "published" },
              { text: "Draft", value: "draft" },
            ],
          },
          display: "labels",
          display_options: {
            choices: [
              {
                text: "Published",
                value: "published",
                foreground: "#FFFFFF",
                background: "#22C55E",
              },
              {
                text: "Draft",
                value: "draft",
                foreground: "#FFFFFF",
                background: "#F59E0B",
              },
            ],
          },
          readonly: false,
          hidden: false,
          sort: 6,
          width: "half",
          translations: null,
          note: "Publication status",
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: "status",
          table: "openapi_specs",
          data_type: "varchar",
          default_value: "draft",
          max_length: 255,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          is_generated: false,
          generation_expression: null,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
        },
      },
      {
        field: "version",
        type: "string",
        meta: {
          field: "version",
          special: null,
          interface: "input",
          options: {
            placeholder: "1.0.0",
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 7,
          width: "half",
          translations: null,
          note: "API version",
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: "version",
          table: "openapi_specs",
          data_type: "varchar",
          default_value: null,
          max_length: 255,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          is_generated: false,
          generation_expression: null,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
        },
      },
      {
        field: "category",
        type: "string",
        meta: {
          field: "category",
          special: null,
          interface: "input",
          options: {
            placeholder: "e.g., Core API, Payments, Users",
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 8,
          width: "half",
          translations: null,
          note: "Category for organization",
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: "category",
          table: "openapi_specs",
          data_type: "varchar",
          default_value: null,
          max_length: 255,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          is_generated: false,
          generation_expression: null,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
        },
      },
      {
        field: "order",
        type: "integer",
        meta: {
          field: "order",
          special: null,
          interface: "input",
          options: {
            placeholder: "1",
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 9,
          width: "half",
          translations: null,
          note: "Display order (lower numbers first)",
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: "order",
          table: "openapi_specs",
          data_type: "integer",
          default_value: null,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          is_generated: false,
          generation_expression: null,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
        },
      },
    ];

    // Create each field with error handling
    for (const field of fields) {
      console.log(`📝 Creating field: ${field.field}...`);
      try {
        await directus.request(createField("openapi_specs", field));
        console.log(`✅ Field ${field.field} created successfully`);
      } catch (fieldError) {
        if (
          fieldError.message &&
          fieldError.message.includes("already exists")
        ) {
          console.log(`⚠️  Field ${field.field} already exists, skipping...`);
        } else {
          console.error(
            `❌ Error creating field ${field.field}:`,
            fieldError.message
          );
        }
      }
    }

    console.log("✅ OpenAPI collection setup completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Visit your Directus admin panel");
    console.log('2. Go to the "OpenAPI Specs" collection');
    console.log("3. Upload your OpenAPI specification files");
    console.log("4. Create records linking to those files");
    console.log('5. Set status to "published" to make them visible');
    console.log(
      "\n🔗 Your API reference will be available at: /apireference/{slug}"
    );
  } catch (error) {
    if (error.message && error.message.includes("already exists")) {
      console.log("⚠️  Collection already exists. Skipping creation.");
    } else {
      console.error("❌ Error setting up OpenAPI collection:", error);
      process.exit(1);
    }
  }
}

// Run the setup
setupOpenAPICollection().catch(console.error);
