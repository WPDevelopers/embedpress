<?php

namespace EmbedPress\Elementor;




(defined('ABSPATH')) or die("No direct script access allowed.");

class Embedpress_Elementor_Integration {

    /**
     * @since  2.4.2
     */
    public function init(){
        add_action('elementor/widgets/widgets_registered', array($this, 'register_widget'));
    }

    /**
     * @since  2.4.2
     */
    public function register_widget( $widgets_manager ){

    }

}
