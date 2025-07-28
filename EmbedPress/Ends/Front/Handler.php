<?php

namespace EmbedPress\Ends\Front;

use EmbedPress\Core;
use EmbedPress\Ends\Back\Handler as BackEndHandler;
use EmbedPress\Ends\Handler as EndHandlerAbstract;
use EmbedPress\Shortcode;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * The public-facing functionality of the plugin.
 * Defines the plugin name, version, and enqueue the public-specific stylesheets and scripts.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Ends/Front
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Handler extends EndHandlerAbstract
{
    /**
     * Method that register all stylesheets for the public area.
     *
     * @since   1.0.0
     * @static
     *
     * @return  void
     */


    public static function enqueueStyles()
    {
        wp_register_style('embedpress-style', EMBEDPRESS_URL_ASSETS . 'css/embedpress.css', [], EMBEDPRESS_PLUGIN_VERSION);
    }

    public function enqueueScripts()
    {

        $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
        $g_elementor = isset($elements['elementor']) ? (array) $elements['elementor'] : [];
        $g_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];

        // register style
        wp_register_style('plyr', EMBEDPRESS_URL_ASSETS . 'css/plyr.css');
        wp_register_style('cg-carousel', EMBEDPRESS_URL_ASSETS . 'css/carousel.min.css');

        wp_register_script(
            'embedpress-pdfobject',
            EMBEDPRESS_URL_ASSETS . 'js/pdfobject.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        wp_register_script(
            'plyr.polyfilled',
            EMBEDPRESS_URL_ASSETS . 'js/plyr.polyfilled.js',
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );
        wp_register_script(
            'initplyr',
            EMBEDPRESS_URL_ASSETS . 'js/initplyr.js',
            ['plyr.polyfilled'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        wp_register_script(
            'vimeo-player',
            EMBEDPRESS_URL_ASSETS . 'js/vimeo-player.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        $dependencies = ['jquery'];

        wp_register_script(
            'embedpress-front',
            EMBEDPRESS_URL_ASSETS . 'js/front.js',
            $dependencies,
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        wp_register_script(
            'embedpress-google-photos-album',
            EMBEDPRESS_URL_ASSETS . 'js/embed-ui.min.js',
            $dependencies,
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        wp_register_script(
            'embedpress-remove-round-button',
            EMBEDPRESS_URL_ASSETS . 'js/remove-round-button.js',
            ['embedpress-google-photos-album'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        wp_register_script(
            'embedpress-ads',
            EMBEDPRESS_URL_ASSETS . 'js/ads.js',
            ['jquery', 'wp-data'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );


        wp_register_script(
            'embedpress_documents_viewer_script',
            EMBEDPRESS_URL_ASSETS . 'js/documents-viewer-script.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        
        wp_register_script(
            'cg-carousel',
            EMBEDPRESS_URL_ASSETS . 'js/carousel.min.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        wp_register_script(
            'init-carousel',
            EMBEDPRESS_URL_ASSETS . 'js/initCarousel.js',
            ['jquery', 'cg-carousel'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );

        wp_register_script(
            'html2canvass',
            EMBEDPRESS_URL_ASSETS . 'pdf-flip-book/js/html2canvas.min.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );
        wp_register_script(
            'threes',
            EMBEDPRESS_URL_ASSETS . 'pdf-flip-book/js/three.min.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );
        wp_register_script(
            'pdfs',
            EMBEDPRESS_URL_ASSETS . 'pdf-flip-book/js/pdf.min.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );
        wp_register_script(
            '3dflipbooks',
            EMBEDPRESS_URL_ASSETS . 'pdf-flip-book/js/3dflipbook.min.js',
            ['jquery'],
            EMBEDPRESS_PLUGIN_VERSION,
            true
        );


        wp_localize_script('embedpress-front', 'eplocalize', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'is_pro_plugin_active' => defined('EMBEDPRESS_SL_ITEM_SLUG'),
            'nonce' => wp_create_nonce( 'ep_nonce' ),
        ));
    }

    /**
     * Passes any unlinked URLs to EmbedPress\Shortcode::do_shortcode() for potential embedding.
     *
     * @since   1.5.0
     * @static
     *
     * @param   string $content The content to be searched.
     *
     * @return  string      The potentially modified content.
     */
    public static function autoEmbedUrls($content)
    {
        $plgSettings = Core::getSettings();

        if (!is_admin() && (bool) $plgSettings->enablePluginInFront === false) {
            return $content;
        }
        // Replace line breaks from all HTML elements with placeholders.
        $content = wp_replace_in_html_tags($content, ["\n" => '<!-- embedpress-line-break -->']);

        // Look for links in the content (not wrapped by shortcode)
        if (preg_match('#(^|\s|>)https?://#i', $content)) {
            $callbackFingerprint = ['\\EmbedPress\\Ends\\Front\\Handler', 'autoEmbedUrlsCallback'];

            // Find URLs on their own line.
            $content = preg_replace_callback('|^(\s*)(https?://[^\s<>"]+)(\s*)$|im', $callbackFingerprint, $content);
            // Find URLs in their own paragraph.
            $content = preg_replace_callback(
                '|(<p(?: [^>]*)?>\s*)(https?://[^\s<>"]+)(\s*<\/p>)|i',
                $callbackFingerprint,
                $content
            );
        }

        // Put the line breaks back.
        return str_replace('<!-- embedpress-line-break -->', "\n", $content);
    }

    /**
     * Callback function for \EmbedPress\Ends\Front\Handler::autoEmbedUrls().
     *
     * @since   1.5.0
     * @static
     *
     * @param   array $match A regex match array.
     *
     * @return  string      The embed HTML on success, otherwise the original URL.
     */
    public static function autoEmbedUrlsCallback($match)
    {
        $return = Shortcode::do_shortcode([], $match[2]);

        return $match[1] . $return . $match[3];
    }

    /**
     * A callback called by the WP `the_editor` filter.
     *
     * @since   1.6.0
     * @static
     *
     * @param   string $editorHTML The HTML which will be rendered as an editor, like TinyMCE.
     *
     * @return  string      The HTML which will be rendered as an editor, like TinyMCE
     */
    public static function renderPreviewBoxInEditors($editorHTML)
    {
        $plgSettings = Core::getSettings();
        if (!is_admin() && (bool) $plgSettings->enablePluginInFront) {
            $backEndHandler = new BackEndHandler(EMBEDPRESS_PLG_NAME, EMBEDPRESS_VERSION);

            $backEndHandler->enqueueScripts();
        }

        return $editorHTML;
    }
}
