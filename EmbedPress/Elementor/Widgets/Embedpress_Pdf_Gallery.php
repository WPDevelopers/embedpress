<?php

namespace EmbedPress\Elementor\Widgets;

use \Elementor\Controls_Manager;
use \Elementor\Repeater;
use \Elementor\Widget_Base;
use EmbedPress\Includes\Classes\Helper;

(defined('ABSPATH')) or die("No direct script access allowed.");

class Embedpress_Pdf_Gallery extends Widget_Base
{
    protected $pro_class = '';
    protected $pro_text = '';

    public function get_name()
    {
        return 'embedpress_pdf_gallery';
    }

    public function get_title()
    {
        return esc_html__('EmbedPress PDF Gallery', 'embedpress');
    }

    public function get_categories()
    {
        return ['embedpress'];
    }

    public function get_icon()
    {
        return 'eicon-gallery-grid';
    }

    public function get_style_depends()
    {
        return [
            'embedpress-pdf-gallery-css',
            'embedpress-css',
        ];
    }

    public function get_script_depends()
    {
        return [
            'embedpress-pdf-gallery',
        ];
    }

    public function get_keywords()
    {
        return ['embedpress', 'pdf', 'gallery', 'pdf gallery', 'document gallery'];
    }

    protected function register_controls()
    {
        $this->pro_class = apply_filters('embedpress/pro_class', 'embedpress-pro-control not-active');
        $this->pro_text = apply_filters('embedpress/pro_text', '<sup class="embedpress-pro-label" style="color:red">' . __('Pro', 'embedpress') . '</sup>');

        // ======== Content: PDF Files ========
        $this->start_controls_section(
            'section_pdf_files',
            [
                'label' => __('PDF Files', 'embedpress'),
            ]
        );

        $repeater = new Repeater();

        $repeater->add_control(
            'pdf_file',
            [
                'label' => __('PDF File', 'embedpress'),
                'type' => Controls_Manager::MEDIA,
                'media_types' => ['application/pdf'],
                'description' => __('Upload or select a PDF file.', 'embedpress'),
            ]
        );

        $repeater->add_control(
            'custom_thumbnail',
            [
                'label' => __('Custom Thumbnail (Optional)', 'embedpress'),
                'type' => Controls_Manager::MEDIA,
                'media_types' => ['image'],
                'description' => __('Override the auto-generated thumbnail with a custom image.', 'embedpress'),
            ]
        );

        $this->add_control(
            'pdf_items',
            [
                'label' => __('PDF Documents', 'embedpress'),
                'type' => Controls_Manager::REPEATER,
                'fields' => $repeater->get_controls(),
                'title_field' => '{{{ pdf_file.url ? pdf_file.url.split("/").pop() : "PDF" }}}',
                'default' => [],
            ]
        );

        $this->end_controls_section();

        // ======== Layout ========
        $this->start_controls_section(
            'section_layout',
            [
                'label' => __('Layout', 'embedpress'),
            ]
        );

        $this->add_control(
            'layout',
            [
                'label' => __('Layout Type', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'grid',
                'options' => [
                    'grid' => __('Grid', 'embedpress'),
                    'masonry' => __('Masonry', 'embedpress'),
                    'carousel' => __('Carousel', 'embedpress'),
                ],
            ]
        );

        $this->add_responsive_control(
            'columns',
            [
                'label' => __('Columns', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => '3',
                'tablet_default' => '2',
                'mobile_default' => '1',
                'options' => [
                    '1' => '1',
                    '2' => '2',
                    '3' => '3',
                    '4' => '4',
                    '5' => '5',
                    '6' => '6',
                ],
                'condition' => [
                    'layout!' => 'carousel',
                ],
            ]
        );

        $this->add_control(
            'gap',
            [
                'label' => __('Gap', 'embedpress'),
                'type' => Controls_Manager::SLIDER,
                'default' => ['size' => 20],
                'range' => [
                    'px' => ['min' => 0, 'max' => 60],
                ],
            ]
        );

        $this->add_control(
            'aspect_ratio',
            [
                'label' => __('Thumbnail Aspect Ratio', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => '4:3',
                'options' => [
                    '4:3' => '4:3',
                    '1:1' => '1:1',
                    '3:4' => '3:4',
                    '16:9' => '16:9',
                ],
            ]
        );

        $this->add_control(
            'border_radius',
            [
                'label' => __('Border Radius', 'embedpress'),
                'type' => Controls_Manager::SLIDER,
                'default' => ['size' => 8],
                'range' => [
                    'px' => ['min' => 0, 'max' => 30],
                ],
            ]
        );

        $this->end_controls_section();

        // ======== Carousel ========
        $this->start_controls_section(
            'section_carousel',
            [
                'label' => __('Carousel', 'embedpress'),
                'condition' => ['layout' => 'carousel'],
            ]
        );

        $this->add_control(
            'slides_per_view',
            [
                'label' => __('Slides Per View', 'embedpress'),
                'type' => Controls_Manager::NUMBER,
                'default' => 3,
                'min' => 1,
                'max' => 6,
            ]
        );

        $this->add_control(
            'carousel_autoplay',
            [
                'label' => __('Autoplay', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => '',
            ]
        );

        $this->add_control(
            'carousel_speed',
            [
                'label' => __('Autoplay Speed (ms)', 'embedpress'),
                'type' => Controls_Manager::NUMBER,
                'default' => 3000,
                'min' => 1000,
                'max' => 10000,
                'step' => 500,
                'condition' => ['carousel_autoplay' => 'yes'],
            ]
        );

        $this->add_control(
            'carousel_loop',
            [
                'label' => __('Loop', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'carousel_arrows',
            [
                'label' => __('Arrows', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'carousel_dots',
            [
                'label' => __('Dots', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => '',
            ]
        );

        $this->end_controls_section();

        // ======== PDF Viewer ========
        $this->start_controls_section(
            'section_viewer',
            [
                'label' => __('PDF Viewer (Popup)', 'embedpress'),
            ]
        );

        $this->add_control(
            'viewer_style',
            [
                'label' => __('Viewer Style', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'modern',
                'options' => [
                    'modern' => __('Modern', 'embedpress'),
                    'flip-book' => __('Flip Book', 'embedpress'),
                ],
            ]
        );

        $this->add_control(
            'theme_mode',
            [
                'label' => __('Theme', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'default',
                'options' => [
                    'default' => __('System Default', 'embedpress'),
                    'dark' => __('Dark', 'embedpress'),
                    'light' => __('Light', 'embedpress'),
                    'custom' => __('Custom', 'embedpress'),
                ],
            ]
        );

        $this->add_control(
            'custom_color',
            [
                'label' => __('Custom Color', 'embedpress'),
                'type' => Controls_Manager::COLOR,
                'default' => '#403A81',
                'condition' => ['theme_mode' => 'custom'],
            ]
        );

        $this->add_control(
            'pdf_toolbar',
            [
                'label' => __('Toolbar', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'toolbar_position',
            [
                'label' => __('Toolbar Position', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'top',
                'options' => [
                    'top' => __('Top', 'embedpress'),
                    'bottom' => __('Bottom', 'embedpress'),
                ],
                'condition' => ['pdf_toolbar' => 'yes'],
            ]
        );

        $this->add_control(
            'presentation',
            [
                'label' => __('Presentation Mode', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'download',
            [
                'label' => __('Print/Download', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'copy_text',
            [
                'label' => __('Copy Text', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'draw',
            [
                'label' => __('Draw', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'add_text',
            [
                'label' => __('Add Text', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'add_image',
            [
                'label' => __('Add Image', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'doc_rotation',
            [
                'label' => __('Rotation', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'doc_details',
            [
                'label' => __('Properties', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'zoom_in',
            [
                'label' => __('Zoom In', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'flip-book'],
            ]
        );

        $this->add_control(
            'zoom_out',
            [
                'label' => __('Zoom Out', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'flip-book'],
            ]
        );

        $this->add_control(
            'fit_view',
            [
                'label' => __('Fit View', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'flip-book'],
            ]
        );

        $this->add_control(
            'bookmark',
            [
                'label' => __('Bookmark', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'flip-book'],
            ]
        );

        $this->end_controls_section();
    }

    /**
     * Generate base64 viewer params
     */
    private function getParamData($settings)
    {
        $theme_mode = !empty($settings['theme_mode']) ? $settings['theme_mode'] : 'default';

        $params = [
            'themeMode' => $theme_mode,
            'toolbar' => !empty($settings['pdf_toolbar']) ? 'true' : 'false',
            'position' => !empty($settings['toolbar_position']) ? $settings['toolbar_position'] : 'top',
            'flipbook_toolbar_position' => !empty($settings['toolbar_position']) ? $settings['toolbar_position'] : 'bottom',
            'presentation' => !empty($settings['presentation']) ? 'true' : 'false',
            'download' => !empty($settings['download']) ? 'true' : 'false',
            'copy_text' => !empty($settings['copy_text']) ? 'true' : 'false',
            'add_text' => !empty($settings['add_text']) ? 'true' : 'false',
            'draw' => !empty($settings['draw']) ? 'true' : 'false',
            'doc_rotation' => !empty($settings['doc_rotation']) ? 'true' : 'false',
            'doc_details' => !empty($settings['doc_details']) ? 'true' : 'false',
            'add_image' => !empty($settings['add_image']) ? 'true' : 'false',
            'zoom_in' => !empty($settings['zoom_in']) ? 'true' : 'false',
            'zoom_out' => !empty($settings['zoom_out']) ? 'true' : 'false',
            'fit_view' => !empty($settings['fit_view']) ? 'true' : 'false',
            'bookmark' => !empty($settings['bookmark']) ? 'true' : 'false',
        ];

        if ($theme_mode === 'custom') {
            $params['customColor'] = !empty($settings['custom_color']) ? $settings['custom_color'] : '#403A81';
        }

        $query_string = http_build_query($params);
        if (function_exists('mb_convert_encoding')) {
            $query_string = mb_convert_encoding($query_string, 'UTF-8');
        }

        return base64_encode($query_string);
    }

    protected function render()
    {
        $settings = $this->get_settings_for_display();
        $pdf_items = !empty($settings['pdf_items']) ? $settings['pdf_items'] : [];

        if (empty($pdf_items)) {
            if (\Elementor\Plugin::$instance->editor->is_edit_mode()) {
                echo '<div style="padding:40px;text-align:center;background:#f5f5f5;border-radius:8px;color:#999;">';
                echo esc_html__('Add PDF files to create a gallery.', 'embedpress');
                echo '</div>';
            }
            return;
        }

        $layout = !empty($settings['layout']) ? esc_attr($settings['layout']) : 'grid';
        $columns = !empty($settings['columns']) ? intval($settings['columns']) : 3;
        $columns_tablet = !empty($settings['columns_tablet']) ? intval($settings['columns_tablet']) : 2;
        $columns_mobile = !empty($settings['columns_mobile']) ? intval($settings['columns_mobile']) : 1;
        $gap = isset($settings['gap']['size']) ? intval($settings['gap']['size']) : 20;
        $border_radius = isset($settings['border_radius']['size']) ? intval($settings['border_radius']['size']) : 8;
        $aspect_ratio = !empty($settings['aspect_ratio']) ? esc_attr($settings['aspect_ratio']) : '4:3';
        $viewer_style = !empty($settings['viewer_style']) ? esc_attr($settings['viewer_style']) : 'modern';

        $viewer_params = $this->getParamData($settings);
        $gallery_id = 'ep-gallery-' . $this->get_id();

        $carousel_options = '';
        if ($layout === 'carousel') {
            $carousel_options = wp_json_encode([
                'autoplay' => !empty($settings['carousel_autoplay']),
                'autoplaySpeed' => !empty($settings['carousel_speed']) ? intval($settings['carousel_speed']) : 3000,
                'loop' => $settings['carousel_loop'] !== '',
                'arrows' => $settings['carousel_arrows'] !== '',
                'dots' => !empty($settings['carousel_dots']),
                'slidesPerView' => !empty($settings['slides_per_view']) ? intval($settings['slides_per_view']) : 3,
            ]);
        }

        $style = sprintf(
            '--ep-gallery-columns:%d;--ep-gallery-columns-tablet:%d;--ep-gallery-columns-mobile:%d;--ep-gallery-gap:%dpx;--ep-gallery-radius:%dpx;',
            $columns, $columns_tablet, $columns_mobile, $gap, $border_radius
        );
        ?>
        <div class="ep-pdf-gallery"
             data-layout="<?php echo $layout; ?>"
             data-columns="<?php echo $columns; ?>"
             data-columns-tablet="<?php echo $columns_tablet; ?>"
             data-columns-mobile="<?php echo $columns_mobile; ?>"
             data-gap="<?php echo $gap; ?>"
             data-border-radius="<?php echo $border_radius; ?>"
             data-viewer-style="<?php echo $viewer_style; ?>"
             data-viewer-params="<?php echo esc_attr($viewer_params); ?>"
             data-gallery-id="<?php echo esc_attr($gallery_id); ?>"
             <?php if ($carousel_options): ?>data-carousel-options="<?php echo esc_attr($carousel_options); ?>"<?php endif; ?>
             style="<?php echo esc_attr($style); ?>">

            <?php if ($layout === 'carousel'): ?>
            <div class="ep-pdf-gallery__carousel">
                <div class="ep-pdf-gallery__carousel-track">
            <?php else: ?>
            <div class="ep-pdf-gallery__grid">
            <?php endif; ?>

                <?php foreach ($pdf_items as $index => $item):
                    $pdf_url = !empty($item['pdf_file']['url']) ? esc_url($item['pdf_file']['url']) : '';
                    if (empty($pdf_url)) continue;
                    $pdf_name = basename(parse_url($pdf_url, PHP_URL_PATH));
                    $custom_thumb = !empty($item['custom_thumbnail']['url']) ? esc_url($item['custom_thumbnail']['url']) : '';
                ?>
                <div class="ep-pdf-gallery__item"
                     data-pdf-url="<?php echo $pdf_url; ?>"
                     data-pdf-index="<?php echo intval($index); ?>"
                     data-pdf-name="<?php echo esc_attr($pdf_name); ?>">
                    <div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="<?php echo $aspect_ratio; ?>">
                        <?php if ($custom_thumb): ?>
                            <img src="<?php echo $custom_thumb; ?>" alt="<?php echo esc_attr($pdf_name); ?>" />
                        <?php else: ?>
                            <canvas class="ep-pdf-gallery__canvas" data-pdf-src="<?php echo $pdf_url; ?>" data-loading="true"></canvas>
                        <?php endif; ?>
                        <div class="ep-pdf-gallery__overlay">
                            <svg class="ep-pdf-gallery__view-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>

            <?php if ($layout === 'carousel'): ?>
                </div>
                <button class="ep-pdf-gallery__carousel-prev" aria-label="Previous">
                    <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>
                <button class="ep-pdf-gallery__carousel-next" aria-label="Next">
                    <svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
                </button>
                <div class="ep-pdf-gallery__carousel-dots"></div>
            </div>
            <?php else: ?>
            </div>
            <?php endif; ?>
        </div>
        <?php
    }
}
