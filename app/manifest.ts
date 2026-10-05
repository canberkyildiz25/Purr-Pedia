import type { MetadataRoute } from 'next';
import { DESCRIPTION } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Catalogue',
    short_name: 'Catalogue',
    description: DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf6',
    theme_color: '#fbfaf6',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
