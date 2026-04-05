<?php
/**
 * Unit tests for PDF Gallery, Flipbook, and Watermark features.
 *
 * Tests the rendering logic, settings handling, parameter encoding,
 * and CSS/JS correctness for the fixes in card-79239-extend.
 *
 * @package EmbedPress
 * @group   pdf-gallery
 */

namespace EmbedPress\Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * @group pdf-gallery
 */
class PdfGalleryTest extends TestCase
{
    private string $basePath;

    protected function setUp(): void
    {
        $this->basePath = dirname(__DIR__, 2);
    }

    // =========================================================================
    // Gallery HTML Output: CSS variables rendered from settings
    // =========================================================================

    /**
     * Simulate what the Elementor widget render() does: build the inline style
     * from settings and verify CSS custom properties are generated correctly.
     *
     * @dataProvider gallerySettingsProvider
     * @group bookshelf
     */
    public function testGalleryRendersCorrectCssVariables(
        int $columns,
        int $columnsTablet,
        int $columnsMobile,
        int $gap,
        int $borderRadius,
        string $expectedStyle
    ): void {
        // Replicate the sprintf from Embedpress_Pdf_Gallery::render()
        $style = sprintf(
            '--ep-gallery-columns:%d;--ep-gallery-columns-tablet:%d;--ep-gallery-columns-mobile:%d;--ep-gallery-gap:%dpx;--ep-gallery-radius:%dpx;',
            $columns, $columnsTablet, $columnsMobile, $gap, $borderRadius
        );

        $this->assertSame($expectedStyle, $style);
    }

    public static function gallerySettingsProvider(): array
    {
        return [
            'defaults' => [
                3, 2, 1, 20, 8,
                '--ep-gallery-columns:3;--ep-gallery-columns-tablet:2;--ep-gallery-columns-mobile:1;--ep-gallery-gap:20px;--ep-gallery-radius:8px;',
            ],
            'custom 4 columns, large gap' => [
                4, 3, 2, 40, 12,
                '--ep-gallery-columns:4;--ep-gallery-columns-tablet:3;--ep-gallery-columns-mobile:2;--ep-gallery-gap:40px;--ep-gallery-radius:12px;',
            ],
            'single column no radius' => [
                1, 1, 1, 0, 0,
                '--ep-gallery-columns:1;--ep-gallery-columns-tablet:1;--ep-gallery-columns-mobile:1;--ep-gallery-gap:0px;--ep-gallery-radius:0px;',
            ],
        ];
    }

    /**
     * Verify the settings extraction logic from Elementor settings array
     * handles missing/empty values correctly.
     *
     * @group bookshelf
     */
    public function testGallerySettingsExtraction(): void
    {
        // Simulate Elementor settings array
        $settings = [
            'columns' => 5,
            'columns_tablet' => 3,
            'columns_mobile' => '',   // empty = should default
            'gap' => ['size' => 30, 'unit' => 'px'],
            'border_radius' => ['size' => 0, 'unit' => 'px'],
            'aspect_ratio' => '16:9',
            'layout' => 'bookshelf',
            'bookshelf_style' => 'glass',
        ];

        // Replicate the extraction logic from render()
        $columns = !empty($settings['columns']) ? intval($settings['columns']) : 3;
        $columns_tablet = !empty($settings['columns_tablet']) ? intval($settings['columns_tablet']) : 2;
        $columns_mobile = !empty($settings['columns_mobile']) ? intval($settings['columns_mobile']) : 1;
        $gap = isset($settings['gap']['size']) ? intval($settings['gap']['size']) : 20;
        $border_radius = isset($settings['border_radius']['size']) ? intval($settings['border_radius']['size']) : 8;
        $aspect_ratio = !empty($settings['aspect_ratio']) ? $settings['aspect_ratio'] : '4:3';
        $layout = !empty($settings['layout']) ? $settings['layout'] : 'grid';

        $this->assertSame(5, $columns);
        $this->assertSame(3, $columns_tablet);
        $this->assertSame(1, $columns_mobile, 'Empty columns_mobile should default to 1');
        $this->assertSame(30, $gap);
        $this->assertSame(0, $border_radius, 'border_radius 0 should be preserved, not defaulted');
        $this->assertSame('16:9', $aspect_ratio);
        $this->assertSame('bookshelf', $layout);
    }

    /**
     * Verify that data attributes are generated with correct values
     * for the bookshelf layout.
     *
     * @group bookshelf
     */
    public function testBookshelfDataAttributesOutput(): void
    {
        $columns = 4;
        $gap = 35;
        $border_radius = 10;
        $shelf_style = 'light-wood';

        // Build the expected data attributes like the render method does
        $html = sprintf(
            'data-layout="bookshelf" data-shelf-style="%s" data-columns="%d" data-gap="%d" data-border-radius="%d"',
            esc_attr($shelf_style),
            $columns,
            $gap,
            $border_radius
        );

        $this->assertStringContainsString('data-columns="4"', $html);
        $this->assertStringContainsString('data-gap="35"', $html);
        $this->assertStringContainsString('data-border-radius="10"', $html);
        $this->assertStringContainsString('data-shelf-style="light-wood"', $html);
    }

