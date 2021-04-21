<?php
namespace EmbedPress\Ends\Back\Settings;

class EmbedpressSettings {

	/**
	 * @var int|string
	 */
	protected $file_version;

	public function __construct() {
		$this->file_version = defined( 'WP_DEBUG') && WP_DEBUG ? time() : EMBEDPRESS_VERSION;
		add_action('admin_enqueue_scripts', [$this, 'handle_scripts_and_styles']);
		add_action('admin_menu', [$this, 'register_menu']);
		add_action( 'init', [$this, 'save_settings']);

	}

	public function register_menu() {
		add_menu_page( __('EmbedPress Settings', 'embedpress'), 'EmbedPress New', 'manage_options', 'embedpress-new',
			[ $this, 'render_settings_page' ], null, 64 );
	}

	public function handle_scripts_and_styles() {
		$this->enqueue_styles();
		$this->enqueue_scripts();
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
		$template = !empty( $_GET['page_type'] ) ? sanitize_text_field( $_GET['page_type']) : 'general';
        include_once EMBEDPRESS_SETTINGS_PATH . 'templates/main-template.php';
	}

	public function save_settings(  ) {
		//error_log( print_r( $_REQUEST, 1));
	}
}