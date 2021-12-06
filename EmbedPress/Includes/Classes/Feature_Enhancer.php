<?php
namespace EmbedPress\Includes\Classes;

class Feature_Enhancer {

	public function __construct() {
			add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_youtube'], 90 );
			add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_vimeo'], 90 );
			add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_wistia'], 90 );
			add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_twitch'], 90 );
			add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_dailymotion'], 90 );
			add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_soundcloud'], 90 );
			add_filter( 'embedpress_gutenberg_youtube_params',
				[$this, 'embedpress_gutenberg_register_block_youtube'] );
			add_action( 'init', array( $this, 'embedpress_gutenberg_register_block_vimeo' ) );
			add_action('embedpress_gutenberg_wistia_block_after_embed', array($this,'embedpress_wistia_block_after_embed'));
			add_action( 'elementor/widget/embedpres_elementor/skins_init', [ $this, 'elementor_setting_init' ] );
	}

	public function elementor_setting_init(  ) {
		$this->remove_classic_filters();
		add_filter( 'embedpress_elementor_embed', [Elementor_Enhancer::class, 'youtube'], 10, 2 );
		add_filter( 'embedpress_elementor_embed', [Elementor_Enhancer::class, 'wistia'], 10, 2 );
		add_filter( 'embedpress_elementor_embed', [Elementor_Enhancer::class, 'twitch'], 10, 2 );
		add_filter( 'embedpress_elementor_embed', [Elementor_Enhancer::class, 'soundcloud'], 10, 2 );
		add_filter( 'embedpress_elementor_embed', [Elementor_Enhancer::class, 'dailymotion'], 10, 2 );
		add_filter( 'embedpress_elementor_embed', [Elementor_Enhancer::class, 'spotify'], 10, 2 );
		add_filter( 'embedpress_elementor_embed', [Elementor_Enhancer::class, 'vimeo'], 10, 2 );
	}
	public function remove_classic_filters(  ) {
		remove_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_youtube'], 90 );
		remove_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_vimeo'], 90 );
		remove_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_wistia'], 90 );
		remove_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_twitch'], 90 );
		remove_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_dailymotion'], 90 );
		remove_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_soundcloud'], 90 );
	}
	public function getOptions($provider='', $schema=[])
	{
		$options = (array)get_option(EMBEDPRESS_PLG_NAME . ':' . $provider, []);
		if (empty($options) || (count($options) === 1 && empty($options[0]))) {
			$options = [];

			foreach ($schema as $fieldSlug => $field) {
				$value = isset($field['default']) ? $field['default'] : "";

				settype($value, isset($field['type']) && in_array(strtolower($field['type']),
					['bool', 'boolean', 'int', 'integer', 'float', 'string']) ? $field['type'] : 'string');

				if ($fieldSlug === "license_key") {
					$options['license'] = [
						'key'    => true,
						'status' => "missing",
					];
				} else {
					$options[$fieldSlug] = $value;
				}
			}
		}

		$options['license'] = [
			'key'    => true,
			'status' => "missing",
		];
        return apply_filters( 'emebedpress_get_options', $options);
	}
	public function get_youtube_params( $options )
	{
		$params = [];

		// Handle `autoplay` option.
		if ( isset( $options[ 'autoplay' ] ) && (bool)$options[ 'autoplay' ] === true ) {
			$params[ 'autoplay' ] = 1;
		} else {
			unset( $params[ 'autoplay' ] );
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

		return apply_filters( 'embedpress_youtube_params', $params);

	}
	public function get_vimeo_params($options) {
		$params   = [];

		// Handle `display_title` option.
		if (isset($options['display_title']) && (bool)$options['display_title'] === true) {
			$params['title'] = 1;
		} else {
			$params['title'] = 0;
		}

		// Handle `autoplay` option.
		if (!empty($options['autoplay'])) {
			$params['autoplay'] = 1;
		} else {
			unset($params['autoplay']);
		}

		// Handle `color` option.
		if (!empty($options['color'])) {
			$params['color'] = str_replace('#', '', $options['color']);
		} else {
			unset($params['color']);
		}
		return apply_filters( 'embedpress_vimeo_params', $params);
		
	}
    //--- For CLASSIC AND BLOCK EDITOR
	public function enhance_youtube( $embed )
	{
		$isYoutube = ( isset($embed->provider_name) && strtoupper( $embed->provider_name ) === 'YOUTUBE' ) || (isset( $embed->url) && isset( $embed->{$embed->url}) && isset( $embed->{$embed->url}['provider_name']) && strtoupper($embed->{$embed->url}['provider_name'] ) === 'YOUTUBE');

		if ( $isYoutube && isset( $embed->embed )
		     && preg_match( '/src=\"(.+?)\"/', $embed->embed, $match ) ) {
			// for compatibility only, @TODO; remove later after deep testing.
			$options = $this->getOptions('youtube', $this->get_youtube_settings_schema());
			// Parse the url to retrieve all its info like variables etc.
			$url_full = $match[ 1 ];
			$query = parse_url( $url_full, PHP_URL_QUERY );
			parse_str( $query, $params );
            // Handle `color` option.
			if ( !empty( $options[ 'color' ] ) ) {
				$params[ 'color' ] = $options[ 'color' ];
			} else {
				unset( $params[ 'color' ] );
			}
			// Handle `rel` option.
			if ( isset( $options[ 'rel' ] ) && in_array( (int)$options[ 'rel' ], [0, 1] ) ) {
				$params[ 'rel' ] = (int)$options[ 'rel' ];
			} else {
				unset( $params[ 'rel' ] );
			}

			// Handle `autoplay` option.
			if ( isset( $options[ 'autoplay' ] ) && (bool)$options[ 'autoplay' ] === true ) {
				$params[ 'autoplay' ] = 1;
			} else {
				unset( $params[ 'autoplay' ] );
			}

			// Handle `controls` option.
			if ( isset( $options[ 'controls' ] ) && in_array( (int)$options[ 'controls' ], [0, 1, 2] ) ) {
				$params[ 'controls' ] = (int)$options[ 'controls' ];
			} else {
				unset( $params[ 'controls' ] );
			}
			if ( isset($options[ 'start_time' ]) ) {
				$params[ 'start' ] = $options[ 'start_time' ];
			}else {
			    unset($params[ 'start' ]);
            }
			if ( isset($options[ 'end_time' ]) ) {
				$params[ 'end' ] = $options[ 'end_time' ];
			}else {
				unset($params[ 'end' ]);
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


			// pro controls will be handled by the pro so remove it from the free.
			$pro_controls = [ 'cc_load_policy', 'modestbranding'];
			foreach ( $pro_controls as $pro_control ) {
				if ( isset( $params[ $pro_control ]) ) {
					unset( $params[ $pro_control ]);
				}
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

		}

		return $embed;
	}
	public function enhance_vimeo( $embed ) {
		if ( isset( $embed->provider_name )
		     && strtoupper( $embed->provider_name ) === 'VIMEO'
		     && isset( $embed->embed )
		     && preg_match( '/src=\"(.+?)\"/', $embed->embed, $match ) ) {
			// old schema is for backward compatibility only @todo; remove it in the next version after deep test
			$options = $this->getOptions('vimeo', $this->get_vimeo_settings_schema());

			$url_full = $match[1];
			$params = [];

			// Handle `display_title` option.
			if ( isset( $options['display_title'] ) && (bool)$options['display_title'] === true ) {
				$params['title'] = 1;
			} else {
				$params['title'] = 0;
			}

			// Handle `autoplay` option.
			if ( isset( $options['autoplay'] ) && (bool)$options['autoplay'] === true ) {
				$params['autoplay'] = 1;
			} else {
				unset( $params['autoplay'] );
			}

			// Handle `color` option.
			if ( !empty( $options['color'] ) ) {
				$params['color'] = str_replace( '#', '', $options['color'] );
			} else {
				unset( $params['color'] );
			}
			// Handle `display_author` option.
			if ( isset( $options['display_author'] ) && (bool)$options['display_author'] === true ) {
				$params['byline'] = 1;
			} else {
				$params['byline'] = 0;
			}

			// Handle `display_avatar` option.
			if ( isset( $options['display_avatar'] ) && (bool)$options['display_avatar'] === true ) {
				$params['portrait'] = 1;
			} else {
				$params['portrait'] = 0;
			}

			// NOTE: 'vimeo_dnt' is actually only 'dnt' in the params, so unset 'dnt' only
			//@todo; maybe extract unsetting pro vars to a function later
			$pro_controls = ['loop', 'autopause', 'dnt',];
			foreach ( $pro_controls as $pro_control ) {
				if ( isset( $params[ $pro_control ]) ) {
					unset( $params[ $pro_control ]);
				}
			}
			// Reassemble the url with the new variables.
			$url_modified = $url_full;
			foreach ( $params as $param => $value ) {
				$url_modified = add_query_arg( $param, $value, $url_modified );
			}
			if ( isset( $options[ 'start_time' ]) ) {
				$url_modified .= '#t=' . $options[ 'start_time' ];
			}

			do_action( 'embedpress_after_modified_url', $url_modified, $url_full, $params);
			// Replaces the old url with the new one.
			$embed->embed = str_replace( $url_full, $url_modified, $embed->embed );

		}

		return $embed;
	}
	public function enhance_wistia( $embed ) {
		if (isset($embed->provider_name)
		    && strtoupper($embed->provider_name) === 'WISTIA, INC.'
		    && isset($embed->embed)
		    && preg_match('/src=\"(.+?)\"/', $embed->embed, $match)) {
			$options = $this->getOptions('wistia', $this->get_wistia_settings_schema());

			$url_full = $match[1];

			// Parse the url to retrieve all its info like variables etc.
			$query = parse_url($embed->url, PHP_URL_QUERY);
			$url = str_replace('?'.$query, '', $url_full);

			parse_str($query, $params);

			// Set the class in the attributes
			$embed->attributes->class = str_replace('{provider_alias}', 'wistia', $embed->attributes->class);
			$embed->embed = str_replace('ose-wistia, inc.', 'ose-wistia', $embed->embed);

			// Embed Options
			$embedOptions = new \stdClass;
			$embedOptions->videoFoam = true;
			$embedOptions->fullscreenButton = (isset($options['display_fullscreen_button']) && (bool) $options['display_fullscreen_button'] === true);
			$embedOptions->playbar = (isset($options['display_playbar']) && (bool) $options['display_playbar'] === true);

			$embedOptions->smallPlayButton = (isset($options['small_play_button']) && (bool) $options['small_play_button'] === true);

			$embedOptions->autoPlay = (isset($options['autoplay']) && (bool) $options['autoplay'] === true);

			$embedOptions->time = isset( $options[ 'start_time' ]) ? $options[ 'start_time' ] : 0;

			if (isset($options['player_color'])) {
				$color = $options['player_color'];
				if (null !== $color) {
					$embedOptions->playerColor = $color;
				}
			}

			// Plugins
			$pluginsBaseURL = plugins_url('assets/js/wistia/min', dirname(__DIR__).'/embedpress-Wistia.php');

			$pluginList = array();

			// Resumable
			if (isset($options['plugin_resumable'])) {
				$isResumableEnabled = $options['plugin_resumable'];
				if ($isResumableEnabled) {
					// Add the resumable plugin
					$pluginList['resumable'] = array(
						'src' => $pluginsBaseURL.'/resumable.min.js',
						'async' => false
					);
				}
			}

			// Add a fix for the autoplay and resumable work better together
			if (isset($options->autoPlay)) {
				if ($isResumableEnabled) {
					$pluginList['fixautoplayresumable'] = array(
						'src' => $pluginsBaseURL.'/fixautoplayresumable.min.js'
					);
				}
			}

			// Focus plugin
			if (isset($options['plugin_focus'])) {
				$isFocusEnabled = $options['plugin_focus'];
				$pluginList['dimthelights'] = array(
					'src' => $pluginsBaseURL.'/dimthelights.min.js',
					'autoDim' => $isFocusEnabled
				);
				$embedOptions->focus = $isFocusEnabled;
			}

            // Rewind plugin
			if (isset($options['plugin_rewind'])) {
				if ($options['plugin_rewind']) {
					$embedOptions->rewindTime = isset($options['plugin_rewind_time']) ? (int) $options['plugin_rewind_time'] : 10;

					$pluginList['rewind'] = array(
						'src' => $pluginsBaseURL.'/rewind.min.js'
					);
				}
			}
			$embedOptions->plugin = $pluginList;
			$embedOptions = json_encode($embedOptions);

			// Get the video ID
			$videoId = $this->getVideoIDFromURL($embed->url);
			$shortVideoId = substr($videoId, 0, 3);

			// Responsive?

			$class = array(
				'wistia_embed',
				'wistia_async_'.$videoId
			);

			$attribs = array(
				sprintf('id="wistia_%s"', $videoId),
				sprintf('class="%s"', join(' ', $class)),
				sprintf('style="width:%spx; height:%spx;"', $embed->width, $embed->height)
			);

			$labels = array(
				'watch_from_beginning' => __('Watch from the beginning', 'embedpress'),
				'skip_to_where_you_left_off' => __('Skip to where you left off', 'embedpress'),
				'you_have_watched_it_before' => __('It looks like you\'ve watched<br />part of this video before!',
					'embedpress'),
			);
			$labels = json_encode($labels);

			preg_match('/ose-uid-([a-z0-9]*)/', $embed->embed, $matches);
			$uid = $matches[1];

			$html = "<div class=\"embedpress-wrapper ose-wistia ose-uid-{$uid} responsive\">";
			$html .= '<script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>';
			$html .= "<script>window.pp_embed_wistia_labels = {$labels};</script>\n";
			$html .= "<script>window._wq = window._wq || []; _wq.push({\"{$shortVideoId}\": {$embedOptions}});</script>\n";
			$html .= '<div '.join(' ', $attribs)."></div>\n";
			$html .= '</div>';
			$embed->embed = $html;
		}

		return $embed;
	}
	public function enhance_twitch( $embed_content ) {
		$e          = isset( $embed_content->url) && isset( $embed_content->{$embed_content->url}) ? $embed_content->{$embed_content->url} : [];
		if ( isset( $e['provider_name'] ) && strtoupper( $e['provider_name'] ) === 'TWITCH' && isset( $embed_content->embed ) ) {
			$settings = $this->getOptions('twitch', $this->get_twitch_settings_schema());

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

			$layout     = 'video';
			$width      = !empty( $atts->{'data-width'}) ? (int) $atts->{'data-width'} : 800;
			$height     = !empty( $atts->{'data-height'}) ? (int) $atts->{'data-height'} : 450;
			if ( ! empty( $settings['start_time'] ) ) {
				$ta   = explode( ':', gmdate( "G:i:s", $settings['start_time'] ) );
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
            <div class="embedpress_wrapper" data-url="<?php echo esc_attr(esc_url( $embed_content->url));?>">
                <iframe src="<?php echo esc_url(  $url); ?>" allowfullscreen="" scrolling="no" frameborder="0" allow="autoplay; fullscreen" title="Twitch" sandbox="allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" width="<?php echo esc_attr($width); ?>" height="<?php echo esc_attr($height); ?>" style="max-width: 100%; max-height:<?php echo esc_attr($width); ?>px;"></iframe>
            </div>
			<?php
			$c                    = ob_get_clean();
			$embed_content->embed = $c;
		}

		return $embed_content;
	}
	public function enhance_dailymotion( $embed ) {
		$options = $this->getOptions('dailymotion', $this->get_dailymotion_settings_schema());
		$isDailymotion = ( isset($embed->provider_name) && strtoupper( $embed->provider_name ) === 'DAILYMOTION' ) || (isset( $embed->url) && isset( $embed->{$embed->url}) && isset( $embed->{$embed->url}['provider_name']) && strtoupper($embed->{$embed->url}['provider_name'] ) === 'DAILYMOTION');

		if ( $isDailymotion && isset( $embed->embed )
		     && preg_match( '/src=\"(.+?)\"/', $embed->embed, $match ) ) {
			// Parse the url to retrieve all its info like variables etc.
			$url_full = $match[ 1 ];
			$params = [
				'ui-highlight'         => str_replace( '#', '', $options[ 'color' ] ),
				'mute'                 => (int) $options[ 'mute' ],
				'autoplay'             => (int) $options[ 'autoplay' ],
				'controls'             => (int) $options[ 'controls' ],
				'ui-start-screen-info' => (int) $options[ 'video_info' ],
				'endscreen-enable'     => 0,
			];

			if ( $options[ 'play_on_mobile' ] == '1' ) {
				$params[ 'playsinline' ] = 1;
			}
			$params['start'] = (int) $options[ 'start_time' ];
			if ( is_embedpress_pro_active() ) {
				$params['ui-logo'] = (int) $options[ 'show_logo' ];
			}

			$url_modified = $url_full;
			foreach ( $params as $param => $value ) {
				$url_modified = add_query_arg( $param, $value, $url_modified );
			}
			$embed->embed = str_replace( $url_full, $url_modified, $embed->embed );

		}

		return $embed;
	}
	public function enhance_soundcloud( $embed ) {

		$isSoundcloud = ( isset($embed->provider_name) && strtoupper( $embed->provider_name ) === 'SOUNDCLOUD' ) || (isset( $embed->url) && isset( $embed->{$embed->url}) && isset( $embed->{$embed->url}['provider_name']) && strtoupper($embed->{$embed->url}['provider_name'] ) === 'SOUNDCLOUD');

		if ( $isSoundcloud && isset( $embed->embed )
		     && preg_match( '/src=\"(.+?)\"/', $embed->embed, $match ) ) {
			$options = $this->getOptions('soundcloud', $this->get_soundcloud_settings_schema());
			// Parse the url to retrieve all its info like variables etc.
			$url_full = $match[ 1 ];
			$params = [
				'color'          => str_replace( '#', '', $options[ 'color' ] ),
				'visual'         => isset($options[ 'visual' ] ) && $options['visual']== '1' ? 'true' : 'false',
				'auto_play'      => isset($options[ 'autoplay' ] ) && $options['autoplay']== '1' ? 'true' : 'false',
				'sharing'        => isset($options[ 'share_button' ] ) && $options['share_button']== '1' ? 'true' : 'false',
				'show_comments'  => isset($options[ 'comments' ] ) && $options['comments']== '1' ? 'true' : 'false',
				'buying'        =>  'false',
				'download'      => 'false',
                'show_artwork'   => isset($options[ 'artwork' ] ) && $options['artwork']== '1' ? 'true' : 'false',
				'show_playcount' => isset($options[ 'play_count' ] ) && $options['play_count']== '1' ? 'true' : 'false',
				'show_user'      => isset($options[ 'username' ] ) && $options['username']== '1' ? 'true' : 'false',
			];

			if ( is_embedpress_pro_active() ) {
				$params['buying'] = isset($options[ 'buy_button' ] ) && $options['buy_button']== '1' ? 'true' : 'false';
				$params['download'] = isset($options[ 'download_button' ] ) && $options['download_button']== '1' ? 'true' : 'false';
			}

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
	public function embedpress_gutenberg_register_block_youtube( $youtube_params ) {
		$youtube_options = $this->getOptions('youtube', $this->get_youtube_settings_schema());
		return $this->get_youtube_params( $youtube_options );
	}
	public function embedpress_gutenberg_register_block_vimeo() {
		if ( function_exists( 'register_block_type' ) ) :
			register_block_type( 'embedpress/vimeo-block', array(
				'attributes' => array(
					'url' => array(
						'type' => 'string',
						'default' => ''
					),
					'iframeSrc' => array(
						'type' => 'string',
						'default' => ''
					),
				),
				'render_callback' => [ $this, 'embedpress_gutenberg_render_block_vimeo' ]
			) );
		endif;
	}
	public function embedpress_gutenberg_render_block_vimeo( $attributes ) {
		ob_start();
		if ( !empty( $attributes ) && !empty( $attributes['iframeSrc'] ) ) :
			$vimeo_options = $this->getOptions('vimeo', $this->get_vimeo_settings_schema());
			$vimeo_params = $this->get_vimeo_params( $vimeo_options );
			$iframeUrl = $attributes['iframeSrc'];
			$align = 'align' . ( isset( $attributes[ 'align' ] ) ? $attributes[ 'align' ] : 'center' );
			foreach ( $vimeo_params as $param => $value ) {
				$iframeUrl = add_query_arg( $param, $value, $iframeUrl );
			}
			//@TODO; test responsive without static height width, keeping for now backward compatibility
			?>
			<div class="ose-vimeo wp-block-embed-vimeo <?php echo $align; ?>">
				<iframe src="<?php echo $iframeUrl; ?>" allowtransparency="true" frameborder="0" width="640" height="360">
				</iframe>
			</div>
		<?php
		endif;
		
		return apply_filters( 'embedpress_gutenberg_block_markup', ob_get_clean());
	}
	public function get_youtube_settings_schema() {
		return [
			'autoplay'       => [
				'type'        => 'bool',
				'default'     => false
			],
			'color'          => [
				'type'        => 'string',
				'default'     => 'red'
			],
			'cc_load_policy' => [
				'type'        => 'bool',
				'default'     => false
			],
			'controls'       => [
				'type'        => 'string',
				'default'     => '1'
			],
			'fs'             => [
				'type'        => 'bool',
				'default'     => true
			],
			'iv_load_policy' => [
				'type'        => 'radio',
				'default'     => '1'
			],
			'rel'            => [
				'type'        => 'bool',
				'default'     => true
			],
			'modestbranding' => [
				'type'        => 'string',
				'default'     => '0'
			],
			'logo_url' => [
				'type'        => 'url',
			],
			'logo_xpos' => [
				'type'        => 'number',
				'default'     => 10
			],
			'logo_ypos' => [
				'type'        => 'number',
				'default'     => 10
			],
			'cta_url' => [
				'type'        => 'url',
			],
			'start_time' => [
				'type'        => 'number',
				'default'     => 10
			],
			'end_time' => [
				'type'        => 'number',
				'default'     => 10
			],
		];
	}
	public function get_vimeo_settings_schema() {
		return array(
			'start_time' => [
				'type'        => 'number',
				'default'     => 10
			],
			'autoplay' => array(
				'type' => 'bool',
				'default' => false
			),
			'loop' => array(
				'type' => 'bool',
				'default' => false
			),
			'autopause' => array(
				'type' => 'bool',
				'default' => false
			),
			'vimeo_dnt' => array(
				'type' => 'bool',
				'default' => true,
			),
			'color' => array(
				'type' => 'text',
				'default' => '#00adef',
				'classes' => 'color-field'
			),
			'display_title' => array(
				'type' => 'bool',
				'default' => true
			),
			'display_author' => array(
				'type' => 'bool',
				'default' => true
			),
			'display_avatar' => array(
				'type' => 'bool',
				'default' => true
			)
		);
	}
	public function get_wistia_settings_schema() {
		return array(
			'start_time' => [
				'type'        => 'number',
				'default'     => 0
			],
			'display_fullscreen_button' => array(
				'type' => 'bool',
				'default' => true
			),
			'display_playbar' => array(
				'type' => 'bool',
				'default' => true
			),
			'small_play_button' => array(
				'type' => 'bool',
				'default' => true
			),
			'display_volume_control' => array(
				'type' => 'bool',
				'default' => true
			),
			'autoplay' => array(
				'type' => 'bool',
				'default' => false
			),
			'volume' => array(
				'type' => 'text',
				'default' => '100'
			),
			'player_color' => array(
				'type' => 'text',
				'default' => '#00adef',
			),
			'plugin_resumable' => array(
				'type' => 'bool',
				'default' => false
			),
			'plugin_captions' => array(
				'type' => 'bool',
				'default' => false
			),
			'plugin_captions_default' => array(
				'type' => 'bool',
				'default' => false
			),
			'plugin_focus' => array(
				'type' => 'bool',
				'default' => false
			),
			'plugin_rewind' => array(
				'type' => 'bool',
				'default' => false
			),
			'plugin_rewind_time' => array(
				'type' => 'text',
				'default' => '10'
			),
		);
	}
	public function getVideoIDFromURL ($url) {
		// https://fast.wistia.com/embed/medias/xf1edjzn92.jsonp
		// https://ostraining-1.wistia.com/medias/xf1edjzn92
		preg_match('#\/medias\\\?\/([a-z0-9]+)\.?#i', $url, $matches);

		$id = false;
		if (isset($matches[1])) {
			$id = $matches[1];
		}

		return $id;
	}
	public function embedpress_wistia_block_after_embed( $attributes ){
		$embedOptions= $this->embedpress_wistia_pro_get_options();
		// Get the video ID
		$videoId = $this->getVideoIDFromURL($attributes['url']);
		$shortVideoId = $videoId;

		$labels = array(
			'watch_from_beginning'       => __('Watch from the beginning', 'embedpress'),
			'skip_to_where_you_left_off' => __('Skip to where you left off', 'embedpress'),
			'you_have_watched_it_before' => __('It looks like you\'ve watched<br />part of this video before!', 'embedpress'),
		);
		$labels = json_encode($labels);


		$html = '<script src="https://fast.wistia.com/assets/external/E-v1.js"></script>';
		$html .= "<script>window.pp_embed_wistia_labels = {$labels};</script>\n";
		$html .= "<script>wistiaEmbed = Wistia.embed( \"{$shortVideoId}\", {$embedOptions} );</script>\n";
		echo $html;
	}
	public function embedpress_wistia_pro_get_options() {
		$options = $this->getOptions('wistia', $this->get_wistia_settings_schema());
		// Embed Options
		$embedOptions = new \stdClass;
		$embedOptions->videoFoam        = true;
		$embedOptions->fullscreenButton = (isset($options['display_fullscreen_button']) && (bool)$options['display_fullscreen_button'] === true);
		$embedOptions->smallPlayButton  = (isset($options['small_play_button']) && (bool)$options['small_play_button'] === true);
		$embedOptions->autoPlay         = (isset($options['autoplay']) && (bool)$options['autoplay'] === true);

		if (isset($options['player_color'])) {
			$color = $options['player_color'];
			if (null !== $color) {
				$embedOptions->playerColor = $color;
			}
		}

		// Plugins
		$pluginsBaseURL = plugins_url('assets/js/wistia/min', dirname(__DIR__) . '/embedpress-Wistia.php');

		$pluginList = array();

		// Resumable
		if (isset($options['plugin_resumable'])) {
			$isResumableEnabled = $options['plugin_resumable'];
			if ($isResumableEnabled) {
				// Add the resumable plugin
				$pluginList['resumable'] = array(
					'src'   => '//fast.wistia.com/labs/resumable/plugin.js',
					'async' => false
				);
			}
		}
		// Add a fix for the autoplay and resumable work better together
        //@TODO; check baseurl deeply, not looking good
		if ($options['autoplay']) {
			if ($isResumableEnabled) {
				$pluginList['fixautoplayresumable'] = array(
					'src' => $pluginsBaseURL . '/fixautoplayresumable.min.js'
				);
			}
		}


		// Focus plugin
		if (isset($options['plugin_focus'])) {
			$isFocusEnabled = $options['plugin_focus'];
			$pluginList['dimthelights'] = array(
				'src'     => '//fast.wistia.com/labs/dim-the-lights/plugin.js',
				'autoDim' => $isFocusEnabled
			);
			$embedOptions->focus = $isFocusEnabled;
		}

		$embedOptions->plugin = $pluginList;
		$embedOptions = apply_filters( 'embedpress_wistia_params', $embedOptions);
		$embedOptions         = json_encode($embedOptions);
		 return apply_filters( 'embedpress_wistia_params_after_encode', $embedOptions);
	}
	public function get_twitch_settings_schema() {
		return [
			'start_time' => [
				'type'        => 'number',
				'default'     => 0,
			],
			'embedpress_pro_twitch_autoplay'  => [
				'type'        => 'string',
				'default'     => 'no',
			],
			'embedpress_pro_twitch_chat'      => [
				'type'        => 'string',
				'default'     => 'no',
			],

			'embedpress_pro_twitch_theme' => [
				'type'        => 'string',
				'default'     => 'dark',
			],
			'embedpress_pro_fs'           => [
				'type'        => 'string',
				'default'     => 'yes',
			],
			'embedpress_pro_twitch_mute'  => [
				'type'        => 'string',
				'default'     => 'yes',
			],

		];
	}
	public function get_dailymotion_settings_schema() {
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
	public function get_soundcloud_settings_schema() {
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


}