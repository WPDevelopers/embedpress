/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, RadioControl, ToggleControl, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import { EPIcon, InfoIcon } from '../../../GlobalCoponents/icons';
import ContentShare from '../../../GlobalCoponents/social-share-control';
import AdControl from '../../../GlobalCoponents/ads-control';
import LockControl from '../../../GlobalCoponents/lock-control';
import Upgrade from '../../../GlobalCoponents/upgrade';

const Inspector = ({ attributes, setAttributes }) => {
    const { width, height, unitoption, powered_by } = attributes;

    return (
        <InspectorControls>
            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Embed Size', 'embedpress')}</div>} className="embedpress-google-docs-control">

                <div className={'ep-google-docs-width-control'}>
                    <RadioControl
                        selected={unitoption}
                        options={[
                            { label: '%', value: '%' },
                            { label: 'PX', value: 'px' },
                        ]}
                        onChange={(unitoption) =>
                            setAttributes({ unitoption })
                        }
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
                            onChange={(width) =>
                                setAttributes({ width })
                            }
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

            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('General', 'embedpress')}</div>} className="embedpress-google-docs-general">
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

            {/* Upgrade Component */}
            <Upgrade />
        </InspectorControls>
    );
};

export default Inspector;
