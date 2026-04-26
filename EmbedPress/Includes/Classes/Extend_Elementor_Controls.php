<?php

namespace EmbedPress\Includes\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use \Elementor\Controls_Manager;

class Extend_Elementor_Controls
{

	public function __construct()
	{
		add_action('extend_elementor_controls', [$this, 'extend_elementor_share_and_lock_controls'], 10, 4);
	}

	public function get_user_roles()
	{
		global $wp_roles;

		$all = $wp_roles->roles;
		$all_roles = array();

		if (!empty($all)) {
			foreach ($all as $key => $value) {
				$all_roles[$key] = $all[$key]['name'];
			}
		}

		return $all_roles;
	}

	public function extend_elementor_share_and_lock_controls($that, $infix = '', $pro_text = '', $pro_class = '')
	{
		$ad_condition = [
			'adManager' => 'yes'
		];
		$ai_condition = [
			'active' => false,
		];

		$that->start_controls_section(
			'embedpress_adManager',
			[
				'label' => esc_html__('EP Ads Settings', 'embedpress'),
			]
		);

		$that->add_control(
			'adManager',
			[
				/* translators: %s: Pro badge indicator */
				'label'        => sprintf(__('Ads Settings %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'classes'     => $pro_class,
			]
		);

		$that->add_control(
			'adSource',
			[
				'label' => esc_html__('Ad Source', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'video' => esc_html__('Upload Video', 'embedpress'),
					'image' => esc_html__('Upload Image', 'embedpress'),
					// 'url' => esc_html__('URL', 'embedpress'),
				],
				'default' => 'video',
				'condition' => $ad_condition,
				'ai'     => $ai_condition,
			]
		);

		$that->add_control(
			'adFileUrl',
			[
				'label' => esc_html__('Uploaded Video', 'embedpress'),
				'type' => \Elementor\Controls_Manager::MEDIA,
				'media_types' => [
					'video'
				],
				'condition' => [
					'adManager' => 'yes',
					'adSource'  => 'video',
				],
				'ai'     => $ai_condition,
			]
		);
		$that->add_control(
			'adFileUrl1',
			[
				'label' => esc_html__('Uploaded Image', 'embedpress'),
				'type' => \Elementor\Controls_Manager::MEDIA,
				'media_types' => [
					'image'
				],
				'condition' => [
					'adManager' => 'yes',
					'adSource'  => 'image',
				],
				'ai'     => $ai_condition,
			]
		);
		// $that->add_control(
		// 	'adFileUrl2',
		// 	[
		// 		'type' => \Elementor\Controls_Manager::URL,
		// 		'condition' => [
		// 			'adManager' => 'yes',
		// 			'adSource'  => 'url',
		// 		],
		// 		'ai'     => $ai_condition,
		// 	]
		// );

		// For Ad Width TextControl
		$that->add_control(
			'adWidth',
			[
				'label' => esc_html__('Ad Width', 'embedpress'),
				'type' => \Elementor\Controls_Manager::TEXT,
				'condition' => [
					'adManager' => 'yes',
					'adSource' => 'image',
				],
				'default' => '300',
				'ai'     => $ai_condition,
			]
		);

		// For Ad Height TextControl
		$that->add_control(
			'adHeight',
			[
				'label' => esc_html__('Ad Height', 'embedpress'),
				'type' => \Elementor\Controls_Manager::TEXT,
				'condition' => [
					'adManager' => 'yes',
					'adSource' => 'image',
				],
				'default' => '200',
				'ai'     => $ai_condition,
			]
		);

		// For Ad X Position RangeControl
		$that->add_control(
			'adXPosition',
			[
				'label' => esc_html__('Ad X Position(%)', 'embedpress'),
				'type' => \Elementor\Controls_Manager::NUMBER,
				'default' => 25, // Set the default value if needed
				'min' => 0,
				'max' => 100,
				'condition' => [
					'adManager' => 'yes',
					'adSource' => 'image',
				],
			]
		);

		// For Ad Y Position RangeControl
		$that->add_control(
			'adYPosition',
			[
				'label' => esc_html__('Ad Y Position(%)', 'embedpress'),
				'type' => \Elementor\Controls_Manager::NUMBER,
				'default' => 20, // Set the default value if needed
				'min' => 0,
				'max' => 100,
				'condition' => [
					'adManager' => 'yes',
					'adSource' => 'image',
				],
			]
		);

		$that->add_control(
			'adUrl',
			[
				'label' => esc_html__('Ad URL', 'embedpress'),
				'type' => \Elementor\Controls_Manager::TEXT,
				'condition' => $ad_condition,
				'ai'     => $ai_condition,

			]
		);

		$that->add_control(
			'adStart',
			[
				'label' => esc_html__('Ad Start After (sec)', 'embedpress'),
				'type' => \Elementor\Controls_Manager::TEXT,
				'condition' => $ad_condition,
				'default' => '5',
				'ai'     => $ai_condition,

			]
		);

		$that->add_control(
			'adSkipButton',
			[
				'label' => esc_html__('Ad Skip Button', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Yes', 'embedpress'),
				'label_off' => esc_html__('No', 'embedpress'),
				'default' => 'yes',
				'condition' => $ad_condition
			]
		);

		$that->add_control(
			'adSkipButtonAfter',
			[
				'label' => esc_html__('Skip Button After (sec)', 'embedpress'),
				'type' => \Elementor\Controls_Manager::TEXT,
				'condition' => [
					'adManager' => 'yes',
					'adSkipButton' => 'yes',
				],
				'ai'     => $ai_condition,
				'default' => '5'
			]
		);

		$that->end_controls_section();

		$that->start_controls_section(
			'embedpress_content_protection_settings',
			[
				'label' => esc_html__('EP Content Protection', 'embedpress'),
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'lock_content',
			[
				/* translators: %s: Pro badge indicator */
				'label'        => sprintf(__('Enable Content Protection %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'classes'     => $pro_class,
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'protection_type',
			[
				'label' => esc_html__('Protection Type', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'user-role' => esc_html__('User Role', 'embedpress'),
					'password' => esc_html__('Password Protected', 'embedpress'),
				],
				'default' => 'password',
				'condition' => [
					'embedpress' . $infix . 'lock_content' => 'yes',
				]
			]
		);
		$user_role_condition = [
			'embedpress' . $infix . 'protection_type' => 'user-role',
			'embedpress' . $infix . 'lock_content' => 'yes',
		];
		$password_condition = [
			'embedpress' . $infix . 'protection_type' => 'password',
			'embedpress' . $infix . 'lock_content' => 'yes',
		];

		$that->add_control(
			'embedpress' . $infix . 'select_roles',
			[
				'label' => esc_html__('Select roles', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT2,
				'multiple' => true,
				'options' => $this->get_user_roles(),
				'label_block' => true,
				'default' => [''],
				'condition'   => $user_role_condition
			]
		);
		$that->add_control(
			'embedpress' . $infix . 'protection_message',
			[
				'label'       => esc_html__('Protection Message', 'embedpress'),
				'type'        => Controls_Manager::TEXTAREA,
				/* translators: %s: User roles placeholder */
				'default'     => sprintf(__('You do not have access to this content. Only users with the following roles can view it: %s.', 'embedpress'), '[user_roles]'),
				/* translators: %s: User roles placeholder */
				'placeholder' => sprintf(__('You do not have access to this content. Only users with the following roles can view it: %s.', 'embedpress'), '[user_roles]'),
				'label_block' => true,
				'condition'   => $user_role_condition
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'lock_content_password',
			[
				'label'       => esc_html__('Set Password', 'embedpress'),
				'type'        => Controls_Manager::TEXT,
				'default'	=> '',
				'placeholder'	=> '••••••',
				'label_block' => false,
				'condition'   => $password_condition

			]
		);


		$that->add_control(
			'embedpress' . $infix . 'lock_content_error_message',
			[
				'label' => esc_html__('Error Message', 'embedpress'),
				'type' => Controls_Manager::TEXTAREA,
				'default' => 'Oops, that wasn\'t the right password. Try again.',
				'placeholder' => esc_html__('Oops, that wasn\'t the right password. Try again.', 'embedpress'),
				'label_block' => true,
				'condition'   => $password_condition

			]
		);
		$that->add_control(
			'embedpress' . $infix . 'password_placeholder',
			[
				'label' => esc_html__('Placeholder', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Password',
				'placeholder' => esc_html__('Password', 'embedpress'),
				'label_block' => false,
				'condition'   => $password_condition

			]
		);
		$that->add_control(
			'embedpress' . $infix . 'submit_button_text',
			[
				'label' => esc_html__('Button Text', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Unlock',
				'placeholder' => esc_html__('Unlock', 'embedpress'),
				'label_block' => false,
				'condition'   => $password_condition

			]
		);
		$that->add_control(
			'embedpress' . $infix . 'submit_Unlocking_text',
			[
				'label' => esc_html__('Loader Text', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Unlocking...',
				'placeholder' => esc_html__('Unlocking...', 'embedpress'),
				'label_block' => false,
				'condition'   => $password_condition

			]
		);

		$that->add_control(
			'embedpress' . $infix . 'lock_content_heading',
			[
				'label' => esc_html__('Header', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Content Locked',
				'placeholder' => esc_html__('Content Locked', 'embedpress'),
				'label_block' => false,
				'condition'   => $password_condition

			]
		);

		$that->add_control(
			'embedpress' . $infix . 'lock_content_sub_heading',
			[
				'label' => esc_html__('Description', 'embedpress'),
				'type' => Controls_Manager::TEXTAREA,
				'default' => 'Content is locked and requires password to access it.',
				'placeholder' => esc_html__('Content is locked and requires password to access it.', 'embedpress'),
				'label_block' => true,
				'condition'   => $password_condition

			]
		);


		$that->add_control(
			'embedpress' . $infix . 'enable_footer_message',
			[
				'label'        => esc_html__('Footer Text', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'condition'   => $password_condition

			]
		);

		$that->add_control(
			'embedpress' . $infix . 'lock_content_footer_message',
			[
				'label' => esc_html__('Footer', 'embedpress'),
				'type' => Controls_Manager::TEXTAREA,
				'default' => 'In case you don\'t have the password, kindly reach out to content owner or administrator to request access.',
				'placeholder' => esc_html__('In case you don\'t have the password, kindly reach out to content owner or administrator to request access.', 'embedpress'),
				'label_block' => true,
				'condition' => [
					'embedpress' . $infix . 'enable_footer_message' => 'yes',
					'embedpress' . $infix . 'protection_type' => 'password'
				]
			]
		);

		$that->end_controls_section();




		$that->start_controls_section(
			'embedpress_content_share_settings',
			[
				'label' => esc_html__('EP Social Share', 'embedpress'),
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'content_share',
			[
				'label'        => esc_html__('Enable Social Share', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
			]
		);
		$that->add_control(
			'embedpress' . $infix . 'content_share_position',
			[
				'label'   => esc_html__('Position', 'embedpress'),
				'type'    => Controls_Manager::SELECT,
				'default' => 'right',
				'options' => [
					'top'        => esc_html__('Top', 'embedpress'),
					'right' => esc_html__('Right', 'embedpress'),
					'bottom'    => esc_html__('Bottom', 'embedpress'),
					'left'  => esc_html__('Left', 'embedpress'),
				],
				'condition'   => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);
		$that->add_control(
			'embedpress' . $infix . 'content_title',
			[
				'label'   => esc_html__('Title', 'embedpress'),
				'type'    => Controls_Manager::TEXT,
				'placeholder' => esc_html__('Enter share title', 'embedpress'),
				'condition'   => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);
		$that->add_control(
			'embedpress' . $infix . 'content_descripiton',
			[
				'label'   => esc_html__('Description', 'embedpress'),
				'type'    => Controls_Manager::TEXTAREA,
				'placeholder' => esc_html__('Enter share description', 'embedpress'),
				'condition'   => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'content_share_custom_thumbnail',
			[
				'label' => esc_html__('Thumbnail', 'embedpress'),
				'type' => \Elementor\Controls_Manager::MEDIA,
				'default' => [
					'url' => \Elementor\Utils::get_placeholder_image_src(),
				],
				'condition'   => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);

		$that->add_control(
			'embedpress_share_platforms_heading',
			[
				'label' => esc_html__('Share Platforms', 'embedpress'),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'share_facebook',
			[
				'label' => esc_html__('Facebook', 'embedpress'),
				'type' => Controls_Manager::SWITCHER,
				'label_block' => false,
				'return_value' => 'yes',
				'default' => 'yes',
				'condition' => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'share_twitter',
			[
				'label' => esc_html__('Twitter', 'embedpress'),
				'type' => Controls_Manager::SWITCHER,
				'label_block' => false,
				'return_value' => 'yes',
				'default' => 'yes',
				'condition' => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'share_pinterest',
			[
				'label' => esc_html__('Pinterest', 'embedpress'),
				'type' => Controls_Manager::SWITCHER,
				'label_block' => false,
				'return_value' => 'yes',
				'default' => 'yes',
				'condition' => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'share_linkedin',
			[
				'label' => esc_html__('LinkedIn', 'embedpress'),
				'type' => Controls_Manager::SWITCHER,
				'label_block' => false,
				'return_value' => 'yes',
				'default' => 'yes',
				'condition' => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);

		$that->end_controls_section();
	}
}
