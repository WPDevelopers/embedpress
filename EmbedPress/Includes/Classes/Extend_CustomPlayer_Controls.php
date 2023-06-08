<?php

namespace EmbedPress\Includes\Classes;
use \Elementor\Controls_Manager;

class Extend_CustomPlayer_Controls {

	public function __construct () {
		add_action( 'extend_customplayer_controls', [$this, 'extend_elementor_customplayer_controls'], 10, 4 );
	}
	
	public function extend_elementor_customplayer_controls($that, $infix = '', $pro_text = '', $pro_class = ''){
		$that->start_controls_section(
            'emberpress_customplayer_controls',
            [
                'label' => esc_html__('Custom Player Controls', 'embedpress'),
				'condition'   => [
					'emberpress_custom_player' => 'yes'
				]
            ]
        );

        $that->add_control(
			'custom_payer_preset',
			[
				'label'       => __('Preset', 'embedpress'),
				'type'        => Controls_Manager::SELECT,
				'label_block' => false,
				'default'     => 'default',
				'options'     => [
					'default'     => __('Default', 'embedpress'),
					'custom-player-preset-1'     => __('Preset 1', 'embedpress'),
					'custom-player-preset-1'       => __('Preset 2', 'embedpress'),
					'custom-player-preset-1' => __('Preset 3', 'embedpress'),
					'custom-player-preset-1'      => __('Preset 4', 'embedpress'),
					'custom-player-preset-1'  => __('Preset 5', 'embedpress'),
				]
			]
		);

		$that->add_control(
			'embedpress_player_color',
			[
				'label'       => __('Player Color', 'embedpress'),
				'type'        => Controls_Manager::COLOR,
				'label_block' => false,
				'default'     => '#dd3333',
			]
		);

		$that->add_control(
			'embepress_player_always_on_top',
			[
				'label'        => __('Always on Top', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
			]
		);
		$that->add_control(
			'embepress_player_restart',
			[
				'label'        => __('Restart', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
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
			]
		);
		$that->add_control(
			'embepress_player_hide_controls',
			[
				'label'        => __('Hide Controls', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'no',
			]
		);

		
        
        $that->end_controls_section();

	}


}