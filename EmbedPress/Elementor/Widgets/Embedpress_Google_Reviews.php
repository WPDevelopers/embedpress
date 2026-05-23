<?php

namespace EmbedPress\Elementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Widget_Base;
use EmbedPress\Includes\Classes\GoogleReviewsRenderer;
use EmbedPress\Elementor\Controls\Place_Picker as GR_Place_Picker;

(defined('ABSPATH')) or die("No direct script access allowed.");

/**
 * Elementor widget for embedding Google Business reviews.
 *
 * v1: Place ID input + a clear pointer to the Settings → Google Reviews picker
 * for search UX. Elementor's controls API doesn't natively support a remote
 * autocomplete; rather than ship a fragile custom control in v1 we route users
 * to the existing searchable picker and copy the place_id back here.
 *
 * Output uses the shared GoogleReviewsRenderer so widget + block + shortcode
 * all emit identical markup.
 */
class Embedpress_Google_Reviews extends Widget_Base
{
    public function get_name()
    {
        return 'embedpress-google-reviews';
    }

    public function get_title()
    {
        return esc_html__('EmbedPress Google Reviews', 'embedpress');
    }

    public function get_categories()
    {
        return ['embedpress'];
    }

    public function get_icon()
    {
        return 'eicon-favorite';
    }

    public function get_keywords()
    {
        return ['embedpress', 'google', 'reviews', 'places', 'business', 'rating'];
    }

    protected function register_controls()
    {
        /* ----- Place ----- */
        $this->start_controls_section('ep_gr_section_place', [
            'label' => esc_html__('Place', 'embedpress'),
        ]);

        $this->add_control('ep_gr_place', [
            'label'       => __('Search for a place', 'embedpress'),
            'type'        => GR_Place_Picker::CONTROL_TYPE,
            'label_block' => true,
            'default'     => ['place_id' => '', 'place_name' => ''],
        ]);

        $this->end_controls_section();

        /* ----- Display ----- */
        $this->start_controls_section('ep_gr_display', [
            'label' => esc_html__('Display', 'embedpress'),
        ]);

        $this->add_control('ep_gr_layout', [
            'label'   => __('Layout', 'embedpress'),
            'type'    => Controls_Manager::SELECT,
            'default' => 'list',
            'options' => [
                'list'     => __('List', 'embedpress'),
                'grid'     => __('Grid', 'embedpress'),
                'carousel' => __('Carousel', 'embedpress'),
            ],
        ]);

        $this->add_control('ep_gr_limit', [
            'label'   => __('Reviews to show', 'embedpress'),
            'type'    => Controls_Manager::NUMBER,
            'default' => 3,
            'min'     => 1,
            'max'     => 5,
        ]);

        $this->add_control('ep_gr_min_rating', [
            'label'   => __('Minimum rating', 'embedpress'),
            'type'    => Controls_Manager::SELECT,
            'default' => '0',
            'options' => [
                '0' => __('Any', 'embedpress'),
                '3' => '3+',
                '4' => '4+',
                '5' => '5',
            ],
        ]);

        $this->end_controls_section();

        /* ----- Per-review elements ----- */
        $this->start_controls_section('ep_gr_elements', [
            'label' => esc_html__('Per-review elements', 'embedpress'),
        ]);

        foreach ([
            'ep_gr_show_photo' => __('Reviewer photo', 'embedpress'),
            'ep_gr_show_stars' => __('Star rating', 'embedpress'),
            'ep_gr_show_date'  => __('Date', 'embedpress'),
            'ep_gr_show_link'  => __('"View on Google" link', 'embedpress'),
        ] as $key => $label) {
            $this->add_control($key, [
                'label'        => $label,
                'type'         => Controls_Manager::SWITCHER,
                'default'      => 'yes',
                'label_on'     => __('On', 'embedpress'),
                'label_off'    => __('Off', 'embedpress'),
                'return_value' => 'yes',
            ]);
        }

        $this->end_controls_section();
    }

    protected function render()
    {
        $s = $this->get_settings_for_display();

        GoogleReviewsRenderer::enqueue_assets();

        $place = isset($s['ep_gr_place']) && is_array($s['ep_gr_place']) ? $s['ep_gr_place'] : [];
        echo GoogleReviewsRenderer::render([
            'place_id'   => isset($place['place_id']) ? sanitize_text_field($place['place_id']) : '',
            'place_name' => isset($place['place_name']) ? sanitize_text_field($place['place_name']) : '',
            'limit'      => isset($s['ep_gr_limit']) ? (int) $s['ep_gr_limit'] : 5,
            'min_rating' => isset($s['ep_gr_min_rating']) ? (int) $s['ep_gr_min_rating'] : 0,
            'layout'     => isset($s['ep_gr_layout']) ? sanitize_key($s['ep_gr_layout']) : 'list',
            'show_photo' => ($s['ep_gr_show_photo'] ?? 'yes') === 'yes',
            'show_stars' => ($s['ep_gr_show_stars'] ?? 'yes') === 'yes',
            'show_date'  => ($s['ep_gr_show_date'] ?? 'yes') === 'yes',
            'show_link'  => ($s['ep_gr_show_link'] ?? 'yes') === 'yes',
        ]);
    }
}
