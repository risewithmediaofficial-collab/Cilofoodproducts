import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from "@cloudflare/vite-plugin";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  build: {
    // Aggressive chunk splitting for better caching and parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    // Reduce bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    target: 'esnext',
  },

  // Optimize asset handling
  assetsInclude: ['**/*.woff', '**/*.woff2'],
})