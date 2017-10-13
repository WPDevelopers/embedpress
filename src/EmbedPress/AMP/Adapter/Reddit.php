<?php
namespace EmbedPress\AMP\Adapter;


(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that represents the embed provider for AMP.
 *
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2017 PressShack. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.4.0
 * @abstract
 */
class Reddit
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
     * The constructor.
     *
     * @param object  $urlData
     */
    public function __construct($parsedContent, $urlData)
    {
        add_action( 'amp_post_template_head', [$this, 'addScripts']);
        
        $this->parsedContent = $parsedContent;
        $this->urlData       = $urlData;
    }

    /**
     * Convert the HTML for AMP compatible tag.
     *
     * @return string
     */
    public function process()
    {
        // Check we have the required class
        if (! class_exists('AMP_HTML_Utils')) {
            return $this->parsedContent;
        }


        $parsedContent = \AMP_HTML_Utils::build_tag(
            'amp-reddit',
            array(
                'data-src'       => $this->urlData->originalContent,
                'layout'         => 'responsive',
                'data-embedtype' => "post",
                'width'          => "100",
                'height'         => "100",
            )
        );

        return $parsedContent;
    }

    /**
     * Add scripts to the output.
     */
    public function addScripts()
    {
        if ( ! defined( 'PPEMB_REDDIT_AMP_SCRIPT_LOADED' ) ) {
            echo '<script async custom-element="amp-reddit" src="https://cdn.ampproject.org/v0/amp-reddit-0.1.js"></script>';

            define( 'PPEMB_REDDIT_AMP_SCRIPT_LOADED', 1 );
        }
    }
}
