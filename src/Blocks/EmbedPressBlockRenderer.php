<?php

namespace EmbedPress\Src\Blocks;

use EmbedPress\Includes\Classes\Helper;
use EmbedPress\Shortcode;
use Exception;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EmbedPress Block Renderer
 *
 * Handles rendering of EmbedPress blocks for Gutenberg editor
 * Manages dynamic content, content protection, and various embed configurations
 *
 * @package EmbedPress\Src\Blocks
 * @since 1.0.0
 */
class EmbedPressBlockRenderer
{
    /**
     * Dynamic providers that require real-time content fetching
     *
     * @var array
     */
    private static $dynamic_providers = [
        'photos.app.goo.gl',
        'photos.google.com',
        'instagram.com',
        'opensea.io',
    ];

    /**
     * Alignment mapping for CSS classes
     *
     * @var array
     */
    private static $alignment_classes = [
        'left'   => 'alignleft',
        'right'  => 'alignright',
        'wide'   => 'alignwide',
        'full'   => 'alignfull',
        'center' => 'aligncenter',
    ];

    /**
     * Check if URL belongs to a dynamic provider
     *
     * @param string $url The URL to check
     * @return bool True if dynamic provider, false otherwise
     */
    public static function is_dynamic_provider($url)
    {
        foreach (self::$dynamic_providers as $provider) {
            if (strpos($url, $provider) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Render dynamic content using EmbedPress shortcode parsing
     *
     * @param array $attributes Block attributes
     * @return string|null Rendered content or null on failure
     */
    public static function render_dynamic_content($attributes)
    {
        $url = $attributes['url'] ?? '';

        if (!class_exists('\\EmbedPress\\Shortcode')) {
            return null;
        }

        try {
            $embed_result = Shortcode::parseContent($url, false, $attributes);

            if (is_object($embed_result) && isset($embed_result->embed) && !empty($embed_result->embed)) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log('EmbedPress: Shortcode parsing successful for: ' . $url);
                }
                return $embed_result->embed;
            }
        } catch (Exception $e) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('EmbedPress: Shortcode parsing failed: ' . $e->getMessage());
            }
        }

