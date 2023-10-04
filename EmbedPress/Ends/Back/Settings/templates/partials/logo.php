<?php
/*
 * Footer of the settings page
 * */
?>
<header class="embedpress-header">
    <a href="#" class="site__logo"><img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/logo.svg" alt=""></a>
    <p>All-In-One <a target="_blank" href="<?php echo esc_url('https://embedpress.com'); ?>">Embedding Solution</a>  To Fuel up your WordPress Experience</p>
    <ul class="embedpress-version-wrapper">
        <li>Core Version: v<?php echo EMBEDPRESS_VERSION; ?></li>
	    <?php if ( $pro_active ) { ?>
            <li>Pro Version: v<?php echo get_embedpress_pro_version(); ?></li>
	    <?php }?>
    </ul>
</header>