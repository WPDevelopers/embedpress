<?php
namespace EmbedPress\Ends\Back\Settings;

class EmbedpressSettings {
	var $page_slug = '';
	/**
	 * @var int|string
	 */
	protected $file_version;

	public function __construct($page_slug = 'embedpress') {
		$this->page_slug = $page_slug;
		$this->file_version = defined( 'WP_DEBUG') && WP_DEBUG ? time() : EMBEDPRESS_VERSION;
		add_action('admin_enqueue_scripts', [$this, 'handle_scripts_and_styles']);
		add_action('admin_menu', [$this, 'register_menu']);
		add_action( 'init', [$this, 'save_settings']);

		// ajax
		add_action( 'wp_ajax_embedpress_elements_action', [$this, 'update_elements_list']);
		add_action( 'wp_ajax_embedpress_settings_action', [$this, 'save_settings']);

		// Migration
		$option = 'embedpress_elements_updated'; // to update initially for backward compatibility
		if ( !get_option( $option, false) ) {
			$elements_initial_states = [
				'gutenberg' => [
					'google-docs-block' => 'google-docs-block',
					'document' => 'document',
					'embedpress' => 'embedpress',
					'embedpress-pdf' => 'embedpress-pdf',
					'google-sheets-block' => 'google-sheets-block',
					'google-slides-block' => 'google-slides-block',
					'youtube-block' => 'youtube-block',
					'google-forms-block' => 'google-forms-block',
					'google-drawings-block' => 'google-drawings-block',
					'google-maps-block' => 'google-maps-block',
					'twitch-block' => 'twitch-block',
					'wistia-block' => 'wistia-block',
					'vimeo-block' => 'vimeo-block',
				],
				'elementor' => [
					'embedpress-document' => 'embedpress-document',
					'embedpress' => 'embedpress',
					'embedpress-pdf' => 'embedpress-pdf',
				]
			];

			$settings = get_option( EMBEDPRESS_PLG_NAME, [] );
			$yt = get_option( EMBEDPRESS_PLG_NAME.':youtube' );
			if ( empty( $settings) && empty( $yt) ) {
				$settings['need_first_time_redirect'] = true;
			}
			if ( !isset( $settings['enablePluginInAdmin']) ) {
				$settings['enablePluginInAdmin'] = 1;
			}
			if ( !isset( $settings['enablePluginInFront']) ) {
				$settings['enablePluginInFront'] = 1;
			}

			update_option( EMBEDPRESS_PLG_NAME.":elements", $elements_initial_states);
			update_option( EMBEDPRESS_PLG_NAME, $settings);
			update_option( $option, true);
		}
		$migration_v_320 = 'embedpress_v_320_migration';
		if ( !get_option( $migration_v_320, false) ) {
			$elements = (array) get_option( EMBEDPRESS_PLG_NAME.":elements", []);
			$elements['gutenberg']['embedpress-pdf'] = ['embedpress-pdf'];
			$elements['elementor']['embedpress-pdf'] = ['embedpress-pdf'];
			update_option( EMBEDPRESS_PLG_NAME.":elements", $elements);
			update_option( $migration_v_320, true);
		}

		add_action( 'admin_init', [$this, 'embedpress_maybe_redirect_to_settings']  );


	}
	function embedpress_maybe_redirect_to_settings() {
		$settings = get_option( EMBEDPRESS_PLG_NAME, [] );
		if ( isset( $settings['need_first_time_redirect']) && $settings['need_first_time_redirect'] ) {
			if ( get_option( 'embedpress_activation_redirect_done' ) || wp_doing_ajax() ) {
				return;
			}


			update_option( 'embedpress_activation_redirect_done', true );
			$settings['need_first_time_redirect'] = false;
			update_option( EMBEDPRESS_PLG_NAME, $settings);

			if ( is_network_admin() || isset( $_GET['activate-multi'] ) ) {
				return;
			}

			wp_safe_redirect( admin_url('admin.php?page='.$this->page_slug) );
			exit;
		}

	}
	public function update_elements_list() {
		if ( !empty($_POST['_wpnonce'] && wp_verify_nonce( $_POST['_wpnonce'], 'embedpress_elements_action')) ) {
			$option = EMBEDPRESS_PLG_NAME.":elements";
			$elements = (array) get_option( $option, []);
			$settings = (array) get_option( EMBEDPRESS_PLG_NAME, []);

			$type = !empty( $_POST['element_type']) ? sanitize_text_field( $_POST['element_type']) : '';
			$name = !empty( $_POST['element_name']) ? sanitize_text_field( $_POST['element_name']) : '';
			$checked = !empty( $_POST['checked']) ? $_POST['checked'] : false;
			if ( 'false' != $checked ) {
				$elements[$type][$name] = $name;
				if ( $type === 'classic' ) {
					$settings[$name]  = 1;
				}
			}else{
				if( isset( $elements[$type]) && isset( $elements[$type][$name])){
					unset( $elements[$type][$name]);
				}
				if ( $type === 'classic' ) {
					$settings[$name]  = 0;
				}
			}
			update_option( EMBEDPRESS_PLG_NAME, $settings);
			update_option( $option, $elements);
			wp_send_json_success();
		}
		wp_send_json_error();
	}

