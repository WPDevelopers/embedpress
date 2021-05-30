<?php
namespace EmbedPress\Includes\Classes;

class Feature_Enhancer {

	public function __construct() {
		add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_youtube'] );
		add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_vimeo'] );
		add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_wistia'] );
		add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_twitch'] );
		add_filter( 'embedpress_gutenberg_youtube_params',
			[$this, 'embedpress_gutenberg_register_block_youtube'] );
		add_action( 'init', array( $this, 'embedpress_gutenberg_register_block_vimeo' ) );
		add_action('embedpress_gutenberg_wistia_block_after_embed', array($this,'embedpress_wistia_block_after_embed'));

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


			// pro controls will be handled by the pro so remove it from the free.
			$pro_controls = ['color', 'cc_load_policy', 'rel', 'modestbranding'];
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
			// NOTE: 'vimeo_dnt' is actually only 'dnt' in the params, so unset 'dnt' only
			//@todo; maybe extract unsetting pro vars to a function later
			$pro_controls = ['loop', 'autopause', 'dnt', 'portrait', 'byline'];
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
			$embedOptions->smallPlayButton = (isset($options['small_play_button']) && (bool) $options['small_play_button'] === true);

			$embedOptions->autoPlay = (isset($options['autoplay']) && (bool) $options['autoplay'] === true);


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
				'watch_from_beginning' => __('Watch from the beginning', 'embedpress-wistia'),
				'skip_to_where_you_left_off' => __('Skip to where you left off', 'embedpress-wistia'),
				'you_have_watched_it_before' => __('It looks like you\'ve watched<br />part of this video before!',
					'embedpress-wistia'),
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
			$type       = $e['type'];
			$content_id = $e['content_id'];
			$channel    = 'channel' === $type ? $content_id : '';
			$video      = 'video' === $type ? $content_id : '';
			$full_screen = ('yes' === $settings['embedpress_pro_fs']) ? 'true': 'false';
			$autoplay = ('yes' === $settings['embedpress_pro_twitch_autoplay']) ? 'true': 'false';
			$layout     = 'video';
			$width      = !empty( $atts->{'data-width'}) ? (int) $atts->{'data-width'} : 800;
			$height     = !empty( $atts->{'data-height'}) ? (int) $atts->{'data-height'} : 450;

			$url = "https://embed.twitch.tv?autoplay={$autoplay}&channel={$channel}&height={$height}&layout={$layout}&migration=true&video={$video}&width={$width}&allowfullscreen={$full_screen}";
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
	public function get_vimeo_settings_schema() {
		return array(
			'autoplay' => array(
				'type' => 'bool',
				'label' => 'Autoplay',
				'description' => 'Automatically start to play the videos when the player loads.',
				'default' => false
			),
			'loop' => array(
				'type' => 'bool',
				'label' => 'Loop',
				'description' => 'Play the video again automatically when it reaches the end.',
				'default' => false
			),
			'autopause' => array(
				'type' => 'bool',
				'label' => 'Autopause',
				'description' => 'Pause this video automatically when another one plays.',
				'default' => false
			),
			'vimeo_dnt' => array(
				'type' => 'bool',
				'label' => 'DNT',
				'description' => 'Setting this parameter to "yes" will block the player from tracking any session data, including all cookies',
				'default' => true,
			),
			'color' => array(
				'type' => 'text',
				'label' => 'Color',
				'description' => 'Specify the color of the video controls.',
				'default' => '#00adef',
				'classes' => 'color-field'
			),
			'display_title' => array(
				'type' => 'bool',
				'label' => 'Display Title',
				'description' => 'Indicates whether the title is displayed.',
				'default' => true
			),
			'display_author' => array(
				'type' => 'bool',
				'label' => 'Display Author',
				'description' => 'Indicates whether the author is displayed.',
				'default' => true
			),
			'display_avatar' => array(
				'type' => 'bool',
				'label' => 'Display Avatar',
				'description' => 'Indicates whether the avatar is displayed.',
				'default' => true
			)
		);
	}
	public function get_wistia_settings_schema() {
		$schema = array(
			'display_fullscreen_button' => array(
				'type' => 'bool',
				'label' => __('Fullscreen Button', 'embedpress-wistia'),
				'description' => __('Indicates whether the fullscreen button is visible.', 'embedpress-wistia'),
				'default' => true
			),
			'display_playbar' => array(
				'type' => 'bool',
				'label' => __('Playbar', 'embedpress-wistia'),
				'description' => __('Indicates whether the playbar is visible.', 'embedpress-wistia'),
				'default' => true
			),
			'small_play_button' => array(
				'type' => 'bool',
				'label' => __('Small Play Button', 'embedpress-wistia'),
				'description' => __('Indicates whether the small play button is visible on the bottom left.',
					'embedpress-wistia'),
				'default' => true
			),
			'display_volume_control' => array(
				'type' => 'bool',
				'label' => __('Volume Control', 'embedpress-wistia'),
				'description' => __('Indicates whether the volume control is visible.', 'embedpress-wistia'),
				'default' => true
			),
			'autoplay' => array(
				'type' => 'bool',
				'label' => __('Auto Play', 'embedpress-wistia'),
				'description' => __('Automatically start to play the videos when the player loads.',
					'embedpress-wistia'),
				'default' => false
			),
			'volume' => array(
				'type' => 'text',
				'label' => __('Volume', 'embedpress-wistia'),
				'description' => __('Start the video with a custom volume level. Set values between 0 and 100.',
					'embedpress-wistia'),
				'default' => '100'
			),
			'player_color' => array(
				'type' => 'text',
				'label' => __('Color', 'embedpress-wistia'),
				'description' => __('Specify the color of the video controls.', 'embedpress-wistia'),
				'default' => '#00adef',
				'classes' => 'color-field'
			),
			'plugin_resumable' => array(
				'type' => 'bool',
				'label' => __('Plugin: Resumable', 'embedpress-wistia'),
				'description' => __('Indicates whether the Resumable plugin is active. Allow to resume the video or start from the begining.',
					'embedpress-wistia'),
				'default' => false
			),
			'plugin_captions' => array(
				'type' => 'bool',
				'label' => __('Plugin: Captions', 'embedpress-wistia'),
				'description' => __('Indicates whether the Captions plugin is active.', 'embedpress-wistia'),
				'default' => false
			),
			'plugin_captions_default' => array(
				'type' => 'bool',
				'label' => __('Captions Enabled By Default', 'embedpress-wistia'),
				'description' => __('Indicates whether the Captions are enabled by default.', 'embedpress-wistia'),
				'default' => false
			),
			'plugin_focus' => array(
				'type' => 'bool',
				'label' => __('Plugin: Focus', 'embedpress-wistia'),
				'description' => __('Indicates whether the Focus plugin is active.', 'embedpress-wistia'),
				'default' => false
			),
			'plugin_rewind' => array(
				'type' => 'bool',
				'label' => __('Plugin: Rewind', 'embedpress-wistia'),
				'description' => __('Indicates whether the Rewind plugin is active.', 'embedpress-wistia'),
				'default' => false
			),
			'plugin_rewind_time' => array(
				'type' => 'text',
				'label' => __('Rewind time (seconds)', 'embedpress-wistia'),
				'description' => __('The amount of time to rewind, in seconds.', 'embedpress-wistia'),
				'default' => '10'
			),
		);

		return $schema;
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
		$embedOptions= $this->embedpress_wisita_pro_get_options();
		// Get the video ID
		$videoId = $this->getVideoIDFromURL($attributes['url']);
		$shortVideoId = $videoId;

		$labels = array(
			'watch_from_beginning'       => __('Watch from the beginning', 'embedpress-wistia'),
			'skip_to_where_you_left_off' => __('Skip to where you left off', 'embedpress-wistia'),
			'you_have_watched_it_before' => __('It looks like you\'ve watched<br />part of this video before!', 'embedpress-wistia'),
		);
		$labels = json_encode($labels);


		$html = '<script src="https://fast.wistia.com/assets/external/E-v1.js"></script>';
		$html .= "<script>window.pp_embed_wistia_labels = {$labels};</script>\n";
		$html .= "<script>wistiaEmbed = Wistia.embed( \"{$shortVideoId}\", {$embedOptions} );</script>\n";
		echo $html;
	}
	public function embedpress_wisita_pro_get_options() {
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
	}

}