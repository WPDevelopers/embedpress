<?php
/*
 * General Settings page
 *  All undefined vars comes from 'render_settings_page' method
 */

$g_settings = get_option( EMBEDPRESS_PLG_NAME);
$lazy_load = isset( $g_settings['g_lazyload']) ? $g_settings['g_lazyload'] : 0;
$enableEmbedResizeHeight = isset( $g_settings['enableEmbedResizeHeight']) ? $g_settings['enableEmbedResizeHeight'] : 550;
$enableEmbedResizeWidth = isset( $g_settings['enableEmbedResizeWidth']) ? $g_settings['enableEmbedResizeWidth'] : 600;
?>
<div class="embedpress__settings background__white radius-25 p40">
	<h3>Global Embed iFrame</h3>
	<div class="embedpress__settings__form">
		<form action="" method="post" class="embedpress-settings-form">
            <?php
            do_action( 'embedpress_before_general_settings_fields');
            echo  $nonce_field ;
            ?>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( 'Embed iFrame Height', 'embedpress'); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<input type="number" name="enableEmbedResizeHeight" class="form__control" data-default="<?php echo esc_attr( $enableEmbedResizeHeight); ?>" value="<?php echo esc_attr( $enableEmbedResizeHeight); ?>">
						<span class="frame__unit">px</span>
					</div>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( 'Embed iFrame Width', 'embedpress'); ?></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<input type="number" name="enableEmbedResizeWidth" class="form__control" data-default="<?php echo esc_attr( $enableEmbedResizeWidth); ?>" value="<?php echo esc_attr( $enableEmbedResizeWidth); ?>">
						<span class="frame__unit">px</span>
					</div>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label"><?php esc_html_e( 'Lazy Load', 'embedpress'); echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?> </p>
				<div class="form__control__wrap">
					<label class="input__switch switch__text <?php echo $pro_active ? '': 'isPro'; ?>">
						<input type="checkbox" name="g_lazyload" data-default="<?php echo esc_attr(  $lazy_load ); ?>" data-value="<?php echo esc_attr(  $lazy_load ); ?>" value="1" <?php echo $pro_active ? '': 'disabled ';  checked( '1', $lazy_load) ?>>
						<span></span>
					</label>
					<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
				</div>
			</div>
			<div class="form__group mb0">
				<p class="form__label"><?php
                    /*translators: % means coming soon text markup*/
                    printf( esc_html__( 'Loading Animation %s', 'embedpress'), $coming_soon);

                    echo !$pro_active ? ' <span class="isPro">PRO</span>' : ''; ?>
                </p>
				<div class="form__control__wrap">
					<label class="input__switch switch__text  isPro">
						<input type="checkbox" name="g_loading_animation" data-default="1" value="1" disabled>
						<span></span>
					</label>
					<?php  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-coming-soon.php'; ?>
				</div>
			</div>
            <?php do_action( 'embedpress_after_general_settings_fields');  ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="general"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
	</div>
</div>
