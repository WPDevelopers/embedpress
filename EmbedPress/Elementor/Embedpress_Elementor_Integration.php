<?php

namespace EmbedPress\Elementor;




(defined('ABSPATH')) or die("No direct script access allowed.");

class Embedpress_Elementor_Integration {

    /**
     * @since  2.4.2
     */
    public function init(){
        add_action('elementor/elements/categories_registered', array($this, 'register_widget_categories'));
        add_action('elementor/widgets/widgets_registered', array($this, 'register_widget'));
    }

    /**
     * Add elementor category
     *
     * @since v1.0.0
     */
    public function register_widget_categories($elements_manager)
    {
        $elements_manager->add_category(
            'embedpress',
            [
                'title' => __('EmbedPress', 'embedpress'),
                'icon' => 'font',
            ], 1);
    }

    /**
     * @since  2.4.2
     */
    public function register_widget( $widgets_manager ){
        $widgets_manager->register_widget_type(new \EmbedPress\Elementor\Widgets\Embedpress_Elementor);
    }

}
