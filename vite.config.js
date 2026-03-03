import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Dependency optimization
  optimizeDeps: {
    exclude: ['pdfjs-dist', '@imgly/background-removal'],
  },

  build: {
    // Target modern browsers — smaller, faster bundles
    target: 'esnext',

    // Split CSS per chunk — only load styles for the current route
    cssCodeSplit: true,

    // Terser minification with dead-code removal
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn', 'console.info'],
        passes: 2,
      },
      format: {
        comments: false,
      },
      mangle: true,
    },

    // Raise warning threshold — heavy libs like pdfjs are intentionally large
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        // Manual chunk splitting — keeps the initial JS payload tiny
        manualChunks(id) {
          // React core — loaded on every page, cache aggressively
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
            return 'react-vendor'
          }
          // React Router — changes rarely, good cache candidate
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom') || id.includes('node_modules/@remix-run')) {
            return 'router-vendor'
          }
          // React Helmet — small, needed for SEO on every page
          if (id.includes('node_modules/react-helmet-async')) {
            return 'react-vendor'
          }
          // PDF processing — very heavy, only load when user visits a PDF tool
          if (id.includes('node_modules/pdfjs-dist') || id.includes('node_modules/pdf-lib')) {
            return 'pdf-vendor'
          }
          // Image processing libs — lazy-loaded via tool routes
          if (
            id.includes('node_modules/@imgly') ||
            id.includes('node_modules/heic2any') ||
            id.includes('node_modules/jspdf')
          ) {
            return 'image-vendor'
          }
          // 3D / STL libs — only used on specific tool pages
          if (id.includes('node_modules/three') || id.includes('node_modules/opentype')) {
            return 'threed-vendor'
          }
          // Crop / zip utils
          if (
            id.includes('node_modules/react-easy-crop') ||
            id.includes('node_modules/react-image-crop') ||
            id.includes('node_modules/jszip')
          ) {
            return 'utils-vendor'
          }
        },

        // Deterministic hashed filenames for long-term caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split('.').pop()
          if (/^(png|jpe?g|gif|svg|webp|ico|avif)$/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (ext === 'css') {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
