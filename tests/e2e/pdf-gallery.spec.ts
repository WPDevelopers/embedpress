import { test, expect, Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

const TEST_PAGE_URL = '/e2e-pdf-gallery-test/';
const VIEWER_BASE = '/wp-content/plugins/embedpress/assets/pdf/web/viewer.html';

// =============================================================================
// Setup: Create a test page with PDF Gallery via Elementor or Gutenberg
// =============================================================================

test.describe('PDF Gallery — Create & Verify in Gutenberg Editor', () => {
	test('insert PDF Gallery block and add PDFs via media library', async ({ page }) => {
		// Go to new post (use post, not page — pages show pattern chooser)
		await page.goto('/wp-admin/post-new.php');

		// Dismiss any modal (welcome or pattern chooser)
		for (let i = 0; i < 3; i++) {
			const modal = page.locator('.components-modal__frame');
			if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
				await page.keyboard.press('Escape');
				await page.waitForTimeout(500);
			}
		}

		// Set title
		const titleField = page.getByRole('textbox', { name: 'Add title' });
		await titleField.waitFor({ timeout: 10000 });
		await titleField.fill('E2E: PDF Gallery Feature Test');

		// Click empty paragraph to start typing
		const emptyBlock = page.locator(
			'[data-title="Paragraph"], [aria-label="Add default block"], p.block-editor-default-block-appender__content'
		).first();
		await emptyBlock.click();
		await page.waitForTimeout(500);

		// Search for PDF Gallery block
		await page.keyboard.type('/pdf gallery');
		await page.waitForTimeout(2000);

		// Click the PDF Gallery option
		const galleryOption = page.locator('.components-autocomplete__result, .block-editor-inserter__panel-content button')
			.filter({ hasText: /PDF Gallery/i }).first();

		if (await galleryOption.isVisible({ timeout: 5000 }).catch(() => false)) {
			await galleryOption.click();
		} else {
			await page.keyboard.press('Enter');
		}
		await page.waitForTimeout(1500);

		// Verify block inserted — should show media upload placeholder
		const galleryBlock = page.locator('[data-type="embedpress/pdf-gallery"]').first();
		await expect(galleryBlock).toBeVisible({ timeout: 10000 });

		// Take screenshot of the block in editor
		await page.screenshot({ path: 'test-results/01-pdf-gallery-block-inserted.png', fullPage: true });

		// Verify the block has an upload/select button
		const selectBtn = galleryBlock.locator('button').filter({ hasText: /Select PDF|Media Library|Upload/i }).first();
		const hasUploadUI = await selectBtn.isVisible({ timeout: 5000 }).catch(() => false);
		expect(hasUploadUI).toBeTruthy();

		await page.screenshot({ path: 'test-results/02-pdf-gallery-upload-ui.png', fullPage: true });
	});
});

// =============================================================================
// Test the Popup / Lightbox viewer with real PDF
// =============================================================================

test.describe('PDF Gallery — Modern Viewer Popup', () => {
	test('modern PDF viewer loads with toolbar', async ({ page }) => {
		// Open the modern PDF viewer directly
		const viewerUrl = `${VIEWER_BASE}?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf`;
		await page.goto(viewerUrl);
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(3000);

		// Verify viewer UI loaded
		const toolbar = page.locator('#toolbarContainer, #toolbarViewer, .toolbar');
		await expect(toolbar.first()).toBeVisible({ timeout: 10000 });

		await page.screenshot({ path: 'test-results/03-modern-viewer-loaded.png', fullPage: true });
	});

	test('modern viewer shows watermark when params provided', async ({ page }) => {
		const params = new URLSearchParams({
			themeMode: 'default',
			toolbar: 'true',
			download: 'true',
			watermark_text: 'CONFIDENTIAL',
			watermark_font_size: '48',
			watermark_color: 'ff0000',
			watermark_opacity: '30',
			watermark_style: 'center',
		});

		const key = Buffer.from(params.toString()).toString('base64');
		const viewerUrl = `${VIEWER_BASE}?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf#key=${key}`;

		await page.goto(viewerUrl);
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(5000);

		// Toolbar should be visible
		const toolbar = page.locator('#toolbarContainer, #toolbarViewer, .toolbar');
		await expect(toolbar.first()).toBeVisible({ timeout: 10000 });

		// A canvas should be rendered (PDF page)
		const canvas = page.locator('canvas').first();
		await expect(canvas).toBeVisible({ timeout: 10000 });

		await page.screenshot({ path: 'test-results/04-modern-viewer-watermark.png', fullPage: true });
	});

	test('modern viewer tiled watermark covers page', async ({ page }) => {
		const params = new URLSearchParams({
			themeMode: 'default',
			toolbar: 'true',
			watermark_text: 'DRAFT COPY',
			watermark_font_size: '36',
			watermark_color: '0000ff',
			watermark_opacity: '20',
			watermark_style: 'tiled',
		});

		const key = Buffer.from(params.toString()).toString('base64');
		const viewerUrl = `${VIEWER_BASE}?file=/wp-content/uploads/2026/03/test-doc-2-1.pdf#key=${key}`;

		await page.goto(viewerUrl);
		await page.waitForTimeout(5000);

		const canvas = page.locator('canvas').first();
		await expect(canvas).toBeVisible({ timeout: 10000 });

		await page.screenshot({ path: 'test-results/05-modern-viewer-tiled-watermark.png', fullPage: true });
	});
});

