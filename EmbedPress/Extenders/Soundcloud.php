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
class Soundcloud extends Plugin
{

	/**
	 * Plugin's name.
	 *
	 * @since   1.0.0
	 *
	 * @const   NAME
	 */
	const NAME = "Soundcloud";

	/**
	 * Plugin's slug.
	 *
	 * @since   1.0.0
	 *
	 * @const   SLUG
	 */
	const SLUG = 'soundcloud';

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
			'visual' => [
				'type'        => 'string',
				'default'     => ''
			],
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

			'share_button'       => [
				'type'        => 'string',
				'default'     => ''
			],
			'comments'       => [
				'type'        => 'string',
				'default'     => '1'
			],
			'artwork' => [
				'type'        => 'string',
				'default'     => ''
			],
			'play_count'       => [
				'type'        => 'string',
				'default'     => '1'
			],
			'username'       => [
				'type'        => 'string',
				'default'     => '1'
			],
			'download_button'       => [
				'type'        => 'string',
				'default'     => '1'
			],
			'buy_button'       => [
				'type'        => 'string',
				'default'     => '1'
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
		$isSoundcloud = ( isset($embed->provider_name) && strtoupper( $embed->provider_name ) === 'SOUNDCLOUD' ) || (isset( $embed->url) && isset( $embed->{$embed->url}) && isset( $embed->{$embed->url}['provider_name']) && strtoupper($embed->{$embed->url}['provider_name'] ) === 'SOUNDCLOUD');

		if ( $isSoundcloud && isset( $embed->embed )
		     && preg_match( '/src=\"(.+?)\"/', $embed->embed, $match ) ) {
			// Parse the url to retrieve all its info like variables etc.
			$url_full = $match[ 1 ];
			$params = [
				'color'          => str_replace( '#', '', $options[ 'color' ] ),
				'visual'         => isset($options[ 'visual' ] ) && $options['visual']== '1' ? 'true' : 'false',
				'auto_play'      => isset($options[ 'autoplay' ] ) && $options['autoplay']== '1' ? 'true' : 'false',
				'buying'         => isset($options[ 'buy_button' ] ) && $options['buy_button']== '1' ? 'true' : 'false',
				'sharing'        => isset($options[ 'share_button' ] ) && $options['share_button']== '1' ? 'true' : 'false',
				'show_comments'  => isset($options[ 'comments' ] ) && $options['comments']== '1' ? 'true' : 'false',
				'download'       => isset($options[ 'download_button' ] ) && $options['download_button']== '1' ? 'true' : 'false',
				'show_artwork'   => isset($options[ 'artwork' ] ) && $options['artwork']== '1' ? 'true' : 'false',
				'show_playcount' => isset($options[ 'play_count' ] ) && $options['play_count']== '1' ? 'true' : 'false',
				'show_user'      => isset($options[ 'username' ] ) && $options['username']== '1' ? 'true' : 'false',
			];

			$url_modified = $url_full;
			foreach ( $params as $param => $value ) {
				$url_modified = add_query_arg( $param, $value, $url_modified );
			}

			// Replaces the old url with the new one.
			$embed->embed = str_replace( $url_full, $url_modified, $embed->embed );
			if ( 'false' === $params[ 'visual' ] ) {
				$embed->embed = str_replace( 'height="400"', 'height="200 !important"', $embed->embed );
			}

		}

		return $embed;
	}


	public static function featureExtend()
	{

		add_action( 'admin_init', [get_called_class(), 'onLoadAdminCallback'] );
		add_filter( 'embedpress:onAfterEmbed', [get_called_class(), 'onAfterEmbed'], 90 );
		add_filter( 'embedpress:onBeforeEmbed', [get_called_class(), 'onBeforeEmbed'] );
		add_filter( 'ep_soundcloud_settings_before_save', [get_called_class(), 'save_soundcloud_pro_setting']);
	}


	public static function save_soundcloud_pro_setting( $settings ) {
		$settings['download_button'] = isset( $_POST['download_button']) ? sanitize_text_field( $_POST['download_button']) : '';
		$settings['buy_button'] = isset( $_POST['buy_button']) ? sanitize_text_field( $_POST['buy_button']) : '';
		return $settings;
	}


}
