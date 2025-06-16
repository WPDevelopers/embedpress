import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/Shared/components'),
      '@hooks': path.resolve(__dirname, './src/Shared/hooks'),
      '@utils': path.resolve(__dirname, './src/Shared/utils'),
      '@stores': path.resolve(__dirname, './src/Shared/stores'),
      '@services': path.resolve(__dirname, './src/Shared/services'),
      '@types': path.resolve(__dirname, './src/Shared/types'),
    },
  },
});
