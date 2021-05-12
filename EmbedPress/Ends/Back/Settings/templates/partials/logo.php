<?php
/*
 * Footer of the settings page
 * */
?>
<header class="embedpress-header" style="display: flex; justify-content: space-between; align-items: center">
    <a href="#" class="site__logo"><img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/logo.svg" alt=""></a>
    <ul class="embedpress-version-wrapper">
        <li>EmbedPress: V<?php echo EMBEDPRESS_VERSION; ?></li>
	    <?php if ( defined( 'EMBEDPRESS_PRO_VERSION') ) { ?>
            <li>EmbedPress Pro: V<?php echo EMBEDPRESS_PRO_VERSION; ?></li>
	    <?php }?>
    </ul>
</header>