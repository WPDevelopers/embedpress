<?php
namespace EmbedPress\Plugins;

use \EmbedPress\Updater;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that represents a model to EmbedPress plugins.
 *
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.4.0
 * @abstract
 */
abstract class Plugin
{
    /**
     * Method that register all EmbedPress events.
     *
     * @since   1.4.0
     * @static
     *
     * @return  void
     */
    public static function registerEvents()
    {
        // do nothing
    }

    /**
     * Method that checks if EmbedPress is active or not.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @return  boolean
     */
    protected static function isEmbedPressActive()
    {
        $isEmbedPressActive = is_plugin_active(EMBEDPRESS_PLG_NAME .'/'. EMBEDPRESS_PLG_NAME .'.php');

        return $isEmbedPressActive;
    }

    /**
     * Retrieve an error message based on its code.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @param   string      $err The error code.
     * @return  string
     */
    protected static function getErrorMessage($err = '')
    {
        if ($err === 'ERR_MISSING_DEPENDENCY') {
            return __('Please, <strong>install</strong> and <strong>activate <a href="https://wordpress.org/plugins/'. EMBEDPRESS_PLG_NAME .'" target="_blank" rel="noopener noreferrer">'. EMBEDPRESS .'</a></strong> plugin in order to make <em>'. EMBEDPRESS .' - '. static::NAME .'</em> to work.');
        }

        return $err;
    }

    /**
     * Callback triggered by WordPress' 'admin_init' default action.
     *
     * @since   1.4.0
     * @static
     *
     * @return  void
     */
    public static function onLoadAdminCallback()
    {
        $pluginSignature = EMBEDPRESS_PLG_NAME .'-'. static::SLUG .'/'. EMBEDPRESS_PLG_NAME .'-'. static::SLUG .'.php';
        if (is_admin() && !self::isEmbedPressActive() && is_plugin_active($pluginSignature)) {
            deactivate_plugins($pluginSignature);
        } else {
            static::registerSettings();

            $options = static::getOptions();

            $licenseKey = isset($options['license']['key']) ? (string)$options['license']['key'] : "";

            new Updater(EMBEDPRESS_LICENSES_API_URL, static::PATH . EMBEDPRESS_PLG_NAME .'-'. static::SLUG .'.php', array(
                'version'   => static::VERSION,
                'license'   => $licenseKey,
                'item_name' => "EmbedPress - ". static::NAME,
                'author'    => "PressShack"
            ));
        }
    }

    /**
     * Callback triggered by WordPress' 'register_activation_hook' function.
     *
     * @since   1.4.0
     * @static
     *
     * @return  void
     */
    public static function onActivationCallback()
    {
        if (is_admin() && !self::isEmbedPressActive()) {
            echo '<p><a href="'. admin_url('plugins.php') .'">'. __('Go back') .'</a></p>';

            wp_die(self::getErrorMessage('ERR_MISSING_DEPENDENCY'));
        }
    }

    /**
     * Callback triggered by WordPress' 'register_deactivation_hook' function.
     *
     * @since   1.4.0
     * @static
     *
     * @return  void
     */
    public static function onDeactivationCallback()
    {
        delete_option(EMBEDPRESS_PLG_NAME .':'. static::SLUG);
    }

    /**
     * Method that validates the EmbedPress plugin's settings form.
     *
     * @since   1.4.0
     * @static
     *
     * @param   array       $postData The data coming from the form via POST.
     * @return  array
     */
    public static function validateForm($postData)
    {
        $pluginSlugNonce = EMBEDPRESS_PLG_NAME .':'. static::SLUG .':nonce';
        if (!check_admin_referer($pluginSlugNonce, $pluginSlugNonce)) {
            return;
        }

        $data = array();

        $schema = static::getOptionsSchema();
        foreach ($schema as $fieldSlug => $field) {
            if (isset($postData[$fieldSlug])) {
                $value = $postData[$fieldSlug];
            } else {
                $value = isset($field['default']) ? $field['default'] : null;
            }

            settype($value, isset($field['type']) && in_array(strtolower($field['type']), array('bool', 'boolean', 'int', 'integer', 'float', 'string')) ? $field['type'] : 'string');

            $data[$fieldSlug] = $value;
        }

        static::onAfterFormValidation($data);

        if (isset($data['license_key'])) {
            unset($data['license_key']);
        }

        return $data;
    }

    /**
     * Method called right after the settings form being validated but before saving the data into DB.
     *
     * @since   1.4.0
     * @static
     *
     * @param   array   Data after validation.
     * @return  void
     */
    public static function onAfterFormValidation(&$data)
    {
        // do nothing
    }

