<?php
/*
 * Custom Logo Settings page
 * All undefined vars comes from 'render_settings_page' method
 *
 *  */

$option_name = EMBEDPRESS_PLG_NAME.':youtube';
$yt_settings = get_option( $option_name);
$gen_settings = get_option( EMBEDPRESS_PLG_NAME);
$yt_logo_xpos = isset( $yt_settings['logo_xpos']) ? intval( $yt_settings['logo_xpos']) : 10;
$yt_logo_ypos = isset( $yt_settings['logo_ypos']) ? intval( $yt_settings['logo_ypos']) : 10;
$yt_logo_opacity = isset( $yt_settings['logo_opacity']) ? intval( $yt_settings['logo_opacity']) : 50;
$yt_logo_id = isset( $yt_settings['logo_id']) ? intval( $yt_settings['logo_id']) : 0;
$yt_logo_url = isset( $yt_settings['logo_url']) ? esc_url( $yt_settings['logo_url']) : '';
$yt_cta_url = isset( $yt_settings['cta_url']) ? esc_url( $yt_settings['cta_url']) : '';
$yt_branding = isset( $yt_settings['branding']) ? sanitize_text_field( $yt_settings['branding']) : (!empty( $yt_logo_url) ? 'yes': 'no');


$embedpress_document_powered_by = isset( $gen_settings['embedpress_document_powered_by']) ? sanitize_text_field( $gen_settings['embedpress_document_powered_by']) : 'yes';
?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "Global Branding Settings", "embedpress" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" enctype="multipart/form-data"  class="embedpress-settings-form">
	        <?php
	        do_action( 'embedpress_before_custom_branding_settings_fields');
	        echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label">Powered by EmbedPress</p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox" data-default="<?php echo esc_attr(  $embedpress_document_powered_by ); ?>" data-value="<?php echo esc_attr(  $embedpress_document_powered_by ); ?>" value="yes" name="embedpress_document_powered_by" <?php checked( 'yes', $embedpress_document_powered_by );?>>
                        <span></span>
                    </label>
                </div>
            </div>
            <h3><?php esc_html_e( "Custom Logo", "embedpress" ); ?></h3>
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "YouTube Custom Branding", "embedpress" ); echo $pro_active ? '': ' <span class="isPro">Pro</span>'; ?></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text <?php echo $pro_active ? '': 'isPro'; ?>">
                        <input type="checkbox" name="yt_branding"  data-default="<?php echo esc_attr(  $yt_branding ); ?>" data-value="<?php echo esc_attr(  $yt_branding ); ?>"  value="yes" <?php checked( 'yes', $yt_branding);?> <?php echo $pro_active ? '': ' disabled'; ?>>
                        <span></span>
                    </label>

                    <div class="logo__adjust__wrap <?php echo $pro_active ? '': 'proOverlay'; ?>" style="<?php if ( ('yes' !== $yt_branding) || !$pro_active ) { echo 'display:none;'; } ?>">
                        <label class="logo__upload" id="yt_logo_upload_wrap" style="<?php if (!empty( $yt_logo_url)) { echo 'display:none;'; } ?>">
                            <input type="hidden" class="preview__logo__input" name="yt_logo_url" id="yt_logo_url" data-default="<?php echo esc_attr( $yt_logo_url ); ?>" value="<?php echo $yt_logo_url; ?>">
                            <input type="hidden" class="preview__logo__input_id" name="yt_logo_id" id="yt_logo_id" data-default="<?php echo esc_attr( $yt_logo_id ); ?>" value="<?php echo $yt_logo_id; ?>">
                            <span class="icon"><i class="ep-icon ep-upload"></i></span>
                            <span class="text"><?php esc_html_e( "Click To Upload", "embedpress" ); ?></span>
                        </label>
                            <div class="logo__upload__preview" id="yt_logo__upload__preview" style="<?php if ( empty( $yt_logo_url) ) { echo 'display:none'; } ?> ">
                                <div class="instant__preview">
                                    <a href="#" id="yt_preview__remove" class="preview__remove"><i class="ep-icon ep-cross"></i></a>
                                    <img id="yt_logo_preview" src="<?php echo $yt_logo_url; ?>" alt="">
                                </div>
                            </div>

                        <div class="logo__adjust">
                            <div class="logo__adjust__controller">
                                <div class="logo__adjust__controller__item">
                                    <span class="controller__label">Logo Opacity (%)</span>
                                    <div class="logo__adjust__controller__inputs">
                                        <input type="range" max="100" data-default="<?php echo esc_attr( $yt_logo_opacity ); ?>" value="<?php echo $yt_logo_opacity; ?>" class="opacity__range" name="yt_logo_opacity">
                                        <input readonly type="number" class="form__control range__value" data-default="<?php echo esc_attr( $yt_logo_opacity ); ?>" value="<?php echo $yt_logo_opacity; ?>">
                                    </div>
                                </div>
                                <div class="logo__adjust__controller__item">
                                    <span class="controller__label">Logo X Position (%)</span>
                                    <div class="logo__adjust__controller__inputs">
                                        <input type="range" max="100" data-default="<?php echo esc_attr( $yt_logo_xpos ); ?>" value="<?php echo $yt_logo_xpos; ?>" class="x__range" name="yt_logo_xpos">
                                        <input readonly type="number" class="form__control range__value" data-default="<?php echo esc_attr( $yt_logo_xpos ); ?>" value="<?php echo $yt_logo_xpos; ?>">
                                    </div>
                                </div>
                                <div class="logo__adjust__controller__item">
                                    <span class="controller__label">Logo Y Position (%)</span>
                                    <div class="logo__adjust__controller__inputs">
                                        <input type="range" max="100" data-default="<?php echo esc_attr( $yt_logo_ypos ); ?>" value="<?php echo esc_attr( $yt_logo_ypos ); ?>" class="y__range" name="yt_logo_ypos" >
                                        <input readonly type="number" class="form__control range__value" data-default="<?php echo esc_attr( $yt_logo_ypos ); ?>"  value="<?php echo esc_attr( $yt_logo_ypos ); ?>">
                                    </div>
                                </div>
                                <div class="logo__adjust__controller__item">
                                    <label class="controller__label" for="yt_cta_url" ><?php esc_html_e( "Call to Action Link", "embedpress" );?> </label>
                                    <div>
                                        <input type="url"  name="yt_cta_url" id="yt_cta_url" class="form__control" data-default="<?php echo esc_attr( $yt_cta_url ); ?>" value="<?php echo esc_attr( $yt_cta_url); ?>">

                                        <p><?php esc_html_e( "You may link the logo to any CTA link.", "embedpress" ); ?></p>
                                    </div>
                                </div>
                            </div>
                            <div class="logo__adjust__preview">
                                <span class="title"><?php esc_html_e( "Live Preview", "embedpress" ); ?></span>
                                <div class="preview__box">
                                    <iframe src="https://www.youtube.com/embed/2u0HRUdLHxo" frameborder="0"></iframe>
                                    <img src="<?php echo $yt_logo_url; ?>" class="preview__logo" style="bottom:<?php echo esc_attr( $yt_logo_ypos); ?>%; right:<?php echo esc_attr( $yt_logo_xpos); ?>%; opacity:<?php echo ($yt_logo_opacity/100); ?>;" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
	                <?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php
	                printf( esc_html__( 'Vimeo Custom Branding %s', 'embedpress'), $coming_soon);
	                echo $pro_active ? '': ' <span class="isPro">Pro</span>'; ?>
                </p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text isPro">
                        <input type="checkbox" disabled>
                        <span></span>
                    </label>
	                <?php  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-coming-soon.php'; ?>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php
	                printf( esc_html__( 'Wistia Custom Branding %s', 'embedpress'), $coming_soon);
                    echo $pro_active ? '': ' <span class="isPro">Pro</span>';
                    ?></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text isPro">
                        <input type="checkbox" disabled>
                        <span></span>
                    </label>
   	                <?php  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-coming-soon.php'; ?>

                </div>
            </div>
            <div class="form__group">
                <p class="form__label"><?php
	                printf( esc_html__( 'Twitch Custom Branding %s', 'embedpress'), $coming_soon);
	                echo $pro_active ? '': ' <span class="isPro">Pro</span>'; ?></p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text isPro">
                        <input type="checkbox" disabled>
                        <span></span>
                    </label>
   	                <?php  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-coming-soon.php'; ?>

                </div>
            </div>
	        <?php  do_action( 'embedpress_after_custom_branding_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="custom_logo"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>