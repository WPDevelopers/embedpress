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
        add_menu_page( 'EmbedPress Settings', 'EmbedPress', 'manage_options', 'embedpress',
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
                        'label'   => "Load previews in the admin editor",
                        'section' => "admin",
                    ],
                    'enablePluginInFront'     => [
                        'label'   => "Load previews in the frontend editor",
                        'section' => "admin",
                    ],
                    'enableGlobalEmbedResize' => [
                        'label'   => "Enable Global Embed Dimension",
                        'section' => "admin",
                    ],
                    'enableEmbedResizeWidth'  => [
                        'label'   => "Embed Iframe Width",
                        'section' => "admin",
                    ],
                    'enableEmbedResizeHeight' => [
                        'label'   => "Embed Iframe Height",
                        'section' => "admin",
                    ]
                ];
            }

            $fieldMap['heading_settings'] = [
                'label'   => " ",
                'section' => "admin",
            ];

            $fieldMap['facebook_app_code'] = [
                'label'   => "App Code",
                'section' => "admin",
            ];

            $fieldMap['facebook_app_secret'] = [
                'label'   => "App Secret",
                'section' => "admin",
            ];

            $fieldMap['forceFacebookLanguage'] = [
                'label'   => "Facebook embed language",
                'section' => "admin",
            ];

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
        $settingsFieldsIdentifier   = !empty( $activeTab ) ? "embedpress:{$activeTab}" : self::$sectionGroupIdentifier;
        $settingsSectionsIdentifier = !empty( $activeTab ) ? "embedpress:{$activeTab}" : self::$identifier;
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
                    <span class="free">Core Version: <?php echo EMBEDPRESS_VERSION; ?></span>

                    <?php if ( defined( 'EMBEDPRESS_PRO_PLUGIN_VERSION' ) ) { ?>
                        <span class="pro"> Pro Version: <?php echo EMBEDPRESS_PRO_PLUGIN_VERSION; ?></span>
                    <?php } ?>
                </div>
            </header>

            <?php settings_errors(); ?>
            <div>
                <h2 class="nav-tab-wrapper">
                    <a href="?page=embedpress"
                       class="nav-tab<?php echo $activeTab === 'embedpress' || empty( $activeTab ) ? ' nav-tab-active' : ''; ?> ">
                        General settings
                    </a>
                    <?php if ( !defined( 'EMBEDPRESS_PRO_PLUGIN_VERSION' ) ): ?>
                        <a href="?page=embedpress&tab=embedpress_get_pro"
                           class="nav-tab<?php echo $activeTab === 'embedpress_get_pro' ? ' nav-tab-active' : ''; ?> ">
                            Go Premium
                        </a>
                    <?php endif; ?>
                    <?php do_action( 'embedpress:settings:render:tab', $activeTab ); ?>
                    <?php do_action( 'embedpress_license_tab', $activeTab ); ?>
                </h2>

                <?php if ( $activeTab !== 'addons' ) : ?>
                    <form action="options.php" method="POST" style="padding-bottom: 20px;">
                        <?php settings_fields( $settingsFieldsIdentifier ); ?>
                        <?php do_settings_sections( $settingsSectionsIdentifier ); ?>
                        <?php if ( $activeTab !== 'embedpress_license' && $activeTab !== 'embedpress_get_pro' ) : ?>
                            <button type="submit" class="button button-primary embedpress-setting-save">Save changes
                            </button>
                        <?php endif; ?>
                    </form>
                <?php endif; ?>
                <?php if ( $activeTab == 'embedpress_license' ) : ?>
                    <?php echo do_action( 'embedpress_license' ); ?>
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
                                        <h4 class="embedpress-admin-title">Why upgrade to Premium Version?</h4>
                                    </header>
                                    <div class="embedpress-admin-block-content">
                                        <p>The premium version helps us to continue development of the product
                                            incorporating even more features and enhancements.</p>
                                        <p>You will also get world class support from our dedicated team, 24/7.</p>
                                        <a href="https://wpdeveloper.net/plugins/embedpress#pricing" target="_blank"
                                           class="button embedpress-btn">Get Pro Version</a>
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
                       rel="noopener noreferrer">If you like <strong>EmbedPress</strong> please leave us a <span
                                class="dashicons dashicons-star-filled"></span><span
                                class="dashicons dashicons-star-filled"></span><span
                                class="dashicons dashicons-star-filled"></span><span
                                class="dashicons dashicons-star-filled"></span><span
                                class="dashicons dashicons-star-filled"></span> rating. Thank you!</a>
                </p>
                <hr>
                <nav>
                    <ul>
                        <li>
                            <a href="//embedpress.com" target="_blank" rel="noopener noreferrer"
                               title="About EmbedPress">About</a>
                        </li>
                        <li>
                            <a href="//embedpress.com/sources/" target="_blank" rel="noopener noreferrer"
                               title="List of supported sources by EmbedPress">Supported sources</a>
                        </li>
                        <li>
                            <a href="//embedpress.com/documentation/" target="_blank" rel="noopener noreferrer"
                               title="EmbedPress Documentation">Documentation</a>
                        </li>
                        <li>
                            <a href="//embedpress.com/#pricing" target="_blank" rel="noopener noreferrer"
                               title="Get EmbedPress Pro">Get EmbedPress Pro</a>
                        </li>
                        <li>
                            <a href="//embedpress.com/support/" target="_blank" rel="noopener noreferrer"
                               title="Contact the EmbedPress team">Contact</a>
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
            'facebook_app_code'       => isset( $freshData['facebook_app_code'] ) ? $freshData['facebook_app_code'] : 652,
            'facebook_app_secret'     => isset( $freshData['facebook_app_secret'] ) ? $freshData['facebook_app_secret'] : 652,
            'fbLanguage'              => $freshData['fbLanguage'],
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
        echo '<p class="description">Do you want EmbedPress to run here in the admin area? Disabling this <strong>will not</strong> affect your frontend embeds.</p>';
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
        echo '<p class="description">Do you want EmbedPress to run within editors in frontend (if there\'s any)? Disabling this <strong>will not</strong> affect embeds seem by your regular users in frontend.</p>';
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
        echo '<p class="description">Do you want use global embed dimension, Disabling this <strong>will not</strong> affect embeds.</p>';
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

        echo '<p class="description">Global Embed Iframe Height</p></span>';
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
        echo '<p class="description">Global Embed Iframe Width </p></span>';
    }

    /**
     * Method that renders the forceFacebookLanguage input.
     *
     * @since   1.3.0
     * @static
     */
    public static function renderField_facebook_app_code() {
        $fieldName = "facebook_app_code";

        $options = get_option( self::$sectionGroupIdentifier );

        $options[$fieldName] = !isset( $options[$fieldName] ) ? "" : $options[$fieldName];

        $facebookLocales = self::getFacebookAvailableLocales();

        echo '<span><input type="text" value="' . $options[$fieldName] . '" class="regular-text" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']">';
    }

    /**
     * Method that renders the forceFacebookLanguage input.
     *
     * @since   1.3.0
     * @static
     */
    public static function renderField_heading_settings() {
        printf( "<h2>%s</h2>", esc_html__( 'Facebook and Instagram Embed Settings', 'embedpress' ) );
        printf( __( '<p>Starting October 24th, due to changes in Facebook API, you will need Facebook Developer app credentials to embed Facebook & Instagram content on your WordPress website. You need to <a class="embedpress-settings-link" href="%s" target="_blank" rel="noopener noreferrer">register a Facebook app</a>, enable <a class="embedpress-settings-link" href="%s">oEmbed</a>, and add its `App ID` & `App secret` in the fields below.</p>', "embedpress" ), esc_url( 'https://developers.facebook.com/apps/' ), esc_url( 'https://developers.facebook.com/docs/plugins/oembed' ) );
        printf( __( '<p>For more details, check out this documentation <a class="embedpress-settings-link" href="%s">Here</a></p>', 'embedpress' ), esc_url( 'https://embedpress.com/docs/how-to-connect-facebook-instagram-embedpress/' ) );
    }

    /**
     * Method that renders the forceFacebookLanguage input.
     *
     * @since   1.3.0
     * @static
     */
    public static function renderField_facebook_app_secret() {
        $fieldName = "facebook_app_secret";

        $options = get_option( self::$sectionGroupIdentifier );

        $options[$fieldName] = !isset( $options[$fieldName] ) ? "" : $options[$fieldName];


        echo '<span><input type="text" value="' . $options[$fieldName] . '" class="regular-text" name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']">';
    }

    /**
     * Method that renders the forceFacebookLanguage input.
     *
     * @since   1.3.0
     * @static
     */
    public static function renderField_forceFacebookLanguage() {
        $fieldName = "fbLanguage";

        $options = get_option( self::$sectionGroupIdentifier );

        $options[$fieldName] = !isset( $options[$fieldName] ) ? "" : $options[$fieldName];

        $facebookLocales = self::getFacebookAvailableLocales();

        echo '<select name="' . self::$sectionGroupIdentifier . '[' . $fieldName . ']">';
        echo '<option value="0">Automatic (by Facebook)</option>';
        echo '<optgroup label="Available">';
        foreach ( $facebookLocales as $locale => $localeName ) {
            echo '<option value="' . $locale . '"' . ($options[$fieldName] === $locale ? ' selected' : '') . '>' . $localeName . '</option>';
        }
        echo '</optgroup>';
        echo '</select>';

        echo '<p class="description">Sometimes Facebook can choose the wrong language for embeds. If this happens, choose the correct language here.</p>';
    }

    /**
     * Returns a list of locales that can be used on Facebook embeds.
     *
     * @return  array
     * @since   1.3.0
     * @static
     *
     */
    public static function getFacebookAvailableLocales() {
        $locales = [
            'af_ZA' => "Afrikaans",
            'ak_GH' => "Akan",
            'am_ET' => "Amharic",
            'ar_AR' => "Arabic",
            'as_IN' => "Assamese",
            'ay_BO' => "Aymara",
            'az_AZ' => "Azerbaijani",
            'be_BY' => "Belarusian",
            'bg_BG' => "Bulgarian",
            'bn_IN' => "Bengali",
            'br_FR' => "Breton",
            'bs_BA' => "Bosnian",
            'ca_ES' => "Catalan",
            'cb_IQ' => "Sorani Kurdish",
            'ck_US' => "Cherokee",
            'co_FR' => "Corsican",
            'cs_CZ' => "Czech",
            'cx_PH' => "Cebuano",
            'cy_GB' => "Welsh",
            'da_DK' => "Danish",
            'de_DE' => "German",
            'el_GR' => "Greek",
            'en_GB' => "English (UK)",
            'en_IN' => "English (India)",
            'en_PI' => "English (Pirate)",
            'en_UD' => "English (Upside Down)",
            'en_US' => "English (US)",
            'eo_EO' => "Esperanto",
            'es_CL' => "Spanish (Chile)",
            'es_CO' => "Spanish (Colombia)",
            'es_ES' => "Spanish (Spain)",
            'es_LA' => "Spanish",
            'es_MX' => "Spanish (Mexico)",
            'es_VE' => "Spanish (Venezuela)",
            'et_EE' => "Estonian",
            'eu_ES' => "Basque",
            'fa_IR' => "Persian",
            'fb_LT' => "Leet Speak",
            'ff_NG' => "Fulah",
            'fi_FI' => "Finnish",
            'fo_FO' => "Faroese",
            'fr_CA' => "French (Canada)",
            'fr_FR' => "French (France)",
            'fy_NL' => "Frisian",
            'ga_IE' => "Irish",
            'gl_ES' => "Galician",
            'gn_PY' => "Guarani",
            'gu_IN' => "Gujarati",
            'gx_GR' => "Classical Greek",
            'ha_NG' => "Hausa",
            'he_IL' => "Hebrew",
            'hi_IN' => "Hindi",
            'hr_HR' => "Croatian",
            'ht_HT' => "Haitian Creole",
            'hu_HU' => "Hungarian",
            'hy_AM' => "Armenian",
            'id_ID' => "Indonesian",
            'ig_NG' => "Igbo",
            'is_IS' => "Icelandic",
            'it_IT' => "Italian",
            'ja_JP' => "Japanese",
            'ja_KS' => "Japanese (Kansai)",
            'jv_ID' => "Javanese",
            'ka_GE' => "Georgian",
            'kk_KZ' => "Kazakh",
            'km_KH' => "Khmer",
            'kn_IN' => "Kannada",
            'ko_KR' => "Korean",
            'ku_TR' => "Kurdish (Kurmanji)",
            'ky_KG' => "Kyrgyz",
            'la_VA' => "Latin",
            'lg_UG' => "Ganda",
            'li_NL' => "Limburgish",
            'ln_CD' => "Lingala",
            'lo_LA' => "Lao",
            'lt_LT' => "Lithuanian",
            'lv_LV' => "Latvian",
            'mg_MG' => "Malagasy",
            'mi_NZ' => "Māori",
            'mk_MK' => "Macedonian",
            'ml_IN' => "Malayalam",
            'mn_MN' => "Mongolian",
            'mr_IN' => "Marathi",
            'ms_MY' => "Malay",
            'mt_MT' => "Maltese",
            'my_MM' => "Burmese",
            'nb_NO' => "Norwegian (bokmal)",
            'nd_ZW' => "Ndebele",
            'ne_NP' => "Nepali",
            'nl_BE' => "Dutch (België)",
            'nl_NL' => "Dutch",
            'nn_NO' => "Norwegian (nynorsk)",
            'ny_MW' => "Chewa",
            'or_IN' => "Oriya",
            'pa_IN' => "Punjabi",
            'pl_PL' => "Polish",
            'ps_AF' => "Pashto",
            'pt_BR' => "Portuguese (Brazil)",
            'pt_PT' => "Portuguese (Portugal)",
            'qc_GT' => "Quiché",
            'qu_PE' => "Quechua",
            'rm_CH' => "Romansh",
            'ro_RO' => "Romanian",
            'ru_RU' => "Russian",
            'rw_RW' => "Kinyarwanda",
            'sa_IN' => "Sanskrit",
            'sc_IT' => "Sardinian",
            'se_NO' => "Northern Sámi",
            'si_LK' => "Sinhala",
            'sk_SK' => "Slovak",
            'sl_SI' => "Slovenian",
            'sn_ZW' => "Shona",
            'so_SO' => "Somali",
            'sq_AL' => "Albanian",
            'sr_RS' => "Serbian",
            'sv_SE' => "Swedish",
            'sw_KE' => "Swahili",
            'sy_SY' => "Syriac",
            'sz_PL' => "Silesian",
            'ta_IN' => "Tamil",
            'te_IN' => "Telugu",
            'tg_TJ' => "Tajik",
            'th_TH' => "Thai",
            'tk_TM' => "Turkmen",
            'tl_PH' => "Filipino",
            'tl_ST' => "Klingon",
            'tr_TR' => "Turkish",
            'tt_RU' => "Tatar",
            'tz_MA' => "Tamazight",
            'uk_UA' => "Ukrainian",
            'ur_PK' => "Urdu",
            'uz_UZ' => "Uzbek",
            'vi_VN' => "Vietnamese",
            'wo_SN' => "Wolof",
            'xh_ZA' => "Xhosa",
            'yi_DE' => "Yiddish",
            'yo_NG' => "Yoruba",
            'zh_CN' => "Simplified Chinese (China)",
            'zh_HK' => "Traditional Chinese (Hong Kong)",
            'zh_TW' => "Traditional Chinese (Taiwan)",
            'zu_ZA' => "Zulu",
            'zz_TR' => "Zazaki",
        ];

        return $locales;
    }
}