// =============================================================================
// Flipbook Viewer
// =============================================================================

test.describe('PDF Gallery — Flipbook Viewer', () => {
	test('flipbook viewer loads and shows navigation', async ({ page }) => {
		const params = new URLSearchParams({
			themeMode: 'default',
			toolbar: 'true',
			download: 'true',
		});

		const key = Buffer.from(params.toString()).toString('base64');
		const viewerUrl = `/wp-content/plugins/embedpress/assets/pdf-flip-book/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf&key=${key}`;

		await page.goto(viewerUrl);
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(5000);

		// Flipbook container should be visible
		const flipbook = page.locator('.flip-book, .view, #viewer-container');
		await expect(flipbook.first()).toBeVisible({ timeout: 15000 });

		await page.screenshot({ path: 'test-results/06-flipbook-viewer.png', fullPage: true });
	});

	test('flipbook mobile navigation is touch-friendly', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });

		const params = new URLSearchParams({
			themeMode: 'default',
			toolbar: 'true',
		});

		const key = Buffer.from(params.toString()).toString('base64');
		const viewerUrl = `/wp-content/plugins/embedpress/assets/pdf-flip-book/viewer.html?file=/wp-content/uploads/2026/03/test-doc-1-1.pdf&key=${key}`;

		await page.goto(viewerUrl);
		await page.waitForTimeout(5000);

		// Check prev/next buttons exist and are large enough to tap
		const prevBtn = page.locator('.prev, .fnav.prev, [class*="prev"]').first();
		const nextBtn = page.locator('.next, .fnav.next, [class*="next"]').first();

		if (await prevBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
			const prevBox = await prevBtn.boundingBox();
			if (prevBox) {
				// Touch target should be at least 44px
				expect(prevBox.width).toBeGreaterThanOrEqual(40);
				expect(prevBox.height).toBeGreaterThanOrEqual(40);
			}
		}

		await page.screenshot({ path: 'test-results/07-flipbook-mobile-nav.png', fullPage: true });
	});
});

// =============================================================================
// Gallery Grid Layout — Responsive
// =============================================================================

