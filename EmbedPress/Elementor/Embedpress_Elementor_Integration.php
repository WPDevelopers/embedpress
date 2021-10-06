<?php

namespace EmbedPress\Elementor;


(defined( 'ABSPATH' )) or die( "No direct script access allowed." );
use EmbedPress\Compatibility;
use EmbedPress\Elementor\Widgets\Embedpress_Document;
use EmbedPress\Elementor\Widgets\Embedpress_Elementor;
use EmbedPress\Elementor\Widgets\Embedpress_Pdf;

class Embedpress_Elementor_Integration {

    /**
     * @since  2.4.2
     */
    public function init() {
	    $elements = (array) get_option( EMBEDPRESS_PLG_NAME.":elements", []);
	    $e_blocks = isset( $elements['elementor']) ? (array) $elements['elementor'] : [];
	    if ( !empty($e_blocks['embedpress']) || !empty($e_blocks['embedpress-document']) || !empty($e_blocks['embedpress-pdf']) ) {
		    add_action( 'elementor/frontend/after_enqueue_styles', [ $this, 'embedpress_enqueue_style' ] );
		    add_action('elementor/editor/before_enqueue_styles', array($this, 'editor_enqueue_style'));
		    add_action('elementor/editor/before_enqueue_scripts', array($this, 'editor_enqueue_scripts'));
		    add_action( 'elementor/elements/categories_registered', array( $this, 'register_widget_categories' ) );
		    add_action( 'elementor/widgets/widgets_registered', array( $this, 'register_widget' ) );
		    add_filter( 'oembed_providers', [ $this, 'addOEmbedProviders' ] );
	    }
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
	    $elements = (array) get_option( EMBEDPRESS_PLG_NAME.":elements", []);
	    $e_blocks = isset( $elements['elementor']) ? (array) $elements['elementor'] : [];

	    if ( !empty($e_blocks['embedpress']) ) {
		    $widgets_manager->register_widget_type( new Embedpress_Elementor );
	    }
	    if ( !empty($e_blocks['embedpress-document']) ) {
		    $widgets_manager->register_widget_type( new Embedpress_Document );
	    }

	    if ( !empty($e_blocks['embedpress-pdf']) ) {
		    $widgets_manager->register_widget_type( new Embedpress_Pdf );
	    }
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

	public function editor_enqueue_style(){
		wp_enqueue_style(
			'embedpress-el-icon',
			EMBEDPRESS_URL_ASSETS . 'css/el-icon.css',
			false,
			EMBEDPRESS_VERSION
		);
	}
    
    public function editor_enqueue_scripts(){

    }

    public function addOEmbedProviders( $providers ) {
        if (Compatibility::isWordPress5() && ! Compatibility::isClassicalEditorActive()) {
            unset( $providers['#https?://(.+\.)?wistia\.com/medias/.+#i'], $providers['#https?://(.+\.)?fast\.wistia\.com/embed/medias/.+#i\.jsonp'] );
        }

        return $providers;
    }

}
