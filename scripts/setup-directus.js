/**
 * Script to set up Directus collections for Fumadocs integration
 * 
 * This script helps you create the necessary collection in Directus:
 * 1. docs - for storing documentation pages
 * 
 * Run this after setting up your Directus instance and configuring your .env.local
 */

const { createDirectus, rest, staticToken, createCollection, createField } = require('@directus/sdk');

async function setupDirectusCollections() {
  // Read environment variables
  const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
  const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

  if (!DIRECTUS_TOKEN) {
    console.error('Please set DIRECTUS_TOKEN in your .env.local file');
    process.exit(1);
  }

  const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(DIRECTUS_TOKEN));

  try {
    // Create docs collection
    console.log('Creating docs collection...');
    await client.request(createCollection({
      collection: 'docs',
      meta: {
        collection: 'docs',
        icon: 'article',
        note: 'Documentation pages',
        display_template: '{{title}}',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'en-US',
            translation: 'Documentation'
          }
        ]
      },
      schema: {
        name: 'docs'
      }
    }));

    // Create fields for docs collection
    const docsFields = [
      {
        collection: 'docs',
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid']
        },
        schema: {
          is_primary_key: true
        }
      },
      {
        collection: 'docs',
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          display_options: {},
          readonly: false,
          hidden: false,
          sort: 1,
          width: 'full',
          translations: [
            {
              language: 'en-US',
              translation: 'Title'
            }
          ],
          note: 'Page title'
        },
        schema: {
          name: 'title',
          table: 'docs',
          data_type: 'varchar',
          default_value: null,
          max_length: 255,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null
        }
      },
      {
        collection: 'docs',
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          options: {},
          display: 'raw',
          display_options: {},
          readonly: false,
          hidden: false,
          sort: 2,
          width: 'full',
          translations: [
            {
              language: 'en-US',
              translation: 'Description'
            }
          ],
          note: 'Page description for SEO'
        }
      },
      {
        collection: 'docs',
        field: 'slug',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          display_options: {},
          readonly: false,
          hidden: false,
          sort: 3,
          width: 'half',
          translations: [
            {
              language: 'en-US',
              translation: 'Slug'
            }
          ],
          note: 'URL slug for the page'
        },
        schema: {
          name: 'slug',
          table: 'docs',
          data_type: 'varchar',
          default_value: null,
          max_length: 255,
          is_nullable: false,
          is_unique: true
        }
      },
      {
        collection: 'docs',
        field: 'content',
        type: 'text',
        meta: {
          interface: 'input-code',
          options: {
            language: 'markdown'
          },
          display: 'raw',
          display_options: {},
          readonly: false,
          hidden: false,
          sort: 4,
          width: 'full',
          translations: [
            {
              language: 'en-US',
              translation: 'Content'
            }
          ],
          note: 'Markdown content of the page'
        }
      },
      {
        collection: 'docs',
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              {
                text: 'Published',
                value: 'published'
              },
              {
                text: 'Draft',
                value: 'draft'
              }
            ]
          },
          display: 'labels',
          display_options: {
            choices: [
              {
                text: 'Published',
                value: 'published',
                foreground: '#FFFFFF',
                background: 'var(--primary)'
              },
              {
                text: 'Draft',
                value: 'draft',
                foreground: '#18222F',
                background: '#D3DAE4'
              }
            ]
          },
          readonly: false,
          hidden: false,
          sort: 5,
          width: 'half',
          translations: [
            {
              language: 'en-US',
              translation: 'Status'
            }
          ]
        },
        schema: {
          name: 'status',
          table: 'docs',
          data_type: 'varchar',
          default_value: 'draft',
          max_length: 255
        }
      },
      {
        collection: 'docs',
        field: 'category',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          display_options: {},
          readonly: false,
          hidden: false,
          sort: 6,
          width: 'half',
          translations: [
            {
              language: 'en-US',
              translation: 'Category'
            }
          ],
          note: 'Page category for organization'
        }
      },
      {
        collection: 'docs',
        field: 'order',
        type: 'integer',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          display_options: {},
          readonly: false,
          hidden: false,
          sort: 7,
          width: 'half',
          translations: [
            {
              language: 'en-US',
              translation: 'Order'
            }
          ],
          note: 'Sort order for page listing'
        }
      },
      {
        collection: 'docs',
        field: 'date_created',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          options: {},
          display: 'datetime',
          display_options: {
            relative: true
          },
          readonly: true,
          hidden: true,
          width: 'half',
          special: ['date-created'],
          translations: [
            {
              language: 'en-US',
              translation: 'Date Created'
            }
          ]
        },
        schema: {
          name: 'date_created',
          table: 'docs',
          data_type: 'timestamp',
          default_value: 'CURRENT_TIMESTAMP',
          is_nullable: false,
          generation_expression: null
        }
      },
      {
        collection: 'docs',
        field: 'date_updated',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          options: {},
          display: 'datetime',
          display_options: {
            relative: true
          },
          readonly: true,
          hidden: true,
          width: 'half',
          special: ['date-updated'],
          translations: [
            {
              language: 'en-US',
              translation: 'Date Updated'
            }
          ]
        },
        schema: {
          name: 'date_updated',
          table: 'docs',
          data_type: 'timestamp',
          default_value: 'CURRENT_TIMESTAMP',
          is_nullable: false,
          generation_expression: null
        }
      }
    ];

    for (const field of docsFields) {
      console.log(`Creating field: docs.${field.field}`);
      await client.request(createField(field.collection, field));
    }

    console.log('✅ Directus collection created successfully!');
    console.log('\nNext steps:');
    console.log('1. Add some documentation pages to the "docs" collection');
    console.log('2. Configure navigation in the "meta" collection');
    console.log('3. Make sure your DIRECTUS_TOKEN has read permissions for both collections');
    console.log('4. Update your .env.local with the correct Directus URL and token');

  } catch (error) {
    console.error('Error setting up Directus collections:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the setup
setupDirectusCollections();