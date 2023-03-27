<?php

namespace EmbedPress\Elementor\Widgets;


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
        $this->pro_class = is_embedpress_pro_active() ? '' : 'embedpress-pro-control not-active';
        $this->pro_text = is_embedpress_pro_active() ? '' : '<sup class="embedpress-pro-label" style="color:red">' . __('Pro', 'embedpress') . '</sup>';
        /**
         * EmbedPress Content Settings
         */
        $this->start_controls_section(
            'embedpress_content_settings',
            [
                'label' => esc_html__('Content Settings', 'embedpress'),
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
                'show_external' => false,
                'default'       => [
                    'url' => ''
                ],
                'condition'     => [
                    'embedpress_pdf_type' => 'url'
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

        $this->add_control(
            'embedpress_elementor_document_width',
            [
                'label'     => __('Width', 'embedpress'),
                'type'      => Controls_Manager::SLIDER,
                'separator' => 'before',
                'size_units' => [ 'px', '%' ],
                'default'   => [
                    'unit' => 'px',
                    'size' => 600,
                ],
                'range'     => [
                    '%' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                    'px' => [
                        'min' => 6,
                        'max' => 1000,
                    ],
                ],
                'selectors' => [
                    '{{WRAPPER}} .embedpress-document-embed iframe'               => 'width: {{SIZE}}{{UNIT}}; max-width: 100%',
                    '{{WRAPPER}} .embedpress-document-embed' => 'width: {{SIZE}}{{UNIT}}; max-width: 100%',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
                ],
                'render_type' => 'template',
            ]
        );

        $this->add_control(
            'embedpress_elementor_document_height',
            [
                'label'     => __('Height', 'embedpress'),
                'type'      => Controls_Manager::SLIDER,
                'default'   => [
                    'unit' => 'px',
                    'size' => 600,
                ],
                'range'     => [
                    'px' => [
                        'min' => 6,
                        'max' => 1000,
                    ],
                ],
                'selectors' => [
                    '{{WRAPPER}} .embedpress-document-embed iframe'               => 'height: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'height: {{SIZE}}{{UNIT}};',
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
                'label' => esc_html__('PDF Control Settings', 'embedpress'),
                'condition'   => [
                    'embedpress_pdf_type' => 'file'
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
                ],
            ]
        );

        $this->end_controls_section();


        if (!is_embedpress_pro_active()) {
            $this->start_controls_section(
                'embedpress_pro_section',
                [
                    'label' => __('Go Premium for More Features', 'embedpress'),
                ]
            );

            $this->add_control(
                'embedpress_pro_cta',
                [
                    'label' => __('Unlock more possibilities', 'embedpress'),
                    'type' => Controls_Manager::CHOOSE,
                    'options' => [
                        '1' => [
                            'title' => '',
                            'icon' => 'eicon-lock',
                        ],
                    ],
                    'default' => '1',
                    'description' => '<span class="pro-feature"> Get the  <a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Pro version</a> for more provider support and customization options.</span>',
                ]
            );

            $this->end_controls_section();
        }
    }

    private function is_pdf($url)
    {
        $arr = explode('.', $url);
        return end($arr) === 'pdf';
    }

    protected function render()
    {
        $settings = $this->get_settings();
        $url = $this->get_file_url();
        $id = $this->get_id();
        $this->_render($url, $settings, $id);

        Helper::get_source_data(md5($this->get_id()).'_eb_elementor', $url, 'elementor_source_data', 'elementor_temp_source_data');
    }

    public function getParamData($settings){
        $urlParamData = array(
            'themeMode' => $settings['embedpress_theme_mode'],
            'toolbar' => !empty($settings['pdf_toolbar']) ? 'true' : 'false',
            'position' =>  $settings['pdf_toolbar_position'],
            'presentation' => !empty($settings['pdf_presentation_mode']) ? 'true' : 'false',
            'download' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION')? $settings['pdf_print_download'] : 'true',
            'copy_text' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION')? $settings['pdf_text_copy'] : 'true',
            'add_text' => !empty($settings['add_text']) ? 'true' : 'false',
            'draw' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION')? $settings['draw'] : 'true',
            'doc_rotation' => !empty($settings['pdf_rotate_access'])  ? 'true' : 'false',
            'doc_details' => !empty($settings['pdf_details'])  ? 'true' : 'false',
        );

        if($settings['embedpress_theme_mode'] == 'custom') {
            $urlParamData['customColor'] = $settings['embedpress_pdf_custom_color'];
        }

        if($settings['embedpress_pdf_type'] == 'file'){   
            return "#" .http_build_query($urlParamData) ;
        }
        return '';
    
    }

    public function _render($url, $settings, $id)
    {
        $unitoption = 'emebedpress-unit-px';
        if($settings['embedpress_elementor_document_width']['unit'] === '%'){
            $unitoption = 'emebedpress-unit-percent';
        }
        $id = 'embedpress-pdf-' . $id;
        $dimension = "width: {$settings['embedpress_elementor_document_width']['size']}{$settings['embedpress_elementor_document_width']['unit']};height: {$settings['embedpress_elementor_document_height']['size']}px";
        $this->add_render_attribute('embedpres-pdf-render', [
            'class'     => ['embedpress-embed-document-pdf', $id],
            'data-emid' => $id
        ]);
        $this->add_render_attribute('embedpress-document', [
            'class' => ['embedpress-document-embed', 'ep-doc-' . md5($id), 'ose-document', $unitoption ],
            'data-thememode' => $settings['embedpress_theme_mode'],
            'data-customcolor' => $settings['embedpress_pdf_custom_color'],
            'data-toolbar' => $settings['pdf_toolbar'],
            'data-toolbar-position' =>  $settings['pdf_toolbar_position'],
            'data-open' => 'no',
            'data-presentation-mode' => $settings['pdf_presentation_mode'],
            'data-download' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION')? $settings['pdf_print_download'] : 'yes',
            'data-copy' => defined('EMBEDPRESS_PRO_PLUGIN_VERSION')? $settings['pdf_text_copy'] : 'yes',
            'data-rotate' => $settings['pdf_rotate_access'],
            'data-details' => $settings['pdf_details'],
            'data-id' => $id
        ]); 
        ?>
    <div <?php echo $this->get_render_attribute_string('embedpress-document'); ?> style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: inline-block">
        <?php
                do_action('embedpress_pdf_after_embed',  $settings, $url, $id, $this);
                ?>
        <?php if ($url != '') {
                    if ($this->is_pdf($url) && !$this->is_external_url($url)) {
                        $this->add_render_attribute('embedpres-pdf-render', 'data-emsrc', $url);
                        $renderer = Helper::get_pdf_renderer();
                        $src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . urlencode($url).$this->getParamData($settings);
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
                        ?>
                <iframe title="<?php echo esc_attr(Helper::get_file_title($url)); ?>" class="embedpress-embed-document-pdf <?php echo esc_attr($id); ?>" style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: inline-block" src="<?php echo esc_attr($src); ?>" <?php $this->get_render_attribute_string('embedpres-pdf-render'); ?> frameborder="0"></iframe>
            <?php

                        } else {
                            ?>
                <div>
                    <iframe title="<?php echo esc_attr(Helper::get_file_title($url)); ?>" class="embedpress-embed-document-pdf <?php echo esc_attr($id); ?>" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="<?php echo esc_attr($dimension); ?>; max-width:100%;" src="<?php echo esc_url($url); ?>" <?php $this->get_render_attribute_string('embedpres-pdf-render'); ?>></iframe>
                </div>

        <?php
                    }
                    if ($settings['embedpress_pdf_powered_by'] === 'yes') {

                        printf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
                    }
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
