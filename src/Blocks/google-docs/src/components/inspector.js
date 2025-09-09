/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl, RadioControl, ToggleControl } = wp.components;

/**
 * Internal dependencies
 */
import { EPIcon } from '../../../GlobalCoponents/icons';
import ControlHeader from '../../../GlobalCoponents/control-heading';
import ContentShare from '../../../GlobalCoponents/social-share-control';
import AdControl from '../../../GlobalCoponents/ads-control';
import LockControl from '../../../GlobalCoponents/lock-control';
import Upgrade from '../../../GlobalCoponents/upgrade';

const Inspector = ({ attributes, setAttributes }) => {
    const { width, height, unitoption, powered_by, contentShare, adManager, lockContent } = attributes;
    
    const min = 1;
    const max = 1000;
    const widthMax = unitoption === '%' ? 100 : 1000;
    const widthMin = unitoption === '%' ? 1 : 1;

    return (
        <InspectorControls>
            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Embed Size', 'embedpress')}</div>} className="embedpress-google-docs-control">
                
                <div className={'ep-google-docs-width-control'}>
                    <ControlHeader classname={'ep-control-header'} headerText={'WIDTH'} />
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

                    <RangeControl
                        value={width}
                        onChange={(width) =>
                            setAttributes({ width })
                        }
                        max={widthMax}
                        min={widthMin}
                    />
                </div>

                <RangeControl
                    label={__('Height', 'embedpress')}
                    value={height}
                    onChange={(height) => setAttributes({ height })}
                    min={min}
                    max={max}
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
