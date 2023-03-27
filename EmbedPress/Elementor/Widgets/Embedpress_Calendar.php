<?php

namespace EmbedPress\Elementor\Widgets;


use \Elementor\Controls_Manager as Controls_Manager;
use \Elementor\Modules\DynamicTags\Module as TagsModule;
use \Elementor\Widget_Base as Widget_Base;
use \Elementor\Plugin;
use EmbedPress\Includes\Traits\Branding;
use Embedpress_Google_Helper;
use EmbedPress\Includes\Classes\Helper;

( defined( 'ABSPATH' ) ) or die( "No direct script access allowed." );

class Embedpress_Calendar extends Widget_Base
{
	use Branding;
	protected $pro_class = '';
	protected $pro_text = '';
	public function __construct($data = [], $args = null) {
		parent::__construct($data, $args);

		wp_register_style('fullcalendar', EPGC_ASSET_URL . 'lib/fullcalendar4/core/main.min.css', null, EMBEDPRESS_VERSION);
		wp_register_style('fullcalendar_daygrid', EPGC_ASSET_URL . 'lib/fullcalendar4/daygrid/main.min.css', ['fullcalendar'], EMBEDPRESS_VERSION);
		wp_register_style('fullcalendar_timegrid', EPGC_ASSET_URL . 'lib/fullcalendar4/timegrid/main.min.css', ['fullcalendar_daygrid'], EMBEDPRESS_VERSION);
		wp_register_style('fullcalendar_list', EPGC_ASSET_URL . 'lib/fullcalendar4/list/main.min.css', ['fullcalendar'], EMBEDPRESS_VERSION);
		wp_register_style('epgc', EPGC_ASSET_URL . 'css/epgc.css', ['fullcalendar_timegrid'], EMBEDPRESS_VERSION);
		wp_register_style('tippy_light', EPGC_ASSET_URL . 'lib/tippy/light-border.css', null, EMBEDPRESS_VERSION);

		//wp_enqueue_style( 'fullcalendar');
		//wp_enqueue_style( 'fullcalendar_daygrid');
		//wp_enqueue_style( 'fullcalendar_timegrid');
		//wp_enqueue_style( 'fullcalendar_list');
		//wp_enqueue_style( 'epgc');
		//wp_enqueue_style( 'tippy_light');


		wp_register_script('popper',EPGC_ASSET_URL . 'lib/popper.min.js', null, EMBEDPRESS_VERSION, true);
		wp_register_script('tippy',EPGC_ASSET_URL . 'lib/tippy/tippy-bundle.umd.min.js', ['popper'], EMBEDPRESS_VERSION, true);
		wp_register_script('my_moment',EPGC_ASSET_URL . 'lib/moment/moment-with-locales.min.js', null, EMBEDPRESS_VERSION, true);
		wp_register_script('my_moment_timezone',EPGC_ASSET_URL . 'lib/moment/moment-timezone-with-data.min.js', ['my_moment'], EMBEDPRESS_VERSION, true);
		wp_register_script('fullcalendar',EPGC_ASSET_URL . 'lib/fullcalendar4/core/main.min.js', ['my_moment_timezone'], EMBEDPRESS_VERSION, true);
		wp_register_script('fullcalendar_moment',EPGC_ASSET_URL . 'lib/fullcalendar4/moment/main.min.js', ['fullcalendar'], EMBEDPRESS_VERSION, true);
		wp_register_script('fullcalendar_moment_timezone',EPGC_ASSET_URL . 'lib/fullcalendar4/moment-timezone/main.min.js', ['fullcalendar_moment'], EMBEDPRESS_VERSION, true);
		wp_register_script('fullcalendar_daygrid',EPGC_ASSET_URL . 'lib/fullcalendar4/daygrid/main.min.js', ['fullcalendar'], EMBEDPRESS_VERSION, true);
		wp_register_script('fullcalendar_timegrid',EPGC_ASSET_URL . 'lib/fullcalendar4/timegrid/main.min.js', ['fullcalendar_daygrid'], EMBEDPRESS_VERSION, true);
		wp_register_script('fullcalendar_list',EPGC_ASSET_URL . 'lib/fullcalendar4/list/main.min.js', ['fullcalendar'], EMBEDPRESS_VERSION, true);
		wp_register_script('fullcalendar_locales',EPGC_ASSET_URL . 'lib/fullcalendar4/core/locales-all.min.js',['fullcalendar'], EMBEDPRESS_VERSION, true);
		wp_register_script('epgc', EPGC_ASSET_URL . 'js/main.js',['fullcalendar'], EMBEDPRESS_VERSION, true);

		//wp_enqueue_script('popper');
		//wp_enqueue_script('my_moment');
		//wp_enqueue_script('my_moment_timezone');
		//wp_enqueue_script('fullcalendar');
		//wp_enqueue_script('fullcalendar_moment');
		//wp_enqueue_script('fullcalendar_moment_timezone');
		//wp_enqueue_script('fullcalendar_daygrid');
		//wp_enqueue_script('fullcalendar_timegrid');
		//wp_enqueue_script('fullcalendar_list');
		//wp_enqueue_script('fullcalendar_locales');
		//wp_enqueue_script('epgc');

		$nonce = wp_create_nonce('epgc_nonce');
		wp_localize_script('epgc', 'epgc_object', [
			'ajax_url' => admin_url('admin-ajax.php'),
			'nonce' => $nonce,
			'trans' => [
				'all_day' => __('All day', 'embedpress'),
				'created_by' => __('Created by', 'embedpress'),
				'go_to_event' => __('Go to event', 'embedpress'),
				'unknown_error' => __('Unknown error', 'embedpress'),
				'request_error' => __('Request error', 'embedpress'),
				'loading' => __('Loading', 'embedpress')
			]
		]);
	}
	public function get_name()
	{
		return 'embedpress_calendar';
	}