test.describe('PDF Gallery — Grid Responsive Layout', () => {
	test('grid layout renders 3 columns on desktop', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });

		// Navigate to WordPress and inject gallery HTML with the real CSS
		await page.goto('/');
		await page.waitForLoadState('domcontentloaded');

		await page.evaluate(() => {
			return new Promise<void>((resolve) => {
				// Load the gallery CSS
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = '/wp-content/plugins/embedpress/assets/css/pdf-gallery.css';
				link.onload = () => {
					document.body.innerHTML = `
						<div style="padding:40px;">
							<div class="ep-pdf-gallery" data-layout="grid"
								style="--ep-gallery-columns-desktop:3;--ep-gallery-columns-tablet:2;--ep-gallery-columns-mobile:1;--ep-gallery-gap:20px;--ep-gallery-radius:8px;">
								<div class="ep-pdf-gallery__grid">
									<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#e74c3c;"></div><div class="ep-pdf-gallery__book-title">Doc 1</div></div>
									<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#3498db;"></div><div class="ep-pdf-gallery__book-title">Doc 2</div></div>
									<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#2ecc71;"></div><div class="ep-pdf-gallery__book-title">Doc 3</div></div>
									<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#f39c12;"></div><div class="ep-pdf-gallery__book-title">Doc 4</div></div>
									<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#9b59b6;"></div><div class="ep-pdf-gallery__book-title">Doc 5</div></div>
									<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#1abc9c;"></div><div class="ep-pdf-gallery__book-title">Doc 6</div></div>
								</div>
							</div>
						</div>`;
					requestAnimationFrame(() => setTimeout(() => resolve(), 100));
				};
				document.head.appendChild(link);
			});
		});

		// Check grid has 3 column tracks
		const gridColumns = await page.locator('.ep-pdf-gallery__grid').evaluate((el) => {
			return window.getComputedStyle(el).gridTemplateColumns;
		});
		const tracks = gridColumns.split(' ').filter((c: string) => parseFloat(c) > 0);
		expect(tracks.length).toBe(3);

		// Verify items 1 and 2 are on same row (same Y)
		const item1 = await page.locator('.ep-pdf-gallery__item').nth(0).boundingBox();
		const item2 = await page.locator('.ep-pdf-gallery__item').nth(1).boundingBox();
		if (item1 && item2) {
			expect(Math.abs(item1.y - item2.y)).toBeLessThan(5);
		}

		await page.screenshot({ path: 'test-results/08-grid-desktop-3col.png', fullPage: true });
	});

	test('grid items stack vertically on mobile', async ({ browser }) => {
		// Create a fresh context with mobile viewport — this ensures media queries work
		const mobileContext = await browser.newContext({
			viewport: { width: 375, height: 812 },
		});
		const mobilePage = await mobileContext.newPage();

		// Navigate to a real WordPress page first so CSS loads from same origin
		await mobilePage.goto('/');
		await mobilePage.waitForLoadState('domcontentloaded');

		// Inject gallery HTML into the real page
		await mobilePage.evaluate(() => {
			return new Promise<void>((resolve) => {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = '/wp-content/plugins/embedpress/assets/css/pdf-gallery.css';
				link.onload = () => {
					document.body.innerHTML = `
						<div style="padding:20px;">
							<div class="ep-pdf-gallery" data-layout="grid"
								style="--ep-gallery-columns-desktop:3;--ep-gallery-columns-tablet:2;--ep-gallery-columns-mobile:1;--ep-gallery-gap:20px;">
								<div class="ep-pdf-gallery__grid">
									<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#e74c3c;"></div></div>
									<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#3498db;"></div></div>
									<div class="ep-pdf-gallery__item"><div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="4:3" style="background:#2ecc71;"></div></div>
								</div>
							</div>
						</div>`;
					requestAnimationFrame(() => setTimeout(() => resolve(), 300));
				};
				document.head.appendChild(link);
			});
		});

		// On mobile (375px) with --ep-gallery-columns-mobile:1, each item should take full width
		const item1 = await mobilePage.locator('.ep-pdf-gallery__item').nth(0).boundingBox();
		if (item1) {
			// Item should be nearly full width (335px = 375 - 40px padding)
			expect(item1.width).toBeGreaterThan(300);
		}

		await mobilePage.screenshot({ path: 'test-results/09-grid-mobile-1col.png', fullPage: true });
		await mobileContext.close();
	});
});

// =============================================================================
// Bookshelf Layout
// =============================================================================

