<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Calendly embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Calendly extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["calendly.com"];
    /**
     * Method that verifies if the embed URL belongs to Calendly.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */

      /** inline {@inheritdoc} */
    /** @var array Array with allowed params for the current Provider */
    protected $allowedParams = [
        'cEmbedType',
        'hideCookieBanner',
        'hideEventTypeDetails',
        'cBackgroundColor',
        'cTextColor',
        'cButtonLinkColor',
        'cPopupButtonText',
        'cPopupButtonBGColor',
        'cPopupButtonTextColor',
        'cPopupLinkText'
    ];


    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    public function getAllowedParams(){
        return $this->allowedParams;
    }

    public function validateUrl(Url $url)
    {
        return  (bool) preg_match(
            "/^https:\/\/calendly\.com\/[a-zA-Z0-9_-]+\/.*/",
            (string) $url
        );
    }

    public function validateCalendly($url)
    {
        return  (bool) preg_match(
            "/^https:\/\/calendly\.com\/[a-zA-Z0-9_-]+\/.*/",
            (string) $url
        );
    }

    /**
     * This method fakes an Oembed response.
     *
     * @since   1.0.0
     *
     * @return  array
     */
    public function fakeResponse()
    {

        $params = $this->getParams();

        // $hideCookieBanner = 0;
        // $hideEventTypeDetails = 0;
        // $cBackgroundColor = '';
        // $cTextColor = '';

        $parameters = array();

        if (!empty($params['hideCookieBanner']) && $params['hideCookieBanner'] !== 'false') {
            $parameters['hide_gdpr_banner'] = 1;
        }

        if (!empty($params['hideEventTypeDetails']) && $params['hideEventTypeDetails'] !== 'false') {
            $parameters['hide_event_type_details'] = 1;
        }

        if (!empty($params['cBackgroundColor']) && $params['cBackgroundColor'] !== 'false') {
            $parameters['background_color'] = ltrim($params['cBackgroundColor'], '#');
        }

        if (!empty($params['cTextColor']) && $params['cTextColor'] !== 'false') {
            $parameters['text_color'] = ltrim($params['cTextColor'], '#');
        }
        
        $query_string = http_build_query($parameters);

        $src_url = $this->url.'?'.$query_string;

        // Array
        // (
        //     [cEmbedType] => popup_button
        //     [hideCookieBanner] => false
        //     [hideEventTypeDetails] => false
        //     [cBackgroundColor] => 643cd5
        //     [cTextColor] => 2cff2c
        //     [cButtonLinkColor] => 0069FF
        //     [cPopupButtonText] => My schedule
        //     [cPopupButtonBGColor] => 0069FF
        //     [cPopupButtonTextColor] => FFFFFF
        //     [cPopupLinkText] => Schedule time with me
        //     [url] => https://calendly.com/akash-mia/dailly-stand-up-meeting
        // )


        $cButtonLinkColor = !empty($params['cButtonLinkColor']) ? $params['cButtonLinkColor'] : '';
        $cPopupButtonText = !empty($params['cPopupButtonText']) ? $params['cPopupButtonText'] : '';
        $cPopupButtonBGColor = !empty($params['cPopupButtonBGColor']) ? $params['cPopupButtonBGColor'] : '';

        $cPopupButtonTextColor = !empty($params['cPopupButtonTextColor']) ? $params['cPopupButtonTextColor'] : '';

        $cPopupLinkText = !empty($params['cPopupLinkText']) ? $params['cPopupLinkText'] : '';

        
        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 350;
        
        // Check if the url is already converted to the embed format  
        if ($this->validateCalendly($src_url)) {
            if($params['cEmbedType'] == 'inline'){
                $html =    '<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
                <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
                <div class="calendly-inline-widget" data-url="'.esc_url($src_url).'" style="min-width:'. $width.'px;height:'.$height.'px;"></div>';
            }
            else if($params['cEmbedType'] == 'popup_button'){
                $html = '<!-- Calendly badge widget begin -->
                <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
                <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
                
                <script type="text/javascript">window.onload = function() { Calendly.initBadgeWidget({ url: "'.esc_url($src_url).'", text: "'.esc_attr( $cPopupButtonText ).'", color: "'.esc_attr( $cPopupButtonBGColor ).'", textColor: "'.esc_attr( $cPopupButtonTextColor ).'", branding: undefined }); }</script>';
            }
            else{
                $html = '
                <!-- Calendly link widget begin -->
                <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
                <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
                <a href="/#" onclick="Calendly.initPopupWidget({url: \'' . esc_url($src_url) . '\'}); return false;">Schedule time with me</a>';

            }
            
        } else {
            $html = '';
        }


        return [
            'type'          => 'rich',
            'provider_name' => 'Calendly',
            'provider_url'  => 'https://calendly.com',
            'title'         => 'Unknown title',
            'html'          => $html,
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
