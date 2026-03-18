import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 60_000,
	retries: 1,
	workers: 1, // sequential — shared WordPress state
	reporter: [['list'], ['html', { open: 'never' }]],

	use: {
		baseURL: process.env.WP_BASE_URL || 'http://localhost:8080',
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
		headless: true,
	},

	projects: [
		{
			name: 'setup',
			testMatch: /global-setup\.ts/,
		},
		{
			name: 'e2e',
			dependencies: ['setup'],
			testMatch: /.*\.spec\.ts/,
		},
	],
});