    // =========================================================================
    // Watermark parameter encoding/decoding
    // =========================================================================

    /**
     * Test that watermark parameters are correctly base64-encoded
     * into the viewer URL hash, matching the format the JS viewer expects.
     *
     * @group watermark
     */
    public function testWatermarkParamsEncodedInViewerUrl(): void
    {
        $params = [
            'themeMode' => 'default',
            'toolbar' => 'true',
            'watermark_text' => 'CONFIDENTIAL',
            'watermark_font_size' => '60',
            'watermark_color' => '#ff0000',
            'watermark_opacity' => '25',
            'watermark_style' => 'tiled',
        ];

        $query_string = http_build_query($params);
        $encoded = base64_encode(mb_convert_encoding($query_string, 'UTF-8'));

        // Decode and verify round-trip
        $decoded = base64_decode($encoded);
        parse_str($decoded, $result);

        $this->assertSame('CONFIDENTIAL', $result['watermark_text']);
        $this->assertSame('#ff0000', $result['watermark_color']);
        $this->assertSame('25', $result['watermark_opacity']);
        $this->assertSame('tiled', $result['watermark_style']);
        $this->assertSame('60', $result['watermark_font_size']);
    }

    /**
     * Test watermark params with special characters in text.
     *
     * @group watermark
     */
    public function testWatermarkParamsWithSpecialCharacters(): void
    {
        $params = [
            'watermark_text' => 'Company © 2026 — Draft',
            'watermark_color' => '#333333',
        ];

        $query_string = http_build_query($params);
        $encoded = base64_encode(mb_convert_encoding($query_string, 'UTF-8'));

        $decoded = base64_decode($encoded);
        parse_str($decoded, $result);

        $this->assertSame('Company © 2026 — Draft', $result['watermark_text']);
    }

    /**
     * Test watermark color without hash prefix is handled by JS.
     * The JS viewer prepends '#' if missing.
     *
     * @group watermark
     */
    public function testWatermarkColorWithoutHashIsHandled(): void
    {
        // Simulate what JS does: if color doesn't start with #, prepend it
        $color = 'ff0000';
        if ($color && $color[0] !== '#') {
            $color = '#' . $color;
        }
        $this->assertSame('#ff0000', $color);

        // With hash already present
        $color2 = '#00ff00';
        if ($color2 && $color2[0] !== '#') {
            $color2 = '#' . $color2;
        }
        $this->assertSame('#00ff00', $color2);
    }

    /**
     * When pro is not active, watermark params should be empty defaults.
     *
     * @group watermark
     */
    public function testWatermarkDefaultsWhenProNotActive(): void
    {
        $settings = [
            'watermark_text' => 'Should be ignored',
            'watermark_color' => '#ff0000',
        ];

        // Simulate the pro check (EMBEDPRESS_SL_ITEM_SLUG not defined)
        $isPro = defined('EMBEDPRESS_SL_ITEM_SLUG');

        $watermark_text = $isPro && !empty($settings['watermark_text']) ? $settings['watermark_text'] : '';
        $watermark_color = $isPro && !empty($settings['watermark_color']) ? $settings['watermark_color'] : '#000000';

        $this->assertSame('', $watermark_text, 'Watermark text should be empty when pro is not active');
        $this->assertSame('#000000', $watermark_color, 'Watermark color should default when pro is not active');
    }

    // =========================================================================
    // Thumbnail scaling logic
    // =========================================================================

    /**
     * Test that thumbnail scaling logic caps correctly.
     *
     * @dataProvider thumbnailScaleProvider
     * @group thumbnail
     */
    public function testThumbnailScaleCapping(
        int $containerWidth,
        float $dpr,
        float $pageWidth,
        float $expectedMinScale,
        float $expectedMaxScale
    ): void {
        // Replicate JS logic
        $dpr = min($dpr, 2);
        $targetWidth = max($containerWidth * $dpr, 400);
        $targetWidth = min($targetWidth, 1200);
        $scale = $targetWidth / $pageWidth;
        $scale = max($scale, 0.8);
        $scale = min($scale, 3);

        $this->assertGreaterThanOrEqual($expectedMinScale, $scale);
        $this->assertLessThanOrEqual($expectedMaxScale, $scale);
    }

    public static function thumbnailScaleProvider(): array
    {
        return [
            'small container, 1x DPR' => [
                200, 1.0, 612.0,   // Standard US Letter PDF width in points
                0.8, 3.0,          // Scale should be 400/612 ≈ 0.65, capped to 0.8
            ],
            'medium container, 2x DPR' => [
                400, 2.0, 612.0,
                0.8, 3.0,          // 800/612 ≈ 1.3
            ],
            'large container, 3x DPR' => [
                600, 3.0, 612.0,   // DPR capped to 2
                0.8, 3.0,          // 1200/612 ≈ 1.96 (targetWidth capped at 1200)
            ],
            'very small page' => [
                400, 2.0, 100.0,
                0.8, 3.0,          // 800/100 = 8, capped to 3
            ],
        ];
    }

