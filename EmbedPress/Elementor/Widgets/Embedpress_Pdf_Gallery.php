<?php

namespace EmbedPress\Elementor\Widgets;

use \Elementor\Controls_Manager;
use \Elementor\Widget_Base;

(defined('ABSPATH')) or die("No direct script access allowed.");

class Embedpress_Pdf_Gallery extends Widget_Base
{
    protected $pro_class = '';
    protected $pro_text = '';

    public function __construct($data = [], $args = null)
    {
        parent::__construct($data, $args);

        // Enqueue editor script for multi-select media library
        add_action('elementor/editor/after_enqueue_scripts', [$this, 'enqueue_editor_scripts']);
    }

    public function enqueue_editor_scripts()
    {
        $file_path = EMBEDPRESS_URL_ASSETS . 'js/pdf-gallery-elementor-editor.js';
        wp_enqueue_script(
            'embedpress-pdf-gallery-editor',
            $file_path,
            ['jquery', 'elementor-editor'],
            EMBEDPRESS_VERSION,
            true
        );
    }

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

        $this->add_control(
            'pdf_items_json',
            [
                'type' => Controls_Manager::HIDDEN,
                'default' => '[]',
            ]
        );

        $this->add_control(
            'pdf_selector_ui',
            [
                'type' => Controls_Manager::RAW_HTML,
                'raw' => '<div class="ep-pdf-gallery-selector">'
                    . '<div class="ep-pdf-gallery-repeater" style="margin-bottom:10px;max-height:400px;overflow-y:auto;"></div>'
                    . '<div class="ep-pdf-gallery-actions">'
                    . '<button class="elementor-button elementor-button-default ep-pdf-gallery-select-btn" type="button">'
                    . '<i class="eicon-plus-circle"></i> ' . __('Add PDF Files', 'embedpress')
                    . '</button>'
                    . '<button class="elementor-button ep-pdf-gallery-clear-btn" type="button" style="margin-left:5px;color:#d63638;">'
                    . __('Clear All', 'embedpress')
                    . '</button>'
                    . '</div>'
                    . '</div>'
                    . '<style>'
                    . '.ep-pdf-gallery-repeater-item{display:flex;align-items:flex-start;padding:10px;background:var(--e-a-bg-default,#fff);border:1px solid var(--e-a-border-color-bold,#dcdcde);border-radius:4px;margin-bottom:8px;gap:10px;position:relative;transition:border-color .2s;}'
                    . '.ep-pdf-gallery-repeater-item:hover{border-color:var(--e-a-color-primary-bold,#2271b1);}'
                    . '.ep-pdf-gallery-repeater-item__thumb{flex-shrink:0;width:60px;height:75px;border-radius:3px;overflow:hidden;background:var(--e-a-bg-hover,#f0f0f1);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;border:1px dashed var(--e-a-border-color,#c3c4c7);}'
                    . '.ep-pdf-gallery-repeater-item__thumb:hover{border-color:var(--e-a-color-primary-bold,#2271b1);}'
                    . '.ep-pdf-gallery-repeater-item__thumb img{width:100%;height:100%;object-fit:cover;}'
                    . '.ep-pdf-gallery-repeater-item__thumb canvas{width:100%;height:100%;object-fit:cover;}'
                    . '.ep-pdf-gallery-repeater-item__thumb-overlay{position:absolute;inset:0;background:rgba(0,0,0,.4);display:none;align-items:center;justify-content:center;color:#fff;font-size:16px;border-radius:3px;}'
                    . '.ep-pdf-gallery-repeater-item__thumb:hover .ep-pdf-gallery-repeater-item__thumb-overlay{display:flex;}'
                    . '.ep-pdf-gallery-repeater-item__thumb-placeholder{color:var(--e-a-color-txt-muted,#a7aaad);}'
                    . '.ep-pdf-gallery-repeater-item__content{flex:1;min-width:0;}'
                    . '.ep-pdf-gallery-repeater-item__name{font-size:12px;font-weight:500;color:var(--e-a-color-txt,#1e1e1e);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:6px;}'
                    . '.ep-pdf-gallery-repeater-item__thumb-label{font-size:10px;color:var(--e-a-color-txt-muted,#757575);margin-bottom:4px;}'
                    . '.ep-pdf-gallery-repeater-item__thumb-actions{display:flex;gap:4px;margin-bottom:6px;}'
                    . '.ep-pdf-gallery-repeater-item__thumb-btn{font-size:11px;padding:2px 8px;border:1px solid var(--e-a-border-color,#c3c4c7);border-radius:3px;background:var(--e-a-bg-default,#fff);cursor:pointer;color:var(--e-a-color-primary-bold,#2271b1);line-height:1.6;}'
                    . '.ep-pdf-gallery-repeater-item__thumb-btn:hover{background:var(--e-a-bg-hover,#f0f0f1);border-color:var(--e-a-color-primary-bold,#2271b1);}'
                    . '.ep-pdf-gallery-repeater-item__thumb-btn--remove{color:var(--e-a-color-danger,#d63638);}'
                    . '.ep-pdf-gallery-repeater-item__thumb-btn--remove:hover{color:var(--e-a-color-danger-bold,#a00);border-color:var(--e-a-color-danger,#d63638);}'
                    . '.ep-pdf-gallery-repeater-item__order-actions{display:flex;gap:3px;}'
                    . '.ep-pdf-gallery-repeater-item__order-btn{width:24px;height:24px;border:1px solid var(--e-a-border-color,#c3c4c7);border-radius:3px;background:var(--e-a-bg-default,#fff);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--e-a-color-txt-muted,#50575e);padding:0;}'
                    . '.ep-pdf-gallery-repeater-item__order-btn:hover{background:var(--e-a-bg-hover,#f0f0f1);border-color:var(--e-a-color-primary-bold,#2271b1);color:var(--e-a-color-primary-bold,#2271b1);}'
                    . '.ep-pdf-gallery-repeater-item__order-btn:disabled{opacity:.3;cursor:default;}'
                    . '.ep-pdf-gallery-repeater-item__remove-btn{position:absolute;top:6px;right:6px;width:20px;height:20px;border:none;background:none;cursor:pointer;color:var(--e-a-color-danger,#d63638);font-size:18px;line-height:1;padding:0;display:flex;align-items:center;justify-content:center;border-radius:50%;}'
                    . '.ep-pdf-gallery-repeater-item__remove-btn:hover{background:var(--e-a-bg-danger,rgba(214,54,56,.1));}'
                    . '.ep-pdf-gallery-empty{padding:20px;text-align:center;color:var(--e-a-color-txt-muted,#757575);font-size:12px;background:var(--e-a-bg-hover,#f6f7f7);border:1px dashed var(--e-a-border-color,#c3c4c7);border-radius:4px;}'
                    . '.ep-pdf-gallery-select-btn{width:auto!important;}'
                    . '.ep-pdf-gallery-actions{display:flex;align-items:center;}'
                    . '</style>',
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

    /**
     * Parse PDF items from JSON control
     */
    private function get_pdf_items($settings)
    {
        $raw = !empty($settings['pdf_items_json']) ? $settings['pdf_items_json'] : '[]';
        $items = json_decode($raw, true);
        return is_array($items) ? $items : [];
    }

    protected function render()
    {
        $settings = $this->get_settings_for_display();
        $pdf_items = $this->get_pdf_items($settings);

        if (empty($pdf_items)) {
            if (\Elementor\Plugin::$instance->editor->is_edit_mode()) {
                echo '<div style="padding:40px;text-align:center;background:#f5f5f5;border-radius:8px;color:#999;">';
                echo esc_html__('Click "Select PDF Files" to add PDFs to the gallery.', 'embedpress');
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
                    $pdf_url = !empty($item['url']) ? esc_url($item['url']) : '';
                    if (empty($pdf_url)) continue;
                    $pdf_name = !empty($item['fileName']) ? $item['fileName'] : basename(parse_url($pdf_url, PHP_URL_PATH));
                    $custom_thumb = !empty($item['customThumbnailUrl']) ? esc_url($item['customThumbnailUrl']) : '';
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
