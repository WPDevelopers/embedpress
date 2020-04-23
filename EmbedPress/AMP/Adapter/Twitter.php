<?php

namespace EmbedPress\AMP\Adapter;


(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that represents the embed provider for AMP.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.4.0
 * @abstract
 */
class Twitter
{
    /**
     * @var object
     */
    private $ampEmbedHandler;

    /**
     * @var object
     */
    private $urlData;


    /**
     * @var string
     */
    private $parsedContent;

    /**
     * @var array
     */
    private $attributes;

    /**
     * The constructor.
     *
     * @param object $urlData
     */
    public function __construct($parsedContent, $urlData, $attributes)
    {
        if (class_exists('AMP_Twitter_Embed_Handler')) {
            $this->ampEmbedHandler = new \AMP_Twitter_Embed_Handler;

            add_action('amp_post_template_head', [$this, 'addScripts']);
        }

        $this->parsedContent = $parsedContent;
        $this->urlData       = $urlData;
        $this->attributes    = $attributes;
    }

    /**
     * Convert the HTML for AMP compatible tag.
     *
     * @return string
     */
    public function process()
    {
        // Check we have the adapter set
        if ( ! isset($this->ampEmbedHandler)) {
            return $this->parsedContent;
        }

        $attr = [
            'tweet' => $this->urlData->url,
        ];

        $parsedContent = $this->ampEmbedHandler->shortcode($attr);

        return $parsedContent;
    }

    /**
     * Add scripts to the output.
     */
    public function addScripts()
    {
        if ( ! defined('PPEMB_TWITTER_AMP_SCRIPT_LOADED')) {
            echo '<script async custom-element="amp-twitter" src="https://cdn.ampproject.org/v0/amp-twitter-0.1.js"></script>';

            define('PPEMB_TWITTER_AMP_SCRIPT_LOADED', 1);
        }
    }
}
