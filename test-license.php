<?php
/**
 * Test script to check license detection
 *
 * Access via: /wp-content/plugins/embedpress/test-license.php
 */

// Load WordPress
require_once('../../../wp-load.php');

// Load our License Manager
require_once('EmbedPress/Includes/Classes/Analytics/License_Manager.php');

use EmbedPress\Includes\Classes\Analytics\License_Manager;

echo "<h1>EmbedPress License Test</h1>";

echo "<h2>Plugin Status:</h2>";
echo "<p>EmbedPress Pro Plugin Active: " . (is_plugin_active('embedpress-pro/embedpress-pro.php') ? 'YES' : 'NO') . "</p>";
echo "<p>EMBEDPRESS_SL_ITEM_SLUG defined: " . (defined('EMBEDPRESS_SL_ITEM_SLUG') ? 'YES (' . EMBEDPRESS_SL_ITEM_SLUG . ')' : 'NO') . "</p>";
echo "<p>Bootstrap class exists: " . (class_exists('\Embedpress\Pro\Classes\Bootstrap') ? 'YES' : 'NO') . "</p>";

echo "<h2>License Manager Results:</h2>";
echo "<p>Has Pro License: " . (License_Manager::has_pro_license() ? 'YES' : 'NO') . "</p>";

echo "<h2>Feature Status:</h2>";
$features = License_Manager::get_feature_status();
echo "<pre>";
print_r($features);
echo "</pre>";

echo "<h2>Individual Feature Checks:</h2>";
$test_features = [
    'per_embed_analytics',
    'geo_tracking',
    'device_analytics',
    'referral_tracking',
    'email_reports'
];

foreach ($test_features as $feature) {
    echo "<p>$feature: " . (License_Manager::has_analytics_feature($feature) ? 'AVAILABLE' : 'NOT AVAILABLE') . "</p>";
}

echo "<h2>Constants Check:</h2>";
$constants = [
    'EMBEDPRESS_PRO_PLUGIN_FILE',
    'EMBEDPRESS_PRO_PLUGIN_VERSION',
    'EMBEDPRESS_SL_ITEM_ID',
    'EMBEDPRESS_SL_ITEM_NAME',
    'EMBEDPRESS_SL_ITEM_SLUG',
    'EMBEDPRESS_STORE_URL',
    'EMBEDPRESS_SL_DB_PREFIX'
];

foreach ($constants as $constant) {
    echo "<p>$constant: " . (defined($constant) ? constant($constant) : 'NOT DEFINED') . "</p>";
}

echo "<h2>Analytics Manager Test:</h2>";
require_once('EmbedPress/Includes/Classes/Analytics/Analytics_Manager.php');
require_once('EmbedPress/Includes/Classes/Analytics/Data_Collector.php');

use EmbedPress\Includes\Classes\Analytics\Analytics_Manager;

$analytics_manager = Analytics_Manager::get_instance();
echo "<p>Analytics Manager created successfully</p>";

echo "<h2>Test Pro Features Data:</h2>";
$data_collector = new \EmbedPress\Includes\Classes\Analytics\Data_Collector();

// Test per-embed analytics
$per_embed = $data_collector->get_unique_viewers_per_embed(['date_range' => 30]);
echo "<p>Per Embed Analytics: " . count($per_embed) . " items</p>";
if (!empty($per_embed)) {
    echo "<h3>Sample Per-Embed Data:</h3>";
    echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
    echo "<tr><th>Title</th><th>Type</th><th>Unique Viewers</th><th>Views</th><th>Clicks</th><th>Impressions</th></tr>";
    foreach (array_slice($per_embed, 0, 3) as $item) {
        echo "<tr>";
        echo "<td>" . esc_html($item['title']) . "</td>";
        echo "<td>" . esc_html($item['embed_type']) . "</td>";
        echo "<td>" . esc_html($item['unique_viewers']) . "</td>";
        echo "<td>" . esc_html($item['total_views']) . "</td>";
        echo "<td>" . esc_html($item['total_clicks']) . "</td>";
        echo "<td>" . esc_html($item['total_impressions']) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
}

// Test geo analytics
$geo = $data_collector->get_geo_analytics(['date_range' => 30]);
echo "<p>Geo Analytics Countries: " . count($geo['countries']) . " items</p>";

// Test device analytics
$device = $data_collector->get_device_analytics(['date_range' => 30]);
echo "<p>Device Analytics: " . count($device['devices']) . " devices</p>";

// Test referral analytics
$referral = $data_collector->get_referral_analytics(['date_range' => 30]);
echo "<p>Referral Analytics: " . count($referral) . " sources</p>";

echo "<h2>Chart.js Test:</h2>";
echo '<div id="chart-test" style="width: 400px; height: 200px; border: 1px solid #ccc; margin: 10px 0;"></div>';
echo '<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>';
echo '<script>
document.addEventListener("DOMContentLoaded", function() {
    if (typeof Chart !== "undefined") {
        console.log("Chart.js loaded successfully");
        document.getElementById("chart-test").innerHTML = "<p style=\"color: green; padding: 20px;\">✅ Chart.js is loaded and working!</p>";
    } else {
        console.log("Chart.js not loaded");
        document.getElementById("chart-test").innerHTML = "<p style=\"color: red; padding: 20px;\">❌ Chart.js failed to load</p>";
    }
});
</script>';
?>
