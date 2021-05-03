<?php
/*
 * YouTube Settings page */
$elements = (array) get_option( EMBEDPRESS_PLG_NAME.":elements", []);
$g_blocks = isset( $elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
$e_blocks = isset( $elements['elementor']) ? (array) $elements['elementor'] : [];
$c_blocks = isset( $elements['classic']) ? (array) $elements['classic'] : [];
?>

<div class="background__white p40 radius-25 mb30">
    <div class="embedpress--elements__wrap">
        <h3>Gutenberg</h3>
        <div class="embedpress__row grid__3">
            <div class="emement__item">
                <h5>EmbedPress</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "This is the master EmbedPress Block. It supports 100+ providers", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="embedpress" data-type="gutenberg" <?php echo isset( $g_blocks['embedpress']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item isPro">
                <h5>Document</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Document Block","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="document" data-type="gutenberg" <?php echo isset( $g_blocks['document']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item">
                <h5>Youtube</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable YouTube Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="youtube" data-type="gutenberg" <?php echo isset( $g_blocks['youtube']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item">
                <h5>Google Docs</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Google Docs Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-docs" data-type="gutenberg" <?php echo isset( $g_blocks['google-docs']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item">
                <h5>Google Slides</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Google Slides Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-slides" data-type="gutenberg" <?php echo isset( $g_blocks['google-slides']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item">
                <h5>Google Sheets</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Google Sheets Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-sheets" data-type="gutenberg" <?php echo isset( $g_blocks['google-sheets']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item isPro">
                <h5>Google Forms</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Google Forms Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-forms" data-type="gutenberg" <?php echo isset( $g_blocks['google-forms']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item">
                <h5>Google Drawings</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Google Drawings Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-drawings" data-type="gutenberg" <?php echo isset( $g_blocks['google-drawings']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item">
                <h5>Google Maps</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Google Maps Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-maps" data-type="gutenberg" <?php echo isset( $g_blocks['google-maps']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item">
                <h5>Twitch</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Twitch Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="twitch" data-type="gutenberg" <?php echo isset( $g_blocks['twitch']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item">
                <h5>Wistia</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Wistia Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="wistia" data-type="gutenberg" <?php echo isset( $g_blocks['wistia']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
            <div class="emement__item">
                <h5>Vimeo</h5>
                <a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It will enable Vimeo Block", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="vimeo" data-type="gutenberg" <?php echo isset( $g_blocks['vimeo']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
                <?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
            </div>
        </div>
    </div>
</div>
<div class="background__white p40 radius-25 mb30">
	<div class="embedpress--elements__wrap">
		<h3>Elementor</h3>
		<div class="embedpress__row grid__3">
			<div class="emement__item">
				<h5>EmbedPress</h5>
				<a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "This is the master EmbedPress Block For Elementor. It supports 100+ providers", "embedpress" ); ?></span>
                </a>
				<label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="embedpress" data-type="elementor" <?php echo isset( $e_blocks['embedpress']) ? 'checked': '';  ?> >
					<span></span>
				</label>
				<?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
			</div>
			<div class="emement__item isPro">
				<h5>EmbedPress Document</h5>
				<a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It enables embedding Document on Elementor", "embedpress" ); ?></span>
                </a>
				<label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="embedpress-document" data-type="elementor" <?php echo isset( $e_blocks['embedpress-document']) ? 'checked': '';  ?> >
					<span></span>
				</label>
				<?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
			</div>
		</div>
	</div>
</div>
<div class="background__white radius-25 p40">
	<div class="embedpress--elements__wrap">
		<h3>Classic Editor</h3>
		<div class="embedpress__row grid__3">
			<div class="emement__item">
				<h5><?php esc_html_e( "Preview In Frontend", "embedpress" ); ?></h5>
				<a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Enable Preview in Frontend", "embedpress" ); ?></span>
                </a>
				<label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="frontend-preview" data-type="classic" <?php echo isset( $c_blocks['frontend-preview']) ? 'checked': '';  ?> >
					<span></span>
				</label>
				<?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
			</div>
			<div class="emement__item">
				<h5><?php esc_html_e( "Preview In Editor", "embedpress" ); ?></h5>
				<a href="#" class="has__question">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Enable Preview in Classic Editor", "embedpress" ); ?></span>
                </a>
				<label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="backend-preview" data-type="classic" <?php echo isset( $c_blocks['backend-preview']) ? 'checked': '';  ?> >
					<span></span>
				</label>
				<?php if ( !$pro_active ) {?>
                    <span class="pro__item">PRO</span>
				<?php } ?>
			</div>
		</div>
	</div>
</div>