/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;
const {
    BlockControls,
    BlockIcon,
    MediaPlaceholder,
    InspectorControls,
    useBlockProps
} = wp.blockEditor;

const {
    ToolbarButton,
    PanelBody,
    ExternalLink,
    ToggleControl,
    TextControl,
    SelectControl,
    RadioControl,
    ColorPalette,
    Tooltip,
} = wp.components;


/**
 * Internal dependencies
 */
import ControlHeader from '../../GlobalCoponents/control-heading';
import LockControl from '../../GlobalCoponents/lock-control';
import ContentShare from '../../GlobalCoponents/social-share-control';
import AdControl from '../../GlobalCoponents/ads-control';
import Upgrade from '../../GlobalCoponents/upgrade';
import CustomBranding from "../../GlobalCoponents/custombranding";
import { EPIcon, InfoIcon } from "../../GlobalCoponents/icons";
import DocControls from "./components/doc-controls";
import { isPro, removeAlert } from '../../GlobalCoponents/helper';

const isProPluginActive = typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.isProPluginActive;

// Show the Pro upsell popup (mirrors the PDF block's helper) when a free user
// picks a Pro-only count position.
const showProAlert = () => {
    if (isProPluginActive) return;
    let alertWrap = document.querySelector('.pro__alert__wrap');
    if (!alertWrap) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
        alertWrap = document.querySelector('.pro__alert__wrap');
    }
    if (alertWrap) {
        alertWrap.style.display = 'block';
    }
};

const Inspector = ({ attributes, setAttributes }) => {

    const { unitoption, width, height, showViewCount = false, showDownloadCount = false, viewCountPosition = 'below' } = attributes;

    return (
        <InspectorControls>
            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Embed Size', 'embedpress')}</div>} className="embedpress-documents-control">
                <div className='ep-controls-margin'>
                    <div className={'ep-pdf-width-contol'}>
                        <RadioControl
                            selected={unitoption}
                            options={[
                                { label: '%', value: '%' },
                                { label: 'PX', value: 'px' },
                            ]}
                            onChange={(unitoption) => setAttributes({ unitoption })}
                            className={'ep-unit-choice-option'}
                        />
                        <div className="ep-width-control-with-tooltip">
                            <TextControl
                                label={
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {__("Width")}
                                        <Tooltip text={__("Works as max container width", "embedpress")} position="top">
                                            <span style={{ display: 'inline-flex', cursor: 'help' }}>
                                                {InfoIcon}
                                            </span>
                                        </Tooltip>
                                    </span>
                                }
                                type={'number'}
                                value={width}
                                onChange={(width) => setAttributes({ width })}
                            />
                        </div>
                    </div>
                    <TextControl
                        label={__('Height', 'embedpress')}
                        value={height}
                        type={'number'}
                        onChange={(height) => setAttributes({ height })}
                    />
                </div>
            </PanelBody>

            <DocControls attributes={attributes} setAttributes={setAttributes} />

            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Engagement Stats', 'embedpress')}</div>} initialOpen={false}>
                <div className='ep-controls-margin'>
                    <ToggleControl
                        label={__('Show View Count', 'embedpress')}
                        help={__('Display the visitor view counter on this embed.', 'embedpress')}
                        checked={showViewCount}
                        onChange={(showViewCount) => setAttributes({ showViewCount })}
                    />
                    <ToggleControl
                        label={__('Show Download Count', 'embedpress')}
                        help={__('Display the download counter on this embed.', 'embedpress')}
                        checked={showDownloadCount}
                        onChange={(showDownloadCount) => setAttributes({ showDownloadCount })}
                    />
                    {(showViewCount || showDownloadCount) && (() => {
                        // Only 'Below — Left' (the default) is free; the other
                        // five placements are Pro.
                        const proSuffix = isProPluginActive ? '' : ' (Pro)';
                        return (
                            <SelectControl
                                label={__('Count Position', 'embedpress')}
                                help={__('Where the count badge sits relative to the embed.', 'embedpress')}
                                value={viewCountPosition}
                                options={[
                                    { label: __('Below — Left (default)', 'embedpress'), value: 'below' },
                                    { label: __('Below — Center', 'embedpress') + proSuffix, value: 'below-center' },
                                    { label: __('Below — Right', 'embedpress') + proSuffix, value: 'below-right' },
                                    { label: __('Above — Left', 'embedpress') + proSuffix, value: 'above-left' },
                                    { label: __('Above — Center', 'embedpress') + proSuffix, value: 'above-center' },
                                    { label: __('Above — Right', 'embedpress') + proSuffix, value: 'above-right' },
                                ]}
                                onChange={(value) => {
                                    if (value !== 'below' && !isProPluginActive) {
                                        showProAlert();
                                        return;
                                    }
                                    setAttributes({ viewCountPosition: value });
                                }}
                            />
                        );
                    })()}
                </div>
            </PanelBody>

            <CustomBranding attributes={attributes} setAttributes={setAttributes} />
            <AdControl attributes={attributes} setAttributes={setAttributes} />
            <LockControl attributes={attributes} setAttributes={setAttributes} />
            <ContentShare attributes={attributes} setAttributes={setAttributes} />

            <Upgrade />

        </InspectorControls>

    );
};

export default Inspector;
