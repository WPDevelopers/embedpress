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
		$settings = [
			'enableEmbedResizeWidth' => !empty( $_POST['enableEmbedResizeWidth']) ? intval( $_POST['enableEmbedResizeWidth']) : 600,
			'enableEmbedResizeHeight' => !empty( $_POST['enableEmbedResizeHeight']) ? intval( $_POST['enableEmbedResizeHeight']) : 550,
			'g_lazyload' => !empty( $_POST['g_lazyload']) ? sanitize_text_field( $_POST['g_lazyload']) : '',
		];

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_general_settings_before_save', $settings, $_POST);

		update_option( EMBEDPRESS_PLG_NAME, $settings);

	}

	public function save_youtube_settings() {
		$settings = [

		];

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_youtube_settings_before_save', $settings, $_POST);

		update_option( EMBEDPRESS_PLG_NAME.':youtube', $settings);

	}
}