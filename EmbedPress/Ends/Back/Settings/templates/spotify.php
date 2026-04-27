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

/*
 * Spotify Settings page template
 *  All undefined vars comes from 'render_settings_page' method
 *  */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$settings = get_option(EMBEDPRESS_PLG_NAME . ':spotify');
$spotify_theme = isset($settings['theme']) ? sanitize_text_field($settings['theme']) : '1';

?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e("Spotify Settings", "embedpress"); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" class="embedpress-settings-form">
            <?php
            do_action('embedpress_before_spotify_settings_fields');
            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            echo $nonce_field; ?>
            <div class="form__group">
                <label class="form__label" for="spotify_theme"><?php esc_html_e("Player Background Color", "embedpress"); ?></label>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="spotify_theme" id="spotify_theme" data-default="<?php echo esc_attr($spotify_theme); ?>">
                            <option value="1" <?php selected('1', $spotify_theme); ?>><?php esc_html_e("Dynamic", "embedpress"); ?></option>
                            <option value="0" <?php selected('0', $spotify_theme); ?>><?php esc_html_e("Black & White", "embedpress"); ?></option>
                        </select>
                    </div>

                    <p><?php esc_html_e( 'Dynamic option will use the most vibrant color from the album art.', 'embedpress' ); ?></p>
                </div>
            </div>

            <?php do_action('embedpress_after_spotify_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="spotify"><?php esc_html_e('Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>
