import { test, expect } from '@playwright/test';
import { createPost, insertShortcode, publishPost, viewPost, expectIframeEmbed, expectEmbedWrapper } from './helpers/wp';

test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

test.describe('Google Embeds', () => {
	test('embeds a Google Docs document', async ({ page }) => {
		const url = 'https://docs.google.com/document/d/e/2PACX-1vQMgC7bAI7UBHTjJhK3W6Ex5yBfEbPCJ-z6PK80LPQjGDGXE1JK8n8sNi3V-MRoMCFmj3hCnZZG-8D/pub';

		await createPost(page, 'E2E: Google Docs');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'docs.google.com');
		}
	});

	test('embeds a Google Maps location', async ({ page }) => {
		const url = 'https://www.google.com/maps/place/San+Francisco,+CA/';

		await createPost(page, 'E2E: Google Maps');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'google.com/maps');
		}
	});

	test('embeds a Google Sheets spreadsheet', async ({ page }) => {
		const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTEn7U3xNr7jGEalYuVkqVRtNMM3-2bsULsOnKDC-cH9ARdbQK9pL6MwOlrEy3tCgfoRQHESKbn1aXl/pubhtml';

		await createPost(page, 'E2E: Google Sheets');
		await insertShortcode(page, url);
		const postUrl = await publishPost(page);

		if (postUrl) {
			await viewPost(page, postUrl);
			await expectIframeEmbed(page, 'docs.google.com');
		}
	});
});
