<?php

namespace EmbedPress\Elementor\Widgets;

use Elementor\Core\Kits\Documents\Tabs\Global_Colors;
use Elementor\Core\Kits\Manager;
use Elementor\Plugin;


use \Elementor\Controls_Manager as Controls_Manager;
use \Elementor\Modules\DynamicTags\Module as TagsModule;
use \Elementor\Widget_Base as Widget_Base;
use EmbedPress\Includes\Classes\Helper;
use EmbedPress\Includes\Traits\Branding;



(defined('ABSPATH')) or die("No direct script access allowed.");

class Embedpress_Pdf extends Widget_Base
{

    use Branding;
    protected $pro_class = '';
    protected $pro_text = '';
    public function get_name()
    {
        return 'embedpress_pdf';
    }

    public function get_title()
    {
        return esc_html__('EmbedPress PDF', 'embedpress');
    }

    public function get_categories()
    {
        return ['embedpress'];
    }

    public function get_custom_help_url()
    {
        return 'https://embedpress.com/documentation';
    }

    public function get_icon()
    {
        return 'icon-pdf';
    }

    public function get_style_depends()
    {
        return [
            'embedpress-elementor-css',
            'embedpress-style',
        ];
    }

    public function get_script_depends()
    {

        $handler_keys = get_option('enabled_elementor_scripts', []);
		
		$handles = [];
	
		$handles[] = 'embedpress-pdfobject';
		$handles[] = 'embedpress-front';
		
		if (isset($handler_keys['enabled_ads']) && $handler_keys['enabled_ads'] === 'yes') {
			$handles[] = 'embedpress-ads';
		}

		return $handles;
    }

    /**
     * Get widget keywords.
     *
     * Retrieve the list of keywords the widget belongs to.
     *
     * @return array Widget keywords.
     * @since 2.5.5
     * @access public
     *
     */
    public function get_keywords()
    {
        return ['embedpress', 'pdf', 'doc', 'embedpress-document'];
    }

