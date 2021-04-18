<?php
/*
 * Wistia Settings page */
?>

<div class="embedpress__settings background__white radius-25 p40">
	<h3>Wistia Settings</h3>
	<div class="embedpress__settings__form">
		<form action="#">
			<div class="form__group">
				<p class="form__label">Fullscreen Button</p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="fullbutton">
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="fullbutton">
							<span>Yes</span>
						</label>
					</div>
					<p>Indicates whether the fullscreen button is visible.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Playbar</p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="playbar">
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="playbar">
							<span>Yes</span>
						</label>
					</div>
					<p>Indicates whether the playbar is visible.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Small Play Button</p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="smallplay">
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="smallplay">
							<span>Yes</span>
						</label>
					</div>
					<p>Indicates whether the small play button is visible on the bottom left.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Volume Control <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="volcontrol" disabled>
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="volcontrol" disabled>
							<span>Yes</span>
						</label>
					</div>
					<p>Indicates whether the volume control is visible.</p>
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
				<p class="form__label">Volume</p>
				<div class="form__control__wrap">
					<input type="number" class="form__control" value="100">
					<p>Start the video with a custom volume level. Set values between 0 and 100.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Color</p>
				<div class="form__control__wrap">
					<a href="#" class="button radius-10">Select Color</a>
					<p>Specify the color of the video controls.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Plugin: Resumable</p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="reumbeable">
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="reumbeable">
							<span>Yes</span>
						</label>
					</div>
					<p>Indicates whether the Resumable plugin is active. Allow to resume the video or start from the begining.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Plugin: Captions <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="captions" disabled>
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="captions" disabled>
							<span>Yes</span>
						</label>
					</div>
					<p>Indicates whether the Captions plugin is active.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Captions Enabled By Default <span class="isPro">Pro</span></p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="caption" disabled>
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="caption" disabled>
							<span>Yes</span>
						</label>
					</div>
					<p>Indicates whether the Captions are enabled by default.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Plugin: Focus</p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="focus">
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="focus">
							<span>Yes</span>
						</label>
					</div>
					<p>Indicates whether the Focus plugin is active.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Plugin: Rewind</p>
				<div class="form__control__wrap">
					<div class="input__flex">
						<label class="input__radio">
							<input type="radio" name="rewind">
							<span>No</span>
						</label>
						<label class="input__radio">
							<input type="radio" name="rewind">
							<span>Yes</span>
						</label>
					</div>
					<p>Indicates whether the Rewind plugin is active.</p>
				</div>
			</div>
			<div class="form__group">
				<p class="form__label">Rewind time (seconds)</p>
				<div class="form__control__wrap">
					<input type="text" class="form__control" value="10">
					<p>The amount of time to rewind, in seconds.</p>
				</div>
			</div>
			<button class="button button__themeColor radius-10">Save Changes</button>
		</form>
	</div>
</div>
