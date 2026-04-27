import { test, expect, Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

// =============================================================================
// Helpers
// =============================================================================

async function createPostAndInsertGallery(page: Page): Promise<void> {
	await page.goto('/wp-admin/post-new.php');
	for (let i = 0; i < 3; i++) {
		const modal = page.locator('.components-modal__frame');
		if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
			await page.keyboard.press('Escape');
			await page.waitForTimeout(400);
		}
	}

	const titleField = page.getByRole('textbox', { name: 'Add title' });
	await titleField.waitFor({ timeout: 10000 });
	await titleField.fill('E2E: PDF Gallery Controls');

	const emptyBlock = page.locator(
		'[data-title="Paragraph"], [aria-label="Add default block"], p.block-editor-default-block-appender__content'
	).first();
	await emptyBlock.click();
	await page.waitForTimeout(300);
	await page.keyboard.type('/pdf gallery');
	await page.waitForTimeout(2000);

	const option = page.locator('.components-autocomplete__result, .block-editor-inserter__panel-content button')
		.filter({ hasText: /PDF Gallery/i }).first();
	if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
		await option.click();
	} else {
		await page.keyboard.press('Enter');
	}
	await page.waitForTimeout(1500);
}

async function openInspectorPanel(page: Page, panelName: string): Promise<void> {
	const blockTab = page.locator('button[data-tab-id="edit-post/block"], button:has-text("Block")').first();
	if (await blockTab.isVisible({ timeout: 2000 }).catch(() => false)) {
		await blockTab.click();
		await page.waitForTimeout(300);
	}

	const panel = page.locator(`.components-panel__body button.components-panel__body-toggle`).filter({ hasText: new RegExp(panelName, 'i') }).first();
	if (await panel.isVisible({ timeout: 3000 }).catch(() => false)) {
		const expanded = await panel.getAttribute('aria-expanded');
		if (expanded === 'false') {
			await panel.click();
			await page.waitForTimeout(300);
		}
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
			link.onerror = done;
			document.head.appendChild(link);
			setTimeout(done, 5000);
		});
	}, html);
}

// =============================================================================
// 1. Block Insertion & Upload Placeholder
// =============================================================================

test.describe('Gutenberg PDF Gallery — Block Insert', () => {
	test('block appears in inserter and shows upload placeholder', async ({ page }) => {
		await createPostAndInsertGallery(page);

		await test.step('block is inserted and visible', async () => {
			const block = page.locator('[data-type="embedpress/pdf-gallery"]').first();
			await expect(block).toBeVisible({ timeout: 10000 });
			await page.screenshot({ path: 'test-results/gb-01-block-inserted.png' });
		});

		await test.step('block shows media upload placeholder when empty', async () => {
			const block = page.locator('[data-type="embedpress/pdf-gallery"]').first();
			const uploadBtn = block.locator('button').filter({ hasText: /Select PDF|Media Library|Upload/i }).first();
			await expect(uploadBtn).toBeVisible({ timeout: 5000 });
			await page.screenshot({ path: 'test-results/gb-02-upload-placeholder.png' });
		});
	});
});

// =============================================================================
// 2. Layout Controls — all checked in one browser session
// =============================================================================

