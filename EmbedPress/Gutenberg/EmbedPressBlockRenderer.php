<?php

namespace EmbedPress\Gutenberg;

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
 * @package EmbedPress\Gutenberg
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
        if ((!empty($content) && !self::is_dynamic_provider($url)) && $should_display_content && !$isAdManager) {
            return $content;
        }

        // Process embed HTML if available
        if (!empty($attributes['embedHTML'])) {
            return self::render_embed_html($attributes, $attributes['embedHTML'], $protection_data, $should_display_content);
        }

        return '';
    }


    /**
     * Legacy PDF render method - organized following current structure
     *
     * @param array $attributes Block attributes
     * @return string Rendered HTML content
     */
    public static function embedpress_pdf_legacy_render_block($attributes)
    {
        // Extract basic attributes for PDF block
        $href = $attributes['href'] ?? '';
        $id = $attributes['id'] ?? 'embedpress-pdf-' . rand(100, 10000);
        $client_id = md5($id);

        // If no href is provided, return empty
        if (empty($href)) {
            return '';
        }

        // Handle content protection using existing methods
        $protection_data = self::extract_protection_data($attributes, $client_id);
        $should_display_content = self::should_display_content($protection_data);

        // Build styling configuration using existing method
        $styling = self::build_styling_config($attributes, $protection_data);

        // Generate legacy PDF HTML
        return self::render_legacy_pdf_html($attributes, $protection_data, $should_display_content, $styling);
    }

    /**
     * Render legacy PDF HTML structure
     *
     * @param array $attributes Block attributes
     * @param array $protection_data Protection data
     * @param bool $should_display_content Whether content should be displayed
     * @param array $styling Styling configuration
     * @return string Rendered HTML
     */
    private static function render_legacy_pdf_html($attributes, $protection_data, $should_display_content, $styling)
    {
        $href = $attributes['href'];
        $id = $attributes['id'] ?? 'embedpress-pdf-' . rand(100, 10000);
        $client_id = md5($id);

        // Extract legacy-specific configurations
        $legacy_config = self::extract_legacy_pdf_config($attributes);

        // Generate embed code
        $embed_code = self::generate_legacy_embed_code($attributes, $legacy_config);

        // Build wrapper classes
        $wrapper_classes = self::build_legacy_wrapper_classes($attributes, $styling, $legacy_config);

        ob_start();
?>
        <div id="ep-gutenberg-content-<?php echo esc_attr($client_id) ?>" class="ep-gutenberg-content <?php echo esc_attr($wrapper_classes); ?>">
            <div class="embedpress-inner-iframe <?php echo esc_attr($legacy_config['unit_class']); ?> ep-doc-<?php echo esc_attr($client_id); ?>" style="<?php echo esc_attr($legacy_config['style_attr']); ?>" id="<?php echo esc_attr($id); ?>">
                <div <?php echo esc_attr($styling['ads_attrs']); ?>>
                    <?php
                    do_action('embedpress_pdf_gutenberg_after_embed', $client_id, 'pdf', $attributes, $href);

                    if ($should_display_content) {
                        self::render_legacy_displayable_content($embed_code, $attributes, $styling);
                    } else {
                        self::render_legacy_protected_content($embed_code, $attributes, $protection_data, $styling);
                    }

                    // Render ad template if enabled
                    if (!empty($attributes['adManager'])) {
                        $embed_code = apply_filters('embedpress/generate_ad_template', $embed_code, $client_id, $attributes, 'gutenberg');
                    }
                    ?>
                </div>
            </div>
        </div>
    <?php
        return ob_get_clean();
    }

    /**
     * Extract legacy PDF configuration
     *
     * @param array $attributes Block attributes
     * @return array Legacy configuration
     */
    private static function extract_legacy_pdf_config($attributes)
    {
        $unitoption = $attributes['unitoption'] ?? 'px';
        $width = !empty($attributes['width']) ? $attributes['width'] . $unitoption : (Helper::get_options_value('enableEmbedResizeWidth') ?: 600) . 'px';
        $height = !empty($attributes['height']) ? $attributes['height'] . 'px' : (Helper::get_options_value('enableEmbedResizeHeight') ?: 600) . 'px';

        $width_class = ($unitoption == '%') ? 'ep-percentage-width' : 'ep-fixed-width';
        $unit_class = ($unitoption === '%') ? 'emebedpress-unit-percent' : '';

        $style_attr = ($unitoption === '%' && !empty($attributes['width']))
            ? 'max-width:' . $attributes['width'] . '%'
            : 'max-width:100%';

        $dimension = "width:$width;height:$height";

        return [
            'unitoption' => $unitoption,
            'width' => $width,
            'height' => $height,
            'width_class' => $width_class,
            'unit_class' => $unit_class,
            'style_attr' => $style_attr,
            'dimension' => $dimension,
        ];
    }

    /**
     * Generate legacy embed code
     *
     * @param array $attributes Block attributes
     * @param array $legacy_config Legacy configuration
     * @return string Embed code
     */
    private static function generate_legacy_embed_code($attributes, $legacy_config)
    {
        $href = $attributes['href'];
        $id = $attributes['id'] ?? 'embedpress-pdf-' . rand(100, 10000);
        $renderer = Helper::get_pdf_renderer();

        $src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . urlencode($href) . self::generate_pdf_params($attributes);

        $embed_code = '<iframe title="' . esc_attr(Helper::get_file_title($href)) . '" class="embedpress-embed-document-pdf ' . esc_attr($id) . '" style="' . esc_attr($legacy_config['dimension']) . '; max-width:100%; display: inline-block" src="' . esc_url($src) . '" frameborder="0" oncontextmenu="return false;"></iframe> ';

        // Handle flip-book viewer style
        if (isset($attributes['viewerStyle']) && $attributes['viewerStyle'] === 'flip-book') {
            $src = urlencode($href) . self::generate_pdf_params($attributes);
            $embed_code = '<iframe title="' . esc_attr(Helper::get_file_title($href)) . '" class="embedpress-embed-document-pdf ' . esc_attr($id) . '" style="' . esc_attr($legacy_config['dimension']) . '; max-width:100%; display: inline-block" src="' . esc_url(EMBEDPRESS_URL_ASSETS . 'pdf-flip-book/viewer.html?file=' . $src) . '" frameborder="0" oncontextmenu="return false;"></iframe> ';
        }

        // Add powered by if enabled
        $gen_settings = get_option(EMBEDPRESS_PLG_NAME);
        $powered_by = isset($gen_settings['embedpress_document_powered_by']) && 'yes' === $gen_settings['embedpress_document_powered_by'];
        if (isset($attributes['powered_by'])) {
            $powered_by = $attributes['powered_by'];
        }

        if ($powered_by) {
            $embed_code .= sprintf('<p class="embedpress-el-powered">%s</p>', __('Powered By EmbedPress', 'embedpress'));
        }

        return $embed_code;
    }

    /**
     * Build legacy wrapper classes
     *
     * @param array $attributes Block attributes
     * @param array $styling Styling configuration
     * @param array $legacy_config Legacy configuration
     * @return string CSS classes
     */
    private static function build_legacy_wrapper_classes($attributes, $styling, $legacy_config)
    {
        return trim(sprintf(
            '%s %s %s %s %s',
            $styling['alignment'],
            $legacy_config['width_class'],
            $styling['content_share_class'],
            $styling['share_position_class'],
            $styling['content_protection_class']
        ));
    }

    /**
     * Render legacy displayable content
     *
     * @param string $embed_code Embed code
     * @param array $attributes Block attributes
     * @param array $styling Styling configuration
     */
    private static function render_legacy_displayable_content($embed_code, $attributes, $styling)
    {
        $share_position = $attributes['sharePosition'] ?? 'right';
        $content_id = $attributes['id'];

        echo '<div class="ep-embed-content-wraper">';
        $embed = '<div class="position-' . esc_attr($share_position) . '-wraper gutenberg-pdf-wraper">';
        $embed .= $embed_code;
        $embed .= '</div>';

        if (!empty($attributes['contentShare'])) {
            $embed .= Helper::embed_content_share($content_id, $attributes);
        }
        echo $embed;
        echo '</div>';
    }

    /**
     * Render legacy protected content
     *
     * @param string $embed_code Embed code
     * @param array $attributes Block attributes
     * @param array $protection_data Protection data
     * @param array $styling Styling configuration
     */
    private static function render_legacy_protected_content($embed_code, $attributes, $protection_data, $styling)
    {
        $share_position = $attributes['sharePosition'] ?? 'right';
        $client_id = $protection_data['client_id'];

        // Initialize $embed variable
        $embed = $embed_code;

        if (!empty($attributes['contentShare'])) {
            $content_id = $attributes['clientId'];
            $embed = '<div class="position-' . esc_attr($share_position) . '-wraper gutenberg-pdf-wraper">';
            $embed .= $embed_code;
            $embed .= '</div>';
            $embed .= Helper::embed_content_share($content_id, $attributes);
        }

        echo '<div class="ep-embed-content-wraper">';
        if ($attributes['protectionType'] == 'password') {
            do_action('embedpress/display_password_form', $client_id, $embed, $styling['pass_hash_key'], $attributes);
        } else {
            do_action('embedpress/content_protection_content', $client_id, $attributes['protectionMessage'], $attributes['userRole']);
        }
        echo '</div>';
    }

    public static function render_embedpress_pdf($attributes, $content = '', $block = null)
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


        if (empty($content)) {
            return self::embedpress_pdf_legacy_render_block($attributes);
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

    private static function render_embedpress_document_html($attributes, $content, $protection_data, $should_display_content)
    {

        $href = $attributes['href'] ?? '';
        if (empty($href)) return '';

        $id = $attributes['id'] ?? 'embedpress-document-' . rand(100, 10000);
        $client_id = $attributes['clientId'] ?? md5($id);
        $contentShare = $attributes['contentShare'] ?? false;
        $styling = self::build_styling_config($attributes, $protection_data);


        ob_start();
    ?>
        <div class="wp-block-embedpress-document" data-embed-type="Document">
            <?php self::render_embed_content($content, $contentShare, $id, $attributes, $should_display_content, $protection_data, $styling); ?>
            <?php self::render_ad_template($attributes, $content, $client_id); ?>
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
        $contentShare = $attributes['contentShare'] ?? false;

        $styling = self::build_styling_config($attributes, $protection_data);

        // Build the complete HTML structure
        ob_start();
    ?>
        <div class="wp-block-embedpress-pdf" data-embed-type="PDF">
            <?php self::render_embed_content($content, $contentShare, $id, $attributes, $should_display_content, $protection_data, $styling); ?>
            <?php self::render_ad_template($attributes, $content, $client_id); ?>
        </div>
    <?php

        return ob_get_clean();
    }

    /**
     * Generate PDF parameters for viewer configuration
     * Based on the self::generate_pdf_params function from the old implementation
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
        $yt_channel_class = (isset($attributes['url']) && Helper::is_youtube_channel($attributes['url'])) ? 'embedded-youtube-channel' : '';

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

        <div class="embedpress-gutenberg-wrapper source-provider-<?php echo Helper::get_provider_name($url); ?> <?php echo esc_attr($wrapper_classes); ?>" id="<?php echo esc_attr($block_id); ?>" data-embed-type="<?php echo Helper::get_provider_name($url); ?> ">
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

    /**
     * YouTube block legacy render method
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param object $block Block object (unused but kept for compatibility)
     * @return string Rendered HTML content
     */
    public static function render_youtube_block($attributes, $content = '', $block = null)
    {

        if (!empty($content)) {
            return $content;
        }
        // Extract basic attributes for YouTube block
        $iframe_src = $attributes['iframeSrc'] ?? '';
        $align = $attributes['align'] ?? 'center';

        // If no iframe source is provided, return empty
        if (empty($iframe_src)) {
            return '';
        }

        // Validate YouTube URL
        if (!self::is_youtube_url($iframe_src)) {
            return '';
        }

        // Apply YouTube parameters filter
        $youtube_params = apply_filters('embedpress_gutenberg_youtube_params', []);
        $processed_iframe_url = $iframe_src;

        foreach ($youtube_params as $param => $value) {
            $processed_iframe_url = add_query_arg($param, $value, $processed_iframe_url);
        }

        // Build alignment class
        $align_class = 'align' . $align;

        // Generate YouTube block HTML
        ob_start();
    ?>
        <div class="ose-youtube wp-block-embed-youtube ose-youtube-single-video <?php echo esc_attr($align_class); ?>">
            <iframe src="<?php echo esc_url($processed_iframe_url); ?>"
                allowtransparency="true"
                allowfullscreen="true"
                frameborder="0"
                width="640" height="360">
            </iframe>
        </div>
    <?php
        return ob_get_clean();
    }

    /**
     * Validate if URL is a YouTube URL
     *
     * @param string $url URL to validate
     * @return bool True if valid YouTube URL, false otherwise
     */
    private static function is_youtube_url($url)
    {
        $pattern = '/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))|youtu.be\/([a-zA-Z0-9_-]{11})/';
        return preg_match($pattern, $url);
    }

    /**
     * Wistia block legacy render method
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param object $block Block object (unused but kept for compatibility)
     * @return string Rendered HTML content
     */
    public static function render_wistia_block($attributes, $content = '', $block = null)
    {
        if (!empty($content)) {
            return $content;
        }

        // Extract basic attributes for Wistia block
        $url = $attributes['url'] ?? '';
        $iframe_src = $attributes['iframeSrc'] ?? '';
        $align = $attributes['align'] ?? 'center';

        // If no URL is provided, return empty
        if (empty($url)) {
            return '';
        }

        // Extract Wistia media ID from URL
        $wistia_id = self::extract_wistia_id($url);
        if (empty($wistia_id)) {
            return '';
        }

        // Build alignment class
        $align_class = 'align' . $align;

        // Generate Wistia block HTML
        ob_start();
    ?>
        <div class="ose-wistia wp-block-embed-youtube <?php echo esc_attr($align_class); ?>" id="wistia_<?php echo esc_attr($wistia_id); ?>">
            <iframe src="<?php echo esc_url($iframe_src); ?>"
                allowtransparency="true"
                frameborder="0"
                class="wistia_embed"
                name="wistia_embed"
                width="600"
                height="330">
            </iframe>
            <?php do_action('embedpress_gutenberg_wistia_block_after_embed', $attributes); ?>
        </div>
<?php
        return ob_get_clean();
    }

    /**
     * Extract Wistia media ID from URL
     *
     * @param string $url Wistia URL
     * @return string|false Wistia media ID or false if not found
     */
    private static function extract_wistia_id($url)
    {
        preg_match('~medias/(.*)~i', esc_url($url), $matches);
        return isset($matches[1]) ? $matches[1] : false;
    }
}
?>