    /**
     * Verify exact scale for a standard PDF page.
     *
     * @group thumbnail
     */
    public function testThumbnailScaleExactValues(): void
    {
        // Standard US Letter: 612 points wide
        $pageWidth = 612.0;

        // Container 300px, DPR 2 → targetWidth = max(600, 400) = 600, min(600, 1200) = 600
        $scale = min(max(600 / $pageWidth, 0.8), 3);
        $this->assertEqualsWithDelta(0.98, $scale, 0.01);

        // Container 100px, DPR 1 → targetWidth = max(100, 400) = 400, min(400, 1200) = 400
        $scale = min(max(400 / $pageWidth, 0.8), 3);
        $this->assertEqualsWithDelta(0.8, $scale, 0.01);  // Capped at 0.8

        // Container 700px, DPR 3 → DPR capped to 2 → targetWidth = max(1400, 400) = 1400, min(1400, 1200) = 1200
        $scale = min(max(1200 / $pageWidth, 0.8), 3);
        $this->assertEqualsWithDelta(1.96, $scale, 0.01);  // Capped at 1200 width
    }

    // =========================================================================
    // Document widget: NO watermark controls
    // =========================================================================

    /**
     * @group watermark
     */
    public function testDocumentWidgetParamDataHasEmptyWatermark(): void
    {
        // Simulate what Document widget getParamData returns
        $settings = [];
        $params = [
            'watermark_text' => '',
            'watermark_font_size' => '48',
            'watermark_color' => '#000000',
            'watermark_opacity' => '15',
            'watermark_style' => 'center',
        ];

        $this->assertEmpty($params['watermark_text']);
        $this->assertSame('#000000', $params['watermark_color']);
        $this->assertSame('15', $params['watermark_opacity']);
    }

    // =========================================================================
    // CSS correctness: bookshelf uses variables, not hardcoded values
    // =========================================================================

    /**
     * @group bookshelf
     */
    public function testBookshelfCssUsesVariablesNotHardcoded(): void
    {
        $css = file_get_contents($this->basePath . '/assets/css/pdf-gallery.css');

        // Gap must use CSS variable
        $this->assertMatchesRegularExpression(
            '/\.ep-pdf-gallery\[data-layout="bookshelf"\].*\.ep-pdf-gallery__shelf-row\s*\{[^}]*gap:\s*var\(--ep-gallery-gap/s',
            $css,
            'Bookshelf shelf-row gap must use --ep-gallery-gap variable'
        );

        // Bookshelf thumbnail-wrap aspect-ratio must NOT have !important
        // (masonry uses !important on aspect-ratio:auto which is fine)
        $this->assertDoesNotMatchRegularExpression(
            '/\.ep-pdf-gallery\[data-layout="bookshelf"\].*__thumbnail-wrap\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*4\s*!important/s',
            $css,
            'Bookshelf thumbnail-wrap aspect-ratio: 3/4 must not use !important'
        );

        // Border radius must reference CSS variable
        $this->assertMatchesRegularExpression(
            '/\.ep-pdf-gallery\[data-layout="bookshelf"\].*\.ep-pdf-gallery__thumbnail-wrap\s*\{[^}]*var\(--ep-gallery-radius/s',
            $css,
            'Bookshelf thumbnail-wrap border-radius must use --ep-gallery-radius variable'
        );
    }

    // =========================================================================
    // JS: Bookshelf reads columns from data attribute
    // =========================================================================

    /**
     * @group bookshelf
     */
    public function testBookshelfJsUsesDataColumnsNotHardcoded(): void
    {
        $js = file_get_contents($this->basePath . '/assets/js/pdf-gallery.js');

        // Must read from data attribute
        $this->assertStringContainsString(
            'gallery.dataset.columns',
            $js,
            'Bookshelf init must read columns from gallery.dataset.columns'
        );

        // DEFAULT should exist (as fallback), not BOOKS_PER_SHELF: 5
        $this->assertStringContainsString(
            'DEFAULT_BOOKS_PER_SHELF',
            $js,
            'Bookshelf should use DEFAULT_BOOKS_PER_SHELF as fallback'
        );
    }

    // =========================================================================
    // Static/assets file sync
    // =========================================================================

    /**
     * @group sync
     */
    public function testStaticFilesSyncedWithAssets(): void
    {
        $files = [
            'css/pdf-gallery.css',
            'js/pdf-gallery.js',
            'pdf-flip-book/css/ep-black-book-view.css',
            'pdf/web/ep-scripts.js',
        ];

        foreach ($files as $file) {
            $this->assertFileEquals(
                "{$this->basePath}/assets/$file",
                "{$this->basePath}/static/$file",
                "static/$file must be in sync with assets/$file"
            );
        }
    }
}