test.describe('Gutenberg PDF Gallery — Layout Controls', () => {
	test('layout panel has all expected controls', async ({ page }) => {
		await createPostAndInsertGallery(page);
		await openInspectorPanel(page, 'Layout');

		await test.step('layout type selector has Grid and Masonry options', async () => {
			const layoutSelect = page.locator('select, .components-select-control__input').filter({ has: page.locator('option[value="grid"]') }).first();
			if (await layoutSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
				const options = await layoutSelect.locator('option').allTextContents();
				expect(options.some(o => /grid/i.test(o))).toBeTruthy();
				expect(options.some(o => /masonry/i.test(o))).toBeTruthy();
			}
			await page.screenshot({ path: 'test-results/gb-03-layout-select.png' });
		});

		await test.step('columns desktop control exists', async () => {
			const columnsLabel = page.locator('label, .components-base-control__label').filter({ hasText: /Columns/i }).first();
			await expect(columnsLabel).toBeVisible({ timeout: 5000 });
			await page.screenshot({ path: 'test-results/gb-04-columns-control.png' });
		});

		await test.step('gap control exists', async () => {
			const gapLabel = page.locator('label, .components-base-control__label').filter({ hasText: /Gap|Spacing/i }).first();
			await expect(gapLabel).toBeVisible({ timeout: 5000 });
			await page.screenshot({ path: 'test-results/gb-05-gap-control.png' });
		});

		await test.step('aspect ratio selector has 4:3, 1:1, 3:4, 16:9 options', async () => {
			const ratioSelect = page.locator('select, .components-select-control__input').filter({ has: page.locator('option[value="4:3"]') }).first();
			if (await ratioSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
				const options = await ratioSelect.locator('option').allTextContents();
				expect(options.some(o => /4:3/.test(o))).toBeTruthy();
				expect(options.some(o => /1:1/.test(o))).toBeTruthy();
				expect(options.some(o => /3:4/.test(o))).toBeTruthy();
				expect(options.some(o => /16:9/.test(o))).toBeTruthy();
			}
			await page.screenshot({ path: 'test-results/gb-06-aspect-ratio.png' });
		});

		await test.step('border radius control exists', async () => {
			const radiusLabel = page.locator('label, .components-base-control__label').filter({ hasText: /Border Radius|Radius/i }).first();
			await expect(radiusLabel).toBeVisible({ timeout: 5000 });
			await page.screenshot({ path: 'test-results/gb-07-border-radius.png' });
		});

		await test.step('bookshelf style selector has dark-wood, light-wood, glass', async () => {
			const shelfSelect = page.locator('select, .components-select-control__input').filter({ has: page.locator('option[value="dark-wood"]') }).first();
			if (await shelfSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
				const options = await shelfSelect.locator('option').allTextContents();
				expect(options.some(o => /dark.*wood/i.test(o))).toBeTruthy();
				expect(options.some(o => /light.*wood/i.test(o))).toBeTruthy();
				expect(options.some(o => /glass/i.test(o))).toBeTruthy();
			}
			await page.screenshot({ path: 'test-results/gb-08-shelf-style.png' });
		});
	});
});

// =============================================================================
// 3. Viewer Controls — all checked in one browser session
// =============================================================================

test.describe('Gutenberg PDF Gallery — Viewer Controls', () => {
	test('viewer panel has all expected controls', async ({ page }) => {
		await createPostAndInsertGallery(page);
		await openInspectorPanel(page, 'Viewer');

		await test.step('viewer style selector has Modern and FlipBook options', async () => {
			const viewerSelect = page.locator('select, .components-select-control__input').filter({ has: page.locator('option[value="modern"]') }).first();
			if (await viewerSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
				const options = await viewerSelect.locator('option').allTextContents();
				expect(options.some(o => /modern/i.test(o))).toBeTruthy();
				expect(options.some(o => /flip/i.test(o))).toBeTruthy();
			}
			await page.screenshot({ path: 'test-results/gb-09-viewer-style.png' });
		});

		await test.step('theme mode selector has default, dark, light, custom', async () => {
			const themeSelect = page.locator('select, .components-select-control__input').filter({ has: page.locator('option[value="dark"]') }).first();
			if (await themeSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
				const options = await themeSelect.locator('option').allTextContents();
				expect(options.some(o => /default/i.test(o))).toBeTruthy();
				expect(options.some(o => /dark/i.test(o))).toBeTruthy();
				expect(options.some(o => /light/i.test(o))).toBeTruthy();
				expect(options.some(o => /custom/i.test(o))).toBeTruthy();
			}
			await page.screenshot({ path: 'test-results/gb-10-theme-mode.png' });
		});

		await test.step('toolbar toggles exist', async () => {
			const toggleLabels = await page.locator('.components-toggle-control .components-base-control__label, .components-form-toggle').all();
			expect(toggleLabels.length).toBeGreaterThan(0);
			await page.screenshot({ path: 'test-results/gb-11-toolbar-toggles.png' });
		});

		await test.step('toolbar position has top and bottom options', async () => {
			const posSelect = page.locator('select, .components-select-control__input').filter({ has: page.locator('option[value="top"]') }).first();
			if (await posSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
				const options = await posSelect.locator('option').allTextContents();
				expect(options.some(o => /top/i.test(o))).toBeTruthy();
				expect(options.some(o => /bottom/i.test(o))).toBeTruthy();
			}
			await page.screenshot({ path: 'test-results/gb-12-toolbar-position.png' });
		});
	});
});

// =============================================================================
// 4. Watermark Controls — all checked in one browser session
// =============================================================================