    /**
     * Method that appends a tab in EmbedPress' Settings page to the plugin.
     *
     * @since   1.4.0
     * @static
     *
     * @return  void
     */
    public static function renderTab($activeTab)
    {
        ?>

        <a href="?page=<?php echo EMBEDPRESS_PLG_NAME; ?>&tab=<?php echo static::SLUG; ?>" class="nav-tab<?php echo $activeTab === static::SLUG ? ' nav-tab-active' : ''; ?> "><?php echo static::NAME; ?></a>

        <?php
    }

    /**
     * Method that return the absolute path to the plugin.
     *
     * @since   1.4.0
     * @static
     *
     * @return  void
     */
    public static function registerSettings()
    {
        $identifier = EMBEDPRESS_PLG_NAME .':'. static::SLUG;

        register_setting($identifier, $identifier, array(static::NAMESPACE_STRING, 'validateForm'));
        add_settings_section($identifier, EMBEDPRESS .' > '. static::NAME .' Settings', array(static::NAMESPACE_STRING, 'onAfterRegisterSettings'), $identifier);

        self::registerSettingsFields();
    }

    /**
     * Register all plugin fields to the settings page.
     *
     * @since   1.4.0
     * @static
     *
     * @return  void
     */
    public static function registerSettingsFields()
    {
        $identifier = EMBEDPRESS_PLG_NAME .':'. static::SLUG;

        $schema = static::getOptionsSchema();
        foreach ($schema as $fieldSlug => $field) {
            $field['slug'] = $fieldSlug;

            add_settings_field($fieldSlug, $field['label'], array(__NAMESPACE__ .'\Html\Field', 'render'), $identifier, $identifier, array(
                'pluginSlug' => static::SLUG,
                'field'      => $field
            ));
        }
    }

    /**
     * Callback called after the plugin's settings page has been registered and rendered.
     *
     * @since   1.4.0
     * @static
     *
     * @return  void
     */
    public static function onAfterRegisterSettings()
    {
        // do nothing
    }

    /**
     * Retrieve user defined options.
     *
     * @since   1.4.0
     * @static
     *
     * @return  array
     */
    public static function getOptions()
    {
        $options = (array)get_option(EMBEDPRESS_PLG_NAME .':'. static::SLUG);
        if (empty($options) || (count($options) === 1 && empty($options[0]))) {
            $options = array();
            $schema = static::getOptionsSchema();
            foreach ($schema as $fieldSlug => $field) {
                $value = isset($field['default']) ? $field['default'] : "";

                settype($value, isset($field['type']) && in_array(strtolower($field['type']), array('bool', 'boolean', 'int', 'integer', 'float', 'string')) ? $field['type'] : 'string');

                if ($fieldSlug === "license_key") {
                    $options['license'] = array(
                        'key'    => $value,
                        'status' => "missing"
                    );
                } else {
                    $options[$fieldSlug] = $value;
                }
            }
        }

        return $options;
    }

    /**
     * Handle links displayed below the plugin name in the WordPress Installed Plugins page.
     *
     * @since   1.4.0
     * @static
     *
     * @return  array
     */
    public static function handleActionLinks($links, $file)
    {
        $settingsLink = '<a href="'. admin_url('admin.php?page='. EMBEDPRESS_PLG_NAME .'&tab='. static::SLUG) .'" aria-label="'. __('Open settings page', 'embedpress-'. static::SLUG) .'">'. __('Settings', 'embedpress-'. static::SLUG) .'</a>';

        array_unshift($links, $settingsLink);

        return $links;
    }

    /**
     * Method that validates a license key.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @return  mixed
     */
    protected static function validateLicenseKey($licenseKey)
    {
        $pluginSlug = EMBEDPRESS_PLG_NAME .':'. static::SLUG;

        $response = wp_remote_post(EMBEDPRESS_LICENSES_API_URL, array(
            'timeout'   => 30,
            'sslverify' => false,
            'body'      => array(
                'edd_action' => "activate_license",
                'license'    => $licenseKey,
                'item_name'  => "EmbedPress - ". static::NAME,
                'url'        => home_url()
            )
        ));

        if (is_wp_error($response) || 200 !== wp_remote_retrieve_response_code($response)) {
            $errMessage = $response->get_error_message();
            if (is_wp_error($response) && !empty($errMessage)) {
                return $errMessage;
            } else {
                return __('An error occurred. Please, try again.');
            }
        } else {
            $licenseData = json_decode(wp_remote_retrieve_body($response));
            if (empty($licenseData) || !is_object($licenseData)) {
                $licenseNewStatus = "invalid";
            } else {
                if (isset($licenseData->success) && $licenseData->success === true) {
                    $licenseNewStatus = "valid";
                } else {
                    $licenseNewStatus = isset($licenseData->error) && !empty($licenseData->error) ? $licenseData->error : "invalid";
                }
            }

            return $licenseNewStatus;
        }
    }
}
