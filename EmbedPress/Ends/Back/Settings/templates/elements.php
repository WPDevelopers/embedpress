<?php
/*
 * YouTube Settings page */
$option = EMBEDPRESS_PLG_NAME.":elements";
$elements = (array) get_option( $option, []);
error_log( print_r( $elements, 1));
$g_blocks = isset( $elements['gutenberg']) ? (array) $elements['gutenberg'] : [];
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
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item isPro">
                <h5>Document</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input class="element-check" type="checkbox" value="yes" data-name="embedpress" data-type="gutenberg" checked >
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item">
                <h5>Youtube</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox">
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item">
                <h5>Google Docs</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox" checked>
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item">
                <h5>Google Slides</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox">
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item">
                <h5>Google Sheets</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox" checked>
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item isPro">
                <h5>Google Forms</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox" disabled>
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item">
                <h5>Google Drawings</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox">
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item">
                <h5>Google Maps</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox">
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item">
                <h5>Twitch</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox">
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item">
                <h5>Wistia</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox">
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
            <div class="emement__item">
                <h5>Vimeo</h5>
                <a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
                <label class="input__switch element_switch">
                    <input type="checkbox">
                    <span></span>
                </label>
                <span class="pro__item">PRO</span>
            </div>
        </div>
    </div>
</div>
<div class="background__white p40 radius-25 mb30">
	<div class="embedpress--elements__wrap">
		<h3>Elementor</h3>
		<div class="embedpress__row grid__3">
			<div class="emement__item">
				<h5>WordPress</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox" checked>
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
			<div class="emement__item isPro">
				<h5>WordPress</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox" disabled>
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
			<div class="emement__item">
				<h5>WordPress</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox">
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
			<div class="emement__item">
				<h5>WordPress</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox" checked>
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
			<div class="emement__item">
				<h5>WordPress</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox">
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
			<div class="emement__item">
				<h5>WordPress</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox" checked>
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
			<div class="emement__item isPro">
				<h5>WordPress</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox" disabled>
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
			<div class="emement__item">
				<h5>WordPress</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox">
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
		</div>
	</div>
</div>
<div class="background__white radius-25 p40">
	<div class="embedpress--elements__wrap">
		<h3>Classic Editor</h3>
		<div class="embedpress__row grid__3">
			<div class="emement__item">
				<h5>Preview In Frontend</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox" checked>
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
			<div class="emement__item">
				<h5>Preview In Editor</h5>
				<a href="#" class="has__question"><i class="ep-icon ep-question"></i></a>
				<label class="input__switch element_switch">
					<input type="checkbox">
					<span></span>
				</label>
				<span class="pro__item">PRO</span>
			</div>
		</div>
	</div>
</div>