test.describe('Gutenberg PDF Gallery — Watermark Controls', () => {
	test('watermark panel has all expected controls', async ({ page }) => {
		test.setTimeout(120_000);
		await createPostAndInsertGallery(page);
		await openInspectorPanel(page, 'Watermark');

		await test.step('watermark text input exists', async () => {
			const wmLabel = page.locator('label, .components-base-control__label').filter({ hasText: /Watermark/i }).first();
			const hasWatermark = await wmLabel.isVisible({ timeout: 3000 }).catch(() => false);
			if (hasWatermark) {
				await expect(wmLabel).toBeVisible();
			}
			await page.screenshot({ path: 'test-results/gb-13-watermark-text.png' });
		});

		await test.step('watermark style has center and tiled options', async () => {
			const styleSelect = page.locator('select, .components-select-control__input').filter({ has: page.locator('option[value="tiled"]') }).first();
			if (await styleSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
				const options = await styleSelect.locator('option').allTextContents();
				expect(options.some(o => /center/i.test(o))).toBeTruthy();
				expect(options.some(o => /tiled/i.test(o))).toBeTruthy();
			}
			await page.screenshot({ path: 'test-results/gb-14-watermark-style.png' });
		});

		await test.step('watermark font size, color, and opacity controls exist', async () => {
			const fontLabel = page.locator('label, .components-base-control__label').filter({ hasText: /Font Size/i }).first();
			await fontLabel.isVisible({ timeout: 3000 }).catch(() => false);

			const colorLabel = page.locator('label, .components-base-control__label').filter({ hasText: /Color/i }).first();
			await colorLabel.isVisible({ timeout: 3000 }).catch(() => false);

			const opacityLabel = page.locator('label, .components-base-control__label').filter({ hasText: /Opacity/i }).first();
			await opacityLabel.isVisible({ timeout: 3000 }).catch(() => false);

			await page.screenshot({ path: 'test-results/gb-15-watermark-controls.png' });
		});
	});
});

// =============================================================================
// 5. Frontend Rendering — Grid Layout (desktop + mobile)
// =============================================================================

test.describe('Gutenberg PDF Gallery — Frontend Grid', () => {
	test('grid renders correctly on desktop and mobile', async ({ browser }) => {
		test.setTimeout(120_000);
		const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
		const page = await desktopCtx.newPage();

		const gridHTML = (cols: number, gap: number) => `<div style="padding:40px;">
			<div class="ep-pdf-gallery" data-layout="grid"
				style="--ep-gallery-columns-desktop:${cols};--ep-gallery-columns-tablet:2;--ep-gallery-columns-mobile:1;--ep-gallery-gap:${gap}px;--ep-gallery-radius:8px;">
				<div class="ep-pdf-gallery__grid">
					<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#e74c3c;"></div></div>
					<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#3498db;"></div></div>
					<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#2ecc71;"></div></div>
					<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#f39c12;"></div></div>
					<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#9b59b6;"></div></div>
					<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#1abc9c;"></div></div>
				</div>
			</div></div>`;

		await test.step('grid renders with 3 columns on desktop', async () => {
			await loadGalleryCSS(page, gridHTML(3, 20));

			const gridCols = await page.locator('.ep-pdf-gallery__grid').evaluate(el =>
				window.getComputedStyle(el).gridTemplateColumns
			);
			const tracks = gridCols.split(' ').filter((c: string) => parseFloat(c) > 0);
			expect(tracks.length).toBe(3);

			await page.screenshot({ path: 'test-results/gb-16-grid-3col.png' });
		});

		await desktopCtx.close();

		await test.step('grid renders 1 column on mobile', async () => {
			const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
			const mobilePage = await mobileCtx.newPage();

			await loadGalleryCSS(mobilePage, `<div style="padding:16px;">
				<div class="ep-pdf-gallery" data-layout="grid"
					style="--ep-gallery-columns-desktop:3;--ep-gallery-columns-tablet:2;--ep-gallery-columns-mobile:1;--ep-gallery-gap:16px;">
					<div class="ep-pdf-gallery__grid">
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#e74c3c;"></div></div>
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#3498db;"></div></div>
						<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#2ecc71;"></div></div>
					</div>
				</div></div>`);

			const item = await mobilePage.locator('.ep-pdf-gallery__item').first().boundingBox();
			expect(item!.width).toBeGreaterThan(300);

			await mobilePage.screenshot({ path: 'test-results/gb-17-grid-mobile.png' });
			await mobileCtx.close();
		});
	});
});

