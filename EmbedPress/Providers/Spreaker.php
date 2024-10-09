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
            'theme' => $params['theme'] ?? 'light',
            'playlist' => $params['playlist'] == 1 ? 'true' : 'false',
            'playlist-continuous' => $params['playlistContinuous'] == 1 ? 'true' : 'false',
            'playlist-loop' => $params['playlistLoop'] == 1 ? 'true' : 'false',
            'playlist-autoupdate' => $params['playlistAutoupdate'] == 1 ? 'true' : 'false',
            'chapters-image' => $params['chaptersImage'] == 1 ? 'true' : 'false',
            'episode_image_position' => $params['episodeImagePosition'] ?? 'right',
            'hide-likes' => $params['hideLikes'] == 1 ? 'true' : 'false',
            'hide-comments' => $params['hideComments'] == 1 ? 'true' : 'false',
            'hide-sharing' => $params['hideSharing'] == 1 ? 'true' : 'false',
            'hide-logo' => $params['hideLogo'] == 1 ? 'true' : 'false',
            'hide-episode-description' => $params['hideEpisodeDescription'] == 1 ? 'true' : 'false',
            'hide-playlist-descriptions' => $params['hidePlaylistDescriptions'] == 1 ? 'true' : 'false',
            'hide-playlist-images' => $params['hidePlaylistImages'] == 1 ? 'true' : 'false',
            'hide-download' => $params['hideDownload'] == 1 ? 'true' : 'false',
        ];

        if (is_string($params['color']) && !empty($params['color'])) {
            $query_param['color'] = $params['color'];
        }
        if (is_string($params['coverImageUrl']) && !empty($params['coverImageUrl'])) {
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
