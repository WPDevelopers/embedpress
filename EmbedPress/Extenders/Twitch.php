<?php

namespace Embedpress\EmbedPress\Extenders;

use EmbedPress\Plugins\Plugin;
use Embedpress\Pro\Classes\Helper;

( defined( 'ABSPATH' ) && defined( 'EMBEDPRESS_IS_LOADED' ) ) or die( "No direct script access allowed." );

/**
 * Entity that represents an EmbedPress plugin dedicated to YouTube embeds.
 * @package     EmbedPress-pro\YouTube
 * @author      EmbedPress<help@embedpress.com>
 * @copyright   Copyright (C) 2019 EmbedPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0.0
 */
class Twitch extends Plugin {
	/**
	 * Plugin's base namespace.
	 * @since   1.0.0
	 * @const   NAMESPACE_STRING
	 */
	const NAMESPACE_STRING = "\Embedpress\EmbedPress\Extenders\Twitch";

	/**
	 * Plugin's name.
	 * @since   1.0.0
	 * @const   NAME
	 */
	const NAME = "Twitch";

	/**
	 * Plugin's slug.
	 * @since   1.0.0
	 * @const   SLUG
	 */
	const SLUG = 'twitch';

	/**
	 * Return the plugin options schema.
	 * @return  array
	 * @since   1.0.0
	 * @static
	 */
	public static function getOptionsSchema() {
		$schema = [
			'embedpress_pro_video_start_time' => [
				'type'        => 'number',
				'label'       => __( 'Start Time (in Seconds)', 'embedpress-pro' ),
				'description' => __( 'You can put a custom time in seconds to start the video from. Example: 500', 'embedpress-pro' ),
				'default'     => 0,
			],
			'embedpress_pro_twitch_autoplay'  => [
				'type'        => 'string',
				'label'       => __( 'Auto Play', 'embedpress-pro' ),
				'description' => __( 'Automatically start to play the videos when the player loads.', 'embedpress-pro' ),
				'options'     => [
					'yes' => __( 'Yes', 'embedpress-pro' ),
					'no'  => __( 'No', 'embedpress-pro' ),
				],
				'default'     => 'no',
			],
			'embedpress_pro_twitch_chat'      => [
				'type'        => 'string',
				'label'       => __( 'Show chat', 'embedpress-pro' ),
				'description' => __( 'You can show or hide chat using this settings' ),
				'options'     => [
					'yes' => __( 'Yes', 'embedpress-pro' ),
					'no'  => __( 'No', 'embedpress-pro' ),
				],
				'default'     => 'no',
			],

			'embedpress_pro_twitch_theme' => [
				'type'        => 'string',
				'label'       => __( 'Theme', 'embedpress-pro' ),
				'description' => __( 'Set dark or light theme for the twitch comment', 'embedpress-pro' ),
				'options'     => [
					'dark'  => __( 'Dark', 'embedpress-pro' ),
					'light' => __( 'Light', 'embedpress-pro' ),
				],
				'default'     => 'dark',
			],
			'embedpress_pro_fs'           => [
				'type'        => 'string',
				'label'       => 'Enable Fullscreen button',
				'description' => __( 'Indicates whether the fullscreen button is enabled.', 'embedpress-pro' ),
				'options'     => [
					'yes' => __( 'Yes', 'embedpress-pro' ),
					'no'  => __( 'No', 'embedpress-pro' ),
				],
				'default'     => 'yes',
			],
			'embedpress_pro_twitch_mute'  => [
				'type'        => 'string',
				'label'       => __( 'Mute on start', 'embedpress-pro' ),
				'description' => __( 'Set it to Yes to mute the video on start.', 'embedpress-pro' ),
				'options'     => [
					'yes' => __( 'Yes', 'embedpress-pro' ),
					'no'  => __( 'No', 'embedpress-pro' ),
				],
				'default'     => 'yes',
			],

		];

		return $schema;
	}

