import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  globalSetup: require.resolve('./global-setup'),
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  reporter: [['html', { open: 'never' }]],
});