    protected function register_controls()
    {
        $class = 'embedpress-pro-control not-active';
        $text =  '<sup class="embedpress-pro-label" style="color:red">' . __('Pro', 'embedpress') . '</sup>';
        $this->pro_class = apply_filters('embedpress/pro_class', $class);
        $this->pro_text = apply_filters('embedpress/pro_text', $text);
        
        /**
         * EmbedPress Content Settings
         */
        $this->start_controls_section(
            'embedpress_content_settings',
            [
                'label' => esc_html__('General', 'embedpress'),
            ]
        );

        $this->add_control(
            'embedpress_pdf_type',
            [
                'label'   => __('Document Type', 'embedpress'),
                'type'    => Controls_Manager::SELECT,
                'default' => 'file',
                'options' => [
                    'file' => __('File', 'embedpress'),
                    'url'  => __('URL', 'embedpress')
                ],
            ]
        );

        $this->add_control(
            'embedpress_pdf_file_link_from',
            [
                'label'   => __( 'URL From', 'embedpress' ),
                'type'    => Controls_Manager::SELECT,
                'default' => 'external',
                'options' => [
                    'self' => __( 'Self', 'embedpress' ),
                    'external'  => __( 'External', 'embedpress' )
                ],
                'condition' => [
                    'embedpress_pdf_type' => 'url'
                ]
            ]
        );

        $this->add_control(
            'embedpress_pdf_Uploader',
            [
                'label'       => __('Upload File', 'embedpress'),
                'type'        => Controls_Manager::MEDIA,
                'dynamic'     => [
                    'active'     => true,
                    'categories' => [
                        TagsModule::MEDIA_CATEGORY,
                    ],
                ],
                'media_type'  => [
                    'application/pdf',
                ],
                'description' => __(
                    'Upload a file or pick one from your media library for embed. Supported File Type: PDF',
                    'embedpress'
                ),
                'condition'   => [
                    'embedpress_pdf_type' => 'file'
                ],
            ]
        );

        $this->add_control(
            'embedpress_pdf_file_link',
            [
                'label'         => __('URL', 'embedpress'),
                'type'          => Controls_Manager::URL,
                'placeholder'   => __('https://your-link.com/file.pdf', 'embedpress'),
                'dynamic'     => [
					'active' => true,
				],
                'show_external' => false,
                'dynamic'     => [
					'active' => true,
				],
                'default'       => [
                    'url' => ''
                ],
                'condition'     => [
                    'embedpress_pdf_type' => 'url'
                ],
            ]
        );


        $this->add_control(
            'embedpress_pdf_viewer_style',
            [
                'label'   => __('Viewer Style', 'embedpress'),
                'type'    => Controls_Manager::SELECT,
                'default' => 'modern',
                'options' => [
                    'modern'        => __('Modern', 'embedpress'),
                    'flip-book' => __('Flip Book', 'embedpress'),
                ],
                'conditions' => [
                    'relation' => 'or',
                    'terms' => [
                        ['name' => 'embedpress_pdf_type', 'operator' => '===', 'value' => 'file'],
                        ['name' => 'embedpress_pdf_file_link_from', 'operator' => '===', 'value' => 'self'],
                    ],
                ],
            ]
        );

        $this->add_control(
            'embedpress_pdf_zoom',
            [
                'label'   => __('Zoom', 'embedpress'),
                'type'    => Controls_Manager::SELECT,
                'default' => 'auto',
                'options' => [
                    'auto'        => __('Automatic Zoom', 'embedpress'),
                    'page-actual' => __('Actual Size', 'embedpress'),
                    'page-fit'    => __('Page Fit', 'embedpress'),
                    'page-width'  => __('Page Width', 'embedpress'),
                    'custom'      => __('Custom', 'embedpress'),
                    '50'          => __('50%', 'embedpress'),
                    '75'          => __('75%', 'embedpress'),
                    '100'         => __('100%', 'embedpress'),
                    '125'         => __('125%', 'embedpress'),
                    '150'         => __('150%', 'embedpress'),
                    '200'         => __('200%', 'embedpress'),
                    '300'         => __('300%', 'embedpress'),
                    '400'         => __('400%', 'embedpress'),
                ],
                'condition' => [
                    'embedpress_pdf_viewer_style' => 'modern'
                ]
            ]
        );
        $this->add_control(
            'embedpress_pdf_zoom_custom',
            [
                'label'         => __('Custom Zoom', 'embedpress'),
                'type'          => Controls_Manager::NUMBER,
                'condition'     => [
                    'embedpress_pdf_zoom' => 'custom'
                ],
            ]
        );
        $this->add_responsive_control(
			'embedpress_elementor_document_width',
			[
				'type' => \Elementor\Controls_Manager::SLIDER,
				'label' => esc_html__( 'Width', 'embedpress' ),
                'size_units' => [ 'px', '%' ],
				'range' => [
					'px' => [
						'min' => 1,
						'max' => 1500,
					],
				],
				'devices' => [ 'desktop', 'tablet', 'mobile' ],
                'default' => [
					'unit' => '%',
                    'size' => !empty($value = intval(Helper::get_options_value('enableEmbedResizeWidth'))) ? $value : 600,
				],
				'desktop_default' => [
					'unit' => 'px',
                    'size' => 600,
				],
				'tablet_default' => [
					'size' => 400,
					'unit' => 'px',
				],
				'mobile_default' => [
					'size' => 300,
					'unit' => 'px',
				],
				'selectors' => [
                    '{{WRAPPER}} .embedpress-document-embed iframe, , {{WRAPPER}} .ep-share-position-bottom .ep-embed-content-wraper'               => 'width: {{SIZE}}{{UNIT}}!important; max-width: {{SIZE}}{{UNIT}}!important',
                    // '{{WRAPPER}} .embedpress-document-embed' => 'width: {{SIZE}}{{UNIT}}; max-width: 100%',
                    // '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
                ],
                'render_type' => 'template',
			]
		);
        $this->add_responsive_control(
			'embedpress_elementor_document_height',
			[
				'type' => \Elementor\Controls_Manager::SLIDER,
				'label' => esc_html__( 'Height', 'embedpress' ),
				'range' => [
					'px' => [
						'min' => 1,
						'max' => 2000,
					],
				],
				'devices' => [ 'desktop', 'tablet', 'mobile' ],
                'default' => [
					'unit' => 'px',
                    'size' => !empty($value = intval(Helper::get_options_value('enableEmbedResizeHeight'))) ? $value : 600,

				],
				'desktop_default' => [
					'unit' => 'px',
                    'size' => 600,
				],
				'tablet_default' => [
					'size' => 400,
					'unit' => 'px',
				],
				'mobile_default' => [
					'size' => 300,
					'unit' => 'px',
				],
				'selectors' => [
                    '{{WRAPPER}} .embedpress-document-embed iframe'               => 'height: {{SIZE}}{{UNIT}}!important;',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'height: {{SIZE}}{{UNIT}}!important;',
                ],
                'render_type' => 'template',
			]
		);

        $this->add_responsive_control(
            'embedpress_elementor_document_align',
            [
                'label'   => __('Alignment', 'embedpress'),
                'type'    => Controls_Manager::CHOOSE,
                'options' => [
                    'left'   => [
                        'title' => __('Left', 'embedpress'),
                        'icon'  => 'eicon-text-align-left',
                    ],
                    'center' => [
                        'title' => __('Center', 'embedpress'),
                        'icon'  => 'eicon-text-align-center',
                    ],
                    'right'  => [
                        'title' => __('Right', 'embedpress'),
                        'icon'  => 'eicon-text-align-right',
                    ]
                ],
                'prefix_class' => 'elementor%s-align-',
                'default' => '',
            ]
        );

        $this->add_control(
            'embedpress_pdf_powered_by',
            [
                'label'        => __('Powered By', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => apply_filters('embedpress_document_powered_by_control', 'yes'),
            ]
        );

        $this->init_branding_controls('document');

        $this->end_controls_section();


        /**
         * EmbedPress PDF Control Settings
         */

         $this->start_controls_section(
            'embedpress_pdf_content_settings',
            [
                'label' => esc_html__('Controls', 'embedpress'),
                'conditions' => [
                    'relation' => 'or',
                    'terms' => [
                        ['name' => 'embedpress_pdf_type', 'operator' => '===', 'value' => 'file'],
                        ['name' => 'embedpress_pdf_file_link_from', 'operator' => '===', 'value' => 'self'],
                    ],
                ],
            ]
        );
        

        $this->add_control(
            'embedpress_theme_mode',
            [
                'label'   => __('Theme', 'embedpress'),
                'type'    => Controls_Manager::SELECT,
                'default' => 'default',
                'options' => [
                    'default' => __('System Default', 'embedpress'),
                    'dark' => __('Dark', 'embedpress'),
                    'light'  => __('Light', 'embedpress'),
                    'custom'  => __('Custom', 'embedpress')
                ],
            ]
        );

        $this->add_control(
			'embedpress_pdf_custom_color',
			[
				'label' => esc_html__( 'Color', 'embedpress' ),
				'type' => \Elementor\Controls_Manager::COLOR,
                'default' => Helper::get_options_value('custom_color'),
                'global' => [
					'default' => Global_Colors::COLOR_PRIMARY,
				],
                'condition' => [
                    'embedpress_theme_mode' => 'custom',
                ],
			]
		);

        $this->add_control(
            'pdf_toolbar',
            [
                'label'        => sprintf(__('Toolbar %s', 'embedpress'), $this->pro_text),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'classes'     => $this->pro_class,
            ]
        );

        
        $this->add_control(
            'pdf_toolbar_position',
            [
                'label' => esc_html__('Toolbar Position', 'embedpress'),
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'top' => [
                        'title' => esc_html__('Top', 'embedpress'),
                        'icon' => 'eicon-arrow-up',
                    ],
                    'bottom' => [
                        'title' => esc_html__('Bottom', 'embedpress'),
                        'icon' => 'eicon-arrow-down',
                    ],
                ],
                'default' => 'top',
                'toggle' => true,
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'modern',
                ],
            ]
        );
        $this->add_control(
            'flipbook_toolbar_position',
            [
                'label' => esc_html__('Toolbar Position', 'embedpress'),
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'top' => [
                        'title' => esc_html__('Top', 'embedpress'),
                        'icon' => 'eicon-arrow-up',
                    ],
                    'bottom' => [
                        'title' => esc_html__('Bottom', 'embedpress'),
                        'icon' => 'eicon-arrow-down',
                    ],
                ],
                'default' => 'bottom',
                'toggle' => true,
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'flip-book',
                ],
            ]
        );


        $this->add_control(
            'pdf_print_download',
            [
                'label'        => sprintf(__('Print/Download %s', 'embedpress'), $this->pro_text),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'classes'     => $this->pro_class,
                'condition' => [
                    'pdf_toolbar' => 'yes',
                ],
            ]
        );



        $this->add_control(
            'pdf_zoom_in',
            [
                'label'        => __('Zoom In', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'flip-book',
                ],
            ]
        );
        $this->add_control(
            'pdf_zoom_out',
            [
                'label'        => __('Zoom Out', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'flip-book',
                ],
            ]
        );
        $this->add_control(
            'pdf_fit_view',
            [
                'label'        => __('Fit View', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'flip-book',
                ],
            ]
        );
        $this->add_control(
            'pdf_bookmark',
            [
                'label'        => __('Bookmark', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'flip-book',
                ],
            ]
        );


        $this->add_control(
            'pdf_presentation_mode',
            [
                'label'        => __('PDF Presentation Mode', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                ],
            ]
        );
        $this->add_control(
            'pdf_lazyload',
            [
                'label'        => __('Lazy Load', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Yes', 'embedpress'),
                'label_off'    => __('No', 'embedpress'),
                'return_value' => 'yes',
                'default'      => '',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                ],
            ]
        );

        $this->add_control(
            'pdf_text_copy',
            [
                'label'        => sprintf(__('Copy Text %s', 'embedpress'), $this->pro_text),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'classes'     => $this->pro_class,
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'modern',
                ],
            ]
        );

        $this->add_control(
            'add_text',
            [
                'label'        => sprintf(__('Add Text', 'embedpress')),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'modern',
                ],
            ]
        );
        $this->add_control(
            'draw',
            [
                'label'        => sprintf(__('Draw %s', 'embedpress'), $this->pro_text),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'classes'     => $this->pro_class,
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'modern',
                ],
            ]
        );

        $this->add_control(
            'add_image',
            [
                'label'        => __('Add Image', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'modern',
                ],
            ]
        );
        $this->add_control(
            'pdf_rotate_access',
            [
                'label'        => __('Rotation', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'modern',
                ],
            ]
        );

        $this->add_control(
            'pdf_details',
            [
                'label'        => __('Properties', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'pdf_toolbar' => 'yes',
                    'embedpress_pdf_viewer_style' => 'modern',
                ],
            ]
        );

        $this->add_control(
            'selection_tool',
            [
                'label'        => sprintf(__('Default Selection Tool %s', 'embedpress'), $this->pro_text),
                'type' => \Elementor\Controls_Manager::SELECT,
                'options' => [
                    '0' => esc_html__('Text Tool', 'embedpress'),
                    '1' => esc_html__('Hand Tool', 'embedpress'),
                ],
                'default' => '0',
                'classes'     => $this->pro_class,

            ]
        );
        
        $this->add_control(
            'scrolling',
            [
                'label'        => sprintf(__('Default Scrolling %s', 'embedpress'), $this->pro_text),
                'type' => \Elementor\Controls_Manager::SELECT,
                'options' => [
                    '-1' => esc_html__('Page Scrolling', 'embedpress'),
                    '0'  => esc_html__('Vertical Scrolling', 'embedpress'),
                    '1'  => esc_html__('Horizontal Scrolling', 'embedpress'),
                    '2'  => esc_html__('Wrapped Scrolling', 'embedpress'),
                ],
                'default' => '0',
                'classes'     => $this->pro_class,
            ]
        );
        
        $this->add_control(
            'spreads',
            [
                'label' => esc_html__('Default Spreads', 'embedpress'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'options' => [
                    '0' => esc_html__('No Spreads', 'embedpress'),
                    '1'  => esc_html__('Odd Spreads', 'embedpress'),
                    '2'  => esc_html__('Even Spreads', 'embedpress'),
                ],
                'default' => '-1',
                'condition'   => [
                    'scrolling!' => '1',
                ],
            ]
        );

        $this->end_controls_section();

        do_action( 'extend_elementor_controls', $this, '_pdf_', $this->pro_text, $this->pro_class);

    }

    private function is_pdf($url)
    {
        $arr = explode('.', $url);
        return end($arr) === 'pdf';
    }

    public function render()
    {
        $settings = $this->get_settings();
        
		Helper::get_enable_settings_data_for_scripts($settings);
    
        $url = $this->get_file_url();

        if ($settings['embedpress_pdf_type'] === 'url') {
            if (!empty($settings['__dynamic__']['embedpress_pdf_file_link'])) {
                $decode_url = urldecode($settings['__dynamic__']['embedpress_pdf_file_link']);
                preg_match('/name="([^"]+)"/', $decode_url, $name_matches);

                if (!empty($name_matches[1])) {
                    $name_key = $name_matches[1];
                    $pattern = '';

                    if ($name_key === 'acf-url' && class_exists('ACF') && function_exists('get_field')) {
                        $pattern = '/"key":"[^"]+:(.*?)"/';
                    } elseif ($name_key === 'toolset-url' && class_exists('Types_Helper_Output_Meta_Box')) {
                        $pattern = '/"key":"[^"]+:(.*?)"/';
                    } elseif ($name_key === 'jet-post-custom-field' && class_exists('Jet_Engine')) {
                        $pattern = '/"meta_field":"([^"]+)"/';
                    }

                    if ($pattern) {
                        preg_match($pattern, $decode_url, $matches);

                        if (!empty($matches[1])) {
                            $get_field_key = sanitize_key($matches[1]);

                            $url = '';

                            if ($name_key === 'acf-url') {
                                $url = get_field($get_field_key);
                            } elseif ($name_key === 'toolset-url') {
                                $url = get_post_meta(get_the_ID(), 'wpcf-' . $get_field_key, true);
                             } elseif ($name_key === 'jet-post-custom-field') {
                                 $url = get_post_meta(get_the_ID(), $get_field_key, true);
                            }

                            $url = apply_filters('embedpress/custom_meta_field_value', $url, $get_field_key);

                            // Fallback if empty
                            if (empty($url)) {
                                preg_match('/"fallback":"([^"]+)"/', $decode_url, $fallback_matches);
                                if (!empty($fallback_matches[1])) {
                                    $url = $fallback_matches[1];
                                }
                            }

                            // Final sanitization
                            $url = esc_url_raw($url);
                        }
                    }
                }
            }
        }

        $client_id = $this->get_id();

        $this->_render($url, $settings, $client_id);
        Helper::get_source_data(md5($this->get_id()).'_eb_elementor', $url, 'elementor_source_data', 'elementor_temp_source_data');
    }


    public function getParamData($settings){
        $urlParamData = array(
            'themeMode' => $settings['embedpress_theme_mode'],
            'toolbar' => !empty($settings['pdf_toolbar']) ? 'true' : 'false',
            'position' =>  $settings['pdf_toolbar_position'],
            'presentation' => !empty($settings['pdf_presentation_mode']) ? 'true' : 'false',
            'lazyLoad' => !empty($settings['pdf_lazyload']) ? 'true' : 'false',
            'download' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION')? $settings['pdf_print_download'] : 'true',
            'copy_text' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION')? $settings['pdf_text_copy'] : 'true',
            'add_text' => !empty($settings['add_text']) ? 'true' : 'false',
            'draw' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION')? $settings['draw'] : 'true',
            'add_image' => !empty($settings['add_image'])  ? 'true' : 'false',
            'pdf_rotation' => !empty($settings['pdf_rotate_access'])  ? 'true' : 'false',
            'pdf_details' => !empty($settings['pdf_details'])  ? 'true' : 'false',
            'zoom_in' => !empty($settings['pdf_zoom_in'])  ? 'true' : 'false',
            'zoom_out' => !empty($settings['pdf_zoom_out'])  ? 'true' : 'false',
            'fit_view' => !empty($settings['pdf_fit_view'])  ? 'true' : 'false',
            'bookmark' => !empty($settings['pdf_bookmark'])  ? 'true' : 'false',
            'flipbook_toolbar_position' => !empty($settings['flipbook_toolbar_position'])  ? $settings['flipbook_toolbar_position'] : 'bottom',
            'selection_tool' => isset($settings['selection_tool']) ? esc_attr($settings['selection_tool']) : '0',
            'scrolling' => isset($settings['scrolling']) ? esc_attr($settings['scrolling']) : '-1',
            'spreads' => isset($settings['spreads']) ? esc_attr($settings['spreads']) : '-1',
            'is_pro_active' => apply_filters('embedpress/is_allow_rander', false)

        );

        $custom_color = Helper::get_elementor_global_color($settings, 'embedpress_pdf_custom_color');

        if($settings['embedpress_theme_mode'] == 'custom') {
            $urlParamData['customColor'] = $custom_color;
        }

        if($settings['embedpress_pdf_viewer_style'] == 'flip-book'){
            return "&key=" . base64_encode(mb_convert_encoding(http_build_query($urlParamData), "UTF-8"));
        }

        return "#key=" . base64_encode(mb_convert_encoding(http_build_query($urlParamData), "UTF-8"));
    
    }

    public function _render($url, $settings, $id)
    {

        $custom_color = Helper::get_elementor_global_color($settings, 'embedpress_pdf_custom_color');

        $unitoption = 'emebedpress-unit-px';
        if($settings['embedpress_elementor_document_width']['unit'] === '%'){
            $unitoption = 'emebedpress-unit-percent';
        }
        $client_id = $id;
        $id = 'embedpress-pdf-' . $id;
        $hash_pass = hash('sha256', wp_salt(32) . md5($settings['embedpress_pdf_lock_content_password']));

        $dimension = '';
        
        $password_correct = isset($_COOKIE['password_correct_' . $client_id]) ? sanitize_text_field($_COOKIE['password_correct_' . $client_id]) : '';

        if(empty($settings['embedpress_pdf_lock_content']) || empty($settings['embedpress_pdf_lock_content_password']) || (!empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct))){  
            $dimension = "width: {$settings['embedpress_elementor_document_width']['size']}{$settings['embedpress_elementor_document_width']['unit']}!important;height: {$settings['embedpress_elementor_document_height']['size']}px;";
        }

        $content_protection_class = 'ep-content-protection-enabled';
        $content_locked_class = 'ep-content-locked';
		if(empty($settings['embedpress_pdf_lock_content']) || empty($settings['embedpress_pdf_lock_content_password']) || $hash_pass === $password_correct) {
            $content_locked_class = '';
			$content_protection_class = 'ep-content-protection-disabled';
		}

        $pass_hash_key = md5($settings['embedpress_pdf_lock_content_password']);
        $this->add_render_attribute('embedpres-pdf-render', [
            'class'     => ['embedpress-embed-document-pdf', esc_attr($id)],
            'data-emid' => esc_attr($id)
        ]);
        $this->add_render_attribute('embedpress-document', [
            'class' => ['embedpress-document-embed', 'ep-doc-' . md5($id), 'ose-document', $unitoption, $content_locked_class ],
            'data-thememode' => isset($settings['embedpress_theme_mode']) ? esc_attr($settings['embedpress_theme_mode']) : '',
            'data-customcolor' => isset($custom_color) ? esc_attr($custom_color) : '',
            'data-toolbar' => isset($settings['pdf_toolbar']) ? esc_attr($settings['pdf_toolbar']) : '',
            'data-toolbar-position' => isset($settings['pdf_toolbar_position']) ? esc_attr($settings['pdf_toolbar_position']) : 'top',
            'data-open' => 'no', // Assuming 'no' is a static value, no need to sanitize
            'data-presentation-mode' => isset($settings['pdf_presentation_mode']) ? esc_attr($settings['pdf_presentation_mode']) : '',
            'data-download' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION') ? esc_attr($settings['pdf_print_download']) : 'yes', // Assuming 'yes' is a safe fallback
            'data-copy' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION') ? esc_attr($settings['pdf_text_copy']) : 'yes', // Assuming 'yes' is a safe fallback
            'data-add-image' => isset($settings['add_image']) ? esc_attr($settings['add_image']) : '',
            'data-rotate' => isset($settings['pdf_rotate_access']) ? esc_attr($settings['pdf_rotate_access']) : '',
            'data-details' => isset($settings['pdf_details']) ? esc_attr($settings['pdf_details']) : '',
            'data-id' => $id, // Assuming $id is safe, no need to sanitize
            'data-selection-tool' => isset($settings['selection_tool']) ? esc_attr($settings['selection_tool']) : '0',
            'data-scrolling' => isset($settings['scrolling']) ? esc_attr($settings['scrolling']) : '-1',
            'data-spreads' => isset($settings['spreads']) ? esc_attr($settings['spreads']) : '-1',
        ]); 

        $embed_settings =  [];
		$embed_settings['customThumbnail'] = !empty($settings['embedpress_pdf_content_share_custom_thumbnail']['url']) ? esc_url($settings['embedpress_pdf_content_share_custom_thumbnail']['url']) : '';

        $embed_settings['customTitle'] = !empty($settings['embedpress_pdf_content_title']) ? sanitize_text_field($settings['embedpress_pdf_content_title']) : Helper::get_file_title($url);

        $embed_settings['customDescription'] = !empty($settings['embedpress_pdf_content_descripiton']) ? sanitize_text_field($settings['embedpress_pdf_content_descripiton']) : Helper::get_file_title($url);

        $embed_settings['sharePosition'] = !empty($settings['embedpress_pdf_content_share_position']) ? sanitize_text_field($settings['embedpress_pdf_content_share_position']) : 'right';

         // Add social share platform settings
		$embed_settings['shareFacebook'] = !empty($settings['embedpress_pdf_share_facebook']) ? true : false;
		$embed_settings['shareTwitter'] = !empty($settings['embedpress_pdf_share_twitter']) ? true : false;
		$embed_settings['sharePinterest'] = !empty($settings['embedpress_pdf_share_pinterest']) ? true : false;
		$embed_settings['shareLinkedin'] = !empty($settings['embedpress_pdf_share_linkedin']) ? true : false;

        $embed_settings['lockHeading'] = !empty($settings['embedpress_pdf_lock_content_heading']) ? sanitize_text_field($settings['embedpress_pdf_lock_content_heading']) : '';

        $embed_settings['lockSubHeading'] = !empty($settings['embedpress_pdf_lock_content_sub_heading']) ? sanitize_text_field($settings['embedpress_pdf_lock_content_sub_heading']) : '';

        $embed_settings['lockErrorMessage'] = !empty($settings['embedpress_pdf_lock_content_error_message']) ? sanitize_text_field($settings['embedpress_pdf_lock_content_error_message']) : '';

        $embed_settings['passwordPlaceholder'] = !empty($settings['embedpress_pdf_password_placeholder']) ? sanitize_text_field($settings['embedpress_pdf_password_placeholder']) : '';

        $embed_settings['submitButtonText'] = !empty($settings['embedpress_pdf_submit_button_text']) ? sanitize_text_field($settings['embedpress_pdf_submit_button_text']) : '';

        $embed_settings['submitUnlockingText'] = !empty($settings['embedpress_pdf_submit_Unlocking_text']) ? sanitize_text_field($settings['embedpress_pdf_submit_Unlocking_text']) : '';

        $embed_settings['enableFooterMessage'] = !empty($settings['embedpress_pdf_enable_footer_message']) ? sanitize_text_field($settings['embedpress_pdf_enable_footer_message']) : '';

        $embed_settings['footerMessage'] = !empty($settings['embedpress_pdf_lock_content_footer_message']) ? sanitize_text_field($settings['embedpress_pdf_lock_content_footer_message']) : '';
       
        $embed_settings['userRole'] = !empty($settings['embedpress_pdf_select_roles']) ? $settings['embedpress_pdf_select_roles'] : [];

		$embed_settings['protectionMessage'] = !empty($settings['embedpress_pdf_protection_message']) ? $settings['embedpress_pdf_protection_message'] : '';


        if($settings['embedpress_elementor_document_width']['unit'] === '%'){
			$width_class = ' ep-percentage-width';
		}
		else{
			$width_class = 'ep-fixed-width';
		}
		$content_share_class = '';
		$share_position_class = '';
		$share_position = isset($settings['embedpress_pdf_content_share_position']) ? $settings['embedpress_pdf_content_share_position'] : 'right';

		if(!empty($settings['embedpress_pdf_content_share'])) {
			$content_share_class = 'ep-content-share-enabled';
			$share_position_class = 'ep-share-position-'.$share_position;
		}

        $adsAtts = '';

		if (!empty($settings['adManager'])) {
			$ad = base64_encode(json_encode($settings)); // Using WordPress JSON encoding function
			$adsAtts = 'data-sponsored-id="' . esc_attr($client_id) . '" data-sponsored-attrs="' . esc_attr($ad) . '" class="sponsored-mask"';
		}

        ?>
    <div <?php echo $this->get_render_attribute_string('embedpress-document'); ?> style=" max-width:100%; display: inline-block">
        
        <?php
            do_action('embedpress_pdf_after_embed',  $settings, $url, $id, $this);

            if ($url != '') {
                $url = esc_url($url);

                if ($this->is_pdf($url) && !$this->is_external_url($url)) {
                    $renderer = Helper::get_pdf_renderer();
                    $src = $renderer . ((strpos($renderer, '?') === false) ? '?' : '&') 
                        . 'file=' . urlencode($url) 
                        . '&scrolling=' . $settings['scrolling'] 
                        . '&selection_tool=' . $settings['selection_tool'] 
                        . '&spreads=' . $settings['spreads']
                        . $this->getParamData($settings);


                    if (!empty($settings['embedpress_pdf_zoom'])) {
                        $zoom = $settings['embedpress_pdf_zoom'];
                        if ($zoom == 'custom') {
                            if (!empty($settings['embedpress_pdf_zoom_custom'])) {
                                $zoom = $settings['embedpress_pdf_zoom_custom'];
                            } else {
                                $zoom = null;
                            }
                        }
                        if ($zoom) {
                            $src = $src . "&zoom=$zoom";
                        }
                    }
                    
                    if(isset($settings['embedpress_pdf_viewer_style']) && $settings['embedpress_pdf_viewer_style'] === 'modern') {
                        $embed_content = '<iframe title="'.esc_attr(Helper::get_file_title($url)).'" class="embedpress-embed-document-pdf '.esc_attr($id).'" style="'.esc_attr($dimension).'; max-width:100%; display: inline-block" src="'.esc_url($src).'"';
                    }
                    else{
                        $src = urlencode($url).$this->getParamData($settings);
                        $embed_content = '<iframe title="'.esc_attr(Helper::get_file_title($url)).'" class="embedpress-embed-document-pdf '.esc_attr($id).'" style="'.esc_attr($dimension).'; max-width:100%; display: inline-block" src="'.esc_url(EMBEDPRESS_URL_ASSETS . 'pdf-flip-book/viewer.html?file='.$src).'"';
                    }

                    
                    $embed_content .= ' '.$this->get_render_attribute_string('embedpres-pdf-render').' frameborder="0"></iframe>';
                    if ($settings['embedpress_pdf_powered_by'] === 'yes') {
                        $embed_content .= sprintf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
                    }
                    
                } else {
                    $embed_content = '<iframe title="'.esc_attr(Helper::get_file_title($url)).'" class="embedpress-embed-document-pdf '.esc_attr($id).'" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="'.esc_attr($dimension).'; max-width:100%;" src="'.esc_url($url).'"';
                    $embed_content .= ' '.$this->get_render_attribute_string('embedpres-pdf-render').'></iframe>';
                    
                    if ($settings['embedpress_pdf_powered_by'] === 'yes') {
                        $embed_content .= sprintf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
                    }
                }

                ?>

                <div <?php echo $adsAtts; ?>>
                
                    <div id="ep-elementor-content-<?php echo esc_attr( $client_id )?>" class="ep-elementor-content <?php if(!empty($settings['embedpress_pdf_content_share'])) : echo esc_attr( 'position-'.$settings['embedpress_pdf_content_share_position'].'-wraper' ); endif; ?> <?php echo  esc_attr($width_class.' '.$content_share_class.' '.$share_position_class.' '.$content_protection_class);  ?>">
                        <div id="<?php echo esc_attr( $this->get_id() ); ?>" class="ep-embed-content-wraper">
                            <?php 
                                $embed = '<div>'.$embed_content.'</div>';

                                $content_id = $client_id;
                                if(
                               
                                (empty($settings['embedpress_pdf_lock_content']) || ($settings['embedpress_pdf_protection_type'] == 'password' && empty($settings['embedpress_pdf_lock_content_password'])) || $settings['embedpress_pdf_lock_content'] == 'no') || 
                                ($settings['embedpress_pdf_protection_type'] == 'password' && !empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct) ) || 
                                !apply_filters('embedpress/is_allow_rander', false) || 
                                ($settings['embedpress_pdf_protection_type'] == 'user-role' && Helper::has_allowed_roles($embed_settings['userRole']))

                                ){
                                    if(!empty($settings['embedpress_pdf_content_share'])){
                                        $embed  .= Helper::embed_content_share($content_id, $embed_settings);
                                    }
                                    echo $embed ;
                                    
                                } else {
                                    if(!empty($settings['embedpress_pdf_content_share'])){
                                        $embed .= Helper::embed_content_share($content_id, $embed_settings);
                                    }

                                    if ($settings['embedpress_pdf_protection_type'] == 'password') {
                                        do_action('embedpress/display_password_form', $client_id, $embed, $pass_hash_key, $embed_settings);
                                    } else {
                                        do_action('embedpress/content_protection_content', $client_id, $embed_settings['protectionMessage'],  $embed_settings['userRole']);
                                    }
                                }
                            ?>
                        </div> 

                    </div>
        

                   <?php
                        $isAdEnabled = !empty($settings['adManager']);
						$isContentUnlocked = empty($settings['embedpress_pdf_lock_content']);
                        $isPasswordCorrect = Helper::is_password_correct($client_id) && ($hash_pass === $password_correct);

                        if ($isAdEnabled && ($isContentUnlocked || $isPasswordCorrect)) {
                            $embed_content = apply_filters('embedpress/generate_ad_template', $embed_content, $client_id, $settings, 'elementor');
                        }
                    ?>

                </div>
            <?php
                
            }
        ?>

    </div>

<?php
    }

    private function get_file_url()
    {
        $settings = $this->get_settings();
        return $settings['embedpress_pdf_type'] === 'url' ? $settings['embedpress_pdf_file_link']['url'] : $settings['embedpress_pdf_Uploader']['url'];
    }

    protected function is_external_url($url)
    {
        return strpos($url, get_site_url()) === false;
    }
}
