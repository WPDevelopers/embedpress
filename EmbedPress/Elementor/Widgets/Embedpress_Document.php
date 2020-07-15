<?php

namespace EmbedPress\Elementor\Widgets;


use \Elementor\Controls_Manager as Controls_Manager;
use \Elementor\Modules\DynamicTags\Module as TagsModule;
use \Elementor\Widget_Base as Widget_Base;
use \Elementor\Plugin;

( defined( 'ABSPATH' ) ) or die( "No direct script access allowed." );

class Embedpress_Document extends Widget_Base
{
    
    public function get_name()
    {
        return 'embedpres_document';
    }
    
    public function get_title()
    {
        return esc_html__( 'EmbedPress Document', 'embedoress' );
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
        return ['embedpress', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'embedpress-document'];
    }
    
    protected function _register_controls()
    {
        
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
                    '{{WRAPPER}} .embedpress-document-embed iframe'               => 'width: {{SIZE}}{{UNIT}} !important;',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'width: {{SIZE}}{{UNIT}} !important;',
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
                    '{{WRAPPER}} .embedpress-document-embed iframe'               => 'height: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .embedpress-document-embed .pdfobject-container' => 'height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );
        
        $this->add_control(
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
                'default' => 'center',
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
        
        
        $this->end_controls_section();
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
            'class' => ['embedpress-document-embed']
        ] );
        ?>
        <div <?php echo $this->get_render_attribute_string( 'embedpress-document' ); ?>>
            <?php if ( $url != '' ) {
                if ( $this->is_pdf( $url ) ) {
                    $this->add_render_attribute( 'embedpres-pdf-render', 'data-emsrc', $url );
                    ?>
                    <div <?php echo $this->get_render_attribute_string( 'embedpres-pdf-render' ); ?>></div>
                    <?php
                    
                    if ( Plugin::$instance->editor->is_edit_mode() ) {
                        $this->render_editor_script( $id, $url );
                    }
                    
                } else {
                    $view_link = 'https://docs.google.com/viewer?url=' . $url . '&embedded=true';
                    ?>
                    <iframe allowfullscreen="true"
                            mozallowfullscreen="true" webkitallowfullscreen="true" style="<?php echo $dimension; ?>" src="<?php echo $view_link; ?>"/>
                    <?php
                    
                }
                if ( $settings[ 'embedpress_document_powered_by' ] === 'yes' ) {
                    printf( '<p class="embedpress-el-powered">%s</p>', __( 'Powered By EmbedPress', 'embedpress' ) );
                }
            } ?>

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
                    if (selector.length) {
                        PDFObject.embed("<?php echo $url; ?>", "<?php echo '.' . $id; ?>");
                    }
                });
            })(jQuery);
        </script>
        <?php
    }
}
