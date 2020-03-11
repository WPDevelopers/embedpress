<?php

namespace EmbedPress\Elementor;


(defined( 'ABSPATH' )) or die( "No direct script access allowed." );

class Embedpress_Elementor_Integration {

    /**
     * @since  2.4.2
     */
    public function init() {
        add_action( 'elementor/frontend/after_enqueue_styles', [ $this, 'embedpress_enqueue_style' ] );
        add_action( 'elementor/elements/categories_registered', array( $this, 'register_widget_categories' ) );
        add_action( 'elementor/widgets/widgets_registered', array( $this, 'register_widget' ) );
    }

    /**
     * Add elementor category
     *
     * @since 2.4.3
     */
    public function register_widget_categories( $elements_manager ) {
        $elements_manager->add_category(
            'embedpress',
            [
                'title' => __( 'EmbedPress', 'embedpress' ),
                'icon'  => 'font',
            ], 1 );
    }

    /**
     * Load elementor widget
     *
     * @since  2.4.2
     */
    public function register_widget( $widgets_manager ) {
        $widgets_manager->register_widget_type( new \EmbedPress\Elementor\Widgets\Embedpress_Elementor );
    }

    /**
     * Enqueue elementor assets
     * @since  2.4.3
     */
    public function embedpress_enqueue_style(){
        wp_enqueue_style(
            'embedpress-elementor-css',
            EMBEDPRESS_URL_ASSETS . 'css/embedpress-elementor.css',
            false,
            EMBEDPRESS_VERSION
        );
    }

}
