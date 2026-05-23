<?php

namespace EmbedPress\Includes\Classes;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Standalone admin page for Google Reviews: API key, cache TTL, searchable
 * place picker, and shortcode generator with live preview. All values are
 * persisted via the REST controller; no Vite build required.
 */
class GoogleReviewsAdminPage
{
    const PAGE_SLUG = 'embedpress-google-reviews';

    public static function register()
    {
        add_action('admin_menu', [__CLASS__, 'add_menu'], 30);
    }

    public static function add_menu()
    {
        add_submenu_page(
            'embedpress',
            __('EmbedPress Google Reviews', 'embedpress'),
            __('Google Reviews', 'embedpress'),
            'manage_options',
            self::PAGE_SLUG,
            [__CLASS__, 'render']
        );
    }

    public static function render()
    {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to access this page.', 'embedpress'));
        }

        // Frontend renderer stylesheet — the live-preview HTML renders inside the React app,
        // so it needs the same CSS the public-facing shortcode uses.
        wp_enqueue_style('embedpress-google-reviews', EMBEDPRESS_URL_STATIC . 'css/google-reviews.css', [], EMBEDPRESS_VERSION);

        // Pass REST config to the React app.
        $bootstrap = [
            'restUrl' => esc_url_raw(rest_url(GoogleReviewsRestController::NS . '/google-reviews')),
            'nonce'   => wp_create_nonce('wp_rest'),
        ];

