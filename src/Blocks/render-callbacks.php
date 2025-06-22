<?php

/**
 * EmbedPress Block Render Callbacks
 *
 * This file contains the render callback functions for EmbedPress blocks
 * using the new centralized block system.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Include frontend renderer
require_once __DIR__ . '/EmbedPress/frontend-renderer.php';

/**
 * Render callback for the EmbedPress block
 *
 * This function now only handles dynamic content that requires real-time data.
 * Static content is handled by the save function and frontend renderer.
 *
 * @param array $attributes Block attributes
 * @param string $content Block content
 * @param WP_Block $block Block instance
 * @return string Rendered block HTML
 */
function embedpress_callback_render_block($attributes, $content = '', $block = null) {


    // Get block attributes with defaults
    $url = $attributes['url'] ?? '';

    // Debug logging
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('EmbedPress render_callback called: URL=' . $url . ', Content length=' . strlen($content));
    }

    // If no URL is provided, return the saved content or empty
    if (empty($url)) {
        return $content;
    }

    // Get width and height early
    $width = $attributes['width'] ?? '600';
    $height = $attributes['height'] ?? '400';

    // Check if this is dynamic content that requires render_callback
    if (!embedpress_is_dynamic_provider($url)) {
        // For static content, ALWAYS return the saved content from save() function
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('EmbedPress: Returning saved content for static URL: ' . $url);
        }
        return $content;
    }

    // Only process dynamic content that requires real-time synchronization
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('EmbedPress: Processing dynamic content: ' . $url);
    }
    $clientId = $attributes['clientId'] ?? '';
    $contentShare = $attributes['contentShare'] ?? false;
    $sharePosition = $attributes['sharePosition'] ?? 'right';
    // $lockContent = $attributes['lockContent'] ?? false; // Reserved for future use
    $customPlayer = $attributes['customPlayer'] ?? false;
    $playerPreset = $attributes['playerPreset'] ?? 'preset-default';
    $customlogo = $attributes['customlogo'] ?? '';
    $logoX = $attributes['logoX'] ?? 5;
    $logoY = $attributes['logoY'] ?? 10;
    $logoOpacity = $attributes['logoOpacity'] ?? 0.6;
    $adManager = $attributes['adManager'] ?? false;
    $adSource = $attributes['adSource'] ?? 'image';
    $adFileUrl = $attributes['adFileUrl'] ?? '';
    $adXPosition = $attributes['adXPosition'] ?? 25;
    $adYPosition = $attributes['adYPosition'] ?? 20;

    // Social sharing attributes
    $shareFacebook = $attributes['shareFacebook'] ?? true;
    $shareTwitter = $attributes['shareTwitter'] ?? true;
    $sharePinterest = $attributes['sharePinterest'] ?? true;
    $shareLinkedin = $attributes['shareLinkedin'] ?? true;

    // Build CSS classes
    $classes = ['wp-block-embedpress-embedpress'];

    if ($contentShare) {
        $classes[] = 'ep-content-share-enabled';
        $classes[] = 'ep-share-position-' . $sharePosition;
    }

    if ($customPlayer) {
        $classes[] = $playerPreset;
    }

    // Generate embed HTML for dynamic content
    $embedHTML = embedpress_get_embed_html($url, $width, $height, $attributes);

    if (empty($embedHTML)) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('EmbedPress: Failed to generate embed HTML for dynamic content: ' . $url);
        }
        return sprintf(
            '<div class="embedpress-error" style="padding: 20px; text-align: center; border: 1px solid #ddd; background: #f9f9f9;">
                <p>%s</p>
                <small>URL: %s</small>
            </div>',
            __('Unable to embed dynamic content from this URL.', 'embedpress'),
            esc_html($url)
        );
    }

    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('EmbedPress: Successfully generated embed HTML for dynamic content: ' . $url);
    }

    // Generate social share HTML
    $shareHTML = '';
    if ($contentShare) {
        $shareHTML = embedpress_generate_share_html($sharePosition, $shareFacebook, $shareTwitter, $sharePinterest, $shareLinkedin);
    }

    // Generate custom logo HTML
    $logoHTML = '';
    if ($customlogo) {
        $logoHTML = sprintf(
            '<img class="watermark" src="%s" style="position: absolute; left: %dpx; top: %dpx; opacity: %s; z-index: 10; pointer-events: none;" />',
            esc_url($customlogo),
            intval($logoX),
            intval($logoY),
            floatval($logoOpacity)
        );
    }

    // Generate ad HTML
    $adHTML = '';
    if ($adManager && $adSource === 'image' && $adFileUrl) {
        $adHTML = sprintf(
            '<div class="embedpress-ad" style="position: absolute; left: %dpx; top: %dpx; z-index: 5;">
                <img src="%s" alt="Advertisement" />
            </div>',
            intval($adXPosition),
            intval($adYPosition),
            esc_url($adFileUrl)
        );
    }

    // Apply width and height to the embed HTML
    if ($embedHTML && ($width || $height)) {
        // Add width and height styles to iframes
        $embedHTML = preg_replace(
            '/<iframe([^>]*)>/i',
            '<iframe$1 style="width: ' . intval($width) . 'px; height: ' . intval($height) . 'px; max-width: 100%;">',
            $embedHTML
        );
    }

    // Build the final HTML with proper dimensions
    $wrapperStyle = 'position: relative; display: inline-block;';

    $html = sprintf(
        '<div class="%s" data-source-id="source-%s">
            <div class="gutenberg-block-wraper">
                <div class="ep-embed-content-wraper position-%s-wraper" style="%s">
                    %s
                    %s
                    %s
                    %s
                </div>
            </div>
        </div>',
        esc_attr(implode(' ', $classes)),
        esc_attr($clientId),
        esc_attr($sharePosition),
        esc_attr($wrapperStyle),
        $embedHTML,
        $logoHTML,
        $shareHTML,
        $adHTML
    );

    return $html;
}

