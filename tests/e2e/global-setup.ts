import { test as setup, expect } from '@playwright/test';

const WP_ADMIN_USER = process.env.WP_ADMIN_USER || 'admin';
const WP_ADMIN_PASS = process.env.WP_ADMIN_PASS || 'admin';

/**
 * Global setup: login to WordPress and save auth state.
 * All other tests reuse this session.
 */
setup('authenticate', async ({ page }) => {
	await page.goto('/wp-login.php');
	await page.fill('#user_login', WP_ADMIN_USER);
	await page.fill('#user_pass', WP_ADMIN_PASS);
	await page.click('#wp-submit');
	await expect(page).toHaveURL(/wp-admin/);

	// Save auth state
	await page.context().storageState({ path: 'tests/e2e/.auth/wp-session.json' });
});
