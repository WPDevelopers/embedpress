<?php

namespace EmbedPress\Elementor\Widgets;


use \Elementor\Controls_Manager as Controls_Manager;
use Elementor\Group_Control_Background;
use \Elementor\Group_Control_Css_Filter;
use Elementor\Group_Control_Image_Size;
use \Elementor\Widget_Base as Widget_Base;
use \EmbedPress\Shortcode;

(defined( 'ABSPATH' )) or die( "No direct script access allowed." );

class Embedpress_Elementor extends Widget_Base {
    protected $pro_class = '';
    public function get_name() {
        return 'embedpres_elementor';
    }

    public function get_title() {
        return esc_html__( 'EmbedPress', 'embedoress' );
    }

    public function get_categories() {
        return [ 'embedpress' ];
    }

    public function get_custom_help_url() {
        return 'https://embedpress.com/documentation';
    }

    public function get_icon() {
        return 'icon-embedpress';
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
    public function get_keywords() {
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
    protected function _register_controls() {
        $this->pro_class = is_embedpress_pro_active() ? '': 'embedpress-pro-control';
        /**
         * EmbedPress Content Settings
         */
        $this->start_controls_section(
            'embedpress_elementor_content_settings',
            [
                'label' => esc_html__( 'Content Settings', 'embedpress' ),
            ]
        );

        do_action( 'embedpress/embeded/extend', $this );
	    $this->add_control(
		    'embedpress_pro_embeded_source',
		    [
			    'label'       => __( 'Source Name', 'embedpress-pro' ),
			    'type'        => Controls_Manager::SELECT,
			    'label_block' => false,
			    'default'     => ['default'],
			    'options'     => [
				    'default'     => __( 'Default', 'embedpress-pro' ),
				    'youtube'     => __( 'YouTube', 'embedpress-pro' ),
				    'vimeo'       => __( 'Vimeo', 'embedpress-pro' ),
				    'dailymotion' => __( 'Dailymotion', 'embedpress-pro' ),
				    'wistia'      => __( 'Wistia', 'embedpress-pro' ),
				    'twitch'  => __( 'Twitch', 'embedpress-pro' ),
				    'soundcloud'  => __( 'SoundCloud', 'embedpress-pro' ),
			    ]
		    ]
	    );
        $this->add_control(
            'embedpress_embeded_link',
            [

                'label'       => __( 'Embedded Link', 'embedpress' ),
                'type'        => Controls_Manager::TEXT,
                'dynamic'     => [
                    'active' => true,
                ],
                'placeholder' => __( 'Enter your Link', 'embedpress' ),
                'label_block' => true

            ]
        );

	    $this->add_control(
		    'spotify_theme',
		    [
			    'label'       => __( 'Player Background', 'embedpress-pro' ),
			    'description'       => __( 'Dynamic option will use the most vibrant color from the album art.', 'embedpress-pro' ),
			    'type'        => Controls_Manager::SELECT,
			    'label_block' => false,
			    'default'     => '1',
			    'options'     => [
				    '1'   => __( 'Dynamic', 'embedpress-pro' ),
				    '0' => __( 'Black & White', 'embedpress-pro' )
			    ],
			    'condition'   => [
				    'embedpress_pro_embeded_source' => 'spotify'
			    ]
		    ]
	    );
        do_action( 'embedpress/control/extend', $this );
	    $this->add_control(
		    'embedpress_pro_video_start_time',
		    [
			    'label'       => __( 'Start Time', 'embedpress-pro' ),
			    'type'        => Controls_Manager::NUMBER,
			    'classes'     => $this->pro_class,
			    'description' => __( 'Specify a start time (in seconds)', 'embedpress-pro' ),
			    'condition'   => [
				    'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'wistia', 'dailymotion', 'twitch']
			    ],
		    ]
	    );
        $this->init_youtube_controls();
        $this->init_vimeo_controls();
        $this->init_wistia_controls();
        $this->init_soundcloud_controls();
        $this->init_dailymotion_control();
        $this->init_twitch_control();
        $this->end_controls_section();
	    if (! is_embedpress_pro_active()) {
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
						    'icon' => 'fa fa-unlock-alt',
					    ],
				    ],
				    'default' => '1',
				    'description' => '<span class="pro-feature"> Get the  <a href="https://wpdeveloper.net/in/upgrade-embedpress" target="_blank">Pro version</a> for more provider support and customization options.</span>',
			    ]
		    );

