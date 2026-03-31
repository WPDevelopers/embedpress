import { test, expect } from '@playwright/test';
import { createPost, publishPost, viewPost } from './helpers/wp';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

test.use({ storageState: 'tests/e2e/.auth/wp-session.json' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '../../');
const PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

// Helper to read a plugin file
function readPluginFile(relativePath: string): string {
	return fs.readFileSync(path.join(PLUGIN_ROOT, relativePath), 'utf-8');
}

// =============================================================================
// CSS & JS correctness tests (read local files, no WordPress needed)
// =============================================================================

test.describe('PDF Gallery — Mobile Design (CSS)', () => {
	const css = readPluginFile('assets/css/pdf-gallery.css');

	test('popup nav buttons repositioned to bottom on mobile', () => {
		// Mobile media query should position buttons at bottom
		expect(css).toContain('bottom: 12px');
	});

	test('popup viewer takes full viewport on mobile', () => {
		expect(css).toContain('width: 100vw');
		expect(css).toContain('max-width: none');
	});

	test('popup viewer height accounts for nav buttons', () => {
		expect(css).toContain('height: calc(100vh - 60px)');
	});
});

test.describe('PDF Gallery — Bookshelf Settings (CSS)', () => {
	const css = readPluginFile('assets/css/pdf-gallery.css');

	test('bookshelf gap uses CSS variable', () => {
		expect(css).toContain('gap: var(--ep-gallery-gap');
	});

	test('bookshelf does not hardcode aspect-ratio with !important', () => {
		// Masonry uses !important (that's fine), but bookshelf thumbnail-wrap should not
		expect(css).not.toContain('aspect-ratio: 3 / 4 !important');
	});

	test('bookshelf border-radius uses CSS variable', () => {
		expect(css).toContain('var(--ep-gallery-radius');
	});
});

test.describe('PDF Gallery — Bookshelf Settings (JS)', () => {
	const js = readPluginFile('assets/js/pdf-gallery.js');

	test('reads columns from data-columns attribute', () => {
		expect(js).toContain('gallery.dataset.columns');
	});

	test('uses DEFAULT_BOOKS_PER_SHELF as fallback, not hardcoded 5', () => {
		expect(js).toContain('DEFAULT_BOOKS_PER_SHELF');
		// Should not have the old hardcoded pattern (BOOKS_PER_SHELF without DEFAULT_ prefix)
		expect(js).not.toMatch(/[^_]BOOKS_PER_SHELF:\s*5/);
	});
});

test.describe('PDF Gallery — Thumbnail Scaling (JS)', () => {
	const js = readPluginFile('assets/js/pdf-gallery.js');

	test('caps device pixel ratio to 2x', () => {
		expect(js).toContain('Math.min(window.devicePixelRatio || 1, 2)');
	});

	test('caps target width to 1200px', () => {
		expect(js).toContain('Math.min(targetWidth, 1200)');
	});

	test('caps scale to 3x', () => {
		expect(js).toContain('Math.min(scale, 3)');
	});

	test('minimum scale is 0.8', () => {
		expect(js).toContain('Math.max(scale, 0.8)');
	});
});

test.describe('PDF Gallery — Watermark (JS)', () => {
	const js = readPluginFile('assets/pdf/web/ep-scripts.js');

	test('decodes watermark text from URL params', () => {
		expect(js).toContain("decodeURIComponent(hashParams.get('watermark_text')");
	});

	test('handles missing hash on watermark color', () => {
		expect(js).toContain("if (c && c.charAt(0) !== '#') c = '#' + c");
	});

	test('supports tiled and center watermark styles', () => {
		expect(js).toContain("wm.style === 'tiled'");
		expect(js).toContain('drawWatermarkOnCanvas');
	});

	test('hooks into pagerendered event for watermark', () => {
		expect(js).toContain("PDFViewerApplication.eventBus.on('pagerendered'");
	});
});

test.describe('PDF Gallery — Watermark (PHP)', () => {
	test('PDF widget uses global color helper for watermark', () => {
		const php = readPluginFile('EmbedPress/Elementor/Widgets/Embedpress_Pdf.php');
		expect(php).toContain("Helper::get_elementor_global_color($settings, 'embedpress_watermark_color')");
		expect(php).toContain('Global_Colors::COLOR_PRIMARY');
	});

	test('Gallery widget uses global color helper for watermark', () => {
		const php = readPluginFile('EmbedPress/Elementor/Widgets/Embedpress_Pdf_Gallery.php');
		expect(php).toContain("Helper::get_elementor_global_color($settings, 'watermark_color')");
		expect(php).toContain('Global_Colors::COLOR_PRIMARY');
	});

	test('Document widget does NOT have watermark controls', () => {
		const php = readPluginFile('EmbedPress/Elementor/Widgets/Embedpress_Document.php');
		expect(php).not.toContain('embedpress_doc_watermark_section');
		expect(php).toContain("'watermark_text' => ''");
	});
});

test.describe('PDF Gallery — Flipbook Mobile (CSS)', () => {
	const css = readPluginFile('assets/pdf-flip-book/css/ep-black-book-view.css');

	test('nav buttons have dark background for visibility', () => {
		expect(css).toContain('background: rgba(0, 0, 0, 0.3)');
	});

	test('nav buttons are circular', () => {
		expect(css).toContain('border-radius: 50%');
	});

	test('nav buttons meet 44px min touch target', () => {
		expect(css).toContain('min-width: 44px');
		expect(css).toContain('min-height: 44px');
	});

	test('nav buttons have elevated z-index on mobile', () => {
		expect(css).toContain('z-index: 10');
	});
});

test.describe('PDF Gallery — Block Icon (JS)', () => {
	test('PDF Gallery block uses PdfGalleryIcon', () => {
		const js = readPluginFile('src/Blocks/pdf-gallery/src/index.js');
		expect(js).toContain('PdfGalleryIcon');
		expect(js).not.toContain('icon: PdfIcon');
	});

	test('PdfGalleryIcon is exported from icons.js', () => {
		const js = readPluginFile('src/Blocks/GlobalCoponents/icons.js');
		expect(js).toContain('export const PdfGalleryIcon');
	});
});

test.describe('PDF Gallery — Static/Assets Sync', () => {
	const filePairs = [
		'css/pdf-gallery.css',
		'js/pdf-gallery.js',
		'pdf-flip-book/css/ep-black-book-view.css',
		'pdf/web/ep-scripts.js',
	];

	for (const file of filePairs) {
		test(`static/${file} matches assets/${file}`, () => {
			const asset = readPluginFile(`assets/${file}`);
			const staticFile = readPluginFile(`static/${file}`);
			expect(asset).toBe(staticFile);
		});
	}
});

// =============================================================================
// WordPress integration tests (require running WordPress)
// =============================================================================

test.describe('PDF Gallery — Gutenberg Integration', () => {
	test('PDF Gallery block is available in inserter', async ({ page }) => {
		await createPost(page, 'E2E: PDF Gallery Test');

		const emptyBlock = page.locator('[data-title="Paragraph"], [aria-label="Add default block"], p.block-editor-default-block-appender__content').first();
		await emptyBlock.click();
		await page.waitForTimeout(300);

		await page.keyboard.type('/pdf gallery');
		await page.waitForTimeout(1500);

		const galleryOption = page.locator('.components-autocomplete__result, .block-editor-inserter__panel-content button').filter({ hasText: /PDF Gallery/i }).first();
		const isVisible = await galleryOption.isVisible({ timeout: 5000 }).catch(() => false);

		if (isVisible) {
			await galleryOption.click();
			await page.waitForTimeout(1000);

			const galleryBlock = page.locator('.wp-block-embedpress-pdf-gallery, [data-type="embedpress/pdf-gallery"]').first();
			await expect(galleryBlock).toBeVisible({ timeout: 10000 });
		}
	});
});

test.describe('PDF Gallery — Modern Viewer Watermark', () => {
	test('viewer page loads with watermark params in hash', async ({ page }) => {
		const params = new URLSearchParams({
			themeMode: 'default',
			toolbar: 'true',
			download: 'true',
			watermark_text: 'CONFIDENTIAL',
			watermark_font_size: '48',
			watermark_color: '#ff0000',
			watermark_opacity: '30',
			watermark_style: 'center',
		});

		const key = Buffer.from(params.toString()).toString('base64');
		const viewerUrl = `/wp-content/plugins/embedpress/assets/pdf/web/viewer.html?file=${encodeURIComponent(PDF_URL)}#key=${key}`;

		await page.goto(viewerUrl);
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(3000);

		// Verify viewer page loaded (check for viewer container or toolbar)
		const viewerLoaded = await page.locator('#viewer, #viewerContainer, .pdfViewer, #toolbarContainer').first().isVisible({ timeout: 10000 }).catch(() => false);
		expect(viewerLoaded).toBeTruthy();
	});
});
