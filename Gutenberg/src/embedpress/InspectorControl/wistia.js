
/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
import { addProAlert, isPro, removeAlert } from '../../common/helper';

const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
    Button,
} = wp.components;

import {
    MediaUpload,
} from "@wordpress/block-editor";

export default function Wistia({ attributes, setAttributes, isWistiaVideo }) {

    const {
        starttime,
        endtime,
        autoplay,
        controls,
        fullscreen,
        videoannotations,
        progressbarcolor,
        closedcaptions,
        modestbranding,
        relatedvideos,
        customlogo,
        logoX,
        logoY,
        customlogoUrl,
        logoOpacity
    } = attributes;


    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const onSelectImage = (logo) => {
        console.log(logo.sizes.full.url);
        setAttributes({ customlogo: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ customlogo: '' });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    return (
        <div>
            {
                isWistiaVideo && (
                    <div className={'ep__single-yt-video-options'}>
                        <PanelBody title={__("Wistia Video Controls", 'embedpress')} initialOpen={false}>
                            <div className={'ep-yt-video-controlers'}>
                                <TextControl
                                    label={__("Start Time")}
                                    value={starttime}
                                    onChange={(starttime) => setAttributes({ starttime })}
                                    type={'text'}
                                    className={'ep-control-field'}

                                />
                                <p>Specify a start time (in seconds)</p>

                                <ToggleControl
                                    label={__("Auto Play")}
                                    checked={autoplay}
                                    onChange={(autoplay) => setAttributes({ autoplay })}
                                />

                                <SelectControl
                                    label={__("Controls", "embedpress")}
                                    value={controls}
                                    options={[
                                        { label: 'Hide controls', value: '0' },
                                        { label: 'Display immediately', value: '1' },
                                        { label: 'Display after user initiation immediately', value: '2' },
                                    ]}
                                    onChange={(controls) => setAttributes({ controls })}
                                    className={'ep-select-control-field'}
                                    __nextHasNoMarginBottom
                                />

                                <ToggleControl
                                    label={__("Fullscreen Button")}
                                    checked={fullscreen}
                                    onChange={(fullscreen) => setAttributes({ fullscreen })}
                                />

                                <ToggleControl
                                    label={__("Video Annotations")}
                                    checked={videoannotations}
                                    onChange={(videoannotations) => setAttributes({ videoannotations })}
                                />

                                <SelectControl
                                    label={__("Progress Bar Color", "embedpress")}
                                    value={progressbarcolor}
                                    options={[
                                        { label: 'Red', value: 'red' },
                                        { label: 'White', value: 'white' },
                                    ]}
                                    onChange={(progressbarcolor) => setAttributes({ progressbarcolor })}
                                    className={'ep-select-control-field'}
                                    __nextHasNoMarginBottom
                                />

                                <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                    <ToggleControl
                                        label={__("Closed Captions")}
                                        checked={closedcaptions}
                                        onChange={(closedcaptions) => setAttributes({ closedcaptions })}
                                    />

                                    {
                                        (!isProPluginActive) && (
                                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                                        )
                                    }
                                </div>

                                <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                    <SelectControl
                                        label={__("Modest Branding", "embedpress")}
                                        value={modestbranding}
                                        options={[
                                            { label: 'Display', value: '0' },
                                            { label: 'Do Not Display', value: '1' },
                                        ]}
                                        onChange={(modestbranding) => setAttributes({ modestbranding })}
                                        className={'ep-select-control-field'}
                                        __nextHasNoMarginBottom
                                    />
                                    {
                                        (!isProPluginActive) && (
                                            <span className='isPro'>{__('pro', 'embedpress')}</span>
                                        )
                                    }
                                </div>

                                <ToggleControl
                                    label={__("Related Videos")}
                                    checked={relatedvideos}
                                    onChange={(relatedvideos) => setAttributes({ relatedvideos })}
                                />

                            </div>
                        </PanelBody>
                        <PanelBody title={__("Custom Branding", 'embedpress')} initialOpen={false}>
                            {
                                customlogo && (
                                    <div className={'ep__custom-logo'} style={{ position: 'relative' }}>
                                        <button title="Remove Image" className="ep-remove__image" type="button" onClick={removeImage} >
                                            <span class="dashicon dashicons dashicons-trash"></span>
                                        </button>
                                        <img
                                            src={customlogo}
                                            alt="John"
                                        />
                                    </div>
                                )
                            }

                            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                <MediaUpload
                                    onSelect={onSelectImage}
                                    allowedTypes={['image']}
                                    value={customlogo}
                                    render={({ open }) => (
                                        <Button className={'ep-logo-upload-button'} icon={!customlogo ? 'upload' : 'update'} onClick={open}>
                                            {
                                                !customlogo ? 'Upload Image' : 'Change Image'
                                            }
                                        </Button>
                                    )}

                                />
                                {
                                    (!isProPluginActive) && (
                                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                                    )
                                }
                            </div>

                            {
                                customlogo && (
                                    <div className={'ep-custom-logo-position'}>
                                        <RangeControl
                                            label={__('Logo X position (%)', 'embedpress')}
                                            value={logoX}
                                            onChange={(logoX) =>
                                                setAttributes({ logoX })
                                            }
                                            max={100}
                                            min={0}
                                        />
                                        <RangeControl
                                            label={__('Logo Y position (%)', 'embedpress')}
                                            value={logoY}
                                            onChange={(logoY) =>
                                                setAttributes({ logoY })
                                            }
                                            max={100}
                                            min={0}
                                        />
                                        <RangeControl
                                            label={__('Logo Opacity', 'embedpress')}
                                            value={logoOpacity}
                                            onChange={(logoOpacity) =>
                                                setAttributes({ logoOpacity })
                                            }
                                            max={1}
                                            min={0}
                                            step={.05}
                                        />

                                        <TextControl
                                            label="Custom Logo Url"
                                            value={customlogoUrl}
                                            onChange={(customlogoUrl) =>
                                                setAttributes({ customlogoUrl })
                                            }
                                            placeholder={'https://exmple.com'}
                                        />

                                    </div>
                                )

                            }
                        </PanelBody>
                    </div>
                )
            }
        </div>
    )
}
