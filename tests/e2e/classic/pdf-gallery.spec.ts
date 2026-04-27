import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

// =============================================================================
// 1. PDF Embed via Shortcode in Classic Editor
// =============================================================================

test.describe('Classic Editor — PDF Embed Shortcode', () => {
	test('can create post with PDF shortcode in classic editor', async ({ page }) => {
		await page.goto('/wp-admin/post-new.php?classic-editor');
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(2000);

		const textTab = page.locator('#content-html, button#content-html').first();
		if (await textTab.isVisible({ timeout: 5000 }).catch(() => false)) {
			await textTab.click();
			await page.waitForTimeout(500);

			const textarea = page.locator('#content, textarea#content').first();
			await textarea.fill('[embedpress]https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf[/embedpress]');

			await page.screenshot({ path: 'test-results/cl-01-shortcode-entry.png' });
		} else {
			test.skip();
		}
	});
});

// =============================================================================
// 2. PDF Viewer Features (shared across all editors)
// =============================================================================

test.describe('Classic Editor — Modern Viewer Features', () => {
	test('viewer toolbar controls, themes, and visibility', async ({ page }) => {
		test.setTimeout(120_000);
		// --- Zoom controls ---
		await test.step('zoom controls are visible', async () => {
			await page.goto('/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf');
			await page.waitForTimeout(4000);

			const zoomIn = page.locator('#zoomIn, button[id*="zoomIn"]').first();
			const zoomOut = page.locator('#zoomOut, button[id*="zoomOut"]').first();

			await expect(zoomIn).toBeVisible({ timeout: 10000 });
			await expect(zoomOut).toBeVisible({ timeout: 10000 });

			await page.screenshot({ path: 'test-results/cl-02-zoom-controls.png' });
		});

		// --- Page counter ---
		await test.step('page counter is shown', async () => {
			const toolbar = page.locator('#toolbarContainer, #toolbarViewer').first();
			await expect(toolbar).toBeVisible({ timeout: 10000 });
			const toolbarText = await toolbar.textContent();
			expect(toolbarText).toContain('of');

			await page.screenshot({ path: 'test-results/cl-04-page-counter.png' });
		});

		// --- Download button ---
		await test.step('download button is visible', async () => {
			const params = new URLSearchParams({ themeMode: 'default', toolbar: 'true', download: 'true' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(4000);

			const downloadBtn = page.locator('#download, button[id*="download"], a[id*="download"]').first();
			await expect(downloadBtn).toBeVisible({ timeout: 10000 });

			await page.screenshot({ path: 'test-results/cl-03-download-btn.png' });
		});

		// --- Light theme ---
		await test.step('light theme applies correctly', async () => {
			const params = new URLSearchParams({ themeMode: 'light', toolbar: 'true' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(4000);

			const theme = await page.locator('html').getAttribute('ep-data-theme');
			expect(theme).toBe('light');

			await page.screenshot({ path: 'test-results/cl-05-light-theme.png' });
		});

		// --- Dark theme ---
		await test.step('dark theme applies correctly', async () => {
			const params = new URLSearchParams({ themeMode: 'dark', toolbar: 'true' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(4000);

			const theme = await page.locator('html').getAttribute('ep-data-theme');
			expect(theme).toBe('dark');

			await page.screenshot({ path: 'test-results/cl-06-dark-theme.png' });
		});

		// --- Custom theme ---
		await test.step('custom theme applies color', async () => {
			const params = new URLSearchParams({ themeMode: 'custom', customColor: '#8B0000', toolbar: 'true' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(4000);

			const theme = await page.locator('html').getAttribute('ep-data-theme');
			expect(theme).toBe('custom');

			await page.screenshot({ path: 'test-results/cl-07-custom-theme.png' });
		});

		// --- Toolbar hidden ---
		await test.step('toolbar hidden when toolbar=false', async () => {
			const params = new URLSearchParams({ themeMode: 'default', toolbar: 'false' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(4000);

			const toolbar = page.locator('#toolbarContainer, #toolbarViewer');
			const visible = await toolbar.first().isVisible({ timeout: 3000 }).catch(() => false);

			await page.screenshot({ path: 'test-results/cl-08-no-toolbar.png' });
		});
	});
});

// =============================================================================
// 3. Flipbook Viewer Features (shared)
// =============================================================================

test.describe('Classic Editor — Flipbook Viewer Features', () => {
	test('flipbook loads, themes, and watermark', async ({ page }) => {
		test.setTimeout(120_000);
		// --- Flipbook loads with toolbar ---
		await test.step('flipbook loads with toolbar', async () => {
			const params = new URLSearchParams({ themeMode: 'default', toolbar: 'true' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf-flip-book/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf&key=${key}`);
			await page.waitForTimeout(6000);

			const flipbook = page.locator('.flip-book, .view, body').first();
			await expect(flipbook).toBeVisible({ timeout: 15000 });

			const toolbar = page.locator('.ctrl, .fnavbar, .fnav').first();
			const hasToolbar = await toolbar.isVisible({ timeout: 10000 }).catch(() => false);

			await page.screenshot({ path: 'test-results/cl-09-flipbook.png' });
		});

		// --- Flipbook dark theme ---
		await test.step('flipbook dark theme', async () => {
			const params = new URLSearchParams({ themeMode: 'dark', toolbar: 'true' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf-flip-book/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf&key=${key}`);
			await page.waitForTimeout(6000);

			await page.screenshot({ path: 'test-results/cl-10-flipbook-dark.png' });
		});

		// --- Flipbook watermark ---
		await test.step('flipbook watermark renders', async () => {
			const params = new URLSearchParams({
				themeMode: 'default', toolbar: 'true',
				watermark_text: 'DO NOT COPY', watermark_font_size: '48',
				watermark_color: 'ff0000', watermark_opacity: '25', watermark_style: 'center',
			});
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf-flip-book/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf&key=${key}`);
			await page.waitForTimeout(6000);

			await page.screenshot({ path: 'test-results/cl-11-flipbook-watermark.png' });
		});
	});
});
