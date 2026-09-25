import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createDevChatMiddleware } from './api/devChatMiddleware';

function portfolioAssistantDevApi(): Plugin {
  return {
    name: 'portfolio-assistant-dev-api',
    configureServer(server) {
      server.middlewares.use(createDevChatMiddleware());
    },
  };
}

export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, process.cwd(), '');
  for (const name of ['GEMINI_API_KEY', 'GEMINI_MODEL'] as const) {
    if (serverEnv[name]) process.env[name] = serverEnv[name];
  }

  return {
    plugins: [react(), portfolioAssistantDevApi()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/__tests__/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/__tests__/**', 'src/main.tsx', 'src/data/**'],
        thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
      },
    },
  };
});
