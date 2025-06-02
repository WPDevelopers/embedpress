<?php

namespace EmbedPress\Includes\Classes;

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
				'label' => __('Ad Source', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'video' => __('Upload Video', 'embedpress'),
					'image' => __('Upload Image', 'embedpress'),
					// 'url' => __('URL', 'embedpress'),
				],
				'default' => 'video',
				'condition' => $ad_condition,
				'ai'     => $ai_condition,
			]
		);

		$that->add_control(
			'adFileUrl',
			[
				'label' => __('Uploaded Video', 'embedpress'),
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
				'label' => __('Uploaded Image', 'embedpress'),
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
				'label' => __('Ad Width', 'embedpress'),
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
				'label' => __('Ad Height', 'embedpress'),
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
				'label' => __('Ad X Position(%)', 'embedpress'),
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
				'label' => __('Ad Y Position(%)', 'embedpress'),
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
				'label' => __('Ad URL', 'embedpress'),
				'type' => \Elementor\Controls_Manager::TEXT,
				'condition' => $ad_condition,
				'ai'     => $ai_condition,

			]
		);

		$that->add_control(
			'adStart',
			[
				'label' => __('Ad Start After (sec)', 'embedpress'),
				'type' => \Elementor\Controls_Manager::TEXT,
				'condition' => $ad_condition,
				'default' => '5',
				'ai'     => $ai_condition,

			]
		);

		$that->add_control(
			'adSkipButton',
			[
				'label' => __('Ad Skip Button', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __('Yes', 'embedpress'),
				'label_off' => __('No', 'embedpress'),
				'default' => 'yes',
				'condition' => $ad_condition
			]
		);

		$that->add_control(
			'adSkipButtonAfter',
			[
				'label' => __('Skip Button After (sec)', 'embedpress'),
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
				'label' => __('Protection Type', 'embedpress'),
				'type' => \Elementor\Controls_Manager::SELECT,
				'options' => [
					'user-role' => __('User Role', 'embedpress'),
					'password' => __('Password Protected', 'embedpress'),
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
				'label' => __('Select roles', 'embedpress'),
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
				'label'       => __('Protection Message', 'embedpress'),
				'type'        => Controls_Manager::TEXTAREA,
				'default'     => sprintf(__('You do not have access to this content. Only users with the following roles can view it: %s.', 'embedpress'), '[user_roles]'),
				'placeholder' => sprintf(__('You do not have access to this content. Only users with the following roles can view it: %s.', 'embedpress'), '[user_roles]'),
				'label_block' => true,
				'condition'   => $user_role_condition
			]
		);

		$that->add_control(
			'embedpress' . $infix . 'lock_content_password',
			[
				'label'       => __('Set Password', 'embedpress'),
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
				'label' => __('Error Message', 'embedpress'),
				'type' => Controls_Manager::TEXTAREA,
				'default' => 'Oops, that wasn\'t the right password. Try again.',
				'placeholder' => __('Oops, that wasn\'t the right password. Try again.', 'embedpress'),
				'label_block' => true,
				'condition'   => $password_condition

			]
		);
		$that->add_control(
			'embedpress' . $infix . 'password_placeholder',
			[
				'label' => __('Placeholder', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Password',
				'placeholder' => __('Password', 'embedpress'),
				'label_block' => false,
				'condition'   => $password_condition

			]
		);
		$that->add_control(
			'embedpress' . $infix . 'submit_button_text',
			[
				'label' => __('Button Text', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Unlock',
				'placeholder' => __('Unlock', 'embedpress'),
				'label_block' => false,
				'condition'   => $password_condition

			]
		);
		$that->add_control(
			'embedpress' . $infix . 'submit_Unlocking_text',
			[
				'label' => __('Loader Text', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Unlocking...',
				'placeholder' => __('Unlocking...', 'embedpress'),
				'label_block' => false,
				'condition'   => $password_condition

			]
		);

		$that->add_control(
			'embedpress' . $infix . 'lock_content_heading',
			[
				'label' => __('Header', 'embedpress'),
				'type' => Controls_Manager::TEXT,
				'default' => 'Content Locked',
				'placeholder' => __('Content Locked', 'embedpress'),
				'label_block' => false,
				'condition'   => $password_condition

			]
		);

		$that->add_control(
			'embedpress' . $infix . 'lock_content_sub_heading',
			[
				'label' => __('Description', 'embedpress'),
				'type' => Controls_Manager::TEXTAREA,
				'default' => 'Content is locked and requires password to access it.',
				'placeholder' => __('Content is locked and requires password to access it.', 'embedpress'),
				'label_block' => true,
				'condition'   => $password_condition

			]
		);


		$that->add_control(
			'embedpress' . $infix . 'enable_footer_message',
			[
				'label'        => __('Footer Text', 'embedpress'),
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
				'label' => __('Footer', 'embedpress'),
				'type' => Controls_Manager::TEXTAREA,
				'default' => 'In case you don\'t have the password, kindly reach out to content owner or administrator to request access.',
				'placeholder' => __('In case you don\'t have the password, kindly reach out to content owner or administrator to request access.', 'embedpress'),
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
				'label'        => __('Enable Social Share', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
			]
		);
		$that->add_control(
			'embedpress' . $infix . 'content_share_position',
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
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);
		$that->add_control(
			'embedpress' . $infix . 'content_title',
			[
				'label'   => __('Title', 'embedpress'),
				'type'    => Controls_Manager::TEXT,
				'placeholder' => __('Enter share title', 'embedpress'),
				'condition'   => [
					'embedpress' . $infix . 'content_share' => 'yes'
				]
			]
		);
		$that->add_control(
			'embedpress' . $infix . 'content_descripiton',
			[
				'label'   => __('Description', 'embedpress'),
				'type'    => Controls_Manager::TEXTAREA,
				'placeholder' => __('Enter share description', 'embedpress'),
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
				'label' => __('Share Platforms', 'embedpress'),
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
				'label' => __('Facebook', 'embedpress'),
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
				'label' => __('Twitter', 'embedpress'),
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
				'label' => __('Pinterest', 'embedpress'),
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
				'label' => __('LinkedIn', 'embedpress'),
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
