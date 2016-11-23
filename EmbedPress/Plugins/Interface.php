<?php
namespace EmbedPress\Plugins;

interface PluginInterface
{
    public static function onActivationCallback();
    public static function onDeactivationCallback();
    public static function onLoadAdminCallback();
    public static function getPath();
}