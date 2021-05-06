<?php
/*
 * Upgrade card
 * */

if ( isset( $pro_active)  && $pro_active) {
    return;
}
?>
<div class="upgrade__card mb30">
    <div class="icon">
        <img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/site-icon.svg" alt="">
    </div>
    <div class="card__content">
        <h4><?php esc_html_e( "Upgrade To Pro", "embedpress" ); ?></h4>
        <p><?php esc_html_e( "The premium version helps us to continue development of the product incorporating even more features and enhancements. You will also get world class support from our dedicated team, 24/7.", "embedpress" ); ?></p>
    </div>
    <a href="https://embedpress.com/#pricing" class="button button__white radius-10"><?php esc_html_e( "Upgrade To Pro", "embedpress" ); ?></a>
</div>