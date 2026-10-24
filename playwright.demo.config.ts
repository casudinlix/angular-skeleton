import { defineConfig, devices } from '@playwright/test';

/** Local integration only: the demo server supplies the API, not route mocks. */
export default defineConfig({
  testDir: './e2e-demo',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'bun run demo',
    url: 'http://127.0.0.1:4200/login',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
