/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, RadioControl, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import { EPIcon, InfoIcon } from '../../../GlobalCoponents/icons';
import Upgrade from '../../../GlobalCoponents/upgrade';

const Inspector = ({ attributes, setAttributes }) => {
    const { width, height, unitoption } = attributes;

    return (
        <InspectorControls>
            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Embed Size', 'embedpress')}</div>} className="embedpress-google-sheets-control">
                
                <div className={'ep-google-sheets-width-control'}>
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

            {/* Upgrade Component */}
            <Upgrade />
        </InspectorControls>
    );
};

export default Inspector;
