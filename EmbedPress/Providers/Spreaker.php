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


    public function fakeResponse()
    {
        $src_url = urldecode($this->url);
        $params  = $this->getParams();

        $query_param  = [
            'theme' => isset($params['theme']) ? $params['theme'] : 'light',
            'playlist' => isset($params['playlist']) && ($params['playlist'] == 1 || $params['playlist'] == 'yes') ? 'true' : 'false',
            'playlist-continuous' => isset($params['playlistContinuous']) && ($params['playlistContinuous'] == 1 || $params['playlistContinuous'] == 'yes') ? 'true' : 'false',
            'playlist-loop' => isset($params['playlistLoop']) && ($params['playlistLoop'] == 1 || $params['playlistLoop'] == 'yes') ? 'true' : 'false',
            'playlist-autoupdate' => isset($params['playlistAutoupdate']) && ($params['playlistAutoupdate'] == 1 || $params['playlistAutoupdate'] == 'yes') ? 'true' : 'false',
            'chapters-image' => isset($params['chaptersImage']) && ($params['chaptersImage'] == 1 || $params['chaptersImage'] == 'yes') ? 'true' : 'false',
            'episode_image_position' => isset($params['episodeImagePosition']) ? $params['episodeImagePosition'] : 'right',
            'hide-likes' => isset($params['hideLikes']) && ($params['hideLikes'] == 1 || $params['hideLikes'] == 'yes') ? 'true' : 'false',
            'hide-comments' => isset($params['hideComments']) && ($params['hideComments'] == 1 || $params['hideComments'] == 'yes') ? 'true' : 'false',
            'hide-sharing' => isset($params['hideSharing']) && ($params['hideSharing'] == 1 || $params['hideSharing'] == 'yes') ? 'true' : 'false',
            'hide-logo' => isset($params['hideLogo']) && ($params['hideLogo'] == 1 || $params['hideLogo'] == 'yes') ? 'true' : 'false',
            'hide-episode-description' => isset($params['hideEpisodeDescription']) && ($params['hideEpisodeDescription'] == 1 || $params['hideEpisodeDescription'] == 'yes') ? 'true' : 'false',
            'hide-playlist-descriptions' => isset($params['hidePlaylistDescriptions']) && ($params['hidePlaylistDescriptions'] == 1 || $params['hidePlaylistDescriptions'] == 'yes') ? 'true' : 'false',
            'hide-playlist-images' => isset($params['hidePlaylistImages']) && ($params['hidePlaylistImages'] == 1 || $params['hidePlaylistImages'] == 'yes') ? 'true' : 'false',
            'hide-download' => isset($params['hideDownload']) && ($params['hideDownload'] == 1 || $params['hideDownload'] == 'yes') ? 'true' : 'false',
        ];


        if (!empty($params['color']) && is_string($params['color'])) {
            $query_param['color'] = $params['color'];
        }
        if (!empty($params['coverImageUrl']) && is_string($params['coverImageUrl'])) {
            $query_param['cover_image_url'] = $params['coverImageUrl'];
        }


        error_log(print_r($params, true));

        $query_string = http_build_query($query_param);

        // Check if the url is already converted to the embed format  
        if ($this->validateSpreaker($src_url)) {
            $iframeSrc = 'https://widget.spreaker.com/player?show_id=' . $this->extractPodcastId($src_url) . '&' . $query_string;
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
