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
            preg_match('~spreaker\.com/podcast/([^/]+)~i', (string) $url) ||
            preg_match('~spreaker\.com/episode/([^/]+)(?:/.*)?~i', (string) $url));
    }

    public function validateSpreaker($url)
    {
        return (bool) (preg_match('~spreaker\.com/show/([^/]+)~i', (string) $url) ||
            preg_match('~spreaker\.com/user/([^/]+)(/[^/]+)?~i', (string) $url) ||
            preg_match('~spreaker\.com/podcast/([^/]+)~i', (string) $url) ||
            preg_match('~spreaker\.com/episode/([^/]+)(?:/.*)?~i', (string) $url));
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

        $query_param = [
            'theme' => isset($params['theme']) ? $this->getStringParam($params['theme'], 'light') : 'light',
            'chapters-image' => isset($params['chaptersImage']) ? $this->getBooleanParam($params['chaptersImage']) : false,
            'episode_image_position' => isset($params['episodeImagePosition']) ? $this->getStringParam($params['episodeImagePosition'], 'right') : 'right',
            'hide-likes' => isset($params['hideLikes']) ? $this->getBooleanParam($params['hideLikes']) : false,
            'hide-comments' => isset($params['hideComments']) ? $this->getBooleanParam($params['hideComments']) : false,
            'hide-sharing' => isset($params['hideSharing']) ? $this->getBooleanParam($params['hideSharing']) : false,
            'hide-logo' => isset($params['hideLogo']) ? $this->getBooleanParam($params['hideLogo']) : false,
            'hide-episode-description' => isset($params['hideEpisodeDescription']) ? $this->getBooleanParam($params['hideEpisodeDescription']) : false,
            'hide-download' => isset($params['hideDownload']) ? $this->getBooleanParam($params['hideDownload']) : false,
        ];

        if (strpos($src_url, 'spreaker.com/podcast/') !== false) {
            $query_param['playlist'] = isset($params['playlist']) ? $this->getBooleanParam($params['playlist']) : false;
            $query_param['playlist-continuous'] = isset($params['playlistContinuous']) ? $this->getBooleanParam($params['playlistContinuous']) : false;
            $query_param['playlist-loop'] = isset($params['playlistLoop']) ? $this->getBooleanParam($params['playlistLoop']) : false;
            $query_param['playlist-autoupdate'] = isset($params['playlistAutoupdate']) ? $this->getBooleanParam($params['playlistAutoupdate']) : false;
            $query_param['hide-playlist-descriptions'] = isset($params['hidePlaylistDescriptions']) ? $this->getBooleanParam($params['hidePlaylistDescriptions']) : false;
            $query_param['hide-playlist-images'] = isset($params['hidePlaylistImages']) ? $this->getBooleanParam($params['hidePlaylistImages']) : false;
        }

        if (!empty($params['color']) && is_string($params['color'])) {
            $query_param['color'] = $params['color'];
        }
        if (!empty($params['coverImageUrl']) && is_string($params['coverImageUrl'])) {
            $query_param['cover_image_url'] = $params['coverImageUrl'];
        }

        $query_string = http_build_query($query_param);

        // Check if the url is already converted to the embed format  
        if ($this->validateSpreaker($src_url) && strpos($src_url, 'spreaker.com/podcast/')) {
            $iframeSrc = 'https://widget.spreaker.com/player?show_id=' . $this->extractPodcastId($src_url) . '&' . $query_string;
        } else if ($this->validateSpreaker($src_url) && strpos($src_url, 'spreaker.com/episode/')) {
            $iframeSrc = 'https://widget.spreaker.com/player?episode_id=' . $this->extractPodcastId($src_url) . '&' . $query_string;
        } else {
            return [];
        }

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
