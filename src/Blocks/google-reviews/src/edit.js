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

const PlacePicker = ({ selected, onSelect, onClear }) => {
    const [q, setQ] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [searching, setSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(null);
    const debounceRef = useRef(null);

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
                            <button type="button" onClick={() => onSelect(p)}>
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