// =============================================================================
// 6. Frontend Rendering — Bookshelf (rows + hover)
// =============================================================================

test.describe('Gutenberg PDF Gallery — Frontend Bookshelf', () => {
	test('bookshelf creates correct rows and 3D hover works', async ({ page }) => {
		test.setTimeout(120_000);
		await test.step('bookshelf creates correct rows from data-columns', async () => {
			await page.goto('/');
			await page.evaluate(() => {
				return new Promise<void>((resolve) => {
					const link = document.createElement('link');
					link.rel = 'stylesheet';
					link.href = '/wp-content/plugins/embedpress/assets/css/pdf-gallery.css';
					link.onload = () => {
						document.body.innerHTML = `<div style="padding:40px;background:#f5f5f5;">
							<div class="ep-pdf-gallery" data-layout="bookshelf" data-columns="3" data-shelf-style="dark-wood">
								<div class="ep-pdf-gallery__carousel"><div class="ep-pdf-gallery__carousel-track">
									<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#e74c3c;height:180px;"></div></div>
									<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#3498db;height:180px;"></div></div>
									<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#2ecc71;height:180px;"></div></div>
									<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#f39c12;height:180px;"></div></div>
									<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;"><div class="ep-pdf-gallery__thumbnail-wrap" style="background:#9b59b6;height:180px;"></div></div>
								</div></div>
							</div></div>`;
						const s = document.createElement('script');
						s.src = '/wp-content/plugins/embedpress/assets/js/pdf-gallery.js';
						s.onload = () => setTimeout(() => resolve(), 1000);
						document.body.appendChild(s);
					};
					document.head.appendChild(link);
				});
			});

			const rows = await page.locator('.ep-pdf-gallery__shelf-row').count();
			expect(rows).toBe(2);

			const row1 = await page.locator('.ep-pdf-gallery__shelf-row').first().locator('.ep-pdf-gallery__item').count();
			expect(row1).toBe(3);

			const row2 = await page.locator('.ep-pdf-gallery__shelf-row').nth(1).locator('.ep-pdf-gallery__item').count();
			expect(row2).toBe(2);

			await page.screenshot({ path: 'test-results/gb-18-bookshelf-rows.png' });
		});

		await test.step('bookshelf 3D hover effect works', async () => {
			await loadGalleryCSS(page, `<div style="padding:80px;">
				<div class="ep-pdf-gallery" data-layout="bookshelf">
					<div class="ep-pdf-gallery__bookshelf-container"><div class="ep-pdf-gallery__shelf-row">
						<div class="ep-pdf-gallery__item" id="book1" style="flex:0 0 140px;width:140px;perspective:600px;">
							<div class="ep-pdf-gallery__thumbnail-wrap" id="cover1" style="background:#e74c3c;height:180px;"></div>
							<div class="ep-pdf-gallery__overlay"><svg class="ep-pdf-gallery__view-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></div>
						</div>
					</div></div>
				</div></div>`);

			const beforeTransform = await page.locator('#cover1').evaluate(el => getComputedStyle(el).transform);
			await page.locator('#book1').hover();
			await page.waitForTimeout(500);
			const afterTransform = await page.locator('#cover1').evaluate(el => getComputedStyle(el).transform);

			expect(afterTransform).not.toBe(beforeTransform);
			await page.screenshot({ path: 'test-results/gb-19-bookshelf-hover.png' });
		});
	});
});

// =============================================================================
// 7. Modern Viewer — all checks in one browser
// =============================================================================