        // Inline the bootstrap before the React entry executes. AssetManager enqueues
        // the script with handle `embedpress-google-reviews-admin` on this page.
        wp_add_inline_script(
            'embedpress-google-reviews-admin',
            'window.epGoogleReviewsAdmin = ' . wp_json_encode($bootstrap) . ';',
            'before'
        );
        ?>
        <div id="embedpress-google-reviews-root">
            <noscript>
                <div class="notice notice-warning"><p><?php esc_html_e('JavaScript is required to use this page.', 'embedpress'); ?></p></div>
            </noscript>
            <p class="ep-gr-loading" style="padding:40px;text-align:center;color:#6b7280;font-style:italic;">
                <?php esc_html_e('Loading…', 'embedpress'); ?>
            </p>
        </div>
        <?php
    }

    /**
     * Legacy server-rendered page kept as a graceful fallback if the React bundle
     * fails to mount (e.g. JS disabled).
     */
    public static function render_legacy_fallback()
    {
        $rest_url = esc_url_raw(rest_url(GoogleReviewsRestController::NS . '/google-reviews'));
        $nonce    = wp_create_nonce('wp_rest');
        ?>
        <div class="wrap ep-gr-admin">
            <h1><?php esc_html_e('EmbedPress — Google Reviews', 'embedpress'); ?></h1>
            <p class="description"><?php esc_html_e('Configure your Google Places API key and build a shortcode you can paste into any page or post.', 'embedpress'); ?></p>

            <div class="ep-gr-admin-grid">
                <!-- Configuration card -->
                <div class="ep-gr-card">
                    <h2><?php esc_html_e('Configuration', 'embedpress'); ?></h2>

                    <p class="ep-gr-field">
                        <label for="ep-gr-api-key"><strong><?php esc_html_e('Google Places API key', 'embedpress'); ?></strong></label>
                        <input type="text" id="ep-gr-api-key" class="regular-text" autocomplete="off" placeholder="AIza…" />
                        <span class="description"><?php
                            printf(
                                /* translators: %s: link to Google Cloud Console */
                                wp_kses(__('Get a key from <a href="%s" target="_blank" rel="noopener">Google Cloud Console</a>. Enable both <code>Places API</code> and <code>Places API (New)</code>.', 'embedpress'), ['a' => ['href' => true, 'target' => true, 'rel' => true], 'code' => []]),
                                'https://console.cloud.google.com/apis/library/places-backend.googleapis.com'
                            );
                        ?></span>
                    </p>

                    <p class="ep-gr-field">
                        <label for="ep-gr-cache-ttl"><strong><?php esc_html_e('Cache reviews for', 'embedpress'); ?></strong></label>
                        <select id="ep-gr-cache-ttl">
                            <option value="3600">1 <?php esc_html_e('hour', 'embedpress'); ?></option>
                            <option value="21600" selected>6 <?php esc_html_e('hours', 'embedpress'); ?></option>
                            <option value="86400">24 <?php esc_html_e('hours', 'embedpress'); ?></option>
                        </select>
                    </p>

                    <p>
                        <button type="button" class="button button-primary" id="ep-gr-save"><?php esc_html_e('Save changes', 'embedpress'); ?></button>
                        <button type="button" class="button" id="ep-gr-clear-cache"><?php esc_html_e('Clear reviews cache', 'embedpress'); ?></button>
                        <span class="ep-gr-status" id="ep-gr-config-status" aria-live="polite"></span>
                    </p>
                </div>

                <!-- Shortcode generator card -->
                <div class="ep-gr-card">
                    <h2><?php esc_html_e('Shortcode generator', 'embedpress'); ?></h2>
                    <p class="description"><?php esc_html_e('Search for a business, tweak the display options, then copy the generated shortcode.', 'embedpress'); ?></p>

                    <p class="ep-gr-field ep-gr-picker-field">
                        <label for="ep-gr-search"><strong><?php esc_html_e('Search for a place', 'embedpress'); ?></strong></label>
                        <input type="text" id="ep-gr-search" class="regular-text" placeholder="<?php esc_attr_e('e.g. Sydney Opera House', 'embedpress'); ?>" autocomplete="off" />
                        <ul id="ep-gr-suggestions" class="ep-gr-suggestions" role="listbox" hidden></ul>
                    </p>

                    <p class="ep-gr-selected" id="ep-gr-selected" hidden>
                        <strong><?php esc_html_e('Selected:', 'embedpress'); ?></strong>
                        <span id="ep-gr-selected-name"></span>
                        <code id="ep-gr-selected-id"></code>
                        <button type="button" class="button-link" id="ep-gr-clear-selection"><?php esc_html_e('Change', 'embedpress'); ?></button>
                    </p>

                    <div class="ep-gr-options-grid">
                        <p class="ep-gr-field">
                            <label for="ep-gr-limit"><?php esc_html_e('Limit', 'embedpress'); ?></label>
                            <select id="ep-gr-limit">
                                <option value="1">1</option><option value="2">2</option><option value="3" selected>3</option><option value="4">4</option><option value="5">5</option>
                            </select>
                        </p>
                        <p class="ep-gr-field">
                            <label for="ep-gr-min-rating"><?php esc_html_e('Minimum rating', 'embedpress'); ?></label>
                            <select id="ep-gr-min-rating">
                                <option value="0"><?php esc_html_e('Any', 'embedpress'); ?></option>
                                <option value="3">3+</option><option value="4">4+</option><option value="5">5</option>
                            </select>
                        </p>
                        <p class="ep-gr-field">
                            <label for="ep-gr-layout"><?php esc_html_e('Layout', 'embedpress'); ?></label>
                            <select id="ep-gr-layout">
                                <option value="list" selected><?php esc_html_e('List', 'embedpress'); ?></option>
                                <option value="grid"><?php esc_html_e('Grid', 'embedpress'); ?></option>
                                <option value="carousel"><?php esc_html_e('Carousel', 'embedpress'); ?></option>
                            </select>
                        </p>
                    </div>

                    <fieldset class="ep-gr-toggles">
                        <legend><?php esc_html_e('Show', 'embedpress'); ?></legend>
                        <label><input type="checkbox" id="ep-gr-show-photo" checked /> <?php esc_html_e('Photo', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-gr-show-stars" checked /> <?php esc_html_e('Stars', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-gr-show-date" checked /> <?php esc_html_e('Date', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-gr-show-link" checked /> <?php esc_html_e('"View on Google" link', 'embedpress'); ?></label>
                    </fieldset>

                    <p class="ep-gr-field">
                        <label for="ep-gr-shortcode"><strong><?php esc_html_e('Generated shortcode', 'embedpress'); ?></strong></label>
                        <textarea id="ep-gr-shortcode" rows="2" class="large-text code" readonly></textarea>
                        <button type="button" class="button" id="ep-gr-copy"><?php esc_html_e('Copy', 'embedpress'); ?></button>
                        <span class="ep-gr-status" id="ep-gr-copy-status" aria-live="polite"></span>
                    </p>

                    <h3><?php esc_html_e('Live preview', 'embedpress'); ?></h3>
                    <div id="ep-gr-preview" class="ep-gr-preview-wrap">
                        <p class="ep-gr-preview-empty"><?php esc_html_e('Search for a place above to see a live preview here.', 'embedpress'); ?></p>
                    </div>
                </div>
            </div>
        </div>
        <?php self::render_styles(); ?>
        <script>
        (function(){
            var REST = <?php echo wp_json_encode($rest_url); ?>;
            var NONCE = <?php echo wp_json_encode($nonce); ?>;
            var $ = function(id){ return document.getElementById(id); };

            function api(method, path, params, body) {
                var url = REST + path;
                if (params) {
                    var qs = Object.keys(params).map(function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
                    if (qs) url += '?' + qs;
                }
                var init = {
                    method: method,
                    headers: { 'X-WP-Nonce': NONCE, 'Content-Type': 'application/json' },
                    credentials: 'same-origin'
                };
                if (body) init.body = JSON.stringify(body);
                return fetch(url, init).then(function(r){ return r.json().then(function(d){ return { ok: r.ok, status: r.status, body: d }; }); });
            }

            // --- Settings load + save ---
            function loadSettings(){
                api('GET', '/settings').then(function(res){
                    if (!res.ok) return;
                    if (res.body.api_key_configured) $('ep-gr-api-key').placeholder = res.body.api_key_masked || '***';
                    if (res.body.cache_ttl) $('ep-gr-cache-ttl').value = String(res.body.cache_ttl);
                });
            }
            $('ep-gr-save').addEventListener('click', function(){
                var key = $('ep-gr-api-key').value;
                var ttl = parseInt($('ep-gr-cache-ttl').value, 10);
                var payload = { cache_ttl: ttl };
                if (key && key.trim() !== '') payload.api_key = key.trim();
                api('POST', '/settings', null, payload).then(function(res){
                    var s = $('ep-gr-config-status');
                    if (res.ok) {
                        s.textContent = '<?php echo esc_js(__('Saved.', 'embedpress')); ?>';
                        s.style.color = '#15803d';
                        $('ep-gr-api-key').value = '';
                        if (res.body.api_key_masked) $('ep-gr-api-key').placeholder = res.body.api_key_masked;
                    } else {
                        s.textContent = (res.body && res.body.message) || '<?php echo esc_js(__('Save failed.', 'embedpress')); ?>';
                        s.style.color = '#b91c1c';
                    }
                    setTimeout(function(){ s.textContent = ''; }, 3000);
                });
            });
            $('ep-gr-clear-cache').addEventListener('click', function(){
                api('POST', '/clear-cache', null, {}).then(function(res){
                    var s = $('ep-gr-config-status');
                    s.textContent = res.ok ? ('<?php echo esc_js(__('Cleared', 'embedpress')); ?> (' + (res.body.deleted || 0) + ')') : '<?php echo esc_js(__('Failed.', 'embedpress')); ?>';
                    s.style.color = res.ok ? '#15803d' : '#b91c1c';
                    setTimeout(function(){ s.textContent = ''; }, 3000);
                });
            });

            // --- Searchable place picker ---
            var debounce;
            var selected = null;
            $('ep-gr-search').addEventListener('input', function(e){
                clearTimeout(debounce);
                var q = e.target.value.trim();
                if (q.length < 2) { $('ep-gr-suggestions').hidden = true; return; }
                debounce = setTimeout(function(){
                    api('GET', '/search', { q: q }).then(function(res){
                        var ul = $('ep-gr-suggestions');
                        ul.innerHTML = '';
                        if (!res.ok || !res.body.predictions || res.body.predictions.length === 0) {
                            ul.hidden = true;
                            return;
                        }
                        res.body.predictions.forEach(function(p){
                            var li = document.createElement('li');
                            li.setAttribute('role', 'option');
                            li.tabIndex = 0;
                            li.innerHTML = '<strong></strong><br><span></span>';
                            li.querySelector('strong').textContent = p.main_text || p.description;
                            li.querySelector('span').textContent = p.secondary_text || '';
                            li.addEventListener('click', function(){ pick(p); });
                            li.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') pick(p); });
                            ul.appendChild(li);
                        });
                        ul.hidden = false;
                    });
                }, 250);
            });

            function pick(p) {
                selected = p;
                $('ep-gr-search').value = '';
                $('ep-gr-suggestions').hidden = true;
                $('ep-gr-selected').hidden = false;
                $('ep-gr-selected-name').textContent = p.main_text + (p.secondary_text ? ' — ' + p.secondary_text : '');
                $('ep-gr-selected-id').textContent = p.place_id;
                regenerate();
            }
            $('ep-gr-clear-selection').addEventListener('click', function(){
                selected = null;
                $('ep-gr-selected').hidden = true;
                $('ep-gr-shortcode').value = '';
                $('ep-gr-preview').innerHTML = '<p class="ep-gr-preview-empty"><?php echo esc_js(__('Search for a place above to see a live preview here.', 'embedpress')); ?></p>';
            });

            // --- Shortcode generator + live preview ---
            var controls = ['ep-gr-limit','ep-gr-min-rating','ep-gr-layout','ep-gr-show-photo','ep-gr-show-stars','ep-gr-show-date','ep-gr-show-link'];
            controls.forEach(function(id){ $(id).addEventListener('change', regenerate); });

            function buildAttrs(){
                if (!selected) return null;
                return {
                    place_id:   selected.place_id,
                    place_name: selected.main_text || '',
                    limit:      parseInt($('ep-gr-limit').value, 10),
                    min_rating: parseInt($('ep-gr-min-rating').value, 10),
                    layout:     $('ep-gr-layout').value,
                    show_photo: $('ep-gr-show-photo').checked,
                    show_stars: $('ep-gr-show-stars').checked,
                    show_date:  $('ep-gr-show-date').checked,
                    show_link:  $('ep-gr-show-link').checked,
                };
            }

            function buildShortcode(attrs) {
                var defaults = { limit: 5, min_rating: 0, layout: 'list', show_photo: true, show_stars: true, show_date: true, show_link: true };
                var parts = ['embedpress_google_reviews', 'place_id="' + attrs.place_id + '"'];
                if (attrs.place_name) parts.push('place_name="' + attrs.place_name.replace(/"/g, '&quot;') + '"');
                ['limit','min_rating','layout','show_photo','show_stars','show_date','show_link'].forEach(function(k){
                    var v = attrs[k];
                    if (v === defaults[k]) return;
                    if (typeof v === 'boolean') v = v ? 'true' : 'false';
                    parts.push(k + '="' + v + '"');
                });
                return '[' + parts.join(' ') + ']';
            }

            var previewDebounce;
            function regenerate(){
                var attrs = buildAttrs();
                if (!attrs) return;
                $('ep-gr-shortcode').value = buildShortcode(attrs);
                clearTimeout(previewDebounce);
                previewDebounce = setTimeout(function(){
                    api('GET', '/preview', attrs).then(function(res){
                        if (res.ok && res.body.html) {
                            $('ep-gr-preview').innerHTML = res.body.html;
                        } else {
                            $('ep-gr-preview').innerHTML = '<p class="ep-gr-preview-empty">' + ((res.body && res.body.message) || '<?php echo esc_js(__('Preview unavailable.', 'embedpress')); ?>') + '</p>';
                        }
                    });
                }, 250);
            }

            $('ep-gr-copy').addEventListener('click', function(){
                var ta = $('ep-gr-shortcode');
                if (!ta.value) return;
                ta.select();
                try {
                    navigator.clipboard.writeText(ta.value);
                    $('ep-gr-copy-status').textContent = '<?php echo esc_js(__('Copied!', 'embedpress')); ?>';
                } catch (e) {
                    document.execCommand('copy');
                    $('ep-gr-copy-status').textContent = '<?php echo esc_js(__('Copied!', 'embedpress')); ?>';
                }
                setTimeout(function(){ $('ep-gr-copy-status').textContent = ''; }, 2000);
            });

            loadSettings();
        })();
        </script>
        <?php
    }

    private static function render_styles()
    {
        ?>
        <style>
            .ep-gr-admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
            @media (max-width: 1100px) { .ep-gr-admin-grid { grid-template-columns: 1fr; } }
            .ep-gr-card { background: #fff; border: 1px solid #c3c4c7; padding: 16px 20px; border-radius: 4px; }
            .ep-gr-card h2 { margin-top: 0; }
            .ep-gr-field { display: flex; flex-direction: column; gap: 4px; margin: 12px 0; position: relative; }
            .ep-gr-field label { font-size: 13px; }
            .ep-gr-options-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            .ep-gr-toggles { display: flex; gap: 16px; flex-wrap: wrap; padding: 0; border: 0; margin: 12px 0; }
            .ep-gr-toggles legend { font-weight: 600; padding: 0; margin-bottom: 6px; }
            .ep-gr-toggles label { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; }
            .ep-gr-suggestions { position: absolute; top: 100%; left: 0; right: 0; max-height: 260px; overflow-y: auto; background: #fff; border: 1px solid #c3c4c7; margin: 0; padding: 0; list-style: none; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
            .ep-gr-suggestions li { padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f1; }
            .ep-gr-suggestions li:hover, .ep-gr-suggestions li:focus { background: #f0f6fc; outline: none; }
            .ep-gr-selected { padding: 8px 12px; background: #f0f6fc; border-radius: 4px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
            .ep-gr-selected code { font-size: 11px; color: #6b7280; }
            .ep-gr-status { margin-left: 8px; font-size: 13px; font-weight: 500; }
            .ep-gr-preview-wrap { min-height: 120px; padding: 12px; border: 1px dashed #c3c4c7; border-radius: 4px; background: #f6f7f7; }
            .ep-gr-preview-empty { color: #6b7280; font-style: italic; text-align: center; margin: 24px 0; }
            #ep-gr-shortcode { font-family: monospace; }
        </style>
        <?php
    }
}
