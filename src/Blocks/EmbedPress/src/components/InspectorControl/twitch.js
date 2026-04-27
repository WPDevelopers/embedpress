/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
const { addFilter, applyFilters } = wp.hooks;
const { isShallowEqualObjects } = wp.isShallowEqual;

const {
    TextControl,
    SelectControl,
    ToggleControl,
    PanelBody,
} = wp.components;

import { EPIcon } from '../../../../GlobalCoponents/icons';
import { getParams } from '../../../../../utils/functions';
import { isTwitchUrl } from '../helper';

export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getTwitchParams, 10);
};

export const getTwitchParams = (params, attributes) => {
    if (!attributes.url || !isTwitchUrl(attributes.url)) {
        return params;
    }

    const defaults = {
        twitchAutoplay: false,
        twitchMute: true,
        twitchTheme: 'dark',
        twitchFullscreen: true,
        twitchChat: false,
        twitchStartTime: 0,
    };

    return getParams(params, attributes, defaults);
};

export const useTwitch = (attributes) => {
    const defaults = {
        twitchAutoplay: null,
        twitchMute: null,
        twitchTheme: null,
        twitchFullscreen: null,
        twitchChat: null,
        twitchStartTime: null,
    };

    const param = getParams({}, attributes, defaults);
    const [atts, setAtts] = useState(param);

    useEffect(() => {
        const param = getParams(atts, attributes, defaults);
        if (!isShallowEqualObjects(atts || {}, param)) {
            setAtts(param);
        }
    }, [attributes]);

    return atts;
};

export default function Twitch({ attributes, setAttributes, isTwitch }) {
    const {
        twitchAutoplay,
        twitchMute,
        twitchTheme,
        twitchFullscreen,
        twitchChat,
        twitchStartTime,
    } = attributes;

    const chatPlaceholder = applyFilters(
        'embedpress.togglePlaceholder',
        [],
        __('Show Chat', 'embedpress'),
        twitchChat,
        true
    );

    return (
        <div>
            {isTwitch && (
                <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Twitch Controls', 'embedpress')}</div>} initialOpen={false}>
                    <TextControl
                        label={__("Start Time (in seconds)", "embedpress")}
                        value={twitchStartTime}
                        onChange={(val) => setAttributes({ twitchStartTime: parseInt(val) || 0 })}
                        type={'number'}
                        className={'ep-control-field'}
                    />

                    <ToggleControl
                        label={__("Auto Play", "embedpress")}
                        checked={twitchAutoplay}
                        onChange={(twitchAutoplay) => setAttributes({ twitchAutoplay })}
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
            )}
        </div>
    );
}
