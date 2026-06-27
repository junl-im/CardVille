import { defineConfig } from 'vite';

export default defineConfig({
  base: '/CardVille/',
  server: {
    port: 5173,
    host: '0.0.0.0'
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
