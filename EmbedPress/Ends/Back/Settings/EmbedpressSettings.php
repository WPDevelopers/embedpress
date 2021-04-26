<?php
namespace EmbedPress\Ends\Back\Settings;

class EmbedpressSettings {
	var $page_slug = '';
	/**
	 * @var int|string
	 */
	protected $file_version;

	public function __construct($page_slug = 'embedpress-new') {
		$this->page_slug = $page_slug;
		$this->file_version = defined( 'WP_DEBUG') && WP_DEBUG ? time() : EMBEDPRESS_VERSION;
		add_action('admin_enqueue_scripts', [$this, 'handle_scripts_and_styles']);
		add_action('admin_menu', [$this, 'register_menu']);
		add_action( 'init', [$this, 'save_settings']);

	}

	public function register_menu() {
		add_menu_page( __('EmbedPress Settings', 'embedpress'), 'EmbedPress New', 'manage_options', $this->page_slug,
			[ $this, 'render_settings_page' ], null, 64 );
	}

	public function handle_scripts_and_styles() {
		if ( !empty( $_REQUEST['page']) && $this->page_slug === $_REQUEST['page'] ) {
			$this->enqueue_styles();
			$this->enqueue_scripts();
		}
	}

	public function enqueue_scripts() {
		wp_register_script( 'ep-settings-script', EMBEDPRESS_SETTINGS_ASSETS_URL.'js/settings.js', null, $this->file_version, true );
		wp_enqueue_script( 'ep-settings', EMBEDPRESS_URL_ASSETS . 'js/settings.js', [ 'wp-color-picker' ], $this->file_version, true );
		wp_enqueue_script( 'ep-settings-script');
	}

	public function enqueue_styles() {
		wp_enqueue_style( 'ep-settings-style', EMBEDPRESS_SETTINGS_ASSETS_URL.'css/style.css', null, $this->file_version );
		wp_enqueue_style( 'ep-settings-icon-style', EMBEDPRESS_SETTINGS_ASSETS_URL.'css/icon/style.css', null, $this->file_version );
		wp_enqueue_style( 'wp-color-picker' );

	}

	public function render_settings_page(  ) {
		$page_slug = $this->page_slug; // make this available for included template
		$template = !empty( $_GET['page_type'] ) ? sanitize_text_field( $_GET['page_type']) : 'general';
		$nonce_field = wp_nonce_field('ep_settings_nonce', 'ep_settings_nonce', true, false);
		$ep_page = admin_url('admin.php?page='.$this->page_slug);
		$gen_menu_template_names = apply_filters('ep_general_menu_tmpl_names', ['general', 'youtube', 'vimeo', 'wistia', 'twitch']);
		$brand_menu_template_names = apply_filters('ep_brand_menu_templates', ['custom-logo', 'branding',]);
		include_once EMBEDPRESS_SETTINGS_PATH . 'templates/main-template.php';
	}

	public function save_settings(  ) {
		/*
		 * EMBEDPRESS_PLG_NAME.':twitch', youtube, vimeo, wistia
		 *
		 * */
		if ( !empty( $_POST['ep_settings_nonce']) && wp_verify_nonce( $_POST['ep_settings_nonce'], 'ep_settings_nonce') ) {
			$submit_type = !empty( $_POST['submit'] ) ? $_POST['submit'] : '';
			$save_handler_method  = "save_{$submit_type}_settings";
			if ( method_exists( $this, $save_handler_method ) ) {
				$this->$save_handler_method();
			}
		}
	}

	public function save_general_settings() {
		$settings = (array) get_option( EMBEDPRESS_PLG_NAME);
		$settings ['enableEmbedResizeWidth'] = isset( $_POST['enableEmbedResizeWidth']) ? intval( $_POST['enableEmbedResizeWidth']) : 600;
		$settings ['enableEmbedResizeHeight'] = isset( $_POST['enableEmbedResizeHeight']) ? intval( $_POST['enableEmbedResizeHeight']) : 550;

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_general_settings_before_save', $settings, $_POST);

		update_option( EMBEDPRESS_PLG_NAME, $settings);
		do_action( 'ep_general_settings_after_save', $settings, $_POST);
	}

	public function save_youtube_settings() {
		$opttion_name = EMBEDPRESS_PLG_NAME.':youtube';
		$settings = get_option( $opttion_name);
		$settings['autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : '';
		$settings['controls'] = isset( $_POST['controls']) ? sanitize_text_field( $_POST['controls']) : '';
		$settings['fs'] = isset( $_POST['fs']) ? sanitize_text_field( $_POST['fs']) : '';
		$settings['iv_load_policy'] = isset( $_POST['iv_load_policy']) ? sanitize_text_field( $_POST['iv_load_policy']) : '';

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_youtube_settings_before_save', $settings, $_POST);
		update_option( $opttion_name, $settings);
		do_action( 'ep_youtube_settings_after_save', $settings, $_POST);

	}

	public function save_wistia_settings() {
		$opttion_name = EMBEDPRESS_PLG_NAME.':wistia';
		$settings = get_option( $opttion_name);
		$settings['autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : '';
		$settings['display_fullscreen_button'] = isset( $_POST['display_fullscreen_button']) ? sanitize_text_field( $_POST['display_fullscreen_button']) : '';
		$settings['small_play_button'] = isset( $_POST['small_play_button']) ? sanitize_text_field( $_POST['small_play_button']) : '';
		$settings['player_color'] = isset( $_POST['player_color']) ? sanitize_text_field( $_POST['player_color']) : '';
		$settings['plugin_resumable'] = isset( $_POST['plugin_resumable']) ? sanitize_text_field( $_POST['plugin_resumable']) : '';
		$settings['plugin_focus'] = isset( $_POST['plugin_focus']) ? sanitize_text_field( $_POST['plugin_focus']) : '';

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_wistia_settings_before_save', $settings, $_POST);
		update_option( $opttion_name, $settings);
		do_action( 'ep_wistia_settings_after_save', $settings, $_POST);
	}

	public function save_vimeo_settings() {
		$opttion_name = EMBEDPRESS_PLG_NAME.':vimeo';
		$settings = get_option( $opttion_name);
		$settings['autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : '';
		$settings['color'] = isset( $_POST['color']) ? sanitize_text_field( $_POST['color']) : '';
		$settings['display_title'] = isset( $_POST['display_title']) ? sanitize_text_field( $_POST['display_title']) : '';

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_vimeo_settings_before_save', $settings, $_POST);
		update_option( $opttion_name, $settings);
		do_action( 'ep_vimeo_settings_after_save', $settings, $_POST);
	}

	public function save_twitch_settings() {
		$opttion_name = EMBEDPRESS_PLG_NAME.':twitch';
		$settings = get_option( $opttion_name);
		$settings['embedpress_pro_twitch_autoplay'] = isset( $_POST['autoplay']) ? sanitize_text_field( $_POST['autoplay']) : '';
		$settings['embedpress_pro_fs'] = isset( $_POST['fs']) ? sanitize_text_field( $_POST['fs']) : '';

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_twitch_settings_before_save', $settings, $_POST);
		update_option( $opttion_name, $settings);
		do_action( 'ep_twitch_settings_after_save', $settings, $_POST);
	}
}