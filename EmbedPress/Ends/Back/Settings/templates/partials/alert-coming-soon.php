<?php

?>
<div class="pro__alert__wrap">
	<div class="pro__alert__card">
		<img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/alert.svg" alt="">
		<h2><?php esc_html_e( "Opps...", "embedpress" ); ?></h2>
		<p><?php printf( __( 'This feature is coming soon to the <a href="%s" target="_blank">Premium</a> Version', "embedpress" ), 'https://wpdeveloper.net/in/upgrade-embedpress'); ?></p>
		<a href="#" class="button radius-10"><?php esc_html_e( "Close", "embedpress" ); ?></a>
	</div>
</div>