	public function get_title()
	{
		return esc_html__( 'EmbedPress Google Calendar', 'embedpress' );
	}

	public function get_categories()
	{
		return ['embedpress'];
	}

	public function get_custom_help_url()
	{
		return 'https://embedpress.com/docs/embed-google-calendar-in-wordpress/';
	}

	public function get_icon()
	{
		return 'eicon-calendar';
	}

    public function get_script_depends() {
        return ['popper','tippy', 'my_moment', 'my_moment_timezone', 'fullcalendar', 'fullcalendar_moment', 'fullcalendar_moment_timezone', 'fullcalendar_daygrid', 'fullcalendar_timegrid', 'fullcalendar_list', 'fullcalendar_locales', 'epgc'];
    }

	public function get_style_depends() {
        return ['fullcalendar', 'fullcalendar_daygrid', 'fullcalendar_list','epgc', 'tippy_light'];
	}

	/**
	 * Get widget keywords.
	 *
	 * Retrieve the list of keywords the widget belongs to.
	 *
	 * @return array Widget keywords.
	 * @since 2.5.5
	 * @access public
	 *
	 */
	public function get_keywords()
	{
		return ['embedpress', 'calendar', 'google', 'google calendar', 'google-calendar', 'ics', 'event', 'embedpress calendar'];
	}

	protected function register_controls()
	{
		$this->pro_class = is_embedpress_pro_active() ? '': 'embedpress-pro-control';
		$this->pro_text = is_embedpress_pro_active() ? '': '<sup class="embedpress-pro-label" style="color:red">'.__('Pro', 'embedpress').'</sup>';
		/**
		 * EmbedPress Content Settings
		 */
		$this->start_controls_section(
			'embedpress_calendar_content_settings',
			[
				'label' => esc_html__( 'Content Settings', 'embedpress' ),
			]
		);

		$this->add_control(
			'embedpress_calendar_type',
			[
				'label'   => __( 'Calendar Type', 'embedpress' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'public',
				'options' => [
					'private' => __( 'Private', 'embedpress' ),
					'public'  => __( 'Public', 'embedpress' )
				],
			]
		);


		$this->add_control(
			'embedpress_public_cal_link',
			[

				'label'       => __( 'Public Calendar Link', 'embedpress' ),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => [
					'active' => true,
				],
				'placeholder' => __( 'Enter public calendar link', 'embedpress' ),
				'label_block' => true,
				'condition'   => [
					'embedpress_calendar_type' => 'public'
				],

			]
		);



		$this->add_responsive_control(
			'embedpress_elementor_calendar_width',
			[
				'label'     => __( 'Width', 'embedpress' ),
				'type'      => Controls_Manager::SLIDER,
				'separator' => 'before',
				'default'   => [
					'unit' => 'px',
					'size' => 600,
				],
				'range'     => [
					'px' => [
						'min' => 6,
						'max' => 1200,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .embedpress-calendar-embed iframe'               => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
				],
                'render_type' => 'template',
			]
		);

		$this->add_responsive_control(
			'embedpress_elementor_calendar_height',
			[
				'label'     => __( 'Height', 'embedpress' ),
				'type'      => Controls_Manager::SLIDER,
				'default'   => [
					'unit' => 'px',
					'size' => 600,
				],
				'range'     => [
					'px' => [
						'min' => 6,
						'max' => 1000,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .embedpress-calendar-embed iframe'               => 'height: {{SIZE}}{{UNIT}};',
				],
				'render_type' => 'template',

			]
		);

		$this->add_responsive_control(
			'embedpress_elementor_calendar_align',
			[
				'label'   => __( 'Alignment', 'embedpress' ),
				'type'    => Controls_Manager::CHOOSE,
				'options' => [
					'left'   => [
						'title' => __( 'Left', 'embedpress' ),
						'icon'  => 'eicon-text-align-left',
					],
					'center' => [
						'title' => __( 'Center', 'embedpress' ),
						'icon'  => 'eicon-text-align-center',
					],
					'right'  => [
						'title' => __( 'Right', 'embedpress' ),
						'icon'  => 'eicon-text-align-right',
					]
				],
				'prefix_class' => 'elementor%s-align-',
				'default' => '',
			]
		);

		$this->add_control(
			'embedpress_calendar_powered_by',
			[
				'label'        => __( 'Powered By', 'embedpress' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'Show', 'embedpress' ),
				'label_off'    => __( 'Hide', 'embedpress' ),
				'return_value' => 'yes',
				'default'      => apply_filters( 'embedpress_calendar_powered_by_control', 'yes' ),
			]
		);

		$this->init_branding_controls( 'calendar');

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
							'icon' => 'eicon-lock',
						],
					],
					'default' => '1',
					'description' => '<span class="pro-feature"> Get the  <a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Pro version</a> for more provider support and customization options.</span>',
				]
			);

