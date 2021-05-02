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
        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown</p>
    </div>
    <a href="https://embedpress.com" class="button button__white radius-10"><?php esc_html_e( "Upgrade To Pro", "embedpress" ); ?></a>
</div>