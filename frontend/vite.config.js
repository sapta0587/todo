import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // In Docker, BACKEND_URL=http://backend:3001
        // Locally,  defaults to http://localhost:3001
        '/api': env.BACKEND_URL || 'http://localhost:3001',
      },
    },
  };
});
