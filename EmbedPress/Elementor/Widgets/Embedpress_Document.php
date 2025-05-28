<?php

namespace EmbedPress\Elementor\Widgets;


use \Elementor\Controls_Manager as Controls_Manager;
use \Elementor\Modules\DynamicTags\Module as TagsModule;
use \Elementor\Widget_Base as Widget_Base;
use \Elementor\Plugin;
use EmbedPress\Includes\Traits\Branding;
use EmbedPress\Includes\Classes\Helper;

( defined( 'ABSPATH' ) ) or die( "No direct script access allowed." );

class Embedpress_Document extends Widget_Base
{
    use Branding;
	protected $pro_class = '';
	protected $pro_text = '';
    public function get_name()
    {
        return 'embedpres_document';
    }

    public function get_title()
    {
        return esc_html__( 'EmbedPress Document', 'embedpress' );
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
        return 'icon-document';
    }

    public function get_style_depends()
	{
		return [
            'embedpress-elementor-css',
            'embedpress-style'
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
		if (isset($handler_keys['enabled_docs_custom_viewer']) && $handler_keys['enabled_docs_custom_viewer'] === 'yes') {
			$handles[] = 'embedpress_documents_viewer_script';
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
        return ['embedpress', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'embedpress-document'];
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
            'embedpress_document_content_settings',
            [
                'label' => esc_html__( 'General', 'embedpress' ),
            ]
        );

        $this->add_control(
            'embedpress_document_type',
            [
                'label'   => __( 'Document Type', 'embedpress' ),
                'type'    => Controls_Manager::SELECT,
                'default' => 'file',
                'options' => [
                    'file' => __( 'File', 'embedpress' ),
                    'url'  => __( 'URL', 'embedpress' )
                ],
            ]
        );
        $this->add_control(
            'embedpress_document_Uploader',
            [

                'label'       => __( 'Upload File', 'embedpress' ),
                'type'        => Controls_Manager::MEDIA,
                'dynamic'     => [
                    'active'     => true,
                    'categories' => [
                        TagsModule::MEDIA_CATEGORY,
                    ],
                ],
                'media_type'  => [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/vnd.openxmlformats-officedocument.presentationml.slideshow' // Added PPSX MIME type

                ],
                'description' => __( 'Upload a file or pick one from your media library for embed. Supported File Type: PDF, DOC/DOCX, PPT/PPTX, XLS/XLSX etc.',
                    'embedpress' ),
                'condition'   => [
                    'embedpress_document_type' => 'file'
                ],
            ]
        );

        $this->add_control(
            'embedpress_document_file_link',
            [
                'label'         => __( 'URL', 'embedpress' ),
                'type'          => Controls_Manager::URL,
                'placeholder'   => __( 'https://your-link.com/file.pdf', 'embedpress' ),
                'show_external' => false,
                'dynamic'     => [
					'active' => true,
				],
                'default'       => [
                    'url' => ''
                ],
                'condition'     => [
                    'embedpress_document_type' => 'url'
                ],
            ]
        );

        $this->add_responsive_control(
			'embedpress_elementor_document_width',
			[
				'type' => \Elementor\Controls_Manager::SLIDER,
				'label' => esc_html__( 'Width', 'embedpress' ),
				'range' => [
					'px' => [
						'min' => 1,
						'max' => 1000,
					],
				],
				// 'devices' => [ 'desktop', 'tablet', 'mobile' ],
                'default' => [
					'unit' => 'px',
                    'size' => !empty($value = intval(Helper::get_options_value('enableEmbedResizeWidth'))) ? $value : 600,
				],
				// 'desktop_default' => [
				// 	'unit' => 'px',
                //     'size' => 600,
				// ],
				// 'tablet_default' => [
				// 	'size' => 400,
				// 	'unit' => 'px',
				// ],
				// 'mobile_default' => [
				// 	'size' => 300,
				// 	'unit' => 'px',
				// ],
				'selectors' => [
                    '{{WRAPPER}} .embedpress-document-embed iframe'               => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%; background-color: #fff',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
                    '{{WRAPPER}} .embedpress-document-embed'                      => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
                ],
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
						'max' => 1500,
					],
				],
				// 'devices' => [ 'desktop', 'tablet', 'mobile' ],
                'default' => [
					'unit' => 'px',
                    'size' => !empty($value = intval(Helper::get_options_value('enableEmbedResizeHeight'))) ? $value : 600,
				],
				// 'desktop_default' => [
				// 	'unit' => 'px',
                //     'size' => 600,
				// ],
				// 'tablet_default' => [
				// 	'size' => 400,
				// 	'unit' => 'px',
				// ],
				// 'mobile_default' => [
				// 	'size' => 300,
				// 	'unit' => 'px',
				// ],
				'selectors' => [
                    '{{WRAPPER}} .embedpress-document-embed iframe' => 'height: {{SIZE}}{{UNIT}}!important;',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'height: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .embedpress-document-embed ' => 'max-height: {{SIZE}}{{UNIT}};',
                ],
			]
		);

