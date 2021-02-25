<?php

namespace EmbedPress\Ends\Back;

use EmbedPress\Compatibility;

(defined( 'ABSPATH' ) && defined( 'EMBEDPRESS_IS_LOADED' )) or die( "No direct script access allowed." );

/**
 * Entity that handles the plugin's settings page.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Ends/Back
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Settings {
    /**
     * This class namespace.
     *
     * @since   1.0.0
     * @access  private
     * @static
     *
     * @var     string $namespace
     */
    private static $namespace = '\\EmbedPress\\Ends\\Back\\Settings';

    private static $has_general_settings_fields = null;

    /**
     * The plugin's unique identifier.
     *
     * @since   1.0.0
     * @access  private
     * @static
     *
     * @var     string $identifier
     */
    private static $identifier = "plg_embedpress";

    /**
     * Unique identifier to the plugin's admin settings section.
     *
     * @since   1.0.0
     * @access  private
     * @static
     *
     * @var     string $sectionAdminIdentifier
     */
    private static $sectionAdminIdentifier = "embedpress_options_admin";

    /**
     * Unique identifier to the plugin's general settings section.
     *
     * @since   1.0.0
     * @access  private
     * @static
     *
     * @var     string $sectionGroupIdentifier The name of the plugin.
     */
    private static $sectionGroupIdentifier = "embedpress";

    /**
     * Class constructor. This prevents the class being directly instantiated.
     *
     * @since   1.0.0
     */
    public function __construct() {
    }

    /**
     * This prevents the class being cloned.
     *
     * @since   1.0.0
     */
    public function __clone() {
    }

    /**
     * Method that adds an sub-item for EmbedPress to the WordPress Settings menu.
     *
     * @since   1.0.0
     * @static
     */
    public static function registerMenuItem() {
        add_menu_page( __('EmbedPress Settings', 'embedpress'), 'EmbedPress', 'manage_options', 'embedpress',
            [ self::$namespace, 'renderForm' ], null, 64 );
    }

    /**
     * Method that configures the EmbedPress settings page.
     *
     * @since   1.0.0
     * @static
     */
    public static function registerActions() {
        $activeTab = isset( $_GET['tab'] ) ? strtolower( $_GET['tab'] ) : "";
        if ( $activeTab !== "embedpress" ) {
            $action = "embedpress:{$activeTab}:settings:register";
        } else {
            $activeTab = "";
        }

        if ( !empty( $activeTab ) && has_action( $action ) ) {
            do_action( $action, [
                'id'   => self::$sectionAdminIdentifier,
                'slug' => self::$identifier,
            ] );
        } else {
            register_setting( self::$sectionGroupIdentifier, self::$sectionGroupIdentifier,
                [ self::$namespace, "validateForm" ] );

            add_settings_section( self::$sectionAdminIdentifier, '', null, self::$identifier );

            $fieldMap = [];
            if ( !Compatibility::isWordPress5() || Compatibility::isClassicalEditorActive() ) {
                $fieldMap = [
                    'enablePluginInAdmin'     => [
                        'label'   => __("Load previews in the admin editor", "embedpress"),
                        'section' => "admin",
                    ],
                    'enablePluginInFront'     => [
                        'label'   => __("Load previews in the frontend editor", "embedpress"),
                        'section' => "admin",
                    ],
                    'enableGlobalEmbedResize' => [
                        'label'   => __("Enable Global Embed Dimension", "embedpress"),
                        'section' => "admin",
                    ],
                    'enableEmbedResizeWidth'  => [
                        'label'   => __("Embed Iframe Width", "embedpress"),
                        'section' => "admin",
                    ],
                    'enableEmbedResizeHeight' => [
                        'label'   => __("Embed Iframe Height", "embedpress"),
                        'section' => "admin",
                    ]
                ];
            }
            self::$has_general_settings_fields = !empty( $fieldMap);
            foreach ( $fieldMap as $fieldName => $field ) {
                add_settings_field( $fieldName, $field['label'], [ self::$namespace, "renderField_{$fieldName}" ],
                    self::$identifier, self::${"section" . ucfirst( $field['section'] ) . "Identifier"} );
            }
        }
    }

    /**
     * Returns true if the plugin is active
     *
     * @param string $plugin
     *
     * @return boolean
     */
    protected static function is_plugin_active( $plugin ) {
        return is_plugin_active( "{$plugin}/{$plugin}.php" );
    }

    /**
     * Returns true if the plugin is installed
     *
     * @param string $plugin
     *
     * @return boolean
     */
    protected static function is_plugin_installed( $plugin ) {
        return file_exists( plugin_dir_path( EMBEDPRESS_ROOT ) . "{$plugin}/{$plugin}.php" );
    }

    /**
     * Method that render the settings's form.
     *
     * @since   1.0.0
     * @static
     */
    public static function renderForm() {
        // Add the color picker css file
        wp_enqueue_style( 'wp-color-picker' );
        // Include our custom jQuery file with WordPress Color Picker dependency
        wp_enqueue_script( 'ep-settings', EMBEDPRESS_URL_ASSETS . 'js/settings.js', [ 'wp-color-picker' ],
            EMBEDPRESS_VERSION, true );

        $activeTab                  = isset( $_GET['tab'] ) ? strtolower( $_GET['tab'] ) : "";
        $is_gen_tab_active          = ($activeTab === 'embedpress' || empty( $activeTab ));
        $settingsFieldsIdentifier   = !empty( $activeTab ) ? "embedpress:{$activeTab}" : self::$sectionGroupIdentifier;
        $settingsSectionsIdentifier = !empty( $activeTab ) ? "embedpress:{$activeTab}" : self::$identifier;
        $five_stars = `
<span class="dashicons dashicons-star-filled"></span>
<span class="dashicons dashicons-star-filled"></span>
<span class="dashicons dashicons-star-filled"></span>
<span class="dashicons dashicons-star-filled"></span>
<span  class="dashicons dashicons-star-filled"></span>
`;
        ?>
        <div id="embedpress-settings-wrapper">
            <header>
                <h1 class="pressshack-title">
                    <a href="//wordpress.org/plugins/embedpress" target="_blank" rel="noopener noreferrer"
                       title="EmbedPress">
                        EmbedPress
                    </a>
                </h1>
                <div class="embedpress-version-name">
                    <span class="free"> <?php esc_html_e("Core Version: ", "embedpress"); echo EMBEDPRESS_VERSION; ?></span>
                    <?php if ( defined( 'EMBEDPRESS_PRO_PLUGIN_VERSION' ) ) { ?>
                        <span class="pro"> <?php esc_html_e("Pro Version: ", "embedpress"); echo EMBEDPRESS_PRO_PLUGIN_VERSION; ?></span>
                    <?php } ?>
                </div>
            </header>

            <?php settings_errors(); ?>
            <div>
                <h2 class="nav-tab-wrapper">
                    <a href="?page=embedpress"
                       class="nav-tab<?php echo $is_gen_tab_active ? ' nav-tab-active' : ''; ?> ">
	                    <?php esc_html_e( 'General settings', 'embedpress'); ?>
                    </a>
                    <?php if ( !defined( 'EMBEDPRESS_PRO_PLUGIN_VERSION' ) ): ?>
                        <a href="?page=embedpress&tab=embedpress_get_pro"
                           class="nav-tab<?php echo $activeTab === 'embedpress_get_pro' ? ' nav-tab-active' : ''; ?> ">
	                        <?php esc_html_e( 'Go Premium', 'embedpress'); ?>
                        </a>
                    <?php endif; ?>
                    <?php do_action( 'embedpress:settings:render:tab', $activeTab ); ?>
                    <?php do_action( 'embedpress_license_tab', $activeTab ); ?>
                </h2>

                <?php if ( $activeTab !== 'addons' ) : ?>
                    <form action="options.php" method="POST" style="padding-bottom: 20px;">
                        <?php settings_fields( $settingsFieldsIdentifier ); ?>
                        <?php do_settings_sections( $settingsSectionsIdentifier ); ?>
                        <?php if (
                                $activeTab !== 'embedpress_license'
                                && $activeTab !== 'embedpress_get_pro'
                                && !($is_gen_tab_active && !self::$has_general_settings_fields)
                        ) {
                            ?>
                                <button type="submit" class="button button-primary embedpress-setting-save"><?php esc_html_e( 'Save Changes', 'embedpress'); ?>
                                </button>
                        <?php } ?>
                        <?php
                        if($is_gen_tab_active && !self::$has_general_settings_fields){
                            printf( "<h2 style='text-align: center'>%s</h2>", __("Welcome to EmbedPress", 'embedpress'));
                        }
                        ?>
                    </form>
                <?php endif; ?>
                <?php if ( $activeTab == 'embedpress_license' ) : ?>
                    <?php do_action( 'embedpress_license' ); ?>
                <?php endif; ?>
                <?php if ( $activeTab == 'embedpress_get_pro' && !defined( 'EMBEDPRESS_PRO_PLUGIN_VERSION' ) ) : ?>
                    <div class=" embedpress-go-premium">
                        <div class="embedpress-col-half">
                            <div class="embedpress-admin-block-wrapper">
                                <div class="embedpress-admin-block embedpress-admin-block-docs">
                                    <header class="embedpress-admin-block-header">
                                        <div class="embedpress-admin-block-header-icon">
                                            <img src="<?php echo plugins_url( 'assets/images/icon-why-premium.svg',
                                                EMBEDPRESS_PLUGIN_BASENAME ); ?>" alt="embedpress-go-pro">
                                        </div>
                                        <h4 class="embedpress-admin-title"><?php esc_html_e( 'Why upgrade to Premium Version?', 'embedpress'); ?></h4>
                                    </header>
                                    <div class="embedpress-admin-block-content">
                                        <p><?php esc_html_e( 'The premium version helps us to continue development of the product
                                            incorporating even more features and enhancements.', 'embedpress'); ?></p>
                                        <p><?php esc_html_e( 'You will also get world class support from our dedicated team, 24/7.', 'embedpress'); ?></p>
                                        <a href="https://wpdeveloper.net/plugins/embedpress#pricing" target="_blank"
                                           class="button embedpress-btn"><?php esc_html_e( 'Get Pro Version', 'embedpress'); ?></a>
                                    </div>
                                </div>
                            </div><!--admin block-wrapper end-->
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <footer>
                <p>
                    <a href="//embedpress.com/go/review-ep" target="_blank"
                       rel="noopener noreferrer">
                        <?php
                        /* translators: 1: EmbedPress Plugin Name, 2: 5 stars. */
                        printf( __('If you like %1$s please leave us a %2$s
                         rating. Thank you!', 'embedpress'), '<strong>EmbedPress</strong>', $five_stars ) ?>
                    </a>
                </p>
                <hr>
                <nav>
                    <ul>
                        <li>
                            <a href="//embedpress.com" target="_blank" rel="noopener noreferrer"
                               title="About EmbedPress"><?php esc_html_e( 'About', 'embedpress'); ?></a>
                        </li>
                        <li>
                            <a href="//embedpress.com/sources/" target="_blank" rel="noopener noreferrer"
                               title="List of supported sources by EmbedPress"><?php esc_html_e( 'Supported Sources', 'embedpress'); ?></a>
                        </li>
                        <li>
                            <a href="//embedpress.com/documentation/" target="_blank" rel="noopener noreferrer"
                               title="EmbedPress Documentation"><?php esc_html_e( 'Documentation', 'embedpress'); ?></a>
                        </li>
                        <li>
                            <a href="//embedpress.com/#pricing" target="_blank" rel="noopener noreferrer"
                               title="Get EmbedPress Pro"><?php esc_html_e( 'Get Elementor Pro', 'embedpress'); ?></a>
                        </li>
                        <li>
                            <a href="//embedpress.com/support/" target="_blank" rel="noopener noreferrer"
                               title="Contact the EmbedPress team"><?php esc_html_e( 'Contact', 'embedpress'); ?></a>
                        </li>
                        <li>
                            <a href="//twitter.com/wpdevteam" target="_blank" rel="noopener noreferrer">
                                <span class="dashicons dashicons-twitter"></span>
                            </a>
                        </li>
                        <li>
                            <a href="//www.facebook.com/WPDeveloperNet/" target="_blank" rel="noopener noreferrer">
                                <span class="dashicons dashicons-facebook"></span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <p>
                    <a href="//embedpress.com" target="_blank" rel="noopener noreferrer">
                        <img width="100" src="<?php echo plugins_url( 'assets/images/embedpress.png',
                            EMBEDPRESS_PLUGIN_BASENAME ); ?>">
                    </a>
                </p>
            </footer>
        </div>
        <?php
    }

    /**
     * Method that validates the form data.
     *
     * @param mixed $freshData Data received from the form.
     *
     * @return  array
     * @since   1.0.0
     * @static
     *
     */
    public static function validateForm( $freshData ) {
        $data = [
            'enablePluginInAdmin'     => isset( $freshData['enablePluginInAdmin'] ) ? (bool)$freshData['enablePluginInAdmin'] : true,
            'enablePluginInFront'     => isset( $freshData['enablePluginInFront'] ) ? (bool)$freshData['enablePluginInFront'] : true,
            'enableGlobalEmbedResize' => isset( $freshData['enableGlobalEmbedResize'] ) ? (bool)$freshData['enableGlobalEmbedResize'] : false,
            'enableEmbedResizeHeight' => isset( $freshData['enableEmbedResizeHeight'] ) ? $freshData['enableEmbedResizeHeight'] : 552,
            'enableEmbedResizeWidth'  => isset( $freshData['enableEmbedResizeWidth'] ) ? $freshData['enableEmbedResizeWidth'] : 652,
        ];

        return $data;
    }

    /**
     * Method that renders the enablePluginInAdmin input.
     *
     * @since   1.0.0
     * @static
     */
    public static function renderField_enablePluginInAdmin() {
        $fieldName = "enablePluginInAdmin";

        $options = get_option( self::$sectionGroupIdentifier );

        $options[$fieldName] = !isset( $options[$fieldName] ) ? true : (bool)$options[$fieldName];

        echo '<label><input type="radio" id="' . $fieldName . '_0" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']" value="0" ' . (!$options[$fieldName] ? "checked" : "") . ' /> No</label>';
        echo "&nbsp;&nbsp;";
        echo '<label><input type="radio" id="' . $fieldName . '_1" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']" value="1" ' . ($options[$fieldName] ? "checked" : "") . ' /> Yes</label>';
        echo '<p class="description">';
	    /* Translator: 1. <strong> tag and 2. </strong> tag */
	    printf( __('Do you want EmbedPress to run here in the admin area? Disabling this %1$swill not%2$s affect your frontend embeds.', 'embedpress'), '<strong>', '</strong>');
        echo '</p>';
    }

    /**
     * Method that renders the enablePluginInFront input.
     *
     * @since   1.6.0
     * @static
     */
    public static function renderField_enablePluginInFront() {
        $fieldName = "enablePluginInFront";

        $options = get_option( self::$sectionGroupIdentifier );

        $options[$fieldName] = !isset( $options[$fieldName] ) ? true : (bool)$options[$fieldName];

        echo '<label><input type="radio" id="' . $fieldName . '_0" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']" value="0" ' . (!$options[$fieldName] ? "checked" : "") . ' /> No</label>';
        echo "&nbsp;&nbsp;";
        echo '<label><input type="radio" id="' . $fieldName . '_1" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']" value="1" ' . ($options[$fieldName] ? "checked" : "") . ' /> Yes</label>';
        echo '<p class="description">';
	    /* Translator: 1. <strong> tag and 2. </strong> tag */
        printf( __('Do you want EmbedPress to run within editors in frontend (if there\'s any)? Disabling this %1$swill not%2$s affect embeds seem by your regular users in frontend.'),'<strong>', '</strong>');
	    echo '</p>';
    }

    /**
     * Method that renders the enablePluginInAdmin input.
     *
     * @since   2.4.1
     * @static
     */
    public static function renderField_enableGlobalEmbedResize() {
        $fieldName = "enableGlobalEmbedResize";

        $options = get_option( self::$sectionGroupIdentifier );

        $options[$fieldName] = !isset( $options[$fieldName] ) ? false : (bool)$options[$fieldName];

        echo '<label><input class="enableglobalembedresize" type="radio" id="' . $fieldName . '_0" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']" value="0" ' . (!$options[$fieldName] ? "checked" : "") . ' /> No</label>';
        echo "&nbsp;&nbsp;";
        echo '<label><input class="enableglobalembedresize" type="radio" id="' . $fieldName . '_1" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']" value="1" ' . ($options[$fieldName] ? "checked" : "") . ' /> Yes</label>';
        echo '<p class="description">';
        /* Translator: 1. <strong> tag and 2. </strong> tag */
        printf( __('Do you want use global embed dimension, Disabling this %1$s will not%2$s affect embeds.'), '<strong>', '</strong>');
        echo '</p>';
    }

    /**
     * Method that renders the enableEmbedResizeHeight input.
     *
     * @since  2.4.0
     * @static
     */
    public static function renderField_enableEmbedResizeHeight() {
        $fieldName = "enableEmbedResizeHeight";

        $options = get_option( self::$sectionGroupIdentifier );

        $value = !isset( $options[$fieldName] ) ? '552' : $options[$fieldName];

        echo '<span class="embedpress-allow-globla-dimension"><input type="number" value="' . absint( $value ) . '" class="regular-text" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']">';

        echo '<p class="description">';
        _e( 'Global Embed Iframe Height', 'embedpress');
        echo '</p></span>';
    }

    /**
     * Method that renders the enableEmbedResizeWidth input.
     *
     * @since  2.4.0
     * @static
     */
    public static function renderField_enableEmbedResizeWidth() {
        $fieldName = "enableEmbedResizeWidth";
        $options   = get_option( self::$sectionGroupIdentifier );
        $value     = !isset( $options[$fieldName] ) ? '652' : $options[$fieldName];

        echo '<span class="embedpress-allow-globla-dimension"><input type="number" value="' . absint( $value ) . '" class="regular-text" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']">';
	    echo '<p class="description">';
	    _e( 'Global Embed Iframe Width', 'embedpress');
	    echo '</p></span>';
    }
}
