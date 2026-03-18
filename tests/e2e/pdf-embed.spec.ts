import { test, expect } from '@playwright/test';
import { createPost, insertShortcode, publishPost, viewPost } from './helpers/wp';

test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

test.describe('PDF Embed', () => {
	test('embeds a PDF file', async ({ page }) => {
		const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

		await createPost(page, 'E2E: PDF Embed');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);

			// PDF embeds render as iframe or object
			const pdfEmbed = page.locator('iframe[src*=".pdf"], iframe[src*="viewer"], object[data*=".pdf"], .embedpress-pdf-wrapper').first();
			await expect(pdfEmbed).toBeVisible({ timeout: 15000 });
		}
	});
});