	/**
	 * Method that register all EmbedPress events.
	 * @return  void
	 * @since   1.0.0
	 * @static
	 */
	public static function registerEvents() {

	}

	/**
	 * Callback called right before an url be embedded. If return false, EmbedPress will not embed the url.
	 *
	 * @param \stdclass    An object representing the embed.
	 *
	 * @return  mixed
	 * @since   1.0.0
	 * @static
	 */
	public static function onBeforeEmbed( $embed ) {
		if ( empty( $embed ) ) {
			return false;
		}

		return $embed;
	}

	/**
	 * Callback called right after a YouTube url has been embedded.
	 *
	 * @param \stdclass    An object representing the embed.
	 *
	 * @return  array
	 * @since   1.0.0
	 * @static
	 */
	public static function onAfterEmbed( $embed_content ) {
		$settings = self::getOptions();
		$e          = isset( $embed_content->url) && isset( $embed_content->{$embed_content->url}) ? $embed_content->{$embed_content->url} : [];
		if ( isset( $e['provider_name'] ) && strtoupper( $e['provider_name'] ) === 'TWITCH' && isset( $embed_content->embed ) ) {
			$atts = isset( $embed_content->attributes) ? $embed_content->attributes : [];
			$time       = '0h0m0s';
			$type       = $e['type'];
			$content_id = $e['content_id'];
			$channel    = 'channel' === $type ? $content_id : '';
			$video      = 'video' === $type ? $content_id : '';
			$muted = ('yes' === $settings['embedpress_pro_twitch_mute']) ? 'true': 'false';
			$full_screen = ('yes' === $settings['embedpress_pro_fs']) ? 'true': 'false';
			$autoplay = ('yes' === $settings['embedpress_pro_twitch_autoplay']) ? 'true': 'false';
			$theme      = ! empty( $settings['embedpress_pro_twitch_theme'] ) ? $settings['embedpress_pro_twitch_theme'] : 'dark';
			$layout     = ( 'yes' === $settings['embedpress_pro_twitch_chat'] ) ? 'video-with-chat' : 'video';
			$width      = !empty( $atts->{'data-width'}) ? (int) $atts->{'data-width'} : 800;
			$height     = !empty( $atts->{'data-height'}) ? (int) $atts->{'data-height'} : 450;
			if ( ! empty( $settings['embedpress_pro_video_start_time'] ) ) {
				$ta   = explode( ':', gmdate( "G:i:s", $settings['embedpress_pro_video_start_time'] ) );
				$h    = $ta[0] . 'h';
				$m    = ( $ta[1] * 1 ) . 'm';
				$s    = ( $ta[2] * 1 ) . 's';
				$time = $h . $m . $s;
			}
			$url = "https://embed.twitch.tv?autoplay={$autoplay}&channel={$channel}&height={$height}&layout={$layout}&migration=true&muted={$muted}&theme={$theme}&time={$time}&video={$video}&width={$width}&allowfullscreen={$full_screen}";
			$pars_url = wp_parse_url(get_site_url());
			$url = !empty($pars_url['host'])?$url.'&parent='.$pars_url['host']:$url;
			ob_start();
			?>
            <div class="embedpress_wrapper ose-twitch ose-uid-<?php echo esc_attr(md5( $embed_content->url));?>" data-url="<?php echo esc_attr(esc_url( $embed_content->url));?>">
                <iframe src="<?php echo esc_url(  $url); ?>" allowfullscreen="" scrolling="no" frameborder="0" allow="autoplay; fullscreen" title="Twitch" sandbox="allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" width="<?php echo esc_attr($width); ?>" height="<?php echo esc_attr($height); ?>" style="max-width: 100%; max-height:<?php echo esc_attr($height); ?>px;"></iframe>
            </div>
			<?php
			$c                    = ob_get_clean();
			$embed_content->embed = $c;
			$embed_content = Helper::apply_cta_markup_for_blockeditor( $embed_content, $settings, 'twitch');

		}

		return $embed_content;
	}

