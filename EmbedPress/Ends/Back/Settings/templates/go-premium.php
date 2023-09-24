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
<div class="background__white radius-16 p40">

	<h1 class="page-heading">
		<?php echo esc_html__( 'Premium Embed Platform', 'embedpress' ); ?>
	</h1>
	<div class="source-settings-page page-premium">
		<div class="tab-content-section">
			<?php
			foreach ($sources as $source) : ?>
				<div class="source-item" data-tab="<?php echo esc_attr($source['type']); ?>">
					<div class="source-left">
						<div class="icon">
							<img class="source-image" src="<?php echo esc_url($source['icon']); ?>" alt="<?php echo esc_attr($source['name']); ?>">
						</div>
						<span class="source-name"><?php echo esc_html($source['name']); ?></span>
					</div>
					<div class="source-right">
						<a href="#">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<g clip-path="url(#a)" stroke="#988FBD" stroke-linecap="round" stroke-linejoin="round">
									<path d="M6.883 2.878c.284-1.17 1.95-1.17 2.234 0a1.15 1.15 0 0 0 1.715.71c1.029-.626 2.207.551 1.58 1.58a1.148 1.148 0 0 0 .71 1.715c1.17.284 1.17 1.95 0 2.234a1.15 1.15 0 0 0-.71 1.715c.626 1.029-.551 2.207-1.58 1.58a1.148 1.148 0 0 0-1.715.71c-.284 1.17-1.95 1.17-2.234 0a1.15 1.15 0 0 0-1.715-.71c-1.029.626-2.207-.551-1.58-1.58a1.15 1.15 0 0 0-.71-1.715c-1.17-.284-1.17-1.95 0-2.234a1.15 1.15 0 0 0 .71-1.715c-.626-1.029.551-2.207 1.58-1.58a1.149 1.149 0 0 0 1.715-.71Z" />
									<path d="M6 8a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
								</g>
								<defs>
									<clipPath id="a">
										<path fill="#fff" d="M0 0h16v16H0z" />
									</clipPath>
								</defs>
							</svg>
						</a>
						<a href="#">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<g clip-path="url(#a)" stroke="#988FBD" stroke-linecap="round" stroke-linejoin="round">
									<path d="M9.333 2v2.667a.667.667 0 0 0 .667.666h2.666" />
									<path d="M11.333 14H4.666a1.334 1.334 0 0 1-1.333-1.333V3.333A1.333 1.333 0 0 1 4.666 2h4.667l3.333 3.333v7.334A1.333 1.333 0 0 1 11.333 14ZM6 11.333h4M6 8.667h4" />
								</g>
								<defs>
									<clipPath id="a">
										<path fill="#fff" d="M0 0h16v16H0z" />
									</clipPath>
								</defs>
							</svg>
						</a>
					</div>
				</div>
			<?php endforeach; ?>


		</div>
	</div>
	<div class="upgrage__card__tab__style">
		<h3><?php esc_html_e("Why upgrade to Premium Version?", "embedpress"); ?></h3>
		<p><?php esc_html_e("The premium version helps us to continue development of the product incorporating even more features and enhancements. You will also get world class support from our dedicated team, 24/7.", "embedpress"); ?></p>
		<a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank" class="button button__themeColor"><?php esc_html_e("Get Premium Version", "embedpress"); ?></a>
	</div>
</div>