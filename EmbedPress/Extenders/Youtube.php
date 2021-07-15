<?php

namespace Embedpress\EmbedPress\Extenders;

use EmbedPress\Plugins\Plugin;
use Embedpress\Pro\Classes\Helper;

( defined( 'ABSPATH' ) && defined( 'EMBEDPRESS_IS_LOADED' ) ) or die( "No direct script access allowed." );

/**
 * Entity that represents an EmbedPress plugin dedicated to YouTube embeds.
 *
 * @package     EmbedPress-pro\YouTube
 * @author      EmbedPress<help@embedpress.com>
 * @copyright   Copyright (C) 2019 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 */
class Youtube extends Plugin
{
    /**
     * Plugin's base namespace.
     *
     * @since   1.0.0
     *
     * @const   NAMESPACE_STRING
     */
    const NAMESPACE_STRING = "\Embedpress\EmbedPress\Extenders\Youtube";
    
    /**
     * Plugin's name.
     *
     * @since   1.0.0
     *
     * @const   NAME
     */
    const NAME = "Youtube";
    
    /**
     * Plugin's slug.
     *
     * @since   1.0.0
     *
     * @const   SLUG
     */
    const SLUG = 'youtube';
    
    /**
     * Return the plugin options schema.
     *
     * @return  array
     * @since   1.0.0
     * @static
     *
     */
    public static function getOptionsSchema()
    {
	    return [
	        'autoplay'       => [
	            'type'        => 'bool',
	            'label'       => 'Auto Play',
	            'description' => 'Automatically start to play the videos when the player loads.',
	            'default'     => false
	        ],
	        'color'          => [
	            'type'        => 'string',
	            'label'       => 'Progress bar color',
	            'description' => 'Specifies the color that will be used in the player\'s video progress bar to highlight the amount of the video that the viewer has already seen.<br/>Note: Setting the color to <strong>white</strong> will disable the <strong>Modest Branding</strong> option (causing a YouTube logo to be displayed in the control bar).',
	            'options'     => [
	                'red'   => 'Red',
	                'white' => 'White'
	            ],
	            'default'     => 'red'
	        ],
	        'cc_load_policy' => [
	            'type'        => 'bool',
	            'label'       => 'Force Closed Captions',
	            'description' => 'Setting this option to <strong>Yes</strong> causes closed captions to be shown by default, even if the user has turned captions off. This will be based on user preference otherwise.',
	            'default'     => false
	        ],
	        'controls'       => [
	            'type'        => 'string',
	            'label'       => 'Display Controls',
	            'description' => 'Indicates whether the video player controls are displayed.',
	            'options'     => [
	                '1' => 'Display immediately',
	                '2' => 'Display after user initiation',
	                '0' => 'Hide controls',
	            ],
	            'default'     => '1'
	        ],
	        'fs'             => [
	            'type'        => 'bool',
	            'label'       => 'Enable Fullscreen button',
	            'description' => 'Indicates whether the fullscreen button is enabled.',
	            'default'     => true
	        ],
	        'iv_load_policy' => [
	            'type'        => 'radio',
	            'label'       => 'Display video annotations',
	            'description' => 'Indicates whether video annotations are displayed.',
	            'options'     => [
	                '1' => 'Display',
	                '3' => 'Do not display'
	            ],
	            'default'     => '1'
	        ],
	        'rel'            => [
	            'type'        => 'bool',
	            'label'       => 'Display related videos',
	            'description' => 'Indicates whether the player should show related videos when playback of the initial video ends.',
	            'default'     => true
	        ],
	        'modestbranding' => [
	            'type'        => 'string',
	            'label'       => 'Modest Branding',
	            'description' => 'Indicates whether the player should display a YouTube logo in the control bar.',
	            'options'     => [
	                '0' => 'Display',
	                '1' => 'Do not display'
	            ],
	            'default'     => '0'
	        ],
	        'logo_url' => [
		        'type'        => 'url',
		        'label'       => __('Custom Logo URL', 'embedpress-pro'),
		        'description' => __('You can show custom logo watermark on your video', 'embedpress-pro'),
	        ],
	        'logo_xpos' => [
		        'type'        => 'number',
		        'label'       => __( 'Logo X Position (%)', 'embedpress-pro' ),
		        'description' => __( 'Change this number to move your logo in horizontal direction.', 'embedpress-pro' ),
		        'default'     => 10
	        ],
	        'logo_ypos' => [
		        'type'        => 'number',
		        'label'       => __( 'Logo Y Position (%)', 'embedpress-pro' ),
		        'description' => __( 'Change this number to move your logo in vertical direction.', 'embedpress-pro' ),
		        'default'     => 10
	        ],
	        'cta_url' => [
		        'type'        => 'url',
		        'label'       => __( 'CTA link for Logo', 'embedpress-pro' ),
		        'description' => __( 'You can show the logo inside a link. Leave it empty to hide it', 'embedpress-pro' ),
	        ],
	    ];
    }
    
