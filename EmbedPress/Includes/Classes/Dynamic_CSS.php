<?php

namespace EmbedPress\Includes\Classes;

if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly

use EmbedPress\Includes\Classes\Feature_Enhancer;

class Dynamic_CSS
{
    function __construct()
    {
        add_action('wp_footer', [$this, 'attributes_data']);
    }

    public static function ep_dynamic_css()
    {
        // print_r(Feature_Enhancer::$attributes_data);
    }

    public static function attributes_data($attributes)
    {
        $is_pagination = 'block';

        if (!$attributes['ispagination']) {
            $is_pagination = 'none';
        }

        if (!is_admin()) :

            ?>

            <style>
                .ep-youtube__content__block .youtube__content__body .content__wrap {
                    gap: <?php echo esc_html($attributes['gapbetweenvideos']); ?>px !important;
                    margin-top: <?php echo esc_html($attributes['gapbetweenvideos']); ?>px !important;
                }

                .ep-youtube__content__block .ep-youtube__content__pagination {
                    display: <?php echo esc_html($is_pagination); ?>;
                }
            </style>
<?php
        endif;
    }
}