        return null;
    }

    /**
     * Main render method for EmbedPress blocks
     *
     * @param array  $attributes Block attributes
     * @param string $content    Block content
     * @param object $block      Block object (unused but kept for compatibility)
     * @return string Rendered HTML content
     */
    public static function render($attributes, $content = '', $block = null)
    {
        // Extract basic attributes
        $url = $attributes['url'] ?? '';
        $client_id = !empty($attributes['clientId']) ? md5($attributes['clientId']) : '';

        // Handle content protection
        $protection_data = self::extract_protection_data($attributes, $client_id);
        $should_display_content = self::should_display_content($protection_data);
        $isAdManager = !empty($attributes['adManager']) ? true : false;

        // Early return for non-dynamic providers with displayable content
        if ((empty($url) || !self::is_dynamic_provider($url)) && $should_display_content && !$isAdManager) {
            return $content;
        }

        // Process embed HTML if available
        if (!empty($attributes['embedHTML'])) {
            return self::render_embed_html($attributes, $content, $protection_data, $should_display_content);
        }

        return '';
    }

    public static function render_embedpress_pdf($attributes, $content = '', $block = null)
    {

        return $content;

        // Extract basic attributes for PDF block
        $href = $attributes['href'] ?? '';
        $client_id = !empty($attributes['id']) ? md5($attributes['id']) : '';

        // Handle content protection
        $protection_data = self::extract_protection_data($attributes, $client_id);
        $should_display_content = self::should_display_content($protection_data);
        $isAdManager = !empty($attributes['adManager']) ? true : false;

        // For PDF blocks, if we have saved content and should display it, return the content
        if (!empty($content) && $should_display_content && !$isAdManager) {
            return $content;
        }

        // If no href is provided, return empty
        if (empty($href)) {
            return '';
        }

        // Render PDF-specific HTML
        return self::render_embedpress_pdf_html($attributes, $content, $protection_data, $should_display_content);
    }

    public static function render_document($attributes, $content = '', $block = null)
    {

        // Extract basic attributes for PDF block
        $href = $attributes['href'] ?? '';
        $client_id = !empty($attributes['id']) ? md5($attributes['id']) : '';

        // Handle content protection
        $protection_data = self::extract_protection_data($attributes, $client_id);
        $should_display_content = self::should_display_content($protection_data);
        $isAdManager = !empty($attributes['adManager']) ? true : false;

        // For PDF blocks, if we have saved content and should display it, return the content
        if (!empty($content) && $should_display_content && !$isAdManager) {
            return $content;
        }

        // If no href is provided, return empty
        if (empty($href)) {
            return '';
        }
        

        // Render PDF-specific HTML
        return self::render_embedpress_document_html($attributes, $content, $protection_data, $should_display_content);
    }

    /**
     * Extract content protection related data from attributes
     *
     * @param array  $attributes Block attributes
     * @param string $client_id  Client ID for the block
     * @return array Protection data array
     */
    private static function extract_protection_data($attributes, $client_id)
    {
        $content_password = $attributes['contentPassword'] ?? '';
        $hash_pass = hash('sha256', wp_salt(32) . md5($content_password));
        $password_correct = $_COOKIE['password_correct_' . $client_id] ?? '';
        return [
            'content_password'    => $content_password,
            'hash_pass'          => $hash_pass,
            'password_correct'   => $password_correct,
            'protection_type'    => $attributes['protectionType'] ?? '',
            'lock_content'       => $attributes['lockContent'] ?? '',
            'user_role'          => $attributes['userRole'] ?? '',
            'content_share'      => $attributes['contentShare'] ?? '',
            'protection_message' => $attributes['protectionMessage'] ?? '',
            'content_id'         => $attributes['clientId'] ?? '',
            'client_id'          => $client_id,
        ];
    }

    /**
     * Determine if content should be displayed based on protection settings
     *
     * @param array $protection_data Protection data array
     * @return bool True if content should be displayed
     */
    private static function should_display_content($protection_data)
    {
        return (
            !apply_filters('embedpress/is_allow_rander', false) ||
            empty($protection_data['lock_content']) ||
            ($protection_data['protection_type'] === 'password' && empty($protection_data['content_password'])) ||
            ($protection_data['protection_type'] === 'password' &&
                !empty(Helper::is_password_correct($protection_data['client_id'])) &&
                ($protection_data['hash_pass'] === $protection_data['password_correct'])) ||
            ($protection_data['protection_type'] === 'user-role' &&
                Helper::has_content_allowed_roles($protection_data['user_role']))
        );
    }

    /**
     * Render the embed HTML with all configurations
     *
     * @param array $attributes         Block attributes
     * @param string $content          Block content
     * @param array $protection_data   Protection data
     * @param bool $should_display_content Whether content should be displayed
     * @return string Rendered HTML
     */
    private static function render_embed_html($attributes, $content, $protection_data, $should_display_content)
    {
        // Extract basic configuration
        $config = self::extract_basic_config($attributes);

        // Build carousel configuration
        $carousel_config = self::build_carousel_config($attributes, $protection_data['client_id']);

        // Build player configuration
        $player_config = self::build_player_config($attributes, $protection_data['client_id']);

        // Get dynamic content
        $embed = self::get_embed_content($attributes, $content);

        // Build CSS classes and styling
        $styling = self::build_styling_config($attributes, $protection_data);

        // Generate final HTML
        return self::generate_final_html($attributes, $embed, $config, $carousel_config, $player_config, $styling, $protection_data, $should_display_content);
    }

    private static function render_embedpress_document_html($attributes, $content, $protection_data, $should_display_content) {
        // Extract document-specific attributes
        $href = $attributes['href'] ?? '';
        if (empty($href)) {
            return '';
        }

        $id = $attributes['id'] ?? 'embedpress-document-' . rand(100, 10000);
        $client_id = md5($id);
        $unitoption = $attributes['unitoption'] ?? 'px';
        $width = $attributes['width'] ?? 600;
        $height = $attributes['height'] ?? 600;
        $powered_by = $attributes['powered_by'] ?? true;
        $mime = $attributes['mime'] ?? '';
        $docViewer = $attributes['docViewer'] ?? 'custom';
        $themeMode = $attributes['themeMode'] ?? 'default';
        $customColor = $attributes['customColor'] ?? '#403A81';
        $presentation = $attributes['presentation'] ?? true;
        $download = $attributes['download'] ?? true;
        $draw = $attributes['draw'] ?? true;
        $toolbar = $attributes['toolbar'] ?? true;

        // CSS classes
        $width_class = ($unitoption === '%') ? 'ep-percentage-width' : 'ep-fixed-width';
        $content_share_class = '';
        $share_position_class = '';
        $share_position = $attributes['sharePosition'] ?? 'right';
        $download_class = $download ? 'enabled-file-download' : '';

        if (!empty($attributes['contentShare'])) {
            $content_share_class = 'ep-content-share-enabled';
            $share_position_class = 'ep-share-position-' . $share_position;
        }

        // Custom branding configuration
        $custom_branding = self::build_custom_branding($attributes, $client_id);

        // Generate document parameters for viewer configuration
        $doc_params = self::generate_document_params($attributes);

        // Generate embed code based on file type and viewer preference
        $embed_code = '';
        if ($mime === 'application/pdf') {
            // For PDF files, use the PDF viewer
            $renderer = Helper::get_pdf_renderer();
            $src = $renderer . ((strpos($renderer, '?') === false) ? '?' : '&') . 'file=' . urlencode($href) . $doc_params;

            $file_title = Helper::get_file_title($href);
            $embed_code = sprintf(
                '<iframe title="%s" class="embedpress-embed-document-pdf %s" style="%s; width: 100%%" src="%s" data-emid="%s"></iframe>',
                esc_attr($file_title),
                esc_attr($id),
                esc_attr("height: {$height}px"),
                esc_url($src),
                esc_attr($id)
            );
        } else {
            // For other document types, determine viewer URL based on docViewer setting
            $view_link = '';

            if ($docViewer === 'google') {
                $view_link = '//docs.google.com/gview?embedded=true&url=' . urlencode($href);
            } else {
                // Default to Office viewer for custom and office options
                $view_link = '//view.officeapps.live.com/op/embed.aspx?src=' . urlencode($href) . '&embedded=true';
            }

            // Check if it's a Google Docs URL and handle accordingly
            $hostname = parse_url($href, PHP_URL_HOST);
            if ($hostname && strpos($hostname, 'google.com') !== false) {
                $view_link = $href . '?embedded=true';
                if (strpos($view_link, '/presentation/')) {
                    $view_link = Helper::get_google_presentation_url($href);
                }
            }

            $file_title = Helper::get_file_title($href);
            $embed_code = sprintf(
                '<div class="%s ep-gutenberg-file-doc ep-powered-by-enabled%s" data-theme-mode="%s" data-custom-color="%s" data-id="%s">',
                ($docViewer === 'custom') ? 'ep-file-download-option-masked ' : '',
                esc_attr(' ' . $download_class),
                esc_attr($themeMode),
                esc_attr($customColor),
                esc_attr($id)
            );

            $embed_code .= sprintf(
                '<iframe title="%s" style="height: %spx; width: 100%%" src="%s" data-emid="%s"></iframe>',
                esc_attr($file_title),
                esc_attr($height),
                esc_url($view_link),
                esc_attr($id)
            );

            // Add canvas for drawing if enabled and using custom viewer
            if ($draw && $docViewer === 'custom') {
                $embed_code .= sprintf(
                    '<canvas class="ep-doc-canvas" width="%s" height="%s"></canvas>',
                    esc_attr($width),
                    esc_attr($height)
                );
            }

            // Add toolbar if enabled and using custom viewer
            if ($toolbar && $docViewer === 'custom') {
                $embed_code .= '<div class="ep-external-doc-icons">';

                // Add various toolbar icons based on settings
                if (!Helper::is_file_url($href)) {
                    $embed_code .= '<span class="ep-popup-icon"></span>'; // Popup icon
                }

                if ($download && Helper::is_file_url($href)) {
                    $embed_code .= '<span class="ep-print-icon"></span>'; // Print icon
                    $embed_code .= '<span class="ep-download-icon"></span>'; // Download icon
                }

                if ($draw) {
                    $embed_code .= '<span class="ep-draw-icon"></span>'; // Draw icon
                }

                if ($presentation) {
                    $embed_code .= '<span class="ep-fullscreen-icon"></span>'; // Fullscreen icon
                    $embed_code .= '<span class="ep-minimize-icon"></span>'; // Minimize icon
                }

                $embed_code .= '</div>';
            }

            $embed_code .= '</div>';
        }

        // Add powered by text if enabled
        if ($powered_by) {
            $embed_code .= sprintf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
        }

        // Handle ads if enabled
        $ads_attrs = '';
        if (!empty($attributes['adManager'])) {
            $ad = base64_encode(json_encode($attributes));
            $ads_attrs = "data-sponsored-id=\"{$client_id}\" data-sponsored-attrs=\"{$ad}\" class=\"sponsored-mask\"";
        }

        // Build the complete HTML structure
        ob_start();
    ?>
        <?php if (!empty($custom_branding['styles'])): ?>
            <style>
                <?php echo $custom_branding['styles']; ?>
            </style>
        <?php endif; ?>

        <div class="embedpress-document-embed ep-doc-<?php echo esc_attr($id); ?> <?php echo esc_attr($content_share_class . ' ' . $share_position_class . ' ' . $width_class); ?>"
            style="width: <?php echo esc_attr($width . $unitoption); ?>; max-width: 100%;"
            id="ep-doc-<?php echo esc_attr($attributes['clientId'] ?? $client_id); ?>"
            data-source-id="source-<?php echo esc_attr($attributes['clientId'] ?? $client_id); ?>">
            <div class="gutenberg-wraper">
                <div class="position-<?php echo esc_attr($share_position); ?>-wraper gutenberg-document-wraper">
                    <div <?php echo $ads_attrs; ?>>
                        <?php
                        do_action('embedpress_document_gutenberg_after_embed', $client_id, 'document', $attributes, $href);

                        if ($should_display_content) {
                            echo $embed_code;

                            // Add custom branding if available
                            if (!empty($custom_branding['html'])) {
                                echo $custom_branding['html'];
                            }
                        } else {
                            // Handle content protection
                            if (($protection_data['protection_type'] ?? '') === 'password') {
                                $pass_hash_key = md5($attributes['contentPassword'] ?? '');
                                do_action('embedpress/display_password_form', $client_id, $embed_code, $pass_hash_key, $attributes);
                            } else {
                                $protection_message = $attributes['protectionMessage'] ?? 'You do not have access to this content.';
                                $user_roles = $attributes['userRole'] ?? [];
                                do_action('embedpress/content_protection_content', $client_id, $protection_message, $user_roles);
                            }
                        }

                        // Handle ads template
                        if (!empty($attributes['adManager'])) {
                            $embed = apply_filters('embedpress/generate_ad_template', $embed_code, $client_id, $attributes, 'gutenberg');
                        }
                        ?>
                    </div>
                </div>

                <?php if (!empty($attributes['contentShare'])): ?>
                    <?php echo Helper::embed_content_share($attributes['clientId'] ?? $client_id, $attributes); ?>
                <?php endif; ?>
            </div>

            <?php if (!empty($attributes['adManager']) && ($attributes['adSource'] ?? '') === 'image' && !empty($attributes['adFileUrl'])): ?>
                <div class="ep-ad-template">
                    <!-- Ad template will be rendered here -->
                </div>
            <?php endif; ?>
        </div>
    <?php
        return ob_get_clean();
    }


    private static function render_embedpress_pdf_html($attributes, $content, $protection_data, $should_display_content)
    {
        // Extract PDF-specific attributes
        $href = $attributes['href'] ?? '';
        if (empty($href)) {
            return '';
        }

        $id = $attributes['id'] ?? 'embedpress-pdf-' . rand(100, 10000);
        $client_id = md5($id);
        $unitoption = $attributes['unitoption'] ?? 'px';
        $width = $attributes['width'] ?? 600;
        $height = $attributes['height'] ?? 600;
        $powered_by = $attributes['powered_by'] ?? true;
        $viewerStyle = $attributes['viewerStyle'] ?? 'modern';
        $mime = $attributes['mime'] ?? 'application/pdf';

        // Build width and height with units
        $width_value = $width . $unitoption;
        $height_value = $height . 'px';
        $dimension = "width:{$width_value};height:{$height_value}";

        // CSS classes
        $width_class = ($unitoption === '%') ? 'ep-percentage-width' : 'ep-fixed-width';
        $content_share_class = '';
        $share_position_class = '';
        $share_position = $attributes['sharePosition'] ?? 'right';

        if (!empty($attributes['contentShare'])) {
            $content_share_class = 'ep-content-share-enabled';
            $share_position_class = 'ep-share-position-' . $share_position;
        }

        // Custom branding configuration
        $custom_branding = self::build_custom_branding($attributes, $client_id);

        // Generate PDF parameters
        $pdf_params = self::generate_pdf_params($attributes);

        // Generate embed code based on file type
        $embed_code = '';
        if ($mime === 'application/pdf') {
            // For PDF files, use the PDF viewer
            $renderer = Helper::get_pdf_renderer();
            $src = $renderer . ((strpos($renderer, '?') === false) ? '?' : '&') . 'file=' . urlencode($href) . $pdf_params;

            // Handle flip-book viewer style
            if ($viewerStyle === 'flip-book') {
                $src = EMBEDPRESS_URL_STATIC . 'pdf-flip-book/viewer.html?file=' . urlencode($href) . $pdf_params;
            }

            $file_title = Helper::get_file_title($href);
            $embed_code = sprintf(
                '<iframe title="%s" class="embedpress-embed-document-pdf %s" style="%s; width: 100%%" src="%s" data-emid="%s"></iframe>',
                esc_attr($file_title),
                esc_attr($id),
                esc_attr("height: {$height}px"),
                esc_url($src),
                esc_attr($id)
            );
        } else {
            // For other document types, use Office viewer
            $url = '//view.officeapps.live.com/op/embed.aspx?src=' . urlencode($href);
            $embed_code = sprintf(
                '<iframe title="" style="height: %spx; width: 100%%" src="%s"></iframe>',
                esc_attr($height),
                esc_url($url)
            );
        }

        // Add powered by text if enabled
        if ($powered_by) {
            $embed_code .= sprintf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
        }

        // Handle ads if enabled
        $ads_attrs = '';
        if (!empty($attributes['adManager'])) {
            $ad = base64_encode(json_encode($attributes));
            $ads_attrs = "data-sponsored-id=\"{$client_id}\" data-sponsored-attrs=\"{$ad}\" class=\"sponsored-mask\"";
        }

        // Build the complete HTML structure
        ob_start();
?>
        <?php if (!empty($custom_branding['styles'])): ?>
            <style>
                <?php echo $custom_branding['styles']; ?>
            </style>
        <?php endif; ?>

        <div class="embedpress-document-embed ep-doc-<?php echo esc_attr($id); ?> <?php echo esc_attr($content_share_class . ' ' . $share_position_class . ' ' . $width_class); ?>"
            style="width: <?php echo esc_attr($width . $unitoption); ?>; max-width: 100%;"
            id="ep-doc-<?php echo esc_attr($attributes['clientId'] ?? $client_id); ?>"
            data-source-id="source-<?php echo esc_attr($attributes['clientId'] ?? $client_id); ?>">
            <div class="gutenberg-wraper">
                <div class="position-<?php echo esc_attr($share_position); ?>-wraper gutenberg-pdf-wraper">
                    <div <?php echo $ads_attrs; ?>>
                        <?php
                        do_action('embedpress_pdf_gutenberg_after_embed', $client_id, 'pdf', $attributes, $href);

                        if ($should_display_content) {
                            echo $embed_code;

                            // Add custom branding if available
                            if (!empty($custom_branding['html'])) {
                                echo $custom_branding['html'];
                            }
                        } else {
                            // Handle content protection
                            if (($protection_data['protection_type'] ?? '') === 'password') {
                                $pass_hash_key = md5($attributes['contentPassword'] ?? '');
                                do_action('embedpress/display_password_form', $client_id, $embed_code, $pass_hash_key, $attributes);
                            } else {
                                $protection_message = $attributes['protectionMessage'] ?? 'You do not have access to this content.';
                                $user_roles = $attributes['userRole'] ?? [];
                                do_action('embedpress/content_protection_content', $client_id, $protection_message, $user_roles);
                            }
                        }

                        // Handle ads template
                        if (!empty($attributes['adManager'])) {
                            $embed = apply_filters('embedpress/generate_ad_template', $embed_code, $client_id, $attributes, 'gutenberg');
                        }
                        ?>
                    </div>
                </div>

                <?php if (!empty($attributes['contentShare'])): ?>
                    <?php echo Helper::embed_content_share($attributes['clientId'] ?? $client_id, $attributes); ?>
                <?php endif; ?>
            </div>

            <?php if (!empty($attributes['adManager']) && ($attributes['adSource'] ?? '') === 'image' && !empty($attributes['adFileUrl'])): ?>
                <div class="ep-ad-template">
                    <!-- Ad template will be rendered here -->
                </div>
            <?php endif; ?>
        </div>
    <?php
        return ob_get_clean();
    }

    /**
     * Generate PDF parameters for viewer configuration
     * Based on the getParamData function from the old implementation
     */
    private static function generate_pdf_params($attributes)
    {
        $urlParamData = array(
            'themeMode' => !empty($attributes['themeMode']) ? $attributes['themeMode'] : 'default',
            'toolbar' => !empty($attributes['toolbar']) ? 'true' : 'false',
            'position' => $attributes['position'] ?? 'top',
            'presentation' => !empty($attributes['presentation']) ? 'true' : 'false',
            'lazyLoad' => !empty($attributes['lazyLoad']) ? 'true' : 'false',
            'download' => !empty($attributes['download']) ? 'true' : 'false',
            'copy_text' => !empty($attributes['copy_text']) ? 'true' : 'false',
            'add_text' => !empty($attributes['add_text']) ? 'true' : 'false',
            'draw' => !empty($attributes['draw']) ? 'true' : 'false',
            'doc_rotation' => !empty($attributes['doc_rotation']) ? 'true' : 'false',
            'add_image' => !empty($attributes['add_image']) ? 'true' : 'false',
            'doc_details' => !empty($attributes['doc_details']) ? 'true' : 'false',
            'zoom_in' => !empty($attributes['zoomIn']) ? 'true' : 'false',
            'zoom_out' => !empty($attributes['zoomOut']) ? 'true' : 'false',
            'fit_view' => !empty($attributes['fitView']) ? 'true' : 'false',
            'bookmark' => !empty($attributes['bookmark']) ? 'true' : 'false',
            'flipbook_toolbar_position' => !empty($attributes['flipbook_toolbar_position']) ? $attributes['flipbook_toolbar_position'] : 'bottom',
            'selection_tool' => isset($attributes['selection_tool']) ? esc_attr($attributes['selection_tool']) : '0',
            'scrolling' => isset($attributes['scrolling']) ? esc_attr($attributes['scrolling']) : '-1',
            'spreads' => isset($attributes['spreads']) ? esc_attr($attributes['spreads']) : '-1',
        );

        // Add custom color for custom theme mode
        if ($urlParamData['themeMode'] === 'custom') {
            $urlParamData['customColor'] = !empty($attributes['customColor']) ? $attributes['customColor'] : '#403A81';
        }

        // Handle flip-book viewer style
        if (isset($attributes['viewerStyle']) && $attributes['viewerStyle'] === 'flip-book') {
            return "&key=" . base64_encode(mb_convert_encoding(http_build_query($urlParamData), 'UTF-8'));
        }

        return "#key=" . base64_encode(mb_convert_encoding(http_build_query($urlParamData), 'UTF-8'));
    }

    /**
     * Generate document parameters for viewer configuration
     * Based on document-specific attributes
     */
    private static function generate_document_params($attributes)
    {
        $urlParamData = array(
            'theme_mode' => !empty($attributes['themeMode']) ? $attributes['themeMode'] : 'default',
            'presentation' => !empty($attributes['presentation']) ? 'true' : 'false',
            'position' => $attributes['position'] ?? 'top',
            'download' => !empty($attributes['download']) ? 'true' : 'false',
            'draw' => !empty($attributes['draw']) ? 'true' : 'false',
        );

        // Add custom color for custom theme mode
        if ($urlParamData['theme_mode'] === 'custom') {
            $urlParamData['custom_color'] = !empty($attributes['customColor']) ? $attributes['customColor'] : '#343434';
        }

        return '?' . http_build_query($urlParamData);
    }

    /**
     * Extract basic configuration from attributes
     *
     * @param array $attributes Block attributes
     * @return array Basic configuration
     */
    private static function extract_basic_config($attributes)
    {
        return [
            'block_id'      => !empty($attributes['clientId']) ? $attributes['clientId'] : '',
            'custom_player' => !empty($attributes['customPlayer']) ? $attributes['customPlayer'] : 0,
            'insta_layout'  => !empty($attributes['instaLayout']) ? ' ' . $attributes['instaLayout'] : ' insta-grid',
            'mode'          => !empty($attributes['mode']) ? ' ep-google-photos-' . $attributes['mode'] : '',
            'embed_type'    => !empty($attributes['cEmbedType']) ? ' ' . $attributes['cEmbedType'] : '',
            'url'           => $attributes['url'] ?? '',
        ];
    }

    /**
     * Build carousel configuration
     *
     * @param array  $attributes Block attributes
     * @param string $client_id  Client ID
     * @return array Carousel configuration
     */
    private static function build_carousel_config($attributes, $client_id)
    {
        $carousel_options = '';
        $carousel_id = '';

        if (!empty($attributes['instaLayout']) && $attributes['instaLayout'] === 'insta-carousel') {
            $carousel_id = 'data-carouselid=' . esc_attr($client_id);

            $options = [
                'layout'          => $attributes['instaLayout'],
                'slideshow'       => !empty($attributes['slidesShow']) ? $attributes['slidesShow'] : 5,
                'autoplay'        => !empty($attributes['carouselAutoplay']) ? $attributes['carouselAutoplay'] : 0,
                'autoplayspeed'   => !empty($attributes['autoplaySpeed']) ? $attributes['autoplaySpeed'] : 3000,
                'transitionspeed' => !empty($attributes['transitionSpeed']) ? $attributes['transitionSpeed'] : 1000,
                'loop'            => !empty($attributes['carouselLoop']) ? $attributes['carouselLoop'] : 0,
                'arrows'          => !empty($attributes['carouselArrows']) ? $attributes['carouselArrows'] : 0,
                'spacing'         => !empty($attributes['carouselSpacing']) ? $attributes['carouselSpacing'] : 0
            ];

            $carousel_options = 'data-carousel-options=' . htmlentities(json_encode($options), ENT_QUOTES);
        }

        return [
            'carousel_id'      => $carousel_id,
            'carousel_options' => $carousel_options,
        ];
    }

    /**
     * Build player configuration
     *
     * @param array  $attributes Block attributes
     * @param string $client_id  Client ID
     * @return array Player configuration
     */
    private static function build_player_config($attributes, $client_id)
    {
        $custom_player = '';
        $player_options = '';
        $custom_player_enabled = !empty($attributes['customPlayer']) ? $attributes['customPlayer'] : 0;

        if (!empty($custom_player_enabled)) {
            $is_self_hosted = Helper::check_media_format($attributes['url']);
            $custom_player = 'data-playerid=' . esc_attr($client_id);

            $options = self::build_player_options($attributes, $is_self_hosted);
            $player_options = 'data-options=' . htmlentities(json_encode($options), ENT_QUOTES);
        }

        return [
            'custom_player'   => $custom_player,
            'player_options'  => $player_options,
        ];
    }

    /**
     * Build player options array
     *
     * @param array $attributes     Block attributes
     * @param array $is_self_hosted Self-hosted media info
     * @return array Player options
     */
    private static function build_player_options($attributes, $is_self_hosted)
    {
        $options = [
            'rewind'           => !empty($attributes['playerRewind']),
            'restart'          => !empty($attributes['playerRestart']),
            'pip'              => !empty($attributes['playerPip']),
            'poster_thumbnail' => $attributes['posterThumbnail'] ?? '',
            'player_color'     => $attributes['playerColor'] ?? '',
            'player_preset'    => $attributes['playerPreset'] ?? 'preset-default',
            'fast_forward'     => !empty($attributes['playerFastForward']),
            'player_tooltip'   => !empty($attributes['playerTooltip']),
            'hide_controls'    => !empty($attributes['playerHideControls']),
            'download'         => !empty($attributes['playerDownload']),
        ];

        // Add conditional options
        $conditional_options = [
            'fullscreen' => 'fullscreen',
            'starttime'  => 'start',
            'endtime'    => 'end',
            'relatedvideos' => 'rel',
            'muteVideo'  => 'mute',
            'vstarttime' => 't',
            'vautoplay'  => 'vautoplay',
            'vautopause' => 'autopause',
            'vdnt'       => 'dnt',
        ];

        foreach ($conditional_options as $attr_key => $option_key) {
            if (!empty($attributes[$attr_key])) {
                $options[$option_key] = $attributes[$attr_key];
            }
        }

        // Add self-hosted options
        if (!empty($is_self_hosted['selhosted'])) {
            $options['self_hosted'] = $is_self_hosted['selhosted'];
            $options['hosted_format'] = $is_self_hosted['format'];
        }

        return $options;
    }

    /**
     * Get embed content with dynamic rendering
     *
     * @param array  $attributes Block attributes
     * @param string $content    Block content
     * @return string Embed content
     */
    private static function get_embed_content($attributes, $content)
    {
        self::render_dynamic_content($attributes);
        return apply_filters('embedpress_render_dynamic_content', $content, $attributes);
    }

    /**
     * Build styling configuration
     *
     * @param array $attributes      Block attributes
     * @param array $protection_data Protection data
     * @return array Styling configuration
     */
    private static function build_styling_config($attributes, $protection_data)
    {
        $client_id = $protection_data['client_id'];

        // Content sharing classes
        $content_share_class = !empty($attributes['contentShare']) ? 'ep-content-share-enabled' : '';
        $share_position = $attributes['sharePosition'] ?? 'right';
        $share_position_class = !empty($attributes['contentShare']) ? 'ep-share-position-' . $share_position : '';

        // Content protection classes
        $password_correct = $_COOKIE['password_correct_' . $client_id] ?? '';
        $hash_pass = hash('sha256', wp_salt(32) . md5($attributes['contentPassword'] ?? ''));
        $content_protection_class = 'ep-content-protection-enabled';

        if (empty($attributes['lockContent']) || empty($attributes['contentPassword']) || $hash_pass === $password_correct) {
            $content_protection_class = 'ep-content-protection-disabled';
        }

        // Alignment classes
        $alignment = self::get_alignment_class($attributes['align'] ?? '');

        // Ad manager attributes
        $ads_attrs = self::build_ads_attributes($attributes, $client_id);

        // Custom branding styles and HTML
        $custom_branding = self::build_custom_branding($attributes, $client_id);

        // Media format classes
        $hosted_format = self::get_hosted_format($attributes);
        $yt_channel_class = Helper::is_youtube_channel($attributes['url']) ? 'embedded-youtube-channel' : '';
        $auto_pause = !empty($attributes['autoPause']) ? ' enabled-auto-pause' : '';

        return [
            'content_share_class'      => $content_share_class,
            'share_position_class'     => $share_position_class,
            'content_protection_class' => $content_protection_class,
            'alignment'                => $alignment,
            'ads_attrs'                => $ads_attrs,
            'custom_branding'          => $custom_branding,
            'hosted_format'            => $hosted_format,
            'yt_channel_class'         => $yt_channel_class,
            'auto_pause'               => $auto_pause,
            'pass_hash_key'            => isset($attributes['contentPassword']) ? md5($attributes['contentPassword']) : '',
        ];
    }

    /**
     * Get alignment CSS class
     *
     * @param string $align Alignment value
     * @return string CSS class
     */
    private static function get_alignment_class($align)
    {
        return isset(self::$alignment_classes[$align])
            ? self::$alignment_classes[$align] . ' clear'
            : 'aligncenter';
    }

    /**
     * Build ad manager attributes
     *
     * @param array  $attributes Block attributes
     * @param string $client_id  Client ID
     * @return string Ad attributes
     */
    private static function build_ads_attributes($attributes, $client_id)
    {
        if (empty($attributes['adManager'])) {
            return '';
        }

        $ad = base64_encode(json_encode($attributes));
        return "data-sponsored-id=$client_id data-sponsored-attrs=$ad class=sponsored-mask";
    }

    /**
     * Get hosted media format
     *
     * @param array $attributes Block attributes
     * @return string Media format
     */
    private static function get_hosted_format($attributes)
    {
        if (empty($attributes['customPlayer'])) {
            return '';
        }

        $self_hosted = Helper::check_media_format($attributes['url']);
        return $self_hosted['format'] ?? '';
    }

    /**
     * Build custom branding configuration
     *
     * @param array  $attributes Block attributes
     * @param string $client_id  Client ID
     * @return array Custom branding configuration
     */
    private static function build_custom_branding($attributes, $client_id)
    {
        $custom_branding = [
            'html' => '',
            'styles' => ''
        ];

        // Check if custom logo is enabled
        if (empty($attributes['customlogo'])) {
            return $custom_branding;
        }

        $logo_url = $attributes['customlogo'];
        $logo_x = $attributes['logoX'] ?? 5;
        $logo_y = $attributes['logoY'] ?? 10;
        $logo_opacity = $attributes['logoOpacity'] ?? 1;
        $custom_logo_url = $attributes['customlogoUrl'] ?? '';

        // Generate custom logo styles
        $custom_branding['styles'] = sprintf(
            '#ep-gutenberg-content-%s img.watermark {
                border: 0;
                position: absolute;
                bottom: %s%%;
                right: %s%%;
                max-width: 150px;
                max-height: 75px;
                -o-transition: opacity 0.5s ease-in-out;
                -moz-transition: opacity 0.5s ease-in-out;
                -webkit-transition: opacity 0.5s ease-in-out;
                transition: opacity 0.5s ease-in-out;
                z-index: 1;
                opacity: %s;
            }
            #ep-gutenberg-content-%s img.watermark:hover {
                opacity: 1;
            }',
            esc_attr($client_id),
            esc_attr($logo_y),
            esc_attr($logo_x),
            esc_attr($logo_opacity),
            esc_attr($client_id)
        );

        // Generate custom logo HTML
        $logo_html = sprintf(
            '<img decoding="async" src="%s" class="watermark ep-custom-logo" width="auto" height="auto" alt="">',
            esc_url($logo_url)
        );

        // Wrap with link if URL is provided
        if (!empty($custom_logo_url)) {
            $logo_html = sprintf(
                '<a href="%s" target="_blank">%s</a>',
                esc_url($custom_logo_url),
                $logo_html
            );
        }

        $custom_branding['html'] = $logo_html;

        return $custom_branding;
    }

    /**
     * Generate the final HTML output
     *
     * @param array  $attributes            Block attributes
     * @param string $embed                 Embed content
     * @param array  $config                Basic configuration
     * @param array  $carousel_config       Carousel configuration
     * @param array  $player_config         Player configuration
     * @param array  $styling               Styling configuration
     * @param array  $protection_data       Protection data
     * @param bool   $should_display_content Whether content should be displayed
     * @return string Final HTML output
     */
    private static function generate_final_html($attributes, $embed, $config, $carousel_config, $player_config, $styling, $protection_data, $should_display_content)
    {
        ob_start();

        // Extract variables for template
        $url = $config['url'];
        $block_id = $config['block_id'];
        $client_id = $protection_data['client_id'];
        $content_id = $protection_data['content_id'];
        $content_share = $protection_data['content_share'];

        // Build wrapper classes
        $wrapper_classes = self::build_wrapper_classes($styling, $config);
        $embed_wrapper_classes = self::build_embed_wrapper_classes($attributes);
        $content_wrapper_classes = self::build_content_wrapper_classes($attributes, $config, $styling);

    ?>
        <?php if (!empty($styling['custom_branding']['styles'])): ?>
            <style>
                <?php echo $styling['custom_branding']['styles']; ?>
            </style>
        <?php endif; ?>

        <div class="embedpress-gutenberg-wrapper source-provider-<?php echo Helper::get_provider_name($url); ?> <?php echo esc_attr($wrapper_classes); ?>" id="<?php echo esc_attr($block_id); ?>">
            <div class="wp-block-embed__wrapper <?php echo esc_attr($embed_wrapper_classes); ?>">
                <div id="ep-gutenberg-content-<?php echo esc_attr($client_id) ?>" class="ep-gutenberg-content<?php echo esc_attr($styling['auto_pause']); ?>">
                    <div <?php echo esc_attr($styling['ads_attrs']); ?>>
                        <div class="ep-embed-content-wraper <?php echo esc_attr($content_wrapper_classes); ?>"
                            <?php echo esc_attr($player_config['custom_player']); ?>
                            <?php echo esc_attr($player_config['player_options']); ?>
                            <?php echo esc_attr($carousel_config['carousel_id']); ?>
                            <?php echo esc_attr($carousel_config['carousel_options']); ?>>

                            <?php
                            self::render_embed_content($embed, $content_share, $content_id, $attributes, $should_display_content, $protection_data, $styling);
                            ?>
                        </div>

                        <?php self::render_ad_template($attributes, $embed, $client_id); ?>
                    </div>
                </div>
            </div>
        </div>
<?php

        return ob_get_clean();
    }

    /**
     * Build wrapper CSS classes
     *
     * @param array $styling Styling configuration
     * @param array $config  Basic configuration
     * @return string CSS classes
     */
    private static function build_wrapper_classes($styling, $config)
    {
        return trim(sprintf(
            '%s %s %s %s%s',
            $styling['alignment'],
            $styling['content_share_class'],
            $styling['share_position_class'],
            $styling['content_protection_class'],
            $config['embed_type']
        ));
    }

    /**
     * Build embed wrapper CSS classes
     *
     * @param array $attributes Block attributes
     * @return string CSS classes
     */
    private static function build_embed_wrapper_classes($attributes)
    {
        $classes = [];

        if (!empty($attributes['contentShare'])) {
            $share_position = $attributes['sharePosition'] ?? 'right';
            $classes[] = 'position-' . $share_position . '-wraper';
        }

        if (($attributes['videosize'] ?? '') === 'responsive') {
            $classes[] = 'ep-video-responsive';
        }

        return implode(' ', $classes);
    }

    /**
     * Build content wrapper CSS classes
     *
     * @param array $attributes Block attributes
     * @param array $config     Basic configuration
     * @param array $styling    Styling configuration
     * @return string CSS classes
     */
    private static function build_content_wrapper_classes($attributes, $config, $styling)
    {
        return trim(sprintf(
            '%s%s%s %s %s',
            $attributes['playerPreset'] ?? '',
            $config['insta_layout'],
            $config['mode'],
            $styling['hosted_format'],
            $styling['yt_channel_class']
        ));
    }

    /**
     * Render embed content with protection logic
     *
     * @param string $embed                 Embed content
     * @param string $content_share         Content share setting
     * @param string $content_id            Content ID
     * @param array  $attributes            Block attributes
     * @param bool   $should_display_content Whether content should be displayed
     * @param array  $protection_data       Protection data
     * @param array  $styling               Styling configuration
     */
    private static function render_embed_content($embed, $content_share, $content_id, $attributes, $should_display_content, $protection_data, $styling)
    {
        if ($should_display_content) {
            self::render_displayable_content($embed, $content_share, $content_id, $attributes, $styling);
        } else {
            self::render_protected_content($embed, $content_share, $content_id, $attributes, $protection_data, $styling);
        }
    }

    /**
     * Render displayable content
     *
     * @param string $embed        Embed content
     * @param string $content_share Content share setting
     * @param string $content_id   Content ID
     * @param array  $attributes   Block attributes
     * @param array  $styling      Styling configuration (optional)
     */
    private static function render_displayable_content($embed, $content_share, $content_id, $attributes, $styling = [])
    {
        // Add custom branding if available
        if (!empty($styling['custom_branding']['html'])) {
            if (is_array($embed)) {
                $embed['html'] .= $styling['custom_branding']['html'];
            } else {
                $embed .= $styling['custom_branding']['html'];
            }
        }

        if (!empty($content_share)) {
            $embed .= Helper::embed_content_share($content_id, $attributes);
        }

        if (is_array($embed)) {
            echo $embed['html'];
        } else {
            echo $embed;
        }
    }

    /**
     * Render protected content
     *
     * @param string $embed           Embed content
     * @param string $content_share   Content share setting
     * @param string $content_id      Content ID
     * @param array  $attributes      Block attributes
     * @param array  $protection_data Protection data
     * @param array  $styling         Styling configuration
     */
    private static function render_protected_content($embed, $content_share, $content_id, $attributes, $protection_data, $styling)
    {
        // Add custom branding if available
        if (!empty($styling['custom_branding']['html'])) {
            if (is_array($embed)) {
                $embed['html'] .= $styling['custom_branding']['html'];
            } else {
                $embed .= $styling['custom_branding']['html'];
            }
        }

        if (!empty($content_share)) {
            $embed .= Helper::embed_content_share($content_id, $attributes);
        }

        if ($protection_data['protection_type'] === 'password') {
            do_action('embedpress/display_password_form', $protection_data['client_id'], $embed, $styling['pass_hash_key'], $attributes);
        } else {
            do_action('embedpress/content_protection_content', $protection_data['client_id'], $protection_data['protection_message'], $protection_data['user_role']);
        }
    }

    /**
     * Render ad template if enabled
     *
     * @param array  $attributes Block attributes
     * @param string $embed      Embed content
     * @param string $client_id  Client ID
     */
    private static function render_ad_template($attributes, $embed, $client_id)
    {
        if (!empty($attributes['adManager'])) {
            $embed = apply_filters('embedpress/generate_ad_template', $embed, $client_id, $attributes, 'gutenberg');
        }
    }
}
?>