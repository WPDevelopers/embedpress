<?php
namespace EmbedPress\Plugins;

require_once dirname(__FILE__) .'/Interface.php';

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that represents a model to EmbedPress plugins.
 *
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.4.0
 */
class Plugin implements PluginInterface
{
    /**
     * EmbedPress's name.
     *
     * @since   1.4.0
     *
     * @const   EMBEDPRESS_PLUGIN_NAME
     */
    const EMBEDPRESS_PLUGIN_NAME = 'EmbedPress';

    /**
     * EmbedPress's slug.
     *
     * @since   1.4.0
     *
     * @const   EMBEDPRESS_PLUGIN_ALIAS
     */
    const EMBEDPRESS_PLUGIN_ALIAS = 'embedpress';

    /**
     * EmbedPress's url.
     *
     * @since   1.4.0
     *
     * @const   NMSPC
     */
    const EMBEDPRESS_PLUGIN_URL = 'https://wordpress.org/plugins/embedpress';

    /**
     * The name of the plugin.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @var     string      $name
     */
    protected static $name = 'Plugin name not implemented';

    /**
     * The slug of the plugin.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @var     string      $slug
     */
    protected static $slug = 'Plugin slug not implemented';

    /**
     * Retrieve the plugin's name.
     *
     * @since   1.4.0
     * @static
     *
     * @return  string
     */
    public static function getName()
    {
        return static::$name;
    }

    /**
     * Retrieve the plugin's slug.
     *
     * @since   1.4.0
     * @static
     *
     * @return  string
     */
    public static function getSlug()
    {
        return static::$slug;
    }

    /**
     * Retrieve the plugin's signature. It follows the format: "embedpress-<plugin slug>/embedpress-<plugin slug>.php".
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @return  string
     */
    protected static function getSignature()
    {
        $signature = self::EMBEDPRESS_PLUGIN_ALIAS .'-'. static::$slug .'/'. self::EMBEDPRESS_PLUGIN_ALIAS .'-'. static::$slug .'.php';

        return $signature;
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
        $isEmbedPressActive = is_plugin_active(self::EMBEDPRESS_PLUGIN_ALIAS .'/'. self::EMBEDPRESS_PLUGIN_ALIAS .'.php');

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
            return __('Please, <strong>install</strong> and <strong>activate <a href="'. self::EMBEDPRESS_PLUGIN_URL .'" target="_blank">'. self::EMBEDPRESS_PLUGIN_NAME .'</a></strong> plugin in order to make <em>EmbedPress - '. static::$name .'</em> to work.');
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
        $pluginSignature = static::getSignature();
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
        delete_option('embedpress:'. self::getSlug());
    }

    /**
     * Method that return the absolute path to the plugin.
     *
     * @since   1.4.0
     * @static
     *
     * @return  string
     */
    public static function getPath()
    {
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
        $slug = self::getSlug();
        ?>

        <a href="?page=embedpress&tab=<?php echo $slug; ?>" class="nav-tab<?php echo $activeTab === $slug ? ' nav-tab-active' : ''; ?> "><?php echo self::getName(); ?></a>

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
        $identifier = 'embedpress:'. self::getSlug();

        register_setting($identifier, $identifier, array(static::NMSPC, 'validateForm'));
        add_settings_section($identifier, 'EmbedPress > '. self::getName() .' Settings', array(static::NMSPC, 'onAfterRegisterSettings'), $identifier);

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
        $pluginSlug = self::getSlug();
        $identifier = "embedpress:{$pluginSlug}";

        $schema = static::getOptionsSchema();
        foreach ($schema as $fieldSlug => $field) {
            $field['slug'] = $fieldSlug;

            add_settings_field($fieldSlug, $field['label'], array(__NAMESPACE__ .'\Html\Field', 'render'), $identifier, $identifier, array(
                'pluginSlug' => $pluginSlug,
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
    }

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
    }
}
