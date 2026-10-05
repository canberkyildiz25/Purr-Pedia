import path from 'node:path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  trailingSlash: true,
  // opening a breed grows its photograph from the tile into the page
  experimental: { viewTransition: true },
  images: {
    // The first source's photographs stay on its own CDN. They arrive there
    // at up to 5,000 pixels wide, so every one is resized here before it is
    // sent. The ones from Wikimedia Commons are files in public/commons.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn2.thecatapi.com', pathname: '/images/**' }],
    formats: ['image/webp'],
    // few widths and one quality, held for a month: a photograph is resized a handful of times, not once per visitor
    deviceSizes: [640, 960, 1280, 1920],
    imageSizes: [160, 320, 480],
    qualities: [82],
    minimumCacheTTL: 2678400,
  },
};

export default config;
