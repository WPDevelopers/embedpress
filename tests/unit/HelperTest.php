<?php
/**
 * Unit tests for EmbedPress\Includes\Classes\Helper static utility methods.
 *
 * @package EmbedPress
 * @group   helper
 */

namespace EmbedPress\Tests\Unit;

use EmbedPress\Includes\Classes\Helper;
use PHPUnit\Framework\TestCase;

/**
 * @group helper
 */
class HelperTest extends TestCase
{
    // =========================================================================
    // get_extension_from_file_url
    // =========================================================================

    /**
     * @dataProvider extensionProvider
     * @group helper-extension
     */
    public function testGetExtensionFromFileUrl(string $url, string $expected): void
    {
        $this->assertSame($expected, Helper::get_extension_from_file_url($url));
    }

    /**
     * Data provider for get_extension_from_file_url.
     *
     * Note: The implementation splits on "." and returns the last segment,
     * so query params remain attached when present.
     */
    public static function extensionProvider(): array
    {
        return [
            'pdf file'          => ['https://example.com/file.pdf', 'pdf'],
            'doc file'          => ['https://example.com/file.doc', 'doc'],
            'mp4 file'          => ['https://example.com/video.mp4', 'mp4'],
            'nested path'       => ['https://example.com/path/to/file.xlsx', 'xlsx'],
            'double extension'  => ['https://example.com/archive.tar.gz', 'gz'],
            'with query params' => ['https://example.com/file.pdf?v=123', 'pdf?v=123'],
            'no extension'      => ['https://example.com/noextension', 'com/noextension'],
        ];
    }

    // =========================================================================
    // is_youtube
    // =========================================================================

    /**
     * @dataProvider youtubeUrlProvider
     * @group helper-youtube
     */
    public function testIsYoutube(string $url, bool $expected): void
    {
        $this->assertSame($expected, Helper::is_youtube($url));
    }

    /**
     * Data provider for is_youtube.
     *
     * The regex requires /watch?v= format, so youtu.be short links
     * and youtube-nocookie.com do NOT match.
     */
    public static function youtubeUrlProvider(): array
    {
        return [
            'standard youtube'       => ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', true],
            'youtube no www'         => ['https://youtube.com/watch?v=dQw4w9WgXcQ', true],
            'youtube http'           => ['http://www.youtube.com/watch?v=abc123', true],
            'youtu.be short link'    => ['https://youtu.be/dQw4w9WgXcQ', false],
            'youtube-nocookie'       => ['https://www.youtube-nocookie.com/watch?v=abc', false],
            'non-youtube url'        => ['https://vimeo.com/12345', false],
            'youtube channel url'    => ['https://www.youtube.com/channel/UCxyz', false],
            'empty string'           => ['', false],
            'youtube embed'          => ['https://www.youtube.com/embed/abc123', false],
        ];
    }

    // =========================================================================
    // is_youtube_channel
    // =========================================================================

    /**
     * @dataProvider youtubeChannelUrlProvider
     * @group helper-youtube
     */
    public function testIsYoutubeChannel(string $url, bool $expected): void
    {
        $this->assertSame($expected, Helper::is_youtube_channel($url));
    }

    public static function youtubeChannelUrlProvider(): array
    {
        return [
            'channel id url'   => ['https://www.youtube.com/channel/UCxyz123', true],
            'custom c/ url'    => ['https://www.youtube.com/c/ChannelName', true],
            'user url'         => ['https://www.youtube.com/user/SomeUser', true],
            'handle url'       => ['https://www.youtube.com/@HandleName', true],
            'video url'        => ['https://www.youtube.com/watch?v=abc', false],
            'non-youtube'      => ['https://vimeo.com/channel/123', false],
            'empty string'     => ['', false],
        ];
    }

    // =========================================================================
    // is_instagram_feed
    // =========================================================================

    /**
     * @dataProvider instagramFeedProvider
     * @group helper-instagram
     */
    public function testIsInstagramFeed(string $url, bool $expected): void
    {
        $this->assertSame($expected, Helper::is_instagram_feed($url));
    }