        $this->add_responsive_control(
            'embedpress_elementor_document_align',
            [
                'label'   => __( 'Alignment', 'embedpress' ),
                'type'    => Controls_Manager::CHOOSE,
                'options' => [
                    'left'   => [
                        'title' => __( 'Left', 'embedpress' ),
                        'icon'  => 'eicon-text-align-left',
                    ],
                    'center' => [
                        'title' => __( 'Center', 'embedpress' ),
                        'icon'  => 'eicon-text-align-center',
                    ],
                    'right'  => [
                        'title' => __( 'Right', 'embedpress' ),
                        'icon'  => 'eicon-text-align-right',
                    ]
                ],
                'prefix_class' => 'elementor%s-align-',
                'default' => '',
            ]
        );

        $this->add_control(
            'embedpress_document_powered_by',
            [
                'label'        => __( 'Powered By', 'embedpress' ),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __( 'Show', 'embedpress' ),
                'label_off'    => __( 'Hide', 'embedpress' ),
                'return_value' => 'yes',
                'default'      => apply_filters( 'embedpress_document_powered_by_control', 'yes' ),
            ]
        );

	    $this->init_branding_controls( 'document');

	    $this->end_controls_section();

         /**
         * EmbedPress Document control settings
         */

         $this->start_controls_section(
            'embedpress_doc_content_settings',
            [
                'label' => esc_html__('Controls', 'embedpress'),
            ]
        );

