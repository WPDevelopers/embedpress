/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, RadioControl, ToggleControl, Tooltip } = wp.components;
const { applyFilters } = wp.hooks;

/**
 * Internal dependencies
 */
import { EPIcon, InfoIcon } from '../../../GlobalCoponents/icons';
import ContentShare from '../../../GlobalCoponents/social-share-control';
import AdControl from '../../../GlobalCoponents/ads-control';
import LockControl from '../../../GlobalCoponents/lock-control';
import Upgrade from '../../../GlobalCoponents/upgrade';

const Inspector = ({ attributes, setAttributes }) => {
    const { width, height, unitoption, powered_by, enableLazyLoad } = attributes;


    const lazyLoadPlaceholder = applyFilters(
        'embedpress.togglePlaceholder',
        [],
        __('Enable Lazy Loading', 'embedpress'),
        enableLazyLoad,
        true
    );


    return (
        <InspectorControls>
            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Embed Size', 'embedpress')}</div>} className="embedpress-google-maps-control">

                <div className={'ep-google-maps-width-control'}>
                    <RadioControl
                        selected={unitoption}
                        options={[
                            { label: '%', value: '%' },
                            { label: 'PX', value: 'px' },
                        ]}
                        onChange={(newUnit) => {
                            const updates = { unitoption: newUnit };
                            if (newUnit === '%' && parseFloat(width) > 100) {
                                updates.width = '100';
                            }
                            setAttributes(updates);
                        }}
                        className={'ep-unit-choice-option'}
                    />

                    <div className="ep-width-control-with-tooltip">
                        <TextControl
                            label={
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {__("Width")}
                                    <Tooltip
                                        text={__("Works as max container width", "embedpress")}
                                        position="top"
                                    >
                                        <span style={{ display: 'inline-flex', cursor: 'help' }}>
                                            {InfoIcon}
                                        </span>
                                    </Tooltip>
                                </span>
                            }
                            value={width}
                            type={'number'}
                            onChange={(value) => {
                                let newWidth = value;
                                if (unitoption === '%' && parseFloat(value) > 100) {
                                    newWidth = '100';
                                }
                                setAttributes({ width: newWidth });
                            }}
                        />
                    </div>
                </div>

                <TextControl
                    label={__('Height', 'embedpress')}
                    value={height}
                    type={'number'}
                    onChange={(height) => setAttributes({ height })}
                />
            </PanelBody>



            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('General', 'embedpress')}</div>} className="embedpress-google-maps-general">
                <ToggleControl
                    label={__('Powered By', 'embedpress')}
                    checked={powered_by}
                    onChange={(powered_by) => setAttributes({ powered_by })}
                />
            </PanelBody>

            {/* Content Share Controls */}
            <ContentShare attributes={attributes} setAttributes={setAttributes} />

            {/* Ad Manager Controls */}
            <AdControl attributes={attributes} setAttributes={setAttributes} />

            {/* Content Protection Controls */}
            <LockControl attributes={attributes} setAttributes={setAttributes} />

            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Lazy Loading', 'embedpress')}</div>}>
                {applyFilters(
                    'embedpress.toggleLazyLoad',
                    [lazyLoadPlaceholder],
                    attributes,
                    setAttributes
                )}
            </PanelBody>

            {/* Upgrade Component */}
            <Upgrade />
        </InspectorControls>
    );
};

export default Inspector;
