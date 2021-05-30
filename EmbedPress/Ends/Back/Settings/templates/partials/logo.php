<?php
/*
 * Footer of the settings page
 * */
?>
<header class="embedpress-header">
    <a href="#" class="site__logo"><img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/logo.svg" alt=""></a>
    <ul class="embedpress-version-wrapper">
        <li>Core Version: V<?php echo EMBEDPRESS_VERSION; ?></li>
	    <?php if ( $pro_active ) { ?>
            <li>Pro Version: V<?php echo get_embedpress_pro_version(); ?></li>
	    <?php }?>
    </ul>
</header>