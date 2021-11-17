<?php

namespace EmbedPress\Plugins;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that represents a model to EmbedPress plugins.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.4.0
 * @abstract
 */
abstract class Plugin
{
    const VERSION = '0.0.0';

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
        return is_plugin_active(EMBEDPRESS_PLG_NAME . '/' . EMBEDPRESS_PLG_NAME . '.php');
    }

    /**
     * Retrieve an error message based on its code.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @param   string $err The error code.
     *
     * @return  string
     */
    protected static function getErrorMessage($err = '')
    {
        if ($err === 'ERR_MISSING_DEPENDENCY') {
            return __('Please, <strong>install</strong> and <strong>activate <a href="https://wordpress.org/plugins/' . EMBEDPRESS_PLG_NAME . '" target="_blank" rel="noopener noreferrer">' . EMBEDPRESS . '</a></strong> plugin in order to make <em>' . EMBEDPRESS . ' - ' . static::NAME . '</em> to work.');
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
        $pluginSignature = EMBEDPRESS_PLG_NAME . '-' . static::SLUG . '/' . EMBEDPRESS_PLG_NAME . '-' . static::SLUG . '.php';
        if (is_admin() && ! self::isEmbedPressActive() && is_plugin_active($pluginSignature)) {
            deactivate_plugins($pluginSignature);
        }
    }

    /**
     * Callback triggered by WordPress' 'register_activation_hook' function.
     * @return  bool
     *@since   1.4.0
     * @static
     */
	public static function onActivationCallback()
    {
        return true;
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
        delete_option(EMBEDPRESS_PLG_NAME . ':' . static::SLUG);
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
        $options = (array)get_option(EMBEDPRESS_PLG_NAME . ':' . static::SLUG);
        if (empty($options) || (count($options) === 1 && empty($options[0]))) {
            $options = [];
            $schema  = static::getOptionsSchema();
            foreach ($schema as $fieldSlug => $field) {
                $value = isset($field['default']) ? $field['default'] : "";

                settype($value, isset($field['type']) && in_array(strtolower($field['type']),
                    ['bool', 'boolean', 'int', 'integer', 'float', 'string']) ? $field['type'] : 'string');

                if ($fieldSlug === "license_key") {
                    $options['license'] = [
                        'key'    => true,
                        'status' => "missing",
                    ];
                } else {
                    $options[$fieldSlug] = $value;
                }
            }
        }

        $options['license'] = [
            'key'    => true,
            'status' => "missing",
        ];

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
        $settingsLink = '<a href="' . admin_url('admin.php?page=' . EMBEDPRESS_PLG_NAME . '&page_type=' . static::SLUG) . '" aria-label="' . __('Open settings page',
                'embedpress') . '">' . __('Settings', 'embedpress') . '</a>';

        array_unshift($links, $settingsLink);
	    if ( !is_embedpress_pro_active() ) {
		    $links[] = '<a href="https://wpdeveloper.net/in/upgrade-embedpress" target="_blank" class="embedpress-go-pro-action" style="color: green">'.__('Go Pro', 'embedpress').'</a>';
	    }
        return $links;
    }
}
