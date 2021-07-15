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
class Spotify extends Plugin
{
	/**
	 * Plugin's base namespace.
	 *
	 * @since   1.0.0
	 *
	 * @const   NAMESPACE_STRING
	 */
	const NAMESPACE_STRING = "\Embedpress\EmbedPress\Extenders\Spotify";

	/**
	 * Plugin's name.
	 *
	 * @since   1.0.0
	 *
	 * @const   NAME
	 */
	const NAME = "Spotify";

	/**
	 * Plugin's slug.
	 *
	 * @since   1.0.0
	 *
	 * @const   SLUG
	 */
	const SLUG = 'spotify';

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
			'theme'          => [
				'type'        => 'string',
				'label'       => __('Player Background', 'embedpress-pro'),
				'options'     => [
					'1'   => __('Dynamic', 'embedpress-pro'),
					'0'   => __('Black & White', 'embedpress-pro'),
				],
				'default'     => '1'
			],
			'follow_theme'          => [
				'type'        => 'string',
				'label'       => __('Follow Widget Background', 'embedpress-pro'),
				'options'     => [
					'light'   => __('Light', 'embedpress-pro'),
					'dark'   => __('Dark', 'embedpress-pro'),
				],
				'default'     => 'light'
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
	 * @param \stdClass $embed    An object representing the embed.
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
		$isSpotify = ( isset($embed->provider_name) && strtoupper( $embed->provider_name ) === 'SPOTIFY' ) || (isset( $embed->url) && isset( $embed->{$embed->url}) && isset( $embed->{$embed->url}['provider_name']) && strtoupper($embed->{$embed->url}['provider_name'] ) === 'SPOTIFY');
		$is_spotify_follow = strpos( $embed->url, 'follow_widget');
		$is_spotify_artist_link = strpos( $embed->url, 'spotify.com/artist');
		if ( $is_spotify_follow !== false && false !== $is_spotify_artist_link ) {
			preg_match( '/artist\/(.+?):/', $embed->url, $fmatch );
			$artist_id = !empty( $fmatch[1]) ? $fmatch[1] : '';
			$layout = isset( $options['follow_layout']) ? $options['follow_layout'] : 'detail';
			$follow_theme = isset( $options['follow_theme']) ? $options['follow_theme'] : 'light';
			$show_count = isset( $options['follow_count']) ? (int) $options['follow_count'] : 0;

			$width      = 'detail' === $layout ? 300 : 200;
			$height     = 'detail' === $layout ? 56 : 25;
			ob_start();
			?>
			<div class="embedpress_wrapper ose-spotify ose-uid-<?php echo esc_attr(md5( $embed->url));?>" data-url="<?php echo esc_attr(esc_url( $embed->url));?>">
			<iframe src="https://open.spotify.com/follow/1/?uri=spotify:artist:<?php echo esc_attr( $artist_id);?>&size=<?php echo esc_attr( $layout );?>&theme=<?php echo esc_attr( $follow_theme ); ?>&show-count=<?php echo esc_attr( $show_count ); ?>" width="<?php echo esc_attr( $width ); ?>" height="<?php echo esc_attr( $height ); ?>" scrolling="no" frameborder="0" allowtransparency="true"></iframe>
			</div>
			<?php
			$follow_btn = ob_get_clean();
			$embed->embed = $follow_btn;
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
		// Handle `color` option.
		if ( !empty( $options[ 'theme' ] ) ) {
			$params[ 'theme' ] = $options[ 'theme' ];
		} else {
			unset( $params[ 'theme' ] );
		}

		return $params;
	}

	public static function featureExtend()
	{
		add_action( 'admin_init', [Spotify::class, 'onLoadAdminCallback'] );

		add_filter( 'embedpress:onAfterEmbed', [Spotify::class, 'onAfterEmbed'], 90 );
		add_filter( 'embedpress:onBeforeEmbed', [Spotify::class, 'onBeforeEmbed'] );
		add_filter( 'embedpress_gutenberg_spotify_params', [Spotify::class, 'embedpress_spotify_params'], 90 );
		add_filter( 'embedpress_spotify_params', [Spotify::class, 'embedpress_spotify_params'], 90 );
		add_filter( 'ep_spotify_settings_before_save', [Spotify::class, 'save_spotify_pro_setting']);
	}

	/**
	 * Registers the `embedpress/spotify-block` block on server.
	 *
	 * @since  2.3.1
	 */
	public static function embedpress_spotify_params( $spotify_params ) {
		$spotify_options = self::getOptions();
		return self::getParams( $spotify_options );
	}

	public static function save_spotify_pro_setting($settings) {
		$settings['follow_theme'] = isset( $_POST['follow_theme']) ? sanitize_text_field( $_POST['follow_theme']) : 'light';
		$settings['follow_layout'] = isset( $_POST['follow_layout']) ? sanitize_text_field( $_POST['follow_layout']) : 'detail';
		$settings['follow_count'] = isset( $_POST['follow_count']) ? intval( $_POST['follow_count']) : 1;
		return $settings;
	}

}
