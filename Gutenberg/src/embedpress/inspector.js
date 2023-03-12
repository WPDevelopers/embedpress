import { useState } from 'react';
import { addProAlert, isPro, removeAlert, passwordShowHide, copyPassword } from '../common/helper';
import Youtube from './InspectorControl/youtube';
import OpenSea from './InspectorControl/opensea';
import Wistia from './InspectorControl/wistia';
import Vimeo from './InspectorControl/vimeo';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    TextControl,
    PanelBody,
    SelectControl,
    ToggleControl
} = wp.components;

const {
    InspectorControls
} = wp.blockEditor;


export default function Inspector({ attributes, setAttributes, isYTChannel, isYTVideo, isOpensea, isOpenseaSingle, isWistiaVideo, isVimeoVideo }) {

    const {
        width,
        height,
        videosize,
        lockContent,
        lockPassword,
        editingURL,
        embedHTML,
    } = attributes;

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const roundToNearestFive = (value) => {
        return Math.round(value / 5) * 5;
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }



    return (
        !editingURL && embedHTML && (
            <InspectorControls>
                {
                    !isOpensea && !isOpenseaSingle && (
                        <frameElement>
                            <PanelBody title={__("Embeded Options")}>

                                <div>
                                    {
                                        (isYTVideo || isVimeoVideo) && (
                                            <SelectControl
                                                label={__("Video Size")}
                                                labelPosition='side'
                                                value={videosize}
                                                options={[
                                                    { label: 'Fixed', value: 'fixed' },
                                                    { label: 'Responsive', value: 'responsive' },
                                                ]}
                                                onChange={(videosize) => setAttributes({ videosize })}
                                                __nextHasNoMarginBottom
                                            />
                                        )
                                    }

                                    {
                                        ((!isYTVideo && !isVimeoVideo) || (videosize == 'fixed')) && (
                                            <p>{__("You can adjust the width and height of embedded content.")}</p>
                                        )
                                    }

                                    {
                                        ((isYTVideo || isVimeoVideo) && (videosize == 'responsive')) && (
                                            <p>{__("You can adjust the width of embedded content.")}</p>
                                        )
                                    }

                                    <TextControl
                                        label={__("Width")}
                                        value={width}
                                        onChange={(width) => {
                                            (isVimeoVideo || isYTVideo) ? (
                                                setAttributes({
                                                    width: `${Math.round(width)}`,
                                                    height: `${roundToNearestFive(Math.round((width * 9) / 16))}`
                                                })
                                            ) : (
                                                setAttributes({ width })
                                            )
                                        }}
                                    />

                                    {
                                        ((!isYTVideo && !isVimeoVideo) || (videosize == 'fixed')) && (
                                            <TextControl
                                                label={__("Height")}
                                                value={height}
                                                onChange={(height) => {
                                                    {
                                                        (isVimeoVideo || isYTVideo) ? (
                                                            setAttributes({
                                                                height: `${Math.round(height)}`,
                                                                width: `${roundToNearestFive(Math.round((height * 16) / 9))}`
                                                            })
                                                        ) : (
                                                            setAttributes({ height })
                                                        )
                                                    }
                                                }}
                                            />
                                        )
                                    }

                                    <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                        <ToggleControl
                                            label={__("Lock Content")}
                                            checked={lockContent}
                                            onChange={(lockContent) => setAttributes({ lockContent })}
                                        />

                                        {
                                            (!isProPluginActive) && (
                                                <span className='isPro'>{__('pro', 'embedpress')}</span>
                                            )
                                        }
                                    </div>

                                    {
                                        lockContent && (
                                            <div className='lock-content-pass-input'>
                                                <TextControl
                                                    label={__("Password")}
                                                    value={lockPassword}
                                                    onChange={(lockPassword) => setAttributes({ lockPassword })}
                                                    type={'password'}
                                                />

                                                <span className={'copy-password active'} onClick={copyPassword}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><polyline points="216 184 216 40 72 40" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" /><rect x="40" y="72" width="144" height="144" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" /></svg>
                                                </span>

                                                <span className={'pass-show active'} onClick={passwordShowHide}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"> <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" /> <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" /> </svg>
                                                </span>

                                                <span className={'pass-hide'} onClick={passwordShowHide}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"> <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" /> <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" /> <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" /> </svg>
                                                </span>
                                            </div>
                                        )
                                    }

                                </div>
                                <Youtube attributes={attributes} setAttributes={setAttributes} isYTChannel={isYTChannel} />
                            </PanelBody>

                            <Youtube attributes={attributes} setAttributes={setAttributes} isYTVideo={isYTVideo} />
                            <Wistia attributes={attributes} setAttributes={setAttributes} isWistiaVideo={isWistiaVideo} />
                            <Vimeo attributes={attributes} setAttributes={setAttributes} isVimeoVideo={isVimeoVideo} />
                        </frameElement>
                    )
                }

                <OpenSea attributes={attributes} setAttributes={setAttributes} isOpensea={isOpensea} isOpenseaSingle={isOpenseaSingle} />

            </InspectorControls >
        )
    )
}