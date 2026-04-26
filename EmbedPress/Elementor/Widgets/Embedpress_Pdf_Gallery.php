<?php

namespace EmbedPress\Elementor\Widgets;

use \Elementor\Controls_Manager;
use \Elementor\Widget_Base;
use \Elementor\Core\Kits\Documents\Tabs\Global_Colors;
use \EmbedPress\Includes\Classes\Helper;

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

        wp_localize_script('embedpress-pdf-gallery-editor', 'epPdfGallery', [
            'ajaxUrl'      => admin_url('admin-ajax.php'),
            'nonce'        => wp_create_nonce('ep_pdf_gallery_nonce'),
            'assetsUrl'    => EMBEDPRESS_URL_ASSETS,
            'isProActive'  => defined('EMBEDPRESS_SL_ITEM_SLUG') ? true : false,
        ]);
    }

    /**
     * AJAX handler: generate a thumbnail for a PDF attachment.
     * Checks WordPress-generated preview first, then falls back to Imagick.
     */
    public static function ajax_generate_pdf_thumbnail()
    {
        \EmbedPress\Includes\Classes\Pdf_Thumbnail_Handler::ajax_generate_pdf_thumbnail();
    }

    public static function ajax_upload_pdf_thumbnail()
    {
        \EmbedPress\Includes\Classes\Pdf_Thumbnail_Handler::ajax_upload_pdf_thumbnail();
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
        return 'icon-pdf-gallery';
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
                'label' => esc_html__('PDF Files', 'embedpress'),
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
                    . '<button class="elementor-button ep-pdf-gallery-clear-btn" type="button" style="margin-left:5px;color:#fff;background:#d63638;border-color:#d63638;">'
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
                    . '.ep-pdf-gallery-repeater-item__spinner{width:24px;height:24px;border:3px solid var(--e-a-border-color,#c3c4c7);border-top-color:var(--e-a-color-primary-bold,#2271b1);border-radius:50%;animation:ep-spin .8s linear infinite;}'
                    . '@keyframes ep-spin{to{transform:rotate(360deg);}}'
                    . '.ep-pdf-gallery-repeater-item__thumb.is-generating{border-style:solid;}'
                    . '.ep-pdf-gallery-repeater-item__status{font-size:9px;color:var(--e-a-color-txt-muted,#999);font-style:italic;}'
                    . '</style>',
            ]
        );

        $this->end_controls_section();

        // ======== Layout ========
        $this->start_controls_section(
            'section_layout',
            [
                'label' => esc_html__('Layout', 'embedpress'),
            ]
        );

        $this->add_control(
            'layout',
            [
                'label' => esc_html__('Layout Type', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'grid',
                'options' => [
                    'grid' => esc_html__('Grid', 'embedpress'),
                    'masonry' => esc_html__('Masonry', 'embedpress'),
                    'carousel' => esc_html__('Carousel', 'embedpress') . ' ' . $this->pro_text,
                    'bookshelf' => esc_html__('Bookshelf', 'embedpress') . ' ' . $this->pro_text,
                ],
            ]
        );

        $this->add_control(
            'bookshelf_style',
            [
                'label' => esc_html__('Shelf Style', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'dark-wood',
                'options' => [
                    'dark-wood' => esc_html__('Dark Wood', 'embedpress'),
                    'light-wood' => esc_html__('Light Wood', 'embedpress'),
                    'glass' => esc_html__('Glass', 'embedpress'),
                ],
                'condition' => [
                    'layout' => 'bookshelf',
                ],
            ]
        );

        $this->add_responsive_control(
            'columns',
            [
                'label' => esc_html__('Columns', 'embedpress'),
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
                'selectors' => [
                    '{{WRAPPER}} .ep-pdf-gallery' => '--ep-gallery-columns: {{VALUE}};',
                ],
                'render_type' => 'template',
                'condition' => [
                    'layout!' => 'carousel',
                ],
            ]
        );

        $this->add_control(
            'gap',
            [
                'label' => esc_html__('Gap', 'embedpress'),
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
                'label' => esc_html__('Thumbnail Aspect Ratio', 'embedpress'),
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
                'label' => esc_html__('Border Radius', 'embedpress'),
                'type' => Controls_Manager::SLIDER,
                'default' => ['size' => 8],
                'range' => [
                    'px' => ['min' => 0, 'max' => 30],
                ],
            ]
        );

        $this->end_controls_section();

        // ======== Play Button ========
        $this->start_controls_section(
            'section_play_button',
            [
                'label' => esc_html__('Play Button', 'embedpress'),
            ]
        );

        $this->add_control(
            'show_play_button',
            [
                'label' => esc_html__('Show Play Button', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'play_button_icon',
            [
                'label' => esc_html__('Icon', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'play',
                'options' => [
                    'play' => esc_html__('Play', 'embedpress'),
                    'eye' => esc_html__('View / Eye', 'embedpress'),
                    'document' => esc_html__('Document', 'embedpress'),
                    'none' => esc_html__('None (Background Only)', 'embedpress'),
                ],
                'condition' => ['show_play_button' => 'yes'],
            ]
        );

        $this->add_control(
            'play_button_color',
            [
                'label' => esc_html__('Icon Color', 'embedpress'),
                'type' => Controls_Manager::COLOR,
                'default' => '#ffffff',
                'selectors' => [
                    '{{WRAPPER}} .ep-pdf-gallery__view-icon' => 'fill: {{VALUE}};',
                ],
                'condition' => [
                    'show_play_button' => 'yes',
                    'play_button_icon!' => 'none',
                ],
            ]
        );

        $this->add_control(
            'play_button_size',
            [
                'label' => esc_html__('Icon Size', 'embedpress'),
                'type' => Controls_Manager::SLIDER,
                'default' => ['size' => 44],
                'range' => [
                    'px' => ['min' => 24, 'max' => 80],
                ],
                'selectors' => [
                    '{{WRAPPER}} .ep-pdf-gallery__view-icon' => 'width: {{SIZE}}px; height: {{SIZE}}px;',
                ],
                'condition' => [
                    'show_play_button' => 'yes',
                    'play_button_icon!' => 'none',
                ],
            ]
        );

        $this->add_control(
            'play_button_bg',
            [
                'label' => esc_html__('Background Color', 'embedpress'),
                'type' => Controls_Manager::COLOR,
                'default' => 'rgba(0, 0, 0, 0.6)',
                'selectors' => [
                    '{{WRAPPER}} .ep-pdf-gallery__view-icon' => 'background-color: {{VALUE}};',
                ],
                'condition' => ['show_play_button' => 'yes'],
            ]
        );

        $this->add_control(
            'play_button_shape',
            [
                'label' => esc_html__('Background Shape', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'circle',
                'options' => [
                    'circle' => esc_html__('Circle', 'embedpress'),
                    'rounded-square' => esc_html__('Rounded Square', 'embedpress'),
                    'none' => esc_html__('None', 'embedpress'),
                ],
                'condition' => [
                    'show_play_button' => 'yes',
                ],
            ]
        );

        $this->add_control(
            'hover_overlay_color',
            [
                'label' => esc_html__('Hover Overlay Color', 'embedpress'),
                'type' => Controls_Manager::COLOR,
                'default' => 'rgba(0, 0, 0, 0.35)',
                'selectors' => [
                    '{{WRAPPER}} .ep-pdf-gallery__item:hover .ep-pdf-gallery__overlay' => 'background: {{VALUE}};',
                    '{{WRAPPER}} .ep-pdf-gallery__item--always-show .ep-pdf-gallery__overlay' => 'background: {{VALUE}};',
                ],
                'condition' => ['show_play_button' => 'yes'],
            ]
        );

        $this->add_control(
            'play_button_always_show',
            [
                'label' => esc_html__('Always Visible', 'embedpress'),
                'description' => esc_html__('Show button without hover', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => '',
                'condition' => ['show_play_button' => 'yes'],
            ]
        );

        $this->end_controls_section();

        // ======== Carousel ========
        $this->start_controls_section(
            'section_carousel',
            [
                'label' => esc_html__('Carousel', 'embedpress'),
                'condition' => ['layout' => 'carousel'],
            ]
        );

        $this->add_control(
            'slides_per_view',
            [
                'label' => esc_html__('Slides Per View', 'embedpress'),
                'type' => Controls_Manager::NUMBER,
                'default' => 3,
                'min' => 1,
                'max' => 6,
            ]
        );

        $this->add_control(
            'carousel_autoplay',
            [
                'label' => esc_html__('Autoplay', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => '',
            ]
        );

        $this->add_control(
            'carousel_speed',
            [
                'label' => esc_html__('Autoplay Speed (ms)', 'embedpress'),
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
                'label' => esc_html__('Loop', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'carousel_arrows',
            [
                'label' => esc_html__('Arrows', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'carousel_dots',
            [
                'label' => esc_html__('Dots', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => '',
            ]
        );

        $this->end_controls_section();

        // ======== PDF Viewer ========
        $this->start_controls_section(
            'section_viewer',
            [
                'label' => esc_html__('PDF Viewer (Popup)', 'embedpress'),
            ]
        );

        $this->add_control(
            'viewer_style',
            [
                'label' => esc_html__('Viewer Style', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'modern',
                'options' => [
                    'modern' => esc_html__('Modern', 'embedpress'),
                    'flip-book' => esc_html__('Flip Book', 'embedpress'),
                ],
            ]
        );

        $this->add_control(
            'theme_mode',
            [
                'label' => esc_html__('Theme', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'default',
                'options' => [
                    'default' => esc_html__('System Default', 'embedpress'),
                    'dark' => esc_html__('Dark', 'embedpress'),
                    'light' => esc_html__('Light', 'embedpress'),
                    'custom' => esc_html__('Custom', 'embedpress'),
                ],
            ]
        );

        $this->add_control(
            'custom_color',
            [
                'label' => esc_html__('Custom Color', 'embedpress'),
                'type' => Controls_Manager::COLOR,
                'default' => '#403A81',
                'condition' => ['theme_mode' => 'custom'],
            ]
        );

        $this->add_control(
            'pdf_toolbar',
            [
                'label' => sprintf(
                    /* translators: %s is the Pro badge markup. */
                    __('Toolbar %s', 'embedpress'),
                    $this->pro_text
                ),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'classes' => $this->pro_class,
            ]
        );

        $this->add_control(
            'toolbar_position',
            [
                'label' => esc_html__('Toolbar Position', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'default' => 'top',
                'options' => [
                    'top' => esc_html__('Top', 'embedpress'),
                    'bottom' => esc_html__('Bottom', 'embedpress'),
                ],
                'condition' => ['pdf_toolbar' => 'yes'],
            ]
        );

        $this->add_control(
            'presentation',
            [
                'label' => esc_html__('Presentation Mode', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'download',
            [
                'label' => sprintf(
                    /* translators: %s is the Pro badge markup. */
                    __('Print/Download %s', 'embedpress'),
                    $this->pro_text
                ),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'classes' => $this->pro_class,
            ]
        );

        $this->add_control(
            'copy_text',
            [
                'label' => sprintf(
                    /* translators: %s is the Pro badge markup. */
                    __('Copy Text %s', 'embedpress'),
                    $this->pro_text
                ),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
                'classes' => $this->pro_class,
            ]
        );

        $this->add_control(
            'draw',
            [
                'label' => sprintf(
                    /* translators: %s is the Pro badge markup. */
                    __('Draw %s', 'embedpress'),
                    $this->pro_text
                ),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
                'classes' => $this->pro_class,
            ]
        );

        $this->add_control(
            'add_text',
            [
                'label' => esc_html__('Add Text', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'add_image',
            [
                'label' => esc_html__('Add Image', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'doc_rotation',
            [
                'label' => esc_html__('Rotation', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'doc_details',
            [
                'label' => esc_html__('Properties', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'modern'],
            ]
        );

        $this->add_control(
            'zoom_in',
            [
                'label' => esc_html__('Zoom In', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'flip-book'],
            ]
        );

        $this->add_control(
            'zoom_out',
            [
                'label' => esc_html__('Zoom Out', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'flip-book'],
            ]
        );

        $this->add_control(
            'fit_view',
            [
                'label' => esc_html__('Fit View', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'flip-book'],
            ]
        );

        $this->add_control(
            'bookmark',
            [
                'label' => esc_html__('Bookmark', 'embedpress'),
                'type' => Controls_Manager::SWITCHER,
                'default' => 'yes',
                'condition' => ['viewer_style' => 'flip-book'],
            ]
        );

        $this->end_controls_section();

        // Watermark Controls Section
        $this->start_controls_section(
            'watermark_section',
            [
                'label' => esc_html__('Watermark', 'embedpress'),
            ]
        );

        $this->add_control(
            'watermark_text',
            [
                'label' => sprintf(
                    /* translators: %s is the Pro badge markup. */
                    __('Watermark Text %s', 'embedpress'),
                    $this->pro_text
                ),
                'type' => Controls_Manager::TEXT,
                'default' => '',
                'placeholder' => esc_html__('e.g. CONFIDENTIAL', 'embedpress'),
                'classes' => $this->pro_class,
            ]
        );

        $this->add_control(
            'watermark_style',
            [
                'label' => esc_html__('Watermark Style', 'embedpress'),
                'type' => Controls_Manager::SELECT,
                'options' => [
                    'center' => esc_html__('Center Diagonal', 'embedpress'),
                    'tiled' => esc_html__('Tiled / Repeated', 'embedpress'),
                ],
                'default' => 'center',
                'condition' => defined('EMBEDPRESS_SL_ITEM_SLUG') ? ['watermark_text!' => ''] : [],
                'classes' => $this->pro_class,
            ]
        );

        $this->add_control(
            'watermark_font_size',
            [
                'label' => esc_html__('Font Size (px)', 'embedpress'),
                'type' => Controls_Manager::NUMBER,
                'default' => 48,
                'min' => 10,
                'max' => 200,
                'condition' => defined('EMBEDPRESS_SL_ITEM_SLUG') ? ['watermark_text!' => ''] : [],
                'classes' => $this->pro_class,
            ]
        );

        $this->add_control(
            'watermark_color',
            [
                'label' => esc_html__('Color', 'embedpress'),
                'type' => Controls_Manager::COLOR,
                'default' => '#000000',
                'global' => [
                    'default' => Global_Colors::COLOR_PRIMARY,
                ],
                'condition' => defined('EMBEDPRESS_SL_ITEM_SLUG') ? ['watermark_text!' => ''] : [],
                'classes' => $this->pro_class,
            ]
        );

        $this->add_control(
            'watermark_opacity',
            [
                'label' => esc_html__('Opacity (%)', 'embedpress'),
                'type' => Controls_Manager::NUMBER,
                'default' => 15,
                'min' => 1,
                'max' => 100,
                'condition' => defined('EMBEDPRESS_SL_ITEM_SLUG') ? ['watermark_text!' => ''] : [],
                'classes' => $this->pro_class,
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
            'toolbar' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION') ? (!empty($settings['pdf_toolbar']) ? 'true' : 'false') : 'true',
            'position' => !empty($settings['toolbar_position']) ? $settings['toolbar_position'] : 'top',
            'flipbook_toolbar_position' => !empty($settings['toolbar_position']) ? $settings['toolbar_position'] : 'bottom',
            'presentation' => !empty($settings['presentation']) ? 'true' : 'false',
            'download' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION') ? (!empty($settings['download']) ? 'true' : 'false') : 'true',
            'copy_text' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION') ? (!empty($settings['copy_text']) ? 'true' : 'false') : 'true',
            'add_text' => !empty($settings['add_text']) ? 'true' : 'false',
            'draw' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION') ? (!empty($settings['draw']) ? 'true' : 'false') : 'true',
            'doc_rotation' => !empty($settings['doc_rotation']) ? 'true' : 'false',
            'doc_details' => !empty($settings['doc_details']) ? 'true' : 'false',
            'add_image' => !empty($settings['add_image']) ? 'true' : 'false',
            'zoom_in' => !empty($settings['zoom_in']) ? 'true' : 'false',
            'zoom_out' => !empty($settings['zoom_out']) ? 'true' : 'false',
            'fit_view' => !empty($settings['fit_view']) ? 'true' : 'false',
            'bookmark' => !empty($settings['bookmark']) ? 'true' : 'false',
            'watermark_text' => defined('EMBEDPRESS_SL_ITEM_SLUG') && !empty($settings['watermark_text']) ? $settings['watermark_text'] : '',
            'watermark_font_size' => defined('EMBEDPRESS_SL_ITEM_SLUG') && !empty($settings['watermark_font_size']) ? $settings['watermark_font_size'] : '48',
            'watermark_color' => defined('EMBEDPRESS_SL_ITEM_SLUG') && !empty($settings['watermark_color']) ? Helper::get_elementor_global_color($settings, 'watermark_color') : '#000000',
            'watermark_opacity' => defined('EMBEDPRESS_SL_ITEM_SLUG') && isset($settings['watermark_opacity']) ? $settings['watermark_opacity'] : '15',
            'watermark_style' => defined('EMBEDPRESS_SL_ITEM_SLUG') && !empty($settings['watermark_style']) ? $settings['watermark_style'] : 'center',
        ];

        if ($theme_mode === 'custom') {
            $params['customColor'] = !empty($settings['custom_color']) ? Helper::get_elementor_global_color($settings, 'custom_color') : '#403A81';
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

        // Pro gate: bookshelf requires Pro
        if (($layout === 'bookshelf' || $layout === 'carousel') && !defined('EMBEDPRESS_SL_ITEM_SLUG')) {
            $layout = 'grid';
        }

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
        if ($layout === 'carousel' || $layout === 'bookshelf') {
            $carousel_options = wp_json_encode([
                'autoplay' => !empty($settings['carousel_autoplay']),
                'autoplaySpeed' => !empty($settings['carousel_speed']) ? intval($settings['carousel_speed']) : 3000,
                'loop' => $settings['carousel_loop'] !== '',
                'arrows' => $settings['carousel_arrows'] !== '',
                'dots' => !empty($settings['carousel_dots']),
                'slidesPerView' => !empty($settings['slides_per_view']) ? intval($settings['slides_per_view']) : 3,
            ]);
        }

        // Play button settings
        $show_play_btn = !empty($settings['show_play_button']) && $settings['show_play_button'] === 'yes';
        $play_icon = !empty($settings['play_button_icon']) ? $settings['play_button_icon'] : 'play';
        $play_shape = !empty($settings['play_button_shape']) ? $settings['play_button_shape'] : 'circle';
        $always_show = !empty($settings['play_button_always_show']) && $settings['play_button_always_show'] === 'yes';

        // Icon SVG paths
        $icon_paths = [
            'play' => 'M8 5v14l11-7z',
            'eye' => 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
            'document' => 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z',
        ];
        $icon_path = isset($icon_paths[$play_icon]) ? $icon_paths[$play_icon] : $icon_paths['play'];

        // Icon inline style — only shape and always-show (colors/size handled by Elementor selectors)
        $icon_style_parts = [];
        if ($play_shape === 'circle') {
            $icon_style_parts[] = 'border-radius:50%';
        } elseif ($play_shape === 'rounded-square') {
            $icon_style_parts[] = 'border-radius:12px';
        } else {
            $icon_style_parts[] = 'border-radius:0';
        }
        if ($always_show) {
            $icon_style_parts[] = 'opacity:1';
            $icon_style_parts[] = 'transform:scale(1)';
        }
        $icon_style = implode(';', $icon_style_parts);

        $item_class = 'ep-pdf-gallery__item' . ($always_show ? ' ep-pdf-gallery__item--always-show' : '');

        $style = sprintf(
            '--ep-gallery-gap:%dpx;--ep-gallery-radius:%dpx;',
            $gap,
            $border_radius
        );
?>
        <div class="ep-pdf-gallery"
            data-layout="<?php echo esc_attr($layout); ?>"
            data-shelf-style="<?php echo esc_attr(!empty($settings['bookshelf_style']) ? $settings['bookshelf_style'] : 'dark-wood'); ?>"
            data-columns="<?php echo esc_attr($columns); ?>"
            data-columns-tablet="<?php echo esc_attr($columns_tablet); ?>"
            data-columns-mobile="<?php echo esc_attr($columns_mobile); ?>"
            data-gap="<?php echo esc_attr($gap); ?>"
            data-border-radius="<?php echo esc_attr($border_radius); ?>"
            data-viewer-style="<?php echo esc_attr($viewer_style); ?>"
            data-viewer-params="<?php echo esc_attr($viewer_params); ?>"
            data-gallery-id="<?php echo esc_attr($gallery_id); ?>"
            <?php if ($carousel_options): ?>data-carousel-options="<?php echo esc_attr($carousel_options); ?>" <?php endif; ?>
            style="<?php echo esc_attr($style); ?>">

            <?php if ($layout === 'carousel' || $layout === 'bookshelf'): ?>
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
                            $auto_thumb = !empty($item['autoThumbnailUrl']) ? esc_url($item['autoThumbnailUrl']) : '';
                            $thumb_url = $custom_thumb ?: $auto_thumb;
                        ?>
                            <div class="<?php echo esc_attr($item_class); ?>"
                                data-pdf-url="<?php echo esc_url($pdf_url); ?>"
                                data-pdf-index="<?php echo esc_attr(intval($index)); ?>"
                                data-pdf-name="<?php echo esc_attr($pdf_name); ?>">
                                <div class="ep-pdf-gallery__thumbnail-wrap" data-ratio="<?php echo esc_attr($aspect_ratio); ?>">
                                    <?php if ($thumb_url): ?>
                                        <img src="<?php echo esc_url($thumb_url); ?>" alt="<?php echo esc_attr($pdf_name); ?>" />
                                    <?php else: ?>
                                        <canvas class="ep-pdf-gallery__canvas" data-pdf-src="<?php echo esc_url($pdf_url); ?>" data-loading="true"></canvas>
                                    <?php endif; ?>
                                    <?php if ($show_play_btn): ?>
                                        <div class="ep-pdf-gallery__overlay">
                                            <?php if ($play_icon !== 'none'): ?>
                                                <svg class="ep-pdf-gallery__view-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="<?php echo esc_attr($icon_style); ?>">
                                                    <path d="<?php echo esc_attr($icon_path); ?>" />
                                                </svg>
                                            <?php endif; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                                <div class="ep-pdf-gallery__book-title"><?php echo esc_html($pdf_name); ?></div>
                            </div>
                        <?php endforeach; ?>

                        <?php if ($layout === 'carousel' || $layout === 'bookshelf'): ?>
                        </div>
                        <button class="ep-pdf-gallery__carousel-prev" aria-label="Previous">
                            <svg viewBox="0 0 24 24">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                            </svg>
                        </button>
                        <button class="ep-pdf-gallery__carousel-next" aria-label="Next">
                            <svg viewBox="0 0 24 24">
                                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                            </svg>
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