	public function register_menu() {
		add_menu_page( __('EmbedPress Settings', 'embedpress'), 'EmbedPress', 'manage_options', $this->page_slug,
			[ $this, 'render_settings_page' ], EMBEDPRESS_URL_ASSETS.'images/menu-icon.svg', 64 );

	}

	public function handle_scripts_and_styles() {
		if ( !empty( $_REQUEST['page']) && $this->page_slug === $_REQUEST['page'] ) {
			$this->enqueue_styles();
			$this->enqueue_scripts();
		}
	}

	public function enqueue_scripts() {
		if ( !did_action( 'wp_enqueue_media') ) {
			wp_enqueue_media();
		}
		wp_register_script( 'ep-settings-script', EMBEDPRESS_SETTINGS_ASSETS_URL.'js/settings.js', ['jquery', 'wp-color-picker' ], $this->file_version, true );
		wp_enqueue_script( 'ep-settings', EMBEDPRESS_URL_ASSETS . 'js/settings.js', ['jquery', 'wp-color-picker' ], $this->file_version, true );
		wp_localize_script( 'ep-settings-script', 'embedpressObj', array(
			'nonce'  => wp_create_nonce('embedpress_elements_action'),
		) );

		wp_enqueue_script( 'ep-settings-script');
	}

	public function enqueue_styles() {
		wp_enqueue_style( 'ep-settings-style', EMBEDPRESS_SETTINGS_ASSETS_URL.'css/style.css', null, $this->file_version );
		wp_enqueue_style( 'ep-settings-icon-style', EMBEDPRESS_SETTINGS_ASSETS_URL.'css/icon/style.css', null, $this->file_version );
		wp_enqueue_style( 'wp-color-picker' );

	}

	public function render_settings_page(  ) {
		global $template, $page_slug, $nonce_field, $ep_page, $gen_menu_template_names, $brand_menu_template_names, $pro_active, $coming_soon, $success_message, $error_message, $platform_menu_template_names;

		$page_slug = $this->page_slug; // make this available for included template
		$template = !empty( $_GET['page_type'] ) ? sanitize_text_field( $_GET['page_type']) : 'general';
		$nonce_field = wp_nonce_field('ep_settings_nonce', 'ep_settings_nonce', true, false);
		$ep_page = admin_url('admin.php?page='.$this->page_slug);
		$gen_menu_template_names = apply_filters('ep_general_menu_tmpl_names', ['general', 'shortcode',]);
		$platform_menu_template_names = apply_filters('ep_platform_menu_tmpl_names', [ 'youtube', 'vimeo', 'wistia', 'twitch','dailymotion', 'soundcloud' ,'spotify']);
		$brand_menu_template_names = apply_filters('ep_brand_menu_templates', ['custom-logo', 'branding',]);
		$pro_active = is_embedpress_pro_active();
		$coming_soon = "<span class='ep-coming-soon'>". esc_html__( '(Coming soon)', 'embedpress'). "</span>";
		$success_message = esc_html__( "Settings Updated", "embedpress" );
		$error_message = esc_html__( "Ops! Something went wrong.", "embedpress" );
		include_once EMBEDPRESS_SETTINGS_PATH . 'templates/main-template.php';
	}

	public function save_settings() {
		// needs to check for ajax and return response accordingly.
		if ( !empty( $_POST['ep_settings_nonce']) && wp_verify_nonce( $_POST['ep_settings_nonce'], 'ep_settings_nonce') ) {
			$submit_type = !empty( $_POST['submit'] ) ? $_POST['submit'] : '';
			$save_handler_method  = "save_{$submit_type}_settings";
			do_action( "before_{$save_handler_method}");
			do_action( "before_embedpress_settings_save");
			if ( method_exists( $this, $save_handler_method ) ) {
				$this->$save_handler_method();
			}
			do_action( "after_embedpress_settings_save");
			$return_url = isset( $_SERVER['HTTP_REFERER'] ) ? $_SERVER['HTTP_REFERER'] : admin_url();
			$return_url = add_query_arg( 'success', 1, $return_url );
			if ( wp_doing_ajax() ) {
				wp_send_json_success();
			}
			wp_safe_redirect( $return_url);
			exit();
		}
	}

