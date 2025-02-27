<?php

namespace EmbedPress\Elementor;


(defined('ABSPATH')) or die("No direct script access allowed.");

use EmbedPress\Compatibility;
use EmbedPress\Elementor\Widgets\Embedpress_Calendar;
use EmbedPress\Elementor\Widgets\Embedpress_Document;
use EmbedPress\Elementor\Widgets\Embedpress_Elementor;
use EmbedPress\Elementor\Widgets\Embedpress_Pdf;

class Embedpress_Elementor_Integration
{

    /**
     * @since  2.4.2
     */
    public function init()
    {
        $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
        $e_blocks = isset($elements['elementor']) ? (array) $elements['elementor'] : [];
        if (!empty($e_blocks['embedpress']) || !empty($e_blocks['embedpress-document']) || !empty($e_blocks['embedpress-pdf'])) {
            add_action('elementor/frontend/after_enqueue_styles', [$this, 'embedpress_enqueue_style']);
            add_action('elementor/editor/before_enqueue_styles', array($this, 'editor_enqueue_style'));
            add_action('elementor/editor/before_enqueue_scripts', array($this, 'editor_enqueue_scripts'));
            add_action('elementor/elements/categories_registered', array($this, 'register_widget_categories'));
            add_action('elementor/widgets/widgets_registered', array($this, 'register_widget'));
            add_action('elementor/widgets/register', array($this, 'register_widget'));
            add_filter('oembed_providers', [$this, 'addOEmbedProviders']);


            add_action('elementor/editor/after_enqueue_scripts', [$this, 'elementor_upsale']);
        }
    }

    /**
     * Add elementor category
     *
     * @since 2.4.3
     */
    public function register_widget_categories($elements_manager)
    {
        $elements_manager->add_category(
            'embedpress',
            [
                'title' => __('EmbedPress', 'embedpress'),
                'icon'  => 'font',
            ],
            1
        );
    }

    /**
     * Load elementor widget
     *
     * @param $widgets_manager
     * @throws \Exception
     * @since  2.4.2
     */
    public function register_widget($widgets_manager)
    {
        if (
            did_action('elementor/widgets/widgets_registered') &&
            did_action('elementor/widgets/register') // doing action
        ) {
            return;
        }

        $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
        $e_blocks = isset($elements['elementor']) ? (array) $elements['elementor'] : [];

        if (method_exists($widgets_manager, 'register')) {
            if (!empty($e_blocks['embedpress'])) {
                $widgets_manager->register(new Embedpress_Elementor);
            }
            if (!empty($e_blocks['embedpress-document'])) {
                $widgets_manager->register(new Embedpress_Document);
            }

            if (!empty($e_blocks['embedpress-pdf'])) {
                $widgets_manager->register(new Embedpress_Pdf);
            }
            if (!empty($e_blocks['embedpress-calendar'])) {
                $widgets_manager->register(new Embedpress_Calendar);
            }
        } else {
            if (!empty($e_blocks['embedpress'])) {
                $widgets_manager->register_widget_type(new Embedpress_Elementor);
            }
            if (!empty($e_blocks['embedpress-document'])) {
                $widgets_manager->register_widget_type(new Embedpress_Document);
            }

            if (!empty($e_blocks['embedpress-pdf'])) {
                $widgets_manager->register_widget_type(new Embedpress_Pdf);
            }
            if (!empty($e_blocks['embedpress-calendar'])) {
                $widgets_manager->register_widget_type(new Embedpress_Calendar);
            }
        }
    }

    /**
     * Enqueue elementor assets
     * @since  2.4.3
     */
    public function embedpress_enqueue_style()
    {
        wp_register_style(
            'embedpress-elementor-css',
            EMBEDPRESS_URL_ASSETS . 'css/embedpress-elementor.css',
            false,
            EMBEDPRESS_VERSION
        );
    }

    public function editor_enqueue_style()
    {
        wp_enqueue_style(
            'embedpress-el-icon',
            EMBEDPRESS_URL_ASSETS . 'css/el-icon.css',
            false,
            EMBEDPRESS_VERSION
        );
    }

    public function editor_enqueue_scripts()
    { }

    public function addOEmbedProviders($providers)
    {
        if (Compatibility::isWordPress5() && !Compatibility::isClassicalEditorActive()) {
            unset($providers['#https?://(.+\.)?wistia\.com/medias/.+#i'], $providers['#https?://(.+\.)?fast\.wistia\.com/embed/medias/.+#i\.jsonp']);
        }

        return $providers;
    }