    /**
     * Method that register all EmbedPress events.
     *
     * @return  void
     * @since   1.0.0
     * @static
     *
     */
    public static function registerEvents()
    {
        
    }
    
    /**
     * Callback called right before an url be embedded. If return false, EmbedPress will not embed the url.
     *
     * @param stdclass    An object representing the embed.
     *
     * @return  mixed
     * @since   1.0.0
     * @static
     *
     */
    public static function onBeforeEmbed( $embed )
    {
        if ( empty( $embed ) ) {
            return false;
        }
        
        return $embed;
    }
    
    /**
     * Callback called right after a YouTube url has been embedded.
     *
     * @param stdclass    An object representing the embed.
     *
     * @return  array
     * @since   1.0.0
     * @static
     *
     */
    public static function onAfterEmbed( $embed )
    {
        $options = self::getOptions();
        $isYoutube = ( isset($embed->provider_name) && strtoupper( $embed->provider_name ) === 'YOUTUBE' ) || (isset( $embed->url) && isset( $embed->{$embed->url}) && isset( $embed->{$embed->url}['provider_name']) && strtoupper($embed->{$embed->url}['provider_name'] ) === 'YOUTUBE');

        if ( $isYoutube && isset( $embed->embed )
            && preg_match( '/src=\"(.+?)\"/', $embed->embed, $match ) ) {
	        // Parse the url to retrieve all its info like variables etc.
            $url_full = $match[ 1 ];
            $query = parse_url( $url_full, PHP_URL_QUERY );
            parse_str( $query, $params );
            
            // Handle `autoplay` option.
            if ( isset( $options[ 'autoplay' ] ) && (bool)$options[ 'autoplay' ] === true ) {
                $params[ 'autoplay' ] = 1;
            } else {
                unset( $params[ 'autoplay' ] );
            }
            
            // Handle `color` option.
            if ( !empty( $options[ 'color' ] ) ) {
                $params[ 'color' ] = $options[ 'color' ];
            } else {
                unset( $params[ 'color' ] );
            }
            
            // Handle `cc_load_policy` option.
            if ( isset( $options[ 'cc_load_policy' ] ) && (bool)$options[ 'cc_load_policy' ] === true ) {
                $params[ 'cc_load_policy' ] = 1;
            } else {
                unset( $params[ 'cc_load_policy' ] );
            }
            
            // Handle `controls` option.
            if ( isset( $options[ 'controls' ] ) && in_array( (int)$options[ 'controls' ], [0, 1, 2] ) ) {
                $params[ 'controls' ] = (int)$options[ 'controls' ];
            } else {
                unset( $params[ 'controls' ] );
            }
            
            // Handle `fs` option.
            if ( isset( $options[ 'fs' ] ) && in_array( (int)$options[ 'fs' ], [0, 1] ) ) {
                $params[ 'fs' ] = (int)$options[ 'fs' ];
            } else {
                unset( $params[ 'fs' ] );
            }
            
            // Handle `iv_load_policy` option.
            if ( isset( $options[ 'iv_load_policy' ] ) && in_array( (int)$options[ 'iv_load_policy' ], [1, 3] ) ) {
                $params[ 'iv_load_policy' ] = (int)$options[ 'iv_load_policy' ];
            } else {
                unset( $params[ 'iv_load_policy' ] );
            }
            
            // Handle `rel` option.
            if ( isset( $options[ 'rel' ] ) && in_array( (int)$options[ 'rel' ], [0, 1] ) ) {
                $params[ 'rel' ] = (int)$options[ 'rel' ];
            } else {
                unset( $params[ 'rel' ] );
            }
            
            // Handle `modestbranding` option.
            if ( isset( $options[ 'modestbranding' ] ) && (bool)$options[ 'modestbranding' ] === true ) {
                $params[ 'modestbranding' ] = 1;
            } else {
                unset( $params[ 'modestbranding' ] );
            }
            
            preg_match( '/(.+)?\?/', $url_full, $url );
            $url = $url[ 1 ];
            
            // Reassemble the url with the new variables.
            $url_modified = $url . '?';
            foreach ( $params as $paramName => $paramValue ) {
                $url_modified .= $paramName . '=' . $paramValue . '&';
            }

            // Replaces the old url with the new one.
            $embed->embed = str_replace( $url_full, rtrim( $url_modified, '&' ), $embed->embed );
	        $embed = Helper::apply_cta_markup_for_blockeditor( $embed, $options, 'youtube');

        }
        
        return $embed;
    }
    
