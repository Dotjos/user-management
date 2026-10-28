/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/apiHandler';

// Vite plugin to provide backend API routes directly in dev and test
function backendApiPlugin() {
  return {
    name: 'backend-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api')) {
          const handled = await handleApiRequest(req, res);
          if (handled) return;
        }
        next();
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api')) {
          const handled = await handleApiRequest(req, res);
          if (handled) return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), backendApiPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  server: {
    port: 5173,
    host: true
  }
});
