/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl, RadioControl, ToggleControl, SelectControl, TextControl } = wp.components;
const { applyFilters } = wp.hooks;

/**
 * Internal dependencies
 */
import { EPIcon } from '../../../GlobalCoponents/icons';
import ControlHeader from '../../../GlobalCoponents/control-heading';
import Upgrade from '../../../GlobalCoponents/upgrade';

const Inspector = ({ attributes, setAttributes }) => {
    const {
        width,
        height,
        unitoption,
        enableLazyLoad,
        autoplay,
        twitchMute,
        twitchTheme,
        twitchFullscreen,
        twitchChat,
        startTime,
    } = attributes;

    const isProPluginActive = typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.isProPluginActive;

    const lazyLoadPlaceholder = applyFilters(
        'embedpress.togglePlaceholder',
        [],
        __('Enable Lazy Loading', 'embedpress'),
        enableLazyLoad,
        true
    );

    const chatPlaceholder = applyFilters(
        'embedpress.togglePlaceholder',
        [],
        __('Show Chat', 'embedpress'),
        twitchChat,
        true
    );

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

            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Twitch Controls', 'embedpress')}</div>} initialOpen={false}>
                <TextControl
                    label={__("Start Time (in seconds)", "embedpress")}
                    value={startTime}
                    onChange={(val) => setAttributes({ startTime: parseInt(val) || 0 })}
                    type={'number'}
                    className={'ep-control-field'}
                />

                <ToggleControl
                    label={__("Auto Play", "embedpress")}
                    checked={autoplay}
                    onChange={(autoplay) => setAttributes({ autoplay })}
                />

                <ToggleControl
                    label={__("Mute On Start", "embedpress")}
                    checked={twitchMute}
                    onChange={(twitchMute) => setAttributes({ twitchMute })}
                />

                <SelectControl
                    label={__("Theme", "embedpress")}
                    value={twitchTheme}
                    options={[
                        { label: __('Dark', 'embedpress'), value: 'dark' },
                        { label: __('Light', 'embedpress'), value: 'light' },
                    ]}
                    onChange={(twitchTheme) => setAttributes({ twitchTheme })}
                    className={'ep-select-control-field'}
                    __nextHasNoMarginBottom
                />

                <ToggleControl
                    label={__("Fullscreen Button", "embedpress")}
                    checked={twitchFullscreen}
                    onChange={(twitchFullscreen) => setAttributes({ twitchFullscreen })}
                />

                {applyFilters(
                    'embedpress.twitchControls',
                    [chatPlaceholder],
                    attributes,
                    setAttributes,
                    'chat'
                )}
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
