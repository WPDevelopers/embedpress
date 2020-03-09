<?php

namespace EmbedPress\Elementor\Widgets;


use \Elementor\Controls_Manager as Controls_Manager;
use \Elementor\Widget_Base as Widget_Base;
use \EmbedPress\Shortcode;
(defined( 'ABSPATH' )) or die( "No direct script access allowed." );

class Embedpress_Elementor extends Widget_Base {

    public function get_name() {
        return 'embedpres-elementor';
    }

    public function get_title() {
        return esc_html__( 'Embedpress', 'embedoress' );
    }

    public function get_categories() {
        return [ 'embedpress' ];
    }

    public function get_custom_help_url() {
        return 'https://embedpress.com/documentation';
    }

    public function get_icon() {
        return 'eicon-document-file';
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
        return [ 'embedpress', 'audio', 'video', 'map' ];
    }

    protected function _register_controls() {
        /**
         * Call to Action Content Settings
         */
        $this->start_controls_section(
            'embedpress_elementor_content_settings',
            [
                'label' => esc_html__( 'Content Settings', 'embedpress' ),
            ]
        );

        $this->add_control(
            'embedpress_embeded_link',
            [

                'label'       => __( 'Embeded Link', 'embedpress' ),
                'type'        => Controls_Manager::TEXTAREA,
                'placeholder' => __( 'Enter your Link', 'embedpress' )

            ]
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $embed      = Shortcode::parseContent( $settings['embedpress_embeded_link'], true, [] );

        $data = is_object( $embed ) ? $embed->embed : $embed;
        echo $data;
    }
}
