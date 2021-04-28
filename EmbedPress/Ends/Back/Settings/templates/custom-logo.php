<?php
/*
 * Custom Logo Settings page
 * All undefined vars comes from 'render_settings_page' method
 *
 *  */
?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "Custom Logo", "embedpress" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" enctype="multipart/form-data">
	        <?php
	        do_action( 'embedpress_before_custom_branding_settings_fields');
	        echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label">Powered by EmbedPress</p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox" value="yes" name="embedpress_document_powered_by">
                        <span></span>
                    </label>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "YouTube Custom Branding", "embedpress" ); echo $pro_active ? '': ' <span class="isPro">Pro</span>'; ?></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text <?php echo $pro_active ? '': 'isPro'; ?>">
                        <input type="checkbox" name="yt_branding" value="yes">
                        <span></span>
                    </label>
                    <div class="logo__adjust__wrap">
                        <label class="logo__upload">
                            <input type="file" class="preview__logo__input" name="yt_logo_url">
                            <span class="icon"><i class="ep-icon ep-upload"></i></span>
                            <span class="text"><?php esc_html_e( "Drag Or Choose File To Upload", "embedpress" ); ?></span>
                        </label>
                        <div class="logo__adjust">
                            <div class="logo__adjust__controller">
                                <div class="logo__adjust__controller__item">
                                    <span class="controller__label">Logo Opacity (%)</span>
                                    <div class="logo__adjust__controller__inputs">
                                        <input type="range" max="100" value="100" class="opacity__range" name="yt_logo_opacity">
                                        <input type="number" class="form__control range__value" value="100" readonly>
                                    </div>
                                </div>
                                <div class="logo__adjust__controller__item">
                                    <span class="controller__label">Logo X Position (%)</span>
                                    <div class="logo__adjust__controller__inputs">
                                        <input type="range" max="100" value="6" class="x__range" name="yt_logo_xpos">
                                        <input type="number" class="form__control range__value" value="6" readonly>
                                    </div>
                                </div>
                                <div class="logo__adjust__controller__item">
                                    <span class="controller__label">Logo Y Position (%)</span>
                                    <div class="logo__adjust__controller__inputs">
                                        <input type="range" max="100" value="10" class="y__range" name="yt_logo_ypos">
                                        <input type="number" class="form__control range__value" value="10" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="logo__adjust__preview">
                                <span class="title">Live Preview</span>
                                <div class="preview__box">
                                    <iframe src="https://www.youtube.com/embed/tgbNymZ7vqY" frameborder="0"></iframe>
                                    <img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/logo.svg" class="preview__logo" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
	                <?php if ( !$pro_active ) { ?>
                        <div class="pro__alert__wrap">
                            <div class="pro__alert__card">
                                <img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/alert.png" alt="">
                                <h2><?php esc_html_e( "Opps...", "embedpress" ); ?></h2>
                                <p><?php printf( __( 'You need to upgrade to the <a href="%s">Premium</a> Version to use this feature', "embedpress" ), 'https://embedpress.com'); ?></p>
                                <a href="#" class="button radius-10"><?php esc_html_e( "Close", "embedpress" ); ?></a>
                            </div>
                        </div>
	                <?php } ?>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Vimeo Custom Branding (Coming soon)", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">Pro</span>'; ?></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox" disabled>
                        <span></span>
                    </label>

                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Wistia Custom Branding (Coming soon)", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">Pro</span>'; ?></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox" disabled>
                        <span></span>
                    </label>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Twitch Custom Branding (Coming soon)", "embedpress" );  echo $pro_active ? '': ' <span class="isPro">Pro</span>'; ?></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox" disabled>
                        <span></span>
                    </label>
                </div>
            </div>
	        <?php  do_action( 'embedpress_after_custom_branding_settings_fields'); ?>
            <button class="button button__themeColor radius-10" name="submit" value="custom_logo"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>