/**
 * Backbone view for the EmbedPress Google Reviews place picker Elementor
 * control (type: ep_gr_place_picker).
 *
 * Stored value shape: { place_id: '', place_name: '' }
 *
 * Why a custom control vs. the inject-HTML approach we shipped earlier:
 *   - Elementor manages render / undo / clone properly when the value lives
 *     in the model behind a real control type.
 *   - Theme switching (light/dark) works automatically because all styles
 *     hang off Elementor's CSS variables.
 *   - No need to maintain mirror text inputs as graceful-degradation fallback.
 */
(function ($) {
    'use strict';

    if (typeof window.epGoogleReviewsElementor !== 'object') return;
    var REST  = window.epGoogleReviewsElementor.restUrl;
    var NONCE = window.epGoogleReviewsElementor.nonce;
    var I18N  = window.epGoogleReviewsElementor.i18n || {};
    function t(k, fb) { return I18N[k] || fb; }

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    $(window).on('elementor:init', function () {
        if (!window.elementor || !elementor.modules || !elementor.modules.controls) return;

        var ControlBaseDataView = elementor.modules.controls.BaseData;

        var PlacePickerView = ControlBaseDataView.extend({

            ui: function () {
                var base = ControlBaseDataView.prototype.ui.apply(this, arguments);
                _.extend(base, {
                    input:        '.ep-gr-picker__input',
                    spinner:      '.ep-gr-picker__spinner',
                    results:      '.ep-gr-picker__results',
                    status:       '.ep-gr-picker__status',
                    selected:     '.ep-gr-picker__selected',
                    selectedNm:   '.ep-gr-picker__selected-name',
                    selectedId:   '.ep-gr-picker__selected-id',
                    search:       '.ep-gr-picker__search',
                    clearBtn:     '.ep-gr-picker__clear',
                    lists:        '.ep-gr-picker__lists',
                    listSaved:    '.ep-gr-picker__list[data-kind=saved] .ep-gr-picker__list-items',
                    listRecent:   '.ep-gr-picker__list[data-kind=recent] .ep-gr-picker__list-items',
                    listSavedBox: '.ep-gr-picker__list[data-kind=saved]',
                    listRecentBox:'.ep-gr-picker__list[data-kind=recent]',
                    manualToggle: '.ep-gr-picker__manual-toggle',
                    manualRow:    '.ep-gr-picker__manual-row',
                    manualInput:  '.ep-gr-picker__manual-input',
                    manualApply:  '.ep-gr-picker__manual-apply',
                });
                return base;
            },

            events: function () {
                return _.extend({}, ControlBaseDataView.prototype.events.apply(this, arguments), {
                    'input @ui.input':          'onInput',
                    'keydown @ui.input':        'onInputKey',
                    'click @ui.clearBtn':       'onClear',
                    'click @ui.results > li':   'onPick',
                    'keydown @ui.results > li': 'onResultKey',
                    'click @ui.manualToggle':   'onToggleManual',
                    'click @ui.manualApply':    'onApplyManual',
                    'keydown @ui.manualInput':  'onManualKey',
                    'click .ep-gr-picker__list-pick': 'onListPick',
                    'click .ep-gr-picker__list-star': 'onListStar',
                });
            },

            onReady: function () {
                this.renderSelected();
                this.loadLists();
            },

            getValueOrDefault: function () {
                var v = this.readValue();
                if (!v || typeof v !== 'object') v = { place_id: '', place_name: '' };
                return v;
            },

            // Read/write the control value through whichever Elementor API is
            // available. Elementor 4.x dropped the BaseData.setControlValue()
            // helper on object-typed custom controls; calling it throws
            // `this.setControlValue is not a function` and the click silently
            // fails. Fall back to the settings model directly.
            readValue: function () {
                var name = this.model.get('name');
                if (this.container && this.container.settings) {
                    return this.container.settings.get(name);
                }
                if (this.elementSettingsModel) {
                    return this.elementSettingsModel.get(name);
                }
                if (typeof this.getControlValue === 'function') {
                    return this.getControlValue();
                }
                return null;
            },

            writeValue: function (value) {
                var name = this.model.get('name');
                // Preferred: route through Elementor's command pipeline so the
                // live preview iframe re-renders and undo history is recorded.
                // `container.settings.set()` alone updates the Backbone model
                // but skips the render path, so the canvas appears stale until
                // the next reload.
                if (this.container && window.$e && $e.run) {
                    try {
                        $e.run('document/elements/settings', {
                            container: this.container,
                            settings: _.object([name], [value]),
                        });
                        return;
                    } catch (err) { /* fall through to direct model write */ }
                }
                if (this.container && this.container.settings) {
                    this.container.settings.set(name, value);
                    return;
                }
                if (this.elementSettingsModel) {
                    this.elementSettingsModel.set(name, value);
                    return;
                }
                if (typeof this.setControlValue === 'function') {
                    this.setControlValue(value);
                }
            },

            renderSelected: function () {
                var v = this.getValueOrDefault();
                if (v.place_id) {
                    this.ui.selected.attr('data-state', 'picked');
                    this.ui.selectedNm.text(v.place_name || v.place_id);
                    this.ui.selectedId.text(v.place_id);
                    this.ui.search.hide();
                    this.ui.results.hide().empty();
                    this.ui.lists.hide();
                    this.setStatus('');
                } else {
                    this.ui.selected.attr('data-state', 'empty');
                    this.ui.search.show();
                    this.renderLists();
                }
            },

            // --- Recent / saved lists ----------------------------------

            loadLists: function () {
                var self = this;
                $.ajax({
                    url: REST + '/places',
                    method: 'GET',
                    beforeSend: function (xhr) { xhr.setRequestHeader('X-WP-Nonce', NONCE); },
                }).done(function (res) {
                    self._lists = res || { recent: [], saved: [] };
                    if (!self.getValueOrDefault().place_id) self.renderLists();
                });
            },

            renderLists: function () {
                if (!this._lists) { this.ui.lists.hide(); return; }
                var savedIds = (this._lists.saved || []).reduce(function (acc, p) { acc[p.place_id] = true; return acc; }, {});
                var renderRow = function (p, kind) {
                    var starred = !!savedIds[p.place_id];
                    var starLabel = starred ? t('unsave', 'Remove from saved') : t('save', 'Save for later');
                    return '<li>' +
                        '<button type="button" class="ep-gr-picker__list-pick"' +
                            ' data-id="' + escapeHtml(p.place_id) + '"' +
                            ' data-name="' + escapeHtml(p.place_name || '') + '">' +
                            '<strong>' + escapeHtml(p.place_name || p.place_id) + '</strong>' +
                            (p.place_name ? '<code>' + escapeHtml(p.place_id) + '</code>' : '') +
                        '</button>' +
                        '<button type="button" class="ep-gr-picker__list-star' + (starred ? ' is-on' : '') + '"' +
                            ' data-id="' + escapeHtml(p.place_id) + '"' +
                            ' data-name="' + escapeHtml(p.place_name || '') + '"' +
                            ' data-kind="' + kind + '"' +
                            ' title="' + escapeHtml(starLabel) + '"' +
                            ' aria-label="' + escapeHtml(starLabel) + '">★</button>' +
                    '</li>';
                };
                var saved  = (this._lists.saved  || []).map(function (p) { return renderRow(p, 'saved'); }).join('');
                var recent = (this._lists.recent || []).filter(function (p) { return !savedIds[p.place_id]; })
                                .map(function (p) { return renderRow(p, 'recent'); }).join('');
                this.ui.listSaved.html(saved);
                this.ui.listRecent.html(recent);
                this.ui.listSavedBox.prop('hidden', !saved);
                this.ui.listRecentBox.prop('hidden', !recent);
                this.ui.lists.prop('hidden', !saved && !recent);
            },

            postPlaces: function (action, place_id, place_name) {
                var self = this;
                $.ajax({
                    url: REST + '/places',
                    method: 'POST',
                    data: { action: action, place_id: place_id, place_name: place_name || '' },
                    beforeSend: function (xhr) { xhr.setRequestHeader('X-WP-Nonce', NONCE); },
                }).done(function (res) {
                    self._lists = res || { recent: [], saved: [] };
                    if (!self.getValueOrDefault().place_id) self.renderLists();
                });
            },

            commitPick: function (place_id, place_name) {
                this.writeValue({ place_id: place_id, place_name: place_name });
                this.postPlaces('recent', place_id, place_name);
                this.renderSelected();
                this.ui.input.val('');
            },

            onListPick: function (e) {
                e.preventDefault();
                var $b = $(e.currentTarget);
                this.commitPick($b.attr('data-id') || '', $b.attr('data-name') || '');
            },

            onListStar: function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $b = $(e.currentTarget);
                var on = $b.hasClass('is-on');
                this.postPlaces(on ? 'unsave' : 'save', $b.attr('data-id') || '', $b.attr('data-name') || '');
            },

            // --- Manual Place ID entry --------------------------------

            onToggleManual: function (e) {
                e.preventDefault();
                var hidden = this.ui.manualRow.prop('hidden');
                this.ui.manualRow.prop('hidden', !hidden);
                this.ui.manualToggle.attr('aria-expanded', String(hidden));
                if (hidden) this.ui.manualInput.focus();
            },

            onApplyManual: function (e) {
                e.preventDefault();
                this.applyManual();
            },

            onManualKey: function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyManual();
                }
            },

            applyManual: function () {
                var raw = (this.ui.manualInput.val() || '').trim();
                // Accept either a bare place_id or a Places API (New) resource name like "places/ChIJ..."
                var m = raw.match(/^(?:places\/)?([A-Za-z0-9_\-]+)$/);
                if (!m) {
                    this.setStatus(t('badId', 'That doesn’t look like a valid Place ID.'), 'error');
                    return;
                }
                this.commitPick(m[1], '');
                this.ui.manualInput.val('');
            },

            setStatus: function (text, tone) {
                this.ui.status.text(text || '').attr('data-tone', tone || '');
            },

            setBusy: function (busy) {
                this.ui.spinner.prop('hidden', !busy);
            },

            onInput: function (e) {
                var self = this;
                var q = (e.target.value || '').trim();
                clearTimeout(this._debounce);
                if (q.length < 2) {
                    this.ui.results.hide().empty();
                    this.setStatus('');
                    this.setBusy(false);
                    return;
                }
                this.setBusy(true);
                this.setStatus('');
                this._debounce = setTimeout(function () { self.runSearch(q); }, 300);
            },

            onInputKey: function (e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    var first = this.ui.results.find('li').first();
                    if (first.length) first.focus();
                }
            },

            onResultKey: function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.onPick(e);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    var n = $(e.currentTarget).next('li');
                    if (n.length) n.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    var p = $(e.currentTarget).prev('li');
                    if (p.length) p.focus(); else this.ui.input.focus();
                }
            },

            runSearch: function (q) {
                var self = this;
                $.ajax({
                    url: REST + '/search?q=' + encodeURIComponent(q),
                    method: 'GET',
                    beforeSend: function (xhr) { xhr.setRequestHeader('X-WP-Nonce', NONCE); },
                }).done(function (res) {
                    self.setBusy(false);
                    var list = (res && res.predictions) || [];
                    if (!list.length) {
                        self.ui.results.hide().empty();
                        self.setStatus(t('noResults', 'No matches. Try a different spelling or include the city.'), 'muted');
                        return;
                    }
                    var html = list.map(function (p) {
                        return '<li role="option" tabindex="0"' +
                                    ' data-id="' + escapeHtml(p.place_id) + '"' +
                                    ' data-name="' + escapeHtml(p.main_text || p.description || '') + '">' +
                                    '<strong>' + escapeHtml(p.main_text || p.description) + '</strong>' +
                                    (p.secondary_text ? '<span>' + escapeHtml(p.secondary_text) + '</span>' : '') +
                                '</li>';
                    }).join('');
                    self.ui.results.html(html).show();
                    self.setStatus('');
                }).fail(function (xhr) {
                    self.setBusy(false);
                    self.ui.results.hide().empty();
                    var body = xhr.responseJSON || {};
                    var msg = body.message || t('failed', 'Search failed.');
                    if (/missing|api[_ ]?key|not configured/i.test(msg)) {
                        msg += ' ' + t('addKey', 'Add your Google Places API key in EmbedPress → Google Reviews.');
                    }
                    self.setStatus(msg, 'error');
                });
            },

            onPick: function (e) {
                var $li = $(e.currentTarget);
                this.commitPick($li.attr('data-id') || '', $li.attr('data-name') || '');
            },

            onClear: function () {
                this.writeValue({ place_id: '', place_name: '' });
                this.renderSelected();
                var self = this;
                setTimeout(function () { self.ui.input.focus(); }, 0);
            },
        });

        elementor.addControlView(
            'ep_gr_place_picker',
            PlacePickerView
        );
    });
})(jQuery);
