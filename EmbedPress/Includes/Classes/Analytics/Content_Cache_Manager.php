<?php

namespace EmbedPress\Includes\Classes\Analytics;

/**
 * Content Cache Manager
 * 
 * Manages cache invalidation for EmbedPress content counting
 */
class Content_Cache_Manager
{
    /**
     * Data collector instance
     *
     * @var Data_Collector
     */
    private $data_collector;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->data_collector = new Data_Collector();
        $this->init_hooks();
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks()
    {
        // Clear cache when posts are saved/updated
        add_action('save_post', [$this, 'clear_cache_on_post_update'], 10, 1);
        add_action('wp_trash_post', [$this, 'clear_cache_on_post_update'], 10, 1);
        add_action('untrash_post', [$this, 'clear_cache_on_post_update'], 10, 1);
        add_action('delete_post', [$this, 'clear_cache_on_post_update'], 10, 1);
        
        // Clear cache when Elementor data is updated
        add_action('elementor/editor/after_save', [$this, 'clear_cache_on_elementor_update'], 10, 2);
        
        // Clear cache when blocks are updated (Gutenberg)
        add_action('rest_after_insert_post', [$this, 'clear_cache_on_post_update'], 10, 1);
        
        // Manual cache clear action for admin
        add_action('wp_ajax_embedpress_clear_content_cache', [$this, 'ajax_clear_cache']);
    }

    /**
     * Clear cache when post is updated
     *
     * @param int $post_id
     */
    public function clear_cache_on_post_update($post_id)
    {
        // Only clear cache for content types that can contain embeds
        $post_type = get_post_type($post_id);
        $allowed_post_types = apply_filters('embedpress_cache_clear_post_types', [
            'post', 'page', 'product', 'event', 'portfolio'
        ]);

        if (in_array($post_type, $allowed_post_types)) {
            $this->data_collector->clear_content_count_cache();
        }
    }

    /**
     * Clear cache when Elementor content is updated
     *
     * @param int $post_id
     * @param array $editor_data
     */
    public function clear_cache_on_elementor_update($post_id, $editor_data)
    {
        $this->data_collector->clear_content_count_cache();
    }

    /**
     * AJAX handler to manually clear cache
     */
    public function ajax_clear_cache()
    {
        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'embedpress_clear_cache')) {
            wp_die('Invalid nonce');
        }

        $this->data_collector->clear_content_count_cache();

        wp_send_json_success([
            'message' => 'Content count cache cleared successfully'
        ]);
    }

    /**
     * Get cache status for admin display
     *
     * @return array
     */
    public function get_cache_status()
    {
        $cache_key = 'embedpress_total_content_count';
        $cached_data = get_transient($cache_key);
        
        return [
            'is_cached' => $cached_data !== false,
            'cache_expiry' => $cached_data !== false ? get_option('_transient_timeout_' . $cache_key) : null,
            'last_updated' => $cached_data !== false ? time() - (HOUR_IN_SECONDS - (get_option('_transient_timeout_' . $cache_key) - time())) : null
        ];
    }
}
