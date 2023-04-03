<?php

namespace EmbedPress\Includes\Classes;
use \Elementor\Controls_Manager;

class Extend_Elementor_Controls {

	public function __construct () {
		add_action( 'extend_elementor_controls', [$this, 'extend_elementor_share_and_lock_controls'], 10, 2 );
	}
	
	public function extend_elementor_share_and_lock_controls($that, $prefix = ''){
		$that->start_controls_section(
            'embedpress_content_protection_settings',
            [
                'label' => esc_html__('Content Protection', 'embedpress'),
            ]
        );

        $that->add_control(
			'embedpress'.$prefix.'lock_content',
			[
				'label'        => sprintf(__('Lock Content %s', 'embedpress'), $that->pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'classes'     => $that->pro_class,
			]
		);

		$that->add_control(
			'embedpress'.$prefix.'lock_content_password',
			[
				'label'       => __('Set Password', 'embedpress'),
				'type'        => Controls_Manager::TEXT,
				'default'	=> '12345',
				'label_block' => false,
				'condition'   => [
					'embedpress'.$prefix.'lock_content' => 'yes'
				]
			]
		);

        $that->add_control(
			'embedpress'.$prefix.'lock_content_heading',
			[
				'label' => __('Lock Heading', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Content Locked',
				'label_block' => false,
				'condition' => [
					'embedpress'.$prefix.'lock_content' => 'yes'
				]
			]
		);
		
		$that->add_control(
			'embedpress'.$prefix.'lock_content_sub_heading',
			[
				'label' => __('Lock Subheading', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'This content is currently locked and requires a password to access.',
				'label_block' => false,
				'condition' => [
					'embedpress'.$prefix.'lock_content' => 'yes'
				]
			]
		);
		
		$that->add_control(
			'embedpress'.$prefix.'lock_content_error_message',
			[
				'label' => __('Submit Error Message', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Invalid password. Please try again.',
				'label_block' => false,
				'condition' => [
					'embedpress'.$prefix.'lock_content' => 'yes'
				]
			]
		);
		  
		$that->add_control(
			'embedpress'.$prefix.'lock_content_footer_message',
			[
				'label' => __('Footer Message', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'If you don’t have the password, please contact the content owner or administrator to request access.',
				'label_block' => false,
				'condition' => [
					'embedpress'.$prefix.'lock_content' => 'yes'
				]
			]
		);
        
        $that->end_controls_section();

        $that->start_controls_section(
            'embedpress_content_share_settings',
            [
                'label' => esc_html__('Content Share', 'embedpress'),
            ]
        );

        $that->add_control(
			'embedpress'.$prefix.'content_share',
			[
				'label'        => __('Enable Content Share', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
			]
		);
        $that->add_control(
            'embedpress'.$prefix.'content_share_position',
            [
                'label'   => __('Position', 'embedpress'),
                'type'    => Controls_Manager::SELECT,
                'default' => 'right',
                'options' => [
                    'top'        => __('Top', 'embedpress'),
                    'right' => __('Right', 'embedpress'),
                    'bottom'    => __('Bottom', 'embedpress'),
                    'left'  => __('Left', 'embedpress'),
                ],
                'condition'   => [
					'embedpress'.$prefix.'content_share' => 'yes'
				]
            ]
        );
        $that->add_control(
            'embedpress'.$prefix.'content_title',
            [
                'label'   => __('Title', 'embedpress'),
                'type'    => Controls_Manager::TEXT,
                'placeholder' => 'Enter share title',
                'condition'   => [
					'embedpress'.$prefix.'content_share' => 'yes'
				]
            ]
        );
        $that->add_control(
            'embedpress'.$prefix.'content_descripiton',
            [
                'label'   => __('Description', 'embedpress'),
                'type'    => Controls_Manager::TEXTAREA,
                'placeholder' => 'Enter share description',
                'condition'   => [
					'embedpress'.$prefix.'content_share' => 'yes'
				]
            ]
        );

        $that->add_control(
			'embedpress'.$prefix.'content_share_custom_thumbnail',
			[
				'label' => esc_html__( 'Thumbnail', 'textdomain' ),
				'type' => \Elementor\Controls_Manager::MEDIA,
				'default' => [
					'url' => \Elementor\Utils::get_placeholder_image_src(),
				],
                'condition'   => [
					'embedpress'.$prefix.'content_share' => 'yes'
				]
			]
		);
        $that->end_controls_section();

	}


}