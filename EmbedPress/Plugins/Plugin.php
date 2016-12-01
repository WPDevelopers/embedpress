<?php
namespace EmbedPress\Plugins;

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
     * @abstract
     *
     * @return  void
     */
    abstract public static function registerEvents();

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
            return __('Please, <strong>install</strong> and <strong>activate <a href="https://wordpress.org/plugins/'. EMBEDPRESS_PLG_NAME .'" target="_blank">'. EMBEDPRESS .'</a></strong> plugin in order to make <em>'. EMBEDPRESS .' - '. static::NAME .'</em> to work.');
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
            echo ''.
            '<div class="notice notice-warning">'.
                '<p>'. self::getErrorMessage('ERR_MISSING_DEPENDENCY') .'</p>'.
            '</div>';

            deactivate_plugins($pluginSignature);
        } else {
            static::registerSettings();
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
            echo '<p><a href="javascript:history.back();">'. __('Go back') .'</a></p>';

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

        return $data;
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

        register_setting($identifier, $identifier, array(static::NMSPC, 'validateForm'));
        add_settings_section($identifier, EMBEDPRESS .' > '. static::NAME .' Settings', array(static::NMSPC, 'onAfterRegisterSettings'), $identifier);

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

        return $options;
    }
}
