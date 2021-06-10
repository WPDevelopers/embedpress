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
                $template_file = apply_filters( 'embedpress_settings_template_path', EMBEDPRESS_SETTINGS_PATH . "templates/{$template}.php", $template);
                if ( file_exists( $template_file  ) ) {
                    include_once $template_file;
                }
				if ( 'license' != $template) {
					include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/toast-message.php';
				}
                do_action( 'embedpress_settings_template', $template);

                ?>
            </div>
        </div>
		<?php include_once EMBEDPRESS_SETTINGS_PATH . 'templates/partials/footer.php'; ?>
    </div>
</div>