			$this->end_controls_section();
		}
	}


	protected function render()
	{
		$settings = $this->get_settings();
		$id = 'embedpress-calendar-' . $this->get_id();
		$dimension = "width: {$settings['embedpress_elementor_calendar_width']['size']}px;height: {$settings['embedpress_elementor_calendar_height']['size']}px";

		$this->add_render_attribute( 'embedpress-calendar-render', [
			'class'     => ['embedpress-embed-calendar-calendar', $id],
			'data-emid' => $id
		] );
		$this->add_render_attribute( 'embedpress-calendar', [
			'class' => ['embedpress-calendar-embed', 'ep-cal-'.md5( $id), 'ose-calendar']
		] );
        $is_private_cal = (!empty( $settings['embedpress_calendar_type']) && 'private' === $settings['embedpress_calendar_type']);
        $is_editor_view = Plugin::$instance->editor->is_edit_mode();
		?>
		<div <?php echo $this->get_render_attribute_string( 'embedpress-calendar' ); ?> style="<?php echo esc_attr( $dimension); ?>; max-width:100%; display: inline-block">


			<?php
			do_action( 'embedpress_calendar_after_embed',  $settings, $id, $this);
			?>
					<div <?php echo $this->get_render_attribute_string( 'embedpress-calendar-render' ); ?>>
                        <?php if ( !empty( $settings['embedpress_public_cal_link']) && !empty( $settings['embedpress_calendar_type']) && 'public' === $settings['embedpress_calendar_type'] ) {
                            ?>
                            <iframe title="" style="<?php echo esc_attr( $dimension); ?>; max-width:100%; display: inline-block"  src="<?php echo esc_attr(  $settings['embedpress_public_cal_link']); ?>"
                                    frameborder="0"></iframe>
                        <?php
                        } else {
	                        if ( $is_editor_view && empty( $settings['embedpress_public_cal_link']) && !$is_private_cal ) {
		                        ?>
                                <p><?php esc_html_e( 'Please paste your public google calendar link.', 'embedpress'); ?></p>
		                        <?php
                            }
                            // handle notice display
	                        if ( $is_editor_view && $is_private_cal ) {
		                        if ( !is_embedpress_pro_active()) {
			                        ?>
                                    <p><?php esc_html_e( 'You need EmbedPress Pro to display Private Calendar Data.', 'embedpress'); ?></p>
			                        <?php
		                        }else{
		                        ?>
                                <p><?php esc_html_e( 'Private Calendar Data will be displayed in the frontend', 'embedpress'); ?></p>
		                        <?php
		                        }
	                        }else{
		                        // handle printing private calendar data
		                        if ( is_embedpress_pro_active() ) {
                                    echo Embedpress_Google_Helper::shortcode();
		                        }
	                        }


                        }
                        ?>
					</div>
					<?php
				if ( $settings[ 'embedpress_calendar_powered_by' ] === 'yes' ) {
					printf( '<p class="embedpress-el-powered">%s</p>', __( 'Powered By EmbedPress', 'embedpress' ) );
				}

			?>
		</div>

		<?php

	}

}
