<?php
/**
 * Unit tests for the REST endpoint handlers added for card 81243:
 *   - Lead_Capture        (4.1 Email Capture)
 *   - Completion_Tracker  (4.11 LMS)
 *   - Heatmap_Tracker     (4.7 Drop-off Heatmap)
 *   - CDN_Offloader       (4.12 helpers)
 *
 * The handlers receive a WP_REST_Request and return a WP_REST_Response.
 * We use lightweight stubs for both since the real classes aren't loaded
 * in this unit-test bootstrap.
 *
 * @package EmbedPress
 * @group   custom-player
 * @group   card-81243
 */

namespace {
    // Minimal WP_REST_Request / WP_REST_Response stubs declared in the global
    // namespace so the production classes (which use \WP_REST_Request) resolve.
    if (!class_exists(WP_REST_Request::class)) {
        class WP_REST_Request
        {
            private $params = [];
            public function set_param($key, $value) { $this->params[$key] = $value; }
            public function get_param($key) { return $this->params[$key] ?? null; }
        }
    }
    if (!class_exists(WP_REST_Response::class)) {
        class WP_REST_Response
        {
            public $data;
            public $status;
            public function __construct($data = null, $status = 200) {
                $this->data = $data;
                $this->status = $status;
            }
            public function get_status() { return $this->status; }
            public function get_data() { return $this->data; }
        }
    }
}

namespace EmbedPress\Tests\Unit {

use PHPUnit\Framework\TestCase;
use EmbedPress\Includes\Classes\Lead_Capture;
use EmbedPress\Includes\Classes\Completion_Tracker;
use EmbedPress\Includes\Classes\Heatmap_Tracker;
use EmbedPress\Includes\Classes\CDN_Offloader;

class CustomPlayerRestEndpointsTest extends TestCase
{
    protected function setUp(): void
    {
        // Reset the in-memory option store between tests.
        $GLOBALS['__ep_test_options'] = [];
    }

    private function makeRequest(array $params = [])
    {
        $req = new \WP_REST_Request();
        foreach ($params as $k => $v) {
            $req->set_param($k, $v);
        }
        return $req;
    }

    // -----------------------------------------------------------------------
    // Lead_Capture (4.1)
    // -----------------------------------------------------------------------

    public function testLeadCaptureRejectsInvalidEmail(): void
    {
        $lc = new Lead_Capture();
        $resp = $lc->handle_lead($this->makeRequest(['email' => 'not-an-email']));
        $this->assertSame(400, $resp->get_status());
    }

    public function testLeadCaptureStoresValidLead(): void
    {
        $lc = new Lead_Capture();
        $resp = $lc->handle_lead($this->makeRequest([
            'email' => 'test@example.com',
            'name' => 'Akash',
            'video_url' => 'https://cdn.test/video.mp4',
        ]));
        $this->assertSame(200, $resp->get_status());

        $stored = get_option(Lead_Capture::OPTION_KEY, []);
        $this->assertCount(1, $stored);
        $this->assertSame('test@example.com', $stored[0]['email']);
        $this->assertSame('Akash', $stored[0]['name']);
    }

    public function testLeadCaptureCapsAtMaxLeads(): void
    {
        // Pre-fill with MAX_LEADS leads, push one more, expect FIFO drop.
        $existing = array_fill(0, Lead_Capture::MAX_LEADS, ['email' => 'old@x']);
        update_option(Lead_Capture::OPTION_KEY, $existing);

        $lc = new Lead_Capture();
        $lc->handle_lead($this->makeRequest(['email' => 'new@x.com']));

        $stored = get_option(Lead_Capture::OPTION_KEY, []);
        $this->assertCount(Lead_Capture::MAX_LEADS, $stored);
        $this->assertSame('new@x.com', end($stored)['email']);
    }

    // -----------------------------------------------------------------------
    // Completion_Tracker (4.11) — anti-skip guard
    // -----------------------------------------------------------------------

    public function testCompletionRejectsInsufficientWatchRatio(): void
    {
        $ct = new Completion_Tracker();
        $resp = $ct->handle_completion($this->makeRequest([
            'video_url'      => 'https://x.test/v.mp4',
            'watched_seconds'=> 30,   // 30/100 = 30% < 85% threshold
            'total_seconds'  => 100,
        ]));
        $this->assertSame(422, $resp->get_status());
    }