/**
 * Get embed HTML from EmbedPress API
 *
 * @param string $url URL to embed
 * @param string $width Width
 * @param string $height Height
 * @param array $attributes All block attributes
 * @return string Embed HTML
 */
function embedpress_get_embed_html($url, $width, $height, $attributes) {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('EmbedPress: Generating embed HTML for URL: ' . $url . ' (Width: ' . $width . ', Height: ' . $height . ')');
    }

    // Handle Spotify URLs specifically
    if (strpos($url, 'open.spotify.com') !== false) {
        // Convert Spotify URL to embed format
        $embed_url = str_replace('open.spotify.com', 'open.spotify.com/embed', $url);
        // Remove query parameters for cleaner embed
        $embed_url = strtok($embed_url, '?');

        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('EmbedPress: Using Spotify embed for: ' . $embed_url);
        }

        return sprintf(
            '<iframe src="%s" width="%d" height="%d" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>',
            esc_url($embed_url),
            intval($width),
            intval($height)
        );
    }

    // Try WordPress oEmbed first for better compatibility
    $embed = wp_oembed_get($url, array(
        'width' => intval($width),
        'height' => intval($height)
    ));

    if ($embed) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('EmbedPress: WordPress oEmbed successful for: ' . $url);
        }
        return $embed;
    }

    // Try EmbedPress shortcode system
    if (class_exists('\\EmbedPress\\Shortcode')) {
        try {
            // Use EmbedPress shortcode parsing directly
            $embed_result = \EmbedPress\Shortcode::parseContent($url, false, [
                'width' => intval($width),
                'height' => intval($height)
            ]);

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
    }

    // Handle YouTube URLs
    if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/', $url, $matches)) {
        $video_id = $matches[1];
        $embed_url = 'https://www.youtube.com/embed/' . $video_id;

        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('EmbedPress: Using YouTube embed for: ' . $embed_url);
        }

        return sprintf(
            '<iframe src="%s" width="%d" height="%d" frameborder="0" allowfullscreen></iframe>',
            esc_url($embed_url),
            intval($width),
            intval($height)
        );
    }

    // Handle Vimeo URLs
    if (preg_match('/vimeo\.com\/(\d+)/', $url, $matches)) {
        $video_id = $matches[1];
        $embed_url = 'https://player.vimeo.com/video/' . $video_id;

        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('EmbedPress: Using Vimeo embed for: ' . $embed_url);
        }

        return sprintf(
            '<iframe src="%s" width="%d" height="%d" frameborder="0" allowfullscreen></iframe>',
            esc_url($embed_url),
            intval($width),
            intval($height)
        );
    }

    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('EmbedPress: All embed methods failed for: ' . $url);
    }

    // Last resort fallback - show the URL as a link
    $fallback_html = sprintf(
        '<div style="padding: 15px; border: 1px solid #ddd; background: #f9f9f9; text-align: center;">
            <p><strong>EmbedPress:</strong> Could not embed content</p>
            <a href="%s" target="_blank" rel="noopener">%s</a>
        </div>',
        esc_url($url),
        esc_html($url)
    );

    return apply_filters('embedpress_custom_embed_html', $fallback_html, $url, $width, $height, $attributes);
}

/**
 * Generate social share HTML
 *
 * @param string $position Share position
 * @param bool $facebook Include Facebook
 * @param bool $twitter Include Twitter
 * @param bool $pinterest Include Pinterest
 * @param bool $linkedin Include LinkedIn
 * @return string Share HTML
 */
function embedpress_generate_share_html($position, $facebook, $twitter, $pinterest, $linkedin) {
    $html = '<div class="ep-social-share share-position-' . esc_attr($position) . '">';

    if ($facebook) {
        $html .= '<a href="#" class="ep-social-icon facebook" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        </a>';
    }

    if ($twitter) {
        $html .= '<a href="#" class="ep-social-icon twitter" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
        </a>';
    }

    if ($pinterest) {
        $html .= '<a href="#" class="ep-social-icon pinterest" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
            </svg>
        </a>';
    }

    if ($linkedin) {
        $html .= '<a href="#" class="ep-social-icon linkedin" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        </a>';
    }

    $html .= '</div>';

    return $html;
}
