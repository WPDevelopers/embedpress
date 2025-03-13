<?php

namespace EmbedPress\Elementor\Widgets;


use Elementor\Controls_Manager as Controls_Manager;

use Elementor\Plugin;
use Elementor\Widget_Base as Widget_Base;
use EmbedPress\Includes\Classes\Helper;
use EmbedPress\Includes\Traits\Branding;
use EmbedPress\Shortcode;

(defined('ABSPATH')) or die("No direct script access allowed.");

class Embedpress_Elementor extends Widget_Base
{

	use Branding;
	protected $pro_class = '';
	protected $pro_text = '';
	protected $pro_label = '';
	public function get_name()
	{
		return 'embedpres_elementor';
	}

	public function get_title()
	{
		return esc_html__('EmbedPress', 'embedpress');
	}

	public function get_categories()
	{
		return ['embedpress'];
	}

	public function get_custom_help_url()
	{
		return 'https://embedpress.com/documentation';
	}

	public function get_icon()
	{
		return 'icon-embedpress';
	}

	public function get_style_depends() {
		$handler_keys = get_option('enabled_elementor_scripts', []);
		
		$handles = [];
	
		if (isset($handler_keys['enabled_custom_player']) && $handler_keys['enabled_custom_player'] === 'yes') {
			$handles[] = 'plyr';
		}
		if (isset($handler_keys['enabled_instafeed']) && $handler_keys['enabled_instafeed'] === 'yes') {
			$handles[] = 'cg-carousel';
		}
	
		$handles[] = 'embedpress-elementor-css';
		$handles[] = 'embedpress-style';

	
		return $handles;
	}
	
	

	public function get_script_depends()
	{
		$handler_keys = get_option('enabled_elementor_scripts', []);
		
		$handles = [];
	
		if (isset($handler_keys['enabled_custom_player']) && $handler_keys['enabled_custom_player'] === 'yes') {
			$handles[] = 'plyr.polyfilled';
			$handles[] = 'initplyr';
			$handles[] = 'vimeo-player';	
		}
		$handles[] = 'embedpress-front';
		
		if (isset($handler_keys['enabled_ads']) && $handler_keys['enabled_ads'] === 'yes') {
			$handles[] = 'embedpress-ads';
		}

		if (isset($handler_keys['enabled_instafeed']) && $handler_keys['enabled_instafeed'] === 'yes') {
			$handles[] = 'cg-carousel';
		}

		return $handles;
	}


	/**
	 * Get widget keywords.
	 *
	 * Retrieve the list of keywords the widget belongs to.
	 *
	 * @return array Widget keywords.
	 * @since 2.4.1
	 * @access public
	 *
	 */
	public function get_keywords()
	{
		return [
			'embedpress',
			'audio',
			'video',
			'map',
			'youtube',
			'vimeo',
			'wistia',
			'twitch',
			'soundcloud',
			'giphy gifs',
			'spotify',
			'smugmug',
			'meetup',
			'apple',
			'apple podcast',
			'podcast',
			'dailymotion',
			'instagram',
			'slideshare',
			'flickr',
			'ted',
			'google docs',
			'google slides',
			'google drawings'
		];
	}

	

