<?php
namespace EmbedPress\Ends\Back\Settings;

use EmbedPress\Includes\Classes\Helper; 

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

		// Add activation redirect hook
		add_action( 'admin_init', [$this, 'embedpress_maybe_redirect_to_settings']);

		// ajax
		add_action( 'wp_ajax_embedpress_elements_action', [$this, 'update_elements_list']);
		add_action( 'wp_ajax_embedpress_settings_action', [$this, 'save_settings']);
		add_action( 'wp_ajax_save_global_brand_image', [$this, 'save_global_brand_image']);
		add_action( 'wp_ajax_embedpress_dismiss_element', [$this, 'dismiss_element']);

		$g_settings = get_option( EMBEDPRESS_PLG_NAME, [] );

		if(!isset($g_settings['turn_off_rating_help'])){
			$g_settings['turn_off_rating_help'] = true;
			update_option(EMBEDPRESS_PLG_NAME, $g_settings);
		}
		

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
			$elements['gutenberg']['embedpress-pdf'] = 'embedpress-pdf';
			$elements['elementor']['embedpress-pdf'] = 'embedpress-pdf';
			update_option( EMBEDPRESS_PLG_NAME.":elements", $elements);
			update_option( $migration_v_320, true);
		}

		$migration_v_330 = 'embedpress_v_330_migration';
		if ( !get_option( $migration_v_330, false) ) {
			$elements = (array) get_option( EMBEDPRESS_PLG_NAME.":elements", []);
			$elements['gutenberg']['embedpress-calendar'] = 'embedpress-calendar';
			$elements['elementor']['embedpress-calendar'] = 'embedpress-calendar';
			update_option( EMBEDPRESS_PLG_NAME.":elements", $elements);
			update_option( $migration_v_330, true);
		}

		add_action( 'admin_init', [$this, 'embedpress_maybe_redirect_to_settings']  );

		


	}
	function embedpress_maybe_redirect_to_settings() {
		$settings = get_option( EMBEDPRESS_PLG_NAME, [] );
		if ( isset( $settings['need_first_time_redirect']) && $settings['need_first_time_redirect'] ) {
			// Skip redirect if already done, doing AJAX, or in certain admin contexts
			if ( get_option( 'embedpress_activation_redirect_done' ) || wp_doing_ajax() || wp_doing_cron() ) {
				return;
			}

			// Skip redirect for bulk activations, network admin, or CLI
			if ( is_network_admin() || isset( $_GET['activate-multi'] ) || defined( 'WP_CLI' ) ) {
				return;
			}

			// Skip redirect if not in admin area or if user doesn't have proper capabilities
			if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
				return;
			}

			// Skip redirect if we're already on the EmbedPress settings page
			if ( isset( $_GET['page'] ) && $_GET['page'] === $this->page_slug ) {
				return;
			}

			// Set redirect done flag and clear the redirect trigger
			update_option( 'embedpress_activation_redirect_done', true );
			$settings['need_first_time_redirect'] = false;
			update_option( EMBEDPRESS_PLG_NAME, $settings);

			// Perform the redirect
			wp_safe_redirect( admin_url('admin.php?page='.$this->page_slug) );
			exit;
		}
	}
	public function update_elements_list() {

		if (!current_user_can('manage_options')) {
			wp_send_json_error(array('message' => 'You do not have sufficient permissions to access this functionality.'));
			return;
		}
		
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

		// Add Dashboard submenu (replaces the default first submenu item)
		add_submenu_page( $this->page_slug, __('EmbedPress Dashboard', 'embedpress'), __('Dashboard', 'embedpress'), 'manage_options', $this->page_slug,
			[ $this, 'render_settings_page' ] );
			
		// Add Branding submenu
		add_submenu_page( $this->page_slug, __('EmbedPress Branding', 'embedpress'), __('Branding', 'embedpress'), 'manage_options', $this->page_slug . '&page_type=custom-logo',
			[ $this, 'render_settings_page' ] );

		// Add Custom Ads submenu
		add_submenu_page( $this->page_slug, __('EmbedPress Custom Ads', 'embedpress'), __('Custom Ads', 'embedpress'), 'manage_options', $this->page_slug . '&page_type=ads',
			[ $this, 'render_settings_page' ] );


		// Add Shortcode submenu
		add_submenu_page( $this->page_slug, __('EmbedPress Shortcode', 'embedpress'), __('Shortcode', 'embedpress'), 'manage_options', $this->page_slug . '&page_type=shortcode',
			[ $this, 'render_settings_page' ] );

		// Add Settings submenu
		add_submenu_page( $this->page_slug, __('EmbedPress Settings', 'embedpress'), __('Settings', 'embedpress'), 'manage_options', $this->page_slug . '&page_type=settings',
			[ $this, 'render_settings_page' ] );


			// Add License submenu (only if pro is active)
		if ( apply_filters('embedpress/is_allow_rander', false) ) {
			add_submenu_page( $this->page_slug, __('EmbedPress License', 'embedpress'), __('License', 'embedpress'), 'manage_options', $this->page_slug . '&page_type=license',
				[ $this, 'render_settings_page' ] );
		}

		// Add admin footer script to handle menu highlighting
		add_action('admin_footer', [$this, 'admin_menu_highlight_script']);

		// Add filter to reorder menu items - License should be last
		add_filter('admin_menu', [$this, 'reorder_submenu_items'], 999);
	}

	public function handle_scripts_and_styles() {
		if ( !empty( $_REQUEST['page']) && $this->page_slug === $_REQUEST['page'] ) {
			$this->enqueue_styles();
			$this->enqueue_scripts();
		}
	}

	public function admin_menu_highlight_script() {
		// Only load on EmbedPress admin pages
		$current_page = isset($_GET['page']) ? sanitize_text_field($_GET['page']) : '';
		if ($current_page !== $this->page_slug) {
			return;
		}

		$page_type = isset($_GET['page_type']) ? sanitize_text_field($_GET['page_type']) : '';
		// Fixed: Evaluate PHP filter on server-side before passing to JavaScript
		$is_pro_active = apply_filters('embedpress/is_allow_rander', false);

		?>
		<script type="text/javascript">
		/* EmbedPress Admin Menu Highlight Script - Fixed apply_filters issue */
		jQuery(document).ready(function($) {
			// Remove current highlighting
			$('#adminmenu .wp-submenu li').removeClass('current');
			$('#adminmenu .wp-submenu a').removeClass('current');

			var pageType = '<?php echo esc_js($page_type); ?>';
			var isProActive = <?php echo $is_pro_active ? 'true' : 'false'; ?>;
			var menuSelector = '';

			// Map page types to menu selectors
			switch(pageType) {
				case 'settings':
					menuSelector = 'a[href*="page_type=settings"]';
					break;
				case 'shortcode':
					menuSelector = 'a[href*="page_type=shortcode"]';
					break;
				case 'sources':
					menuSelector = 'a[href*="page_type=sources"]';
					break;
				case 'elements':
					menuSelector = 'a[href*="page_type=elements"]';
					break;
				case 'custom-logo':
					menuSelector = 'a[href*="page_type=custom-logo"]';
					break;
				case 'ads':
					menuSelector = 'a[href*="page_type=ads"]';
					break;
				case 'license':
					menuSelector = 'a[href*="page_type=license"]';
					break;
				default:
					// Default to Dashboard (no page_type or hub)
					menuSelector = 'a[href="admin.php?page=<?php echo esc_js($this->page_slug); ?>"]';
					break;
			}

			// Highlight the correct menu item
			if (menuSelector) {
				var $menuItem = $('#adminmenu .wp-submenu ' + menuSelector);
				if ($menuItem.length) {
					$menuItem.addClass('current').parent().addClass('current');
				}
			}

			// Scroll to embedpress-body section when page_type is present
			if (pageType && pageType !== '' && !isProActive) {
				var $embedpressBody = $('.embedpress-body');
				if ($embedpressBody.length) {
					// Get the scroll container (could be window, body, or template wrapper)
					var scrollTop = $embedpressBody.offset().top - 60; // 20px offset from top

					// Function to find the scrollable parent
					function findScrollableParent(element) {
						var $element = $(element);
						var $parents = $element.parents().addBack();

						for (var i = 0; i < $parents.length; i++) {
							var $parent = $($parents[i]);
							if ($parent[0] === document.documentElement || $parent[0] === document.body) {
								return $('html, body');
							}

							var overflow = $parent.css('overflow-y');
							if (overflow === 'scroll' || overflow === 'auto') {
								if ($parent[0].scrollHeight > $parent[0].clientHeight) {
									return $parent;
								}
							}
						}
						return $('html, body');
					}

					// Find and scroll the appropriate container
					var $scrollContainer = findScrollableParent($embedpressBody);
					$scrollContainer.animate({
						scrollTop: scrollTop
					}, 100);
				}
			}
		});
		</script>
		<?php
	}

	public function enqueue_scripts() {
		if ( !did_action( 'wp_enqueue_media') ) {
			wp_enqueue_media();
		}
		// Settings assets and localization are now handled by AssetManager and LocalizationManager
		// This method is kept for backward compatibility but functionality has been moved
	}

	public function enqueue_styles() {
		// Settings styles are now handled by AssetManager
		// Keep only WordPress core styles that are needed
		wp_enqueue_style( 'wp-color-picker' );
	}

	public function render_settings_page(  ) {
		global $template, $page_slug, $nonce_field, $ep_page, $gen_menu_template_names, $brand_menu_template_names, $pro_active, $coming_soon, $success_message, $error_message, $platform_menu_template_names;

		$page_slug = $this->page_slug; // make this available for included template
		$template = !empty( $_GET['page_type'] ) ? sanitize_file_name( $_GET['page_type']) : 'hub';
		
		$nonce_field = wp_nonce_field('ep_settings_nonce', 'ep_settings_nonce', true, false);
		$ep_page = admin_url('admin.php?page='.$this->page_slug);
		$gen_menu_template_names = apply_filters('ep_general_menu_tmpl_names', ['settings', 'shortcode',]);
		$platform_menu_template_names = apply_filters('ep_platform_menu_tmpl_names', [ 'youtube', 'vimeo', 'wistia', 'twitch','dailymotion', 'soundcloud' ,'spotify','google-calendar','opensea']);
		$brand_menu_template_names = apply_filters('ep_brand_menu_templates', ['custom-logo', 'branding',]);
		$pro_active = apply_filters('embedpress/is_allow_rander', false);
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

	public function save_settings_settings() {
		$settings = (array) get_option( EMBEDPRESS_PLG_NAME, []);
		$settings ['enableEmbedResizeWidth'] = isset( $_POST['enableEmbedResizeWidth']) ? intval( $_POST['enableEmbedResizeWidth']) : 600;
		$settings ['enableEmbedResizeHeight'] = isset( $_POST['enableEmbedResizeHeight']) ? intval( $_POST['enableEmbedResizeHeight']) : 550;
		$settings ['pdf_custom_color_settings'] = isset( $_POST['pdf_custom_color_settings']) ? intval( $_POST['pdf_custom_color_settings']) : 0;
		$settings ['turn_off_rating_help'] = isset( $_POST['turn_off_rating_help']) ? intval( $_POST['turn_off_rating_help']) : 0;

		$settings ['custom_color'] = isset( $_POST['custom_color']) ? $_POST['custom_color'] : '#333333';

		// Pro will handle g_loading_animation settings and other
		// Keep backward compatibility with old filter names
		$settings = apply_filters( 'ep_general_settings_before_save', $settings, $_POST);
		$settings = apply_filters( 'ep_settings_settings_before_save', $settings, $_POST);

		update_option( EMBEDPRESS_PLG_NAME, $settings);

		// Keep backward compatibility with old action names
		do_action( 'ep_general_settings_after_save', $settings, $_POST);
		do_action( 'ep_settings_settings_after_save', $settings, $_POST);
	}

	// Keep backward compatibility method
	public function save_general_settings() {
		return $this->save_settings_settings();
	}

	public function save_youtube_settings() {
		$option_name = EMBEDPRESS_PLG_NAME.':youtube';
		$settings = get_option( $option_name, []);
		$settings['api_key'] = isset( $_POST['api_key']) ? sanitize_text_field( $_POST['api_key']) : 0;
		$settings['pagesize'] = isset( $_POST['pagesize']) ? sanitize_text_field( $_POST['pagesize']) : 0;
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

	public function save_gcalendar_settings() {
		$client_secret = !empty( $_POST['epgc_client_secret']) ? json_decode( wp_unslash( trim( $_POST['epgc_client_secret'])), true) : [];
		$epgc_cache_time = !empty( $_POST['epgc_cache_time'] ) ? absint( $_POST['epgc_cache_time']) : 0;
		$epgc_selected_calendar_ids = !empty( $_POST['epgc_selected_calendar_ids'] ) ? array_map( 'sanitize_text_field', $_POST['epgc_selected_calendar_ids']) : [];


		$pretty_client_secret = '';
		if ( !empty( $client_secret) ) {
			$pretty_client_secret = $this->get_pretty_json_string( $client_secret);
		}

		update_option( 'epgc_client_secret', $pretty_client_secret);
		update_option( 'epgc_cache_time', $epgc_cache_time);
		update_option( 'epgc_selected_calendar_ids', $epgc_selected_calendar_ids);

	}

	public function save_opensea_settings() {
		$option_name = EMBEDPRESS_PLG_NAME.':opensea';
		$settings = get_option( $option_name, []);
		$settings['api_key'] = isset( $_POST['api_key']) ? sanitize_text_field( $_POST['api_key']) : 0;
		$settings['limit'] = isset( $_POST['limit']) ? sanitize_text_field( $_POST['limit']) : 0;
		$settings['orderby'] = isset( $_POST['orderby']) ? sanitize_text_field( $_POST['orderby']) : 0;
		
		$settings['license_key'] = 1; // backward compatibility

		// Pro will handle g_loading_animation settings and other
		$settings = apply_filters( 'ep_opensea_settings_before_save', $settings);
		update_option( $option_name, $settings);
		do_action( 'ep_opensea_settings_after_save', $settings);
	}


	function get_pretty_json_string($array) {
		return str_replace("    ", "  ", json_encode($array, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
	}

	/**
	 * AJAX handler for saving global brand image
	 */
	public function save_global_brand_image() {
		// Verify nonce for security
		if (!wp_verify_nonce($_POST['nonce'], 'embedpress_ajax_nonce')) {
			wp_die('Security check failed');
		}

		// Check user capabilities
		if (!current_user_can('manage_options')) {
			wp_die('Insufficient permissions');
		}

		$logo_url = isset($_POST['logo_url']) ? esc_url_raw($_POST['logo_url']) : '';
		$logo_id = isset($_POST['logo_id']) ? intval($_POST['logo_id']) : '';

		// Save global brand settings
		$global_brand_settings = [
			'logo_url' => $logo_url,
			'logo_id' => $logo_id,
		];

		$updated = update_option(EMBEDPRESS_PLG_NAME . ':global_brand', $global_brand_settings);

		// If global brand image is being set, auto-enable branding for providers without custom logos
		if (!empty($logo_url)) {
			$this->auto_enable_global_branding($logo_url, $logo_id);
		}

		if ($updated !== false) {
			wp_send_json_success([
				'message' => 'Global brand image saved successfully',
				'logo_url' => $logo_url,
				'logo_id' => $logo_id
			]);
		} else {
			wp_send_json_error('Failed to save global brand image');
		}
	}

	/**
	 * AJAX handler for dismissing UI elements (banners, popups, etc.)
	 */
	public function dismiss_element() {
		// Verify nonce for security
		if (!wp_verify_nonce($_POST['nonce'], 'embedpress_ajax_nonce')) {
			wp_die('Security check failed');
		}

		// Check user capabilities
		if (!current_user_can('manage_options')) {
			wp_die('Insufficient permissions');
		}

		$element_type = isset($_POST['element_type']) ? sanitize_text_field($_POST['element_type']) : '';

		// Define valid dismiss types and their corresponding option names
		$valid_dismiss_types = [
			'main_banner' => 'embedpress_main_banner_dismissed',
			'hub_popup' => 'embedpress_hub_popup_dismissed',
			'popup_banner' => 'embedpress_popup_dismissed', // Legacy support
		];

		if (array_key_exists($element_type, $valid_dismiss_types)) {
			$option_name = $valid_dismiss_types[$element_type];
			update_option($option_name, true);

			wp_send_json_success([
				'message' => ucfirst(str_replace('_', ' ', $element_type)) . ' dismissed successfully',
				'element_type' => $element_type,
				'option_name' => $option_name
			]);
		}

		wp_send_json_error([
			'message' => 'Invalid element type: ' . $element_type,
			'valid_types' => array_keys($valid_dismiss_types)
		]);
	}

	/**
	 * Auto-enable branding for all providers that don't have custom logos
	 */
	private function auto_enable_global_branding($logo_url, $logo_id) {
		$providers = ['youtube', 'vimeo', 'wistia', 'twitch', 'dailymotion', 'document'];

		foreach ($providers as $provider) {
			$option_name = EMBEDPRESS_PLG_NAME . ':' . $provider;
			$settings = get_option($option_name, []);

			// Only auto-enable if provider doesn't have a custom logo set
			$has_custom_logo = isset($settings['logo_url']) && !empty($settings['logo_url']);

			if (!$has_custom_logo) {
				// Enable branding but don't set logo_url/logo_id - let the template logic handle global fallback
				$settings['branding'] = 'yes';
				update_option($option_name, $settings);
			}
		}
	}

	/**
	 * Reorder submenu items to put Analytics 2nd and License last
	 */
	public function reorder_submenu_items() {
		global $submenu;

		// Check if our menu exists
		if (!isset($submenu[$this->page_slug])) {
			return;
		}

		$license_item = null;
		$analytics_item = null;
		$reordered_menu = [];

		// Find and extract License and Analytics items
		foreach ($submenu[$this->page_slug] as $item) {
			if (isset($item[0])) {
				if ($item[0] === __('License', 'embedpress')) {
					$license_item = $item;
					continue; // Skip adding to reordered menu
				} elseif ($item[0] === __('Analytics', 'embedpress')) {
					$analytics_item = $item;
					continue; // Skip adding to reordered menu
				}
			}
			$reordered_menu[] = $item;
		}

		// Rebuild the menu with proper order
		$final_menu = [];

		// Add first item (Dashboard)
		if (!empty($reordered_menu[0])) {
			$final_menu[] = $reordered_menu[0];
		}

		// Add Analytics as 2nd item if it exists
		if ($analytics_item !== null) {
			$final_menu[] = $analytics_item;
		}

		// Add remaining items (except first which we already added)
		for ($i = 1; $i < count($reordered_menu); $i++) {
			$final_menu[] = $reordered_menu[$i];
		}

		// Add License at the end if it exists
		if ($license_item !== null) {
			$final_menu[] = $license_item;
		}

		// Replace the submenu with reordered items
		$submenu[$this->page_slug] = $final_menu;
	}
}