    public function testCompletionAcceptsAtThreshold(): void
    {
        $ct = new Completion_Tracker();
        $resp = $ct->handle_completion($this->makeRequest([
            'video_url'      => 'https://x.test/v.mp4',
            'watched_seconds'=> 85,   // exactly 85% — passes
            'total_seconds'  => 100,
        ]));
        $this->assertSame(200, $resp->get_status());
    }

    public function testCompletionRejectsZeroDuration(): void
    {
        $ct = new Completion_Tracker();
        $resp = $ct->handle_completion($this->makeRequest([
            'video_url' => 'https://x.test/v.mp4',
            'watched_seconds' => 90,
            'total_seconds' => 0,
        ]));
        $this->assertSame(400, $resp->get_status());
    }

    // -----------------------------------------------------------------------
    // Heatmap_Tracker (4.7)
    // -----------------------------------------------------------------------

    public function testHeatmapSampleRejectsOutOfRangeBucket(): void
    {
        $ht = new Heatmap_Tracker();
        foreach ([-1, 100, 500] as $bad) {
            $resp = $ht->handle_sample($this->makeRequest([
                'video_url' => 'https://x.test/v.mp4',
                'bucket'    => $bad,
            ]));
            $this->assertSame(400, $resp->get_status(), "bucket=$bad should be rejected");
        }
    }

    public function testHeatmapIncrementsBucketCounters(): void
    {
        $ht = new Heatmap_Tracker();
        $url = 'https://x.test/v.mp4';

        $ht->handle_sample($this->makeRequest(['video_url' => $url, 'bucket' => 10]));
        $ht->handle_sample($this->makeRequest(['video_url' => $url, 'bucket' => 10]));
        $ht->handle_sample($this->makeRequest(['video_url' => $url, 'bucket' => 99]));

        $resp = $ht->handle_data($this->makeRequest(['video_url' => $url]));
        $this->assertSame(200, $resp->get_status());
        $buckets = $resp->get_data()['buckets'];
        $this->assertSame(2, $buckets[10]);
        $this->assertSame(1, $buckets[99]);
        $this->assertSame(0, $buckets[50]);
        $this->assertCount(100, $buckets);
    }

    public function testHeatmapDataKeysPerVideoUrl(): void
    {
        $ht = new Heatmap_Tracker();
        $ht->handle_sample($this->makeRequest(['video_url' => 'https://a/v.mp4', 'bucket' => 5]));
        $ht->handle_sample($this->makeRequest(['video_url' => 'https://b/v.mp4', 'bucket' => 5]));

        $a = $ht->handle_data($this->makeRequest(['video_url' => 'https://a/v.mp4']))->get_data();
        $b = $ht->handle_data($this->makeRequest(['video_url' => 'https://b/v.mp4']))->get_data();
        $this->assertSame(1, $a['buckets'][5]);
        $this->assertSame(1, $b['buckets'][5]);
    }

    // -----------------------------------------------------------------------
    // CDN_Offloader (4.12)
    // -----------------------------------------------------------------------

    public function testCdnIsVideoAttachment(): void
    {
        $GLOBALS['__ep_test_post_mime'][1] = 'video/mp4';
        $GLOBALS['__ep_test_post_mime'][2] = 'image/png';
        $this->assertTrue(CDN_Offloader::is_video_attachment(1));
        $this->assertFalse(CDN_Offloader::is_video_attachment(2));
        $this->assertFalse(CDN_Offloader::is_video_attachment(3));
    }

    public function testCdnUrlForReturnsEmptyWhenNoAttachment(): void
    {
        $this->assertSame('', CDN_Offloader::cdn_url_for(''));
        $this->assertSame('', CDN_Offloader::cdn_url_for('https://no-attachment.test/x.mp4'));
    }

    public function testCdnGetSettingsReturnsDefaults(): void
    {
        $s = CDN_Offloader::get_settings();
        $this->assertFalse($s['enabled']);
        $this->assertSame('bunnycdn', $s['provider']);
        $this->assertSame('', $s['storage_zone']);
        $this->assertSame('', $s['access_key']);
    }
}
}
