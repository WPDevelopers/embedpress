<?php

namespace EmbedPress\Elementor\Controls;

use Elementor\Base_Data_Control;

(defined('ABSPATH')) or die("No direct script access allowed.");

/**
 * Custom Elementor control: searchable Google Places picker.
 *
 * Stores a single object value: { place_id: string, place_name: string }.
 * The Backbone view that drives the search/dropdown UI lives in
 * static/js/ep-gr-elementor-control.js.
 *
 * The template uses Elementor's CSS design tokens (var(--e-a-...)) so the
 * control follows the editor's light/dark theme automatically — no
 * hard-coded background or border colors.
 */
class Place_Picker extends Base_Data_Control
{
    const CONTROL_TYPE = 'ep_gr_place_picker';

    public function get_type()
    {
        return self::CONTROL_TYPE;
    }

    protected function get_default_settings()
    {
        return [
            'label_block' => true,
            'placeholder' => __('e.g. Sydney Opera House', 'embedpress'),
            'description' => __('Type a business name and pick a result. Reviews load from the Google Places API key in EmbedPress → Google Reviews.', 'embedpress'),
        ];
    }

    public function get_default_value()
    {
        return [
            'place_id'   => '',
            'place_name' => '',
        ];
    }

    public function content_template()
    {
        $control_uid = $this->get_control_uid();
        ?>
        <div class="elementor-control-field ep-gr-picker">
            <label for="<?php echo esc_attr($control_uid); ?>" class="elementor-control-title">{{{ data.label }}}</label>
            <div class="elementor-control-input-wrapper">
                <div class="ep-gr-picker__selected" data-state="empty">
                    <div class="ep-gr-picker__selected-info">
                        <strong class="ep-gr-picker__selected-name"></strong>
                        <code class="ep-gr-picker__selected-id"></code>
                    </div>
                    <button type="button" class="ep-gr-picker__clear">
                        <?php esc_html_e('Change', 'embedpress'); ?>
                    </button>
                </div>
                <div class="ep-gr-picker__search">
                    <span class="ep-gr-picker__search-icon" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 L14 14"/></svg>
                    </span>
                    <input
                        id="<?php echo esc_attr($control_uid); ?>"
                        type="text"
                        class="ep-gr-picker__input"
                        placeholder="{{ data.placeholder }}"
                        autocomplete="off"
                    >
                    <span class="ep-gr-picker__spinner" hidden>
                        <span class="ep-gr-picker__spinner-dot"></span>
                    </span>
                </div>
                <ul class="ep-gr-picker__results" role="listbox" hidden></ul>
                <div class="ep-gr-picker__status" role="status" aria-live="polite"></div>
                <div class="ep-gr-picker__lists" hidden>
                    <div class="ep-gr-picker__list" data-kind="saved" hidden>
                        <div class="ep-gr-picker__list-heading"><?php esc_html_e('Saved', 'embedpress'); ?></div>
                        <ul class="ep-gr-picker__list-items"></ul>
                    </div>
                    <div class="ep-gr-picker__list" data-kind="recent" hidden>
                        <div class="ep-gr-picker__list-heading"><?php esc_html_e('Recent', 'embedpress'); ?></div>
                        <ul class="ep-gr-picker__list-items"></ul>
                    </div>
                </div>
                <div class="ep-gr-picker__manual">
                    <button type="button" class="ep-gr-picker__manual-toggle" aria-expanded="false">
                        <?php esc_html_e('Have a Place ID? Enter manually', 'embedpress'); ?>
                    </button>
                    <div class="ep-gr-picker__manual-row" hidden>
                        <input
                            type="text"
                            class="ep-gr-picker__manual-input"
                            placeholder="ChIJ…"
                            autocomplete="off"
                        >
                        <button type="button" class="ep-gr-picker__manual-apply">
                            <?php esc_html_e('Use', 'embedpress'); ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <# if ( data.description ) { #>
            <div class="elementor-control-field-description">{{{ data.description }}}</div>
        <# } #>
        <?php
    }
}
