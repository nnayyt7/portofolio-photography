import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/three/')) return 'webgl';
          if (/\/(gsap|@gsap|lenis)\//.test(id)) return 'motion';
        },
      },
    },
  },
});
