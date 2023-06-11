<?php

namespace EmbedPress\Includes\Classes;

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
			'emberpress_custom_player' => 'yes'
		];

		$that->add_control(
			'embepress_player_restart',
			[
				'label'        => __('Restart', 'embedpress'),
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
				'label'        => __('Rewind', 'embedpress'),
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
				'label'        => __('Fast Forward', 'embedpress'),
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
				'label'        => __('Tooltip', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
			]
		);
		$that->add_control(
			'embepress_player_hide_controls',
			[
				'label'        => __('Hide Controls', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'condition' => $condition,
			]
		);

	}
}