        $this->add_control(
			'important_note',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => esc_html__( 'Download feature is available when link has the document extension at the end.', 'embedpress' ),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
                'condition' => [
                    'embedpress_document_type' => 'url',
                ],
			]
		);

        $this->add_control(
			'important_note_2',
			[
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw' => esc_html__( 'Toolbar and additional feature options become accessible upon selecting the Custom Viewer mode.', 'embedpress' ),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
                'condition' => [
                    'embedpress_document_type' => 'file',
                    'embedpress_document_viewer' => 'office',
                ],
			]
		);


        $this->add_control(
            'embedpress_document_viewer',
            [
                'label'   => __('Viewer', 'embedpress'),
                'type'    => Controls_Manager::SELECT,
                'default' => 'custom',
                'options' => [
                    'custom'  => __('Custom', 'embedpress'),
                    'office' => __('MS Office', 'embedpress'),
                    'google' => __('Google', 'embedpress'),
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
                'condition' => [
                    'embedpress_document_viewer' => 'custom',
                ],

            ]
        );

        $this->add_control(
			'embedpress_doc_custom_color',
			[
				'label' => esc_html__( 'Color', 'embedpress' ),
				'type' => \Elementor\Controls_Manager::COLOR,
                'condition' => [
                    'embedpress_theme_mode' => 'custom',
                    'embedpress_document_viewer' => 'custom',
                ],
			]
		);

        $this->add_control(
            'doc_toolbar',
            [
                'label'        => sprintf(__('Toolbar %s', 'embedpress'), $this->pro_text),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'classes'     => $this->pro_class,
                'condition' => [
                    'embedpress_document_viewer' => 'custom',
                ],
            ]
        );


        $this->add_control(
            'doc_fullscreen_mode',
            [
                'label'        => __('Fullscreen', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'doc_toolbar' => 'yes',
                    'embedpress_document_viewer' => 'custom',
                ],
            ]
        );

        $this->add_control(
            'doc_print_download',
            [
                'label'        => sprintf(__('Print/Download %s', 'embedpress'), $this->pro_text),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'classes'     => $this->pro_class,
                'condition' => [
                    'doc_toolbar' => 'yes',
                    'embedpress_document_viewer' => 'custom',
                ],
            ]
        );
    
 
        $this->add_control(
            'doc_draw',
            [
                'label'        => __('Draw', 'embedpress'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => __('Show', 'embedpress'),
                'label_off'    => __('Hide', 'embedpress'),
                'return_value' => 'yes',
                'default'      => 'yes',
                'condition' => [
                    'doc_toolbar' => 'yes',
                    'embedpress_document_viewer' => 'custom',
                ],
            ]
        );


        $this->end_controls_section();

        do_action( 'extend_elementor_controls', $this, '_doc_', $this->pro_text, $this->pro_class);

    }

    private function is_pdf( $url )
    {
        $arr = explode( '.', $url );
        return end( $arr ) === 'pdf';
    }

    protected function render()
    {
        $settings = $this->get_settings();
        
		Helper::get_enable_settings_data_for_scripts($settings);
    
        $client_id = esc_attr($this->get_id());
        $pass_hash_key = md5($settings['embedpress_doc_lock_content_password']);
        $url = esc_url($this->get_file_url());
        $id = 'embedpress-pdf-' . esc_attr($this->get_id());

        if ($settings['embedpress_document_type'] === 'url') {
            if (!empty($settings['__dynamic__']['embedpress_document_file_link'])) {
                $decode_url = urldecode($settings['__dynamic__']['embedpress_document_file_link']);
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

                            // Fallback
                            if (empty($url)) {
                                preg_match('/"fallback":"([^"]+)"/', $decode_url, $fallback_matches);
                                if (!empty($fallback_matches[1])) {
                                    $url = $fallback_matches[1];
                                }
                            }

                            // Final sanitization before output
                            $url = esc_url_raw($url);
                        }
                    }
                }
            }
        }
        $hash_pass = hash('sha256', wp_salt(32) . md5($settings['embedpress_doc_lock_content_password']));
    
        $dimension = '';
        if (
            empty($settings['embedpress_doc_lock_content']) && 
            empty($settings['embedpress_doc_lock_content_password']) &&
            isset($settings['embedpress_elementor_document_width']) && 
            isset($settings['embedpress_elementor_document_height']) 
            ) {
            $dimension = "width: " . esc_attr($settings['embedpress_elementor_document_width']['size']) . "px; height: " . esc_attr($settings['embedpress_elementor_document_height']['size']) . "px";
        }
    
        $content_locked_class = '';
        if (!empty($settings['embedpress_doc_lock_content']) && !empty($settings['embedpress_doc_lock_content_password'])) {
            $content_locked_class = 'ep-content-locked';
        }
    
        $this->add_render_attribute('embedpres-pdf-render', [
            'class' => ['embedpress-embed-document-pdf', $id],
            'data-emid' => esc_attr($id)
        ]);
    
        Helper::get_source_data(md5($this->get_id()) . '_eb_elementor', $url, 'elementor_source_data', 'elementor_temp_source_data');
    
        $this->add_render_attribute('embedpress-document', [
            'class' => ['embedpress-document-embed', 'ep-doc-' . md5($id), 'ose-document', $content_locked_class]
        ]);
    
        $embed_settings = [];
        $embed_settings['customThumbnail'] = !empty($settings['embedpress_doc_content_share_custom_thumbnail']['url']) ? esc_url($settings['embedpress_doc_content_share_custom_thumbnail']['url']) : '';

        $embed_settings['customTitle'] = !empty($settings['embedpress_doc_content_title']) ? sanitize_text_field($settings['embedpress_doc_content_title']) : sanitize_text_field(Helper::get_file_title($url));

        $embed_settings['customDescription'] = !empty($settings['embedpress_doc_content_descripiton']) ? sanitize_text_field($settings['embedpress_doc_content_descripiton']) : sanitize_text_field(Helper::get_file_title($url));

        $embed_settings['sharePosition'] = !empty($settings['embedpress_doc_content_share_position']) ? esc_attr($settings['embedpress_doc_content_share_position']) : 'right';

        // Add social share platform settings
		$embed_settings['shareFacebook'] = !empty($settings['embedpress_doc_share_facebook']) ? true : false;
		$embed_settings['shareTwitter'] = !empty($settings['embedpress_doc_share_twitter']) ? true : false;
		$embed_settings['sharePinterest'] = !empty($settings['embedpress_doc_share_pinterest']) ? true : false;
		$embed_settings['shareLinkedin'] = !empty($settings['embedpress_doc_share_linkedin']) ? true : false;

        $embed_settings['lockHeading'] = !empty($settings['embedpress_doc_lock_content_heading']) ? sanitize_text_field($settings['embedpress_doc_lock_content_heading']) : '';

        $embed_settings['lockSubHeading'] = !empty($settings['embedpress_doc_lock_content_sub_heading']) ? sanitize_text_field($settings['embedpress_doc_lock_content_sub_heading']) : '';

        $embed_settings['lockErrorMessage'] = !empty($settings['embedpress_doc_lock_content_error_message']) ? sanitize_text_field($settings['embedpress_doc_lock_content_error_message']) : '';

        $embed_settings['passwordPlaceholder'] = !empty($settings['embedpress_doc_password_placeholder']) ? esc_attr($settings['embedpress_doc_password_placeholder']) : '';

        $embed_settings['submitButtonText'] = !empty($settings['embedpress_doc_submit_button_text']) ? sanitize_text_field($settings['embedpress_doc_submit_button_text']) : '';

        $embed_settings['submitUnlockingText'] = !empty($settings['embedpress_doc_submit_Unlocking_text']) ? sanitize_text_field($settings['embedpress_doc_submit_Unlocking_text']) : '';

        $embed_settings['enableFooterMessage'] = !empty($settings['embedpress_doc_enable_footer_message']) ? esc_attr($settings['embedpress_doc_enable_footer_message']) : '';

        $embed_settings['footerMessage'] = !empty($settings['embedpress_doc_lock_content_footer_message']) ? sanitize_text_field($settings['embedpress_doc_lock_content_footer_message']) : '';

        $embed_settings['userRole'] = !empty($settings['embedpress_doc_select_roles']) ? $settings['embedpress_doc_select_roles'] : [];

		$embed_settings['protectionMessage'] = !empty($settings['embedpress_doc_protection_message']) ? $settings['embedpress_doc_protection_message'] : '';

    
        $content_share_class = '';
        $share_position_class = '';
        $share_position = isset($settings['embedpress_doc_content_share_position']) ? esc_attr($settings['embedpress_doc_content_share_position']) : 'right';
    
        if (!empty($settings['embedpress_doc_content_share'])) {
            $content_share_class = 'ep-content-share-enabled';
            $share_position_class = 'ep-share-position-' . $share_position;
        }
    
        $password_correct = isset($_COOKIE['password_correct_' . $client_id]) ? sanitize_text_field($_COOKIE['password_correct_' . $client_id]) : '';

        $content_protection_class = 'ep-content-protection-enabled';
        if (empty($settings['embedpress_doc_lock_content']) || empty($settings['embedpress_doc_lock_content_password']) || $hash_pass === $password_correct) {
            $content_protection_class = 'ep-content-protection-disabled';
        }
    
        $adsAtts = '';

        if (!empty($settings['adManager'])) {
            $ad = base64_encode(json_encode($settings)); // Using WordPress JSON encoding function
            $adsAtts = 'data-sponsored-id="' . esc_attr($client_id) . '" data-sponsored-attrs="' . esc_attr($ad) . '" class="sponsored-mask"';
        }

        ?>
    
        <div <?php echo $this->get_render_attribute_string('embedpress-document'); ?> style="<?php echo esc_attr($dimension); ?>; max-width:100%; display: inline-block">
    
            <?php
            do_action('embedpress_document_after_embed', $settings, $url, $id, $this);
    
            if ($url != '') {
                $url = esc_url($url);

                if ($this->is_pdf($url)) {
                    $this->add_render_attribute('embedpres-pdf-render', 'data-emsrc', esc_url($url));
                    $embed_content = '<div ' . $this->get_render_attribute_string('embedpres-pdf-render') . '>';
    
                    $embed_content .= '<iframe title="' . esc_attr(Helper::get_file_title($url)) . '" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="' . esc_attr($dimension) . '; max-width:100%;" src="' . esc_url($url) . '"></iframe>';
    
                    if ($settings['embedpress_document_powered_by'] === 'yes') {
                        $embed_content .= sprintf('<p class="embedpress-el-powered">%s</p>', esc_html__('Powered By EmbedPress', 'embedpress'));
                    }
                    $embed_content .= '</div>';
    
                    if (Plugin::$instance->editor->is_edit_mode()) {
                        $embed_content .= $this->render_editor_script($id, $url);
                    }
                } else {
                    if (Helper::is_file_url($url)) {
                        $view_link = '//view.officeapps.live.com/op/embed.aspx?src=' . urlencode($url) . '&embedded=true';
                    } else {
                        $view_link = 'https://drive.google.com/viewerng/viewer?url=' . urlencode($url) . '&embedded=true&chrome=false';
                    }


                    if($settings['embedpress_document_viewer'] === 'custom')
                    {
                        if (Helper::is_file_url($url)) {
                            $view_link = '//view.officeapps.live.com/op/embed.aspx?src=' . urlencode($url) . '&embedded=true';
                        } else {
                            $view_link = 'https://drive.google.com/viewerng/viewer?url=' . urlencode($url) . '&embedded=true&chrome=false';
                        }
                    }
                    elseif($settings['embedpress_document_viewer'] === 'office')
                    {
                        $view_link = '//view.officeapps.live.com/op/embed.aspx?src=' . urlencode($url) . '&embedded=true';
                    }
                    elseif($settings['embedpress_document_viewer'] === 'google')
                    {
                        $view_link = '//docs.google.com/gview?embedded=true&url=' . urlencode($url);
                    }
    
                    $hostname = parse_url($url, PHP_URL_HOST);
                    $domain = implode(".", array_slice(explode(".", $hostname), -2));
    
                    if ($domain == "google.com") {
                        $view_link = $url . '?embedded=true';
                        if (strpos($view_link, '/presentation/')) {
                            $view_link = Helper::get_google_presentation_url($url);
                        }
                    }
    
                    $embed_content = '<div ' . $this->get_render_attribute_string('embedpres-pdf-render') . '>';
    
                    $is_powered_by = '';
                    if ($settings['embedpress_document_powered_by'] === 'yes') {
                        $is_powered_by = 'ep-powered-by-enabled';
                    }
    
                    $is_download_enabled = ' enabled-file-download';
                    if ($settings['doc_print_download'] !== 'yes') {
                        $is_download_enabled = '';
                    }
    
                    $file_extenstion = 'link';
                    if (!empty(Helper::is_file_url($url))) {
                        $file_extenstion = Helper::get_extension_from_file_url($url);
                    }

                    $is_masked = '';

                    if($settings['embedpress_document_viewer'] === 'custom')
                    {
                        $is_masked = 'ep-file-download-option-masked ';
                    }
    
                    $is_custom_theme = '';

                    if ($settings['embedpress_theme_mode'] == 'custom') {
                        $custom_color = sanitize_text_field($settings['embedpress_doc_custom_color']);
                                                
                        $is_custom_theme = 'data-custom-color="'.esc_attr($custom_color).'"';
                    }

                    $embed_content .= '<div class="'.esc_attr( $is_masked ).'ep-file-' . esc_attr($file_extenstion) . ' ' . $is_powered_by . '' . $is_download_enabled . '" data-theme-mode="' . esc_attr($settings['embedpress_theme_mode']) . '"' . $is_custom_theme . ' data-id="' . esc_attr($this->get_id()) . '">';

                    $sandbox = '';
                    if ($settings['doc_print_download'] === 'yes') {
                        $sandbox = 'sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"';
                    }
    
                    $embed_content .= '<iframe title="' . esc_attr(Helper::get_file_title($url)) . '" allowfullscreen="true"  mozallowfullscreen="true" webkitallowfullscreen="true" style="' . esc_attr($dimension) . '; max-width:100%;" src="' . esc_url($view_link) . '" ' . $sandbox . '>
                </iframe>';
    
                    if ($settings['embedpress_document_viewer'] === 'custom' && $settings['doc_print_download'] === 'yes' && (Helper::get_extension_from_file_url($url) === 'pptx' || Helper::get_extension_from_file_url($url) === 'ppt' || Helper::get_extension_from_file_url($url) === 'xls' || Helper::get_extension_from_file_url($url) === 'xlsx')) {
                        $embed_content .= '<div class="embed-download-disabled"></div>';
                    }
    
                    if (
                        $settings['doc_draw'] === 'yes' && 
                        isset($settings['embedpress_elementor_document_width']) && 
                        isset($settings['embedpress_elementor_document_height']) 
                        ) {
                        $embed_content .= '<canvas class="ep-doc-canvas" width="' . esc_attr($settings['embedpress_elementor_document_width']['size']) . '" height="' . esc_attr($settings['embedpress_elementor_document_height']['size']) . '" ></canvas>';
                    }
    
                    if ($settings['doc_print_download'] === 'yes' && Helper::get_extension_from_file_url($url) !== 'pptx') {
                        $embed_content .= '<div style="width: 40px; height: 40px; position: absolute; opacity: 0; right: 12px; top: 12px;"></div>';
                    }
    
                    if (!empty($settings['doc_toolbar']) && $settings['embedpress_document_viewer'] === 'custom') {
                        $embed_content .= '<div class="ep-external-doc-icons">';
    
                        if (empty(Helper::is_file_url($url))) {
                            $embed_content .= Helper::ep_get_popup_icon();
                        }
    
                        if (!empty(Helper::is_file_url($url))) {
                            if (!empty($settings['doc_print_download'])) {
                                $embed_content .= Helper::ep_get_print_icon();
                                $embed_content .= Helper::ep_get_download_icon();
                            }
                        }
                        if (!empty($settings['doc_draw'])) {
                            $embed_content .= Helper::ep_get_draw_icon();
                        }
                        if (!empty($settings['doc_fullscreen_mode'])) {
                            $embed_content .= Helper::ep_get_fullscreen_icon();
                            $embed_content .= Helper::ep_get_minimize_icon();
                        }
    
                        $embed_content .= '</div>';
                    }
                    $embed_content .= '</div>';
    
                    if ($settings['embedpress_document_powered_by'] === 'yes') {
                        $embed_content .= '<div>';
                        $embed_content .= sprintf('<p class="embedpress-el-powered">%s</p>', esc_html__('Powered By EmbedPress', 'embedpress'));
                        $embed_content .= '</div>';
                    }
    
                    $embed_content .= '</div>';
                }
            }
    
    
            ?>
            <div <?php echo $adsAtts; ?>>
    
                <div id="ep-elementor-content-<?php echo esc_attr($client_id) ?>" class="ep-elementor-content <?php if (!empty($settings['embedpress_doc_content_share'])) : echo esc_attr('position-' . $settings['embedpress_doc_content_share_position'] . '-wraper'); endif; ?> <?php echo  esc_attr($content_share_class . ' ' . $share_position_class . ' ' . $content_protection_class);  ?>">
                    <div id="<?php echo esc_attr($this->get_id()); ?>" class="ep-embed-content-wraper">
                        <?php
    
                        $content_id = $client_id;
                        if (
                            (empty($settings['embedpress_doc_lock_content']) || ($settings['embedpress_doc_protection_type'] == 'password' && empty($settings['embedpress_doc_lock_content_password'])) || $settings['embedpress_doc_lock_content'] == 'no') || 
                            ($settings['embedpress_doc_protection_type'] == 'password' && !empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct) ) || 
                            !apply_filters('embedpress/is_allow_rander', false) || 
                            ($settings['embedpress_doc_protection_type'] == 'user-role' && Helper::has_allowed_roles($embed_settings['userRole']))
                            ) {
    
                            if (!empty($settings['embedpress_doc_content_share'])) {
                                $embed_content .= Helper::embed_content_share($content_id, $embed_settings);
                            }
                            if (!empty($embed_content)) {
                                echo $embed_content;
                            }
                        } else {
                            if (!empty($settings['embedpress_doc_content_share'])) {
                                $embed_content .= Helper::embed_content_share($content_id, $embed_settings);
                            }
                            if ($settings['embedpress_doc_protection_type'] == 'password') {
                                do_action('embedpress/display_password_form', $client_id, $embed_content, $pass_hash_key, $embed_settings);
                            } else {
                                do_action('embedpress/content_protection_content', $client_id, $embed_settings['protectionMessage'],  $embed_settings['userRole']);
                            }
                        }
                        ?>
                    </div>
                </div>
                <?php
                    if (!empty($settings['adManager'])) {
                        $embed_content = apply_filters('embedpress/generate_ad_template', $embed_content, $client_id, $settings, 'elementor');
                    }
                ?>
            </div>
        </div>
    
    <?php
    }
    

    private function get_file_url()
    {
        $settings = $this->get_settings();
        $file_url = $settings['embedpress_document_type'] === 'url' ? esc_url($settings['embedpress_document_file_link']['url']) : esc_url($settings['embedpress_document_Uploader']['url']);
        return $file_url;
    }


    protected function render_editor_script( $id, $url )
    {
        ?>
        <script>
            (function ($) {
                'use strict';
                $(document).ready(function () {
                    var selector = $('.embedpress-embed-document-pdf');
                    let option = {
                        forceObject: false,
                    };
                    if (selector.length) {
                        PDFObject.embed("<?php echo $url; ?>", "<?php echo '.' . $id; ?>", option);
                    }
                });
            })(jQuery);
        </script>
        <?php
    }

}
