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
            .elementor-panel .plugin-rating {
                font-family: system-ui;
                padding: 15px;
                padding-top: 0;
            }
            
            .elementor-panel .rating-chat-content {
                border-radius: 4px;
                border-width: 0.6px;
                gap: 12px;
                padding: 15px;
                background-color: #FDFAFF;
                position: relative;
                display: flex;
                flex-direction: column;
                border: 0.6px solid #ECEFF5;
                overflow: hidden;
            }   

            .rating-chat-content::after {
                content: "";
                position: absolute;
                top: -65px;
                right: -65px;
                width: 120px;
                height: 120px;
                background: radial-gradient(circle, rgb(121 62 255 / 14%) 20%, transparent 70%);
                border-radius: 50%;
            }


            /* .rating-chat-content::after{
                content: '';
                background: linear-gradient(175.54deg, rgba(81, 241, 255, 0.117) 19.13%, rgba(71, 58, 217, 0.132319) 22.57%, rgba(127, 22, 255, 0.2085) 39.66%, rgba(17, 1, 35, 0.3) 60.19%);
                transform: rotate(60deg);
                top: 0;
                right: 0;
                z-index: 1212;
                width: 118.63550843535211px;
                height: 208.14842708207777px;
                position: absolute;
                transform: rotate(60deg);
                backdrop-filter: blur(20px);
            } */


            .elementor-panel .plugin-rating h4 {
                font-size: 15px;
                font-weight: 500;
            }

            .elementor-panel .plugin-rating .stars {
                display: flex;
                gap: 5px;
                margin-bottom: 10px;
            }

            .elementor-panel .plugin-rating .stars .star {
                color: #b1b8c2;
                cursor: pointer;
                width: 20px;
                height: 20px;
            }

            .elementor-panel .plugin-rating .thank-you-msg-container {
                padding: 15px;
                border-radius: 8px;
                text-align: left;
                background: linear-gradient(181.32deg, #f5f3ff 1.12%, #ffffff 98.95%);
                border: 0.6px solid #f4efec;
                position: relative;
            }

            .elementor-panel .plugin-rating .thank-you-msg-container span.close-icon {
                position: absolute;
                top: 8px;
                right: 8px;
            }

            .elementor-panel .plugin-rating .thank-you-msg-container span.close-icon svg {
                height: 12px;
                width: 12px;
                cursor: pointer;
            }

            /* .elementor-panel .plugin-rating .tankyou-msg-container span.close-icon {
                position: absolute;
                top: 8px;
                right: 8px;
            } */

            .elementor-panel .plugin-rating .thank-you-msg-container p.thank-you-message {
                font-weight: 400;
                color: #232c39;
                margin-bottom: 8px;
                font-size: 12px;
            }

            .elementor-panel .plugin-rating .thank-you-msg-container span.undo-review {
                color: #5b4e96;
                font-weight: 400;
                text-decoration: none;
                cursor: pointer!important;
            }

            .elementor-panel .plugin-rating .chat-button {
                background-color: #5b4e96;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                font-weight: 400;
                width: 100%;
            }

            .elementor-panel .plugin-rating .chat-button svg {
                width: 18px;
                height: 18px;
            }

            .elementor-panel .plugin-rating .chat-button:hover {
                background-color: #4b3293;
            }

            .elementor-panel .plugin-rating .upgrade-box {
                padding: 15px;
                margin-top: 20px;
                border-radius: 8px;
                text-align: left;
                background: linear-gradient(181.32deg, #fffbf8 1.12%, #ffffff 98.95%);
                border: 0.6px solid #f4efec;
            }

            .elementor-panel .plugin-rating .upgrade-box h5 {
                font-size: 14px;
                margin-top: 0;
                margin-bottom: 10px;
                color: #1d2939;
                font-weight: 600;
            }

            .elementor-panel .plugin-rating .upgrade-box p {
                font-size: 12px;
                color: #232c39;
                margin-bottom: 12px;
                font-weight: 400;
                line-height: 1.6;
            }

            .elementor-panel .plugin-rating .upgrade-box .upgrade-link {
                color: #ec6e00;
                font-weight: 400;
                text-decoration: none;
            }

            .elementor-panel .plugin-rating .upgrade-box .upgrade-link:hover {
                text-decoration: underline;
            }

        </style>
    
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                if (typeof jQuery === 'undefined') {
                    console.error("❌ jQuery is not loaded!");
                    return;
                }

                jQuery(document).ready(function ($) {
                    console.log("✅ jQuery is loaded and ready!");

                    let message = ""; // Store the thank-you message state
                    let rating = 0; // Store rating state
                    let targetNode = null; // Store reference to the Elementor controls section

                    function handleRating(selectedRating) {

                        console.log(selectedRating);
                        
                        rating = selectedRating;

                        $(".star").each(function () {
                            const starValue = $(this).data("rating");
                            $(this).attr("fill", starValue <= rating ? "#FFD700" : "#B1B8C2"); // Gold for selected, Grey for unselected
                        });

                        // Delay message update by 2 seconds
                        setTimeout(() => {
                            message = `Thanks for rating ${rating} stars!`;
                            renderUpsellSection();
                        }, 2000);
                    }

                    function setMessage(value) {
                        message = value;
                        renderUpsellSection();
                    }

                    function renderUpsellSection() {
                        if (!targetNode) return;

                        $(".plugin-rating").remove(); // Remove previous upsell section

                        let upsellHtml = `
                            <div class="plugin-rating">
                                <div class="rating-chat-content">
                                    ${message === "" ? `
                                        <h4>Share your feeling</h4>
                                        <div class="stars">
                                            ${[1, 2, 3, 4, 5].map(i => `
                                                <svg class="star" data-rating="${i}" width="20" height="18.667" viewBox="0 0 20 18.667" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#a)">
                                                        <path d="m7.3 5.709-4.963.72-.087.017a.777.777 0 0 0-.343 1.309l3.595 3.499-.848 4.943-.009.087a.777.777 0 0 0 1.139.733l4.437-2.333 4.428 2.333.077.036a.777.777 0 0 0 1.053-.855l-.849-4.944 3.596-3.5.061-.067a.777.777 0 0 0-.493-1.259l-4.961-.72-2.218-4.495a.777.777 0 0 0-1.396 0z" fill="${i <= rating ? '#FFD700' : '#B1B8C2'}"/>
                                                    </g>
                                                    <defs><clipPath id="a"><path fill="#fff" d="M.888 0h18.667v18.667H.888z"/></clipPath></defs>
                                                </svg>
                                            `).join('')}
                                        </div>
                                    ` : `
                                        <div class="thank-you-msg-container">
                                            <p class="thank-you-message">${message}</p>
                                            <span class="undo-review">Undo</span>
                                            <span class="close-icon">
                                                <svg class="close-review" width="16" height="16" viewBox="0 0 0.48 0.48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M.106.106a.02.02 0 0 1 .028 0L.24.212.346.106a.02.02 0 1 1 .028.028L.268.24l.106.106a.02.02 0 0 1-.028.028L.24.268.134.374A.02.02 0 0 1 .106.346L.212.24.106.134a.02.02 0 0 1 0-.028" fill="#0D0D0D" />
                                                </svg>
                                            </span>
                                        </div>
                                    `}
                                    <p>We are here to help</p>
                                    <a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank" class="chat-button">Initiate Chat</a>
                                </div>
                                <div class="upgrade-box">
                                    <h5>Want Advanced Features?</h5>
                                    <p>Get more powerful widgets & extensions to elevate your Elementor website</p>
                                    <a href="https://embedpress.com/#pricing" target="_blank" class="upgrade-link">Upgrade to PRO</a>
                                </div>
                            </div>
                        `;

                        $(upsellHtml).insertAfter(targetNode);

                        // Attach click event to stars
                        $(".star").on("click", function () {
                            let selectedRating = $(this).data("rating");
                            handleRating(selectedRating);
                        });

                        // Attach undo event
                        $(".undo-review").on("click", function () {
                            setMessage(""); // Reset message
                        });

                        // Attach close event
                        $(".close-review").on("click", function () {
                            $(".thank-you-msg-container").remove(); // Remove the upsell section
                        });
                    }

                    function addUpsellSection(node) {
                        if (!node) return;

                        targetNode = node; // Store reference to the correct node
                        if (!$(".plugin-rating").length) {
                            console.log("✅ Elementor Panel Found! Adding Upsell Section...");
                            renderUpsellSection();
                        }
                    }

                    // MutationObserver to detect Elementor panel changes
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            mutation.addedNodes.forEach((node) => {
                                if ($(node).hasClass("elementor-controls-stack")) {
                                    const elementorControls = node.querySelector("#elementor-controls");
                                    if (elementorControls) {
                                        addUpsellSection(elementorControls);
                                    }
                                }
                            });
                        });
                    });

                    // Start observing Elementor panel for changes
                    const elementorPanel = document.querySelector(".elementor-panel");
                    if (elementorPanel) {
                        observer.observe(elementorPanel, {
                            childList: true,
                            subtree: true,
                        });
                        console.log("🔍 Observer started on Elementor Panel");
                    } else {
                        console.log("❌ Elementor panel not found, observer not started.");
                    }
                });

                // Expose functions globally for event handlers
                window.handleRating = handleRating;
                window.setMessage = setMessage;
            });


        </script>

        <?php
    }
    
}
