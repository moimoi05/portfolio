import { defineConfig, devices } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 45000,
  retries: 0,
  reporter: 'list',
  use: { baseURL: externalBaseURL || 'http://localhost:5173', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: externalBaseURL ? undefined : { command: 'npm run dev -- --port 5173', url: 'http://localhost:5173', reuseExistingServer: !process.env.CI },
});