	protected function register_controls()
	{
		$class = 'embedpress-pro-control not-active';
        $text =  '<sup class="embedpress-pro-label" style="color:red">' . __('(pro)', 'embedpress') . '</sup>';
		$label = '(pro)';
        $this->pro_class = apply_filters('embedpress/pro_class', $class);
        $this->pro_label = apply_filters('embedpress/pro_label', $label);
        $this->pro_text = apply_filters('embedpress/pro_text', $text);

		/**
		 * EmbedPress General Settings
		 */
		$this->start_controls_section(
			'embedpress_elementor_content_settings',
			[
				'label' => esc_html__('General', 'embedpress'),
			]
		);

		$this->add_control(
			'instafeed_access_token_notice',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => sprintf('%s <a href="%s" target="_blank">here</a>.',
					esc_html__('To enable full Instagram embedding experience, please add your access token ', 'embedpress'),
					esc_url(admin_url('/admin.php?page=embedpress&page_type=instagram'))
				),
				'content_classes' => 'elementor-panel-alert elementor-panel-warning-info',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'instafeed',
				],
			]
		);
		
		

		do_action('embedpress/embeded/extend', $this);
		$this->add_control(
			'embedpress_pro_embeded_source',
			[
				'label'       => __('Source Name', 'embedpress'),
				'type'        => Controls_Manager::SELECT2,
				'label_block' => false,
				'default'     => 'default',
				'options'     => [
					'default'     => __('Default', 'embedpress'),
					'youtube'     => __('YouTube', 'embedpress'),
					'vimeo'       => __('Vimeo', 'embedpress'),
					'instafeed'  => __('Instagram Feed', 'embedpress'),
					'twitch'      => __('Twitch', 'embedpress'),
					'soundcloud'  => __('SoundCloud', 'embedpress'),
					'dailymotion' => __('Dailymotion', 'embedpress'),
					'wistia'      => __('Wistia', 'embedpress'),
					'calendly'    => __('Calendly', 'embedpress'),
					'opensea'     => __('OpenSea', 'embedpress'),
					'spreaker'    => __('Spreaker', 'embedpress'),
					'google_photos'    => __('Google Photos', 'embedpress'),
					'selfhosted_video' => __('Self-hosted Video', 'embedpress'),
					'selfhosted_audio'  => __('Self-hosted Audio', 'embedpress'),
				]

			]
		);


		$this->add_control(
			'instafeedFeedType',
			[
				'type' => \Elementor\Controls_Manager::SELECT,
				'label' => esc_html__( 'Feed Type', 'embedpress' ),
				'options' => [
					'user_account_type' => esc_html__( 'User Account', 'embedpress' ),
					'hashtag_type' => sprintf(__('Hashtag%s', 'embedpress'), $this->pro_label),
					'tagged_type' => esc_html__( 'Tagged(Coming Soon)', 'embedpress' ),
					'mixed_type' => esc_html__( 'Mixed(Coming Soon)', 'embedpress' ),
				],
				'default' => 'user_account_type',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'instafeed',
				]
			]
		);

		if ( !apply_filters('embedpress/is_allow_rander', false) ) {
			$this->add_control(
				'embedpress_insta_layout__pro_enable_warning_1',
				[
					'label'     => sprintf( '<a style="color: red" target="_blank" href="https://wpdeveloper.com/in/upgrade-embedpress">%s</a>',
						esc_html__( 'Only Available in Pro Version!', 'essential-addons-for-elementor-lite' ) ),
					'type'      => Controls_Manager::RAW_HTML,
					'condition' => [
						'instafeedFeedType' => [ 'hashtag_type'],
					],
				]
			);
		}

		$this->add_control(
			'instafeedAccountType',
			[
				'type' => \Elementor\Controls_Manager::SELECT,
				'label' => esc_html__( 'Account Type', 'embedpress' ),
				'options' => [
					'personal' => esc_html__( 'Personal', 'embedpress' ),
					'business' => esc_html__( 'Business', 'embedpress' ),
				],
				'default' => 'personal',
				'condition'   => [
					'instafeedFeedType' => 'user_account_type',
					'embedpress_pro_embeded_source' => 'instafeed'
				]
			]
		);

		$this->add_control(
			'instafeed_feed_type_important_note',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => 'To embed #hashtag posts you need to connect bussiness account. <a href="'.esc_url('https://embedpress.com/docs/generate-instagram-access-token/').'">Learn More</a>',
				'content_classes' => 'elementor-panel-alert elementor-panel-warning-info',
				'condition'   => [
					'instafeedFeedType' => 'hashtag_type',
				],
			]
		);

		$this->add_control(
			'embedpress_pro_embeded_nft_type',
			[
				'label'       => __('Type', 'embedpress'),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 'collection',
				'options'     => [
					'collection'  => __('Assets Collection', 'embedpress'),
					'single'  => __('Single Asset', 'embedpress'),
				],
				'condition'   => [
					'embedpress_pro_embeded_source' => 'opensea'
				]
			]
		);

		$this->add_control(
			'embedpress_embeded_link',
			[

				'label'       => __('Embedded Link', 'embedpress'),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => [
					'active' => true,
				],
				'placeholder' => __('Enter your Link', 'embedpress'),
				'label_block' => true,
				'ai' => [
					'active' => false,
				],
				'condition'   => [
					'instafeedAccountType!' => 'hashtag'
				]
			
			]
		);

		$this->add_control(
			'embedpress_audio_video_auto_pause',
			[
				'label'        => __('Auto Pause', 'embedpress'),
				'description'        => __('Set it to "Yes" to display related videos from all channels. Otherwise, related videos will show from the same channel.', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => [
					'embedpress_pro_embeded_source' => ['selfhosted_video', 'selfhosted_audio']
				],
			]
		);

		$this->add_control(
			'spotify_theme',
			[
				'label'       => __('Player Background', 'embedpress'),
				'description'       => __('Dynamic option will use the most vibrant color from the album art.', 'embedpress'),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => '1',
				'options'     => [
					'1'   => __('Dynamic', 'embedpress'),
					'0' => __('Black & White', 'embedpress')
				],
				'condition'   => [
					'embedpress_pro_embeded_source' => 'spotify'
				]
			]
		);
		do_action('embedpress/control/extend', $this);

		$this->add_control(
			'emberpress_custom_player',
			[
				'label'        => __('Enable Custom Player', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'condition'   => [
					'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'selfhosted_video', 'selfhosted_audio']
				],
			]
		);

		$this->add_control(
			'custom_player_important_note',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => esc_html__('Custom player take effect only when a single video is embedded.', 'embedpress'),
				'content_classes' => 'elementor-panel-alert elementor-panel-warning-info',
				'condition'   => [
					'emberpress_custom_player' => 'yes',
					'embedpress_pro_embeded_source' => 'youtube',
				],
			]
		);

		$this->add_control(
			'custom_payer_preset',
			[
				'label' => sprintf(__('Preset %s', 'embedpress'), $this->pro_text),

				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 'default',
				'options'     => [
					'default'     => __('Default', 'embedpress'),
					'custom-player-preset-1'     => __('Preset 1', 'embedpress'),
					// 'custom-player-preset-2'       => __('Preset 2', 'embedpress'),
					'custom-player-preset-3' => __('Preset 2', 'embedpress'),
					// 'custom-player-preset-4'      => __('Preset 4', 'embedpress'),
				],
				'classes'     => $this->pro_class,
				'condition' => [
					'emberpress_custom_player' => 'yes',
					'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'selfhosted_video']
				],
			]
		);

		$this->add_control(
			'embedpress_pro_video_start_time',
			[
				'label'       => __('Start Time', 'embedpress'),
				'type'        => Controls_Manager::NUMBER,
				'description' => __('Specify a start time (in seconds)', 'embedpress'),
				'condition'   => [
					'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'wistia', 'dailymotion', 'twitch']
				],
			]
		);




		/**
		 * Initialized controls
		 */
		$this->init_youtube_controls();
		$this->init_vimeo_controls();

		$this->init_wistia_controls();
		$this->init_soundcloud_controls();
		$this->init_dailymotion_control();
		$this->init_twitch_control();
		$this->init_opensea_control();
		$this->end_controls_section();


		$this->init_youtube_channel_section();
		$this->init_youtube_subscription_section();
		$this->init_youtube_livechat_section();


		/**
		 * Opensea Control section
		 */
		$this->init_opensea_control_section();
		$this->init_instafeed_control_section();

		/**
		 * Calendly Control section
		 */
		$this->init_calendly_control_section();

		/**
		 * Spreaker Control section
		 */
		$this->init_spreaker_control_section();
		
		$this->init_google_photos_control_setion();
		


		do_action('extend_elementor_controls', $this, '_', $this->pro_text, $this->pro_class);

		if (!apply_filters('embedpress/is_allow_rander', false)) {
			$this->start_controls_section(
				'embedpress_pro_section',
				[
					'label' => __('Go Premium for More Features', 'embedpress'),
				]
			);

			$this->add_control(
				'embedpress_pro_cta',
				[
					'label' => __('Unlock more possibilities', 'embedpress'),
					'type' => Controls_Manager::CHOOSE,
					'options' => [
						'1' => [
							'title' => '',
							'icon' => 'eicon-lock',
						],
					],
					'default' => '1',
					'description' => '<span class="pro-feature"> Get the  <a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Pro version</a> for more provider support and customization options.</span>',
				]
			);

			$this->end_controls_section();
		}

		$this->init_style_controls();
		$this->init_opensea_color_and_typography();
	}

	/**
	 * Youtube  Controls
	 */

	public function init_youtube_controls()
	{
		$yt_condition = [
			'embedpress_pro_embeded_source' => 'youtube'
		];
		$this->add_control(
			'embedpress_pro_youtube_end_time',
			[
				'label'       => __('End Time', 'embedpress'),
				'type'        => Controls_Manager::NUMBER,
				'description' => __('Specify an end time (in seconds)', 'embedpress'),
				'condition'   => $yt_condition,
			]
		);


		$this->add_control(
			'embedpress_player_color',
			[
				'label' => sprintf(__('Player Color %s', 'embedpress'), $this->pro_text),
				'type'        => Controls_Manager::COLOR,
				'label_block' => false,
				'classes'     => $this->pro_class,
				'default'     => '#5b4e96',
				'condition' => [
					'emberpress_custom_player' => 'yes',
					'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'selfhosted_video', 'selfhosted_audio']
				],
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_auto_play',
			[
				'label'        => __('Auto Play', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'vimeo'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_autopause',
			[
				'label'        => sprintf(__('Auto Pause %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'description'  => __(
					'Automatically stop the current video from playing when another one starts.',
					'embedpress'
				),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'vimeo'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_dnt',
			[
				'label'        => sprintf(__('DNT %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => __(
					'Set this parameter to "yes" will block tracking any session data, including cookies. If Auto Pause is enabled this will not work.',
					'embedpress'
				),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'vimeo'
				],
				'classes'     => $this->pro_class,
			]
		);


		$this->add_control(
			'embedpress_pro_youtube_auto_play',
			[
				'label'        => __('Auto Play', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => $yt_condition,
			]
		);
		$this->add_control(
			'embedpress_pro_youtube_player_options',
			[
				'label'     => __('Player Options', 'embedpress'),
				'type'      => Controls_Manager::HEADING,
				'condition' => [
					'embedpress_pro_embeded_source' => 'youtube',
					'emberpress_custom_player!' => 'yes'
				],
			]
		);
		$this->add_control(
			'embedpress_pro_youtube_display_controls',
			[
				'label'       => __('Controls', 'embedpress'),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 1,
				'options'     => [
					'1' => __('Display immediately', 'embedpress'),
					'2' => __('Display after user initiation', 'embedpress'),
					'0' => __('Hide controls', 'embedpress')
				],
				'condition'   => [
					'embedpress_pro_embeded_source' => 'youtube',
					'emberpress_custom_player!' => 'yes'
				],
			]
		);
		$this->add_control(
			'embedpress_pro_youtube_enable_fullscreen_button',
			[
				'label'        => __('Fullscreen button', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_source'            => ['youtube', 'vimeo'],
					'embedpress_pro_youtube_display_controls!' => '0'
				]
			]
		);
		$this->add_control(
			'embedpress_pro_youtube_display_video_annotations',
			[
				'label'       => __('Video Annotations', 'embedpress'),
				'type'        => Controls_Manager::SWITCHER,
				'label_block' => false,
				'default'     => 1,
				'options'     => [
					'1' => __('Display', 'embedpress'),
					'3' => __('Do Not Display', 'embedpress')
				],
				'condition'   => [
					'embedpress_pro_embeded_source' => 'youtube',
					'emberpress_custom_player!' => 'yes'
				],
			]
		);
		//--- YouTube Pro control starts ---
		$this->add_control(
			'embedpress_pro_youtube_progress_bar_color',
			[
				'label'       => __('Progress Bar Color', 'embedpress'),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 'red',
				'options'     => [
					'red'   => __('Red', 'embedpress'),
					'white' => __('White', 'embedpress')
				],
				'condition'   => [
					'embedpress_pro_embeded_source' => 'youtube',
					'emberpress_custom_player!' => 'yes'
				],
			]
		);
		$this->add_control(
			'embedpress_pro_youtube_force_closed_captions',
			[
				'label'        => sprintf(__('Closed Captions %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'separator'    => 'before',
				'classes'     => $this->pro_class,
				'condition'    => [
					'embedpress_pro_embeded_source' => 'youtube',
					'emberpress_custom_player!' => 'yes'
				],
			]
		);
		$this->add_control(
			'embedpress_pro_youtube_modest_branding',
			[
				'label'       => sprintf(__('Modest Branding %s', 'embedpress'), $this->pro_text),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 1,
				'options'     => [
					'0' => __('Display', 'embedpress'),
					'1' => __('Do Not Display', 'embedpress')
				],
				'condition'   => [
					'embedpress_pro_embeded_source'              => 'youtube',
					'embedpress_pro_youtube_display_controls!'   => '0',
					'embedpress_pro_youtube_progress_bar_color!' => 'white',
					'embedpress_custom_player!' => 'yes',
				],
				'classes'     => $this->pro_class,
			]
		);


		


		do_action('extend_customplayer_controls', $this, '_', $this->pro_text, $this->pro_class);


		$this->add_control(
			'embepress_player_always_on_top',
			[
				'label' => sprintf(__('Sticky Video %s', 'embedpress'), $this->pro_text),
				'description'        => __('Watch video and seamlessly scroll through other content with a sleek pop-up window.', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'classes'     => $this->pro_class,
				'default'      => '',
				'condition' => [
					'emberpress_custom_player' => 'yes',
					'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'selfhosted_video']
				],
			]
		);

		$this->add_control(
			'embedpress_pro_youtube_display_related_videos',
			[
				'label'        => __('Related Videos', 'embedpress'),
				'description'        => __('Set it to "Yes" to display related videos from all channels. Otherwise, related videos will show from the same channel.', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => $yt_condition,
			]
		);



		$this->add_control(
			"embedpress_player_poster_thumbnail",
			[
				'label' => sprintf(__('Thumbnail %s', 'embedpress'), $this->pro_text),
				'type' => Controls_Manager::MEDIA,
				'dynamic' => [
					'active' => true,
				],
				'classes'     => $this->pro_class,
				'condition' => [
					'emberpress_custom_player' => 'yes',
					'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'selfhosted_video']
				],
			]
		);

		$this->init_branding_controls('youtube');
	}

	public function init_youtube_channel_section()
	{
		$yt_condition = [
			'embedpress_pro_embeded_source' => 'youtube',
		];
		$this->start_controls_section(
			'embedpress_yt_channel_section',
			[
				'label'       => __('YouTube Channel', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'youtube',
					'emberpress_custom_player!' => 'yes'
				],

			]
		);

		$this->add_control(
			'important_note',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => esc_html__('These options take effect only when a YouTube channel is embedded.', 'embedpress'),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
			]
		);

		$this->add_control(
			'ytChannelLayout',
			[
				'label'       => __('Layout', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'label_block' => false,
				'default' => 'gallery',
				'options' => [
					'gallery'  => esc_html__('Gallery', 'embedpress'),
					'list'  => esc_html__('List', 'embedpress'),
					'grid'  => sprintf(esc_html__('Grid %s', 'embedpress'), $this->pro_label),
					'carousel'  => sprintf(esc_html__('Carousel %s', 'embedpress'), $this->pro_label),
				],
				'conditions'  => [
					'terms' => [
						[
							'name' => 'embedpress_pro_embeded_source',
							'operator' => '===',
							'value' => 'youtube',
						],
					],
				]
			]
		);


		$this->add_control(
			'pagesize',
			[
				'label'       => __('Video Per Page', 'embedpress'),
				'type'        => Controls_Manager::NUMBER,
				'label_block' => false,
				'default'     => 6,
				'min'         => 1,
				'max'         => 50,
				'conditions'  => [
					'terms' => [
						[
							'name' => 'embedpress_pro_embeded_source',
							'operator' => '===',
							'value' => 'youtube',
						],
					],
				]
			]
		);

		$this->add_control(
			'columns',
			[
				'label'       => __('Column', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'label_block' => false,
				'default' => '3',
				'options' => [
					'2'  => esc_html__('2', 'embedpress'),
					'3' => esc_html__('3', 'embedpress'),
					'4' => esc_html__('4', 'embedpress'),
					'6' => esc_html__('6', 'embedpress'),
					'auto' => esc_html__('Auto', 'embedpress'),
				],
				'conditions'  => [
					'terms' => [
						[
							'name' => 'embedpress_pro_embeded_source',
							'operator' => '===',
							'value' => 'youtube',
						],
						[
							'name' => 'ytChannelLayout',
							'operator' => '!==',
							'value' => 'list',
						],
						[
							'name' => 'ytChannelLayout',
							'operator' => '!==',
							'value' => 'carousel',
						],
					],
				]
			]
		);
		$this->add_control(
			'gapbetweenvideos',
			[
				'label'       => __('Gap Between Videos', 'embedpress'),
				'label_block' => true,
				'type' => \Elementor\Controls_Manager::SLIDER,
				'size_units' => ['px', '%'],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
						'step' => 1,
					],
					'%' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default' => [
					'unit' => 'px',
					'size' => 30,
				],
				'conditions'  => [
					'terms' => [
						[
							'name' => 'embedpress_pro_embeded_source',
							'operator' => '===',
							'value' => 'youtube',
						],
						[
							'name' => 'ytChannelLayout',
							'operator' => '!==',
							'value' => 'carousel',
						],
					],
				],
				'selectors' => [
					'{{WRAPPER}} .ep-youtube__content__block .youtube__content__body .content__wrap:not(.youtube-carousel)' => 'gap: {{SIZE}}{{UNIT}}!important;margin-top: {{SIZE}}{{UNIT}}!important;',
				],
			]
		);

		$this->add_control(
			'pagination',
			[
				'label'        => __('Pagination', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'label_on' => esc_html__('Show', 'embedpress'),
				'label_off' => esc_html__('Hide', 'embedpress'),
				'return_value' => 'show',
				'default'      => 'show',
				'condition'    => [
					'terms' => [
						[
							'name' => 'embedpress_pro_embeded_source',
							'operator' => '===',
							'value' => 'youtube',
						],
						[
							'name' => 'ytChannelLayout',
							'operator' => '!==',
							'value' => 'carousel',
						],
					],
				],
			]
		);

		$this->end_controls_section();
	}
	public function init_youtube_subscription_section()
	{
		$yt_condition = [
			'embedpress_pro_embeded_source' => 'youtube',
		];
		$this->start_controls_section(
			'embedpress_yt_subscription_section',
			[
				'label'       => __('YouTube Subscriber', 'embedpress'),
				'condition'    => $yt_condition,

			]
		);


		$this->add_control(
			'yt_sub_channel',
			[

				'label'       => sprintf(__('Channel ID %s', 'embedpress'), $this->pro_text),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => [
					'active' => true,
				],
				'placeholder' => __('Enter Channel ID', 'embedpress'),
				'label_block' => true,
				'condition'    => $yt_condition,
				'classes'     => $this->pro_class,
			]
		);
		$this->add_control(
			'yt_sub_text',
			[

				'label'       => sprintf(__('Subscription Text %s', 'embedpress'), $this->pro_text),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => [
					'active' => true,
				],
				'placeholder' => __('Eg. Don\'t miss out! Subscribe', 'embedpress'),
				'label_block' => true,
				'condition'    => $yt_condition,
				'classes'     => $this->pro_class,
			]
		);


		$this->add_control(
			'yt_sub_layout',
			[
				'label'       => sprintf(__('Layout %s', 'embedpress'), $this->pro_text),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 'default',
				'options'     => [
					'default' => __('Default', 'embedpress'),
					'full' => __('Full', 'embedpress')
				],
				'condition'   => [
					'embedpress_pro_embeded_source'              => 'youtube',
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'yt_sub_theme',
			[
				'label'        => sprintf(__('Theme %s', 'embedpress'), $this->pro_text),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 'default',
				'options'     => [
					'default' => __('Default', 'embedpress'),
					'dark' => __('Dark', 'embedpress')
				],
				'condition'   => [
					'embedpress_pro_embeded_source'  => 'youtube',
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'yt_sub_count',
			[
				'label'        => sprintf(__('Subscriber Count %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => $yt_condition,
				'classes'     => $this->pro_class,
			]
		);

		$this->end_controls_section();
	}

	public function init_youtube_livechat_section()
	{
		$yt_condition = [
			'embedpress_pro_embeded_source' => 'youtube',
		];
		$this->start_controls_section(
			'embedpress_yt_livechat_section',
			[
				'label'       => __('YouTube Live Chat', 'embedpress'),
				'condition'    => $yt_condition,

			]
		);

		$this->add_control(
			'yt_lc_show',
			[
				'label'        => sprintf(__('Show YouTube Live Chat %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => $yt_condition,
				'classes'     => $this->pro_class,
			]
		);


		$this->end_controls_section();
	}

	//End Youtube  Controls

	/**
	 * Dailymotion  Controls
	 */
	public function init_dailymotion_control()
	{
		//@TODO; Kamal - migrate from 'embedpress_pro_dailymotion_logo' to 'embedpress_pro_dailymotion_ui_logo'
		$this->add_control(
			'embedpress_pro_dailymotion_ui_logo',
			[
				'label'        => sprintf(__('Logo %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				],
				'classes'     => $this->pro_class,
			]
		);
		$this->add_control(
			'embedpress_pro_dailymotion_autoplay',
			[
				'label'        => __('Auto Play', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);
		$this->add_control(
			'embedpress_pro_dailymotion_play_on_mobile',
			[
				'label'        => __('Play On Mobile', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion',
					'embedpress_pro_dailymotion_autoplay' => 'yes'
				]
			]
		);
		$this->add_control(
			'embedpress_pro_dailymotion_mute',
			[
				'label'        => __('Mute', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);
		$this->add_control(
			'embedpress_pro_dailymotion_player_control',
			[
				'label'        => __('Player Controls', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);
		$this->add_control(
			'embedpress_pro_dailymotion_video_info',
			[
				'label'        => __('Video Info', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);
		$this->add_control(
			'embedpress_pro_dailymotion_control_color',
			[
				'label'       => __('Control Color', 'embedpress'),
				'type'        => Controls_Manager::COLOR,
				'label_block' => false,
				'default'     => '#dd3333',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);
		$this->init_branding_controls('dailymotion');
	}
	//End Dailymotion  Controls

	/**
	 * Wistia  Controls
	 */
	public function init_wistia_controls()
	{
		$this->add_control(
			'embedpress_pro_wistia_auto_play',
			[
				'label'        => __('Auto Play', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'wistia'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_wistia_color',
			[
				'label'       => __('Scheme', 'embedpress'),
				'type'        => Controls_Manager::COLOR,
				'label_block' => false,
				'default'     => '#dd3333',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'wistia'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_wistia_player_options',
			[
				'label'     => __('Player Options', 'embedpress'),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'embedpress_pro_embeded_source' => 'wistia'
				]
			]
		);



		$this->add_control(
			'embedpress_pro_wistia_fullscreen_button',
			[
				'label'        => __('Fullscreen Button', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'wistia'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_wistia_small_play_button',
			[
				'label'        => __('Small Play Button', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'wistia'
				],
			]
		);




		// $this->add_control(
		// 	'embedpress_pro_wistia_resumable',
		// 	[
		// 		'label'        => __('Resumable', 'embedpress'),
		// 		'type'         => Controls_Manager::SWITCHER,
		// 		'label_block'  => false,
		// 		'return_value' => 'yes',
		// 		'default'      => 'no',
		// 		'condition'    => [
		// 			'embedpress_pro_embeded_source' => 'wistia'
		// 		],
		// 	]
		// );


		// $this->add_control(
		// 	'embedpress_pro_wistia_focus',
		// 	[
		// 		'label'        => __('Focus', 'embedpress'),
		// 		'type'         => Controls_Manager::SWITCHER,
		// 		'label_block'  => false,
		// 		'return_value' => 'yes',
		// 		'default'      => 'no',
		// 		'condition'    => [
		// 			'embedpress_pro_embeded_source' => 'wistia'
		// 		],
		// 	]
		// );

		// --- Wistia PRO Controls --
		$this->add_control(
			'embedpress_pro_wistia_captions',
			[
				'label'        => sprintf(__('Captions %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'wistia'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_wistia_captions_enabled_by_default',
			[
				'label'        => sprintf(__('Caption Enabled by Default', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'wistia',
					'embedpress_pro_wistia_captions' => 'yes'
				],
				'classes'     => $this->pro_class,
			]
		);
		$this->add_control(
			'embedpress_pro_wistia_playbar',
			[
				'label'        => __('Playbar ', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'wistia'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_wistia_volume_control',
			[
				'label'        => sprintf(__('Volume Control %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'wistia'
				],
				'classes'     => $this->pro_class,
			]
		);


		$this->add_control(
			'embedpress_pro_wistia_volume',
			[
				'label'     => sprintf(__('Volume %s', 'embedpress'), $this->pro_text),
				'type'      => Controls_Manager::SLIDER,
				'default'   => [
					'size' => 100,
				],
				'range'     => [
					'px' => [
						'min' => 0,
						'max' => 100,
					]
				],
				'condition' => [
					'embedpress_pro_embeded_source'        => 'wistia',
					'embedpress_pro_wistia_volume_control' => 'yes'
				],
				'classes'     => $this->pro_class,
			]
		);

		// $this->add_control(
		// 	'embedpress_pro_wistia_rewind',
		// 	[
		// 		'label'        => __('Rewind', 'embedpress'),
		// 		'type'         => Controls_Manager::SWITCHER,
		// 		'label_block'  => false,
		// 		'return_value' => 'yes',
		// 		'default'      => 'no',
		// 		'condition'    => [
		// 			'embedpress_pro_embeded_source' => 'wistia'
		// 		],
		// 	]
		// );

		// $this->add_control(
		// 	'embedpress_pro_wistia_rewind_time',
		// 	[
		// 		'label'     => __('Rewind time', 'embedpress'),
		// 		'type'      => Controls_Manager::SLIDER,
		// 		'default'   => [
		// 			'size' => 10,
		// 		],
		// 		'range'     => [
		// 			'px' => [
		// 				'min' => 1,
		// 				'max' => 100,
		// 			]
		// 		],
		// 		'condition' => [
		// 			'embedpress_pro_wistia_rewind'  => 'yes',
		// 			'embedpress_pro_embeded_source' => 'wistia'
		// 		],
		// 	]
		// );
		$this->init_branding_controls('wistia');
	}
	//End Wistia controls



	/**
	 * Twitch  Controls
	 */
	public function init_twitch_control()
	{
		$condition = [
			'embedpress_pro_embeded_source' => 'twitch'
		];
		$this->add_control(
			'embedpress_pro_twitch_autoplay',
			[
				'label'        => __('Autoplay', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_off'    => __('No', 'embedpress'),
				'label_on'     => __('Yes', 'embedpress'),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);
		$this->add_control(
			'embedpress_pro_fs',
			[
				'label'        => __('Allow Full Screen Video', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_off'    => __('No', 'embedpress'),
				'label_on'     => __('Yes', 'embedpress'),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);

		// -- Twitch PRO controls --
		$this->add_control(
			'embedpress_pro_twitch_chat',
			[
				'label'        => sprintf(__('Show Chat %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => $condition,
				'classes'     => $this->pro_class,

			]
		);
		$this->add_control(
			'embedpress_pro_twitch_mute',
			[
				'label'        => __('Mute on start', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => $condition,
			]
		);
		$this->add_control(
			'embedpress_pro_twitch_theme',
			[
				'label' => __('Theme', 'embedpress'),
				'type' => Controls_Manager::SELECT,
				'default' => 'dark',
				'options' => [
					'dark'  => __('Dark', 'embedpress'),
					'light' => __('Light', 'embedpress'),
				],
				'condition'    => $condition,
			]
		);

		$this->init_branding_controls('twitch');
	}
	//End Twitch controls


	/**
	 * SoundCloud  Controls
	 */
	public function init_soundcloud_controls()
	{
		$this->add_control(
			'embedpress_pro_soundcloud_visual',
			[
				'label'        => __('Visual Player', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_color',
			[
				'label'       => __('Scheme', 'embedpress'),
				'type'        => Controls_Manager::COLOR,
				'label_block' => false,
				'default'     => '#FF5500',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_autoplay',
			[
				'label'        => __('Auto Play', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);



		$this->add_control(
			'embedpress_pro_soundcloud_share_button',
			[
				'label'        => __('Share Button', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_comments',
			[
				'label'        => __('Comments', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);



		$this->add_control(
			'embedpress_pro_soundcloud_artwork',
			[
				'label'        => __('Artwork', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source'     => 'soundcloud',
					'embedpress_pro_soundcloud_visual!' => 'yes'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_play_count',
			[
				'label'        => __('Play Count', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud',
					'embedpress_pro_soundcloud_visual!' => 'yes'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_user_name',
			[
				'label'        => __('User Name', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_buy_button',
			[
				'label'        => sprintf(__('Buy Button %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
				'classes'     => $this->pro_class,
			]
		);
		$this->add_control(
			'embedpress_pro_soundcloud_download_button',
			[
				'label'        => sprintf(__('Download Button %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
				'classes'     => $this->pro_class,
			]
		);
	}
	//End SoundCloud controls

	/**
	 * Vimeo  Controls
	 */
	public function init_vimeo_controls()
	{



		$this->add_control(
			'embedpress_pro_vimeo_color',
			[
				'label'       => __('Scheme', 'embedpress'),
				'type'        => Controls_Manager::COLOR,
				'label_block' => false,
				'default'     => '#00adef',
				'condition'   => [
					'emberpress_custom_player!' => 'yes',
					'embedpress_pro_embeded_source' => 'vimeo'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_author_options',
			[
				'label'     => __('Author Information', 'embedpress'),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'embedpress_pro_embeded_source' => 'vimeo',
					'emberpress_custom_player!' => 'yes',
				]
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_display_title',
			[
				'label'        => __('Title', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'emberpress_custom_player!' => 'yes',
					'embedpress_pro_embeded_source' => 'vimeo'
				]
			]
		);

		//----- Vimeo PRO controls

		$this->add_control(
			'embedpress_pro_vimeo_display_author',
			[
				'label'        => __('Author', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'emberpress_custom_player!' => 'yes',
					'embedpress_pro_embeded_source' => 'vimeo'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_avatar',
			[
				'label'        => __('Avatar', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'emberpress_custom_player!' => 'yes',
					'embedpress_pro_embeded_source' => 'vimeo'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_loop',
			[
				'label'        => sprintf(__('Loop %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'emberpress_custom_player!' => 'yes',
					'embedpress_pro_embeded_source' => 'vimeo'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->init_branding_controls('vimeo');
	}
	//End Vimeo controls


	/**
	 * Spotify  Controls
	 */
	public function init_spotify_controls()
	{
		$condition = [
			'embedpress_pro_embeded_source' => 'spotify'
		];

		$this->add_control(
			'spotify_theme',
			[
				'label'       => __('Player Background', 'embedpress'),
				'description'       => __('Dynamic option will use the most vibrant color from the album art.', 'embedpress'),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => '1',
				'options'     => [
					'1'   => __('Dynamic', 'embedpress'),
					'0' => __('Black & White', 'embedpress')
				],
				'condition'   => $condition
			]
		);
	}
	//End Spotify controls

	/**
	 * OpenSea Controls
	 */
	public function init_opensea_control()
	{
		$condition = [
			'embedpress_pro_embeded_source' => 'opensea'
		];

		$this->add_control(
			'limit',
			[
				'type' => \Elementor\Controls_Manager::NUMBER,
				'label' => esc_html__('Limit', 'embedpress'),
				'placeholder' => '9',
				'min' => 1,
				'max' => 100,
				'step' => 1,
				'default' => 20,
				'condition'   => [
					'embedpress_pro_embeded_nft_type' => ['collection'],
					'embedpress_pro_embeded_source!' => [
						'default',
						'youtube',
						'vimeo',
						'dailymotion',
						'wistia',
						'twitch',
						'soundcloud',
						'instafeed',
						'calendly',
						'selfhosted_video',
						'selfhosted_audio',
						'spreaker',
						'google_photos'
					],
				],
			]
		);


		$this->add_control(
			'orderby',
			[
				'type' => \Elementor\Controls_Manager::SELECT,
				'label' => esc_html__('Order By', 'embedpress'),
				'options' => [
					'asc' => esc_html__('Oldest', 'embedpress'),
					'desc' => esc_html__('Newest', 'embedpress'),
				],
				'default' => 'desc',
				'condition'   => [
					'embedpress_pro_embeded_nft_type' => ['collection'],
					'embedpress_pro_embeded_source!' => [
						'default',
						'youtube',
						'vimeo',
						'dailymotion',
						'wistia',
						'twitch',
						'soundcloud',
						'instafeed',
						'calendly',
						'selfhosted_video',
						'selfhosted_audio',
						'spreaker',
						'google_photos'

					],
				],
			]
		);
	}

	public function init_opensea_control_section()
	{
		$condition = [
			'embedpress_pro_embeded_source' => 'opensea',
		];

		$this->start_controls_section(
			'embedpress_opensea_control_section',
			[
				'label'       => __('OpenSea Control Settings', 'embedpress'),
				'condition'    => $condition,
			]
		);

		$this->add_control(
			'opense_important_note_single',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => esc_html__('These options take effect only when a Opensea Single Asset is embedded.', 'embedpress'),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
				'condition'    => [
					'embedpress_pro_embeded_nft_type' => 'single'
				],

			]
		);
		$this->add_control(
			'opense_important_note_collection',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => esc_html__('These options take effect only when a Opensea Collection is embedded.', 'embedpress'),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
				'condition'    => [
					'embedpress_pro_embeded_nft_type' => 'collection'
				],
			]
		);

		$this->add_control(
			'layout',
			[
				'label'       => __('Layout', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'label_block' => false,
				'default' => 'ep-grid',
				'options' => [
					'ep-grid'  => esc_html__('Grid', 'embedpress'),
					'ep-list'  => esc_html__('List', 'embedpress'),
				],
				'conditions'  => [
					'terms' => [
						[
							'name' => 'embedpress_pro_embeded_nft_type',
							'operator' => '===',
							'value' => 'collection',
						],
					],
				]

			]
		);


		$this->add_control(
			'preset',
			[
				'label'       => __('Preset', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'label_block' => false,
				'default' => 'ep-preset-1',
				'options' => [
					'ep-preset-1'  => esc_html__('Preset 1', 'embedpress'),
					'ep-preset-2'  => esc_html__('Preset 2', 'embedpress'),
				],
				'conditions'  => [
					'terms' => [
						[
							'name' => 'embedpress_pro_embeded_nft_type',
							'operator' => '===',
							'value' => 'collection',
							'relation' => 'and'
						],
						[
							'name' => 'layout',
							'operator' => '===',
							'value' => 'ep-grid',
							'relation' => 'and'
						],
					],
				]

			]
		);

		$this->add_control(
			'nftperrow',
			[
				'label'       => __('Column', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'label_block' => false,
				'default' => '3',
				'options' => [
					'1'  => esc_html__('1', 'embedpress'),
					'2'  => esc_html__('2', 'embedpress'),
					'3' => esc_html__('3', 'embedpress'),
					'4' => esc_html__('4', 'embedpress'),
					'5' => esc_html__('5', 'embedpress'),
					'6' => esc_html__('6', 'embedpress'),
					'auto' => esc_html__('Auto', 'embedpress'),
				],
				'condition'  => [
					'embedpress_pro_embeded_nft_type' => ['collection']
				],

			]
		);

		$this->add_control(
			'gapbetweenitem',
			[
				'label' => esc_html__('Gap Between Item', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SLIDER,
				'size_units' => ['px'],
				'range' => [
					'px' => [
						'min' => 1,
						'max' => 100,
						'step' => 1,
					],
				],
				'default' => [
					'unit' => 'px',
					'size' => 15,
				],
				'condition'  => [
					'embedpress_pro_embeded_nft_type' => ['collection']
				],
			]
		);

		$this->add_control(
			'collectionname',
			[
				'label'       => __('Collection Name', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_nft_type' => 'single'
				],
			]
		);
		$this->add_control(
			'nftimage',
			[
				'label'       => __('Thumbnail', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);
		$this->add_control(
			'nfttitle',
			[
				'label'       => __('Title', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);
		$this->add_control(
			'nftcreator',
			[
				'label'       => __('Creator', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);

		$this->add_control(
			'prefix_nftcreator',
			[
				'label'       => sprintf(__('Prefix %s', 'embedpress'), $this->pro_text),
				'type' => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__('Created By', 'embedpress'),
				'placeholder' => esc_html__('Created By', 'embedpress'),
				'classes'     => $this->pro_class,
				'condition' => [
					'nftcreator' => 'yes',
				]
			]
		);

		$this->add_control(
			'nftprice',
			[
				'label'       => __('Current Price', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);

		$this->add_control(
			'prefix_nftprice',
			[
				'label'        => sprintf(__('Prefix %s', 'embedpress'), $this->pro_text),
				'type' => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__('Current Price', 'embedpress'),
				'placeholder' => esc_html__('Current Price', 'embedpress'),
				'classes'     => $this->pro_class,
				'condition' => [
					'nftprice' => 'yes',
				]
			]
		);

		$this->add_control(
			'nftlastsale',
			[
				'label'       => __('Last Sale', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);

		$this->add_control(
			'prefix_nftlastsale',
			[
				'label'        => sprintf(__('Prefix %s', 'embedpress'), $this->pro_text),
				'type' => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__('Last Sale', 'embedpress'),
				'placeholder' => esc_html__('Last Sale', 'embedpress'),
				'classes'     => $this->pro_class,
				'condition' => [
					'nftlastsale' => 'yes',
				]
			]
		);

		$this->add_control(
			'nftbutton',
			[
				'label'       => __('Button', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);
		$this->add_control(
			'label_nftbutton',
			[
				'label'        => sprintf(__('Button Label %s', 'embedpress'), $this->pro_text),
				'type' => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__('See Details', 'embedpress'),
				'placeholder' => esc_html__('See Details', 'embedpress'),
				'classes'     => $this->pro_class,
				'condition' => [
					'nftbutton' => 'yes',
				]
			]
		);

		$this->add_control(
			'loadmore',
			[
				'label'        => sprintf(__('Load More %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => '',
				'classes'     => $this->pro_class,
				'condition'  => [
					'embedpress_pro_embeded_nft_type' => ['collection']
				],
			]
		);
		$this->add_control(
			'itemperpage',
			[
				'type' => \Elementor\Controls_Manager::NUMBER,
				'label' => esc_html__('Item Per Page', 'embedpress'),
				'placeholder' => '9',
				'min' => 1,
				'max' => 100,
				'step' => 1,
				'default' => 9,
				'condition'    => [
					'loadmore' => 'yes'
				],
			]
		);
		$this->add_control(
			'loadmorelabel',
			[
				'type' => \Elementor\Controls_Manager::TEXT,
				'label' => esc_html__('Load More Label', 'embedpress'),
				'placeholder' => 'Load More',
				'default' => 'Load More',
				'condition'    => [
					'loadmore' => 'yes'
				],
			]
		);

		$this->add_control(
			'nftrank',
			[
				'label'       => __('Rank', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_nft_type' => 'single'
				],
			]
		);
		$this->add_control(
			'label_nftrank',
			[
				'label'       => sprintf(__('Rank Label %s', 'embedpress'), $this->pro_text),
				'type' => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__('Rank', 'embedpress'),
				'placeholder' => esc_html__('Rank', 'embedpress'),
				'classes'     => $this->pro_class,
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);

		$this->add_control(
			'nftdetails',
			[
				'label'       => __('Details', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'label_off'    => __('Hide', 'embedpress'),
				'label_on'     => __('Show', 'embedpress'),
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_nft_type' => 'single'
				],
			]
		);

		$this->add_control(
			'label_nftdetails',
			[
				'label'       => sprintf(__('Details Label %s', 'embedpress'), $this->pro_text),
				'type' => \Elementor\Controls_Manager::TEXT,
				'default' => esc_html__('Details', 'embedpress'),
				'placeholder' => esc_html__('Details', 'embedpress'),
				'classes'     => $this->pro_class,
				'condition' => [
					'nftdetails' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);

		$this->end_controls_section();
	}

	public function init_opensea_color_and_typography()
	{
		$condition = [
			'embedpress_pro_embeded_source' => 'opensea',
		];

		$this->start_controls_section(
			'embedpress_color_typography_control_section',
			[
				'label'       => __('Color and Typography', 'embedpress'),
				'tab'   => Controls_Manager::TAB_STYLE,
				'condition'    => $condition,
			]
		);

		$this->add_control(
			'opense_color_important_note_single',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => esc_html__('These options take effect only when a Opensea Single Asset is embedded.', 'embedpress'),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
				'condition'    => [
					'embedpress_pro_embeded_nft_type' => 'single'
				],

			]
		);
		$this->add_control(
			'opense_color_important_note_collection',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => esc_html__('These options take effect only when a Opensea Collection is embedded.', 'embedpress'),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
				'condition'    => [
					'embedpress_pro_embeded_nft_type' => 'collection'
				],
			]
		);


		$this->add_control(
			'item_heading',
			[
				'label' => esc_html__('Item', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'nft_item_background_color',
			[
				'label' => esc_html__('Background Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep_nft_content_wrap .ep_nft_item' => 'background-color: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'collectionname_heading',
			[
				'label' => esc_html__('Collection Name', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'nft_collectionname_color',
			[
				'label' => esc_html__('Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-nft-single-item-wraper a.CollectionLink--link' => 'color: {{VALUE}}',
				],
			]
		);
		$this->add_control(
			'nft_collectionname_hover_color',
			[
				'label' => esc_html__('Hove Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-nft-single-item-wraper a.CollectionLink--link:hover' => 'color: {{VALUE}}',
				],
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nft_collectionname_typography',
				'selector' => '{{WRAPPER}} .ep-nft-single-item-wraper a.CollectionLink--link',
			]
		);

		$this->add_control(
			'title_heading',
			[
				'label' => esc_html__('Title', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'nft_title_color',
			[
				'label' => esc_html__('Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep_nft_title' => 'color: {{VALUE}}',
				],
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nft_title_typography',
				'selector' => '{{WRAPPER}} .ep_nft_title',
			]
		);


		$this->add_control(
			'creator_heading',
			[
				'label' => esc_html__('Creator', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'nft_creator_color',
			[
				'label' => esc_html__('Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep_nft_creator span' => 'color: {{VALUE}}',
				],
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nft_creator_typography',
				'selector' => '{{WRAPPER}} .ep_nft_creator span',
			]
		);

		$this->add_control(
			'nft_created_by_color',
			[
				'label' => esc_html__('Link Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep_nft_creator span a' => 'color: {{VALUE}}',
				],
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'label' => esc_html__('Link Typography', 'embedpress'),
				'name' => 'nft_created_by_typography',
				'selector' => '{{WRAPPER}} .ep_nft_creator span a',
			]
		);

		$this->add_control(
			'price_heading',
			[
				'label' => esc_html__('Current Price', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'nft_price_color',
			[
				'label' => esc_html__('Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep_current_price span' => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nft_price_typography',
				'selector' => '{{WRAPPER}} .ep_current_price span',
			]
		);
		$this->add_control(
			'last_sale_heading',
			[
				'label' => esc_html__('Last Sale Price', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'nft_last_sale_color',
			[
				'label' => esc_html__('Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep_nft_last_sale span' => 'color: {{VALUE}}',
				],
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nft_last_sale_typography',
				'selector' => '{{WRAPPER}} .ep_nft_last_sale span',
			]
		);
		$this->add_control(
			'nftbutton_heading',
			[
				'label' => esc_html__('Button', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);


		$this->add_control(
			'nftbutton_color',
			[
				'label' => esc_html__('Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-nft-gallery-wrapper.ep-nft-gallery-r1a5mbx .ep_nft_button a' => 'color: {{VALUE}}',
				],
			]
		);
		$this->add_control(
			'nftbutton_bg_color',
			[
				'label' => esc_html__('Background Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-nft-gallery-wrapper.ep-nft-gallery-r1a5mbx .ep_nft_button a' => 'background-color: {{VALUE}}',
				],
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nftbutton_typography',
				'selector' => '{{WRAPPER}} .ep-nft-gallery-wrapper.ep-nft-gallery-r1a5mbx .ep_nft_button a',
			]
		);
		$this->add_control(
			'nft_loadmore_style',
			[
				'label' => esc_html__('Load More', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'loadmore' => 'yes',
					'embedpress_pro_embeded_nft_type' => 'collection'
				]
			]
		);

		$this->add_control(
			'nft_loadmore_color',
			[
				'label' => esc_html__('Text Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .nft-loadmore' => 'color: {{VALUE}}!important;',
					'{{WRAPPER}} .nft-loadmore svg' => 'fill: {{VALUE}}!important;',
				],
				'condition' => [
					'loadmore' => 'yes',
					'embedpress_pro_embeded_nft_type' => 'collection'
				]
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nft_loadmore_typography',
				'selector' => '{{WRAPPER}} .nft-loadmore, {{WRAPPER}} .nft-loadmore svg',
				'condition' => [
					'loadmore' => 'yes',
					'embedpress_pro_embeded_nft_type' => 'collection'
				]
			]
		);
		$this->add_control(
			'nft_loadmore_bgcolor',
			[
				'label' => esc_html__('Background Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .nft-loadmore' => 'background-color: {{VALUE}}!important;',
				],
				'condition' => [
					'loadmore' => 'yes',
					'embedpress_pro_embeded_nft_type' => 'collection'
				]
			]
		);

		$this->add_control(
			'nftrank_heading',
			[
				'label' => esc_html__('Rank', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);

		$this->add_control(
			'nftrank_label_color',
			[
				'label' => esc_html__('Label Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-nft-single-item-wraper .ep-nft-rank-wraper' => 'color: {{VALUE}}!important;',
				],
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nftrank_label_typography',
				'selector' => '{{WRAPPER}} .ep-nft-single-item-wraper .ep-nft-rank-wraper ',
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);
		$this->add_control(
			'nftrank_color',
			[
				'label' => esc_html__('Rank Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-nft-single-item-wraper .ep-nft-rank-wraper span.ep-nft-rank' => 'color: {{VALUE}}!important;',
				],
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);
		$this->add_control(
			'nftrank_border_color',
			[
				'label' => esc_html__('Border Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-nft-single-item-wraper .ep-nft-rank-wraper span.ep-nft-rank' => 'border-color: {{VALUE}}!important',
				],
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nftrank_typography',
				'selector' => '{{WRAPPER}} .ep-nft-single-item-wraper .ep-nft-rank-wraper span.ep-nft-rank',
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);



		$this->add_control(
			'nftdetails_heading',
			[
				'label' => esc_html__('Details', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);

		$this->add_control(
			'nftdetail_title_color',
			[
				'label' => esc_html__('Title Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-title' => 'color: {{VALUE}}',
				],
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'label' => esc_html__('Title Typography', 'embedpress'),
				'name' => 'nftdetail_title_typography',
				'selector' => '{{WRAPPER}} .ep-title',
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);

		$this->add_control(
			'nftdetail_color',
			[
				'label' => esc_html__('Content Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-asset-detail-item' => 'color: {{VALUE}}',
				],
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'label' => esc_html__('Content Typography', 'embedpress'),
				'name' => 'nftdetail_typography',
				'selector' => '{{WRAPPER}} .ep-asset-detail-item',
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);

		$this->add_control(
			'nftdetail_link_color',
			[
				'label' => esc_html__('Link Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .ep-asset-detail-item a' => 'color: {{VALUE}}',
				],
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);
		$this->add_group_control(
			\Elementor\Group_Control_Typography::get_type(),
			[
				'name' => 'nftdetail_link_typography',
				'selector' => '{{WRAPPER}} .ep-asset-detail-item a, .ep-asset-detail-item',
				'condition' => [
					'nftrank' => 'yes',
					'embedpress_pro_embeded_nft_type!' => 'collection'
				]
			]
		);


		$this->end_controls_section();
	}

	//End OpenSea controls

	

	/**
	 * Instagram Feed Controls
	 */
	public function init_instafeed_control(){
		$condition = [
			'embedpress_pro_embeded_source' => 'instafeed'
		];
		$disableAi = [
			'active' => false,
		];

		$this->add_control(
			'instaLayout',
			[
				'type' => \Elementor\Controls_Manager::SELECT,
				'label' => esc_html__( 'Layout', 'embedpress' ),
				'options' => [
					'insta-grid' => esc_html__( 'Grid', 'embedpress' ),
					'insta-masonry' => sprintf(__('Masonry%s', 'embedpress'), $this->pro_label),
					'insta-carousel' => sprintf(__('Carousel%s', 'embedpress'), $this->pro_label),
				],
				'default' => 'insta-grid',
				'condition'   => $condition,
			]
		);

		if ( !apply_filters('embedpress/is_allow_rander', false) ) {
			$this->add_control(
				'embedpress_insta_layout__pro_enable_warning',
				[
					'label'     => sprintf( '<a style="color: red" target="_blank" href="https://wpdeveloper.com/in/upgrade-embedpress">%s</a>',
						esc_html__( 'Only Available in Pro Version!', 'essential-addons-for-elementor-lite' ) ),
					'type'      => Controls_Manager::RAW_HTML,
					'condition' => [
						'instaLayout' => [ 'insta-masonry', 'insta-carousel' ],
					],
				]
			);
		}

		$this->add_control(
			'instafeedColumns',
			[
				'label'       => __('Column', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'label_block' => false,
				'default' => '3',
				'options' => [
					'2'  => esc_html__('2', 'embedpress'),
					'3' => esc_html__('3', 'embedpress'),
					'4' => esc_html__('4', 'embedpress'),
					'6' => esc_html__('6', 'embedpress'),
					'auto' => esc_html__('Auto', 'embedpress'),
				],
				'condition'    => [
					'instaLayout' => ['insta-grid', 'insta-masonry'],
					'embedpress_pro_embeded_source' => 'instafeed'
				],
			]
		);

		$this->add_control(
			'instafeedColumnsGap',
			[
				'label' => esc_html__( 'Column Gap', 'embedpress' ),
				'type' => \Elementor\Controls_Manager::NUMBER,
				'min' => 0,
				'max' => 100,
				'step' => 1,
				'default' => 5,
				'condition' => [
					'instaLayout' => [ 'insta-masonry', 'insta-grid' ],
				],
			]
		);
		
		$this->add_control(
			'embedpress_instafeed_slide_show',
			[
				'type' => \Elementor\Controls_Manager::SELECT,
				'label' => esc_html__( 'Slides to Show', 'embedpress' ),
				'options' => [
					'1' => esc_html__( '1', 'embedpress' ),
					'2' => esc_html__( '2', 'embedpress' ),
					'3' => esc_html__( '3', 'embedpress' ),
					'4' => esc_html__( '4', 'embedpress' ),
					'5' => esc_html__( '5', 'embedpress' ),
					'6' => esc_html__( '6', 'embedpress' ),
					'7' => esc_html__( '7', 'embedpress' ),
					'8' => esc_html__( '8', 'embedpress' ),
					'9' => esc_html__( '9', 'embedpress' ),
					'10' => esc_html__( '10', 'embedpress' ),
				],
				'default' => '5',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instaLayout' => 'insta-carousel'
				],
			]
		);

		$this->add_control(
			'embedpress_carousel_autoplay',
			[
				'label'        => __('Auto Play', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instaLayout' => 'insta-carousel'
				],
			]
		);
		$this->add_control(    
			'embedpress_carousel_autoplay_speed',
			[
				'label' => esc_html__( 'Autoplay Speed(ms)', 'embedpress' ),
				'type' => \Elementor\Controls_Manager::NUMBER,
				'min' => 0,
				'step' => 1,
				'default' => 0,
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instaLayout' => 'insta-carousel'
				],
			]
		);
		$this->add_control(
			'embedpress_carousel_transition_speed',
			[
				'label' => esc_html__( 'Transition Speed(ms)', 'embedpress' ),
				'type' => \Elementor\Controls_Manager::NUMBER,
				'min' => 0,
				'step' => 1,
				'default' => 0,
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instaLayout' => 'insta-carousel'
				],
			]
		);
		$this->add_control(
			'embedpress_carousel_loop',
			[
				'label'        => __('Loop', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instaLayout' => 'insta-carousel'
				],
			]
		);

		$this->add_control(
			'embedpress_carousel_arrows',
			[
				'label'        => __('Arrows', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instaLayout' => 'insta-carousel'
				],
			]
		);


		$this->add_control(
			'embedpress_carousel_spacing',
			[
				'label' => esc_html__( 'Spacing', 'embedpress' ),
				'type' => \Elementor\Controls_Manager::NUMBER,
				'min' => 0,
				'max' => 100,
				'step' => 1,
				'default' => 0,
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instaLayout' => 'insta-carousel'
				],
			]
		);

		$this->add_control(
			'instafeedPostsPerPage',
			[
				'label' => esc_html__( 'Posts Per Page', 'embedpress' ),
				'type' => \Elementor\Controls_Manager::NUMBER,
				'min' => 1,
				'max' => 100,
				'step' => 12,
				'default' => 12,
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed',
				],
			]
		);
		
		$this->add_control(
			'instafeedTab',
			[
				'label' => sprintf(__('Feed Tab %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'classes'     => $this->pro_class,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'   => $condition,
			]
		);

		$this->add_control(
			'instafeedLikesCount',
			[
				'label' => sprintf(__('Like Count %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'classes'     => $this->pro_class,
				'label_block'  => false,
				'return_value' => 'true',
				'default'      => 'true',
				'conditions' => [
					'relation' => 'or',
					'terms' => [
						[
							'name' => 'instafeedFeedType',
							'operator' => '===',
							'value' => 'hashtag_type',
						],
						[
							'relation' => 'and',
							'terms' => [
								[
									'name' => 'instafeedAccountType',
									'operator' => '===',
									'value' => 'business',
								],
								[
									'name' => 'embedpress_pro_embeded_source',
									'operator' => '===',
									'value' => 'instafeed',
								],
							],
						],
					],
				],
			]
		);

		$this->add_control(
			'instafeedCommentsCount',
			[
				'label' => sprintf(__('Comments Count %s', 'embedpress'), $this->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'classes'     => $this->pro_class,
				'label_block'  => false,
				'return_value' => 'true',
				'default'      => 'true',

				'conditions' => [
					'relation' => 'or',
					'terms' => [
						[
							'name' => 'instafeedFeedType',
							'operator' => '===',
							'value' => 'hashtag_type',
						],
						[
							'relation' => 'and',
							'terms' => [
								[
									'name' => 'instafeedAccountType',
									'operator' => '===',
									'value' => 'business',
								],
								[
									'name' => 'embedpress_pro_embeded_source',
									'operator' => '===',
									'value' => 'instafeed',
								],
							],
						],
					],
				],
				
			]
		);
		

		$this->add_control(
			'instafeedPopup',
			[
				'label' => __('Popup', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'   => $condition,
			]
		);

		$this->add_control(
			'instafeedPopupFollowBtn',
			[
				'label'        => __('Popup Follow Button', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instafeedPopup' => 'yes'
				],
			]
		);

		$this->add_control(
			'instafeedPopupFollowBtnLabel',
			[
				'type' => \Elementor\Controls_Manager::TEXT,
				'label' => esc_html__('Follow Button Label', 'embedpress'),
				'placeholder' => 'Follow',
				'default' => 'Follow',
				'separator'    => 'after',
				'condition'    => [
					'instafeedPopupFollowBtn' => 'yes',
					'instafeedPopup' => 'yes',
					'embedpress_pro_embeded_source' => 'instafeed'
				],
				'ai' => $disableAi
			]
		);

		$this->add_control(
			'instafeedLoadmore',
			[
				'label'        => __('Load More', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instaLayout!' => 'insta-carousel'
				],
			]
		);
		$this->add_control(
			'instafeedLoadmoreLabel',
			[
				'type' => \Elementor\Controls_Manager::TEXT,
				'label' => esc_html__('Load More Button Label', 'embedpress'),
				'placeholder' => 'Load More',
				'default' => 'Load More',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instafeedLoadmore' => 'yes',
					'instaLayout!' => 'insta-carousel'
				],
				'ai' => $disableAi
			]
		);
		
	}

	public function init_instafeed_control_section()
	{
		$condition = [
			'embedpress_pro_embeded_source' => 'instafeed'
		];
		$disableAi = [
			'active' => false,
		];

		$this->start_controls_section(
			'embedpress_instafeed_profile_section',
			[
				'label'       => __('Instagram Profile Settings', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed'
				],
			]
		);


		$this->add_control(
			'instafeedProfileImage',
			[
				'label' => __('Profile Image', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'instafeed'
				],
			]
		);

		$this->add_control(
			"instafeedProfileImageUrl",
			[
				'label' => sprintf(__('Image %s', 'embedpress'), $this->pro_text),
				'type' => Controls_Manager::MEDIA,
				'classes'     => $this->pro_class,
				'dynamic' => [
					'active' => false,
				],
				'condition' => [
					'instafeedProfileImage' => 'yes',
					'embedpress_pro_embeded_source' => 'instafeed'
				],
				'ai' => $disableAi
			]
		);


		$this->add_control(
			'instafeedFollowBtn',
			[
				'label'        => __('Follow Button', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'   => $condition,
			]
		);

		$this->add_control(
			'instafeedFollowBtnLabel',
			[
				'label' => sprintf(__('Button Label %s', 'embedpress'), $this->pro_text),
				'type'        => Controls_Manager::TEXT,
				'classes'     => $this->pro_class,
				'placeholder' => __('Follow', 'embedpress'),
				'default' => 'Follow',
				'separator'    => 'after',
				'label_block' => false,
				'condition' => [
					'instafeedFollowBtn' => 'yes',
					'embedpress_pro_embeded_source' => 'instafeed'
				],
				'ai' => $disableAi
			]
		);

		$this->add_control(
			'instafeedPostsCount',
			[
				'label'        => __('Posts Count', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'instafeed',
					'instafeedFeedType!' => 'hashtag_type'
				],
			]
		);
		$this->add_control(
			'instafeedPostsCountText',
			[
				'label' => __('Count Text', 'embedpress'),
				'type'        => Controls_Manager::TEXT,
				'placeholder' => __('[count] posts', 'embedpress'),
				'default' => '[count] posts',
				'label_block' => false,
				'separator'    => 'after',
				'condition' => [
					'instafeedPostsCount' => 'yes',
					'instafeedFeedType!' => 'hashtag_type',
					'embedpress_pro_embeded_source' => 'instafeed',
				],
				'ai' => $disableAi
			]
		);
		$this->add_control(
			'instafeedFollowersCount',
			[
				'label'        => __('Followers Count', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => [
					'instafeedAccountType!' => 'personal',
					'instafeedFeedType!' => 'hashtag_type',
					'embedpress_pro_embeded_source' => 'instafeed',
				],
			]
		);
		$this->add_control(
			'instafeedFollowersCountText',
			[
				'label' => __('Count Text', 'embedpress'),
				'type'        => Controls_Manager::TEXT,
				'placeholder' => __('[count] followers', 'embedpress'),
				'default' => '[count] followers',
				'label_block' => false,
				'separator'    => 'after',
				'condition' => [
					'instafeedAccountType!' => 'personal',
					'instafeedFollowersCount' => 'yes',
					'instafeedFeedType!' => 'hashtag_type',
					'embedpress_pro_embeded_source' => 'instafeed'
				],
				'ai' => $disableAi
			]
		);

		$this->add_control(
			'instafeedAccName',
			[
				'label'        => __('Account Name', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => [
					'instafeedAccountType!' => 'personal',
					'instafeedFeedType!' => 'hashtag_type',
					'embedpress_pro_embeded_source' => 'instafeed'
				],
			]
		);
		$this->end_controls_section();

		$this->start_controls_section(
			'embedpress_instafeed_control_section',
			[
				'label'       => __('Instagram Feed Settings', 'embedpress'),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'instafeed'
				],
			]
		);

		$this->init_instafeed_control();

		$this->end_controls_section();

		

	}


	//End Feed Controls
	 

	/**
	 * Calendly Controls
	 */
	public function init_calendly_control_section()
	{

		$condition = [
			'embedpress_pro_embeded_source' => 'calendly',
		];

		$this->start_controls_section(
			'embedpress_calendly_control_section',
			[
				'label'       => __('Calendly Controls', 'embedpress'),
				'condition'    => $condition,
			]
		);
		$this->add_control(
			'cEmbedType',
			[
				'label' => __('Embed Type', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'default' => 'inline',
				'options' => [
					'inline'  => __('Inline', 'embedpress'),
					'popup_button' => __('Popup Button', 'embedpress'),
				],
				'condition' => $condition
			]
		);
		$this->add_control(
			'popupControlsHeadding',
			[
				'label' => esc_html__('Popup Button Settings', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'embedpress_pro_embeded_source' => 'calendly',
					'cEmbedType' => 'popup_button'
				]
			]
		);
		$this->add_control(
			'cPopupButtonText',
			[
				'label' => __('Button Text', 'embedpress'),
				'type' => \Elementor\Controls_Manager::TEXT,
				'label_block' => true,
				'default' => 'Schedule time with me',
				'condition' => [
					'embedpress_pro_embeded_source' => 'calendly',
					'cEmbedType' => 'popup_button'
				],
				'ai'     => [
					'active' => false,
				],
			]
		);


		$this->add_control(
			'cPopupButtonTextColor',
			[
				'label' => __('Text Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'default' => '#ffffff',
				'condition' => [
					'embedpress_pro_embeded_source' => 'calendly',
					'cEmbedType' => 'popup_button'
				]
			]
		);
		$this->add_control(
			'cPopupButtonBGColor',
			[
				'label' => __('Background Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'default' => '#0000FF',
				'condition' => [
					'embedpress_pro_embeded_source' => 'calendly',
					'cEmbedType' => 'popup_button'
				]
			]
		);

		$this->add_control(
			'calendlyControlsHeadding',
			[
				'label' => esc_html__('Calender Settings', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'calendlyData',
			[
				'label' => sprintf(__('Calendly Data %s', 'embedpress'), $this->pro_text),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'default' => '',
				'classes' => $this->pro_class,
				'condition' => $condition
			]
		);

		$this->add_control(
			'calendlyDataLink',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => '<div style="display: flex; align-items: center;gap:5px;"><span style="font-size:18px" class="eicon-editor-external-link"></span><a href="/wp-admin/admin.php?page=embedpress&page_type=calendly" target="_blank" >View Calendly Data</a></div>',
				'condition' => [
					'calendlyData' => 'yes'
				]

			]
		);

		$this->add_control(
			'hideCookieBanner',
			[
				'label' => __('Hide Cookie Banner', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'default' => '',
				'condition' => $condition
			]
		);
		$this->add_control(
			'hideEventTypeDetails',
			[
				'label' => __('Hide Event Type Details', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'default' => '',
				'condition' => $condition
			]
		);

		$this->add_control(
			'cBackgroundColor',
			[
				'label' => __('Background Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'default' => '',
				'condition' => $condition
			]
		);

		$this->add_control(
			'cTextColor',
			[
				'label' => __('Text Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'default' => '',
				'condition' => $condition
			]
		);

		$this->add_control(
			'cButtonLinkColor',
			[
				'label' => __('Button & Link Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'default' => '',
				'condition' => $condition
			]
		);

		$this->end_controls_section();
	}

	//End calendly controlS
	
	/**
	 * Start Spreaker Controls
	 */
	public function init_spreaker_control_section()
	{

		$condition = [
			'embedpress_pro_embeded_source' => 'spreaker',
		];

		$this->start_controls_section(
			'embedpress_spreaker_control_section',
			[
				'label'       => __('Spreaker Controls', 'embedpress'),
				'condition'    => $condition,
			]
		);
		
		$this->add_control(
			'theme',
			[
				'label' => __('Theme', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'default' => 'light',
				'options' => [
					'light' => __('Light', 'embedpress'),
					'dark' => __('Dark', 'embedpress'),
				],
			]
		);

		$this->add_control(
			'color',
			[
				'label' => __('Main Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
			]
		);

		$this->add_control(
			"coverImageUrl",
			[
				'label' => sprintf(__('Cover Image %s', 'embedpress'), $this->pro_text),
				'type' => Controls_Manager::MEDIA,
				'dynamic' => [
					'active' => true,
				],
				'classes'     => $this->pro_class,
				
			]
		);



		$this->add_control(
			'hideDownload',
			[
				'label' => sprintf(__('Disable Download %s', 'embedpress'), $this->pro_text),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'no',
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'playlist',
			[
				'label' => __('Enable Playlist', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'yes',
				'description' => __('This option is for podcast playlists and doesn’t affect individual episodes.', 'embedpress'),
			]
		);
		

		$this->add_control(
			'playlistContinuous',
			[
				'label' => sprintf(__('Continuous Playlist %s', 'embedpress'), $this->pro_text),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'no',
				'classes'     => $this->pro_class,
				'condition' => [
					'playlist' => 'yes',
				],
			]
		);

		$this->add_control(
			'playlistLoop',
			[
				'label' => __('Loop Playlist', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'yes',
				'condition' => [
					'playlist' => 'yes',
					'playlistContinuous' => 'yes',
				],
			]
		);

		$this->add_control(
			'playlistAutoupdate',
			[
				'label' => __('Playlist Autoupdate', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'yes',
				'condition' => [
					'playlist' => 'yes',
				],
			]
		);
		$this->add_control(
			'hidePlaylistDescriptions',
			[
				'label' => __('Hide Playlist Descriptions', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'no',
				'condition' => [
					'playlist' => 'yes',
				],
			]
		);

		$this->add_control(
			'hidePlaylistImages',
			[
				'label' => __('Hide Playlist Images', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'no',
				'condition' => [
					'playlist' => 'yes',
				],
			]
		);

		$this->add_control(
			'episodeImagePosition',
			[
				'label' => __('Episode Image Position', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'default' => 'right',
				'options' => [
					'right' => __('Right', 'embedpress'),
					'left' => __('Left', 'embedpress'),
				],
				'label_block' => true,
			]
		);


		$this->add_control(
			'showChaptersImage',
			[
				'label' => __('Show Chapters Images', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'yes',
				'description' => __('Only applies if the podcast includes chapter images.', 'embedpress'),
			]
		);

		$this->add_control(
			'hideLikes',
			[
				'label' => __('Hide Likes', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'no',
			]
		);

		$this->add_control(
			'hideComments',
			[
				'label' => __('Hide Comments', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'no',
			]
		);

		$this->add_control(
			'hideSharing',
			[
				'label' => __('Hide Sharing', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'no',
			]
		);

		$this->add_control(
			'hideLogo',
			[
				'label' => __('Hide Logo', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'no',
				'description' => __('Hide the Spreaker logo and branding in the player. Requires Broadcaster plan or higher.', 'embedpress'),
			]
		);

		$this->add_control(
			'hideEpisodeDescription',
			[
				'label' => __('Hide Episode Description', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'return_value' => 'yes',
				'default' => 'no',
			]
		);

		
		$this->end_controls_section();
	}

	public function init_google_photos_control_setion()
	{
		$condition = [
			'embedpress_pro_embeded_source' => 'google_photos',
		];

		$this->start_controls_section(
			'google_photos_controls_section',
			[
				'label' => __('Google Photos Controls', 'embedpress'),
				'condition'    => $condition,
			]
		);

		

		// $this->pro_text
		// Mode Selection
		$this->add_control(
			'mode',
			[
				'label' => __('Album Mode', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'carousel' => __('Carousel', 'embedpress'),
					'gallery-player' => __('Gallery Player', 'embedpress') . ' ' . __($this->pro_text, 'embedpress'),
					'gallery-grid' => __('Grid', 'embedpress') . ' ' . __($this->pro_text .' (Coming Soon)', 'embedpress'),
					'gallery-masonary' => __('Masonary', 'embedpress') . ' ' . __($this->pro_text . ' (Coming Soon)', 'embedpress'),
				],
				'default' => 'carousel',
			]
		);

		if ( !apply_filters('embedpress/is_allow_rander', false) ) {
			$this->add_control(
				'embedpress_google_photos__pro_enable_warning_1',
				[
					'label'     => sprintf( '<a style="color: red" target="_blank" href="https://wpdeveloper.com/in/upgrade-embedpress">%s</a>',
						esc_html__( 'Only Available in Pro Version!', 'essential-addons-for-elementor-lite' ) ),
					'type'      => Controls_Manager::RAW_HTML,
					'condition' => [
						'mode' => [ 'gallery-player', 'gallery-grid', 'gallery-masonary'],
					],
				]
			);
		}


		// Player Autoplay, Delay, and Repeat
		$this->add_control(
			'playerAutoplay',
			[
				'label' => __('Autoplay', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'default' => 'no',
				'condition' => [
					'mode' => 'gallery-player',
				],
			]
		);

		$this->add_control(
			'delay',
			[
				'label' => __('Delay (seconds)', 'embedpress'),
				'type' => \Elementor\Controls_Manager::NUMBER,
				'min' => 1,
				'max' => 60,
				'default' => 5,
				'condition' => [
					'mode' => 'gallery-player',
				],
			]
		);

		$this->add_control(
			'repeat',
			[
				'label' => __('Repeat', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'default' => 'no',
				'condition' => [
					'mode' => 'gallery-player',
				],
			]
		);

		// Toggles for Media Items
		// $this->add_control(
		// 	'mediaitemsAspectRatio',
		// 	[
		// 		'label' => __('Keep Aspect Ratio', 'embedpress'),
		// 		'type' => \Elementor\Controls_Manager::SWITCHER,
		// 		'default' => 'yes',
		// 	]
		// );

		// $this->add_control(
		// 	'mediaitemsEnlarge',
		// 	[
		// 		'label' => __('Enlarge', 'embedpress'),
		// 		'type' => \Elementor\Controls_Manager::SWITCHER,
		// 		'default' => 'no',
		// 	]
		// );

		// $this->add_control(
		// 	'mediaitemsStretch',
		// 	[
		// 		'label' => __('Stretch', 'embedpress'),
		// 		'type' => \Elementor\Controls_Manager::SWITCHER,
		// 		'default' => 'no',
		// 	]
		// );

		// $this->add_control(
		// 	'mediaitemsCover',
		// 	[
		// 		'label' => __('Cover', 'embedpress'),
		// 		'type' => \Elementor\Controls_Manager::SWITCHER,
		// 		'default' => 'no',
		// 	]
		// );

		// Background Color
		$this->add_control(
			'backgroundColor',
			[
				'label' => __('Background Color', 'embedpress'),
				'type' => \Elementor\Controls_Manager::COLOR,
				'default' => '#000000',
			]
		);

		// Expiration
		$this->add_control(
			'expiration',
			[
				'label' => __('Sync after (minutes)', 'embedpress'),
				'type' => \Elementor\Controls_Manager::NUMBER,
				'min' => 0,
				'max' => 1440,
				'default' => 60,
			]
		);

		$this->end_controls_section();
	}
	

	/**
	 * End Spreaker Controls
	 */


	public function init_style_controls()
	{
		$this->start_controls_section(
			'embedpress_style_section',
			[
				'label' => __('General', 'embedpress'),
				'tab'   => Controls_Manager::TAB_STYLE,
				'condition'   => [
					'embedpress_pro_embeded_source!' => 'opensea',
				]

			]
		);
		$this->add_responsive_control(
			'width',
			[
				'label' => __('Width', 'embedpress'),
				'type' => Controls_Manager::SLIDER,
				'size_units' => ['px'],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1500,
						'step' => 1,
					],
				],
				'devices' => ['desktop', 'tablet', 'mobile'],
				'default' => [
                    'size' => !empty($value = intval(Helper::get_options_value('enableEmbedResizeWidth'))) ? $value : 600,
					'unit' => 'px',
				],
				'desktop_default' => [
					'size' => 600,
					'unit' => 'px',
				],
				'tablet_default' => [
					'size' => 600,
					'unit' => 'px',
				],
				'mobile_default' => [
					'size' => 600,
					'unit' => 'px',
				],
				'selectors' => [
					'{{WRAPPER}} .embedpress-elements-wrapper .ose-embedpress-responsive>iframe,{{WRAPPER}} .embedpress-elements-wrapper .ose-embedpress-responsive, {{WRAPPER}} .sponsored-youtube-video > iframe, 
					{{WRAPPER}} .plyr--video, 
					{{WRAPPER}} .ose-giphy img,
					{{WRAPPER}} .jx-gallery-player-widget' => 'width: {{size}}{{UNIT}}!important; max-width: 100%!important;',
				],
				'condition' => [
					'embedpress_pro_embeded_source!' => 'google_photos',
				],
			]
		);

		$this->add_responsive_control(
			'height',
			[
				'label' => __('Height', 'embedpress'),
				'type' => Controls_Manager::SLIDER,
				'size_units' => ['px', '%'],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1500,
						'step' => 1,
					],
				],
				'devices' => ['desktop', 'tablet', 'mobile'],
				'desktop_default' => [
					'size' => 400,
					'unit' => 'px',
				],
				'default' => [
                    'size' => !empty($value = intval(Helper::get_options_value('enableEmbedResizeHeight'))) ? $value : 600,
					'unit' => 'px',
				],
				'tablet_default' => [
					'size' => 400,
					'unit' => 'px',
				],
				'mobile_default' => [
					'size' => 400,
					'unit' => 'px',
				],
				'selectors' => [
					'{{WRAPPER}} .embedpress-elements-wrapper .ose-embedpress-responsive iframe, {{WRAPPER}} .embedpress-elements-wrapper .ose-embedpress-responsive,{{WRAPPER}} .sponsored-youtube-video > iframe,
					{{WRAPPER}} .plyr--video, 
					{{WRAPPER}} .ose-giphy img,
					{{WRAPPER}} .jx-gallery-player-widget' => 'height: {{size}}{{UNIT}}!important;max-height: 100%!important',
				],
				'condition' => [
					'embedpress_pro_embeded_source!' => 'instafeed',
					'embedpress_pro_embeded_source!' => 'google_photos',
				],
			]
		);
		$this->add_responsive_control(
			'google_photos_width',
			[
				'label' => __('Width', 'embedpress'),
				'type' => Controls_Manager::SLIDER,
				'size_units' => ['px'],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1500,
						'step' => 1,
					],
				],
				'devices' => ['desktop', 'tablet', 'mobile'],
				'default' => [
                    'size' => !empty($value = intval(Helper::get_options_value('enableEmbedResizeWidth'))) ? $value : 600,
					'unit' => 'px',
				],
				'desktop_default' => [
					'size' => 600,
					'unit' => 'px',
				],
				'tablet_default' => [
					'size' => 600,
					'unit' => 'px',
				],
				'mobile_default' => [
					'size' => 600,
					'unit' => 'px',
				],
				'selectors' => [
					'{{WRAPPER}} .embedpress-elements-wrapper .ose-google-photos iframe,
					{{WRAPPER}} .ose-google-photos,
					{{WRAPPER}} .jx-gallery-player-widget' => 'width: {{size}}{{UNIT}}!important; max-width: 100%!important;',
				],
				'condition' => [
					'embedpress_pro_embeded_source' => 'google_photos'
				],
				
			]
		);

		$this->add_responsive_control(
			'google_photos_height',
			[
				'label' => __('Height', 'embedpress'),
				'type' => Controls_Manager::SLIDER,
				'size_units' => ['px', '%'],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1500,
						'step' => 1,
					],
				],
				'devices' => ['desktop', 'tablet', 'mobile'],
				'desktop_default' => [
					'size' => 400,
					'unit' => 'px',
				],
				'default' => [
                    'size' => !empty($value = intval(Helper::get_options_value('enableEmbedResizeHeight'))) ? $value : 600,
					'unit' => 'px',
				],
				'tablet_default' => [
					'size' => 400,
					'unit' => 'px',
				],
				'mobile_default' => [
					'size' => 400,
					'unit' => 'px',
				],
				
				'condition' => [
					'embedpress_pro_embeded_source' => 'google_photos'
				],
			]
		);
		$this->add_control(
			'width_height_important_note',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => esc_html__('Note: The maximum width and height are set to 100%.', 'embedpress'),
				'content_classes' => 'elementor-panel-alert elementor-panel-warning-info',
			]
		);
		$this->add_responsive_control(
			'margin',
			[
				'label' => __('Margin', 'embedpress'),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => ['px', '%', 'em'],
				'selectors' => [
					'{{WRAPPER}} .embedpress-elements-wrapper .embedpress-wrapper' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);
		$this->add_responsive_control(
			'padding',
			[
				'label' => __('Padding', 'embedpress'),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => ['px', '%', 'em'],
				'selectors' => [
					'{{WRAPPER}} .embedpress-elements-wrapper .embedpress-wrapper' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);
		$this->add_responsive_control(
			'align',
			[
				'label' => esc_html__('Alignment', 'embedpress'),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left'    => [
						'title' => esc_html__('Left', 'embedpress'),
						'icon' => 'eicon-text-align-left',
					],
					'center' => [
						'title' => esc_html__('Center', 'embedpress'),
						'icon' => 'eicon-text-align-center',
					],
					'right' => [
						'title' => esc_html__('Right', 'embedpress'),
						'icon' => 'eicon-text-align-right',
					],
				],
				'prefix_class' => 'elementor%s-align-',
				'default' => '',
			]
		);
		$this->end_controls_section();
	}

	public function render_plain_content()
	{
		$args = "";
		$settings = $this->get_settings_for_display();

		$_settings = $this->convert_settings($settings);
		foreach ($_settings as $key => $value) {
			$args .= "$key='" . esc_attr($value) . "' ";
		}

		$args = trim($args);
		$embed_code = sprintf("[embedpress %s]%s[/embedpress]", $args, esc_url($settings['embedpress_embeded_link']));
		echo $embed_code;
	}


	public function get_custom_player_options($settings)
	{

		$_player_options = '';

		if (!empty($settings['emberpress_custom_player'])) {

			$player_preset = !empty($settings['custom_payer_preset']) ? sanitize_text_field($settings['custom_payer_preset']) : 'preset-default';

			$player_color = !empty($settings['embedpress_player_color']) ? sanitize_hex_color($settings['embedpress_player_color']) : '';

			$poster_thumbnail = !empty($settings['embedpress_player_poster_thumbnail']['url']) ? esc_url($settings['embedpress_player_poster_thumbnail']['url']) : '';


			$is_self_hosted = Helper::check_media_format($settings['embedpress_embeded_link']);


			$player_pip = !empty($settings['embepress_player_always_on_top']) ? true : false;
			$player_restart = !empty($settings['embepress_player_restart']) ? true : false;
			$player_rewind = !empty($settings['embepress_player_rewind']) ? true : false;
			$player_fastForward = !empty($settings['embepress_player_fast_forward']) ? true : false;
			$player_tooltip = !empty($settings['embepress_player_tooltip']) ? true : false;
			$player_hide_controls = !empty($settings['embepress_player_hide_controls']) ? true : false;
			$player_download = !empty($settings['embepress_player_download']) ? true : false;
			$player_fullscreen = !empty($settings['embedpress_pro_youtube_enable_fullscreen_button']) ? true : false;

			$playerOptions = [
				'rewind' => $player_rewind,
				'restart' => $player_restart,
				'pip' => $player_pip,
				'poster_thumbnail' => $poster_thumbnail,
				'player_color' => $player_color,
				'player_preset' => $player_preset,
				'fast_forward' => $player_fastForward,
				'player_tooltip' => $player_tooltip,
				'hide_controls' => $player_hide_controls,
				'download' => $player_download,
				'fullscreen' => $player_fullscreen,
			];


			//Youtube options
			if (!empty($settings['embedpress_pro_video_start_time'])) {
				$playerOptions['start'] = $settings['embedpress_pro_video_start_time'];
			}
			if (!empty($settings['embedpress_pro_youtube_end_time'])) {
				$playerOptions['end'] = $settings['embedpress_pro_youtube_end_time'];
			}
			if (!empty($settings['embedpress_pro_youtube_display_related_videos'])) {
				$playerOptions['rel'] = true;
			} else {
				$playerOptions['rel'] = false;
			}

			//vimeo options
			if (!empty($settings['embedpress_pro_video_start_time'])) {
				$playerOptions['t'] = $settings['embedpress_pro_video_start_time'];
			}
			if (!empty($settings['embedpress_pro_vimeo_auto_play'])) {
				$playerOptions['vautoplay'] = true;
			} else {
				$playerOptions['vautoplay'] = false;
			}
			if (!empty($settings['embedpress_pro_vimeo_autopause'])) {
				$playerOptions['autopause'] = true;
			} else {
				$playerOptions['autopause'] = false;
			}

			if (!empty($settings['embedpress_pro_vimeo_dnt'])) {
				$playerOptions['dnt'] = true;
			} else {
				$playerOptions['dnt'] = false;
			}

			if (!empty($is_self_hosted['selhosted'])) {
				$playerOptions['self_hosted'] = $is_self_hosted['selhosted'];
				$playerOptions['hosted_format'] = $is_self_hosted['format'];
			}

			$playerOptionsString = json_encode($playerOptions);
			$_player_options = 'data-options=' . htmlentities($playerOptionsString, ENT_QUOTES);

		}

		return $_player_options;
	}

	public function get_instafeed_carousel_options($settings)
	{
		$_carousel_options = '';

		if(!empty($settings['instaLayout']) && $settings['instaLayout'] === 'insta-carousel'){
			$_carousel_id = 'data-carouselid=' . esc_attr($this->get_id()) . '';
	
			$layout = $settings['instaLayout'];
			$embedpress_instafeed_slide_show = !empty($settings['embedpress_instafeed_slide_show']) ? $settings['embedpress_instafeed_slide_show'] : 5;
			$embedpress_carousel_autoplay = !empty($settings['embedpress_carousel_autoplay']) ? $settings['embedpress_carousel_autoplay'] : 0;
			$embedpress_carousel_autoplay_speed = !empty($settings['embedpress_carousel_autoplay_speed']) ? $settings['embedpress_carousel_autoplay_speed'] : 3000;
			$embedpress_carousel_transition_speed = !empty($settings['embedpress_carousel_transition_speed']) ? $settings['embedpress_carousel_transition_speed'] : 1000;
			$embedpress_carousel_loop = !empty($settings['embedpress_carousel_loop']) ? $settings['embedpress_carousel_loop'] : 0;
			$embedpress_carousel_arrows = !empty($settings['embedpress_carousel_arrows']) ? $settings['embedpress_carousel_arrows'] : 0;
			$spacing = !empty($settings['embedpress_carousel_spacing']) ? $settings['embedpress_carousel_spacing'] : 0;
			
			// print_r($settings); 
			
			$carousel_options = [
				'layout' => $layout,
				'slideshow' => $embedpress_instafeed_slide_show,
				'autoplay' => $embedpress_carousel_autoplay,
				'autoplayspeed' => $embedpress_carousel_autoplay_speed,
				'transitionspeed' => $embedpress_carousel_transition_speed,
				'loop' => $embedpress_carousel_loop,
				'arrows' => $embedpress_carousel_arrows,
				'spacing' => $spacing
			];
	
			$carousel_options_string = json_encode($carousel_options);
			$_carousel_options = 'data-carousel-options='. htmlentities($carousel_options_string, ENT_QUOTES) .'';
		}
		return $_carousel_options;
	}

	public function get_instafeed_layout($settings){
		$insta_layout = '';
		if($settings['embedpress_pro_embeded_source'] == 'instafeed'){
			$insta_layout = ' '. $settings['instaLayout'];
		}

		return $insta_layout;
	}

	protected function convert_settings($settings)
	{
		$_settings = [];
		foreach ($settings as $key => $value) {
			if (empty($value)) {
				$_settings[$key] = 'false';
			} else if (!empty($value['size'])) {
				$_settings[$key] = $value['size'];
			} else if (!empty($value['url'])) {
				$_settings[$key] = $value['url'];
			} else if (\is_scalar($value)) {
				$_settings[$key] = $value;
			}
		}

		return $_settings;
	}

	public function validUserAccountUrl($url){
        $pattern = '/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9_\.]+\/?)$/';
        return (bool) preg_match($pattern, $url);
    }

    function validInstagramTagUrl($url) {
        $pattern = '/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/explore\/tags\/[a-zA-Z0-9_\-]+\/?$/';
        return (bool) preg_match($pattern, $url);
    }

	protected function render()
	{
		$settings      = $this->get_settings_for_display();
		Helper::get_enable_settings_data_for_scripts($settings);

		add_filter('embedpress_should_modify_spotify', '__return_false');
		$embed_link = isset($settings['embedpress_embeded_link']) ? $settings['embedpress_embeded_link'] : '';

		if(!apply_filters('embedpress/is_allow_rander', false) && ($settings['mode'] === 'gallery-player')){
			echo '<div class="pro__alert__wrap" style="display: block;">
					<div class="pro__alert__card">
							<h2>Opps...</h2>
							<p>You need to upgrade to the <a style="font-weight: bold; color: #5B4E96; text-decoration: underline" href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Premium</a> Version to use this feature</p>
					</div>
				</div>';
			return '';
		}

		if($settings['instafeedFeedType'] === 'mixed_type' || $settings['instafeedFeedType'] === 'tagged_type'){
			echo 'Comming Soon.';
			return '';
		}

		if($settings['instafeedFeedType'] === 'hashtag_type' && !$this->validInstagramTagUrl($embed_link)){
			echo 'Please add valid hashtag link url';
			return '';
		}

		if($settings['instafeedFeedType'] === 'user_account_type' && !$this->validUserAccountUrl($embed_link)){
			echo 'Please add valid user account link url';
			return '';
		}

		if(!apply_filters('embedpress/is_allow_rander', false) && ($settings['instaLayout'] === 'insta-masonry' || $settings['instaLayout'] === 'insta-carousel' || $settings['instafeedFeedType'] === 'hashtag_type')){
			echo '<div class="pro__alert__wrap" style="display: block;">
					<div class="pro__alert__card">
							<h2>Opps...</h2>
							<p>You need to upgrade to the <a style="font-weight: bold; color: #5B4E96; text-decoration: underline" href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Premium</a> Version to use this feature</p>
					</div>
				</div>';
			return '';
		}
		
		if(!apply_filters('embedpress/is_allow_rander', false) && ($settings['ytChannelLayout'] === 'carousel' || $settings['ytChannelLayout'] === 'grid')){
			echo '<div class="pro__alert__wrap" style="display: block;">
					<div class="pro__alert__card">
							<h2>Opps...</h2>
							<p>You need to upgrade to the <a style="font-weight: bold; color: #5B4E96; text-decoration: underline" href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Premium</a> Version to use this feature</p>
					</div>
				</div>';
			return '';
		}

		if($settings['instafeedFeedType'] === 'mixed_type' || $settings['instafeedFeedType'] === 'tagged_type'){
			echo 'Comming Soon.';
			return '';
		}

		if($settings['instafeedFeedType'] === 'hashtag_type' && !$this->validInstagramTagUrl($embed_link)){
			echo 'Please add valid hashtag link url';
			return '';
		}

		if($settings['instafeedFeedType'] === 'user_account_type' && !$this->validUserAccountUrl($embed_link)){
			echo 'Please add valid user account link url';
			return '';
		}
		
		$is_editor_view = Plugin::$instance->editor->is_edit_mode();
		$link = $settings['embedpress_embeded_link'];
		$is_apple_podcast = (strpos($link, 'podcasts.apple.com') !== false);

		// conditionaly convert settings data
		$_settings = [];
		$source = isset($settings['embedpress_pro_embeded_source']) ? esc_attr($settings['embedpress_pro_embeded_source']) : 'default';
		$embed_link = isset($settings['embedpress_embeded_link']) ? esc_url($settings['embedpress_embeded_link']) : '';
		$pass_hash_key = isset($settings['embedpress_lock_content_password']) ? md5($settings['embedpress_lock_content_password']) : '';



		Helper::get_source_data(md5($this->get_id()) . '_eb_elementor', esc_url($embed_link), 'elementor_source_data', 'elementor_temp_source_data');

		if (!(($source === 'default' || !empty($source[0]) && $source[0] === 'default') && strpos($embed_link, 'opensea.io') !== false)) {
			$_settings = $this->convert_settings($settings);
		}

		if (strpos($embed_link, 'opensea.io') !== false) {
			$source = 'opensea';
		}

        $_settings = Helper::removeQuote($_settings);


		$embed_content = Shortcode::parseContent($settings['embedpress_embeded_link'], true, $_settings);
		$embed_content = $this->onAfterEmbedSpotify($embed_content, $settings);
		$embed         = apply_filters('embedpress_elementor_embed', $embed_content, $settings);
		$content       = is_object($embed) ? $embed->embed : $embed;



		$embed_settings =  [];
		$embed_settings['customThumbnail'] = !empty($settings['embedpress_content_share_custom_thumbnail']['url']) ? esc_url($settings['embedpress_content_share_custom_thumbnail']['url']) : '';

		$embed_settings['customTitle'] = !empty($settings['embedpress_content_title']) ? sanitize_text_field($settings['embedpress_content_title']) : Helper::get_file_title($embed_link);

		$embed_settings['customDescription'] = !empty($settings['embedpress_content_descripiton']) ? sanitize_text_field($settings['embedpress_content_descripiton']) : Helper::get_file_title($embed_link);

		$embed_settings['sharePosition'] = !empty($settings['embedpress_content_share_position']) ? sanitize_text_field($settings['embedpress_content_share_position']) : 'right';

		$embed_settings['lockHeading'] = !empty($settings['embedpress_lock_content_heading']) ? sanitize_text_field($settings['embedpress_lock_content_heading']) : '';

		$embed_settings['lockSubHeading'] = !empty($settings['embedpress_lock_content_sub_heading']) ? sanitize_text_field($settings['embedpress_lock_content_sub_heading']) : '';

		$embed_settings['passwordPlaceholder'] = !empty($settings['embedpress_password_placeholder']) ? sanitize_text_field($settings['embedpress_password_placeholder']) : '';

		$embed_settings['submitButtonText'] = !empty($settings['embedpress_submit_button_text']) ? sanitize_text_field($settings['embedpress_submit_button_text']) : '';

		$embed_settings['submitUnlockingText'] = !empty($settings['embedpress_submit_Unlocking_text']) ? sanitize_text_field($settings['embedpress_submit_Unlocking_text']) : '';

		$embed_settings['lockErrorMessage'] = !empty($settings['embedpress_lock_content_error_message']) ? sanitize_text_field($settings['embedpress_lock_content_error_message']) : '';

		$embed_settings['enableFooterMessage'] = !empty($settings['embedpress_enable_footer_message']) ? sanitize_text_field($settings['embedpress_enable_footer_message']) : '';

		$embed_settings['footerMessage'] = !empty($settings['embedpress_lock_content_footer_message']) ? sanitize_text_field($settings['embedpress_lock_content_footer_message']) : '';
		
		$embed_settings['userRole'] = !empty($settings['embedpress_select_roles']) ? $settings['embedpress_select_roles'] : [];

		$embed_settings['protectionMessage'] = !empty($settings['embedpress_protection_message']) ? $settings['embedpress_protection_message'] : '';


		$client_id = $this->get_id();
		$hash_pass = hash('sha256', wp_salt(32) . md5($settings['embedpress_lock_content_password'] ? sanitize_text_field($settings['embedpress_lock_content_password']) : ''));

		$password_correct =  isset($_COOKIE['password_correct_' . $client_id]) ? sanitize_text_field($_COOKIE['password_correct_' . $client_id]) : '';

		$ispagination = 'flex';

		if ($settings['pagination'] != 'show') {
			$ispagination = 'none';
		}

		$calVal = '';

		if (!empty($settings['columns']) && is_numeric($settings['columns']) && (int) $settings['columns'] > 0) {
			$columns = (int) $settings['columns'];
			$gap_size = isset($settings['gapbetweenvideos']['size']) ? absint($settings['gapbetweenvideos']['size']) : 0;
			$calVal = 'calc(' . (100 / $columns) . '% - ' . $gap_size . 'px)';
		} else {
			$calVal = 'auto';
		}


		$content_share_class = '';
		$share_position_class = '';
		$share_position = isset($settings['embedpress_content_share_position']) ? esc_attr($settings['embedpress_content_share_position']) : 'right';

		if (!empty($settings['embedpress_content_share'])) {
			$content_share_class = 'ep-content-share-enabled';
			$share_position_class = 'ep-share-position-' . $share_position;
		}

		$content_protection_class = 'ep-content-protection-enabled';
		if (empty($settings['embedpress_lock_content']) || empty($settings['embedpress_lock_content_password']) || $hash_pass === $password_correct) {
			$content_protection_class = 'ep-content-protection-disabled';
		}

		$data_playerid = '';
		if (!empty($settings['embedpress_custom_player'])) {
			$data_playerid = 'data-playerid="' . esc_attr($this->get_id()) . '"';
			// $data_playerid = 'data-playerid='.esc_attr($this->get_id());
		}

		$data_carouselid = '';
		if (!empty($settings['instaLayout']) && $settings['instaLayout'] === 'insta-carousel') {
			$data_carouselid = 'data-carouselid="' . esc_attr($this->get_id()) . '"';
		}

		$cEmbedType = !empty($settings['cEmbedType']) ? sanitize_text_field($settings['cEmbedType']) : '';

		$adsAtts = '';

		if (!empty($settings['adManager'])) {
			$ad = base64_encode(json_encode($settings)); // Using WordPress JSON encoding function
			$adsAtts = 'data-sponsored-id="' . esc_attr($client_id) . '" data-sponsored-attrs="' . esc_attr($ad) . '" class="sponsored-mask"';
		}

		$data_player_id = '';

		if (!empty($settings['emberpress_custom_player']) && $settings['emberpress_custom_player'] === 'yes') {
			$data_player_id = "data-playerid='" . esc_attr($this->get_id()) . "'";
		} 
		
		$hosted_format = '';
		if (!empty($settings['emberpress_custom_player'])) {			
			$self_hosted = Helper::check_media_format($settings['embedpress_embeded_link']);
			$hosted_format =  isset($self_hosted['format']) ? $self_hosted['format'] : '';
		}

		$autoPause = '';
		if(!empty($settings['embedpress_audio_video_auto_pause'])){
			$autoPause = ' enabled-auto-pause';
		}

		?>

		<div class="embedpress-elements-wrapper <?php echo !empty($settings['embedpress_elementor_aspect_ratio']) ? 'embedpress-fit-aspect-ratio' : '';
			echo esc_attr($cEmbedType); ?>" id="ep-elements-id-<?php echo esc_attr($this->get_id()); ?>">

			<?php if(!apply_filters('embedpress/is_allow_rander', false) && $is_editor_view && $is_apple_podcast) : ?>

				<p><?php esc_html_e('You need EmbedPress Pro to Embed Apple Podcast. Note. This message is only visible to you.', 'embedpress'); ?></p>
			<?php else: ?>
				<div id="ep-elementor-content-<?php echo esc_attr($client_id) ?>" 
					class="ep-elementor-content 
					<?php 
						if (!empty($settings['embedpress_content_share'])) : 
							echo esc_attr('position-' . $settings['embedpress_content_share_position'] . '-wraper'); 
						endif; 
					?> 
					<?php echo esc_attr($content_share_class . ' ' . $share_position_class . ' ' . $content_protection_class); ?> 
					<?php echo esc_attr('source-' . $source); ?>
					<?php echo esc_attr($autoPause); ?>">

					<div id="<?php echo esc_attr($this->get_id()); ?>" 
						class="ep-embed-content-wrapper 
						<?php echo isset($settings['custom_player_preset']) ? esc_attr($settings['custom_player_preset']) : ''; ?> 
						<?php echo esc_attr($this->get_instafeed_layout($settings)); ?> 
						<?php echo esc_attr($hosted_format); ?>" 
						<?php echo $data_playerid; ?>
						<?php echo $data_carouselid; ?>
						<?php echo $this->get_custom_player_options($settings); ?>
						<?php echo $this->get_instafeed_carousel_options($settings); ?>>

						<div id="ep-elementor-content-<?php echo esc_attr($client_id) ?>" 
							class="ep-elementor-content 
							<?php 
								if (!empty($settings['embedpress_content_share'])) : 
									echo esc_attr('position-' . $settings['embedpress_content_share_position'] . '-wraper'); 
								endif; 
							?> 
							<?php echo esc_attr($content_share_class . ' ' . $share_position_class . ' ' . $content_protection_class); ?> 
							<?php echo esc_attr('source-' . $source); ?>">

							<div <?php echo $adsAtts; ?>>
								<div id="<?php echo esc_attr($this->get_id()); ?>" 
									class="ep-embed-content-wraper 
									<?php echo esc_attr($settings['custom_payer_preset']); ?>" 
									<?php echo $data_player_id; ?> 
									<?php echo $this->get_custom_player_options($settings); ?>>

									<?php
									$content_id = $client_id;
									if (
										(empty($settings['embedpress_lock_content']) || ($settings['embedpress_protection_type'] == 'password' && empty($settings['embedpress_lock_content_password'])) || $settings['embedpress_lock_content'] == 'no') || 
										($settings['embedpress_protection_type'] == 'password' && !empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct) ) || 
										!apply_filters('embedpress/is_allow_rander', false) || 
										($settings['embedpress_protection_type'] == 'user-role' && Helper::has_allowed_roles($embed_settings['userRole']))
									) {
										if (!empty($settings['embedpress_content_share'])) {
											$content .= Helper::embed_content_share($content_id, $embed_settings);
										}

										echo $content;
									} else {
										if (!empty($settings['embedpress_content_share'])) {
											$content .= Helper::embed_content_share($content_id, $embed_settings);
										}

										if ($settings['embedpress_protection_type'] == 'password') {
											do_action('embedpress/display_password_form', $client_id, $content, $pass_hash_key, $embed_settings);

										} else {
											do_action('embedpress/content_protection_content', $client_id, $embed_settings['protectionMessage'],  $embed_settings['userRole']);
										}
									}
									?>
								</div>

								<?php
									if (!empty($settings['adManager']) && (!empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct) )) {
										$content = apply_filters('embedpress/generate_ad_template', $content, $client_id, $settings, 'elementor');
									}
								?>
							</div>
						</div>
					</div>
				</div>

			<?php endif;?>
				
		</div>


		<?php if ($settings['embedpress_pro_embeded_source'] === 'youtube') : ?>
			<style>
				#ep-elements-id-<?php echo esc_html($this->get_id()); ?>.ep-youtube__content__block .youtube__content__body .content__wrap {
					grid-template-columns: repeat(auto-fit, minmax(<?php echo esc_html($calVal); ?>, 1fr)) !important;
				}

				#ep-elements-id-<?php echo esc_html($this->get_id()); ?>.ep-youtube__content__pagination {
					display: <?php echo esc_html($ispagination); ?> !important;
				}
			</style>
		<?php endif; ?>

<?php
	}
	public function onAfterEmbedSpotify($embed, $setting)
	{
		if (!isset($embed->provider_name) || strtolower($embed->provider_name) !== 'spotify' || !isset($embed->embed)) {
			return $embed;
		}
		$match = array();
		preg_match('/src=\"(.+?)\"/', $embed->embed, $match);
		if (empty($match)) {
			return $embed;
		}
		$url_full = $match[1];
		$modified_url = str_replace('playlist-v2', 'playlist', $url_full);
		if (isset($setting['spotify_theme'])) {
			if (strpos($modified_url, '?') !== false) {
				$modified_url .= '&theme=' . sanitize_text_field($setting['spotify_theme']);
			} else {
				$modified_url .= '?theme=' . sanitize_text_field($setting['spotify_theme']);
			}
		}
		$embed->embed = str_replace($url_full, $modified_url, $embed->embed);
		return $embed;
	}
}
