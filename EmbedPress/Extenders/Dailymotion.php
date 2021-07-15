<?php

namespace Embedpress\EmbedPress\Extenders;

use EmbedPress\Plugins\Plugin;

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
class Dailymotion extends Plugin
{

	/**
	 * Plugin's name.
	 *
	 * @since   1.0.0
	 *
	 * @const   NAME
	 */
	const NAME = "Dailymotion";

	/**
	 * Plugin's slug.
	 *
	 * @since   1.0.0
	 *
	 * @const   SLUG
	 */
	const SLUG = 'dailymotion';

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
				'type'        => 'string',
				'default'     => ''
			],
			'play_on_mobile'       => [
				'type'        => 'string',
				'default'     => ''
			],
			'color'          => [
				'type'        => 'string',
				'default'     => '#dd3333'
			],
			'mute' => [
				'type'        => 'string',
				'default'     => ''
			],
			'controls'       => [
				'type'        => 'string',
				'default'     => '1'
			],
			'video_info' => [
				'type'        => 'string',
				'default'     => '1'
			],
			'show_logo'       => [
				'type'        => 'string',
				'default'     => '1'
			],
			'start_time'       => [
				'type'        => 'string',
				'default'     => '0'
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
	 * @param \stdClass $embed   An object representing the embed.
	 *
	 * @return  false|\stdClass
	 * @since   1.0.0
	 * @static
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
		$isDailymotion = ( isset($embed->provider_name) && strtoupper( $embed->provider_name ) === 'DAILYMOTION' ) || (isset( $embed->url) && isset( $embed->{$embed->url}) && isset( $embed->{$embed->url}['provider_name']) && strtoupper($embed->{$embed->url}['provider_name'] ) === 'DAILYMOTION');

		if ( $isDailymotion && isset( $embed->embed )
		     && preg_match( '/src=\"(.+?)\"/', $embed->embed, $match ) ) {
			// Parse the url to retrieve all its info like variables etc.
			$url_full = $match[ 1 ];
			$params = [
				'ui-highlight'         => str_replace( '#', '', $options[ 'color' ] ),
				'mute'                 => (int) $options[ 'mute' ],
				'autoplay'             => (int) $options[ 'autoplay' ],
				'controls'             => (int) $options[ 'player_control' ],
				'ui-start-screen-info' => (int) $options[ 'video_info' ],
				'ui-logo'              => (int) $options[ 'logo' ],
				'start'                => (int) $options[ 'start_time' ],
				'endscreen-enable'     => 0,
			];

			if ( $options[ 'play_on_mobile' ] == '1' ) {
				$params[ 'playsinline' ] = 1;
			}

			$url_modified = $url_full;
			foreach ( $params as $param => $value ) {
				$url_modified = add_query_arg( $param, $value, $url_modified );
			}
			$embed->embed = str_replace( $url_full, $url_modified, $embed->embed );

		}

		return $embed;
	}


	public static function featureExtend()
	{

		add_action( 'admin_init', [get_called_class(), 'onLoadAdminCallback'] );
		add_filter( 'embedpress:onAfterEmbed', [get_called_class(), 'onAfterEmbed'], 90 );
		add_filter( 'embedpress:onBeforeEmbed', [get_called_class(), 'onBeforeEmbed'] );
		add_filter( 'ep_dailymotion_settings_before_save', [get_called_class(), 'save_dailymotion_pro_setting']);
		//add_action( 'after_embedpress_branding_save', [get_called_class(), 'save_custom_logo_settings']);
	}


	public static function save_dailymotion_pro_setting( $settings ) {
		$settings['start_time'] = isset( $_POST['start_time']) ? sanitize_text_field( $_POST['start_time']) : 0;
		$settings['show_logo'] = isset( $_POST['show_logo']) ? sanitize_text_field( $_POST['show_logo']) : '';
		return $settings;
	}


}
