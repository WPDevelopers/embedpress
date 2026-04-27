<?php

// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery
// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching
// phpcs:disable WordPress.DB.DirectDatabaseQuery.SchemaChange
// phpcs:disable PluginCheck.Security.DirectDB.UnescapedDBParameter
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals
// phpcs:disable WordPress.PHP.DevelopmentFunctions
// phpcs:disable WordPress.Security.NonceVerification.Missing
// phpcs:disable WordPress.Security.NonceVerification.Recommended
// phpcs:disable WordPress.Security.ValidatedSanitizedInput.MissingUnslash
// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotValidated
// phpcs:disable Squiz.PHP.DiscouragedFunctions.Discouraged
// phpcs:disable PluginCheck.CodeAnalysis.ShortURL.Found
// phpcs:disable WordPress.WP.EnqueuedResourceParameters.MissingVersion

/**
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */

use EmbedPress\AutoLoader;

defined('ABSPATH') or die("No direct script access allowed.");

$autoLoaderFullClassName = EMBEDPRESS_NAMESPACE . '\\' . EMBEDPRESS_AUTOLOADER_NAME;
if ( ! defined('EMBEDPRESS_IS_LOADED') || ! class_exists($autoLoaderFullClassName)) {
    define('EMBEDPRESS_IS_LOADED', true);

    if ( ! class_exists($autoLoaderFullClassName)) {
        require_once EMBEDPRESS_PATH_CORE . EMBEDPRESS_AUTOLOADER_NAME . '.php';
    }

    AutoLoader::register(str_replace('\\', "", EMBEDPRESS_NAMESPACE), EMBEDPRESS_PATH_CORE);

    // Register the src directory for new structure
    AutoLoader::register('EmbedPress\\Src', EMBEDPRESS_PATH_BASE . 'src/');
}
unset($autoLoaderFullClassName);
