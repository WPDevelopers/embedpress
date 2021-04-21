<?php
/*
 * License Settings page */
?>

<div class="embedpress-license__details radius-25 o-hidden">
	<div class="license__content">
		<div class="thumb__area">
			<img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/unlock-license.svg" alt="">
			<h2>Just one more step to go!</h2>
		</div>
		<p>Enter your license key here, to activate NotificationX Pro, and get automatic updates and premium support. <br> Visit the <a href="#">Validation Guide</a> for help.</p>
		<ol>
			<li>Log in to <a href="#">your account</a> to get your license key.</li>
			<li>If you don't yet have a license key, get <a href="#">NotificationX Pro</a> now.</li>
			<li>Copy the license key from your account and paste it below.</li>
			<li>Click on "Activate License" button.</li>
		</ol>
		<form action="" method="post"  class="form__inline">
			<?php echo  $nonce_field ; ?>
			<div class="form__group">
				<span class="input__icon"><i class="ep-icon ep-lock"></i></span>
				<input type="text" class="form__control" placeholder="Place your license kye and active">
			</div>
			<button class="button button__themeColor radius-10">Active License</button>
		</form>
	</div>
	<div class="license__manage">
		<img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/logo.svg" alt="">
		<a href="#" class="button radius-10">Manage License</a>
	</div>
</div>
