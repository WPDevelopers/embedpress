<?php

namespace EmbedPress\Elementor\Widgets;


use \Elementor\Controls_Manager as Controls_Manager;
use Elementor\Group_Control_Image_Size;
use \Elementor\Modules\DynamicTags\Module as TagsModule;
use \Elementor\Widget_Base as Widget_Base;

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
        return 'eicon-frame-expand';
    }
    
    /**
     * Get widget keywords.
     *
     * Retrieve the list of keywords the widget belongs to.
     *
     * @return array Widget keywords.
     * @since 2.4.1
     * @access public
     *
     */
    public function get_keywords()
    {
        return ['embedpress', 'audio', 'video', 'map', 'youtube', 'vimeo', 'wistia'];
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
                'description' => __( 'Please upload pdf,doc,docs,ppt,xls for embed', 'embedpress' ),
            ]
        );
        
        
        $this->end_controls_section();
        
        $this->start_controls_section(
            'embedpress_document_style_section',
            [
                'label' => __( 'Style', 'elementor' ),
                'tab'   => Controls_Manager::TAB_STYLE,
            ]
        );
        
        
        $this->end_controls_section();
        
        
    }
    
    private function is_pdf( $url )
    {
        $arr = explode('.',$url);
        return end($arr) === 'pdf';
    }
    
    protected function render()
    {
        $settings = $this->get_settings();
        $url = $settings[ 'embedpress_document_Uploader' ][ 'url' ];
        
        if ( $this->is_pdf( $url ) ) {
            $this->add_render_attribute( 'embedpres-pdf-render', [
               'class' =>  ['embedpress-embed-document-pdf','embedpress-pdf-'.$this->get_id()],
               'data-emid' =>  'embedpress-pdf-'.$this->get_id(),
               'data-emsrc' =>  $url,
            ]);
            $content = "<div ".$this->get_render_attribute_string( 'embedpres-pdf-render' )."></div>";
        }else{
            $view_link = 'https://docs.google.com/viewer?url='.$url.'&embedded=true';
            $content = '<iframe style="width:600px;height:600px" src="'.$view_link.'"/>';
        }
        echo $content;
    }
    
    
}
