<?php

/**
 * GettyImages.php
 *
 * @package Embera
 * @author Michael Pratt <yo@michael-pratt.com>
 * @link   http://www.michael-pratt.com/
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");
/**
 * GettyImages Provider
 * Encuentra la imagen libre de derechos perfecta para tu próximo proyecto en el mejor catálogo ...
 *
 * @link https://gettyimages.com
 * @see https://developers.gettyimages.com/api/oembed/
 */
class GettyImages extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected $endpoint = 'https://embed.gettyimages.com/oembed?format=json&caller=embera';

    /** inline {@inheritdoc} */
    protected static $hosts = [
        'gty.im',
        '*.gettyimages.com',
        '*.gettyimages.com.mx',
        '*.gettyimages.com.au',
        '*.gettyimages.com.be',
        '*.gettyimages.com.br',
        '*.gettyimages.com.ca',
        '*.gettyimages.com.de',
        '*.gettyimages.es',
        '*.gettyimages.fr',
        '*.gettyimages.in',
        '*.gettyimages.ie',
        '*.gettyimages.it',
        '*.gettyimages.nl',
        '*.gettyimages.no',
        '*.gettyimages.co.nz',
        '*.gettyimages.at',
        '*.gettyimages.pt',
        '*.gettyimages.ch',
        '*.gettyimages.fi',
        '*.gettyimages.se',
        '*.gettyimages.ae',
        '*.gettyimages.co.uk',
        '*.gettyimages.hk',
        '*.gettyimages.co.jp'
    ];

    /** inline {@inheritdoc} */
    protected $allowedParams = ['maxwidth', 'maxheight', 'caller', 'caption', 'tld'];

    /** inline {@inheritdoc} */
    protected $httpsSupport = false;

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url)
    {
        return (bool) (preg_match('~gty\.im/([^/]+)$~i', (string) $url));
    }

    /** inline {@inheritdoc} */
    public function normalizeUrl(Url $url)
    {
        $url->removeQueryString();

        if (preg_match('~/detail/(?:(?:[^/]+)/(?:[^/]+)/)?([^/]+)$~i', (string) $url, $matches)) {
            $url->overwrite('https://gty.im/' . $matches['1']);
        }

        $url->removeLastSlash();
        $url->convertToHttps();
        $url->removeWWW();

        return $url;
    }

    /**
     * This method fakes an Oembed response.
     *
     * @since   1.5.0
     *
     * @return  array
     */
    public function fakeResponse()
    {

        $shortUrl = $this->getUrl();

        // Build the Getty oEmbed endpoint
        $endpoint = "https://embed.gettyimages.com/oembed?format=json&caller=embera&url=" . urlencode($shortUrl);

        // Fetch the data
        $responseJson = @file_get_contents($endpoint);

        if (!$responseJson) {
            return [];
        }

        $data = json_decode($responseJson, true);
        if (!$data) {
            return [];
        }

        $response = [];


        $width = $data['thumbnail_width'] ?? 640;
        $height = $data['thumbnail_height'] ?? 480;

        // Optional: modify HTML for your needs
        if (isset($data['html']) && isset($data['thumbnail_url'])) {


            $response = [
                'type'          => 'image',
                'provider_name' => 'GettyImages',
                'provider_url'  => 'https://gettyimages.com',
                'url'           => $this->getUrl(),
                'html'          => $data['html'],
            ];
        } 
        

        return $response;
    }


    /** inline {@inheritdoc} */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
