<?php

namespace EmbedPress\Src\Blocks;

use EmbedPress\Includes\Classes\Helper;
use EmbedPress\Core\AssetManager;

/**
 * Block Manager for EmbedPress
 * 
 * Handles registration and management of all EmbedPress Gutenberg blocks
 * using the new centralized structure.
 */
class BlockManager
{

    /**
     * Instance of this class
     */
    private static $instance = null;

    /**
     * Blocks directory path
     */
    private $blocks_path;

    /**
     * Blocks directory URL
     */
    private $blocks_url;

    /**
     * Available blocks
     */
    private $available_blocks = [
        'EmbedPress' => [
            'name' => 'embedpress/embedpress',
            'render_callback' => 'embedpress_render_block',
            'setting_key' => 'embedpress'
        ]
    ];

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
        $this->blocks_path = EMBEDPRESS_PATH_BASE . 'src/Blocks/';
        $this->blocks_url = EMBEDPRESS_URL_ASSETS . '../src/Blocks/';

        // Initialize the centralized asset manager
        AssetManager::init();

        add_action('init', [$this, 'register_blocks']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_block_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_editor_assets']);
    }

    /**
     * Register all blocks
     */
    public function register_blocks()
    {
        if (!function_exists('register_block_type')) {
            return;
        }

        $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
        $g_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];

        // Debug logging
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('EmbedPress BlockManager: Elements option: ' . print_r($elements, true));
            error_log('EmbedPress BlockManager: Gutenberg blocks: ' . print_r($g_blocks, true));
        }

        // Ensure embedpress block is enabled by default if no settings exist
        if (empty($elements) || !isset($elements['gutenberg'])) {
            $this->ensure_default_blocks_enabled();
            $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
            $g_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
        }

        foreach ($this->available_blocks as $block_folder => $block_config) {
            $setting_key = $block_config['setting_key'];

            // Check if block is enabled in settings
            if (!empty($g_blocks[$setting_key])) {
                $this->register_single_block($block_folder, $block_config);
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log("EmbedPress BlockManager: Registered block {$block_config['name']}");
                }
            } else {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log("EmbedPress BlockManager: Block {$block_config['name']} not enabled in settings");
                }
                // Unregister if disabled
                if (\WP_Block_Type_Registry::get_instance()->is_registered($block_config['name'])) {
                    unregister_block_type($block_config['name']);
                }
            }
        }
    }

    /**
     * Register a single block
     */
    private function register_single_block($block_folder, $block_config)
    {
        $block_path = $this->blocks_path . $block_folder;
        $block_json_path = $block_path . '/block.json';

        if (!file_exists($block_json_path)) {
            return;
        }

        // Register block with additional configuration
        $block_args = [];

        if (isset($block_config['render_callback'])) {
            $block_args['render_callback'] = $block_config['render_callback'];
        }

        // Add attributes from the old system for compatibility
        if ($block_config['name'] === 'embedpress/embedpress') {
            $block_args['attributes'] = $this->get_embedpress_block_attributes();
        }

        register_block_type($block_json_path, $block_args);
    }

    /**
     * Get EmbedPress block attributes for compatibility
     */
    private function get_embedpress_block_attributes()
    {
        return [
            'clientId' => [
                'type' => 'string',
            ],
            'height' => [
                'type' => 'string',
                'default' => '600'
            ],
            'width' => [
                'type' => 'string',
                'default' => '600'
            ],
            'lockContent' => [
                'type' => 'boolean',
                'default' => false
            ],
            'protectionType' => [
                'type' => 'string',
                'default' => 'password'
            ],
            'userRole' => [
                'type' => 'array',
                'default' => []
            ],
            'password' => [
                'type' => 'string',
                'default' => ''
            ],
            'customPlayer' => [
                'type' => 'boolean',
                'default' => false
            ],
            'playerPreset' => [
                'type' => 'string',
                'default' => 'default'
            ],
            'playerColor' => [
                'type' => 'string',
                'default' => '#00b3ff'
            ],
            'powered_by' => [
                'type' => 'boolean',
                'default' => true
            ],
            'adManager' => [
                'type' => 'boolean',
                'default' => false
            ],
            'adSource' => [
                'type' => 'string',
                'default' => 'image'
            ],
            'adXPosition' => [
                'type' => 'number',
                'default' => 25
            ],
            'adYPosition' => [
                'type' => 'number',
                'default' => 20
            ],
            'adUrl' => [
                'type' => 'string',
                'default' => ''
            ],
            'adStart' => [
                'type' => 'string',
                'default' => '10'
            ],
            'adSkipButton' => [
                'type' => 'boolean',
                'default' => true
            ],
            'adSkipButtonAfter' => [
                'type' => 'string',
                'default' => '5'
            ]
        ];
    }

    /**
     * Enqueue block assets for both frontend and backend
     * Now handled by AssetManager
     */
    public function enqueue_block_assets()
    {
        // Assets are now handled by the centralized AssetManager
        // This method is kept for backward compatibility
    }

    /**
     * Enqueue editor assets
     */
    public function enqueue_editor_assets()
    {
        // Assets are now handled by AssetManager, but we still need to localize the script
        $this->localize_editor_script();
    }

    /**
     * Localize editor script with necessary data
     */
    private function localize_editor_script()
    {
        $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);
        $active_blocks = isset($elements['gutenberg']) ? (array) $elements['gutenberg'] : [];

        $localize_data = [
            'pluginDirPath' => EMBEDPRESS_PATH_BASE,
            'pluginDirUrl' => EMBEDPRESS_URL_ASSETS . '../',
            'active_blocks' => $active_blocks,
            'can_upload_media' => current_user_can('upload_files'),
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('embedpress_nonce'),
            'rest_url' => rest_url('embedpress/v1/'),
            'site_url' => site_url(),
        ];

        // Debug logging
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('EmbedPress BlockManager: Localizing script with data: ' . print_r($localize_data, true));
        }

        wp_localize_script(
            'embedpress-blocks-js',
            'embedpressObj',
            $localize_data
        );
    }

    /**
     * Add a new block to the available blocks list
     */
    public function add_block($folder_name, $config)
    {
        $this->available_blocks[$folder_name] = $config;
    }

    /**
     * Ensure default blocks are enabled if no settings exist
     */
    private function ensure_default_blocks_enabled()
    {
        $elements = (array) get_option(EMBEDPRESS_PLG_NAME . ":elements", []);

        // If no gutenberg settings exist, create default ones
        if (!isset($elements['gutenberg'])) {
            $elements['gutenberg'] = [];
        }

        // Enable embedpress block by default
        if (!isset($elements['gutenberg']['embedpress'])) {
            $elements['gutenberg']['embedpress'] = 'embedpress';
            update_option(EMBEDPRESS_PLG_NAME . ":elements", $elements);

            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('EmbedPress BlockManager: Enabled embedpress block by default');
            }
        }
    }

    /**
     * Get available blocks
     */
    public function get_available_blocks()
    {
        return $this->available_blocks;
    }
}
