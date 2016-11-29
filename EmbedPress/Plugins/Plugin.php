<?php
namespace EmbedPress\Plugins;

require_once dirname(__FILE__) .'/Interface.php';

class Plugin implements PluginInterface
{
    const EMBEDPRESS_PLUGIN_NAME = 'EmbedPress';
    const EMBEDPRESS_PLUGIN_ALIAS = 'embedpress';
    const EMBEDPRESS_PLUGIN_URL = 'https://wordpress.org/plugins/embedpress';

    protected static $name = 'Plugin name not implemented';
    protected static $slug = 'Plugin slug not implemented';

    public static function getName()
    {
        return static::$name;
    }

    public static function getSlug()
    {
        return static::$slug;
    }

    protected static function getSignature()
    {
        $signature = self::EMBEDPRESS_PLUGIN_ALIAS .'-'. static::$slug .'/'. self::EMBEDPRESS_PLUGIN_ALIAS .'-'. static::$slug .'.php';

        return $signature;
    }

    protected static function isEmbedPressActive()
    {
        $isEmbedPressActive = is_plugin_active(self::EMBEDPRESS_PLUGIN_ALIAS .'/'. self::EMBEDPRESS_PLUGIN_ALIAS .'.php');

        return $isEmbedPressActive;
    }

    protected static function getErrorMessage($err = '')
    {
        if ($err === 'ERR_MISSING_DEPENDENCY') {
            return __('Please, <strong>install</strong> and <strong>activate <a href="'. self::EMBEDPRESS_PLUGIN_URL .'" target="_blank">'. self::EMBEDPRESS_PLUGIN_NAME .'</a></strong> plugin in order to make <em>EmbedPress - '. static::$name .'</em> to work.');
        }

        return $err;
    }

    public static function onLoadAdminCallback()
    {
        $pluginSignature = static::getSignature();
        if (is_admin() && !self::isEmbedPressActive() && is_plugin_active($pluginSignature)) {
            echo ''.
            '<div class="notice notice-warning">'.
                '<p>'. self::getErrorMessage('ERR_MISSING_DEPENDENCY') .'</p>'.
            '</div>';

            deactivate_plugins($pluginSignature);
        }
    }

    public static function onActivationCallback()
    {
        if (is_admin() && !self::isEmbedPressActive()) {
            echo '<p><a href="javascript:history.back();">'. __('Go back') .'</a></p>';

            wp_die(self::getErrorMessage('ERR_MISSING_DEPENDENCY'));
        }
    }

    public static function onDeactivationCallback()
    {
        delete_option('embedpress:'. self::getSlug());
    }

    public static function getPath()
    {
    }

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

    public static function renderTab($activeTab)
    {
        $slug = self::getSlug();
        ?>

        <a href="?page=embedpress&tab=<?php echo $slug; ?>" class="nav-tab<?php echo $activeTab === $slug ? ' nav-tab-active' : ''; ?> "><?php echo self::getName(); ?></a>

        <?php
    }

    public static function registerSettings($params = array())
    {
        $identifier = 'embedpress:'. self::getSlug();

        register_setting($identifier, $identifier, array(static::NMSPC, 'validateForm'));
        add_settings_section($identifier, 'EmbedPress > '. self::getName() .' Settings', array(static::NMSPC, 'renderForm'), $identifier);

        self::registerSettingsFields();
    }

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
}
