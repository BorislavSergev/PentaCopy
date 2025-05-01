import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'stripe-vendor': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    cors: true,
  },
})
