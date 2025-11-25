/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl, ToggleControl } = wp.components;

/**
 * Internal dependencies
 */
import { EPIcon } from '../../../GlobalCoponents/icons';
import ControlHeader from '../../../GlobalCoponents/control-heading';
import Upgrade from '../../../GlobalCoponents/upgrade';

const Inspector = ({ attributes, setAttributes }) => {
    const { width, height, enableLazyLoad } = attributes;

    const isProPluginActive = embedpressGutenbergData.isProPluginActive;

    const min = 1;
    const max = 1500;

    return (
        <InspectorControls>
            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Embed Size', 'embedpress')}</div>} className="embedpress-youtube-control">
                
                <div className={'ep-youtube-width-control'}>
                    <ControlHeader classname={'ep-control-header'} headerText={'WIDTH'} />

                    <RangeControl
                        value={width}
                        onChange={(width) =>
                            setAttributes({ width })
                        }
                        min={min}
                        max={max}
                    />
                </div>

                <RangeControl
                    label={__('Height', 'embedpress')}
                    value={height}
                    onChange={(height) => setAttributes({ height })}
                    min={min}
                    max={max}
                />

                {isProPluginActive ? (
                    <ToggleControl
                        label={__('Enable Lazy Loading', 'embedpress')}
                        checked={enableLazyLoad}
                        onChange={(enableLazyLoad) => setAttributes({ enableLazyLoad })}
                        help={__('Load iframe only when it enters the viewport for better performance', 'embedpress')}
                    />
                ) : (
                    <div className="pro-control" onClick={(e) => { e.preventDefault(); document.querySelector('.pro__alert__wrap').style.display = 'block'; }}>
                        <ToggleControl
                            label={
                                <div>
                                    {__('Enable Lazy Loading', 'embedpress')}
                                    <span className='isPro'>pro</span>
                                </div>
                            }
                            checked={enableLazyLoad}
                            help={__('Load iframe only when it enters the viewport for better performance', 'embedpress')}
                        />
                    </div>
                )}
            </PanelBody>

            {/* Upgrade Component */}
            <Upgrade />
        </InspectorControls>
    );
};

export default Inspector;
