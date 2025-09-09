<?php

namespace EmbedPress\Gutenberg;

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * EmbedPress Fallback Handler
 * 
 * Handles edge cases where migration might fail or content cannot be properly migrated.
 * Provides graceful fallbacks to ensure content remains functional.
 */
class FallbackHandler
{
    /**
     * Instance of this class
     */
    private static $instance = null;

    /**
     * Get instance
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct()
    {
        // Hook into block rendering to provide fallbacks
        add_filter('render_block', [$this, 'handle_block_fallback'], 10, 2);
        add_filter('render_block_data', [$this, 'handle_block_data_fallback'], 10, 1);
    }

    /**
     * Handle block rendering fallback
     */
    public function handle_block_fallback($block_content, $block)
    {
        // Only handle EmbedPress blocks
        if ($block['blockName'] !== 'embedpress/embedpress') {
            return $block_content;
        }

        // If block content is empty or invalid, try to generate fallback
        if (empty($block_content) || $this->is_invalid_content($block_content)) {
            return $this->generate_fallback_content($block);
        }

        return $block_content;
    }

    /**
     * Handle block data fallback before rendering
     */
    public function handle_block_data_fallback($block)
    {
        // Only handle EmbedPress blocks
        if ($block['blockName'] !== 'embedpress/embedpress') {
            return $block;
        }

        // Check if block has corrupted or missing attributes
        if (!isset($block['attrs']) || !is_array($block['attrs'])) {
            $block['attrs'] = $this->get_default_attributes();
        }

        // Validate and fix critical attributes
        $block['attrs'] = $this->validate_and_fix_attributes($block['attrs']);

        return $block;
    }

    /**
     * Check if content is invalid
     */
    private function is_invalid_content($content)
    {
        // Check for common signs of invalid content
        $invalid_patterns = [
            'undefined',
            'null',
            '[object Object]',
            'NaN',
            'Error:',
            'Fatal error'
        ];

        foreach ($invalid_patterns as $pattern) {
            if (strpos($content, $pattern) !== false) {
                return true;
            }
        }

        // Check if content is just whitespace
        if (trim($content) === '') {
            return true;
        }

        return false;
    }

    /**
     * Generate fallback content for failed blocks
     */
    private function generate_fallback_content($block)
    {
        $attrs = $block['attrs'] ?? [];
        $url = $attrs['url'] ?? '';
        $embedHTML = $attrs['embedHTML'] ?? '';

        // Try to use existing embedHTML first
        if (!empty($embedHTML) && !$this->is_invalid_content($embedHTML)) {
            return $this->wrap_fallback_content($embedHTML, 'Using cached embed content');
        }

        // Try to generate new embed from URL
        if (!empty($url)) {
            $generated_embed = $this->generate_embed_from_url($url);
            if ($generated_embed) {
                return $this->wrap_fallback_content($generated_embed, 'Generated from URL');
            }
        }

        // Last resort: show error message with URL
        return $this->generate_error_fallback($url);
    }

    /**
     * Generate embed content from URL
     */
    private function generate_embed_from_url($url)
    {
        // Use WordPress oEmbed to try to generate content
        $embed = wp_oembed_get($url);
        
        if ($embed) {
            return $embed;
        }

        return false;
    }

    /**
     * Wrap fallback content with indicator
     */
    private function wrap_fallback_content($content, $reason = '')
    {
        $debug_info = '';
        
        if (defined('WP_DEBUG') && WP_DEBUG && !empty($reason)) {
            $debug_info = "<!-- EmbedPress Fallback: {$reason} -->";
        }

        return $debug_info . '<div class="embedpress-fallback-content">' . $content . '</div>';
    }

    /**
     * Generate error fallback
     */
    private function generate_error_fallback($url = '')
    {
        $message = __('EmbedPress: Content could not be loaded.', 'embedpress');
        
        if (!empty($url)) {
            $message .= ' ' . sprintf(__('Original URL: %s', 'embedpress'), esc_url($url));
        }

        $html = '<div class="embedpress-error-fallback" style="padding: 20px; border: 1px solid #ddd; background: #f9f9f9; text-align: center;">';
        $html .= '<p>' . esc_html($message) . '</p>';
        
        if (!empty($url)) {
            $html .= '<p><a href="' . esc_url($url) . '" target="_blank" rel="noopener">' . __('View Original Content', 'embedpress') . '</a></p>';
        }
        
        $html .= '</div>';

        return $html;
    }

    /**
     * Get default attributes for fallback
     */
    private function get_default_attributes()
    {
        return [
            'url' => '',
            'embedHTML' => '',
            'height' => '600',
            'width' => '600',
            'customPlayer' => [],
            'sharePosition' => 'bottom',
            'isFallback' => true
        ];
    }

    /**
     * Validate and fix attributes
     */
    private function validate_and_fix_attributes($attrs)
    {
        $defaults = $this->get_default_attributes();
        
        // Ensure all required attributes exist
        foreach ($defaults as $key => $default_value) {
            if (!isset($attrs[$key])) {
                $attrs[$key] = $default_value;
            }
        }

        // Validate URL
        if (!empty($attrs['url']) && !filter_var($attrs['url'], FILTER_VALIDATE_URL)) {
            // Try to fix common URL issues
            $fixed_url = $this->fix_url($attrs['url']);
            if ($fixed_url) {
                $attrs['url'] = $fixed_url;
            } else {
                // If URL is completely invalid, clear it
                $attrs['url'] = '';
            }
        }

        // Validate dimensions
        $attrs['height'] = $this->validate_dimension($attrs['height'], '600');
        $attrs['width'] = $this->validate_dimension($attrs['width'], '600');

        // Validate customPlayer object
        if (!is_array($attrs['customPlayer'])) {
            $attrs['customPlayer'] = [];
        }

        return $attrs;
    }

    /**
     * Fix common URL issues
     */
    private function fix_url($url)
    {
        // Add protocol if missing
        if (!preg_match('/^https?:\/\//', $url)) {
            $url = 'https://' . $url;
        }

        // Validate the fixed URL
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return $url;
        }

        return false;
    }

    /**
     * Validate dimension values
     */
    private function validate_dimension($value, $default = '600')
    {
        // If it's a valid number or number with px/%, return as is
        if (is_numeric($value) || preg_match('/^\d+(px|%)?$/', $value)) {
            return $value;
        }

        return $default;
    }

    /**
     * Log fallback usage for debugging
     */
    private function log_fallback_usage($type, $details = [])
    {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $log_message = "EmbedPress Fallback Used: {$type}";
            
            if (!empty($details)) {
                $log_message .= ' - ' . json_encode($details);
            }
            
        }
    }

    /**
     * Check if fallback is needed for a specific block
     */
    public function is_fallback_needed($block)
    {
        if ($block['blockName'] !== 'embedpress/embedpress') {
            return false;
        }

        $attrs = $block['attrs'] ?? [];
        
        // Check for missing critical data
        if (empty($attrs['url']) && empty($attrs['embedHTML'])) {
            return true;
        }

        // Check for corrupted attributes
        if (!is_array($attrs)) {
            return true;
        }

        return false;
    }
}
