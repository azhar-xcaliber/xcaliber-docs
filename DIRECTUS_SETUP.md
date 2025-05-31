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

## How It Works (Sanity Pattern)

This integration follows the **Fumadocs Sanity pattern** for seamless content management:

### Content Resolution:
1. **Local First**: When a page is requested, it first checks for local MDX content
2. **Remote Fallback**: If no local content exists, it queries Directus for remote content
3. **Unified URLs**: Both local and remote content use the same URL structure (`/docs/slug`)

### Navigation Building:
- **Dynamic Navigation**: Layout component builds navigation from both sources
- **Category Grouping**: Remote content grouped by `category` field
- **Ordering**: Pages sorted by `order` field within categories

### Key Benefits:
- **Single Route**: Uses `app/docs/[[...slug]]/page.tsx` for all content
- **No Prefixes**: Remote content appears at `/docs/slug` (not `/docs/remote/slug`)
- **Seamless Experience**: Users can't distinguish between local and remote content

## Example Content

### Simple Remote Page:
```json
{
  "title": "API Authentication",
  "slug": "api/authentication",
  "content": "# API Authentication\n\nHow to authenticate with our API...",
  "status": "published",
  "category": "API Reference",
  "order": 1
}
```

**Result**: Accessible at `/docs/api/authentication` alongside local content.

### Multiple Pages in Category:
```json
// Page 1
{
  "title": "Getting Started",
  "slug": "getting-started",
  "content": "# Getting Started\n\nWelcome...",
  "status": "published",
  "category": "Guide",
  "order": 1
}

// Page 2
{
  "title": "Installation",
  "slug": "installation",
  "content": "# Installation\n\nHow to install...",
  "status": "published",
  "category": "Guide",
  "order": 2
}
```

**Result**: Both appear under "Guide" section in navigation, ordered by `order` field.

## Navigation Structure

Example navigation with mixed content:
```
📚 Documentation
├── 📄 Introduction (local MDX)
├── 📄 Test Page (local MDX)
├── ─── Remote Content ───
├── 📄 Getting Started (remote)
├── 📄 Installation (remote)
└── 📄 API Authentication (remote)
```

That's it! The Sanity pattern provides seamless integration between local and remote content.