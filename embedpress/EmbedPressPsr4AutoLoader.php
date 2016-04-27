<?php
use EmbedPress\AutoLoader;

defined('_JEXEC') or die();

if (!class_exists('\\EmbedPress\\AutoLoader')) {
    require_once __DIR__ . '/embedpress/AutoLoader.php';
}

/**
 * Class AllediaPsr4AutoLoader
 *
 * @deprecated See Alledia\Framework\AutoLoader
 */
class EmbedPressPsr4AutoLoader extends AutoLoader
{
    /**
     * @param string      $prefix
     * @param string     $baseDir
     * @param bool $prepend
     *
     * @return void
     *
     * @deprecated
     */
    public function addNamespace($prefix, $baseDir, $prepend = false)
    {
        static::register($prefix, $baseDir, $prepend);
    }
}
