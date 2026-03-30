import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 3 : 1,
	workers: isCI ? 4 : 4,
	timeout: 60_000,
	reporter: [
		['html', { outputFolder: 'playwright-report', open: 'never' }],
		['json', { outputFile: 'playwright-report/result.json' }],
		isCI ? ['dot'] : ['list'],
	],
	outputDir: 'test-results',

	use: {
		baseURL: process.env.E2E_BASE_URL || process.env.WP_BASE_URL || 'http://localhost:8080',
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
		headless: true,
	},

	projects: [
		// Auth setup (JS — tester's suite)
		{
			name: 'setup',
			testMatch: /auth\.setup\.js/,
		},
		// Auth setup (TS — original suite)
		{
			name: 'setup-ts',
			testMatch: /global-setup\.ts/,
		},
		// Classic Editor tests
		{
			name: 'classic',
			testDir: './tests/e2e/classic',
			use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
			dependencies: ['setup'],
		},
		// Gutenberg tests
		{
			name: 'gutenberg',
			testDir: './tests/e2e/gutenberg',
			use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
			dependencies: ['setup'],
		},
		// Elementor tests
		{
			name: 'elementor',
			testDir: './tests/e2e/elementor',
			use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
			dependencies: ['setup'],
		},
		// Dashboard tests
		{
			name: 'dashboard',
			testDir: './tests/e2e/dashboard',
			use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
			dependencies: ['setup'],
		},
		// Original TS e2e tests (local Docker)
		{
			name: 'e2e',
			testMatch: /.*\.spec\.ts/,
			use: { storageState: 'tests/e2e/.auth/wp-session.json' },
			dependencies: ['setup-ts'],
		},
	],
});
