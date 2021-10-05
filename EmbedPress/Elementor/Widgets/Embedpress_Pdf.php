<?php

namespace EmbedPress\Elementor\Widgets;


use \Elementor\Controls_Manager as Controls_Manager;
use \Elementor\Modules\DynamicTags\Module as TagsModule;
use \Elementor\Widget_Base as Widget_Base;
use EmbedPress\Includes\Classes\Helper;
use EmbedPress\Includes\Traits\Branding;

( defined( 'ABSPATH' ) ) or die( "No direct script access allowed." );

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
        return esc_html__( 'EmbedPress PDF', 'embedpress' );
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
    
    protected function _register_controls()
    {
	    $this->pro_class = is_embedpress_pro_active() ? '': 'embedpress-pro-control';
	    $this->pro_text = is_embedpress_pro_active() ? '': '<sup class="embedpress-pro-label" style="color:red">'.__('Pro', 'embedpress').'</sup>';
        /**
         * EmbedPress Content Settings
         */
        $this->start_controls_section(
            'embedpress_pdf_content_settings',
            [
                'label' => esc_html__( 'Content Settings', 'embedpress' ),
            ]
        );
        
        $this->add_control(
            'embedpress_pdf_type',
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
            'embedpress_pdf_Uploader',
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
                ],
                'description' => __( 'Upload a file or pick one from your media library for embed. Supported File Type: PDF',
                    'embedpress' ),
                'condition'   => [
                    'embedpress_pdf_type' => 'file'
                ],
            ]
        );
        
        $this->add_control(
            'embedpress_pdf_file_link',
            [
                'label'         => __( 'URL', 'embedpress' ),
                'type'          => Controls_Manager::URL,
                'placeholder'   => __( 'https://your-link.com/file.pdf', 'embedpress' ),
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
                ],
                'render_type' => 'template',
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
                    '{{WRAPPER}} .embedpress-document-embed iframe'               => 'height: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'height: {{SIZE}}{{UNIT}};',
                ],
                'render_type' => 'template',
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
            'embedpress_pdf_powered_by',
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
				    'description' => '<span class="pro-feature"> Get the  <a href="https://wpdeveloper.net/in/upgrade-embedpress" target="_blank">Pro version</a> for more provider support and customization options.</span>',
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
        $url = $this->get_file_url();
        $id = 'embedpress-pdf-' . $this->get_id();
        $dimension = "width: {$settings['embedpress_elementor_document_width']['size']}px;height: {$settings['embedpress_elementor_document_height']['size']}px";
        $this->add_render_attribute( 'embedpres-pdf-render', [
            'class'     => ['embedpress-embed-document-pdf', $id],
            'data-emid' => $id
        ] );
        $this->add_render_attribute( 'embedpress-document', [
            'class' => ['embedpress-document-embed', 'ep-doc-'.md5( $id), 'ose-document']
        ] );
        ?>
        <div <?php echo $this->get_render_attribute_string( 'embedpress-document' ); ?> style="<?php echo esc_attr( $dimension); ?>; max-width:100%; display: inline-block">
	        <?php
            do_action( 'embedpress_pdf_after_embed',  $settings, $url, $id, $this);
	        ?>
            <?php if ( $url != '' ) {
                if ( $this->is_pdf( $url ) && ! $this->is_external_url( $url)  ) {
                    $this->add_render_attribute( 'embedpres-pdf-render', 'data-emsrc', $url );
	                $renderer = Helper::get_pdf_renderer();
	                $src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . $url;
                    ?>
                    <iframe style="<?php echo esc_attr( $dimension); ?>; max-width:100%; display: inline-block"  src="<?php echo esc_attr(  $src); ?>" <?php $this->get_render_attribute_string( 'embedpres-pdf-render' ); ?>
                            frameborder="0"></iframe>
                    <?php

                } else {
                    $view_link = 'https://docs.google.com/viewer?url=' . $url . '&embedded=true';
                    ?>
                        <div>
                            <iframe allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="<?php echo esc_attr( $dimension); ?>; max-width:100%;" src="<?php echo esc_url( $view_link); ?>" <?php $this->get_render_attribute_string( 'embedpres-pdf-render' ); ?>></iframe>
                        </div>

                    <?php
                }
	            if ( $settings[ 'embedpress_pdf_powered_by' ] === 'yes' ) {

                    printf( '<p class="embedpress-el-powered">%s</p>', __( 'Powered By EmbedPress', 'embedpress' ) );
                }
            }
            ?>
        </div>
        
        <?php
    }
    
    private function get_file_url()
    {
        $settings = $this->get_settings();
        return $settings[ 'embedpress_pdf_type' ] === 'url' ? $settings[ 'embedpress_pdf_file_link' ][ 'url' ] : $settings[ 'embedpress_pdf_Uploader' ][ 'url' ];
    }

	protected function is_external_url( $url ) {
        return strpos( $url, get_site_url()) === false;
    }
}
