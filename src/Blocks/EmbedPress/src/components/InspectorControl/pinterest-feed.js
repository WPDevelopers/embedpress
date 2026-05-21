/**
 * Pinterest Feed inspector panel.
 *
 * Surfaces the free controls (layout, columns, gap, posts-per-page,
 * open-in, show title, show description) and renders Pro-only controls
 * with a "(Pro)" suffix + Pro-popup on click when EmbedPress Pro is not
 * active. Pro replaces these via `embedpress.pinterestControls` filter.
 *
 * Visibility is URL-gated: this panel only appears when `isPinterestFeed`
 * returns true for the current block URL.
 */

import {
    addProAlert,
    removeAlert,
    isPinterestFeed,
    wrapFiltered,
} from '../../../../GlobalCoponents/helper';

const { useEffect } = wp.element;
const { applyFilters, addFilter } = wp.hooks;
const { __ } = wp.i18n;
const {
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
} = wp.components;

/**
 * Forward Pinterest Feed attributes to the embed REST call. Hooked from
 * index.js via pinterestFeedInit().
 */
export const getPinterestFeedParams = (params, attributes) => {
    if (!attributes || !attributes.url || !isPinterestFeed(attributes.url)) {
        return params;
    }
    const defaults = {
        pinLayout: 'masonry',
        pinColumns: '3',
        pinColumnsGap: '16',
        pinPostsPerPage: '12',
        pinShowTitle: true,
        pinShowDescription: false,
        pinOpenIn: 'new-tab',
        pinShowSavesCount: false,
        pinShowBoardName: false,
        pinHeaderEnable: true,
        pinFiltersEnable: true,
        pinLightbox: true,
        pinLoadmore: false,
        pinInfiniteScroll: false,
        pinFeedType: 'profile',
        pinPinType: 'all',
        pinCacheTTL: '3600',
    };
    const merged = { ...defaults, ...params };
    Object.keys(defaults).forEach((k) => {
        if (attributes[k] !== undefined) merged[k] = attributes[k];
    });
    return merged;
};

export const init = () => {
    addFilter(
        'embedpress_block_rest_param',
        'embedpress/pinterest-feed',
        getPinterestFeedParams,
        10
    );
};

const PinterestFeedInspector = (props) => {
    const attributes = props.attributes || {};
    const setAttributes = props.setAttributes || (() => {});

    const isProPluginActive =
        (typeof window !== 'undefined' &&
            window.embedpressGutenbergData &&
            window.embedpressGutenbergData.isProPluginActive) ||
        false;

    const url = attributes.url || '';
    const pinLayout = attributes.pinLayout || 'masonry';
    const pinColumns = parseInt(attributes.pinColumns, 10) || 3;
    const pinColumnsGap = parseInt(attributes.pinColumnsGap, 10) || 16;
    const pinPostsPerPage = parseInt(attributes.pinPostsPerPage, 10) || 12;
    const pinShowTitle = !!attributes.pinShowTitle;
    const pinShowDescription = !!attributes.pinShowDescription;
    const pinOpenIn = attributes.pinOpenIn || 'new-tab';
    const pinShowBoardName = !!attributes.pinShowBoardName;
    const pinShowSavesCount = !!attributes.pinShowSavesCount;
    const pinHeaderEnable = attributes.pinHeaderEnable !== false;
    const pinFiltersEnable = attributes.pinFiltersEnable !== false;
    const pinLightbox = attributes.pinLightbox !== false;
    const pinLoadmore = !!attributes.pinLoadmore;
    const pinInfiniteScroll = !!attributes.pinInfiniteScroll;

    useEffect(() => {
        removeAlert();
    }, []);

    if (!isPinterestFeed(url)) {
        return null;
    }

    const proSuffix = isProPluginActive ? '' : ' (Pro)';
    const handleProToggle = (key) => (v) => {
        if (!isProPluginActive) {
            addProAlert(null, false);
            return;
        }
        setAttributes({ [key]: v });
    };

    return (
        <PanelBody
            title={__('Pinterest Feed', 'embedpress')}
            initialOpen={true}
            className="ep-pinterest-feed-inspector"
        >
            <SelectControl
                label={__('Layout', 'embedpress')}
                value={pinLayout}
                options={[
                    { label: __('Masonry', 'embedpress'), value: 'masonry' },
                    { label: __('Grid', 'embedpress'), value: 'grid' },
                    { label: __('Carousel', 'embedpress'), value: 'carousel' },
                    { label: __('Justified', 'embedpress'), value: 'justified' },
                ]}
                onChange={(v) => setAttributes({ pinLayout: v })}
            />

            <RangeControl
                label={__('Columns', 'embedpress')}
                value={pinColumns}
                min={1}
                max={6}
                onChange={(v) => setAttributes({ pinColumns: String(v) })}
            />

            <RangeControl
                label={__('Column gap (px)', 'embedpress')}
                value={pinColumnsGap}
                min={0}
                max={60}
                onChange={(v) => setAttributes({ pinColumnsGap: String(v) })}
            />

            <RangeControl
                label={__('Pins per page', 'embedpress')}
                value={pinPostsPerPage}
                min={1}
                max={50}
                onChange={(v) => setAttributes({ pinPostsPerPage: String(v) })}
            />

            <SelectControl
                label={__('Open pin in', 'embedpress')}
                value={pinOpenIn}
                options={[
                    { label: __('New tab', 'embedpress'), value: 'new-tab' },
                    { label: __('Same tab', 'embedpress'), value: 'same-tab' },
                ]}
                onChange={(v) => setAttributes({ pinOpenIn: v })}
            />

            <ToggleControl
                label={__('Show pin title', 'embedpress')}
                checked={pinShowTitle}
                onChange={(v) => setAttributes({ pinShowTitle: v })}
            />

            <ToggleControl
                label={__('Show pin description', 'embedpress')}
                checked={pinShowDescription}
                onChange={(v) => setAttributes({ pinShowDescription: v })}
            />

            <ToggleControl
                label={__('Show board name', 'embedpress') + proSuffix}
                checked={pinShowBoardName}
                onChange={handleProToggle('pinShowBoardName')}
            />

            <ToggleControl
                label={__('Show saves count', 'embedpress') + proSuffix}
                checked={pinShowSavesCount}
                onChange={handleProToggle('pinShowSavesCount')}
            />

            <ToggleControl
                label={__('Profile header', 'embedpress')}
                checked={pinHeaderEnable}
                onChange={(v) => setAttributes({ pinHeaderEnable: v })}
            />

            <ToggleControl
                label={__('Boards filter strip', 'embedpress')}
                checked={pinFiltersEnable}
                onChange={(v) => setAttributes({ pinFiltersEnable: v })}
            />

            <ToggleControl
                label={__('Lightbox on click', 'embedpress')}
                checked={pinLightbox}
                onChange={(v) => setAttributes({ pinLightbox: v })}
            />

            <ToggleControl
                label={__('Load more button', 'embedpress') + proSuffix}
                checked={pinLoadmore}
                onChange={handleProToggle('pinLoadmore')}
            />

            <ToggleControl
                label={__('Infinite scroll', 'embedpress') + proSuffix}
                checked={pinInfiniteScroll}
                onChange={handleProToggle('pinInfiniteScroll')}
            />

            {wrapFiltered(applyFilters(
                'embedpress.pinterestControls',
                [],
                attributes,
                setAttributes
            ))}
        </PanelBody>
    );
};

export default PinterestFeedInspector;
