<?php
namespace EmbedPress\Plugins;

require_once dirname(__FILE__) .'/Interface.php';

class Plugin implements PluginInterface
{
    const EMBEDPRESS_PLUGIN_NAME = 'EmbedPress';
    const EMBEDPRESS_PLUGIN_ALIAS = 'embedpress';
    const EMBEDPRESS_PLUGIN_URL = 'https://wordpress.org/plugins/embedpress';

    protected static $_name = 'Plugin name not implemented';
    protected static $_identifier = 'Plugin identifier not implemented';

    public static function getName()
    {
        return static::$_name;
    }

    public static function getIdentifier()
    {
        return static::$_identifier;
    }

    protected static function getSignature()
    {
        $signature = self::EMBEDPRESS_PLUGIN_ALIAS .'-'. static::$_identifier .'/'. self::EMBEDPRESS_PLUGIN_ALIAS .'-'. static::$_identifier .'.php';

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
            return __('Please, <strong>install</strong> and <strong>activate <a href="'. self::EMBEDPRESS_PLUGIN_URL .'" target="_blank">'. self::EMBEDPRESS_PLUGIN_NAME .'</a></strong> plugin in order to make <em>EmbedPress - '. static::$_name .'</em> to work.');
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
    }

    public static function getPath()
    {

    }
}
