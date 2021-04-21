<?php
/*
 * Main settings page
 * all defined vars are coming from @file EmbedpressSettings.php
 * */
?>
<div class="template__wrapper background__liteGrey p30 pb50">
    <div class="embedpress__container">
		<?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/logo.php'; ?>
        <div class="embedpress-body mb30">
			<?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/sidebar.php'; ?>
            <div class="embedpress-content">
				<?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/upgrade-card.php'; ?>
                <?php include_once EMBEDPRESS_SETTINGS_PATH . "templates/{$template}.php"; ?>
            </div>
        </div>
		<?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/footer.php'; ?>
    </div>
</div>