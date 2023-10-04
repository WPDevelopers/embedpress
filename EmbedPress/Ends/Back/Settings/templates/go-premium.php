<?php
$icon_src = EMBEDPRESS_SETTINGS_ASSETS_URL . "img/sources/icons";

$sources = [
	["name" => "YouTube", "icon" => $icon_src . "/youtube.png", "type" => "video", "settings" => true],
	["name" => "Youtube Live", "icon" => $icon_src . "/youtubelive.png", "type" => "stream", "settings" => true],
	["name" => "Vimeo", "icon" => $icon_src . "/vimeo.png", "type" => "video", "settings" => true],
	["name" => "Wistia", "icon" => $icon_src . "/wistia.png", "type" => "video", "settings" => true],
	["name" => "Twitch", "icon" => $icon_src . "/twitch.png", "type" => "video", "settings" => true],
	["name" => "Dailymotion", "icon" => $icon_src . "/dailymotion.png", "type" => "video", "settings" => true],
	["name" => "SoundCloud", "icon" => $icon_src . "/soundcloud.png", "type" => "audio", "settings" => true],
	["name" => "Spotify", "icon" => $icon_src . "/spotify.png", "type" => "audio", "settings" => true],
	["name" => "Google Calendar", "icon" => $icon_src . "/google-calendar.png", "type" => "google", "settings" => true],
	["name" => "OpenSea", "icon" => $icon_src . "/opensea.png", "type" => "google", "settings" => true],
	["name" => "Calendly", "icon" => $icon_src . "/calendly.png", "type" => "calendar", "settings" => true],
];


?>
<div class="background__white radius-16 p-24">

	<h1 class="page-heading">
		<?php echo esc_html__( 'Why upgrade to Premium Version?', 'embedpress' ); ?>
	</h1>
	<div class="source-settings-page page-premium">
		<p class="page-premium-text">
			<?php printf( esc_html__( "The premium version helps us to continue development of the product incorporating even more features and enhancements. You will also get world class support from our dedicated team, 24/7.", "embedpress" )); ?>
		</p>
	</div>
	<div class="upgrage__card__tab__style">
		<h3><?php esc_html_e("Exclusive PRO Features", "embedpress"); ?></h3>
		<ul class="upgrage__card__tab__list">
			<li class="upgrage__card__tab__list__item"><?php printf( esc_html__( "Social Share", "embedpress" )); ?>
			</li>
			<li class="upgrage__card__tab__list__item"><?php printf( esc_html__( "Lazy Loading", "embedpress" )); ?>
			</li>
			<li class="upgrage__card__tab__list__item"><?php printf( esc_html__( "SEO Optimized", "embedpress" )); ?>
			</li>
			<li class="upgrage__card__tab__list__item"><?php printf( esc_html__( "Custom Branding", "embedpress" )); ?>
			</li>
			<li class="upgrage__card__tab__list__item">
				<?php printf( esc_html__( "Content Protection", "embedpress" )); ?></li>
			<li class="upgrage__card__tab__list__item">
				<?php printf( esc_html__( "Custom Audio & Video Player", "embedpress" )); ?></li>
			<li class="upgrage__card__tab__list__item">
				<?php printf( esc_html__( "PDF & Documents Embedding", "embedpress" )); ?></li>
			<li class="upgrage__card__tab__list__item">
				<?php printf( esc_html__( "Embed From 150+ Sources", "embedpress" )); ?></li>
			<li class="upgrage__card__tab__list__item"><?php printf( esc_html__( "Wrapper Support", "embedpress" )); ?>
			</li>
		</ul>
		<a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank"
			class="button button-pro-upgrade"><?php esc_html_e("Upgrade To Pro", "embedpress"); ?><i
				class="ep-icon ep-link-icon"></i></a>
	</div>
</div>