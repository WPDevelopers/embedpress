<?php
/*
 * Footer of the settings page
 * */
?>
<header class="embedpress-header">
    <a href="#" class="site__logo"><img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/logo.svg" alt=""></a>
    <p>All-In-One <a target="_blank" href="<?php echo esc_url('https://embedpress.com'); ?>">Embedding Solution</a> To Fuel up your WordPress Experience</p>
    <div class="embedpress-version-wrapper">
        <?php if ($pro_active) : ?>
            <a href="#" class="comunity-link"><?php echo esc_html__('Join Our Community', 'embedpress'); ?></a>
        <?php else : ?>
            <a href="#" class="comunity-link"><?php echo esc_html__('Upgrage To Pro', 'embedpress'); ?></a>
        <?php endif; ?>

    </div>
</header>