    public static function instagramFeedProvider(): array
    {
        return [
            'profile url'            => ['https://www.instagram.com/username', true],
            'profile url trailing /' => ['https://www.instagram.com/username/', true],
            'profile no www'         => ['https://instagram.com/someuser', true],
            'post url /p/'           => ['https://www.instagram.com/p/ABC123/', false],
            'reel url /reel/'        => ['https://www.instagram.com/reel/ABC123/', false],
            'tv url /tv/'            => ['https://www.instagram.com/tv/ABC123/', false],
            'stories url'            => ['https://www.instagram.com/stories/user/', false],
            'non-instagram'          => ['https://twitter.com/user', false],
            'empty string'           => ['', false],
        ];
    }

    // =========================================================================
    // is_opensea
    // =========================================================================

    /**
     * @dataProvider openseaProvider
     * @group helper-opensea
     */
    public function testIsOpensea(string $url, bool $expected): void
    {
        $this->assertSame($expected, Helper::is_opensea($url));
    }

    public static function openseaProvider(): array
    {
        return [
            'opensea collection'   => ['https://opensea.io/collection/boredapes', true],
            'opensea asset'        => ['https://opensea.io/assets/ethereum/0xabc/1', true],
            'opensea subdomain'    => ['https://testnets.opensea.io/collection/foo', true],
            'non-opensea'          => ['https://rarible.com/collection/123', false],
            'empty string'         => ['', false],
        ];
    }

    // =========================================================================
    // is_file_url
    // =========================================================================

    /**
     * @dataProvider fileUrlProvider
     * @group helper-file
     */
    public function testIsFileUrl(string $url, bool $expected): void
    {
        $this->assertSame($expected, Helper::is_file_url($url));
    }

    public static function fileUrlProvider(): array
    {
        return [
            'pdf file'            => ['https://example.com/file.pdf', true],
            'doc with query'      => ['https://example.com/file.doc?v=1', true],
            'mp4 with hash'       => ['https://example.com/video.mp4#t=10', true],
            'no extension'        => ['https://example.com/page', false],
            'just domain'         => ['https://example.com', true],  // .com matches the extension pattern
            'trailing slash'      => ['https://example.com/', false],
        ];
    }

    // =========================================================================
    // format_number
    // =========================================================================

    /**
     * @dataProvider formatNumberProvider
     * @group helper-format
     */
    public function testFormatNumber($input, $expected): void
    {
        $this->assertSame($expected, Helper::format_number($input));
    }

    public static function formatNumberProvider(): array
    {
        return [
            'zero'                 => [0, 0],
            'small number'         => [999, 999],
            'exactly 1000'         => [1000, '1.0k'],
            '1500'                 => [1500, '1.5k'],
            '10000'                => [10000, '10.0k'],
            'exactly 1 million'    => [1000000, '1.0m'],
            '2.5 million'          => [2500000, '2.5m'],
            'exactly 1 billion'    => [1000000000, '1.0b'],
            '3.7 billion'          => [3700000000, '3.7b'],
        ];
    }

    // =========================================================================
    // trimTitle
    // =========================================================================

    /**
     * @dataProvider trimTitleProvider
     * @group helper-format
     */
    public function testTrimTitle(string $title, int $wordCount, string $expected): void
    {
        $this->assertSame($expected, Helper::trimTitle($title, $wordCount));
    }

    public static function trimTitleProvider(): array
    {
        return [
            'no trim needed'     => ['Hello World', 5, 'Hello World'],
            'exact word count'   => ['One Two Three', 3, 'One Two Three'],
            'trim to 2 words'    => ['One Two Three Four', 2, 'One Two ...'],
            'trim to 1 word'     => ['Hello Beautiful World', 1, 'Hello ...'],
            'single word'        => ['Hello', 1, 'Hello'],
            'empty string'       => ['', 5, ''],
        ];
    }

    // =========================================================================
    // parse_query
    // =========================================================================

    /**
     * @group helper-parse
     */
    public function testParseQueryBasic(): void
    {
        $result = Helper::parse_query('foo=bar&baz=qux');
        $this->assertSame('bar', $result['foo']);
        $this->assertSame('qux', $result['baz']);
    }

