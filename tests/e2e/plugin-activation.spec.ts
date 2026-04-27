import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

test.describe('Plugin Activation', () => {
	test('EmbedPress is active in plugin list', async ({ page }) => {
		await page.goto('/wp-admin/plugins.php');
		const embedpressRow = page.locator('[data-slug="embedpress"]');
		await expect(embedpressRow).toBeVisible();
		await expect(embedpressRow.locator('.deactivate')).toBeVisible();
	});

	test('EmbedPress admin menu exists', async ({ page }) => {
		await page.goto('/wp-admin/');
		const menu = page.locator('#adminmenu a:has-text("EmbedPress")').first();
		await expect(menu).toBeVisible();
	});

	test('EmbedPress settings page loads', async ({ page }) => {
		await page.goto('/wp-admin/admin.php?page=embedpress');
		await expect(page.locator('body')).not.toContainText('Fatal error');
		await expect(page.locator('body')).not.toContainText('Warning:');
	});
});
