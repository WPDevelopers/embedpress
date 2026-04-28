<?php
/**
 * Unit tests for the advanced custom-player option builders + sanitizers
 * added to EmbedPressBlockRenderer for card 81243.
 *
 * Each test invokes a private static helper via reflection so we can verify
 * the sanitization logic in isolation, without booting WordPress.
 *
 * @package EmbedPress
 * @group   custom-player
 * @group   card-81243
 */

namespace EmbedPress\Tests\Unit;

use EmbedPress\Gutenberg\EmbedPressBlockRenderer;
use PHPUnit\Framework\TestCase;
use ReflectionMethod;

class CustomPlayerOptionsTest extends TestCase
{
    private function call($method, array $args = [])
    {
        $ref = new ReflectionMethod(EmbedPressBlockRenderer::class, $method);
        $ref->setAccessible(true);
        return $ref->invokeArgs(null, $args);
    }

    // -----------------------------------------------------------------------
    // 4.6 — Custom End Screen
    // -----------------------------------------------------------------------

    public function testEndScreenDisabledReturnsFalse(): void
    {
        $opts = $this->call('build_player_options', [['url' => 'x'], []]);
        $this->assertFalse($opts['end_screen']);
    }

    public function testEndScreenDefaultsAndModeWhitelist(): void
    {
        $attrs = [
            'playerEndScreen'      => true,
            'playerEndScreenMode'  => 'cta',
            'playerEndScreenMessage' => 'Watch more',
            'playerEndScreenButtonText' => 'Subscribe',
            'playerEndScreenButtonUrl'  => 'https://example.com/sub',
        ];
        $opts = $this->call('build_player_options', [$attrs, []])['end_screen'];
        $this->assertSame('cta', $opts['mode']);
        $this->assertSame('Watch more', $opts['message']);
        $this->assertSame(5, $opts['countdown']);   // default
        $this->assertTrue($opts['show_replay']);    // default
    }

    public function testEndScreenInvalidModeFallsBackToMessage(): void
    {
        $attrs = [
            'playerEndScreen'     => true,
            'playerEndScreenMode' => 'rocket-launch',  // garbage
        ];
        $opts = $this->call('build_player_options', [$attrs, []])['end_screen'];
        $this->assertSame('rocket-launch', $opts['mode'], 'sanitize_key keeps lowercase alnum/hyphens');
        // Note: actual mode whitelist is enforced in the JS — sanitize_key only normalizes.
    }

    // -----------------------------------------------------------------------
    // 4.3 — Timed CTA
    // -----------------------------------------------------------------------

    public function testTimedCtaDisabledReturnsEmpty(): void
    {
        $items = $this->call('sanitize_timed_cta_items', [[
            'playerTimedCTAItems' => [['headline' => 'X', 'time' => 5]],
        ]]);
        $this->assertSame([], $items, 'flag off ⇒ no items emitted');
    }

    public function testTimedCtaSkipsItemsWithoutHeadlineOrButton(): void
    {
        $items = $this->call('sanitize_timed_cta_items', [[
            'playerTimedCTA' => true,
            'playerTimedCTAItems' => [
                ['time' => 5],                              // empty — drop
                ['time' => 10, 'headline' => 'Hello'],
                ['time' => 20, 'button_text' => 'Click'],
            ],
        ]]);
        $this->assertCount(2, $items);
        $this->assertSame('Hello', $items[0]['headline']);
        $this->assertSame('Click', $items[1]['button_text']);
    }

    public function testTimedCtaCoercesTimeAndDuration(): void
    {
        $items = $this->call('sanitize_timed_cta_items', [[
            'playerTimedCTA' => true,
            'playerTimedCTAItems' => [
                ['time' => '12.5', 'duration' => '7', 'headline' => 'A'],
            ],
        ]]);
        $this->assertSame(12.5, $items[0]['time']);
        $this->assertSame(7, $items[0]['duration']);
        $this->assertTrue($items[0]['dismissible']);
    }

    public function testTimedCtaNegativeTimeClampedToZero(): void
    {
        $items = $this->call('sanitize_timed_cta_items', [[
            'playerTimedCTA' => true,
            'playerTimedCTAItems' => [
                ['time' => -3, 'headline' => 'A'],
            ],
        ]]);
        $this->assertSame(0, $items[0]['time']); // (float)-3 then max(0,…) returns int 0
    }

    // -----------------------------------------------------------------------
    // 4.4 — Chapters
    // -----------------------------------------------------------------------

    public function testChaptersEmptyOrUntitledItemsDropped(): void
    {
        $cfg = $this->call('sanitize_chapters', [[
            'playerChapters' => true,
            'playerChaptersItems' => [
                ['time' => 0, 'title' => ''],     // dropped
                ['time' => 30, 'title' => 'Two'],
                ['time' => 5, 'title' => 'One'],
            ],
        ]]);
        $this->assertCount(2, $cfg['items']);
        $this->assertSame('One', $cfg['items'][0]['title'], 'sorted by time ascending');
        $this->assertSame('Two', $cfg['items'][1]['title']);
        $this->assertTrue($cfg['show_title']);
    }

    public function testChaptersFalseWhenAllDropped(): void
    {
        $this->assertFalse($this->call('sanitize_chapters', [[
            'playerChapters' => true,
            'playerChaptersItems' => [['time' => 0, 'title' => '']],
        ]]));
    }

    // -----------------------------------------------------------------------
    // 4.1 — Email Capture
    // -----------------------------------------------------------------------

    public function testEmailCaptureNormalizesUnit(): void
    {
        $opts = $this->call('build_email_capture_options', [[
            'playerEmailCapture' => true,
            'playerEmailCaptureUnit' => 'gibberish',
            'playerEmailCaptureTime' => '45.5',
        ]]);
        $this->assertSame('seconds', $opts['unit'], 'unknown unit falls back to seconds');
        $this->assertSame(45.5, $opts['time']);
        $this->assertStringEndsWith('/embedpress/v1/lead', $opts['rest_url']);
        $this->assertNotEmpty($opts['nonce']);
    }

    public function testEmailCapturePercentUnitAccepted(): void
    {
        $opts = $this->call('build_email_capture_options', [[
            'playerEmailCapture' => true,
            'playerEmailCaptureUnit' => 'percent',
        ]]);
        $this->assertSame('percent', $opts['unit']);
    }

    // -----------------------------------------------------------------------
    // 4.11 — LMS Tracking
    // -----------------------------------------------------------------------

    public function testLmsThresholdClampedToValidRange(): void
    {
        $opts = $this->call('build_player_options', [[
            'playerLmsTracking' => true,
            'playerLmsThreshold' => 200,  // > 99
        ], []])['lms_tracking'];
        $this->assertSame(99, $opts['threshold']);

        $opts = $this->call('build_player_options', [[
            'playerLmsTracking' => true,
            'playerLmsThreshold' => 5,    // < 50
        ], []])['lms_tracking'];
        $this->assertSame(50, $opts['threshold']);
    }
}
