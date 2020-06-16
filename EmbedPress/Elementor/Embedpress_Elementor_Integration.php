<?php

namespace EmbedPress\Elementor;


(defined( 'ABSPATH' )) or die( "No direct script access allowed." );
use EmbedPress\Compatibility;
class Embedpress_Elementor_Integration {

    /**
     * @since  2.4.2
     */
    public function init() {
        add_action( 'elementor/frontend/after_enqueue_styles', [ $this, 'embedpress_enqueue_style' ] );
        add_action('elementor/editor/before_enqueue_scripts', array($this, 'editor_enqueue_scripts'));
        add_action( 'elementor/elements/categories_registered', array( $this, 'register_widget_categories' ) );
        add_action( 'elementor/widgets/widgets_registered', array( $this, 'register_widget' ) );
        add_filter( 'oembed_providers', [ $this, 'addOEmbedProviders' ] );
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
     * @param $widgets_manager
     * @throws \Exception
     * @since  2.4.2
     */
    public function register_widget( $widgets_manager ) {
        $widgets_manager->register_widget_type( new \EmbedPress\Elementor\Widgets\Embedpress_Elementor );
        $widgets_manager->register_widget_type( new \EmbedPress\Elementor\Widgets\Embedpress_Document );
    }

    /**
     * Enqueue elementor assets
     * @since  2.4.3
     */
    public function embedpress_enqueue_style() {
        wp_enqueue_style(
            'embedpress-elementor-css',
            EMBEDPRESS_URL_ASSETS . 'css/embedpress-elementor.css',
            false,
            EMBEDPRESS_VERSION
        );
    }
    
    public function editor_enqueue_scripts(){
        wp_enqueue_style(
            'embedpress-el-icon',
            EMBEDPRESS_URL_ASSETS . 'css/el-icon.css',
            false,
            EMBEDPRESS_VERSION
        );
    }

    public function addOEmbedProviders( $providers ) {
        if (Compatibility::isWordPress5() && ! Compatibility::isClassicalEditorActive()) {
            unset( $providers['#https?://(.+\.)?wistia\.com/medias/.+#i'], $providers['#https?://(.+\.)?fast\.wistia\.com/embed/medias/.+#i\.jsonp'] );
        }

        return $providers;
    }

}
