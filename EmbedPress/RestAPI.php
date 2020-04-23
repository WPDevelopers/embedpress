<?php

namespace EmbedPress;

use WP_Error as WP_ErrorAlias;
use WP_REST_Response;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible for maintaining and registering all hooks that power the plugin.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class RestAPI
{
    /**
     * @param  WP_REST_Request  $request
     *
     * @return WP_REST_Response
     */
    public static function oembed($request)
    {
        $url = sanitize_url($request->get_param('url'));

        if (empty($url)) {
            return new WP_ErrorAlias('embedpress_invalid_url', 'Invalid Embed URL', ['status' => 404]);
        }

        $config = [];
        $embera = new \Embera\Embera($config);

        $additionalServiceProviders = Core::getAdditionalServiceProviders();
        if ( ! empty($additionalServiceProviders)) {
            foreach ($additionalServiceProviders as $serviceProviderClassName => $serviceProviderUrls) {
                Shortcode::addServiceProvider($serviceProviderClassName, $serviceProviderUrls, $embera);
            }
        }

        $urlInfo = $embera->getUrlInfo($url);
        if (isset($urlInfo[$url])) {
            $urlInfo                     = (object)$urlInfo[$url];
            $response['canBeResponsive'] = Core::canServiceProviderBeResponsive($urlInfo->provider_alias);
        }

        if (empty($urlInfo)) {
            return new WP_ErrorAlias('embedpress_invalid_url', 'Invalid Embed URL', ['status' => 404]);
        }

        return new WP_REST_Response($urlInfo, 202);
    }
}
