import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths(),
    // '@locator/babel-jsx/dist', // Remove if not necessary
    {
      env: 'development'
    }
  ],
  base: process.env.VITE_APP_BASE_NAME || '/', // Ensure base is set correctly
  define: {
    global: 'window'
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1')
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1')
      }
    ]
  },
  server: {
    open: true,
    port: 3000
  },
  preview: {
    open: true,
    port: 3000
  },
  build: {
    outDir: 'dist', // Explicitly set the output directory to 'dist'
    assetsDir: 'assets', // Optional: Set the folder for static assets like images, fonts, etc.
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html') // Ensure the correct entry point is used
    },
  }
});
