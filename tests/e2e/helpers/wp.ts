import { Page, expect } from '@playwright/test';

/**
 * Create a new WordPress post with Gutenberg editor.
 */
export async function createPost(page: Page, title: string): Promise<void> {
	await page.goto('/wp-admin/post-new.php');

	// Dismiss welcome dialog if present
	const welcomeModal = page.locator('.components-modal__frame');
	if (await welcomeModal.isVisible({ timeout: 3000 }).catch(() => false)) {
		await page.keyboard.press('Escape');
		await page.waitForTimeout(500);
	}

	// Type title
	const titleField = page.getByRole('textbox', { name: 'Add title' });
	await titleField.waitFor({ timeout: 10000 });
	await titleField.fill(title);
}

/**
 * Insert a shortcode block with the given content.
 * Uses the slash command inserter which is more reliable than the toolbar.
 */
export async function insertShortcode(page: Page, url: string): Promise<void> {
	// Click on the empty paragraph block area
	const emptyBlock = page.locator('[data-title="Paragraph"], [aria-label="Add default block"], p.block-editor-default-block-appender__content').first();
	await emptyBlock.click();
	await page.waitForTimeout(300);

	// Type slash command to insert shortcode block
	await page.keyboard.type('/shortcode');
	await page.waitForTimeout(1000);

	// Click the shortcode option from the autocomplete
	const shortcodeOption = page.locator('.components-autocomplete__result, .block-editor-inserter__panel-content button').filter({ hasText: /Shortcode/i }).first();
	if (await shortcodeOption.isVisible({ timeout: 3000 }).catch(() => false)) {
		await shortcodeOption.click();
	} else {
		// Fallback: press Enter to select first result
		await page.keyboard.press('Enter');
	}

	await page.waitForTimeout(500);

	// Type the shortcode content into the textarea
	const shortcodeInput = page.locator('textarea.blocks-shortcode__textarea, .wp-block-shortcode textarea').first();
	await shortcodeInput.waitFor({ timeout: 5000 });
	await shortcodeInput.fill(`[embedpress]${url}[/embedpress]`);
}

/**
 * Insert an EmbedPress block via slash command.
 */
export async function insertEmbedPressBlock(page: Page, url: string): Promise<void> {
	const emptyBlock = page.locator('[data-title="Paragraph"], [aria-label="Add default block"], p.block-editor-default-block-appender__content').first();
	await emptyBlock.click();
	await page.waitForTimeout(300);

	await page.keyboard.type('/embedpress');
	await page.waitForTimeout(1000);

	const epOption = page.locator('.components-autocomplete__result, .block-editor-inserter__panel-content button').filter({ hasText: /EmbedPress/i }).first();
	if (await epOption.isVisible({ timeout: 3000 }).catch(() => false)) {
		await epOption.click();
	} else {
		await page.keyboard.press('Enter');
	}

	await page.waitForTimeout(1000);

	// Find and fill the URL input
	const urlInput = page.locator('.embedpress-block-wrapper input, .components-placeholder input[type="text"]').first();
	await urlInput.waitFor({ timeout: 10000 });
	await urlInput.fill(url);
	await page.keyboard.press('Enter');
}

/**
 * Publish the current post and return its URL.
 */
export async function publishPost(page: Page): Promise<string> {
	// Click "Publish" button in the top bar
	const publishBtn = page.getByRole('button', { name: 'Publish', exact: true });
	await publishBtn.waitFor({ timeout: 5000 });
	await publishBtn.click();

	// Wait for the publish panel to appear and click confirm
	await page.waitForTimeout(1000);

	// Look for the second Publish button in the panel
	const confirmBtn = page.locator('.editor-post-publish-panel__header-publish-button button, .editor-post-publish-panel button.editor-post-publish-button').first();
	if (await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
		await confirmBtn.click();
	}

	// Wait for published state
	await page.waitForTimeout(3000);

	// Try to get the post URL from the publish panel
	const viewLink = page.locator('.post-publish-panel__postpublish-buttons a, a:has-text("View Post")').first();
	if (await viewLink.isVisible({ timeout: 5000 }).catch(() => false)) {
		return (await viewLink.getAttribute('href')) || '';
	}

	// Fallback: get permalink from the slug
	const currentUrl = page.url();
	const postIdMatch = currentUrl.match(/post=(\d+)/);
	if (postIdMatch) {
		return `/wp-admin/post.php?post=${postIdMatch[1]}&action=edit`;
	}

	return '';
}

/**
 * Visit a published post on the frontend.
 */
export async function viewPost(page: Page, postUrl: string): Promise<void> {
	// If we got an edit URL, extract the view URL
	if (postUrl.includes('action=edit')) {
		await page.goto(postUrl);
		const viewLink = page.locator('#sample-permalink a, .edit-post-header a[href*="/?p="]').first();
		if (await viewLink.isVisible({ timeout: 3000 }).catch(() => false)) {
			const href = await viewLink.getAttribute('href');
			if (href) {
				await page.goto(href);
				return;
			}
		}
	}

	await page.goto(postUrl);
	await page.waitForLoadState('domcontentloaded');
}

/**
 * Check that an iframe embed is rendered on the page.
 */
export async function expectIframeEmbed(page: Page, urlPattern: string): Promise<void> {
	const iframe = page.locator(`iframe`).filter({ has: page.locator(`[src*="${urlPattern}"]`) }).first();
	// Also check iframes where src contains the pattern
	const iframeBySrc = page.locator(`iframe[src*="${urlPattern}"]`).first();

	const found = await Promise.race([
		iframe.isVisible({ timeout: 15000 }).catch(() => false),
		iframeBySrc.isVisible({ timeout: 15000 }).catch(() => false),
	]);

	// If no specific iframe, check for any embedpress wrapper with iframe
	if (!found) {
		const anyEmbed = page.locator('.embedpress-wrapper iframe, .ose-embedpress-responsive iframe, .ep-embed-content-wraper iframe').first();
		await expect(anyEmbed).toBeVisible({ timeout: 10000 });
	}
}

/**
 * Check that an embedpress wrapper exists on the page.
 */
export async function expectEmbedWrapper(page: Page): Promise<void> {
	const wrapper = page.locator('.embedpress-wrapper, .ose-embedpress-responsive, .ep-embed-content-wraper, .wp-block-embed').first();
	await expect(wrapper).toBeVisible({ timeout: 15000 });
}