		    $this->end_controls_section();
	    }

        $this->init_style_controls();
    }
	public function init_youtube_controls() {
		$yt_condition = [
			'embedpress_pro_embeded_source' => 'youtube'
		];
		$this->add_control(
			'embedpress_pro_youtube_end_time',
			[
				'label'       => __( 'End Time', 'embedpress-pro' ),
				'type'        => Controls_Manager::NUMBER,
				'description' => __( 'Specify an end time (in seconds)', 'embedpress-pro' ),
				'condition'   => $yt_condition,
			]
		);


		$this->add_control(
			'embedpress_pro_youtube_auto_play',
			[
				'label'        => __( 'Auto Play', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => $yt_condition,
			]
		);

		$this->add_control(
			'embedpress_pro_youtube_progress_bar_color',
			[
				'label'       => __( 'Progress Bar Color', 'embedpress-pro' ),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'classes'     => $this->pro_class,
				'default'     => 'red',
				'options'     => [
					'red'   => __( 'Red', 'embedpress-pro' ),
					'white' => __( 'White', 'embedpress-pro' )
				],
				'condition'   => $yt_condition,
			]
		);

		$this->add_control(
			'embedpress_pro_youtube_force_closed_captions',
			[
				'label'        => __( 'Closed Captions', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'separator'    => 'after',
				'classes'     => $this->pro_class,
				'condition'    => $yt_condition,
			]
		);

		$this->add_control(
			'embedpress_pro_youtube_player_options',
			[
				'label'     => __( 'Player Options', 'embedpress-pro' ),
				'type'      => Controls_Manager::HEADING,
				'condition' => $yt_condition,
			]
		);

		$this->add_control(
			'embedpress_pro_youtube_display_controls',
			[
				'label'       => __( 'Controls', 'embedpress-pro' ),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 1,
				'options'     => [
					'1' => __( 'Display immediately', 'embedpress-pro' ),
					'2' => __( 'Display after user initiation', 'embedpress-pro' ),
					'0' => __( 'Hide controls', 'embedpress-pro' )
				],
				'condition'   => $yt_condition,
			]
		);

		$this->add_control(
			'embedpress_pro_youtube_enable_fullscreen_button',
			[
				'label'        => __( 'Fullscreen button', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_source'            => 'youtube',
					'embedpress_pro_youtube_display_controls!' => '0'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_youtube_display_video_annotations',
			[
				'label'       => __( 'Video Annotations', 'embedpress-pro' ),
				'type'        => Controls_Manager::SWITCHER,
				'label_block' => false,
				'default'     => 1,
				'options'     => [
					'1' => __( 'Display', 'embedpress-pro' ),
					'3' => __( 'Do Not Display', 'embedpress-pro' )
				],
				'condition'   => $yt_condition,
			]
		);

		$this->add_control(
			'embedpress_pro_youtube_modest_branding',
			[
				'label'       => __( 'Modest Branding', 'embedpress-pro' ),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 1,
				'options'     => [
					'0' => __( 'Display', 'embedpress-pro' ),
					'1' => __( 'Do Not Display', 'embedpress-pro' )
				],
				'condition'   => [
					'embedpress_pro_embeded_source'              => 'youtube',
					'embedpress_pro_youtube_display_controls!'   => '0',
					'embedpress_pro_youtube_progress_bar_color!' => 'white'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_youtube_display_related_videos',
			[
				'label'        => __( 'Related Videos', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => $yt_condition,
				'classes'     => $this->pro_class,
			]
		);
		$this->init_branding_controls( 'youtube');
	}
	public function init_dailymotion_control ( ){

		$this->add_control(
			'embedpress_pro_dailymotion_autoplay',
			[
				'label'        => __( 'Auto Play', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_dailymotion_play_on_mobile',
			[
				'label'        => __( 'Play On Mobile', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion',
					'embedpress_pro_dailymotion_autoplay' => 'yes'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_dailymotion_mute',
			[
				'label'        => __( 'Mute', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_dailymotion_player_control',
			[
				'label'        => __( 'Player Controls', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_dailymotion_video_info',
			[
				'label'        => __( 'Video Info', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_dailymotion_logo',
			[
				'label'        => __( 'Logo', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_dailymotion_control_color',
			[
				'label'       => __( 'Control Color', 'embedpress-pro' ),
				'type'        => Controls_Manager::COLOR,
				'label_block' => false,
				'default'     => '#dd3333',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'dailymotion'
				]
			]
		);
	}
	public function init_wistia_controls( ) {
		$this->add_control(
			'embedpress_pro_wistia_auto_play',
			[
				'label'        => __( 'Auto Play', 'embedpress-pro' ),
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
				'label'       => __( 'Scheme', 'embedpress-pro' ),
				'type'        => Controls_Manager::COLOR,
				'label_block' => false,
				'default'     => '#dd3333',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'wistia'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_wistia_captions',
			[
				'label'        => __( 'Captions', 'embedpress-pro' ),
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
				'label'        => __( 'Captions Enabled By Default', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source'  => 'wistia',
					'embedpress_pro_wistia_captions' => 'yes'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_wistia_player_options',
			[
				'label'     => __( 'Player Options', 'embedpress-pro' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'embedpress_pro_embeded_source' => 'wistia'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_wistia_playbar',
			[
				'label'        => __( 'Playbar', 'embedpress-pro' ),
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
			'embedpress_pro_wistia_fullscreen_button',
			[
				'label'        => __( 'Fullscreen Button', 'embedpress-pro' ),
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
				'label'        => __( 'Small Play Button', 'embedpress-pro' ),
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
				'label'        => __( 'Volume Control', 'embedpress-pro' ),
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
				'label'     => __( 'Volume', 'embedpress-pro' ),
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


		$this->add_control(
			'embedpress_pro_wistia_resumable',
			[
				'label'        => __( 'Resumable', 'embedpress-pro' ),
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
			'embedpress_pro_wistia_focus',
			[
				'label'        => __( 'Focus', 'embedpress-pro' ),
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
			'embedpress_pro_wistia_rewind',
			[
				'label'        => __( 'Rewind', 'embedpress-pro' ),
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
			'embedpress_pro_wistia_rewind_time',
			[
				'label'     => __( 'Rewind time', 'embedpress-pro' ),
				'type'      => Controls_Manager::SLIDER,
				'default'   => [
					'size' => 10,
				],
				'range'     => [
					'px' => [
						'min' => 1,
						'max' => 100,
					]
				],
				'condition' => [
					'embedpress_pro_wistia_rewind'  => 'yes',
					'embedpress_pro_embeded_source' => 'wistia'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->init_branding_controls( 'wistia');

	}
	public function init_twitch_control( ) {
		$condition = [
			'embedpress_pro_embeded_source' => 'twitch'
		];
		$this->add_control(
			'embedpress_pro_twitch_autoplay',
			[
				'label'        => __( 'Autoplay', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_off'    => __( 'No', 'embedpress-pro' ),
				'label_on'     => __( 'Yes', 'embedpress-pro' ),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);
		$this->add_control(
			'embedpress_pro_twitch_chat',
			[
				'label'        => __( 'Show Chat', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => $condition,
				'classes'     => $this->pro_class,

			]
		);
		$this->add_control(
			'embedpress_pro_twitch_mute',
			[
				'label'        => __( 'Mute on start', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => $condition,
				'classes'     => $this->pro_class,
			]
		);
		$this->add_control(
			'embedpress_pro_twitch_theme',
			[
				'label' => __( 'Theme', 'embedpress-pro' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'dark',
				'options' => [
					'dark'  => __( 'Dark', 'embedpress-pro' ),
					'light' => __( 'Light', 'embedpress-pro' ),
				],
				'condition'    => $condition,
				'classes'     => $this->pro_class,
			]
		);
		$this->add_control(
			'embedpress_pro_fs',
			[
				'label'        => __( 'Allow Full Screen Video', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_off'    => __( 'No', 'embedpress-pro' ),
				'label_on'     => __( 'Yes', 'embedpress-pro' ),
				'default'      => 'yes',
				'condition'    => $condition,
			]
		);
		$this->init_branding_controls( 'twitch');

	}
	public function init_soundcloud_controls( ) {
		$this->add_control(
			'embedpress_pro_soundcloud_visual',
			[
				'label'        => __( 'Visual Player', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_color',
			[
				'label'       => __( 'Scheme', 'embedpress-pro' ),
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
				'label'        => __( 'Auto Play', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_buy_button',
			[
				'label'        => __( 'Buy Button', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_share_button',
			[
				'label'        => __( 'Share Button', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_comments',
			[
				'label'        => __( 'Comments', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_download_button',
			[
				'label'        => __( 'Download Button', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_artwork',
			[
				'label'        => __( 'Artwork', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source'     => 'soundcloud',
					'embedpress_pro_soundcloud_visual!' => 'yes'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_play_count',
			[
				'label'        => __( 'Play Count', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);

		$this->add_control(
			'embedpress_pro_soundcloud_user_name',
			[
				'label'        => __( 'User Name', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'label_off'    => __( 'Hide', 'embedpress-pro' ),
				'label_on'     => __( 'Show', 'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'soundcloud'
				],
			]
		);
	}
	public function init_vimeo_controls( ) {
		$this->add_control(
			'embedpress_pro_vimeo_auto_play',
			[
				'label'        => __( 'Auto Play', 'embedpress-pro' ),
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
			'embedpress_pro_vimeo_loop',
			[
				'label'        => __( 'Loop', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'vimeo'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_autopause',
			[
				'label'        => __( 'Auto Pause', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'vimeo'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_dnt',
			[
				'label'        => __( 'DNT', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'description'  => __( 'Set this parameter to "yes" will block the player from tracking any session data, including all cookies',
					'embedpress-pro' ),
				'condition'    => [
					'embedpress_pro_embeded_source' => 'vimeo'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_color',
			[
				'label'       => __( 'Scheme', 'embedpress-pro' ),
				'type'        => Controls_Manager::COLOR,
				'label_block' => false,
				'default'     => '#00adef',
				'condition'   => [
					'embedpress_pro_embeded_source' => 'vimeo'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_author_options',
			[
				'label'     => __( 'Author Information', 'embedpress-pro' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'embedpress_pro_embeded_source' => 'vimeo'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_display_title',
			[
				'label'        => __( 'Title', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'vimeo'
				]
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_display_author',
			[
				'label'        => __( 'Author', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'vimeo'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->add_control(
			'embedpress_pro_vimeo_avatar',
			[
				'label'        => __( 'Avatar', 'embedpress-pro' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition'    => [
					'embedpress_pro_embeded_source' => 'vimeo'
				],
				'classes'     => $this->pro_class,
			]
		);

		$this->init_branding_controls( 'vimeo');

	}
	public function init_spotify_controls() {
		$condition = [
			'embedpress_pro_embeded_source' => 'spotify'
		];


		$this->add_control(
			'spotify_theme',
			[
				'label'       => __( 'Player Background', 'embedpress-pro' ),
				'description'       => __( 'Dynamic option will use the most vibrant color from the album art.', 'embedpress-pro' ),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => '1',
				'options'     => [
					'1'   => __( 'Dynamic', 'embedpress-pro' ),
					'0' => __( 'Black & White', 'embedpress-pro' )
				],
				'condition'   => $condition
			]
		);

		$this->add_control(
			'spotify_follow_theme',
			[
				'label'       => __( 'Follow Widget Background', 'embedpress-pro' ),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 'light',
				'options'     => [
					'light'   => __( 'Light', 'embedpress-pro' ),
					'dark' => __( 'Dark', 'embedpress-pro' )
				],
				'condition'   => $condition
			]
		);
	}
	public function init_branding_controls( $provider_name='' ) {
		$condition = [
			'embedpress_pro_embeded_source' => $provider_name,
		];
		$logo_condition = [
			'embedpress_pro_embeded_source' => $provider_name,
			"embedpress_pro_{$provider_name}_logo[url]!" =>''
		];

		$this->add_control(
			"{$provider_name}_custom_logo_cta_heading",
			[
				'label' => __( 'Custom Logo & CTA', 'embedpress-pro' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition'    => $condition,
			]
		);
		$this->add_control(
			"embedpress_pro_{$provider_name}_logo",
			[
				'label' => __( 'Custom Logo', 'embedpress-pro' ),
				'description' => __( 'Leave it empty to hide it', 'embedpress-pro' ),
				'type' => Controls_Manager::MEDIA,
				'dynamic' => [
					'active' => true,
				],
				'condition'    => $condition,
				'classes'     => $this->pro_class,
			]
		);

		$this->add_group_control(
			Group_Control_Image_Size::get_type(),
			[
				'name' => "embedpress_pro_{$provider_name}_logo",
				'default' => 'full',
				'condition'    => $logo_condition,
				'classes'     => $this->pro_class,
			]
		);

		$this->add_responsive_control(
			"embedpress_pro_{$provider_name}_logo_xpos",
			[
				'label' => __( 'Logo X Position', 'embedpress-pro' ),
				'description' => __( 'Change this number to move your logo in horizontal direction.', 'embedpress-pro' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%' ],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1000,
						'step' => 5,
					],
					'%' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default' => [
					'unit' => '%',
					'size' => 10,
				],
				'selectors' => [
					"{{WRAPPER}} .ose-{$provider_name} .watermark" => 'right: {{SIZE}}{{UNIT}};',
				],
				'condition'    => $logo_condition,
				'classes'     => $this->pro_class,
			]
		);
		$this->add_responsive_control(
			"embedpress_pro_{$provider_name}_logo_ypos",
			[
				'label' => __( 'Logo Y Position (%)', 'embedpress-pro' ),
				'description' => __( 'Change this number to move your logo in vertical direction.', 'embedpress-pro' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%' ],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1000,
						'step' => 5,
					],
					'%' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default' => [
					'unit' => '%',
					'size' => 10,
				],
				'selectors' => [
					"{{WRAPPER}} .ose-{$provider_name} .watermark" => 'bottom: {{SIZE}}{{UNIT}};',
				],
				'condition'    => $logo_condition,
				'classes'     => $this->pro_class,

			]
		);
		$this->start_controls_tabs(
			"ep_{$provider_name}_cta_style_tabs",
			[
				'condition'    => $logo_condition,
			]
		);

		$this->start_controls_tab( "ep_{$provider_name}_cta_normal_tab",
			[
				'label' => __( 'Normal', 'embedpress-pro' ),
			]
		);
		$this->add_control(
			"embedpress_pro_{$provider_name}_logo_opacity",
			[
				'label' => __( 'Logo Opacity', 'embedpress-pro' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => .5,
				],
				'range' => [
					'px' => [
						'max' => 1,
						'step' => 0.01,
					],
				],
				'selectors' => [
					"{{WRAPPER}} .ose-{$provider_name} .watermark" => 'opacity: {{SIZE}};',
				],
				'condition'    => $logo_condition,
				'classes'     => $this->pro_class,

			]
		);
		$this->end_controls_tab();
		$this->start_controls_tab( "ep_{$provider_name}_cta_hover__tab",
			[
				'label' => __( 'Hover', 'embedpress-pro' ),
			]
		);
		$this->add_control(
			"embedpress_pro_{$provider_name}_logo_opacity_hover",
			[
				'label' => __( 'Logo Opacity', 'embedpress-pro' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ '%'],
				'default' => [
					'size' => 1,
				],
				'range' => [
					'px' => [
						'max' => 1,
						'step' => 0.01,
					],
				],
				'selectors' => [
					"{{WRAPPER}} .ose-{$provider_name} .watermark:hover" => 'opacity: {{SIZE}};',
				],
				'condition'    => $logo_condition,
				'classes'     => $this->pro_class,

			]
		);
		$this->end_controls_tab();
		$this->end_controls_tabs();

		$this->add_control(
			"embedpress_pro_{$provider_name}_cta",
			[
				'label' => __( 'CTA link for Logo', 'embedpress-pro' ),
				'description' => __( 'You can show the logo inside a link. Leave it empty to hide it', 'embedpress-pro' ),
				'type' => Controls_Manager::URL,
				'dynamic' => [
					'active' => true,
				],
				'placeholder' => __( 'https://your-link.com', 'embedpress-pro' ),
				'condition'    => $logo_condition,
				'classes'     => $this->pro_class,
				'separator' => 'before',
			]
		);
	}

	public function init_style_controls() {
		$this->start_controls_section(
			'embedpress_style_section',
			[
				'label' => __( 'Style', 'elementor' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);
		$this->add_control(
			'embedpress_elementor_aspect_ratio',
			[
				'label'              => __( 'Aspect Ratio', 'embedpress' ),
				'description'              => __( 'Good for any video. You may turn it off for other embed type.', 'embedpress' ),
				'type'               => Controls_Manager::SELECT,
				'options'            => [
					0 => __('None'),
					'169' => '16:9',
					'219' => '21:9',
					'43'  => '4:3',
					'32'  => '3:2',
					'11'  => '1:1',
					'916' => '9:16',
				],
				'default'            => 0,
				'prefix_class'       => 'embedpress-aspect-ratio-',
				'frontend_available' => true,
			]
		);
		$this->add_control(
			'width',
			[
				'label' => __( 'Width', 'embedpress' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1500,
						'step' => 5,
					],
				],
				'default' => [
					'unit' => 'px',
					'size' => 600,
				]
			]
		);
		$this->add_control(
			'height',
			[
				'label' => __( 'Height', 'embedpress' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1500,
						'step' => 5,
					],
				],
				'default' => [
					'unit' => 'px',
					'size' => 400,
				]
			]
		);
		$this->add_responsive_control(
			'margin',
			[
				'label' => __( 'Margin', 'embedpress' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em' ],
				'selectors' => [
					'{{WRAPPER}} .embedpress-elements-wrapper .embedpress-wrapper' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);
		$this->add_responsive_control(
			'padding',
			[
				'label' => __( 'Padding', 'embedpress' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em' ],
				'selectors' => [
					'{{WRAPPER}} .embedpress-elements-wrapper .embedpress-wrapper' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);
		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background',
				'label' => __( 'Background', 'embedpress' ),
				'types' => [ 'classic', 'gradient' ],
				'selector' => '{{WRAPPER}} .embedpress-elements-wrapper .embedpress-wrapper, {{WRAPPER}} .embedpress-fit-aspect-ratio .embedpress-wrapper iframe',
			]
		);
		$this->add_group_control(
			Group_Control_Css_Filter::get_type(),
			[
				'name'     => 'embedpress_elementor_css_filters',
				'selector' => '{{WRAPPER}} .embedpress-elements-wrapper .embedpress-wrapper',
			]
		);
		$this->end_controls_section();
	}
    protected function render() {
        add_filter( 'embedpress_should_modify_spotify', '__return_false');
        $settings      = $this->get_settings_for_display();
        $height = (!empty( $settings['height']) && !empty( $settings['height']['size'] ))
            ? $settings['height']['size'] : null;
	    $width = (!empty( $settings['width']) && !empty( $settings['width']['size'] ))
		    ? $settings['width']['size'] : null;

        $embed_content = Shortcode::parseContent( $settings['embedpress_embeded_link'], true, [ 'height'=> $height, 'width'=>$width ] );
        $embed_content = $this->onAfterEmbedSpotify($embed_content, $settings);
        $embed         = apply_filters( 'embedpress_elementor_embed', $embed_content, $settings );
        $content       = is_object( $embed ) ? $embed->embed : $embed;

        ?>
        <div class="embedpress-elements-wrapper <?php echo !empty( $settings['embedpress_elementor_aspect_ratio']) ? 'embedpress-fit-aspect-ratio': ''; ?>">
            <?php echo $content; ?>
        </div>
        <?php
    }
	public function onAfterEmbedSpotify( $embed, $setting ) {
		if ( !isset( $embed->provider_name ) || strtolower( $embed->provider_name ) !== 'spotify' || !isset( $embed->embed ) ) {
			return $embed;
		}
		preg_match( '/src=\"(.+?)\"/', $embed->embed, $match );
		$url_full = $match[ 1 ];
		$modified_url = str_replace( 'playlist-v2', 'playlist', $url_full);
			// apply elementor related mod
			if(isset( $setting['spotify_theme'])){
				if ( strpos(  $modified_url, '?') !== false ) {
					$modified_url .= '&theme='.sanitize_text_field( $setting['spotify_theme']);
				}else{
					$modified_url .= '?theme='.sanitize_text_field( $setting['spotify_theme']);
				}
			}


		$embed->embed = str_replace( $url_full, $modified_url, $embed->embed );
		return $embed;
	}
}
