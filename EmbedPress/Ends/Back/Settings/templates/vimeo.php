<?php
/*
 * Vimeo Settings page */
?>
<div class="embedpress__settings background__white radius-25 p40">
    <h3>Vimeo Settings</h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" >
	        <?php echo  $nonce_field ; ?>
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
                <p class="form__label">Loop</p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="loop">
                            <span>No</span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="loop">
                            <span>Yes</span>
                        </label>
                    </div>
                    <p>Play the video again automatically when it reaches the end.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Autopause <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="autopause" disabled>
                            <span>No</span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="autopause" disabled>
                            <span>Yes</span>
                        </label>
                    </div>
                    <p>Pause this video automatically when another one plays.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">DNT</p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="dnt">
                            <span>No</span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="dnt">
                            <span>Yes</span>
                        </label>
                    </div>
                    <p>Setting this parameter to "yes" will block the player from tracking any session data, including all cookies</p>
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
                <p class="form__label">Display Title</p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="displaytitle">
                            <span>No</span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="displaytitle">
                            <span>Yes</span>
                        </label>
                    </div>
                    <p>Indicates whether the title is displayed.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Display Author</p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="displayauthor">
                            <span>No</span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="displayauthor">
                            <span>Yes</span>
                        </label>
                    </div>
                    <p>Indicates whether the author is displayed.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Display Avatar <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="displayavatar" disabled>
                            <span>No</span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="displayavatar" disabled>
                            <span>Yes</span>
                        </label>
                    </div>
                    <p>Indicates whether the avatar is displayed.</p>
                </div>
            </div>
            <button class="button button__themeColor radius-10">Save Changes</button>
        </form>
    </div>
</div>
