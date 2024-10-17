<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Spreaker embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Spreaker extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["spreaker.com"];
    /**
     * Method that verifies if the embed URL belongs to Spreaker.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */

    protected $allowedParams = [
        'maxwidth',
        'maxheight',
        'theme',
        'color',
        'coverImageUrl',
        'playlist',
        'playlistContinuous',
        'playlistLoop',
        'playlistAutoupdate',
        'chaptersImage',
        'episodeImagePosition',
        'hideLikes',
        'hideComments',
        'hideSharing',
        'hideLogo',
        'hideEpisodeDescription',
        'hidePlaylistDescriptions',
        'hidePlaylistImages',
        'hideDownload',
    ];

    protected $httpsSupport = true;

    public function getAllowedParams()
    {
        return $this->allowedParams;
    }

    public function validateUrl(Url $url)
    {

        return (bool) (preg_match('~spreaker\.com/show/([^/]+)~i', (string) $url) ||
            preg_match('~spreaker\.com/user/([^/]+)(/[^/]+)?~i', (string) $url) ||
            preg_match('~spreaker\.com/podcast/([^/]+)~i', (string) $url));
    }

    public function validateSpreaker($url)
    {
        return (bool) (preg_match('~spreaker\.com/show/([^/]+)~i', (string) $url) ||
            preg_match('~spreaker\.com/user/([^/]+)(/[^/]+)?~i', (string) $url) ||
            preg_match('~spreaker\.com/podcast/([^/]+)~i', (string) $url));
    }

    public function extractPodcastId($url)
    {
        preg_match("/(\d+)$/", $url, $matches);

        if (isset($matches[1])) {
            return $matches[1]; // Return the ID
        }

        return null;
    }



    /**
     * This method fakes an Oembed response.
     *
     * @since   1.0.0
     *
     * @return  array
     */

    public function getBooleanParam($param, $default = false)
    {
        return isset($param) && is_string($param) && ($param == 'true' || $param == 'yes') ? 'true' : ($default ? 'true' : 'false');
    }

    public function getStringParam($param, $default = '')
    {
        return isset($param) && is_string($param) ? $param : $default;
    }


    public function fakeResponse()
    {
        $src_url = urldecode($this->url);
        $params  = $this->getParams();

        // $params = http_build_query($params);

        // error_log(print_r('Params', true));
        error_log(print_r(gettype($params['playlist']), true));

        $query_param = [
            'theme' => $this->getStringParam($params['theme'], 'light'),
            'playlist' => $this->getBooleanParam($params['playlist']),
            'playlist-continuous' => $this->getBooleanParam($params['playlistContinuous']),
            'playlist-loop' => $this->getBooleanParam($params['playlistLoop']),
            'playlist-autoupdate' => $this->getBooleanParam($params['playlistAutoupdate']),
            'chapters-image' => $this->getBooleanParam($params['chaptersImage']),
            'episode_image_position' => $this->getStringParam($params['episodeImagePosition'], 'right'),
            'hide-likes' => $this->getBooleanParam($params['hideLikes']),
            'hide-comments' => $this->getBooleanParam($params['hideComments']),
            'hide-sharing' => $this->getBooleanParam($params['hideSharing']),
            'hide-logo' => $this->getBooleanParam($params['hideLogo']),
            'hide-episode-description' => $this->getBooleanParam($params['hideEpisodeDescription']),
            'hide-playlist-descriptions' => $this->getBooleanParam($params['hidePlaylistDescriptions']),
            'hide-playlist-images' => $this->getBooleanParam($params['hidePlaylistImages']),
            'hide-download' => $this->getBooleanParam($params['hideDownload']),
        ];


        if (!empty($params['color']) && is_string($params['color'])) {
            $query_param['color'] = $params['color'];
        }
        if (!empty($params['coverImageUrl']) && is_string($params['coverImageUrl'])) {
            $query_param['cover_image_url'] = $params['coverImageUrl'];
        }


        // error_log(print_r($query_param, true));

        $query_string = http_build_query($query_param);

        // Check if the url is already converted to the embed format  
        if ($this->validateSpreaker($src_url)) {
            $iframeSrc = 'https://widget.spreaker.com/player?show_id=' . $this->extractPodcastId($src_url) . '&' . $query_string;
        } else {
            return [];
        }
        error_log(print_r('Query Params', true));
        error_log(print_r($query_string, true));



        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 350;

        return [
            'type'          => 'rich',
            'provider_name' => 'Spreaker',
            'provider_url'  => 'https://spreaker.com',
            'title'         => 'Unknown title',
            'html'          => '<iframe title="This is title"  width="' . esc_attr($width) . '" height="' . esc_attr($height) . '" src="' . esc_url($iframeSrc) . '" ></iframe>',
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
