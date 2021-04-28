<?php
/*
 * Custom Logo Settings page
 * All undefined vars comes from 'render_settings_page' method
 *
 *  */
?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3>Custom Logo</h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" >
	        <?php
	        do_action( 'embedpress_before_custom_branding_settings_fields');
	        echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label">Powered by EmbedPress</p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox">
                        <span></span>
                    </label>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">YouTube Custom Branding <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox">
                        <span></span>
                    </label>
                    <div class="logo__adjust__wrap">
                        <label class="logo__upload">
                            <input type="file" class="preview__logo__input">
                            <span class="icon"><i class="ep-icon ep-upload"></i></span>
                            <span class="text">Drag Or Choose File To Upload</span>
                        </label>
                        <div class="logo__adjust">
                            <div class="logo__adjust__controller">
                                <div class="logo__adjust__controller__item">
                                    <span class="controller__label">Logo Opacity (%)</span>
                                    <div class="logo__adjust__controller__inputs">
                                        <input type="range" max="100" value="100" class="opacity__range">
                                        <input type="number" class="form__control range__value" value="100" readonly>
                                    </div>
                                </div>
                                <div class="logo__adjust__controller__item">
                                    <span class="controller__label">Logo X Position (%)</span>
                                    <div class="logo__adjust__controller__inputs">
                                        <input type="range" max="100" value="6" class="x__range">
                                        <input type="number" class="form__control range__value" value="6" readonly>
                                    </div>
                                </div>
                                <div class="logo__adjust__controller__item">
                                    <span class="controller__label">Logo Y Position (%)</span>
                                    <div class="logo__adjust__controller__inputs">
                                        <input type="range" max="100" value="10" class="y__range">
                                        <input type="number" class="form__control range__value" value="10" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="logo__adjust__preview">
                                <span class="title">Live Preview</span>
                                <div class="preview__box">
                                    <iframe src="https://www.youtube.com/embed/tgbNymZ7vqY" frameborder="0"></iframe>
                                    <img src="assets/img/logo.svg" class="preview__logo" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Vimeo Custom Branding <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox">
                        <span></span>
                    </label>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Wistia Custom Branding <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox">
                        <span></span>
                    </label>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Twitch Custom Branding <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox">
                        <span></span>
                    </label>
                </div>
            </div>
	        <?php  do_action( 'embedpress_after_custom_branding_settings_fields'); ?>
            <button class="button button__themeColor radius-10" name="submit" value="custom-logo"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>
