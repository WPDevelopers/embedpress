<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Twitch embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.5.0
 */
class Twitch extends ProviderAdapter implements ProviderInterface
{
    /**
     * The regex which identifies Twitch URLs.
     *
     * @since   1.5.0
     * @access  private
     *
     * @var     string
     */
    private $urlRegexPattern = '/http[s]?:\/\/(?:www\.|clips\.)twitch\.tv\/([0-9a-zA-Z\-\_]+)\/?(chat\/?$|[0-9a-z\-\_]*)?/';

    /**
     * Method that verifies if the embed URL belongs to Twitch.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.5.0
     *
     */
    public function validateUrl(Url $url)
    {
        return (bool) preg_match($this->urlRegexPattern, $this->url);
    }

    /**
     * Return the type of the embed based on the URL.
     *
     * @param $url
     *
     * @return string
     */
    protected function getType($url)
    {
        if (stristr($url, 'clips.twitch.tv')) {
            return 'clip';
        }

        if (stristr($url, '/videos/')) {
            return 'video';
        }

        if (preg_match('#/chat$#', $url)) {
            return 'chat';
        }

        return 'channel';
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
        $url         = $this->getUrl();
        $providerUrl = 'https://twitch.tv';
        $src         = '';

        if (preg_match("{$this->urlRegexPattern}i", $url, $matches)) {
            $channelName = $matches[1];

            $type = $this->getType($url);

            // Clip, channel, chat, collection, or video?
            switch ($type) {
                case 'clip':
                    $src   = 'https://clips.twitch.tv/embed?clip=' . $channelName . '&autoplay=false';
                    $attrs = 'scrolling="no" frameborder="0" allowfullscreen="true"';
                    break;

                case 'video':
                    $channelName = $matches[2];
                    $src         = 'https://player.twitch.tv/?video=' . $channelName;
                    $attrs       = 'scrolling="no" frameborder="0" allowfullscreen="true"';
                    break;

                case 'channel':
                    $src   = 'https://player.twitch.tv/?channel=' . $channelName;
                    $attrs = 'scrolling="no" frameborder="0" allowfullscreen="true"';
                    break;

                case 'chat':
                    $src   = 'http://www.twitch.tv/embed/' . $channelName . '/chat';
                    $attrs = 'scrolling="yes" frameborder="0" allowfullscreen="true" id="' . $channelName . '"';
                    break;
            }

            $width = isset( $this->config['maxwidth']) ? $this->config['maxwidth']: 800;
            $height = isset( $this->config['maxheight']) ? $this->config['maxheight']: 400;

            $pars_url = wp_parse_url(get_site_url());
            $src = !empty($pars_url['host'])?$src.'&parent='.$pars_url['host']:$src;
            $html = '<iframe src="' . $src . '" height="'.$height.'" width="'.$width.'" ' . $attrs . '></iframe>';

            $response = [
                'type'          => $type,
                'content_id'          => $channelName,
                'provider_name' => 'Twitch',
                'provider_url'  => $providerUrl,
                'url'           => $url,
                'html'          => $html,
            ];
        } else {
            $response = [];
        }

        return $response;
    }
    /** inline @inheritDoc */
    public function modifyResponse( array $response = [])
    {
        return $this->fakeResponse();
    }
}