    /**
     * Method to get params
     *
     * @since 1.0.0
     * @static
     */
    public static function getParams( $options )
    {
        $params = [];
        
        // Handle `autoplay` option.
        if ( isset( $options[ 'autoplay' ] ) && (bool)$options[ 'autoplay' ] === true ) {
            $params[ 'autoplay' ] = 1;
        } else {
            unset( $params[ 'autoplay' ] );
        }
        
        // Handle `color` option.
        if ( !empty( $options[ 'color' ] ) ) {
            $params[ 'color' ] = $options[ 'color' ];
        } else {
            unset( $params[ 'color' ] );
        }
        
        // Handle `cc_load_policy` option.
        if ( isset( $options[ 'cc_load_policy' ] ) && (bool)$options[ 'cc_load_policy' ] === true ) {
            $params[ 'cc_load_policy' ] = 1;
        } else {
            unset( $params[ 'cc_load_policy' ] );
        }
        
        // Handle `controls` option.
        if ( isset( $options[ 'controls' ] ) && in_array( (int)$options[ 'controls' ], [0, 1, 2] ) ) {
            $params[ 'controls' ] = (int)$options[ 'controls' ];
        } else {
            unset( $params[ 'controls' ] );
        }
        
        // Handle `fs` option.
        if ( isset( $options[ 'fs' ] ) && in_array( (int)$options[ 'fs' ], [0, 1] ) ) {
            $params[ 'fs' ] = (int)$options[ 'fs' ];
        } else {
            unset( $params[ 'fs' ] );
        }
        
        // Handle `iv_load_policy` option.
        if ( isset( $options[ 'iv_load_policy' ] ) && in_array( (int)$options[ 'iv_load_policy' ], [1, 3] ) ) {
            $params[ 'iv_load_policy' ] = (int)$options[ 'iv_load_policy' ];
        } else {
            unset( $params[ 'iv_load_policy' ] );
        }
        
        // Handle `rel` option.
        if ( isset( $options[ 'rel' ] ) && in_array( (int)$options[ 'rel' ], [0, 1] ) ) {
            $params[ 'rel' ] = (int)$options[ 'rel' ];
        } else {
            unset( $params[ 'rel' ] );
        }
        
        // Handle `modestbranding` option.
        if ( isset( $options[ 'modestbranding' ] ) && (bool)$options[ 'modestbranding' ] === true ) {
            $params[ 'modestbranding' ] = 1;
        } else {
            unset( $params[ 'modestbranding' ] );
        }
        return $params;
    }
    
    public static function featureExtend()
    {
        
        add_action( 'admin_init', [get_called_class(), 'onLoadAdminCallback'] );
	    add_filter( 'embedpress:onAfterEmbed', [get_called_class(), 'onAfterEmbed'], 90 );
	    add_filter( 'embedpress:onBeforeEmbed', [get_called_class(), 'onBeforeEmbed'] );
	    add_filter( 'embedpress_gutenberg_youtube_params', [get_called_class(), 'embedpress_youtube_params'], 90 );
	    add_filter( 'embedpress_youtube_params', [get_called_class(), 'embedpress_youtube_params'], 90 );
        add_filter( 'ep_youtube_settings_before_save', [get_called_class(), 'save_youtube_pro_setting']);
        add_action( 'after_embedpress_branding_save', [get_called_class(), 'save_custom_logo_settings']);
    }
    
    /**
     * Registers the `embedpress/youtube-block` block on server.
     *
     * @since  2.3.1
     */
    public static function embedpress_youtube_params( $youtube_params ) {
        $youtube_options = self::getOptions();
	    return self::getParams( $youtube_options );
    }

	public static function save_youtube_pro_setting( $settings ) {
		$settings['color'] = isset( $_POST['color']) ? sanitize_text_field( $_POST['color']) : 'red';
		$settings['cc_load_policy'] = isset( $_POST['cc_load_policy']) ? sanitize_text_field( $_POST['cc_load_policy']) : '';
		$settings['rel'] = isset( $_POST['rel']) ? sanitize_text_field( $_POST['rel']) : 1;
		$settings['modestbranding'] = isset( $_POST['modestbranding']) ? sanitize_text_field( $_POST['modestbranding']) : 0;
        return $settings;
	}

	public static function save_custom_logo_settings() {
        Helper::save_custom_logo_settings('youtube', 'yt');
	}

}
