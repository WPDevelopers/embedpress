import Youtube from './InspectorControl/youtube';
import OpenSea from './InspectorControl/OpenSea';
import  {addProAlert, isPro, removeAlert} from '../common/helper'

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

import {
    MediaUpload,
} from "@wordpress/block-editor";

const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
    Button,
} = wp.components;

const {
    InspectorControls
} = wp.blockEditor;


export default function Inspector({ attributes, setAttributes, isYTChannel, isYTVideo, isOpensea }) {

    const {
        width,
        height,
        editingURL,
        embedHTML,
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
    } = attributes;

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const onSelectImage = (logo) => {
        setAttributes({ customlogo: logo.sizes.full.url });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }


    return (
        !editingURL && embedHTML && (
            <InspectorControls>
                {
                    !isOpensea && (
                        <PanelBody title={__("Embeded Options")}>

                            <div>
                                <p>{__("You can adjust the width and height of embedded content.")}</p>
                                <TextControl
                                    label={__("Width")}
                                    value={width}
                                    onChange={(width) => setAttributes({ width })}
                                />
                                <TextControl
                                    label={__("Height")}
                                    value={height}
                                    onChange={(height) => setAttributes({ height })}
                                />
                            </div>

                            {
                                isYTChannel && (
                                    <Youtube attributes={attributes} setAttributes={setAttributes} />
                                )
                            }
                            {

                                isYTVideo && (
                                    <div className={'ep-yt-video-controlers'}>
                                        <TextControl
                                            label={__("Start Time")}
                                            value={starttime}
                                            onChange={(starttime) => setAttributes({ starttime })}
                                            type={'number'}
                                            className={'ep-control-field'}

                                        />
                                        <p>Specify a start time (in seconds)</p>

                                        <TextControl
                                            label={__("End Time")}
                                            value={endtime}
                                            onChange={(endtime) => setAttributes({ endtime })}
                                            type={'number'}
                                            className={'ep-control-field'}
                                        />
                                        <p>Specify a end time (in seconds)</p>

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

                                        <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => {addProAlert(e, isProPluginActive) }}>
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

                                        <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => {addProAlert(e, isProPluginActive) }}>
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

                                    
                                        <MediaUpload
                                            onSelect={onSelectImage}
                                            allowedTypes={['image']}
                                            value={customlogo}
                                            render={({ open }) => (
                                                <Button icon="update-alt" onClick={open}> </Button>
                                            )}
                                        /> 

                                    </div>
                                )
                            }
                        </PanelBody>

                    )
                }

                {
                    isOpensea && (
                        <OpenSea attributes={attributes} setAttributes={setAttributes} />
                    )
                }

            </InspectorControls>
        )
    )
}