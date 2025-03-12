/**
 * WordPress dependencies
 */
import { isGooglePhotosUrl } from '../functions';
import { EPIcon } from './../../common/icons';
import { getParams } from '../functions';
import { addProAlert, isPro, removeAlert, addTipsTrick, removeTipsAlert, tipsTricksAlert } from '../../common/helper';


const { isShallowEqualObjects } = wp.isShallowEqual;

const { useState, useEffect } = wp.element;
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;
const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
    ColorPalette,
} = wp.components;


export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getGooglePhotosParams, 10);
}

export const getGooglePhotosParams = (params, attributes) => {

    if (!attributes.url || !isGooglePhotosUrl(attributes.url)) {
        return params;
    }
    // Default attributes for Google Photos
    const defaults = {
        mode: 'carousel',
        imageWidth: 800,
        imageHeight: 600,
        playerAutoplay: false,
        delay: 5,
        repeat: true,
        mediaitemsAspectRatio: true,
        mediaitemsEnlarge: false,
        mediaitemsStretch: false,
        mediaitemsCover: false,
        backgroundColor: '',
        expiration: 0,
    };

    return getParams(params, attributes, defaults);
};

export const useGooglePhotos = (attributes) => {
    // Default attributes to monitor for calling embed()
    const defaults = {
        mode: null,
        imageWidth: null,
        imageHeight: null,
        playerAutoplay: null,
        delay: null,
        repeat: null,
        mediaitemsAspectRatio: null,
        mediaitemsEnlarge: null,
        mediaitemsStretch: null,
        mediaitemsCover: null,
        backgroundColor: null,
        expiration: null,
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

export default function GooglePhotos({ attributes, setAttributes }) {
    const {
        url,
        mode,
        imageWidth,
        imageHeight,
        playerAutoplay,
        delay,
        repeat,
        mediaitemsAspectRatio,
        mediaitemsEnlarge,
        mediaitemsStretch,
        mediaitemsCover,
        backgroundColor,
        expiration,
    } = attributes;

    const colors = [
        { name: 'Red', color: '#FF0000' },
        { name: 'Green', color: '#00FF00' },
        { name: 'Blue', color: '#0000FF' },
        { name: 'Yellow', color: '#FFFF00' },
        { name: 'Orange', color: '#FFA500' },
        { name: 'Purple', color: '#800080' }
    ];

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    let proLabel = ' (Pro)';
    if (isProPluginActive) {
        proLabel = '';
    }


    return (
        <div>
            {isGooglePhotosUrl(url) && (
                <div className={'ep__google-photos-options'}>
                    <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('GooglePhotos Controls', 'embedpress')}</div>} initialOpen={true}>
                        <SelectControl
                            label={__('Album Mode', 'embedpress')}
                            value={mode}
                            options={[
                                { label: __('Carousel', 'embedpress'), value: 'carousel' },
                                { label: __('Gallery Player' + proLabel, 'embedpress'), value: 'gallery-player' },
                                { label: __('Grid' + proLabel, 'embedpress'), value: 'gallery-grid' },
                                { label: __('Masonry ' + proLabel, 'embedpress'), value: 'gallery-masonary' },
                                { label: __('Justify ' + proLabel, 'embedpress'), value: 'gallery-justify' },
                            ]}
                            onChange={(mode) => {
                                if ((mode === 'gallery-player' || mode === 'gallery-grid' || mode === 'gallery-masonary') && !isProPluginActive) {
                                    addProAlert(null, isProPluginActive);
                                } else {
                                    setAttributes({ mode })
                                }
                            }}
                        />
                        {
                            mode == 'gallery-player' && (
                                <frameElement>
                                    <ToggleControl
                                        label={__('Autoplay', 'embedpress')}
                                        checked={playerAutoplay}
                                        onChange={(playerAutoplay) => setAttributes({ playerAutoplay })}
                                    />

                                    <RangeControl
                                        label={__('Delay', 'embedpress')}
                                        value={delay}
                                        onChange={(delay) => setAttributes({ delay })}
                                        min={1}
                                        max={60}
                                    />

                                    <ToggleControl
                                        label={__('Repeat', 'embedpress')}
                                        checked={repeat}
                                        onChange={(repeat) => setAttributes({ repeat })}
                                    />
                                </frameElement>
                            )
                        }



                        {/* <ToggleControl
                            label={__('Keep Aspect Ratio', 'embedpress')}
                            checked={mediaitemsAspectRatio}
                            onChange={(mediaitemsAspectRatio) => setAttributes({ mediaitemsAspectRatio })}
                        />

                        <ToggleControl
                            label={__('Enlarge', 'embedpress')}
                            checked={mediaitemsEnlarge}
                            onChange={(mediaitemsEnlarge) => setAttributes({ mediaitemsEnlarge })}
                        />

                        <ToggleControl
                            label={__('Stretch', 'embedpress')}
                            checked={mediaitemsStretch}
                            onChange={(mediaitemsStretch) => setAttributes({ mediaitemsStretch })}
                        />

                        <ToggleControl
                            label={__('Cover', 'embedpress')}
                            checked={mediaitemsCover}
                            onChange={(mediaitemsCover) => setAttributes({ mediaitemsCover })}
                        /> */}

                        {
                            mode == 'gallery-player' || mode == 'carousel' && (
                                <ColorPalette
                                    label={__('Background Color', 'embedpress')}
                                    colors={colors}
                                    value={backgroundColor}
                                    onChange={(backgroundColor) => setAttributes({ backgroundColor })}
                                />
                            )
                        }

                        <RangeControl
                            label={__('Sync after (minutes)', 'embedpress')}
                            value={expiration}
                            onChange={(expiration) => setAttributes({ expiration })}
                            min={0}
                            max={1440}
                        />
                    </PanelBody>
                </div>
            )}
        </div>
    );
}