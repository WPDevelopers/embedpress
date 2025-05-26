<?php
/**
 * EmbedPress Analytics Test File
 *
 * This file can be used to test the analytics functionality
 * Run this file from WordPress admin or via WP-CLI to test analytics
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Test Analytics System
 */
function embedpress_test_analytics() {
    echo "<h2>EmbedPress Analytics Test</h2>";

    // Test 1: Check if Analytics Manager is available
    echo "<h3>Test 1: Analytics Manager Availability</h3>";
    if (class_exists('EmbedPress\Includes\Classes\Analytics\Analytics_Manager')) {
        echo "✅ Analytics Manager class is available<br>";

        $analytics_manager = \EmbedPress\Includes\Classes\Analytics\Analytics_Manager::get_instance();
        if ($analytics_manager) {
            echo "✅ Analytics Manager instance created successfully<br>";
        } else {
            echo "❌ Failed to create Analytics Manager instance<br>";
        }
    } else {
        echo "❌ Analytics Manager class not found<br>";
        return;
    }

    // Test 2: Check database tables
    echo "<h3>Test 2: Database Tables</h3>";
    global $wpdb;

    $tables = [
        'content' => $wpdb->prefix . 'embedpress_analytics_content',
        'views' => $wpdb->prefix . 'embedpress_analytics_views',
        'browser_info' => $wpdb->prefix . 'embedpress_analytics_browser_info',
        'milestones' => $wpdb->prefix . 'embedpress_analytics_milestones'
    ];

    foreach ($tables as $name => $table) {
        $exists = $wpdb->get_var("SHOW TABLES LIKE '$table'");
        if ($exists) {
            echo "✅ Table '$name' exists: $table<br>";
        } else {
            echo "❌ Table '$name' missing: $table<br>";
        }
    }

    // Test 3: Test data insertion
    echo "<h3>Test 3: Data Insertion Test</h3>";

    // Test content tracking
    $test_content_id = 'test_' . time();
    $test_data = [
        'embed_type' => 'YouTube',
        'embed_url' => 'https://www.youtube.com/watch?v=test123',
        'post_id' => 1,
        'page_url' => home_url('/test'),
        'title' => 'Test Content'
    ];

    do_action('embedpress_content_embedded', $test_content_id, 'shortcode', $test_data);

    // Check if content was inserted
    $content_exists = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM {$tables['content']} WHERE content_id = %s",
        $test_content_id
    ));

    if ($content_exists) {
        echo "✅ Test content tracking successful<br>";
    } else {
        echo "❌ Test content tracking failed<br>";
    }

    // Test 4: Test analytics data retrieval
    echo "<h3>Test 4: Analytics Data Retrieval</h3>";

    try {
        $analytics_data = $analytics_manager->get_analytics_data();
        if (is_array($analytics_data)) {
            echo "✅ Analytics data retrieval successful<br>";
            echo "Content by type: " . json_encode($analytics_data['content_by_type']) . "<br>";
        } else {
            echo "❌ Analytics data retrieval failed<br>";
        }
    } catch (Exception $e) {
        echo "❌ Analytics data retrieval error: " . $e->getMessage() . "<br>";
    }

    // Test 5: Test milestone system
    echo "<h3>Test 5: Milestone System</h3>";

    try {
        $milestone_data = $analytics_manager->get_milestone_data();
        if (is_array($milestone_data)) {
            echo "✅ Milestone data retrieval successful<br>";
            echo "Recent achievements: " . count($milestone_data['recent_achievements']) . "<br>";
            echo "Notifications: " . count($milestone_data['notifications']) . "<br>";
        } else {
            echo "❌ Milestone data retrieval failed<br>";
        }
    } catch (Exception $e) {
        echo "❌ Milestone data retrieval error: " . $e->getMessage() . "<br>";
    }

    // Test 6: Test REST API endpoints
    echo "<h3>Test 6: REST API Endpoints</h3>";

    $rest_endpoints = [
        'embedpress/v1/analytics/track',
        'embedpress/v1/analytics/data',
        'embedpress/v1/analytics/content',
        'embedpress/v1/analytics/views',
        'embedpress/v1/analytics/browser',
        'embedpress/v1/analytics/milestones'
    ];

    foreach ($rest_endpoints as $endpoint) {
        $route_exists = rest_get_server()->get_routes()['/' . $endpoint] ?? false;
        if ($route_exists) {
            echo "✅ REST endpoint exists: $endpoint<br>";
        } else {
            echo "❌ REST endpoint missing: $endpoint<br>";
        }
    }

    // Test 7: Test browser detection
    echo "<h3>Test 7: Browser Detection</h3>";

    try {
        $browser_detector = new \EmbedPress\Includes\Classes\Analytics\Browser_Detector();
        $browser_info = $browser_detector->detect();

        if (is_array($browser_info) && isset($browser_info['browser_name'])) {
            echo "✅ Browser detection successful<br>";
            echo "Browser: " . $browser_info['browser_name'] . " " . $browser_info['browser_version'] . "<br>";
            echo "OS: " . $browser_info['operating_system'] . "<br>";
            echo "Device: " . $browser_info['device_type'] . "<br>";
        } else {
            echo "❌ Browser detection failed<br>";
        }
    } catch (Exception $e) {
        echo "❌ Browser detection error: " . $e->getMessage() . "<br>";
    }

    // Add some sample data for testing
    echo "<h3>Adding Sample Data</h3>";

    $sample_data = [
        [
            'content_id' => 'sample_youtube_1',
            'content_type' => 'shortcode',
            'embed_type' => 'YouTube',
            'embed_url' => 'https://www.youtube.com/watch?v=sample1',
            'post_id' => 1,
            'page_url' => home_url('/sample-page-1'),
            'title' => 'Sample YouTube Video 1'
        ],
        [
            'content_id' => 'sample_vimeo_1',
            'content_type' => 'gutenberg',
            'embed_type' => 'Vimeo',
            'embed_url' => 'https://vimeo.com/sample1',
            'post_id' => 2,
            'page_url' => home_url('/sample-page-2'),
            'title' => 'Sample Vimeo Video 1'
        ],
        [
            'content_id' => 'sample_twitter_1',
            'content_type' => 'elementor',
            'embed_type' => 'Twitter',
            'embed_url' => 'https://twitter.com/user/status/sample1',
            'post_id' => 3,
            'page_url' => home_url('/sample-page-3'),
            'title' => 'Sample Twitter Post 1'
        ]
    ];

    foreach ($sample_data as $data) {
        do_action('embedpress_content_embedded', $data['content_id'], $data['content_type'], $data);
        echo "✅ Added sample content: {$data['embed_type']} via {$data['content_type']}<br>";
    }

    // Add some sample views
    echo "<h3>Adding Sample Views</h3>";

    $analytics_manager = \EmbedPress\Includes\Classes\Analytics\Analytics_Manager::get_instance();

    for ($i = 0; $i < 10; $i++) {
        $view_data = [
            'content_id' => 'sample_youtube_1',
            'session_id' => 'sample_session_' . $i,
            'interaction_type' => 'view',
            'page_url' => home_url('/sample-page-1'),
            'view_duration' => rand(1000, 10000),
            'post_id' => 1
        ];

        $analytics_manager->track_interaction($view_data);
    }

    echo "✅ Added 10 sample views<br>";

    // Cleanup test data (but keep sample data)
    echo "<h3>Cleanup</h3>";
    $deleted = $wpdb->delete($tables['content'], ['content_id' => $test_content_id]);
    if ($deleted) {
        echo "✅ Test data cleaned up successfully<br>";
    } else {
        echo "⚠️ Test data cleanup may have failed<br>";
    }

    echo "<h3>Test Complete</h3>";
    echo "<p>Analytics system test completed. Check the results above for any issues.</p>";
}