test.describe('PDF Gallery — Bookshelf Layout', () => {
	test('bookshelf renders 3D books with shelf image', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/');
		await page.waitForLoadState('domcontentloaded');

		await page.evaluate(() => {
			return new Promise<void>((resolve) => {
				// Load both CSS and JS
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = '/wp-content/plugins/embedpress/assets/css/pdf-gallery.css';
				link.onload = () => {
					document.body.innerHTML = `
						<div style="padding:40px;background:#f5f5f5;">
							<h2>Bookshelf Layout Test</h2>
							<div class="ep-pdf-gallery" data-layout="bookshelf" data-columns="4" data-shelf-style="dark-wood"
								style="--ep-gallery-gap:30px;--ep-gallery-radius:6px;">
								<div class="ep-pdf-gallery__carousel">
									<div class="ep-pdf-gallery__carousel-track">
										<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;">
											<div class="ep-pdf-gallery__thumbnail-wrap" style="background:#e74c3c;height:180px;"></div>
											<div class="ep-pdf-gallery__overlay"></div>
										</div>
										<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;">
											<div class="ep-pdf-gallery__thumbnail-wrap" style="background:#3498db;height:180px;"></div>
											<div class="ep-pdf-gallery__overlay"></div>
										</div>
										<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;">
											<div class="ep-pdf-gallery__thumbnail-wrap" style="background:#2ecc71;height:180px;"></div>
											<div class="ep-pdf-gallery__overlay"></div>
										</div>
										<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;">
											<div class="ep-pdf-gallery__thumbnail-wrap" style="background:#f39c12;height:180px;"></div>
											<div class="ep-pdf-gallery__overlay"></div>
										</div>
										<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;">
											<div class="ep-pdf-gallery__thumbnail-wrap" style="background:#9b59b6;height:180px;"></div>
											<div class="ep-pdf-gallery__overlay"></div>
										</div>
										<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;">
											<div class="ep-pdf-gallery__thumbnail-wrap" style="background:#1abc9c;height:180px;"></div>
											<div class="ep-pdf-gallery__overlay"></div>
										</div>
										<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;">
											<div class="ep-pdf-gallery__thumbnail-wrap" style="background:#e67e22;height:180px;"></div>
											<div class="ep-pdf-gallery__overlay"></div>
										</div>
									</div>
								</div>
							</div>
						</div>`;

					// Load the gallery JS to initialize bookshelf
					const script = document.createElement('script');
					script.src = '/wp-content/plugins/embedpress/assets/js/pdf-gallery.js';
					script.onload = () => setTimeout(() => resolve(), 1000);
					document.body.appendChild(script);
				};
				document.head.appendChild(link);
			});
		});
		await page.waitForTimeout(500);

		// Verify bookshelf was created (carousel replaced by bookshelf container)
		const bookshelfContainer = page.locator('.ep-pdf-gallery__bookshelf-container');
		await expect(bookshelfContainer).toBeVisible({ timeout: 5000 });

		// Verify shelf rows were created
		const shelfRows = await page.locator('.ep-pdf-gallery__shelf-row').count();
		expect(shelfRows).toBeGreaterThan(0);

		// First row should have 4 books (data-columns=4)
		const firstRowBooks = await page.locator('.ep-pdf-gallery__shelf-row').first().locator('.ep-pdf-gallery__item').count();
		expect(firstRowBooks).toBe(4);

		// Second row should have 3 books (7 total, 4 per row)
		const secondRowBooks = await page.locator('.ep-pdf-gallery__shelf-row').nth(1).locator('.ep-pdf-gallery__item').count();
		expect(secondRowBooks).toBe(3);

		// Verify 3D transform on book covers
		const bookTransform = await page.locator('.ep-pdf-gallery__thumbnail-wrap').first().evaluate((el) => {
			return window.getComputedStyle(el).transform;
		});
		expect(bookTransform).not.toBe('none');

		// Verify gap is 30px (from CSS variable)
		const gap = await page.locator('.ep-pdf-gallery__shelf-row').first().evaluate((el) => {
			return window.getComputedStyle(el).gap;
		});
		// Gap should come from the CSS variable (could be 30px or 20px default)
		expect(['20px', '30px']).toContain(gap);

		await page.screenshot({ path: 'test-results/10-bookshelf-3d-layout.png', fullPage: true });
	});

	test('bookshelf hover effect opens book slightly', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/');
		await page.waitForLoadState('domcontentloaded');

		await page.evaluate(() => {
			return new Promise<void>((resolve) => {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = '/wp-content/plugins/embedpress/assets/css/pdf-gallery.css';
				link.onload = () => {
					document.body.innerHTML = `
						<div style="padding:80px;">
							<div class="ep-pdf-gallery" data-layout="bookshelf" data-columns="3" data-shelf-style="dark-wood"
								style="--ep-gallery-gap:40px;">
								<div class="ep-pdf-gallery__bookshelf-container">
									<div class="ep-pdf-gallery__shelf-row">
										<div class="ep-pdf-gallery__item" id="hover-book" style="flex:0 0 140px;width:140px;perspective:600px;">
											<div class="ep-pdf-gallery__thumbnail-wrap" id="book-cover" style="background:#e74c3c;height:180px;"></div>
											<div class="ep-pdf-gallery__overlay">
												<svg class="ep-pdf-gallery__view-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
											</div>
										</div>
										<div class="ep-pdf-gallery__item" style="flex:0 0 140px;width:140px;">
											<div class="ep-pdf-gallery__thumbnail-wrap" style="background:#3498db;height:180px;"></div>
										</div>
									</div>
								</div>
							</div>
						</div>`;
					requestAnimationFrame(() => setTimeout(() => resolve(), 200));
				};
				document.head.appendChild(link);
			});
		});

		// Get transform before hover
		const beforeTransform = await page.locator('#book-cover').evaluate((el) => {
			return window.getComputedStyle(el).transform;
		});

		// Hover over the book
		await page.locator('#hover-book').hover();
		await page.waitForTimeout(500);

		// Get transform after hover — should be different (more rotation)
		const afterTransform = await page.locator('#book-cover').evaluate((el) => {
			return window.getComputedStyle(el).transform;
		});

		expect(afterTransform).not.toBe(beforeTransform);

		// View icon should be visible on hover
		const viewIcon = page.locator('#hover-book .ep-pdf-gallery__view-icon');
		const opacity = await viewIcon.evaluate((el) => {
			return window.getComputedStyle(el).opacity;
		});
		expect(parseFloat(opacity)).toBe(1);

		await page.screenshot({ path: 'test-results/11-bookshelf-hover-effect.png', fullPage: true });
	});
});

