<?php
namespace EmbedPress\Providers;

use Embera\Adapters\Service as EmberaService;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

class GoogleMaps extends EmberaService
{
    public function validateUrl()
    {
        return preg_match('~http[s]?:\/\/((?:www\.)?google\.com(\.[a-z]{2})?|(?:www\.)?maps\.google\.com(\.[a-z]{2})?)\/maps[/?][a-z0-9\/%,+\-_=!:@\.&*\$#?\']*~i', $this->url);
    }

    public function fakeResponse()
    {
        $iframeSrc = '';

        // Check if the url is already converted to the embed format
        if (preg_match('~(maps/embed|output=embed)~i', $this->url)) {
            $iframeSrc = $this->url;
        } else {
            // Extract coordinates and zoom from the url
            if (preg_match('~@(-?[0-9\.]+,-?[0-9\.]+).+,([0-9\.]+z)~i', $this->url, $matches)) {
                $iframeSrc = 'http://maps.google.com/maps?hl=en&ie=UTF8&ll=' . $matches[1] . '&spn=' . $matches[1] . '&t=m&z=' . round($matches[2]) . '&output=embed';
            } else {
                return array();
            }
        }

        return array(
            'type'          => 'rich',
            'provider_name' => 'Google Maps',
            'provider_url'  => 'http://maps.google.com',
            'title'         => 'Unknown title',
            'html'          => '<iframe width="600" height="450" src="' . $iframeSrc . '" frameborder="0"></iframe>',
        );
    }
}