    /**
     * @group helper-parse
     */
    public function testParseQueryEmptyString(): void
    {
        $this->assertSame([], Helper::parse_query(''));
    }

    /**
     * @group helper-parse
     */
    public function testParseQueryUrlEncoded(): void
    {
        $result = Helper::parse_query('name=hello+world&key=a%26b');
        $this->assertSame('hello world', $result['name']);
        $this->assertSame('a&b', $result['key']);
    }

    /**
     * @group helper-parse
     */
    public function testParseQueryNoValue(): void
    {
        $result = Helper::parse_query('key_only');
        $this->assertArrayHasKey('key_only', $result);
        $this->assertNull($result['key_only']);
    }

    /**
     * @group helper-parse
     */
    public function testParseQueryDuplicateKeys(): void
    {
        $result = Helper::parse_query('color=red&color=blue');
        $this->assertIsArray($result['color']);
        $this->assertSame(['red', 'blue'], $result['color']);
    }

    /**
     * @group helper-parse
     */
    public function testParseQueryNoEncoding(): void
    {
        $result = Helper::parse_query('name=hello+world', false);
        // With no encoding, the + is NOT decoded to space
        $this->assertSame('hello+world', $result['name']);
    }

    // =========================================================================
    // get_file_title
    // =========================================================================

    /**
     * @group helper-file
     */
    public function testGetFileTitleReturnsString(): void
    {
        // With stubs, get_the_title returns '' and attachment_url_to_postid returns 0
        $result = Helper::get_file_title('https://example.com/file.pdf');
        $this->assertIsString($result);
    }

    // =========================================================================
    // getBooleanParam
    // =========================================================================

    /**
     * @dataProvider booleanParamProvider
     * @group helper-boolean
     */
    public function testGetBooleanParam($param, $default, bool $expected): void
    {
        $this->assertSame($expected, Helper::getBooleanParam($param, $default));
    }

    public static function booleanParamProvider(): array
    {
        return [
            'true bool'       => [true, false, true],
            'true string'     => ['true', false, true],
            'yes string'      => ['yes', false, true],
            'int 1'           => [1, false, true],
            'string 1'        => ['1', false, true],
            'false bool'      => [false, true, false],
            'false string'    => ['false', true, false],
            'no string'       => ['no', true, false],
            'int 0'           => [0, true, false],
            'string 0'        => ['0', true, false],
            'unknown default' => ['maybe', false, false],
            'unknown true'    => ['maybe', true, true],
            'null default'    => [null, false, false],
            'null true'       => [null, true, true],
        ];
    }

    // =========================================================================
    // removeQuote
    // =========================================================================

    /**
     * @group helper-sanitize
     */
    public function testRemoveQuoteStripsQuotes(): void
    {
        $attributes = [
            'title'   => '"Hello World"',
            'class'   => "'my-class'",
            'id'      => 'no-quotes',
        ];

        $result = Helper::removeQuote($attributes);

        $this->assertSame('Hello World', $result['title']);
        $this->assertSame('my-class', $result['class']);
        $this->assertSame('no-quotes', $result['id']);
    }

    /**
     * @group helper-sanitize
     */
    public function testRemoveQuoteFiltersOnEventHandlers(): void
    {
        $attributes = [
            'onclick'     => 'alert("xss")',
            'onmouseover' => 'doEvil()',
            'class'       => 'safe',
        ];

        $result = Helper::removeQuote($attributes);

        $this->assertArrayNotHasKey('onclick', $result);
        $this->assertArrayNotHasKey('onmouseover', $result);
        $this->assertArrayHasKey('class', $result);
    }

    /**
     * @group helper-sanitize
     */
    public function testRemoveQuotePreservesNonStringValues(): void
    {
        $attributes = [
            'width'  => 100,
            'active' => true,
        ];

        $result = Helper::removeQuote($attributes);

        $this->assertSame(100, $result['width']);
        $this->assertSame(true, $result['active']);
    }

    /**
     * @group helper-sanitize
     */
    public function testRemoveQuoteEmptyArray(): void
    {
        $this->assertSame([], Helper::removeQuote([]));
    }
}
