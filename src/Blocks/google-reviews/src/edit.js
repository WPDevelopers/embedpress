/**
 * EmbedPress Google Reviews — block editor UI
 *
 * Picker calls /embedpress/v1/google-reviews/search to autocomplete businesses
 * (API key stays on the server). Preview is the canonical server-side render
 * via wp.serverSideRender, keyed off block attributes, so editor and frontend
 * always match byte-for-byte.
 */
const { __ } = wp.i18n;
const { useState, useEffect, useRef } = wp.element;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const {
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    RangeControl,
    Notice,
    Placeholder,
    Button,
} = wp.components;
const ServerSideRender = wp.serverSideRender;
const apiFetch = wp.apiFetch;

const SEARCH_PATH = '/embedpress/v1/google-reviews/search';
const PLACES_PATH = '/embedpress/v1/google-reviews/places';

const PlacePicker = ({ selected, onSelect, onClear }) => {
    const [q, setQ] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [searching, setSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(null);
    const [lists, setLists] = useState({ recent: [], saved: [] });
    const [manualOpen, setManualOpen] = useState(false);
    const [manualVal, setManualVal] = useState('');
    const debounceRef = useRef(null);

    useEffect(() => {
        apiFetch({ path: PLACES_PATH }).then(setLists).catch(() => {});
    }, []);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        setError(null);
        if (q.trim().length < 2) {
            setPredictions([]);
            setNoResults(false);
            return;
        }
        setSearching(true);
        debounceRef.current = setTimeout(() => {
            apiFetch({ path: `${SEARCH_PATH}?q=${encodeURIComponent(q.trim())}` })
                .then((res) => {
                    setSearching(false);
                    const list = (res && res.predictions) || [];
                    setPredictions(list);
                    setNoResults(list.length === 0);
                })
                .catch((err) => {
                    setSearching(false);
                    setPredictions([]);
                    setNoResults(false);
                    setError((err && (err.message || err.code)) || __('Search failed.', 'embedpress'));
                });
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [q]);

    const postPlaces = (action, place_id, place_name) => {
        return apiFetch({
            path: PLACES_PATH,
            method: 'POST',
            data: { action, place_id, place_name: place_name || '' },
        }).then(setLists).catch(() => {});
    };

    const commitPick = (place_id, place_name) => {
        onSelect({ place_id, main_text: place_name, description: place_name });
        postPlaces('recent', place_id, place_name);
    };

    const applyManual = () => {
        const raw = manualVal.trim();
        const m = raw.match(/^(?:places\/)?([A-Za-z0-9_-]+)$/);
        if (!m) {
            setError(__('That doesn’t look like a valid Place ID.', 'embedpress'));
            return;
        }
        commitPick(m[1], '');
        setManualVal('');
        setManualOpen(false);
    };

    if (selected && selected.place_id) {
        return (
            <div className="ep-gr-block-selected">
                <div className="ep-gr-block-selected-info">
                    <strong>{selected.place_name || selected.main_text || selected.place_id}</strong>
                    <code>{selected.place_id}</code>
                </div>
                <Button isLink onClick={onClear}>
                    {__('Change place', 'embedpress')}
                </Button>
            </div>
        );
    }

    const savedIds = new Set((lists.saved || []).map((p) => p.place_id));
    const recentFiltered = (lists.recent || []).filter((p) => !savedIds.has(p.place_id));

    const renderListRow = (p, kind) => {
        const starred = savedIds.has(p.place_id);
        return (
            <li key={`${kind}-${p.place_id}`}>
                <button
                    type="button"
                    className="ep-gr-block-list-pick"
                    onClick={() => commitPick(p.place_id, p.place_name || '')}
                >
                    <strong>{p.place_name || p.place_id}</strong>
                    {p.place_name && <code>{p.place_id}</code>}
                </button>
                <button
                    type="button"
                    className={`ep-gr-block-list-star${starred ? ' is-on' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        postPlaces(starred ? 'unsave' : 'save', p.place_id, p.place_name || '');
                    }}
                    title={starred ? __('Remove from saved', 'embedpress') : __('Save for later', 'embedpress')}
                    aria-label={starred ? __('Remove from saved', 'embedpress') : __('Save for later', 'embedpress')}
                >★</button>
            </li>
        );
    };

    return (
        <div className="ep-gr-block-picker">
            <TextControl
                label={__('Search for a place', 'embedpress')}
                value={q}
                onChange={setQ}
                placeholder={__('e.g. Sydney Opera House', 'embedpress')}
                __nextHasNoMarginBottom
            />
            {searching && <p className="ep-gr-block-status">{__('Searching…', 'embedpress')}</p>}
            {!searching && predictions.length > 0 && (
                <ul className="ep-gr-block-suggestions">
                    {predictions.map((p) => (
                        <li key={p.place_id}>
                            <button type="button" onClick={() => commitPick(p.place_id, p.main_text || p.description || '')}>
                                <strong>{p.main_text || p.description}</strong>
                                {p.secondary_text && <span>{p.secondary_text}</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {!searching && noResults && !error && q.trim().length >= 2 && (
                <Notice status="info" isDismissible={false}>
                    {__('No matches. Try a different spelling or include the city.', 'embedpress')}
                </Notice>
            )}
            {error && (
                <Notice status="error" isDismissible={false}>
                    <strong>{__('Search failed:', 'embedpress')}</strong> {error}
                    {/missing|api[_ ]?key|not configured/i.test(error) && (
                        <>
                            {' '}
                            <a
                                href="admin.php?page=embedpress-google-reviews"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {__('Open settings to add your API key →', 'embedpress')}
                            </a>
                        </>
                    )}
                </Notice>
            )}

            {q.trim().length < 2 && (lists.saved?.length > 0 || recentFiltered.length > 0) && (
                <div className="ep-gr-block-lists">
                    {lists.saved?.length > 0 && (
                        <div className="ep-gr-block-list">
                            <div className="ep-gr-block-list-heading">{__('Saved', 'embedpress')}</div>
                            <ul>{lists.saved.map((p) => renderListRow(p, 'saved'))}</ul>
                        </div>
                    )}
                    {recentFiltered.length > 0 && (
                        <div className="ep-gr-block-list">
                            <div className="ep-gr-block-list-heading">{__('Recent', 'embedpress')}</div>
                            <ul>{recentFiltered.map((p) => renderListRow(p, 'recent'))}</ul>
                        </div>
                    )}
                </div>
            )}

            <div className="ep-gr-block-manual">
                <Button
                    isLink
                    onClick={() => setManualOpen(!manualOpen)}
                    aria-expanded={manualOpen}
                >
                    {__('Have a Place ID? Enter manually', 'embedpress')}
                </Button>
                {manualOpen && (
                    <div className="ep-gr-block-manual-row">
                        <TextControl
                            value={manualVal}
                            onChange={setManualVal}
                            placeholder="ChIJ…"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyManual(); } }}
                            __nextHasNoMarginBottom
                        />
                        <Button variant="primary" onClick={applyManual}>{__('Use', 'embedpress')}</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Edit = (props) => {
    const { attributes, setAttributes } = props;
    const {
        placeId,
        placeName,
        limit,
        minRating,
        layout,
        showPhoto,
        showStars,
        showDate,
        showLink,
    } = attributes;

    const blockProps = useBlockProps({ className: 'ep-gr-block-wrap' });

    const selected = placeId ? { place_id: placeId, place_name: placeName, main_text: placeName } : null;

    const handleSelect = (p) => {
        setAttributes({
            placeId: p.place_id,
            placeName: p.main_text || p.description || '',
        });
    };

    const handleClear = () => {
        setAttributes({ placeId: '', placeName: '' });
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Place', 'embedpress')} initialOpen={true}>
                    <PlacePicker selected={selected} onSelect={handleSelect} onClear={handleClear} />
                </PanelBody>
                <PanelBody title={__('Display', 'embedpress')} initialOpen={true}>
                    <SelectControl
                        label={__('Layout', 'embedpress')}
                        value={layout}
                        options={[
                            { label: __('List', 'embedpress'), value: 'list' },
                            { label: __('Grid', 'embedpress'), value: 'grid' },
                            { label: __('Carousel', 'embedpress'), value: 'carousel' },
                        ]}
                        onChange={(v) => setAttributes({ layout: v })}
                        __nextHasNoMarginBottom
                    />
                    <RangeControl
                        label={__('Reviews to show', 'embedpress')}
                        value={limit}
                        min={1}
                        max={5}
                        onChange={(v) => setAttributes({ limit: v })}
                        __nextHasNoMarginBottom
                    />
                    <SelectControl
                        label={__('Minimum rating', 'embedpress')}
                        value={String(minRating)}
                        options={[
                            { label: __('Any', 'embedpress'), value: '0' },
                            { label: '3+', value: '3' },
                            { label: '4+', value: '4' },
                            { label: '5', value: '5' },
                        ]}
                        onChange={(v) => setAttributes({ minRating: parseInt(v, 10) })}
                        __nextHasNoMarginBottom
                    />
                </PanelBody>
                <PanelBody title={__('Per-review elements', 'embedpress')} initialOpen={false}>
                    <ToggleControl
                        label={__('Reviewer photo', 'embedpress')}
                        checked={showPhoto}
                        onChange={(v) => setAttributes({ showPhoto: v })}
                        __nextHasNoMarginBottom
                    />
                    <ToggleControl
                        label={__('Star rating', 'embedpress')}
                        checked={showStars}
                        onChange={(v) => setAttributes({ showStars: v })}
                        __nextHasNoMarginBottom
                    />
                    <ToggleControl
                        label={__('Date', 'embedpress')}
                        checked={showDate}
                        onChange={(v) => setAttributes({ showDate: v })}
                        __nextHasNoMarginBottom
                    />
                    <ToggleControl
                        label={__('"View on Google" link', 'embedpress')}
                        checked={showLink}
                        onChange={(v) => setAttributes({ showLink: v })}
                        __nextHasNoMarginBottom
                    />
                </PanelBody>
            </InspectorControls>

            {!placeId ? (
                <Placeholder
                    icon="star-filled"
                    label={__('Google Reviews', 'embedpress')}
                    instructions={__(
                        'Search for a Google Business to embed its reviews. Open the block sidebar to pick a place.',
                        'embedpress'
                    )}
                >
                    <PlacePicker selected={null} onSelect={handleSelect} onClear={handleClear} />
                </Placeholder>
            ) : (
                <ServerSideRender
                    block="embedpress/google-reviews"
                    attributes={attributes}
                    EmptyResponsePlaceholder={() => (
                        <Notice status="warning" isDismissible={false}>
                            {__('No preview yet. Verify your API key and place selection.', 'embedpress')}
                        </Notice>
                    )}
                />
            )}
        </div>
    );
};

export default Edit;
