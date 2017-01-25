<?php
namespace EmbedPress\Providers;

use \Embera\Adapters\Service as EmberaService;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support Twitch.tv embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       @todo
 */
class Twitch extends EmberaService
{
    /**
     * The regex which identifies Twitch.tv urls.
     *
     * @since   @todo
     * @access  private
     *
     * @var     string
     */
    private $urlRegexPattern = '~http[s]?:\/\/(?:www\.)twitch\.tv\/([a-zA-Z\-\_]+)\/?(chat\/?$)?~';

    /**
     * Method that verifies if the embed URL belongs to Twitch.
     *
     * @since   @todo
     *
     * @return  boolean
     */
    public function validateUrl()
    {
        return preg_match($this->urlRegexPattern, $this->url);
    }

    /**
     * This method fakes an Oembed response.
     *
     * @since   @todo
     *
     * @return  array
     */
    public function fakeResponse()
    {
        $url = $this->getUrl();

        if (preg_match("{$this->urlRegexPattern}i", $url, $matches)) {
            $channelName = $matches[1];
            $renderChatInsteadOfStream = (count($matches) > 2 && strtolower($matches[2]) === "chat");

            $html = '<iframe src="https://www.twitch.tv/'. $channelName .'/'. ($renderChatInsteadOfStream ? 'chat' : 'embed' ) .'" height="{height}" width="{width}" scrolling="no" frameborder="0" title="" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

            $response = array(
                'type'          => ($renderChatInsteadOfStream ? 'rich' : 'video'),
                'provider_name' => 'Twitch',
                'provider_url'  => 'https://www.twitch.tv',
                'url'           => $url,
                'html'          => $html
            );
        } else {
            $response = array();
        }

        return $response;
    }
}
