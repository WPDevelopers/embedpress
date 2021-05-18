<?php
/*
 * Main settings page
 *  All undefined vars comes from 'render_settings_page' method
 * */
?>
<div class="template__wrapper background__liteGrey p30 pb50">
    <div class="embedpress__container">
		<?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/logo.php'; ?>
        <div class="embedpress-body mb30">
			<?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/sidebar.php'; ?>
            <div class="embedpress-content">
                <?php
                include_once EMBEDPRESS_SETTINGS_PATH . "templates/{$template}.php";
				if ( 'license' != $template) {
					include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/toast-message.php';
				}
				?>
            </div>
        </div>
		<?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/footer.php'; ?>
    </div>
</div>