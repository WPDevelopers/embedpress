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
        return 'embedpress_document';
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
	    $this->pro_class = is_embedpress_pro_active() ? '': 'embedpress-pro-control';
	    $this->pro_text = is_embedpress_pro_active() ? '': '<sup class="embedpress-pro-label" style="color:red">'.__('Pro', 'embedpress').'</sup>';
        /**
         * EmbedPress Content Settings
         */
        $this->start_controls_section(
            'embedpress_document_content_settings',
            [
                'label' => esc_html__( 'Content Settings', 'embedpress' ),
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
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
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
                'default'       => [
                    'url' => ''
                ],
                'condition'     => [
                    'embedpress_document_type' => 'url'
                ],
            ]
        );

        $this->add_control(
            'embedpress_doc_lock_content',
            [
                'label'        => sprintf(__('Lock Content %s', 'embedpress'), $this->pro_text),
                'type'         => Controls_Manager::SWITCHER,
                'label_block'  => false,
                'return_value' => 'yes',
                'default'      => 'no',
                'classes'     => $this->pro_class,
            ]
        );

        $this->add_control(
            'embedpress_doc_lock_content_password',
            [
                'label'       => __('Set Password', 'embedpress'),
                'type'        => Controls_Manager::TEXT,
                'default'    => '12345',
                'label_block' => false,
                'condition'   => [
                    'embedpress_doc_lock_content' => 'yes'
                ]
            ]
        );

        $this->add_control(
			'embedpress_doc_content_share',
			[
				'label'        => __('Enable Content Share', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
			]
		);
        $this->add_control(
            'embedpress_doc_content_share_position',
            [
                'label'   => __('Position', 'embedpress'),
                'type'    => Controls_Manager::SELECT,
                'default' => 'right',
                'options' => [
                    'top'        => __('Top', 'embedpress'),
                    'right' => __('Right', 'embedpress'),
                    'bottom'    => __('Bottom', 'embedpress'),
                    'left'  => __('Left', 'embedpress'),
                ],
                'condition'   => [
					'embedpress_doc_content_share' => 'yes'
				]
            ]
        );

        $this->add_control(
            'embedpress_doc_content_title',
            [
                'label'   => __('Title', 'embedpress'),
                'type'    => Controls_Manager::TEXT,
                'placeholder' => 'Enter share title',
                'condition'   => [
					'embedpress_doc_content_share' => 'yes'
				]
            ]
        );
        $this->add_control(
            'embedpress_doc_content_descripiton',
            [
                'label'   => __('Description', 'embedpress'),
                'type'    => Controls_Manager::TEXTAREA,
                'placeholder' => 'Enter share description',
                'condition'   => [
					'embedpress_doc_content_share' => 'yes'
				]
            ]
        );

        $this->add_control(
			'embedpress_doc_content_share_custom_thumbnail',
			[
				'label' => esc_html__( 'Thumbnail', 'embedpress' ),
				'type' => \Elementor\Controls_Manager::MEDIA,
				'default' => [
					'url' => \Elementor\Utils::get_placeholder_image_src(),
				],
                'condition'   => [
					'embedpress_doc_content_share' => 'yes'
				]
			]
		);

        $this->add_control(
            'embedpress_elementor_document_width',
            [
                'label'     => __( 'Width', 'embedpress' ),
                'type'      => Controls_Manager::SLIDER,
                'separator' => 'before',
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
                    '{{WRAPPER}} .embedpress-document-embed iframe'               => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
                    '{{WRAPPER}} .embedpress-document-embed'                      => 'width: {{SIZE}}{{UNIT}} !important; max-width: 100%',
                ],
            ]
        );

        $this->add_control(
            'embedpress_elementor_document_height',
            [
                'label'     => __( 'Height', 'embedpress' ),
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
                    '{{WRAPPER}}'               => 'height: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .embedpress-document-embed iframe'               => 'height: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'height: {{SIZE}}{{UNIT}};',
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

	    if (! is_embedpress_pro_active()) {
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

    private function is_pdf( $url )
    {
        $arr = explode( '.', $url );
        return end( $arr ) === 'pdf';
    }

    protected function render()
    {
        $settings = $this->get_settings();
        $client_id = $this->get_id();
        $pass_hash_key = md5($settings['embedpress_doc_lock_content_password']);
        $url = $this->get_file_url();
        $id = 'embedpress-pdf-' . $this->get_id();
        $dimension = "width: {$settings['embedpress_elementor_document_width']['size']}px;height: {$settings['embedpress_elementor_document_height']['size']}px";
        $this->add_render_attribute( 'embedpres-pdf-render', [
            'class'     => ['embedpress-embed-document-pdf', $id],
            'data-emid' => $id
        ] );

        Helper::get_source_data(md5($this->get_id()).'_eb_elementor', $url, 'elementor_source_data', 'elementor_temp_source_data');

        $this->add_render_attribute( 'embedpress-document', [
            'class' => ['embedpress-document-embed', 'ep-doc-'.md5( $id), 'ose-document']
        ] );

        $embed_settings =  [];
		$embed_settings['customThumbnail'] = !empty($settings['embedpress_doc_content_share_custom_thumbnail']['url']) ? $settings['embedpress_doc_content_share_custom_thumbnail']['url'] : '';

		$embed_settings['customTitle'] = !empty($settings['embedpress_doc_content_title']) ? $settings['embedpress_doc_content_title'] : Helper::get_file_title($url);

        $embed_settings['customDescription'] = !empty($settings['embedpress_doc_content_descripiton']) ? $settings['embedpress_doc_content_descripiton'] : Helper::get_file_title($url);

		$embed_settings['sharePosition'] = !empty($settings['embedpress_doc_content_share_position']) ? $settings['embedpress_doc_content_share_position'] : 'right';

        
        ?>
        

        <?php
            $embed_content = '<div ' . $this->get_render_attribute_string( 'embedpress-document' ) . ' style="' . esc_attr( $dimension) . '; max-width:100%; display: inline-block">';
            $embed_content .= '<?php do_action( \'embedpress_document_after_embed\',  $settings, $url, $id, $this); ?>';
            if ( $url != '' ) {
                if ( $this->is_pdf( $url ) ) {
                    $this->add_render_attribute( 'embedpres-pdf-render', 'data-emsrc', $url );
                    $embed_content .= '<div ' . $this->get_render_attribute_string( 'embedpres-pdf-render' ) . '></div>';

                    if ( Plugin::$instance->editor->is_edit_mode() ) {
                        $embed_content .= $this->render_editor_script( $id, $url );
                    }

                } else {
                    $view_link = '//view.officeapps.live.com/op/embed.aspx?src=' . $url . '&embedded=true';
                    $embed_content .= '<div><iframe title="' . esc_attr( Helper::get_file_title($url) ) . '" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="' . esc_attr( $dimension ) . '; max-width:100%;" src="' . esc_url( $view_link ) . '"></iframe></div>';
                }
                if ( $settings[ 'embedpress_document_powered_by' ] === 'yes' ) {
                    $embed_content .= sprintf( '<p class="embedpress-el-powered">%s</p>', __( 'Powered By EmbedPress', 'embedpress' ) );
                }
            }
            $embed_content .= '</div>';

            ?>
            <div id="ep-elementor-content-<?php echo esc_attr($client_id) ?>" class="ep-elementor-content <?php if(!empty($settings['embedpress_doc_content_share'])) : echo esc_attr( 'position-'.$settings['embedpress_doc_content_share_position'].'-wraper' ); endif; ?>">
                <div id="<?php echo esc_attr( $this->get_id() ); ?>">
                <?php
                    if ((empty($settings['embedpress_doc_lock_content']) || $settings['embedpress_doc_lock_content'] == 'no') || (!empty(Helper::is_password_correct($client_id)) && ($settings['embedpress_doc_lock_content_password'] === $_COOKIE['password_correct_' . $client_id]))) {
                        echo $embed_content;
                        if(!empty($settings['embedpress_doc_content_share'])){
                            $content_id = $client_id;
                            Helper::embed_content_share($content_id, $embed_settings);
                        }
                    } else {
                        Helper::display_password_form($client_id, $embed_content, $pass_hash_key);
                    }
                ?>
                </div>
            </div>

        <?php
    }

    private function get_file_url()
    {
        $settings = $this->get_settings();
        return $settings[ 'embedpress_document_type' ] === 'url' ? $settings[ 'embedpress_document_file_link' ][ 'url' ] : $settings[ 'embedpress_document_Uploader' ][ 'url' ];
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
