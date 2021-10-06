<?php
/*
 * YouTube Settings page */
//rest option name: embedpress_elements_updated
$elements = (array) get_option( EMBEDPRESS_PLG_NAME.":elements", []);
$g_blocks = isset( $elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
$e_blocks = isset( $elements['elementor']) ? (array) $elements['elementor'] : [];
$settings = get_option( EMBEDPRESS_PLG_NAME, []);
$enablePluginInAdmin = isset( $settings['enablePluginInAdmin'] ) ? $settings['enablePluginInAdmin'] : 1;
$enablePluginInFront = isset( $settings['enablePluginInFront'] ) ? $settings['enablePluginInFront'] : 1;
?>

<div class="background__white p40 radius-25 mb30">
    <div class="embedpress--elements__wrap">
        <h3>Gutenberg</h3>
        <div class="embedpress__row grid__3">
            <div class="element__item">
                <h5>EmbedPress</h5>
                <a href="https://embedpress.com/documentation/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "It supports 100+ providers. Click to read the docs", "embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="embedpress" data-type="gutenberg" <?php echo isset( $g_blocks['embedpress']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Document</h5>
                <a href="https://embedpress.com/docs/embed-document/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="document" data-type="gutenberg" <?php echo isset( $g_blocks['document']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>EmbedPress PDF</h5>
                <a href="https://embedpress.com/docs/embed-document/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="embedpress-pdf" data-type="gutenberg" <?php echo isset( $g_blocks['embedpress-pdf']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>YouTube</h5>
                <a href="https://embedpress.com/docs/embed-youtube-videos-in-gutenberg/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="youtube-block" data-type="gutenberg" <?php echo isset( $g_blocks['youtube-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Google Docs</h5>
                <a href="https://embedpress.com/docs/embed-google-docs-wordpress/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-docs-block" data-type="gutenberg" <?php echo isset( $g_blocks['google-docs-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Google Slides</h5>
                <a href="https://embedpress.com/docs/embed-google-slides-wordpress/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-slides-block" data-type="gutenberg" <?php echo isset( $g_blocks['google-slides-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Google Sheets</h5>
                <a href="https://embedpress.com/docs/embed-google-sheets-wordpress/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-sheets-block" data-type="gutenberg" <?php echo isset( $g_blocks['google-sheets-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Google Forms</h5>
                <a href="https://embedpress.com/docs/embed-google-forms-wordpress/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-forms-block" data-type="gutenberg" <?php echo isset( $g_blocks['google-forms-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Google Drawings</h5>
                <a href="https://embedpress.com/docs/embed-google-drawings-wordpress/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-drawings-block" data-type="gutenberg" <?php echo isset( $g_blocks['google-drawings-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Google Maps</h5>
                <a href="https://embedpress.com/docs/embed-google-maps-wordpress/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="google-maps-block" data-type="gutenberg" <?php echo isset( $g_blocks['google-maps-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Twitch</h5>
                <a href="https://embedpress.com/docs/embed-twitch-live-chat/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="twitch-block" data-type="gutenberg" <?php echo isset( $g_blocks['twitch-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Wistia</h5>
                <a href="https://embedpress.com/docs/embed-wistia-videos-wordpress/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="wistia-block" data-type="gutenberg" <?php echo isset( $g_blocks['wistia-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
            <div class="element__item">
                <h5>Vimeo</h5>
                <a href="https://embedpress.com/docs/embed-vimeo-videos-wordpress/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="vimeo-block" data-type="gutenberg" <?php echo isset( $g_blocks['vimeo-block']) ? 'checked': '';  ?> >
                    <span></span>
                </label>
            </div>
        </div>
    </div>
</div>
<!--ELEMENTOR WIDGETS STARTS -->
<div class="background__white p40 radius-25 mb30">
	<div class="embedpress--elements__wrap">
		<h3>Elementor</h3>
		<div class="embedpress__row grid__3">
			<div class="element__item">
				<h5>EmbedPress</h5>
				<a href="https://embedpress.com/docs/embedpress-with-elementor/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
				<label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="embedpress" data-type="elementor" <?php echo isset( $e_blocks['embedpress']) ? 'checked': '';  ?> >
					<span></span>
				</label>

			</div>
			<div class="element__item">
				<h5>EmbedPress Document</h5>
				<a href="https://embedpress.com/docs/embed-document/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
				<label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="embedpress-document" data-type="elementor" <?php echo isset( $e_blocks['embedpress-document']) ? 'checked': '';  ?> >
					<span></span>
				</label>

			</div>

            <div class="element__item">
                <h5>EmbedPress PDF</h5>
                <a href="https://embedpress.com/docs/embed-document/" class="has__question" target="_blank">
                    <i class="ep-icon ep-question"></i>
                    <span class="element__tooltip"><?php esc_html_e( "Documentation","embedpress" ); ?></span>
                </a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="embedpress-pdf" data-type="elementor" <?php echo isset( $e_blocks['embedpress-pdf']) ? 'checked': '';  ?> >
                    <span></span>
                </label>

            </div>
		</div>
	</div>
</div>
<!--CLASSIC EDITOR SETTINGS STARTS-->
<div class="background__white radius-25 p40">
	<div class="embedpress--elements__wrap">
		<h3>Classic Editor</h3>
		<div class="embedpress__row grid__3">
			<div class="element__item">
				<h5><?php esc_html_e( "Preview In Frontend", "embedpress" ); ?></h5>
				<label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="1" data-name="enablePluginInFront" data-type="classic" <?php echo $enablePluginInFront ? 'checked': '';  ?> >
					<span></span>
				</label>

			</div>
			<div class="element__item">
				<h5><?php esc_html_e( "Preview In Editor", "embedpress" ); ?></h5>
				<label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="1" data-name="enablePluginInAdmin" data-type="classic" <?php echo $enablePluginInAdmin ? 'checked': '';  ?> >
					<span></span>
				</label>

			</div>
		</div>
	</div>
</div>

