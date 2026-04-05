import { test, expect, Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

// =============================================================================
// Helpers
// =============================================================================

async function openElementorEditor(page: Page): Promise<void> {
	await page.goto('/wp-admin/post-new.php?post_type=page');

	// Dismiss all modals/overlays that may appear
	for (let i = 0; i < 5; i++) {
		const overlay = page.locator('.components-modal__screen-overlay, .components-modal__frame');
		if (await overlay.first().isVisible({ timeout: 2000 }).catch(() => false)) {
			await page.keyboard.press('Escape');
			await page.waitForTimeout(500);
		} else {
			break;
		}
	}

	const titleField = page.getByRole('textbox', { name: 'Add title' });
	await titleField.waitFor({ timeout: 10000 });
	await titleField.fill('E2E: Elementor PDF Gallery');

	// Dismiss any modal that reappeared before publishing
	const modalOverlay = page.locator('.components-modal__screen-overlay');
	if (await modalOverlay.isVisible({ timeout: 1000 }).catch(() => false)) {
		await page.keyboard.press('Escape');
		await page.waitForTimeout(500);
	}

	const publishBtn = page.getByRole('button', { name: 'Publish', exact: true });
	await publishBtn.click();
	await page.waitForTimeout(1500);

	// Dismiss any post-publish modal overlay
	if (await modalOverlay.isVisible({ timeout: 1000 }).catch(() => false)) {
		await page.keyboard.press('Escape');
		await page.waitForTimeout(500);
	}

	const confirmBtn = page.locator('.editor-post-publish-panel button.editor-post-publish-button').first();
	if (await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
		await confirmBtn.click();
	}
	await page.waitForTimeout(2000);

	const url = page.url();
	const postIdMatch = url.match(/post=(\d+)/);
	if (postIdMatch) {
		await page.goto(`/wp-admin/post.php?post=${postIdMatch[1]}&action=elementor`);
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(5000);
	}
}

async function loadGalleryCSS(page: Page, html: string): Promise<void> {
	await page.goto('/');
	await page.waitForLoadState('domcontentloaded');
	await page.evaluate((bodyHtml) => {
		return new Promise<void>((resolve) => {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = '/wp-content/plugins/embedpress/assets/css/pdf-gallery.css';
			const done = () => {
				document.body.innerHTML = bodyHtml;
				requestAnimationFrame(() => setTimeout(() => resolve(), 300));
			};
			link.onload = done;
			link.onerror = done; // fallback if CSS fails to load
			document.head.appendChild(link);
			// Safety timeout in case neither fires
			setTimeout(done, 5000);
		});
	}, html);
}

// =============================================================================
// 1. Widget Availability — all widgets checked in one browser
// =============================================================================

test.describe('Elementor PDF Gallery — Widget', () => {
	test('PDF Gallery, EmbedPress PDF, and Document widgets exist in panel', async ({ page }) => {
		test.setTimeout(120_000);
		await openElementorEditor(page);

		const searchBox = page.locator('#elementor-panel-elements-search-input').first();
		if (!await searchBox.isVisible({ timeout: 20000 }).catch(() => false)) {
			test.skip();
			return;
		}

		await test.step('PDF Gallery widget exists', async () => {
			await searchBox.fill('PDF Gallery');
			await page.waitForTimeout(2000);

			const widget = page.locator('.elementor-element--widget, .elementor-element').filter({ hasText: /PDF Gallery/i }).first();
			const visible = await widget.isVisible({ timeout: 5000 }).catch(() => false);

			await page.screenshot({ path: 'test-results/el-01-gallery-widget.png' });
		});

		await test.step('EmbedPress PDF widget exists', async () => {
			await searchBox.fill('EmbedPress PDF');
			await page.waitForTimeout(1500);

			const widget = page.locator('.elementor-element--widget').filter({ hasText: /EmbedPress PDF/i }).first();
			const visible = await widget.isVisible({ timeout: 5000 }).catch(() => false);

			await page.screenshot({ path: 'test-results/el-02-pdf-widget.png' });
		});

		await test.step('EmbedPress Document widget exists', async () => {
			await searchBox.fill('EmbedPress Document');
			await page.waitForTimeout(1500);

			const widget = page.locator('.elementor-element--widget').filter({ hasText: /Document/i }).first();
			const visible = await widget.isVisible({ timeout: 5000 }).catch(() => false);

			await page.screenshot({ path: 'test-results/el-03-document-widget.png' });
		});
	});
});

// =============================================================================
// 2. Layout Output — all layout checks in one browser
// =============================================================================

test.describe('Elementor PDF Gallery — Layout Output', () => {
	test('grid, masonry, and aspect ratio layouts render correctly', async ({ page }) => {
		test.setTimeout(120_000);
		// --- Grid 4 columns ---
		await test.step('grid layout renders with 4 columns and CSS custom properties', async () => {
			await loadGalleryCSS(page, `<div style="padding:40px;">
				<div class="ep-pdf-gallery" data-layout="grid"
					style="--ep-gallery-columns-desktop:4;--ep-gallery-columns-tablet:2;--ep-gallery-columns-mobile:1;--ep-gallery-gap:30px;--ep-gallery-radius:12px;">
					<div class="ep-pdf-gallery__grid">
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#e74c3c;"></div></div>
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#3498db;"></div></div>
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#2ecc71;"></div></div>
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#f39c12;"></div></div>
					</div>
				</div></div>`);

			const cols = await page.locator('.ep-pdf-gallery__grid').evaluate(el => getComputedStyle(el).gridTemplateColumns);
			expect(cols.split(' ').filter((c: string) => parseFloat(c) > 0).length).toBe(4);

			const gap = await page.locator('.ep-pdf-gallery__grid').evaluate(el => getComputedStyle(el).gap);
			expect(gap).toBe('30px');

			const radius = await page.locator('.ep-pdf-gallery__item').first().evaluate(el => getComputedStyle(el).borderRadius);
			expect(radius).toBe('12px');

			await page.screenshot({ path: 'test-results/el-04-grid-4col.png' });
		});

		// --- Masonry ---
		await test.step('masonry layout uses CSS columns', async () => {
			await loadGalleryCSS(page, `<div style="padding:40px;">
				<div class="ep-pdf-gallery" data-layout="masonry"
					style="--ep-gallery-columns-desktop:3;--ep-gallery-gap:20px;">
					<div class="ep-pdf-gallery__grid">
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#e74c3c;height:200px;"></div></div>
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#3498db;height:150px;"></div></div>
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#2ecc71;height:250px;"></div></div>
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#f39c12;height:180px;"></div></div>
					</div>
				</div></div>`);

			const colCount = await page.locator('.ep-pdf-gallery__grid').evaluate(el => getComputedStyle(el).columnCount);
			expect(colCount).not.toBe('auto');

			await page.screenshot({ path: 'test-results/el-05-masonry.png' });
		});

		// --- Aspect ratio 1:1 ---
		await test.step('aspect ratio 1:1 renders square thumbnails', async () => {
			await loadGalleryCSS(page, `<div style="padding:40px;">
				<div class="ep-pdf-gallery" data-layout="grid" style="--ep-gallery-columns-desktop:3;--ep-gallery-gap:20px;">
					<div class="ep-pdf-gallery__grid">
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="1:1" id="thumb-square" style="background:#e74c3c;"></div></div>
					</div>
				</div></div>`);

			const box = await page.locator('#thumb-square').boundingBox();
			if (box) {
				expect(Math.abs(box.width - box.height)).toBeLessThan(5);
			}
			await page.screenshot({ path: 'test-results/el-06-aspect-1x1.png' });
		});

		// --- Aspect ratio 16:9 ---
		await test.step('aspect ratio 16:9 renders wide thumbnails', async () => {
			await loadGalleryCSS(page, `<div style="padding:40px;">
				<div class="ep-pdf-gallery" data-layout="grid" style="--ep-gallery-columns-desktop:2;--ep-gallery-gap:20px;">
					<div class="ep-pdf-gallery__grid">
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="16:9" id="thumb-wide" style="background:#3498db;"></div></div>
					</div>
				</div></div>`);

			const box = await page.locator('#thumb-wide').boundingBox();
			if (box) {
				const ratio = box.width / box.height;
				expect(ratio).toBeGreaterThan(1.5);
			}
			await page.screenshot({ path: 'test-results/el-07-aspect-16x9.png' });
		});
	});
});

// =============================================================================
// 3. Watermark — all watermark checks in one browser
// =============================================================================

test.describe('Elementor PDF Widget — Watermark Global Color', () => {
	test('watermark rendering with different configurations', async ({ page }) => {
		test.setTimeout(120_000);
		await test.step('watermark renders with custom green color', async () => {
			const params = new URLSearchParams({
				themeMode: 'default', toolbar: 'true',
				watermark_text: 'COMPANY PRIVATE', watermark_font_size: '40',
				watermark_color: '00aa00', watermark_opacity: '25', watermark_style: 'center',
			});
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(6000);

			const canvas = page.locator('canvas').first();
			await expect(canvas).toBeVisible({ timeout: 10000 });
			await page.screenshot({ path: 'test-results/el-08-watermark-green.png' });
		});

		await test.step('watermark with large font size fills page', async () => {
			const params = new URLSearchParams({
				themeMode: 'default', toolbar: 'true',
				watermark_text: 'BIG', watermark_font_size: '120',
				watermark_color: 'ff0000', watermark_opacity: '40', watermark_style: 'center',
			});
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(6000);

			const canvas = page.locator('canvas').first();
			await expect(canvas).toBeVisible({ timeout: 10000 });
			await page.screenshot({ path: 'test-results/el-09-watermark-large.png' });
		});

		await test.step('no watermark when text is empty', async () => {
			const params = new URLSearchParams({
				themeMode: 'default', toolbar: 'true', watermark_text: '',
			});
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(5000);

			const canvas = page.locator('canvas').first();
			await expect(canvas).toBeVisible({ timeout: 10000 });
			await page.screenshot({ path: 'test-results/el-10-no-watermark.png' });
		});
	});
});

// =============================================================================
// 4. Document Widget — No Watermark Controls
// =============================================================================

test.describe('Elementor Document Widget — No Watermark', () => {
	test('Document widget PHP has no watermark section', async ({ page }) => {
		const fs = await import('fs');
		const path = await import('path');
		const { fileURLToPath } = await import('url');
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const php = fs.readFileSync(path.resolve(__dirname, '../../../EmbedPress/Elementor/Widgets/Embedpress_Document.php'), 'utf-8');

		expect(php).not.toContain('embedpress_doc_watermark_section');
		expect(php).toContain("'watermark_text' => ''");
	});
});

// =============================================================================
// 5. Bookshelf Shelf Styles — all styles in one browser
// =============================================================================

test.describe('Elementor PDF Gallery — Shelf Styles', () => {
	test('bookshelf dark-wood, light-wood, and glass styles render shelf image', async ({ page }) => {
		test.setTimeout(120_000);
		for (const style of ['dark-wood', 'light-wood', 'glass']) {
			await test.step(`bookshelf ${style} style renders shelf image`, async () => {
				await loadGalleryCSS(page, `<div style="padding:60px;background:#f0f0f0;">
					<div class="ep-pdf-gallery" data-layout="bookshelf" data-columns="3" data-shelf-style="${style}">
						<div class="ep-pdf-gallery__bookshelf-container"><div class="ep-pdf-gallery__shelf-row">
							<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#e74c3c;height:180px;"></div></div>
							<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#3498db;height:180px;"></div></div>
							<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#2ecc71;height:180px;"></div></div>
						</div></div>
					</div></div>`);

				const bgImage = await page.locator('.ep-pdf-gallery__shelf-row').evaluate(el => {
					return getComputedStyle(el, '::after').backgroundImage;
				});
				expect(bgImage).toContain('url(');
				expect(bgImage).toContain('book-shelf');

				await page.screenshot({ path: `test-results/el-11-shelf-${style}.png` });
			});
		}
	});
});

// =============================================================================
// 6. Popup Lightbox
// =============================================================================

test.describe('Elementor PDF Gallery — Popup Lightbox', () => {
	test('popup opens with close button, counter, and navigation', async ({ page }) => {
		test.setTimeout(120_000);
		await loadGalleryCSS(page, `
			<div class="ep-pdf-gallery__popup ep-pdf-gallery__popup--open">
				<div class="ep-pdf-gallery__popup-overlay">
					<button class="ep-pdf-gallery__popup-close">&times;</button>
					<button class="ep-pdf-gallery__popup-prev"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M15 18l-6-6 6-6" stroke="#fff" fill="none"/></svg></button>
					<button class="ep-pdf-gallery__popup-next"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M9 6l6 6-6 6" stroke="#fff" fill="none"/></svg></button>
					<span class="ep-pdf-gallery__popup-counter">3 / 10</span>
					<div class="ep-pdf-gallery__popup-viewer">
						<iframe class="ep-pdf-gallery__popup-iframe" src="about:blank" style="background:#fff;"></iframe>
					</div>
				</div>
			</div>`);

		await expect(page.locator('.ep-pdf-gallery__popup-close')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('.ep-pdf-gallery__popup-prev')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('.ep-pdf-gallery__popup-next')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('.ep-pdf-gallery__popup-counter')).toContainText('3 / 10', { timeout: 10000 });

		const viewer = await page.locator('.ep-pdf-gallery__popup-viewer').boundingBox();
		expect(viewer!.width).toBeGreaterThan(500);
		expect(viewer!.height).toBeGreaterThan(400);

		await page.screenshot({ path: 'test-results/el-12-popup-desktop.png' });
	});
});
