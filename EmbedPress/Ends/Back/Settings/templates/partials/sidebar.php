<?php
/*
 * Side of the settings page
 * */
$page = admin_url('admin.php?page=embedpress-new');
?>
<div class="embedpress-sidebar">
	<a href="#" class="sidebar__toggler"><i class="ep-icon ep-bar"></i></a>
	<ul class="sidebar__menu">
		<li class="sidebar__item sidebar__dropdown">
			<a href="<?php echo esc_url( $page.'&page_type=general'); ?>" class="sidebar__link sidebar__link--toggler"><span><i class="ep-icon ep-gear"></i></span> General</a>
			<ul class="dropdown__menu">
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $page.'&page_type=general'); ?>" class="dropdown__link active">Settings</a>
				</li>
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $page.'&page_type=youtube'); ?>" class="dropdown__link">YouTube</a>
				</li>
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $page.'&page_type=vimeo'); ?>" class="dropdown__link">Vimeo</a>
				</li>
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $page.'&page_type=wistia'); ?>" class="dropdown__link">Wistia</a>
				</li>
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $page.'&page_type=twitch'); ?>" class="dropdown__link">Twitch</a>
				</li>
			</ul>
		</li>
		<li class="sidebar__item"><a href="<?php echo esc_url( $page.'&page_type=elements'); ?>" class="sidebar__link"><span><i class="ep-icon ep-cell"></i></span> Elements</a></li>
		<li class="sidebar__item sidebar__dropdown">
			<a href="<?php echo esc_url( $page.'&page_type=custom-logo'); ?>" class="sidebar__link sidebar__link--toggler"><span><i class="ep-icon ep-branding"></i></span> Branding</a>
			<ul class="dropdown__menu">
				<li class="dropdown__item">
					<a href="<?php echo esc_url( $page.'&page_type=custom-logo'); ?>" class="dropdown__link">Custom Logo</a>
				</li>
			</ul>
		</li>
		<li class="sidebar__item"><a href="<?php echo esc_url( $page.'&page_type=premium'); ?>" class="sidebar__link"><span><i class="ep-icon ep-premium"></i></span> Go Premium</a></li>
	</ul>
</div>

