<?php
/*
 * Twitch Settings page */
?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3>Twitch Settings</h3>
	<div class="embedpress__settings__form">
		<form action="#">
			<div class="form__group">
				<p class="form__label">Start Time (in Secounds)</p>
				<div class="form__control__wrap">
					<input type="text" class="form__control">
					<p>You can put a custom time in seconds to start video from. Example: 500</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Auto Play</p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="autoplay">
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="autoplay">
							<span>Yes</span>
						</label>
					</div>
					<p>Automatically start to play the videos when the player loads.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Show chat <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="fullbutton" disabled>
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="fullbutton" disabled>
							<span>Yes</span>
						</label>
					</div>
					<p>You can show or hide chat using this settings</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Theme</p>
				<div class="form__control__wrap">
					<div class="embedpress__select">
						<span><i class="ep-icon ep-caret-down"></i></span>
						<select>
							<option value="">Dark</option>
							<option value="">Light</option>
						</select>
					</div>
					<p>Set dark or light theme for the twich comment.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Enable Fullsccreen button <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="embedpress__select">
						<span><i class="ep-icon ep-caret-down"></i></span>
						<select disabled>
							<option value="">Yes</option>
							<option value="">No</option>
						</select>
					</div>
					<p>Indicates whether the fullscreen button is enabled.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Mute on start</p>
				<div class="form__control__wrap">
					<div class="embedpress__select">
						<span><i class="ep-icon ep-caret-down"></i></span>
						<select>
							<option value="">Yes</option>
							<option value="">No</option>
						</select>
					</div>
					<p>Set it to Yes to mute the video on start.</p>
				</div>
			</div>
			<button class="button button__themeColor radius-10">Save Changes</button>
		</form>
	</div>
</div>
