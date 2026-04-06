import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@/applications': path.resolve(__dirname, './src/applications'),
      '@/commons': path.resolve(__dirname, './src/commons'),
      '@/domains': path.resolve(__dirname, './src/domains'),
      '@/infrastructures': path.resolve(__dirname, './src/infrastructures'),
      '@/interfaces': path.resolve(__dirname, './src/interfaces'),
      '@/tests': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    globals: true,
    fileParallelism: false,
    setupFiles: ['dotenv/config'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
    include: ['**/*.test.ts', '**/*.spec.ts'],
  },
});