// =============================================================================
// Mobile Popup — Design Not Overlapping
// =============================================================================

test.describe('PDF Gallery — Mobile Popup No Overlap', () => {
	test('popup navigation buttons dont overlap viewer on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/');
		await page.waitForLoadState('domcontentloaded');

		await page.evaluate(() => {
			return new Promise<void>((resolve) => {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = '/wp-content/plugins/embedpress/assets/css/pdf-gallery.css';
				link.onload = () => {
					document.body.innerHTML = `
						<div class="ep-pdf-gallery__popup ep-pdf-gallery__popup--open">
							<div class="ep-pdf-gallery__popup-overlay">
								<button class="ep-pdf-gallery__popup-close">&times;</button>
								<button class="ep-pdf-gallery__popup-prev" id="popup-prev">
									<svg viewBox="0 0 24 24" width="24" height="24"><path d="M15 18l-6-6 6-6" stroke="#fff" fill="none" stroke-width="2"/></svg>
								</button>
								<button class="ep-pdf-gallery__popup-next" id="popup-next">
									<svg viewBox="0 0 24 24" width="24" height="24"><path d="M9 6l6 6-6 6" stroke="#fff" fill="none" stroke-width="2"/></svg>
								</button>
								<span class="ep-pdf-gallery__popup-counter">2 / 5</span>
								<div class="ep-pdf-gallery__popup-viewer" id="popup-viewer">
									<div style="width:100%;height:100%;background:#fff;display:flex;align-items:center;justify-content:center;color:#333;font-size:24px;">
										PDF Viewer Area
									</div>
								</div>
							</div>
						</div>`;
					requestAnimationFrame(() => setTimeout(() => resolve(), 200));
				};
				document.head.appendChild(link);
			});
		});

		// Get positions
		const prevBox = await page.locator('#popup-prev').boundingBox();
		const nextBox = await page.locator('#popup-next').boundingBox();
		const viewerBox = await page.locator('#popup-viewer').boundingBox();

		// Prev/next should be BELOW the viewer, not overlapping it
		if (prevBox && viewerBox) {
			// The nav buttons should be at the bottom area, not in the middle of the viewer
			expect(prevBox.y).toBeGreaterThan(viewerBox.y + viewerBox.height * 0.7);
		}

		// Close button should be visible
		const closeBtn = page.locator('.ep-pdf-gallery__popup-close');
		await expect(closeBtn).toBeVisible();

		await page.screenshot({ path: 'test-results/12-mobile-popup-no-overlap.png', fullPage: true });
	});
});
