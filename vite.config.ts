import { defineConfig } from 'vite';

export default defineConfig({
  base: '/CardVille/',
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1800
  }
});
