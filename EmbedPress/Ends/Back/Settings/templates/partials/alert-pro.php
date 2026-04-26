<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="pro__alert__wrap">
	<div class="pro__alert__card">
		<img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/alert.svg'); ?>" alt="">

		<h2><?php esc_html_e( "Opps...", "embedpress" ); ?></h2>
		<p><?php
			/* translators: %s is the premium upgrade URL. */
			echo wp_kses_post(
				sprintf(
					__( 'You need to upgrade to the <a href="%s" target="_blank">Premium</a> Version to use this feature', "embedpress" ),
					esc_url( 'https://wpdeveloper.com/in/upgrade-embedpress' )
				)
			);
		?></p>
		<a href="#" class="button radius-10"><?php esc_html_e( "Close", "embedpress" ); ?></a>
	</div>
</div>
