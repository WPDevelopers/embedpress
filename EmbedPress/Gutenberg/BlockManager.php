<?php

namespace EmbedPress\Gutenberg;

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
            'render_callback' => [EmbedPressBlockRenderer::class, 'render'],
            'setting_key' => 'embedpress',
            'supports_save_function' => true
        ],
        'embedpress-pdf' => [
            'name' => 'embedpress/embedpress-pdf',
            'render_callback' => [EmbedPressBlockRenderer::class, 'render_embedpress_pdf'],
            'setting_key' => 'embedpress-pdf',
            'supports_save_function' => true
        ],
        'document' => [
            'name' => 'embedpress/document',
            'render_callback' => [EmbedPressBlockRenderer::class, 'render_document'],
            'setting_key' => 'document',
            'supports_save_function' => true
        ],
        'embedpress-calendar' => [
            'name' => 'embedpress/embedpress-calendar',
            'render_callback' => [EmbedPressBlockRenderer::class, 'render_embedpress_calendar'],
            'setting_key' => 'embedpress-calendar',
            'supports_save_function' => true
        ],
        'youtube-block' => [
            'name' => 'embedpress/youtube-block',
            'render_callback' => [EmbedPressBlockRenderer::class, 'render_youtube_block'],
            'setting_key' => 'youtube-block',
            'supports_save_function' => false
        ],
        'wistia-block' => [
            'name' => 'embedpress/wistia-block',
            'render_callback' => [EmbedPressBlockRenderer::class, 'render_wistia_block'],
            'setting_key' => 'wistia-block',
            'supports_save_function' => false
        ],
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
        // Use src directory if it exists (development), otherwise use built assets (production/distribution)
        if (file_exists(EMBEDPRESS_PATH_BASE . 'src/Blocks/')) {
            $this->blocks_path = EMBEDPRESS_PATH_BASE . 'src/Blocks/';
            $this->blocks_url = EMBEDPRESS_URL_STATIC . '../src/Blocks/';
        } else {
            // Fallback to built assets directory when src is not available (distribution)
            $this->blocks_path = EMBEDPRESS_PATH_BASE . 'assets/blocks/';
            $this->blocks_url = EMBEDPRESS_URL_ASSETS . 'blocks/';
        }
        

        // AssetManager is initialized in Core/init.php

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
            } else {
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

        // Check if we're in development mode (src directory exists) or distribution mode
        $is_development_mode = file_exists(EMBEDPRESS_PATH_BASE . 'src/Blocks/');

        if ($is_development_mode && file_exists($block_json_path)) {
            // Development mode: Use block.json files
            $block_args = [];

            // For blocks that support save function, render_callback is only used for dynamic content
            if (isset($block_config['render_callback'])) {
                $block_args['render_callback'] = $block_config['render_callback'];
            }

            // Add attributes from the old system for compatibility
            if ($block_config['name'] === 'embedpress/embedpress') {
                $block_args['attributes'] = $this->get_embedpress_block_attributes();
            } else if ($block_config['name'] === 'embedpress/embedpress-pdf') {
                $block_args['attributes'] = $this->get_embedpress_pdf_attributes();
            } else if ($block_config['name'] === 'embedpress/document') {
                $block_args['attributes'] = $this->get_embedpress_doc_attributes();
            } else if ($block_config['name'] === 'embedpress/youtube-block') {
                $block_args['attributes'] = $this->get_youtube_block_attributes();
            } else if ($block_config['name'] === 'embedpress/wistia-block') {
                $block_args['attributes'] = $this->get_wistia_block_attributes();
            }

            register_block_type($block_json_path, $block_args);
        } else {
            // Distribution mode: Register blocks directly without block.json
            // The JavaScript registration is handled by the bundled blocks.build.js file
            // We only need to register the server-side render callbacks

            $block_args = [
                'render_callback' => $block_config['render_callback'] ?? null,
            ];

            // Add attributes for server-side rendering
            if ($block_config['name'] === 'embedpress/embedpress') {
                $block_args['attributes'] = $this->get_embedpress_block_attributes();
            } else if ($block_config['name'] === 'embedpress/embedpress-pdf') {
                $block_args['attributes'] = $this->get_embedpress_pdf_attributes();
            } else if ($block_config['name'] === 'embedpress/document') {
                $block_args['attributes'] = $this->get_embedpress_doc_attributes();
            } else if ($block_config['name'] === 'embedpress/youtube-block') {
                $block_args['attributes'] = $this->get_youtube_block_attributes();
            } else if ($block_config['name'] === 'embedpress/wistia-block') {
                $block_args['attributes'] = $this->get_wistia_block_attributes();
            }

            // Only register if not already registered by JavaScript
            if (!\WP_Block_Type_Registry::get_instance()->is_registered($block_config['name'])) {
                register_block_type($block_config['name'], $block_args);
            } else {
                // Block already registered by JavaScript, just update the render callback
                $block_type = \WP_Block_Type_Registry::get_instance()->get_registered($block_config['name']);
                if ($block_type && isset($block_config['render_callback'])) {
                    $block_type->render_callback = $block_config['render_callback'];
                }
            }
        }
    }

    /**
     * Get EmbedPress block attributes for compatibility
     */
    private function get_embedpress_block_attributes()
    {
        // Base attributes for all embeds
        $attributes = [
            // Core attributes
            'clientId' => [
                'type' => 'string',
            ],
            'url' => [
                'type' => 'string',
                'default' => ''
            ],
            'providerName' => [
                'type' => 'string',
                'default' => ''
            ],
            'embedHTML' => [
                'type' => 'string',
                'default' => ''
            ],
            'height' => [
                'type' => 'string',
                'default' => '600'
            ],
            'width' => [
                'type' => 'string',
                'default' => '600'
            ],

            // State attributes
            'editingURL' => [
                'type' => 'boolean',
                'default' => false
            ],
            'fetching' => [
                'type' => 'boolean',
                'default' => false
            ],
            'cannotEmbed' => [
                'type' => 'boolean',
                'default' => false
            ],
            'interactive' => [
                'type' => 'boolean',
                'default' => false
            ],
            'align' => [
                'type' => 'string',
                'default' => 'center'
            ],


            // Custom Player
            'customPlayer' => [
                'type' => 'boolean',
                'default' => false
            ],
            'playerPreset' => [
                'type' => 'string',
                'default' => 'preset-default'
            ],
            'playerColor' => [
                'type' => 'string',
                'default' => '#5b4e96',
            ],
            'autoPause' => [
                'type' => 'boolean',
                'default' => false
            ],
            'posterThumbnail' => [
                'type' => 'string',
                'default' => ''
            ],
            'playerPip' => [
                'type' => 'boolean',
                'default' => true
            ],
            'playerRestart' => [
                'type' => 'boolean',
                'default' => true
            ],
            'playerRewind' => [
                'type' => 'boolean',
                'default' => false
            ],
            'playerFastForward' => [
                'type' => 'boolean',
                'default' => false
            ],
            'playerTooltip' => [
                'type' => 'boolean',
                'default' => true
            ],
            'playerHideControls' => [
                'type' => 'boolean',
                'default' => false
            ],
            'powered_by' => [
                'type' => 'boolean',
                'default' => true
            ],
        ];

        // Add provider-specific attributes
        $attributes = array_merge($attributes, $this->get_youtube_attributes());
        $attributes = array_merge($attributes, $this->get_vimeo_attributes());
        $attributes = array_merge($attributes, $this->get_wistia_attributes());
        $attributes = array_merge($attributes, $this->get_instagram_attributes());
        $attributes = array_merge($attributes, $this->get_calendly_attributes());
        $attributes = array_merge($attributes, $this->get_podcast_attributes());
        $attributes = array_merge($attributes, $this->get_google_photos_attributes());
        $attributes = array_merge($attributes, $this->get_nft_attributes());
        $attributes = array_merge($attributes, $this->get_ad_manager_attributes());
        $attributes = array_merge($attributes, $this->get_content_protection_attributes());
        $attributes = array_merge($attributes, $this->get_social_sharing_attributes());
        $attributes = array_merge($attributes, $this->get_custom_branding_attributes());

        return $attributes;
    }

    /**
     * Get PDF-specific attributes
     */
    private function get_embedpress_pdf_attributes()
    {
        $attributes = [
            'clientId' => [
                'type' => 'string',
            ],
            'id' => [
                'type' => 'string'
            ],
            'href' => [
                'type' => 'string'
            ],
            'fileName' => [
                'type' => 'string',
            ],
            'mime' => [
                'type' => 'string',
            ],
            'url' => [
                'type' => 'string',
                'default' => ''
            ],
            'height' => [
                'type' => 'string',
                'default' => '600'
            ],
            'width' => [
                'type' => 'string',
                'default' => '600'
            ],
            'viewerStyle' => [
                'type' => 'string',
                'default' => 'modern'
            ],
            'themeMode' => [
                'type' => 'string',
                'default' => 'default'
            ],
            'customColor' => [
                'type' => 'string',
                'default' => '#403A81'
            ],
            'toolbar' => [
                'type' => 'boolean',
                'default' => true
            ],
            'presentation' => [
                'type' => 'boolean',
                'default' => true
            ],
            'lazyLoad' => [
                'type' => 'boolean',
                'default' => false
            ],
            'position' => [
                'type' => 'string',
                'default' => 'top'
            ],
            'flipbook_toolbar_position' => [
                'type' => 'string',
                'default' => 'bottom'
            ],
            'download' => [
                'type' => 'boolean',
                'default' => true
            ],
            'open' => [
                'type' => 'boolean',
                'default' => false
            ],
            'copy_text' => [
                'type' => 'boolean',
                'default' => true
            ],
            'add_text' => [
                'type' => 'boolean',
                'default' => true
            ],
            'draw' => [
                'type' => 'boolean',
                'default' => true
            ],
            'add_image' => [
                'type' => 'boolean',
                'default' => true
            ],
            'zoomIn' => [
                'type' => 'boolean',
                'default' => true
            ],
            'zoomOut' => [
                'type' => 'boolean',
                'default' => true
            ],
            'fitView' => [
                'type' => 'boolean',
                'default' => true
            ],
            'bookmark' => [
                'type' => 'boolean',
                'default' => true
            ],
            'doc_details' => [
                'type' => 'boolean',
                'default' => true
            ],
            'doc_rotation' => [
                'type' => 'boolean',
                'default' => true
            ],
            'unitoption' => [
                'type' => 'string',
                'default' => '%'
            ],
            'powered_by' => [
                'type' => 'boolean',
                'default' => true
            ],

        ];

        $attributes = array_merge($attributes, $this->get_content_protection_attributes());
        $attributes = array_merge($attributes, $this->get_social_sharing_attributes());
        $attributes = array_merge($attributes, $this->get_custom_branding_attributes());

        return $attributes;
    }

    private function get_embedpress_doc_attributes()
    {
        $attributes = [
            'clientId' => [
                'type' => 'string',
            ],

            'id' => [
                'type' => 'string',
            ],
            'href' => [
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
            'fileName' => [
                'type' => 'string',
            ],
            'mime' => [
                'type' => 'string',
            ],
            'powered_by' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'presentation' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'docViewer' => [
                'type' => 'string',
                'default' => 'custom',
            ],
            'themeMode' => [
                'type' => 'string',
                'default' => 'default',
            ],
            'customColor' => [
                'type' => 'string',
                'default' => '#403A81',
            ],
            'position' => [
                'type' => 'string',
                'default' => 'top',
            ],
            'download' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'open' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'copy_text' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'draw' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'toolbar' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'doc_rotation' => [
                'type' => 'boolean',
                'default' => true,
            ],
        ];

        $attributes = array_merge($attributes, $this->get_content_protection_attributes());
        $attributes = array_merge($attributes, $this->get_social_sharing_attributes());
        $attributes = array_merge($attributes, $this->get_custom_branding_attributes());

        return $attributes;
    }

    /**
     * Get YouTube block-specific attributes (for legacy youtube-block)
     */
    private function get_youtube_block_attributes()
    {
        return [
            'url' => [
                'type' => 'string',
                'default' => ''
            ],
            'iframeSrc' => [
                'type' => 'string',
                'default' => ''
            ],
            'mediaId' => [
                'type' => 'string',
                'default' => ''
            ],
            'align' => [
                'type' => 'string',
                'default' => 'center'
            ]
        ];
    }

    /**
     * Get Wistia block-specific attributes (for legacy wistia-block)
     */
    private function get_wistia_block_attributes()
    {
        return [
            'url' => [
                'type' => 'string',
                'default' => ''
            ],
            'iframeSrc' => [
                'type' => 'string',
                'default' => ''
            ],
            'align' => [
                'type' => 'string',
                'default' => 'center'
            ]
        ];
    }

    /**
     * Get ContenProtection-specific attributes
     */
    private function get_content_protection_attributes()
    {
        return [
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
            'protectionMessage' => [
                'type' => 'string',
                'default' => 'You do not have access to this content. Only users with the following roles can view it: [user_roles]'
            ],
            'contentPassword' => [
                'type' => 'string',
                'default' => ''
            ],
            'lockHeading' => [
                'type' => 'string',
                'default' => 'Content Locked'
            ],
            'lockSubHeading' => [
                'type' => 'string',
                'default' => 'Content is locked and requires password to access it.'
            ],
            'lockErrorMessage' => [
                'type' => 'string',
                'default' => 'Oops, that wasn\'t the right password. Try again.'
            ],
            'passwordPlaceholder' => [
                'type' => 'string',
                'default' => 'Password'
            ],
            'submitButtonText' => [
                'type' => 'string',
                'default' => 'Unlock'
            ],
            'submitUnlockingText' => [
                'type' => 'string',
                'default' => 'Unlocking'
            ],
            'enableFooterMessage' => [
                'type' => 'boolean',
                'default' => false
            ],
            'footerMessage' => [
                'type' => 'string',
                'default' => 'In case you don\'t have the password, kindly reach out to content owner or administrator to request access.'
            ],
        ];
    }

    /**
     * Get SocialSharing-specific attributes
     */
    private function get_social_sharing_attributes()
    {
        return [
            'contentShare' => [
                'type' => 'boolean',
                'default' => false
            ],
            'sharePosition' => [
                'type' => 'string',
                'default' => 'right'
            ],
            'customTitle' => [
                'type' => 'string',
                'default' => ''
            ],
            'customDescription' => [
                'type' => 'string',
                'default' => ''
            ],
            'customThumbnail' => [
                'type' => 'string',
                'default' => ''
            ],
            'shareFacebook' => [
                'type' => 'boolean',
                'default' => true
            ],
            'shareTwitter' => [
                'type' => 'boolean',
                'default' => true
            ],
            'sharePinterest' => [
                'type' => 'boolean',
                'default' => true
            ],
            'shareLinkedin' => [
                'type' => 'boolean',
                'default' => true
            ],
        ];
    }

    /**
     * Get CustomBranding-specific attributes
     */
    private function get_custom_branding_attributes()
    {
        return [
            'customlogo' => [
                'type' => 'string',
                'default' => ''
            ],
            'logoX' => [
                'type' => 'number',
                'default' => 5
            ],
            'logoY' => [
                'type' => 'number',
                'default' => 10
            ],
            'customlogoUrl' => [
                'type' => 'string',
            ],
            'logoOpacity' => [
                'type' => 'number',
                'default' => 0.6
            ],
        ];
    }


    /**
     * Get YouTube-specific attributes
     */
    private function get_youtube_attributes()
    {
        return [
            // YouTube specific attributes
            'ispagination' => [
                'type' => 'boolean',
                'default' => true
            ],
            'ytChannelLayout' => [
                'type' => 'string',
                'default' => 'gallery'
            ],
            'pagesize' => [
                'type' => 'string',
                'default' => '6'
            ],
            'columns' => [
                'type' => 'string',
                'default' => '3'
            ],
            'gapbetweenvideos' => [
                'type' => 'number',
                'default' => 30
            ],
            'videosize' => [
                'type' => 'string',
                'default' => 'fixed',
            ],
            'starttime' => [
                'type' => 'string',
            ],
            'endtime' => [
                'type' => 'string',
            ],
            'autoplay' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'muteVideo' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'controls' => [
                'type' => 'string',
            ],
            'fullscreen' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'videoannotations' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'progressbarcolor' => [
                'type' => 'string',
                'default' => 'red'
            ],
            'closedcaptions' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'modestbranding' => [
                'type' => 'string',
            ],
            'relatedvideos' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'showinfo' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'showLoop' => [
                'type' => 'boolean',
                'default' => true,
            ],
        ];
    }

    /**
     * Get Vimeo-specific attributes
     */
    private function get_vimeo_attributes()
    {
        return [
            'vimeoAutoplay' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'vimeoLoop' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'vimeoPortrait' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'vimeoTitle' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'vimeoByline' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'vimeoColor' => [
                'type' => 'string',
                'default' => '#00adef'
            ],
            'vimeoDnt' => [
                'type' => 'boolean',
                'default' => false,
            ],
            // Additional Vimeo attributes
            'vstarttime' => [
                'type' => 'string',
            ],
            'vautoplay' => [
                'type' => 'boolean',
                'default' => false
            ],
            'vscheme' => [
                'type' => 'string',
            ],
            'vtitle' => [
                'type' => 'boolean',
                'default' => true
            ],
            'vauthor' => [
                'type' => 'boolean',
                'default' => true
            ],
            'vavatar' => [
                'type' => 'boolean',
                'default' => true
            ],
            'vloop' => [
                'type' => 'boolean',
                'default' => false
            ],
            'vautopause' => [
                'type' => 'boolean',
                'default' => false
            ],
            'vdnt' => [
                'type' => 'boolean',
                'default' => false
            ],
        ];
    }

    /**
     * Get Wistia-specific attributes
     */
    private function get_wistia_attributes()
    {
        return [
            'wstarttime' => [
                'type' => 'string',
            ],
            'wautoplay' => [
                'type' => 'boolean',
                'default' => true
            ],
            'scheme' => [
                'type' => 'string',
            ],
            'captions' => [
                'type' => 'boolean',
                'default' => true
            ],
            'playbutton' => [
                'type' => 'boolean',
                'default' => true
            ],
            'smallplaybutton' => [
                'type' => 'boolean',
                'default' => true
            ],
            'playbar' => [
                'type' => 'boolean',
                'default' => true
            ],
            'resumable' => [
                'type' => 'boolean',
                'default' => true
            ],
            'wistiafocus' => [
                'type' => 'boolean',
                'default' => true
            ],
            'volumecontrol' => [
                'type' => 'boolean',
                'default' => true
            ],
            'volume' => [
                'type' => 'number',
                'default' => 100
            ],
            'rewind' => [
                'type' => 'boolean',
                'default' => false
            ],
            'wfullscreen' => [
                'type' => 'boolean',
                'default' => true
            ],
        ];
    }

    /**
     * Get Instagram-specific attributes
     */
    private function get_instagram_attributes()
    {
        return [
            'instaLayout' => [
                'type' => 'string',
                'default' => 'insta-grid'
            ],
            'carouselArrows' => [
                'type' => 'boolean',
                'default' => true
            ],
            'carouselSpacing' => [
                'type' => 'string',
                'default' => '0'
            ],
            'carouselDots' => [
                'type' => 'boolean',
                'default' => false
            ],
            // Instagram Feed attributes
            'instafeedFeedType' => [
                'type' => 'string',
                'default' => 'user_account_type',
            ],
            'instafeedAccountType' => [
                'type' => 'string',
                'default' => 'personal',
            ],
            'instafeedProfileImage' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedProfileImageUrl' => [
                'type' => 'string',
                'default' => '',
            ],
            'instafeedFollowBtn' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedFollowBtnLabel' => [
                'type' => 'string',
                'default' => 'Follow',
            ],
            'instafeedPostsCount' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedPostsCountText' => [
                'type' => 'string',
                'default' => '[count] posts',
            ],
            'instafeedFollowersCount' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedFollowersCountText' => [
                'type' => 'string',
                'default' => '[count] followers',
            ],
            'instafeedAccName' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedColumns' => [
                'type' => 'string',
                'default' => '3'
            ],
            'instafeedColumnsGap' => [
                'type' => 'string',
                'default' => '5'
            ],
            'instafeedPostsPerPage' => [
                'type' => 'string',
                'default' => '12'
            ],
            'instafeedTab' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedLikesCount' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedCommentsCount' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedPopup' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedPopupFollowBtn' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedPopupFollowBtnLabel' => [
                'type' => 'string',
                'default' => 'Follow',
            ],
            'instafeedLoadmore' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'instafeedLoadmoreLabel' => [
                'type' => 'string',
                'default' => 'Load More',
            ],
            'slidesShow' => [
                'type' => 'string',
                'default' => '4'
            ],
            'slidesScroll' => [
                'type' => 'string',
                'default' => '4'
            ],
            'carouselAutoplay' => [
                'type' => 'boolean',
                'default' => false
            ],
            'autoplaySpeed' => [
                'type' => 'string',
                'default' => '3000'
            ],
            'transitionSpeed' => [
                'type' => 'string',
                'default' => '1000'
            ],
            'carouselLoop' => [
                'type' => 'boolean',
                'default' => true
            ],
        ];
    }

    /**
     * Get Calendly-specific attributes
     */
    private function get_calendly_attributes()
    {
        return [
            'cEmbedType' => [
                'type' => 'string',
                'default' => 'inline'
            ],
            'calendlyData' => [
                'type' => 'boolean',
                'default' => false
            ],
            'hideCookieBanner' => [
                'type' => 'boolean',
                'default' => false
            ],
            'hideEventTypeDetails' => [
                'type' => 'boolean',
                'default' => false
            ],
            'cBackgroundColor' => [
                'type' => 'string',
                'default' => 'ffffff'
            ],
            'cTextColor' => [
                'type' => 'string',
                'default' => '1A1A1A'
            ],
            'cButtonLinkColor' => [
                'type' => 'string',
                'default' => '0000FF'
            ],
            'cPopupButtonText' => [
                'type' => 'string',
                'default' => 'Schedule time with me'
            ],
            'cPopupButtonBGColor' => [
                'type' => 'string',
                'default' => '0000FF'
            ],
            'cPopupButtonTextColor' => [
                'type' => 'string',
                'default' => 'FFFFFF'
            ],
            'cPopupLinkText' => [
                'type' => 'string',
                'default' => 'Schedule time with me'
            ],
        ];
    }

    /**
     * Get Podcast-specific attributes (Spreaker)
     */
    private function get_podcast_attributes()
    {
        return [
            // Spreaker attributes
            'theme' => [
                'type' => 'string',
                'default' => 'light'
            ],
            'color' => [
                'type' => 'string',
                'default' => ''
            ],
            'coverImageUrl' => [
                'type' => 'string',
                'default' => ''
            ],
            'playlist' => [
                'type' => 'boolean',
                'default' => false
            ],
            'playlistContinuous' => [
                'type' => 'boolean',
                'default' => false
            ],
            'playlistLoop' => [
                'type' => 'boolean',
                'default' => false
            ],
            'playlistAutoupdate' => [
                'type' => 'boolean',
                'default' => true
            ],
            'chaptersImage' => [
                'type' => 'boolean',
                'default' => true
            ],
            'episodeImagePosition' => [
                'type' => 'string',
                'default' => 'right'
            ],
            'hideLikes' => [
                'type' => 'boolean',
                'default' => false
            ],
            'hideComments' => [
                'type' => 'boolean',
                'default' => false
            ],
            'hideSharing' => [
                'type' => 'boolean',
                'default' => false
            ],
            'hideLogo' => [
                'type' => 'boolean',
                'default' => false
            ],
            'hideEpisodeDescription' => [
                'type' => 'boolean',
                'default' => false
            ],
            'hidePlaylistDescriptions' => [
                'type' => 'boolean',
                'default' => false
            ],
            'hidePlaylistImages' => [
                'type' => 'boolean',
                'default' => false
            ],
            'hideDownload' => [
                'type' => 'boolean',
                'default' => false
            ],
        ];
    }

    /**
     * Get Google Photos-specific attributes
     */
    private function get_google_photos_attributes()
    {
        return [
            'mode' => [
                'type' => 'string',
                'default' => 'carousel'
            ],
            'imageWidth' => [
                'type' => 'number',
                'default' => 800
            ],
            'imageHeight' => [
                'type' => 'number',
                'default' => 600
            ],
            'playerAutoplay' => [
                'type' => 'boolean',
                'default' => false
            ],
            'delay' => [
                'type' => 'number',
                'default' => 5
            ],
            'repeat' => [
                'type' => 'boolean',
                'default' => true
            ],
            'mediaitemsAspectRatio' => [
                'type' => 'boolean',
                'default' => true
            ],
            'mediaitemsEnlarge' => [
                'type' => 'boolean',
                'default' => false
            ],
            'mediaitemsStretch' => [
                'type' => 'boolean',
                'default' => false
            ],
            'mediaitemsCover' => [
                'type' => 'boolean',
                'default' => false
            ],
            'backgroundColor' => [
                'type' => 'string',
                'default' => '#000000'
            ],
            'expiration' => [
                'type' => 'number',
                'default' => 60
            ],
        ];
    }

    /**
     * Get NFT/OpenSea-specific attributes
     */
    private function get_nft_attributes()
    {
        return [
            'limit' => [
                'type' => 'number',
                'default' => 20
            ],
            'itemperpage' => [
                'type' => 'number',
                'default' => 9
            ],
            'loadmore' => [
                'type' => 'boolean',
                'default' => false
            ],
            'loadmorelabel' => [
                'type' => 'text',
                'default' => 'Load More'
            ],
            'orderby' => [
                'type' => 'string',
                'default' => 'desc'
            ],
            'gapbetweenitem' => [
                'type' => 'number',
                'default' => 30
            ],
            'layout' => [
                'type' => 'string',
                'default' => 'ep-grid'
            ],
            'preset' => [
                'type' => 'string',
                'default' => 'preset-default'
            ],
            'nftperrow' => [
                'type' => 'number',
                'default' => 3
            ],
            'collectionname' => [
                'type' => 'boolean',
                'default' => true
            ],
            'nftimage' => [
                'type' => 'boolean',
                'default' => true
            ],
            'nfttitle' => [
                'type' => 'boolean',
                'default' => true
            ],
            'nftcreator' => [
                'type' => 'boolean',
                'default' => true
            ],
            'prefix_nftcreator' => [
                'type' => 'string',
                'default' => 'Created By'
            ],
            'nftprice' => [
                'type' => 'boolean',
                'default' => true
            ],
            'prefix_nftprice' => [
                'type' => 'string',
                'default' => 'Current Price'
            ],
            'nftlastsale' => [
                'type' => 'boolean',
                'default' => true
            ],
            'prefix_nftlastsale' => [
                'type' => 'string',
                'default' => 'Last Sale'
            ],
            'nftbutton' => [
                'type' => 'boolean',
                'default' => true
            ],
            'nftrank' => [
                'type' => 'boolean',
                'default' => true
            ],
            'label_nftrank' => [
                'type' => 'string',
                'default' => 'Rank'
            ],
            'nftdetails' => [
                'type' => 'boolean',
                'default' => true
            ],
            'label_nftdetails' => [
                'type' => 'string',
                'default' => 'Details'
            ],
            'label_nftbutton' => [
                'type' => 'string',
                'default' => 'See Details'
            ],
            'alignment' => [
                'type' => 'string',
                'default' => 'ep-item-center'
            ],
            // Color and Typography for NFT
            'itemBGColor' => [
                'type' => 'string',
            ],
            'collectionNameColor' => [
                'type' => 'string',
            ],
            'collectionNameFZ' => [
                'type' => 'number',
            ],
            'titleColor' => [
                'type' => 'string',
            ],
            'titleFontsize' => [
                'type' => 'number',
            ],
            'creatorColor' => [
                'type' => 'string',
            ],
            'creatorFontsize' => [
                'type' => 'number',
            ],
            'creatorLinkColor' => [
                'type' => 'string',
            ],
            'creatorLinkFontsize' => [
                'type' => 'number',
            ],
            'priceLabelColor' => [
                'type' => 'string',
            ],
            'priceLabelFontsize' => [
                'type' => 'number',
            ],
            'priceColor' => [
                'type' => 'string',
            ],
            'priceFontsize' => [
                'type' => 'number',
            ],
            'priceUSDColor' => [
                'type' => 'string',
            ],
            'priceUSDFontsize' => [
                'type' => 'number',
            ],
            'lastSaleLabelColor' => [
                'type' => 'string',
            ],
            'lastSaleLabelFontsize' => [
                'type' => 'number',
            ],
            'lastSaleColor' => [
                'type' => 'string',
            ],
            'lastSaleFontsize' => [
                'type' => 'number',
            ],
            'lastSaleUSDColor' => [
                'type' => 'string',
            ],
            'lastSaleUSDFontsize' => [
                'type' => 'number',
            ],
            'buttonTextColor' => [
                'type' => 'string',
            ],
            'buttonBackgroundColor' => [
                'type' => 'string',
            ],
            'buttonTextFontsize' => [
                'type' => 'number',
            ],
            'loadmoreTextColor' => [
                'type' => 'string',
            ],
            'loadmoreBackgroundColor' => [
                'type' => 'string',
            ],
            'loadmoreTextFontsize' => [
                'type' => 'number',
            ],
            'rankBtnColor' => [
                'type' => 'string',
            ],
            'rankBtnBorderColor' => [
                'type' => 'string',
            ],
            'rankBtnFZ' => [
                'type' => 'number',
            ],
            'rankLabelColor' => [
                'type' => 'string',
            ],
            'rankLabelFZ' => [
                'type' => 'number',
            ],
            'detialTitleColor' => [
                'type' => 'string',
            ],
            'detialTitleFZ' => [
                'type' => 'number',
            ],
            'detailTextColor' => [
                'type' => 'string',
            ],
            'detailTextLinkColor' => [
                'type' => 'string',
            ],
            'detailTextFZ' => [
                'type' => 'number',
            ],
        ];
    }

    /**
     * Get Ad Manager-specific attributes
     */
    private function get_ad_manager_attributes()
    {
        return [
            'adManager' => [
                'type' => 'boolean',
                'default' => false
            ],
            'adSource' => [
                'type' => 'string',
                'default' => 'video'
            ],
            'adContent' => [
                'type' => 'object',
            ],
            'adFileUrl' => [
                'type' => 'string',
                'default' => ''
            ],
            'adWidth' => [
                'type' => 'string',
                'default' => '300'
            ],
            'adHeight' => [
                'type' => 'string',
                'default' => '200'
            ],
            'adXPosition' => [
                'type' => 'number',
                'default' => 25
            ],
            'adYPosition' => [
                'type' => 'number',
                'default' => 10
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
            ],
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
     * Note: Localization is now handled by LocalizationManager
     */
    private function localize_editor_script()
    {
        // Localization is now handled by LocalizationManager
        // This method is kept for backward compatibility but functionality has been moved
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
        }

        // Enable embedpress-pdf block by default
        if (!isset($elements['gutenberg']['embedpress-pdf'])) {
            $elements['gutenberg']['embedpress-pdf'] = 'embedpress-pdf';
        }

        // Enable youtube-block by default for legacy support
        if (!isset($elements['gutenberg']['youtube-block'])) {
            $elements['gutenberg']['youtube-block'] = 'youtube-block';
        }

        // Enable wistia-block by default for legacy support
        if (!isset($elements['gutenberg']['wistia-block'])) {
            $elements['gutenberg']['wistia-block'] = 'wistia-block';
        }

        // Update options if any changes were made
        update_option(EMBEDPRESS_PLG_NAME . ":elements", $elements);
    }

    /**
     * Get available blocks
     */
    public function get_available_blocks()
    {
        return $this->available_blocks;
    }
}
