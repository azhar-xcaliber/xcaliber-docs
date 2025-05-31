import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
// This handles local MDX content only
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});

// Remote content is handled directly in components following the BaseHub pattern
// See app/docs/layout.tsx and app/docs/remote/[slug]/page.tsx for implementation