    public function elementor_upsale() {
        ?>
        <style>
            .embedpress-upsell-section {
                background: #1e1e1e;
                padding: 15px;
                border-radius: 10px;
                margin-top: 15px;
                text-align: center;
                color: white;
            }
    
            .embedpress-upsell-section h4 {
                margin-bottom: 10px;
                font-size: 16px;
            }
    
            .stars svg {
                cursor: pointer;
                margin: 0 3px;
                transition: fill 0.3s ease;
            }
    
            .chat-button {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #0073aa;
                color: white;
                border: none;
                padding: 10px;
                width: 100%;
                border-radius: 5px;
                margin-top: 10px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s;
            }
    
            .chat-button:hover {
                background: #005a87;
            }
    
            .upgrade-box {
                margin-top: 10px;
                padding: 10px;
                background: #2a2a2a;
                border-radius: 5px;
            }
    
            .upgrade-link {
                display: block;
                background: #ff4d4d;
                color: white;
                padding: 8px;
                margin-top: 8px;
                border-radius: 5px;
                text-decoration: none;
                transition: background 0.3s;
            }
    
            .upgrade-link:hover {
                background: #e03e3e;
            }
        </style>
    
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                if (typeof jQuery === 'undefined') {
                    console.error("jQuery is not loaded!");
                    return;
                }
                
                jQuery(document).ready(function ($) {
                console.log("jQuery is loaded and ready!");

                function addUpsellSection(targetNode) {
                    if (!targetNode) return;

                    if (!$(targetNode).find('.embedpress-upsell-section').length) {
                        console.log("Elementor Panel Found!");

                        let upsellHtml = `
                            <div class="embedpress-upsell-section">
                                <h4>⭐ Share Your Experience</h4>
                                <div class="stars" id="embedpress-rating">
                                    ${[...Array(5)].map((_, i) => `<svg class="star" data-rate="${i + 1}" width="18" height="18" viewBox="0 0 14 14" fill="#B1B8C2" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.80913 4.28162L1.08747 4.82121L1.02155 4.83462C0.921766 4.86111 0.830798 4.91361 0.757938 4.98676C0.685079 5.0599 0.632937 5.15107 0.606838 5.25096C0.580738 5.35085 0.581617 5.45588 0.609384 5.55531C0.637151 5.65475 0.690811 5.74504 0.764885 5.81695L3.46105 8.44137L2.82522 12.1485L2.81763 12.2126C2.81153 12.3158 2.83296 12.4188 2.87973 12.511C2.9265 12.6032 2.99694 12.6813 3.08383 12.7373C3.17072 12.7934 3.27094 12.8253 3.37422 12.8299C3.47751 12.8344 3.58015 12.8114 3.67163 12.7633L7.00013 11.0133L10.3211 12.7633L10.3794 12.7901C10.4757 12.828 10.5803 12.8397 10.6826 12.8238C10.7848 12.808 10.881 12.7652 10.9613 12.6999C11.0416 12.6345 11.103 12.5491 11.1394 12.4522C11.1757 12.3553 11.1856 12.2504 11.168 12.1485L10.5316 8.44137L13.229 5.81637L13.2745 5.76679C13.3395 5.68674 13.3821 5.59089 13.398 5.489C13.4139 5.38712 13.4025 5.28284 13.3649 5.1868C13.3274 5.09075 13.2651 5.00637 13.1843 4.94225C13.1036 4.87813 13.0073 4.83657 12.9052 4.82179L9.18355 4.28162L7.51989 0.909955C7.47175 0.812267 7.39722 0.730005 7.30475 0.672482C7.21227 0.61496 7.10554 0.584473 6.99663 0.584473C6.88773 0.584473 6.781 0.61496 6.68852 0.672482C6.59605 0.730005 6.52152 0.812267 6.47338 0.909955L4.80913 4.28162Z"/>
                                    </svg>`).join('')}
                                </div>
                                <button class="chat-button">💬 Initiate Chat</button>
                                <div class="upgrade-box">
                                    <h5>🚀 Want Advanced Features?</h5>
                                    <p>Get more powerful widgets & extensions to elevate your Elementor website.</p>
                                    <a href="https://embedpress.com/#pricing" target="_blank" class="upgrade-link">Upgrade to PRO</a>
                                </div>
                            </div>
                        `;

                        $(targetNode).append(upsellHtml);
                        console.log("Upsell section added!");
                    }
                }

                // **Using MutationObserver to detect when the element appears**
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if ($(node).hasClass('elementor-control-embedpress_pro_section')) {
                                console.log("✅ embedpress_pro_section detected!");
                                addUpsellSection(node);
                            }
                        });
                    });
                });

                // **Start observing Elementor panel for changes**
                const elementorPanel = document.querySelector('.elementor-panel');
                if (elementorPanel) {
                    observer.observe(elementorPanel, {
                        childList: true,
                        subtree: true
                    });
                    console.log("🔍 Observer started on Elementor Panel");
                } else {
                    console.log("❌ Elementor panel not found, observer not started.");
                }
            });


            });
        </script>
        <?php
    }
    
}
