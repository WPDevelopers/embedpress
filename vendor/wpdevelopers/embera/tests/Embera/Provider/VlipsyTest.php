<?php
/**
 * VlipsyTest.php
 *
 * @package Embera
 * @author Michael Pratt <yo@michael-pratt.com>
 * @link   http://www.michael-pratt.com/
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Embera\Provider;

use Embera\ProviderTester;

/**
 * Test the Vlipsy Provider
 */
final class VlipsyTest extends ProviderTester
{
    protected $tasks = [
        'valid_urls' => [
            'https://vlipsy.com/vlip/star-trek-cant-unsee-ls1h2J6a',
        ],
        'invalid_urls' => [
            'https://vlipsy.com/',
        ],
        'fake_response' => [
            'type' => 'video',
            'html' => '<iframe'
        ]
    ];

    public function testProvider()
    {
        $this->validateProvider('Vlipsy', [ 'width' => 480, 'height' => 270]);
    }
}
