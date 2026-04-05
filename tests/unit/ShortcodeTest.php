<?php
/**
 * Unit tests for EmbedPress\Shortcode static/pure methods.
 *
 * @package EmbedPress
 * @group   shortcode
 */

namespace EmbedPress\Tests\Unit;

use EmbedPress\Shortcode;
use PHPUnit\Framework\TestCase;

/**
 * @group shortcode
 */
class ShortcodeTest extends TestCase
{
    // =========================================================================
    // getUnit
    // =========================================================================

    /**
     * Test getUnit returns empty string when value already contains a unit,
     * and returns 'px' when the value is purely numeric.
     *
     * @dataProvider getUnitProvider
     * @group shortcode-unit
     */
    public function testGetUnit(string $value, string $expected): void
    {
        $this->assertSame($expected, Shortcode::getUnit($value));
    }

    /**
     * Data provider for getUnit.
     *
     * The method checks if the value ends with letters or %.
     * If it does, returns '' (unit already present).
     * If it does not, returns 'px'.
     */
    public static function getUnitProvider(): array
    {
        return [
            'plain number'      => ['200', 'px'],
            'px unit'           => ['100px', ''],
            'percent unit'      => ['50%', ''],
            'em unit'           => ['2em', ''],
            'rem unit'          => ['1.5rem', ''],
            'auto'              => ['auto', ''],
            'vh unit'           => ['100vh', ''],
            'vw unit'           => ['50vw', ''],
            'zero'              => ['0', 'px'],
        ];
    }

    // =========================================================================
    // valueIsFalse
    // =========================================================================

    /**
     * Test that known falsy strings return true.
     *
     * @dataProvider valueFalseProvider
     * @group shortcode-boolean
     */
    public function testValueIsFalse($input, bool $expected): void
    {
        $this->assertSame($expected, Shortcode::valueIsFalse($input));
    }

    /**
     * Data provider for valueIsFalse.
     *
     * The method casts to string, lowercases, trims, then matches
     * against: "0", "false", "off", "no", "n", "nil", "null".
     */
    public static function valueFalseProvider(): array
    {
        return [
            'string false'        => ['false', true],
            'string FALSE'        => ['FALSE', true],
            'string False'        => ['False', true],
            'string 0'            => ['0', true],
            'string off'          => ['off', true],
            'string no'           => ['no', true],
            'string n'            => ['n', true],
            'string nil'          => ['nil', true],
            'string null'         => ['null', true],
            'string with spaces'  => [' false ', true],
            'int 0'               => [0, true],
            'string true'         => ['true', false],
            'string 1'            => ['1', false],
            'string yes'          => ['yes', false],
            'string on'           => ['on', false],
            'empty string'        => ['', false],
            'random string'       => ['hello', false],
        ];
    }

    // =========================================================================
    // is_problematic_provider
    // =========================================================================

    /**
     * Test that known problematic provider URLs are detected.
     *
     * The method checks against a list returned by get_problematic_providers(),
     * which (via apply_filters stub) returns ['commaful.com', 'flourish.studio'].
     *
     * @dataProvider problematicProviderProvider
     * @group shortcode-provider
     */
    public function testIsProblematicProvider(string $url, bool $expected): void
    {
        $this->assertSame($expected, Shortcode::is_problematic_provider($url));
    }

    public static function problematicProviderProvider(): array
    {
        return [
            'commaful url'       => ['https://commaful.com/play/story/123', true],
            'flourish url'       => ['https://flourish.studio/visualisation/123', true],
            'commaful subdomain' => ['https://www.commaful.com/play/test', true],
            'youtube url'        => ['https://www.youtube.com/watch?v=abc', false],
            'vimeo url'          => ['https://vimeo.com/123456', false],
            'empty string'       => ['', false],
            'generic url'        => ['https://example.com', false],
        ];
    }
}
