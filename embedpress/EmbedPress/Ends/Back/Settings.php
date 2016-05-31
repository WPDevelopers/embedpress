<?php
namespace EmbedPress\Ends\Back;

use \EmbedPress\Plugin;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity that handles the plugin's settings page.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Ends/Back
 * @author      OSTraining <support@ostraining.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       0.1
 */
class Settings
{
    /**
     * This class namespace.
     *
     * @since   0.1
     * @access  private
     * @static
     *
     * @var     string    $namespace
     */
    private static $namespace = '\EmbedPress\Ends\Back\Settings';

    /**
     * The plugin's unique identifier.
     *
     * @since   0.1
     * @access  private
     * @static
     *
     * @var     string    $identifier
     */
    private static $identifier = "plg_embedpress";

    /**
     * Unique identifier to the plugin's admin settings section.
     *
     * @since   0.1
     * @access  private
     * @static
     *
     * @var     string    $sectionAdminIdentifier
     */
    private static $sectionAdminIdentifier = "embedpress_options_admin";

    /**
     * Unique identifier to the plugin's general settings section.
     *
     * @since   0.1
     * @access  private
     * @static
     *
     * @var     string    $sectionGroupIdentifier    The name of the plugin.
     */
    private static $sectionGroupIdentifier = "embedpress_options";

    /**
     * Map to all settings.
     *
     * @since   0.1
     * @access  private
     * @static
     *
     * @var     string    $fieldMap
     */
    private static $fieldMap = array(
        'enablePluginInAdmin' => array(
            'label'   => "Enable EmbedPress in the admin area",
            'section' => "admin"
        ),
        'displayPreviewBox' => array(
            'label'   => "Display Preview Box inside editor",
            'section' => "admin"
        )
    );

    /**
     * Class constructor. This prevents the class being directly instantiated.
     *
     * @since   0.1
     */
    public function __construct()
    {}

    /**
     * This prevents the class being cloned.
     *
     * @since   0.1
     */
    public function __clone()
    {}

    /**
     * Method that adds an sub-item for EmbedPress to the WordPress Settings menu.
     *
     * @since   0.1
     * @static
     */
    public static function registerMenuItem()
    {
        add_options_page('EmbedPress Settings', 'EmbedPress', 'manage_options', 'embedpress', array(self::$namespace, 'renderForm'));
    }

    /**
     * Method that configures the EmbedPress settings page.
     *
     * @since   0.1
     * @static
     */
    public static function registerActions()
    {
        register_setting(self::$sectionGroupIdentifier, self::$sectionGroupIdentifier, array(self::$namespace, "validateForm"));

        add_settings_section(self::$sectionAdminIdentifier, 'Admin Section Settings', array(self::$namespace, 'renderHelpText'), self::$identifier);

        foreach (self::$fieldMap as $fieldName => $field) {
            add_settings_field($fieldName, $field['label'], array(self::$namespace, "renderField_{$fieldName}"), self::$identifier, self::${"section". ucfirst($field['section']) ."Identifier"});
        }
    }

    /**
     * Method that render the settings's form.
     *
     * @since   0.1
     * @static
     */
    public static function renderForm()
    {
        ?>
        <div>
            <h2>EmbedPress Settings Page</h2>
            <form action="options.php" method="POST">
                <?php settings_fields(self::$sectionGroupIdentifier); ?>
                <?php do_settings_sections(self::$identifier); ?>

                <input name="Submit" type="submit" value="Save changes" />
            </form>
        </div>
        <?php
    }

    /**
     * Method that validates the form data.
     *
     * @since   0.1
     * @static
     *
     * @param   mixed   $freshData  Data received from the form.
     *
     * @return  array
     */
    public static function validateForm($freshData)
    {
        $data = array(
            'displayPreviewBox'   => (bool)$freshData['displayPreviewBox'],
            'enablePluginInAdmin' => (bool)$freshData['enablePluginInAdmin']
        );

        return $data;
    }

    /**
     * Method that prints help info for the form.
     *
     * @since   0.1
     * @static
     *
     * @return  string
     */
    public static function renderHelpText()
    {
        return "";
    }

    /**
     * Method that renders the displayPreviewBox input.
     *
     * @since   0.1
     * @static
     */
    public static function renderField_displayPreviewBox()
    {
        $fieldName = "displayPreviewBox";

        $options = get_option(self::$sectionGroupIdentifier);

        $activeOptions = Plugin::getSettings();
        if (isset($activeOptions->enablePluginInAdmin) && (bool)$activeOptions->enablePluginInAdmin === false) {
            $options[$fieldName] = false;
        } else {
            $options[$fieldName] = !isset($options[$fieldName]) ? true : (bool)$options[$fieldName];
        }
        unset($activeOptions);

        echo '<label><input type="radio" id="'. $fieldName .'_0" name="'. self::$sectionGroupIdentifier .'['. $fieldName .']" value="0" '. (!$options[$fieldName] ? "checked" : "") .' /> No</label>';
        echo "&nbsp;&nbsp;";
        echo '<label><input type="radio" id="'. $fieldName .'_1" name="'. self::$sectionGroupIdentifier .'['. $fieldName .']" value="1" '. ($options[$fieldName] ? "checked" : "") .' /> Yes</label>';
    }

    /**
     * Method that renders the enablePluginInAdmin input.
     *
     * @since   0.1
     * @static
     */
    public static function renderField_enablePluginInAdmin()
    {
        $fieldName = "enablePluginInAdmin";

        $options = get_option(self::$sectionGroupIdentifier);

        $options[$fieldName] = !isset($options[$fieldName]) ? true : (bool)$options[$fieldName];

        echo '<label><input type="radio" id="'. $fieldName .'_0" name="'. self::$sectionGroupIdentifier .'['. $fieldName .']" value="0" '. (!$options[$fieldName] ? "checked" : "") .' /> No</label>';
        echo "&nbsp;&nbsp;";
        echo '<label><input type="radio" id="'. $fieldName .'_1" name="'. self::$sectionGroupIdentifier .'['. $fieldName .']" value="1" '. ($options[$fieldName] ? "checked" : "") .' /> Yes</label>';
    }
}