# Directus Integration with Fumadocs

This setup allows you to use Directus as a remote content source for your Fumadocs documentation, following the BaseHub pattern for clean CMS integration.

## Setup Instructions

### 1. Configure Environment Variables

Update your `.env.local` file with your Directus configuration:

```env
DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_TOKEN=your_static_token_here
```

The token should have read permissions for the `docs` collection.

### 2. Create Collection in Directus

You need to create one collection in your Directus instance:

#### `docs` Collection
Fields:
- `id` (UUID, Primary Key)
- `title` (String, Required) - Page title
- `description` (Text) - Page description for SEO
- `slug` (String, Required, Unique) - URL slug
- `content` (Text, Code Interface with Markdown) - Page content in Markdown
- `status` (String, Dropdown: published/draft) - Publication status
- `category` (String) - Page category
- `order` (Integer) - Sort order
- `date_created` (Timestamp, Auto-created)
- `date_updated` (Timestamp, Auto-updated)

### 3. Manual Collection Setup

Create the collection in your Directus admin panel:

1. Go to Settings > Data Model
2. Create the `docs` collection with the fields listed above
3. Make sure the field types and interfaces match the specifications

### 4. Add Content

1. Create documentation pages in the `docs` collection
2. Use the `category` field to group related pages
3. Use the `order` field to control page ordering
4. Set the status to "published" for pages you want to display

### 5. Test the Integration

Run your development server:

```bash
npm run dev
```

Your documentation should now include both local MDX files and remote Directus content in the navigation.

## How It Works (BaseHub Pattern)

### Architecture
- **Direct CMS queries** in server components
- **Dynamic navigation building** in layout component
- **No complex source abstractions**

### Key Files
- `app/docs/layout.tsx` - Async layout that builds navigation with remote content
- `app/docs/remote/[slug]/page.tsx` - Individual remote pages
- `lib/directus.ts` - Directus client and data fetching

### Content Sources
- **Local Content**: MDX files in your `/content` directory
- **Remote Content**: Pages from your Directus `docs` collection

## Creating Sub-Pages

To create hierarchical navigation with sub-pages, simply use forward slashes in your slug field:

### For Parent Pages:
```json
{
  "title": "Getting Started",
  "slug": "getting-started",
  "content": "# Getting Started\n\nThis is the parent page...",
  "status": "published",
  "category": "guides",
  "order": 1
}
```

### For Child Pages:
```json
{
  "title": "Installation",
  "slug": "getting-started/installation",
  "content": "# Installation\n\nHow to install...",
  "status": "published",
  "category": "guides",
  "order": 1
}
```

### For Deeper Nesting:
```json
{
  "title": "Docker Setup",
  "slug": "getting-started/installation/docker",
  "content": "# Docker Setup\n\nHow to install with Docker...",
  "status": "published",
  "category": "guides",
  "order": 1
}
```

### Navigation Structure

This creates navigation like:
```
📁 Getting Started
  └── Overview (/docs/remote/getting-started)
  └── Installation (/docs/remote/getting-started/installation)
  └── Configuration (/docs/remote/getting-started/configuration)
```

## Example Content

### Simple Page (No Sub-pages)
```json
{
  "title": "Introduction",
  "slug": "introduction",
  "content": "# Introduction\n\nWelcome...",
  "status": "published",
  "category": "guides",
  "order": 1
}
```

### Parent + Child Pages
```json
// Parent
{
  "title": "API Reference",
  "slug": "api-reference",
  "content": "# API Reference\n\nOverview...",
  "status": "published",
  "category": "reference",
  "order": 1
}

// Child
{
  "title": "Authentication",
  "slug": "api-reference/authentication",
  "content": "# Authentication\n\nHow to authenticate...",
  "status": "published",
  "category": "reference",
  "order": 1
}
```

That's it! Just use forward slashes in the slug to create hierarchical navigation automatically.