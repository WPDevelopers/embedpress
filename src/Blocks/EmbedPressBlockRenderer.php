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
        echo '<pre>';
        print_r($attributes);
        
        // Extract basic attributes
        $url = $attributes['url'] ?? '';
        $client_id = !empty($attributes['clientId']) ? md5($attributes['clientId']) : '';

        // Handle content protection
        $protection_data = self::extract_protection_data($attributes, $client_id);
        $should_display_content = self::should_display_content($protection_data);

        // Early return for non-dynamic providers with displayable content
        if ((empty($url) || !self::is_dynamic_provider($url)) && $should_display_content) {
            return $content;
        }

        // Process embed HTML if available
        if (!empty($attributes['embedHTML'])) {
            return self::render_embed_html($attributes, $content, $protection_data, $should_display_content);
        }

        return '';
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

                        <?php
                        self::render_ad_template($attributes, $embed, $client_id);
                        ?>
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
            self::render_displayable_content($embed, $content_share, $content_id, $attributes);
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
     */
    private static function render_displayable_content($embed, $content_share, $content_id, $attributes)
    {
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