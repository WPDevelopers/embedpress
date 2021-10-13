<?php

namespace EmbedPress\Elementor\Widgets;


use \Elementor\Controls_Manager as Controls_Manager;
use \Elementor\Modules\DynamicTags\Module as TagsModule;
use \Elementor\Widget_Base as Widget_Base;
use \Elementor\Plugin;
use EmbedPress\Includes\Traits\Branding;

( defined( 'ABSPATH' ) ) or die( "No direct script access allowed." );

class Embedpress_Calendar extends Widget_Base
{
	use Branding;
	protected $pro_class = '';
	protected $pro_text = '';
	public function get_name()
	{
		return 'embedpress_calendar';
	}

	public function get_title()
	{
		return esc_html__( 'EmbedPress Calender', 'embedpress' );
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
		return 'icon-calendar';
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
		return ['embedpress', 'calendar', 'google', 'google calender', 'google-calender', 'ics', 'event', 'embedpress calendar'];
	}

	protected function _register_controls()
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
				'label'   => __( 'Calender Type', 'embedpress' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'private',
				'options' => [
					'private' => __( 'Private', 'embedpress' ),
					'public'  => __( 'Public', 'embedpress' )
				],
			]
		);




		$this->add_control(
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
						'max' => 1000,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .embedpress-calendar-embed iframe'               => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
					'{{WRAPPER}} .embedpress-calendar-embed .pdfobject-container' => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
				],
			]
		);

		$this->add_control(
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
					'{{WRAPPER}}'               => 'height: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .embedpress-calendar-embed iframe'               => 'height: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .embedpress-calendar-embed .pdfobject-container' => 'height: {{SIZE}}{{UNIT}};',
				],
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
					'description' => '<span class="pro-feature"> Get the  <a href="https://wpdeveloper.net/in/upgrade-embedpress" target="_blank">Pro version</a> for more provider support and customization options.</span>',
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
			'class' => ['embedpress-calendar-embed', 'ep-doc-'.md5( $id), 'ose-calendar']
		] );

		$calendars = ''
		?>
		<div <?php echo $this->get_render_attribute_string( 'embedpress-calendar' ); ?> style="<?php echo esc_attr( $dimension); ?>; max-width:100%; display: inline-block">
			<?php
			do_action( 'embedpress_calendar_after_embed',  $settings, $id, $this);
			?>
			<?php if ( $calendars != '' ) {?>
					<div <?php echo $this->get_render_attribute_string( 'embedpress-calendar-render' ); ?>>
					</div>
					<?php
				if ( $settings[ 'embedpress_calendar_powered_by' ] === 'yes' ) {
					printf( '<p class="embedpress-el-powered">%s</p>', __( 'Powered By EmbedPress', 'embedpress' ) );
				}
			}
			?>
		</div>

		<?php
	}

}
