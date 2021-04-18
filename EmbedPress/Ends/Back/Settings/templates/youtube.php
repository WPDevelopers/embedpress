<?php
/*
 * YouTube Settings page */
?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3>Youtube Settings</h3>
    <div class="embedpress__settings__form">
        <form action="#">
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
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Progress bar color</p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select>
                            <option value="">Red</option>
                            <option value="">Green</option>
                            <option value="">Blue</option>
                            <option value="">White</option>
                            <option value="">Orange</option>
                        </select>
                    </div>
                    <p>Specifies the color that will be used in the player's video progress bar to highlight the amount of the video that the viewer has already seen. <br> Note: Setting the color to white will disable the Modest Branding option (causing a YouTube logo to be displayed in the control bar).</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Force Closed Captions</p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="close">
                            <span>No</span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="close">
                            <span>Yes</span>
                        </label>
                    </div>
                    <p>Setting this option to Yes causes closed captions to be shown by default, even if the user has turned captions off. This will be based on user preference otherwise.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Display Controls <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select disabled>
                            <option value="">Display immediately</option>
                            <option value="">Display immediately</option>
                            <option value="">Display immediately</option>
                            <option value="">Display immediately</option>
                            <option value="">Display immediately</option>
                            <option value="">Display immediately</option>
                        </select>
                    </div>
                    <p>Indicates whether the video player controls are displayed.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Enable Fullscreen button</p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="fullscreen">
                            <span>No</span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="fullscreen">
                            <span>Yes</span>
                        </label>
                    </div>
                    <p>Indicates whether the fullscreen button is enabled.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Display video annotations <span class="isPro">Pro</span></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select disabled>
                            <option value="">Display</option>
                            <option value="">Display</option>
                            <option value="">Display</option>
                            <option value="">Display</option>
                            <option value="">Display</option>
                            <option value="">Display</option>
                        </select>
                    </div>
                    <p>Indicates whether video annotations are displayed.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Display related videos</p>
                <div class="form__control__wrap">
                    <div class="input__flex">
                        <label class="input__radio">
                            <input type="radio" name="displayrelated">
                            <span>No</span>
                        </label>
                        <label class="input__radio">
                            <input type="radio" name="displayrelated">
                            <span>Yes</span>
                        </label>
                    </div>
                    <p>Indicates whether the player should show related videos when playback of the initial video ends.</p>
                </div>
            </div>
            <div class="form__group">
                <p class="form__label">Modest Branding</p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select>
                            <option value="">Display</option>
                            <option value="">Display</option>
                            <option value="">Display</option>
                            <option value="">Display</option>
                            <option value="">Display</option>
                            <option value="">Display</option>
                        </select>
                    </div>
                    <p>Indicates whether the player should display a YouTube logo in the control bar.</p>
                </div>
            </div>
            <button class="button button__themeColor radius-10">Save Changes</button>
        </form>
    </div>
</div>
