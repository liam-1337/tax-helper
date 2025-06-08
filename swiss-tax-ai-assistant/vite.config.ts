// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Add this test configuration
  test: {
    globals: true, // Use global APIs like describe, it, expect
    environment: 'jsdom', // Simulate browser environment
    setupFiles: './src/test/setup.ts', // Optional: for global test setup
    css: true, // If you need to process CSS (e.g. for component styling)
  },
});
