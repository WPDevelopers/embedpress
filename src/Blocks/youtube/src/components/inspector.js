/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl, ToggleControl } = wp.components;
const { applyFilters } = wp.hooks;

/**
 * Internal dependencies
 */
import { EPIcon } from '../../../GlobalCoponents/icons';
import ControlHeader from '../../../GlobalCoponents/control-heading';
import Upgrade from '../../../GlobalCoponents/upgrade';

const Inspector = ({ attributes, setAttributes }) => {
    const { width, height, enableLazyLoad } = attributes;

    const lazyLoadPlaceholder = applyFilters(
        'embedpress.togglePlaceholder',
        [],
        __('Enable Lazy Loading', 'embedpress'),
        enableLazyLoad,
        true
    );



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
            </PanelBody>

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
