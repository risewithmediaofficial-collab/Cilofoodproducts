import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'

import { cloudflare } from "@cloudflare/vite-plugin";

// Blog slugs — kept in sync with blogData.js so sitemap stays accurate
const blogSlugs = [
  'taste-the-tropics-mango-juice',
  'crisp-and-refreshing-apple-juice',
  'the-bold-flavor-of-grapes',
  'citrus-burst-orange-juice',
  'zesty-white-lemon',
  'green-lemon-carbonated-refreshment',
  'paneer-soda-nostalgia-in-a-bottle',
  'the-classic-cola-experience',
  'jeera-masala-the-digestive-refresher',
  'salt-lemon-the-ultimate-hydrator',
  'mango-2-double-the-mango-magic',
  'tropical-escape-pineapple-juice',
  // Local SEO blog posts
  'best-juice-in-krishnagiri',
  'fresh-juice-hosur-guide',
  'summer-drinks-krishnagiri-2026',
  'healthy-juice-tamil-nadu-brand',
  'juice-dealership-krishnagiri-opportunity',
]

const productSlugs = [
  'mango', 'apple', 'orange', 'grape', 'pineapple',
  'cola', 'paneer-soda', 'jeera-masala', 'salt-lemon',
  'green-lemon', 'white-lemon', 'mango-2',
]

const locationSlugs = [
  'krishnagiri', 'hosur', 'dharmapuri', 'chennai', 'salem', 'coimbatore', 'tamil-nadu',
]

const localSEORoutes = [
  '/best-juice-krishnagiri',
  '/fresh-juice-hosur',
  '/healthy-juice-tamil-nadu',
  '/premium-juice-dharmapuri',
  '/summer-drinks-krishnagiri',
  '/juice-distributor-krishnagiri',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap({
    hostname: 'https://richifoodproducts.com',
    changefreq: 'weekly',
    priority: 0.7,
    robots: [],
    lastmod: new Date().toISOString(),
    dynamicRoutes: [
      '/',
      '/about',
      '/products',
      '/contact',
      '/blog',
      '/csr',
      '/investors',
      '/insights',
      '/dealership',
      ...blogSlugs.map(slug => `/blog/${slug}`),
      ...productSlugs.map(slug => `/product/${slug}`),
      ...locationSlugs.map(city => `/location/${city}`),
      ...localSEORoutes,
    ],
  }), cloudflare()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':     ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'icons-vendor':     ['lucide-react'],
          'seo-vendor':       ['react-helmet-async'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    target: 'esnext',
  },

  assetsInclude: ['**/*.woff', '**/*.woff2'],
})