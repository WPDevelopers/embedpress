<?php
namespace EmbedPress\Includes\Classes;

class Feature_Enhancer {

	public function __construct() {
		add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_youtube'] );
		add_filter( 'embedpress:onAfterEmbed', [$this, 'enhance_vimeo'] );
		add_filter( 'embedpress_gutenberg_youtube_params',
			[$this, 'embedpress_gutenberg_register_block_youtube'] );
		add_action( 'init', array( $this, 'embedpress_gutenberg_register_block_vimeo' ) );

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
	    error_log( ' vimeo got triggered');
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

}