	public function save_general_settings() {
		$settings = (array) get_option( EMBEDPRESS_PLG_NAME, []);
		$settings ['enableEmbedResizeWidth'] = isset( $_POST['enableEmbedResizeWidth']) ? intval( $_POST['enableEmbedResizeWidth']) : 600;
		$settings ['enableEmbedResizeHeight'] = isset( $_POST['enableEmbedResizeHeight']) ? intval( $_POST['enableEmbedResizeHeight']) : 550;

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_general_settings_before_save', $settings, $_POST);

		update_option( EMBEDPRESS_PLG_NAME, $settings);
		do_action( 'ep_general_settings_after_save', $settings, $_POST);
	}

	public function save_youtube_settings() {
		$option_name = EMBEDPRESS_PLG_NAME.':youtube';
		$settings = get_option( $option_name, []);
		$settings['start_time'] = isset( $_POST['start_time']) ? sanitize_text_field( $_POST['start_time']) : 0;
		$settings['end_time'] = isset( $_POST['end_time']) ? sanitize_text_field( $_POST['end_time']) : 0;
		$settings['autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : '';
		$settings['controls'] = isset( $_POST['controls']) ? sanitize_text_field( $_POST['controls']) : '';
		$settings['fs'] = isset( $_POST['fs']) ? sanitize_text_field( $_POST['fs']) : '';
		$settings['iv_load_policy'] = isset( $_POST['iv_load_policy']) ? sanitize_text_field( $_POST['iv_load_policy']) : 1;
		$settings['color'] = isset( $_POST['color']) ? sanitize_text_field( $_POST['color']) : 'red';
		$settings['rel'] = isset( $_POST['rel']) ? sanitize_text_field( $_POST['rel']) : 1;
		$settings['license_key'] = 1; // backward compatibility

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_youtube_settings_before_save', $settings);
		update_option( $option_name, $settings);
		do_action( 'ep_youtube_settings_after_save', $settings);

	}

	public function save_wistia_settings() {
		$option_name = EMBEDPRESS_PLG_NAME.':wistia';
		$settings = get_option( $option_name, []);
		$settings['start_time'] = isset( $_POST['start_time']) ? sanitize_text_field( $_POST['start_time']) : 0;
		$settings['autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : '';
		$settings['display_fullscreen_button'] = isset( $_POST['display_fullscreen_button']) ? sanitize_text_field( $_POST['display_fullscreen_button']) : '';
		$settings['small_play_button'] = isset( $_POST['small_play_button']) ? sanitize_text_field( $_POST['small_play_button']) : '';
		$settings['player_color'] = isset( $_POST['player_color']) ? sanitize_text_field( $_POST['player_color']) : '';
		$settings['plugin_resumable'] = isset( $_POST['plugin_resumable']) ? sanitize_text_field( $_POST['plugin_resumable']) : '';
		$settings['plugin_focus'] = isset( $_POST['plugin_focus']) ? sanitize_text_field( $_POST['plugin_focus']) : '';
		$settings['plugin_rewind'] = isset( $_POST['plugin_rewind']) ? sanitize_text_field( $_POST['plugin_rewind']) : '';
		$settings['display_playbar'] = isset( $_POST['display_playbar']) ? sanitize_text_field( $_POST['display_playbar']) : 1;
		$settings['plugin_rewind_time'] = isset( $_POST['plugin_rewind_time']) ? sanitize_text_field( $_POST['plugin_rewind_time']) : 10;
		$settings['license_key'] = 1; // backward compatibility
		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_wistia_settings_before_save', $settings);
		update_option( $option_name, $settings);
		do_action( 'ep_wistia_settings_after_save', $settings);
	}

	public function save_vimeo_settings() {
		$option_name = EMBEDPRESS_PLG_NAME.':vimeo';
		$settings = get_option( $option_name, []);
		$settings['start_time'] = isset( $_POST['start_time']) ? sanitize_text_field( $_POST['start_time']) : 0;
		$settings['autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : '';
		$settings['color'] = isset( $_POST['color']) ? sanitize_text_field( $_POST['color']) : '#00adef';
		$settings['display_title'] = isset( $_POST['display_title']) ? sanitize_text_field( $_POST['display_title']) : 1;
		$settings['display_author'] = isset( $_POST['display_author']) ? sanitize_text_field( $_POST['display_author']) : 1;
		$settings['display_avatar'] = isset( $_POST['display_avatar']) ? sanitize_text_field( $_POST['display_avatar']) : 1;
		$settings['license_key'] = 1; // backward compatibility
		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_vimeo_settings_before_save', $settings);
		update_option( $option_name, $settings);
		do_action( 'ep_vimeo_settings_after_save', $settings);
	}

	public function save_twitch_settings() {
		$option_name = EMBEDPRESS_PLG_NAME.':twitch';
		$settings = get_option( $option_name, []);
		$settings['embedpress_pro_twitch_autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : 'no';
		$settings['embedpress_pro_fs'] = isset( $_POST['fs']) ? sanitize_text_field( $_POST['fs']) : 'yes';
		$settings['start_time'] = isset( $_POST['start_time']) ? sanitize_text_field( $_POST['start_time']) : 0;
		$settings['embedpress_pro_twitch_theme'] = isset( $_POST['theme']) ? sanitize_text_field( $_POST['theme']) : 'dark';
		$settings['embedpress_pro_twitch_mute'] = isset( $_POST['mute']) ? sanitize_text_field( $_POST['mute']) : 'yes';
		$settings['license_key'] = 1; // backward compatibility
		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_twitch_settings_before_save', $settings);
		update_option( $option_name, $settings);
		do_action( 'ep_twitch_settings_after_save', $settings);
	}

	public function save_spotify_settings() {
		$option_name = EMBEDPRESS_PLG_NAME.':spotify';
		$settings = get_option( $option_name, []);
		$settings['theme'] = isset( $_POST['spotify_theme']) ? sanitize_text_field( $_POST['spotify_theme']) : '1';
		$settings['license_key'] = 1; // backward compatibility

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_spotify_settings_before_save', $settings);
		update_option( $option_name, $settings);
		do_action( 'ep_spotify_settings_after_save', $settings);
		return $settings;
	}

	public function save_custom_logo_settings() {
		do_action( 'before_embedpress_branding_save');
		$settings = (array) get_option( EMBEDPRESS_PLG_NAME, []);
		$settings['embedpress_document_powered_by'] = isset( $_POST['embedpress_document_powered_by']) ? sanitize_text_field( $_POST['embedpress_document_powered_by']) : 'no';
		update_option( EMBEDPRESS_PLG_NAME, $settings);
		do_action( 'after_embedpress_branding_save');

	}

	public function save_dailymotion_settings() {
		$option_name = EMBEDPRESS_PLG_NAME.':dailymotion';
		$settings = get_option( $option_name, []);
		$settings['start_time'] = isset( $_POST['start_time']) ? sanitize_text_field( $_POST['start_time']) : 0;
		$settings['visual'] = isset( $_POST['visual']) ? sanitize_text_field( $_POST['visual']) : '';
		$settings['autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : '';
		$settings['play_on_mobile'] = isset( $_POST['play_on_mobile']) ? sanitize_text_field( $_POST['play_on_mobile']) : '';
		$settings['color'] = isset( $_POST['color']) ? sanitize_text_field( $_POST['color']) : '#dd3333';
		$settings['controls'] = isset( $_POST['controls']) ? sanitize_text_field( $_POST['controls']) : '';
		$settings['video_info'] = isset( $_POST['video_info']) ? sanitize_text_field( $_POST['video_info']) : '';
		$settings['mute'] = isset( $_POST['mute']) ? sanitize_text_field( $_POST['mute']) : '';
		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_dailymotion_settings_before_save', $settings);
		update_option( $option_name, $settings);
		do_action( 'ep_dailymotion_settings_after_save', $settings);
	}

	public function save_soundcloud_settings() {
		$option_name = EMBEDPRESS_PLG_NAME.':soundcloud';
		$settings = get_option( $option_name, []);
		$settings['visual'] = isset( $_POST['visual']) ? sanitize_text_field( $_POST['visual']) : '';
		$settings['autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : '';
		$settings['play_on_mobile'] = isset( $_POST['play_on_mobile']) ? sanitize_text_field( $_POST['play_on_mobile']) : '';
		$settings['share_button'] = isset( $_POST['share_button']) ? sanitize_text_field( $_POST['share_button']) : '';
		$settings['comments'] = isset( $_POST['comments']) ? sanitize_text_field( $_POST['comments']) : '';
		$settings['color'] = isset( $_POST['color']) ? sanitize_text_field( $_POST['color']) : '';
		$settings['artwork'] = isset( $_POST['artwork']) ? sanitize_text_field( $_POST['artwork']) : '';
		$settings['play_count'] = isset( $_POST['play_count']) ? sanitize_text_field( $_POST['play_count']) : '';
		$settings['username'] = isset( $_POST['username']) ? sanitize_text_field( $_POST['username']) : '';

		$settings['license_key'] = 1; // backward compatibility
		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_soundcloud_settings_before_save', $settings);
		update_option( $option_name, $settings);
		do_action( 'ep_soundcloud_settings_after_save', $settings);
	}
}