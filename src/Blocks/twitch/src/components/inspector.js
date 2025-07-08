/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl, RadioControl } = wp.components;

/**
 * Internal dependencies
 */
import { EPIcon } from '../../../GlobalCoponents/icons';
import ControlHeader from '../../../GlobalCoponents/control-heading';

const Inspector = ({ attributes, setAttributes }) => {
    const { width, height, unitoption } = attributes;
    
    const min = 1;
    const max = 1000;
    const widthMax = unitoption === '%' ? 100 : 1000;
    const widthMin = unitoption === '%' ? 1 : 1;

    return (
        <InspectorControls>
            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Embed Size', 'embedpress')}</div>} className="embedpress-twitch-control">
                
                <div className={'ep-twitch-width-control'}>
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
        </InspectorControls>
    );
};

export default Inspector;