// Run test if accessed directly (for debugging)
if (isset($_GET['test_analytics']) && current_user_can('manage_options')) {
    embedpress_test_analytics();
}

/**
 * Test REST API endpoint directly
 */
function embedpress_test_rest_api() {
    echo "<h2>EmbedPress REST API Test</h2>";

    // Test user permissions
    echo "<h3>User Permissions Check</h3>";
    echo "<p>Current user can manage_options: " . (current_user_can('manage_options') ? '✅ Yes' : '❌ No') . "</p>";
    echo "<p>Current user ID: " . get_current_user_id() . "</p>";
    echo "<p>Is user logged in: " . (is_user_logged_in() ? '✅ Yes' : '❌ No') . "</p>";

    // Test the tracking endpoint
    $rest_url = rest_url('embedpress/v1/analytics/track');
    echo "<h3>Testing Tracking Endpoint (Public)</h3>";
    echo "<p>Endpoint URL: <code>$rest_url</code></p>";

    // Create test data
    $test_data = [
        'content_id' => 'test_' . time(),
        'session_id' => 'test_session_' . time(),
        'interaction_type' => 'view',
        'page_url' => home_url('/test'),
        'view_duration' => 5000,
        'post_id' => 1
    ];

    // Make the request
    $response = wp_remote_post($rest_url, [
        'body' => $test_data,
        'timeout' => 30
    ]);

    if (is_wp_error($response)) {
        echo "<p style='color: red;'>❌ Request failed: " . $response->get_error_message() . "</p>";
    } else {
        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);

        echo "<p><strong>Status Code:</strong> $status_code</p>";
        echo "<p><strong>Response:</strong></p>";
        echo "<pre>" . esc_html($body) . "</pre>";

        if ($status_code === 200) {
            echo "<p style='color: green;'>✅ Tracking endpoint is working!</p>";
        } else {
            echo "<p style='color: red;'>❌ Tracking endpoint returned error status</p>";
        }
    }

    // Test admin endpoints
    echo "<h3>Testing Admin Endpoints</h3>";

    $admin_endpoints = [
        'data' => rest_url('embedpress/v1/analytics/data'),
        'content' => rest_url('embedpress/v1/analytics/content'),
        'views' => rest_url('embedpress/v1/analytics/views'),
        'browser' => rest_url('embedpress/v1/analytics/browser'),
        'milestones' => rest_url('embedpress/v1/analytics/milestones')
    ];

    foreach ($admin_endpoints as $name => $url) {
        echo "<h4>Testing $name endpoint</h4>";
        echo "<p>URL: <code>$url</code></p>";

        $response = wp_remote_get($url, [
            'timeout' => 30,
            'cookies' => $_COOKIE // Pass cookies for authentication
        ]);

        if (is_wp_error($response)) {
            echo "<p style='color: red;'>❌ Request failed: " . $response->get_error_message() . "</p>";
        } else {
            $status_code = wp_remote_retrieve_response_code($response);
            $body = wp_remote_retrieve_body($response);

            echo "<p><strong>Status Code:</strong> $status_code</p>";

            if ($status_code === 200) {
                echo "<p style='color: green;'>✅ $name endpoint is working!</p>";
                $data = json_decode($body, true);
                if ($data) {
                    echo "<p><strong>Sample data:</strong> " . count($data) . " items returned</p>";
                }
            } else {
                echo "<p style='color: red;'>❌ $name endpoint returned error status</p>";
                echo "<p><strong>Response:</strong></p>";
                echo "<pre>" . esc_html(substr($body, 0, 500)) . "</pre>";
            }
        }
    }
}

// Add REST API test to admin menu
add_action('admin_menu', function() {
    add_submenu_page(
        'embedpress',
        'REST API Test',
        'REST API Test',
        'manage_options',
        'embedpress-rest-test',
        'embedpress_test_rest_api'
    );
});

// Add admin menu for testing
add_action('admin_menu', function() {
    add_submenu_page(
        'embedpress',
        'Analytics Test',
        'Analytics Test',
        'manage_options',
        'embedpress-analytics-test',
        'embedpress_test_analytics'
    );
});
