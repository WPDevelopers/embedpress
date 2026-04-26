<?php

namespace EmbedPress\Includes\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use \Elementor\Controls_Manager;

class Extend_CustomPlayer_Controls
{

	public function __construct()
	{
		add_action('extend_customplayer_controls', [$this, 'extend_elementor_customplayer_controls'], 10, 4);
	}

	public function extend_elementor_customplayer_controls($that, $infix = '', $pro_text = '', $pro_class = '')
	{

		$condition = [
			'emberpress_custom_player' => 'yes',
			'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'selfhosted_video', 'selfhosted_audio']
		];

		$that->add_control(
			'embepress_player_restart',
			[
				'label'        => esc_html__('Restart', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
			]
		);
		$that->add_control(
			'embepress_player_rewind',
			[
				'label'        => esc_html__('Rewind', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
			]
		);
		$that->add_control(
			'embepress_player_fast_forward',
			[
				'label'        => esc_html__('Fast Forward', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
			]
		);
		$that->add_control(
			'embepress_player_tooltip',
			[
				/* translators: %s: Pro badge indicator */
				'label' => sprintf(__('Tooltip %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
				'classes'     => $pro_class,

			]
		);
		$that->add_control(
			'embepress_player_hide_controls',
			[
				/* translators: %s: Pro badge indicator */
				'label' => sprintf(__('Auto Hide Controls %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'classes'     => $pro_class,
				'condition' =>  [
					'emberpress_custom_player' => 'yes',
					'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'selfhosted_video']
				],
			]
		);
		$that->add_control(
			'embepress_player_download',
			[
				/* translators: %s: Pro badge indicator */
				'label' => sprintf(__('Source Link %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
				'classes'     => $pro_class,
			]
		);
	}
}
