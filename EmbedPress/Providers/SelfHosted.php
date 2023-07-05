<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support SelfHosted embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */

class SelfHosted extends ProviderAdapter implements ProviderInterface
{

    public function __construct($url, array $config = []){
        parent::__construct($url, $config);
        $hosts_url = parse_url($url);
        $this->addHost($hosts_url['host']);
    }

    /** inline {@inheritdoc} */


    /**
     * Method that verifies if the embed URL belongs to SelfHosted.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return  (bool) preg_match(
            '/^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i',
            (string) $url
        );
    }

    public function validateSelfHostedVideo($url)
    {
        return  (bool) preg_match(
            '/\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|mpg)$/i',
            (string) $url
        );
    }
    
    public function validateSelfHostedAudio($url)
    {
        return  (bool) preg_match(
            '/\.(mp3|wav|ogg|aac)$/i',
            (string) $url
        );
    }

    public function validateWrapper($url)
    {
        return  (bool) preg_match(
            '/^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i',
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
        $src_url = urldecode($this->url);
        

        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;

        $provider_name = 'Self Hosterd';

        
        // Check if the url is already converted to the embed format  
        $html = '';
        if ($this->validateSelfHostedVideo($this->url)) {
            
            $html ='<video controls width="'.esc_attr($width).'" height="'.esc_attr($height).'"> <source src="'.esc_url($this->url).'" > </video>';
        } 
        else if ($this->validateSelfHostedAudio($this->url)) {
            $html = '<audio controls> <source src="'.esc_url($this->url).'" ></audio>';
        }
        else if ($this->validateWrapper($this->url)) {
            $provider_name = 'Wrapper';

            $html = '<iframe width="'.esc_attr($width).'" height="'.esc_attr($height).'" src="'.esc_url($src_url).'" > </iframe>';
        }
        else {
            return [];
        }
        
        return [
            'type'          => 'rich',
            'provider_name' => $provider_name,
            'provider_url'  => site_url(),
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