	/**
	 * Method to get params
	 * @since 1.0.0
	 * @static
	 */
	public static function getParams( $options ) {
		$params = [];

		// Handle `autoplay` option.
		if ( isset( $options['autoplay'] ) && (bool) $options['autoplay'] === true ) {
			$params['autoplay'] = 1;
		} else {
			unset( $params['autoplay'] );
		}


		// Handle `theme` option.
		if ( isset( $options['theme'] ) && in_array( (int) $options['theme'], [
				'dark',
				'light',
			] ) ) {
			$params['theme'] = $options['theme'];
		} else {
			unset( $params['theme'] );
		}

		// Handle `fs` option.
		if ( isset( $options['fs'] ) && in_array( (int) $options['fs'], [
				0,
				1,
			] ) ) {
			$params['fs'] = (int) $options['fs'];
		} else {
			unset( $params['fs'] );
		}

		// Handle `iv_load_policy` option.
		if ( isset( $options['iv_load_policy'] ) && in_array( (int) $options['iv_load_policy'], [
				1,
				3,
			] ) ) {
			$params['iv_load_policy'] = (int) $options['iv_load_policy'];
		} else {
			unset( $params['iv_load_policy'] );
		}

		// Handle `rel` option.
		if ( isset( $options['rel'] ) && in_array( (int) $options['rel'], [
				0,
				1,
			] ) ) {
			$params['rel'] = (int) $options['rel'];
		} else {
			unset( $params['rel'] );
		}

		// Handle `modestbranding` option.
		if ( isset( $options['modestbranding'] ) && (bool) $options['modestbranding'] === true ) {
			$params['modestbranding'] = 1;
		} else {
			unset( $params['modestbranding'] );
		}

		return $params;
	}

	public static function featureExtend() {
		add_action( 'admin_init', [
			get_called_class(),
			'onLoadAdminCallback',
		] );

		add_action( EMBEDPRESS_PLG_NAME . ':Twitch:settings:register', [
				get_called_class(),
				'registerSettings',
			] );
		add_action( EMBEDPRESS_PLG_NAME . ':settings:render:tab', [
			get_called_class(),
			'renderTab',
		] );
		add_filter( 'ep_twitch_settings_before_save', [get_called_class(), 'save_twitch_pro_setting']);
		add_action( 'after_embedpress_branding_save', [get_called_class(), 'save_custom_logo_settings']);

		add_filter( 'embedpress:onAfterEmbed', [
			get_called_class(),
			'onAfterEmbed',
		], 90 );
		add_filter( 'embedpress:onBeforeEmbed', [
			get_called_class(),
			'onBeforeEmbed',
		] );
		add_filter( 'embedpress_gutenberg_twitch_params', [
			get_called_class(),
			'embedpress_gutenberg_register_block_twitch',
		] ); // @todo; check usage of this line deeply
	}

	/**
	 * Registers the `embedpress/twitch-block` block on server.
	 * @since  2.3.1
	 */
	public static function embedpress_gutenberg_register_block_twitch( $twitch_params ) {
		$twitch_options = self::getOptions();
		$twitch_params  = self::getParams( $twitch_options );

		return $twitch_params;
	}

	public static function save_twitch_pro_setting( $settings ) {
		$settings['embedpress_pro_video_start_time'] = isset( $_POST['start_time']) ? sanitize_text_field( $_POST['start_time']) : 0;
		$settings['embedpress_pro_twitch_chat'] = isset( $_POST['show_chat']) ? sanitize_text_field( $_POST['show_chat']) : 'no';
		$settings['embedpress_pro_twitch_theme'] = isset( $_POST['theme']) ? sanitize_text_field( $_POST['theme']) : 'dark';
		$settings['embedpress_pro_twitch_mute'] = isset( $_POST['mute']) ? sanitize_text_field( $_POST['mute']) : 'yes';
		return $settings;
	}

	public static function save_custom_logo_settings() {
		Helper::save_custom_logo_settings('twitch', 'tw');
	}
}
