<?php

namespace EmbedPress\Elementor\Widgets;


use \Elementor\Controls_Manager as Controls_Manager;
use Elementor\Group_Control_Background;
use \Elementor\Group_Control_Css_Filter;
use \Elementor\Widget_Base as Widget_Base;
use \EmbedPress\Shortcode;

(defined( 'ABSPATH' )) or die( "No direct script access allowed." );

class Embedpress_Elementor extends Widget_Base {

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
            'embedpress_embeded_link',
            [

                'label'       => __( 'Embeded Link', 'embedpress' ),
                'type'        => Controls_Manager::TEXT,
                'dynamic'     => [
                    'active' => true,
                ],
                'placeholder' => __( 'Enter your Link', 'embedpress' ),
                'label_block' => true

            ]
        );

        do_action( 'embedpress/control/extend', $this );

        $this->end_controls_section();

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
        $settings      = $this->get_settings_for_display();
        $height = (!empty( $settings['height']) && !empty( $settings['height']['size'] ))
            ? $settings['height']['size'] : null;
	    $width = (!empty( $settings['width']) && !empty( $settings['width']['size'] ))
		    ? $settings['width']['size'] : null;

        $embed_content = Shortcode::parseContent( $settings['embedpress_embeded_link'], true, [ 'height'=> $height, 'width'=>$width ] );
        $embed         = apply_filters( 'embedpress_elementor_embed', $embed_content, $settings );
        $content       = is_object( $embed ) ? $embed->embed : $embed;

        ?>
        <div class="embedpress-elements-wrapper <?php echo !empty( $settings['embedpress_elementor_aspect_ratio']) ? 'embedpress-fit-aspect-ratio': ''; ?>">
            <?php echo $content; ?>
        </div>
        <?php
    }


}