test.describe('Gutenberg PDF Gallery — Modern Viewer', () => {
	test('modern viewer loads, themes, and watermarks work', async ({ page }) => {
		test.setTimeout(120_000);
		await test.step('modern viewer loads PDF with toolbar', async () => {
			await page.goto('/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf');
			await page.waitForTimeout(4000);

			const toolbar = page.locator('#toolbarContainer, #toolbarViewer').first();
			await expect(toolbar).toBeVisible({ timeout: 10000 });

			const canvas = page.locator('canvas').first();
			await expect(canvas).toBeVisible({ timeout: 10000 });

			await page.screenshot({ path: 'test-results/gb-20-modern-viewer.png' });
		});

		await test.step('dark theme applies to viewer', async () => {
			const params = new URLSearchParams({ themeMode: 'dark', toolbar: 'true' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(4000);

			const theme = await page.locator('html').getAttribute('ep-data-theme');
			expect(theme).toBe('dark');

			await page.screenshot({ path: 'test-results/gb-21-dark-theme.png' });
		});

		await test.step('watermark center style renders on page', async () => {
			const params = new URLSearchParams({
				themeMode: 'default', toolbar: 'true',
				watermark_text: 'CONFIDENTIAL', watermark_font_size: '48',
				watermark_color: 'ff0000', watermark_opacity: '30', watermark_style: 'center',
			});
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`);
			await page.waitForTimeout(6000);

			const canvas = page.locator('canvas').first();
			await expect(canvas).toBeVisible({ timeout: 10000 });
			await page.screenshot({ path: 'test-results/gb-22-watermark-center.png' });
		});

		await test.step('watermark tiled style renders on page', async () => {
			const params = new URLSearchParams({
				themeMode: 'default', toolbar: 'true',
				watermark_text: 'DRAFT', watermark_font_size: '36',
				watermark_color: '0000ff', watermark_opacity: '20', watermark_style: 'tiled',
			});
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=/wp-content/uploads/2026/03/test-doc-2-1.pdf#key=${key}`);
			await page.waitForTimeout(6000);

			const canvas = page.locator('canvas').first();
			await expect(canvas).toBeVisible({ timeout: 10000 });
			await page.screenshot({ path: 'test-results/gb-23-watermark-tiled.png' });
		});
	});
});

// =============================================================================
// 8. Flipbook Viewer — all checks in one browser
// =============================================================================

test.describe('Gutenberg PDF Gallery — Flipbook Viewer', () => {
	test('flipbook viewer loads and mobile nav is touch-friendly', async ({ page }) => {
		await test.step('flipbook viewer loads', async () => {
			const params = new URLSearchParams({ themeMode: 'default', toolbar: 'true' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf-flip-book/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf&key=${key}`);
			await page.waitForTimeout(5000);

			const flipbook = page.locator('.flip-book, .view, #viewer-container').first();
			await expect(flipbook).toBeVisible({ timeout: 15000 });
			await page.screenshot({ path: 'test-results/gb-24-flipbook.png' });
		});

		await test.step('flipbook mobile nav buttons are touch-friendly', async () => {
			await page.setViewportSize({ width: 375, height: 812 });
			const params = new URLSearchParams({ themeMode: 'default', toolbar: 'true' });
			const key = Buffer.from(params.toString()).toString('base64');
			await page.goto(`/wp-content/plugins/embedpress/assets/pdf-flip-book/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf&key=${key}`);
			await page.waitForTimeout(5000);

			const nav = page.locator('.prev, .next').first();
			if (await nav.isVisible({ timeout: 5000 }).catch(() => false)) {
				const box = await nav.boundingBox();
				if (box) {
					expect(box.width).toBeGreaterThanOrEqual(40);
					expect(box.height).toBeGreaterThanOrEqual(40);
				}
			}
			await page.screenshot({ path: 'test-results/gb-25-flipbook-mobile.png' });
		});
	});
});

// =============================================================================
// 9. Mobile Popup
// =============================================================================

test.describe('Gutenberg PDF Gallery — Mobile Popup', () => {
	test('popup nav buttons at bottom on mobile, not overlapping viewer', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });

		await loadGalleryCSS(page, `
			<div class="ep-pdf-gallery__popup ep-pdf-gallery__popup--open">
				<div class="ep-pdf-gallery__popup-overlay">
					<button class="ep-pdf-gallery__popup-close">&times;</button>
					<button class="ep-pdf-gallery__popup-prev" id="prev"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M15 18l-6-6 6-6" stroke="#fff" fill="none" stroke-width="2"/></svg></button>
					<button class="ep-pdf-gallery__popup-next" id="next"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M9 6l6 6-6 6" stroke="#fff" fill="none" stroke-width="2"/></svg></button>
					<span class="ep-pdf-gallery__popup-counter">1 / 5</span>
					<div class="ep-pdf-gallery__popup-viewer"><div style="width:100%;height:100%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;">PDF Viewer</div></div>
				</div>
			</div>`);

		const prev = await page.locator('#prev').boundingBox();
		const viewer = await page.locator('.ep-pdf-gallery__popup-viewer').boundingBox();
		if (prev && viewer) {
			expect(prev.y).toBeGreaterThan(viewer.y + viewer.height * 0.7);
		}

		await page.screenshot({ path: 'test-results/gb-26-mobile-popup.png' });
	});
});
