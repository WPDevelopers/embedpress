<?php
/**
 * Test script for EmbedPress total embed count
 * 
 * This script can be run to test the new database scanning functionality
 * Run this from WordPress admin or via WP-CLI
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    // If running via WP-CLI or direct access, load WordPress
    require_once('../../../wp-load.php');
}

use EmbedPress\Includes\Classes\Analytics\Data_Collector;

// Test the new total content counting functionality
function test_embedpress_total_count() {
    echo "<h2>EmbedPress Total Embed Count Test</h2>\n";
    
    try {
        $data_collector = new Data_Collector();
        
        // Clear cache to get fresh data
        $data_collector->clear_content_count_cache();
        echo "<p>✅ Cache cleared</p>\n";
        
        // Get total content by type
        $content_by_type = $data_collector->get_total_content_by_type();
        
        echo "<h3>Content Count Results:</h3>\n";
        echo "<ul>\n";
        echo "<li><strong>Gutenberg Blocks:</strong> " . $content_by_type['gutenberg'] . "</li>\n";
        echo "<li><strong>Elementor Widgets:</strong> " . $content_by_type['elementor'] . "</li>\n";
        echo "<li><strong>Shortcodes:</strong> " . $content_by_type['shortcode'] . "</li>\n";
        echo "<li><strong>Total Embeds:</strong> " . $content_by_type['total'] . "</li>\n";
        echo "</ul>\n";
        
        // Test cache functionality
        echo "<h3>Cache Test:</h3>\n";
        $start_time = microtime(true);
        $cached_result = $data_collector->get_total_content_by_type();
        $cached_time = microtime(true) - $start_time;
        
        echo "<p>✅ Cached result retrieved in " . round($cached_time * 1000, 2) . "ms</p>\n";
        echo "<p>Cache and fresh results match: " . ($content_by_type === $cached_result ? '✅ Yes' : '❌ No') . "</p>\n";
        
        // Show some sample posts with EmbedPress content
        echo "<h3>Sample Posts with EmbedPress Content:</h3>\n";
        global $wpdb;
        
        $posts_with_blocks = $wpdb->get_results(
            "SELECT ID, post_title, post_type 
             FROM {$wpdb->posts} 
             WHERE post_content LIKE '%embedpress%' 
             AND post_status = 'publish' 
             LIMIT 5"
        );
        
        if ($posts_with_blocks) {
            echo "<ul>\n";
            foreach ($posts_with_blocks as $post) {
                echo "<li>#{$post->ID}: {$post->post_title} ({$post->post_type})</li>\n";
            }
            echo "</ul>\n";
        } else {
            echo "<p>No posts found with EmbedPress content.</p>\n";
        }
        
    } catch (Exception $e) {
        echo "<p>❌ Error: " . $e->getMessage() . "</p>\n";
    }
}

// Run the test if accessed directly
if (isset($_GET['test']) || (defined('WP_CLI') && WP_CLI)) {
    test_embedpress_total_count();
} else {
    echo "<p><a href='?test=1'>Click here to run the test</a></p>\n";
}
