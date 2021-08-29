<?php
namespace EmbedPress\Includes\Traits;
if ( !defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly
use Elementor\Controls_Manager as Controls_Manager;
use Elementor\Group_Control_Image_Size;

Trait Branding {
	/**
	 * @param string $provider_name
	 */
	public function init_branding_controls( $provider_name='' ) {
		if ( !isset( $this->pro_class) ) {
			$this->pro_class = '';
		}
		if ( !isset( $this->pro_text) ) {
			$this->pro_text = '';
		}
		$logo_condition = [
			"embedpress_pro_{$provider_name}_logo[url]!" =>''
		];
		$condition = [];
		if ( $provider_name !== 'document' ) {
			$logo_condition["embedpress_pro_embeded_source"] = $provider_name;
			$condition["embedpress_pro_embeded_source"] = $provider_name;
		}
		$this->add_control(
			"{$provider_name}_custom_logo_cta_heading",
			[
				'label' => __( 'Custom Branding', 'embedpress' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => $condition,
			]
		);
		$this->add_control(
			"embedpress_pro_{$provider_name}_logo",
			[
				'label' => sprintf(__( 'Custom Logo %s', 'embedpress' ), $this->pro_text ),
				'description' => __( 'Leave it empty to hide it', 'embedpress' ),
				'type' => Controls_Manager::MEDIA,
				'dynamic' => [
					'active' => true,
				],
				'classes'     => $this->pro_class,
				'condition'     => $condition,
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
				'label' => sprintf( __( 'Logo X Position %s', 'embedpress' ), $this->pro_text),
				'description' => __( 'Change this number to move your logo in horizontal direction.', 'embedpress' ),
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
				'label' => sprintf( __( 'Logo Y Position %s', 'embedpress' ), $this->pro_text),
				'description' => __( 'Change this number to move your logo in vertical direction.', 'embedpress' ),
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
				'label' => __( 'Normal', 'embedpress' ),
			]
		);
		$this->add_control(
			"embedpress_pro_{$provider_name}_logo_opacity",
			[
				'label' => sprintf( __( 'Logo Opacity %s', 'embedpress' ), $this->pro_text),
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
				'label' => __( 'Hover', 'embedpress' ),
			]
		);
		$this->add_control(
			"embedpress_pro_{$provider_name}_logo_opacity_hover",
			[
				'label' => sprintf( __( 'Logo Opacity %s', 'embedpress' ), $this->pro_text),
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
				'label' => sprintf( __( 'CTA link for Logo %s', 'embedpress' ), $this->pro_text),
				'description' => __( 'You can show the logo inside a link. Leave it empty to hide it', 'embedpress' ),
				'type' => Controls_Manager::URL,
				'dynamic' => [
					'active' => true,
				],
				'placeholder' => __( 'https://your-link.com', 'embedpress' ),
				'condition'    => $logo_condition,
				'classes'     => $this->pro_class,
				'separator' => 'before',
			]
		);
	}
}