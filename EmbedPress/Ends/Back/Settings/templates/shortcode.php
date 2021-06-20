<?php
/*
 * Shortcode Settings page
 *  All undefined vars comes from 'render_settings_page' method
 */
?>
<div class="embedpress__settings background__white radius-25 p40">
	<h3>Shortcode</h3>
	<div class="embedpress__shortcode">
		<p class="shortcode__text">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
		<div class="shortcode__form form__inline mb30">
			<div class="form__group">
				<input type="url" id="ep-link" class="form__control" placeholder="Place your link here">
			</div>
			<button class="button button__themeColor radius-10" id="ep-shortcode-btn">Generate Shortcode</button>
		</div>
		<div class="shortcode__form form__inline">
			<div class="form__group">
				<input type="text" class="form__control" id="ep-shortcode" readonly>
			</div>
			<button class="button button__themeColor copy__button radius-10" id="ep-shortcode-cp"><i class="ep-icon ep-copy"></i></button>
		</div>
	</div>
</div>	