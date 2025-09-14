import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@xion-global/dave-mobile-toolkit', '@xion-global/zktls-sdk']
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
