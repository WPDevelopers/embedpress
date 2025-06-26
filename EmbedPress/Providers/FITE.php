<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Canva embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class FITE extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected $endpoint = 'https://www.fite.tv/oembed?format=json';

    /** inline {@inheritdoc} */
    protected static $hosts = [
        'fite.tv',
        'triller.tv',
        'trillertv.com'
    ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url)
    {
        return (bool) (preg_match('~(trillertv|triller|fite)\.(tv|com)/watch/(?:[^/]+)/([^/]+)/?~i', (string) $url));
    }

    /** inline {@inheritdoc} */
    public function normalizeUrl(Url $url)
    {
        $url->convertToHttps();
        $url->removeQueryString();

        return $url;
    }

    /** inline {@inheritdoc} */
    public function getFakeResponse()
    {
        preg_match('~(trillertv|triller|fite)\.(tv|com)/watch/(?:[^/]+)/([^/]+)/?~i', (string) $this->url, $matches);

        $html = '<div style="height: 270px; width: 480px;" data-id="' . $matches['1'] . '" class="kdv-embed" data-type="v" data-ap="true"></div> <script src="https://www.fite.tv/embed.1.js"></script';

        return [
            'type' => 'video',
            'provider_name' => 'FITE',
            'provider_url' => 'https://fite.tv',
            'title' => 'Unknown title',
            'html' => $html,
        ];
    }
}
