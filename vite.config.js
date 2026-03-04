import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    // Don't override minify or target — let Vite use safe defaults
    // (esbuild crashes on @imgly/background-removal ONNX/WebGPU generated code
    //  when target is forced to es2018)

    rollupOptions: {
      output: {
        // Split React core, Router and Helmet into dedicated cacheable chunks.
        // Heavy tools (pdfjs, three, @imgly) auto-split via lazy() in App.jsx.
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-helmet': ['react-helmet-async'],
        },
      },
    },
  },

  optimizeDeps: {
    exclude: ['pdfjs-dist', '@imgly/background-removal'],
  },
})
