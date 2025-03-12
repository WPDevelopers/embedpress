import { useRef } from 'react';
const { applyFilters } = wp.hooks;

import { isPro, removeAlert, addTipsTrick, removeTipsAlert, tipsTricksAlert, isInstagramFeed, isInstagramHashtag } from '../common/helper';
import LockControl from '../common/lock-control';
import ContentShare from '../common/social-share-control';
import Youtube from './InspectorControl/youtube';
import OpenSea from './InspectorControl/opensea';
import Wistia from './InspectorControl/wistia';
import Vimeo from './InspectorControl/vimeo';
import SlefHosted from './InspectorControl/selfhosted';
import { EPIcon, InfoIcon } from '../common/icons';
import Instafeed from './InspectorControl/instafeed';
import Calendly from './InspectorControl/calendly';
import AdControl from '../common/ads-control';
import CustomBranding from './InspectorControl/custombranding';
import Spreaker from './InspectorControl/spreaker';
import GooglePhotos from './InspectorControl/google-photos';
import { isGooglePhotosUrl } from './functions';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    TextControl,
    NumberControl,
    PanelBody,
    SelectControl,
    ToggleControl,
    PanelRow,
} = wp.components;

const {
    InspectorControls
} = wp.blockEditor;


export default function Inspector({ attributes, setAttributes, isYTChannel, isYTVideo, isYTLive, isYTShorts, isOpensea, isOpenseaSingle, isWistiaVideo, isVimeoVideo, isSelfHostedVideo, isSelfHostedAudio, isCalendly, isTikTok, isSpreaker }) {

    const {
        url,
        width,
        height,
        videosize,
        instaLayout,
        instafeedFeedType,
        instafeedAccountType,
        slidesShow,
        slidesScroll,
        carouselAutoplay,
        autoplaySpeed,
        transitionSpeed,
        carouselLoop,
        carouselArrows,
        carouselSpacing,
        lockContent,
        contentPassword,
        editingURL,
        embedHTML,
        mode,
    } = attributes;

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const inputRef = useRef(null);

    const roundToNearestFive = (value) => {
        return Math.round(value / 5) * 5;
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    if (!document.querySelector('.tips__alert__wrap')) {
        document.querySelector('body').append(tipsTricksAlert('none'));
        removeTipsAlert();
    }

    if ((isYTVideo || isYTLive || isVimeoVideo) && width === '600' && height === '600') {
        setAttributes({ height: '340' });
    }

    if (isSelfHostedAudio) {
        setAttributes({ height: '48' });
    }

    if (isCalendly && width === '600' && height === '600') {
        setAttributes({ height: '950' });
    }

    if (isTikTok && width === '600' && height === '600') {
        setAttributes({ width: '350' });
        setAttributes({ height: '580' });
    }

    if (isInstagramHashtag(url) && width === '600') {
        setAttributes({ instafeedFeedType: 'hashtag_type' });
        setAttributes({ width: '900' });
    }


    return (
        !editingURL && embedHTML && (
            <InspectorControls>
                {
                    !isOpensea && !isOpenseaSingle && (
                        <div className='embedpress-gutenberg-controls'>
                            <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('General', 'embedpress')}</div>}>



                                <div className='ep-controls-margin'>
                                    {
                                        isInstagramFeed(url) && (
                                            <PanelRow>
                                                <div style={{ marginBottom: '10px', backgroundColor: '#ebe4ff', padding: '8px', borderRadius: '8px', fontWeight: 500 }} className='elementor-panel-alert elementor-panel-warning-info'>To enable full Instagram embedding experience, please add your access token <a href="/wp-admin/admin.php?page=embedpress&page_type=instagram" target='_blank'>here</a>.</div>
                                            </PanelRow>

                                        )
                                    }

                                    {
                                        isYTLive && (
                                            <p className='ep-live-video-info'>{InfoIcon} {'The most recent live video will be seen.'}</p>
                                        )
                                    }
                                    {
                                        (isYTVideo || isVimeoVideo || isYTLive || isSelfHostedVideo) && (
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
                                        ((!isYTVideo && !isYTLive && !isVimeoVideo && !isSelfHostedVideo) || (videosize == 'fixed')) && (
                                            <p>{__("You can adjust the width and height of embedded content.")}</p>
                                        )
                                    }



                                    {
                                        ((isYTVideo || isVimeoVideo || isYTLive || isSelfHostedVideo) && (videosize == 'responsive')) && (
                                            <p>{__("You can adjust the width of embedded content.", "embedpress")}</p>
                                        )
                                    }

                                    <TextControl
                                        label={__("Width")}
                                        value={width}
                                        onChange={(width) => {
                                            (isVimeoVideo || isYTVideo || isYTLive || isSelfHostedVideo) ? (
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
                                        (!isGooglePhotosUrl(url) && ((!isInstagramFeed(url) && !isInstagramHashtag(url) && !isYTChannel) && ((!isYTVideo && !isVimeoVideo && !isYTLive && !isSelfHostedVideo) || (videosize == 'fixed')))) ||
                                            (isGooglePhotosUrl(url) && (mode === 'carousel' || mode === 'gallery-player')) ? (
                                            <TextControl
                                                label={__("Height")}
                                                value={height}
                                                onChange={(height) => {
                                                    if (isVimeoVideo || isYTVideo || isYTLive || isSelfHostedVideo) {
                                                        setAttributes({
                                                            height: `${Math.round(height)}`,
                                                            width: `${roundToNearestFive(Math.round((height * 16) / 9))}`
                                                        });
                                                    } else {
                                                        setAttributes({ height });
                                                    }
                                                }}
                                            />
                                        ) : null
                                    }

                                    {
                                        (isYTVideo) && (
                                            <div className={'ep-tips-and-tricks'}>
                                                {EPIcon}
                                                <a href="#" target={'_blank'} onClick={(e) => { e.preventDefault(); addTipsTrick(e) }}> {__("Tips & Tricks", "embedpress")} </a>
                                            </div>
                                        )
                                    }
                                </div>

                                {
                                    !isYTLive && !isYTShorts && (
                                        <Youtube attributes={attributes} setAttributes={setAttributes} isYTChannel={isYTChannel} />
                                    )
                                }

                                {
                                    isInstagramFeed(url) && (
                                        <div>

                                            <SelectControl
                                                label="Feed Type"
                                                value={instafeedFeedType}
                                                options={[
                                                    { label: 'User Account', value: 'user_account_type' },
                                                    { label: 'Hashtag', value: 'hashtag_type' },
                                                    { label: 'Tagged(Coming Soon)', value: 'tagged_type' },
                                                    { label: 'Mixed(Coming Soon)', value: 'mixed_type' }
                                                ]}
                                                onChange={(instafeedFeedType) => setAttributes({ instafeedFeedType })}
                                            />

                                            {!isProPluginActive && instafeedFeedType === 'hashtag_type' && (
                                                <PanelRow className="elementor-panel-alert elementor-panel-warning-info">
                                                    <a style={{ color: 'red' }} target="_blank" href="https://wpdeveloper.com/in/upgrade-embedpress">
                                                        {__('Only Available in Pro Version!', 'embedpress')}
                                                    </a>
                                                </PanelRow>
                                            )}
                                            {instafeedFeedType === 'user_account_type' && (
                                                <SelectControl
                                                    label="Account Type"
                                                    value={instafeedAccountType}
                                                    options={[
                                                        { label: 'Personal', value: 'personal' },
                                                        { label: 'Business', value: 'business' }
                                                    ]}
                                                    onChange={(instafeedAccountType) => setAttributes({ instafeedAccountType })}
                                                />
                                            )}

                                            {instafeedFeedType === 'hashtag_type' && (
                                                applyFilters('embedpress.commonControls', [], attributes, setAttributes, 'warningInfo')
                                            )}

                                        </div>
                                    )
                                }





                            </PanelBody>

                            <Instafeed attributes={attributes} setAttributes={setAttributes} />

                            <Youtube attributes={attributes} setAttributes={setAttributes} isYTVideo={isYTVideo} isYTLive={isYTLive} isYTShorts={isYTShorts} />
                            <Youtube attributes={attributes} setAttributes={setAttributes} />

                            <SlefHosted attributes={attributes} setAttributes={setAttributes} />

                            <Spreaker attributes={attributes} setAttributes={setAttributes} />


                            <Wistia attributes={attributes} setAttributes={setAttributes} isWistiaVideo={isWistiaVideo} />
                            <Vimeo attributes={attributes} setAttributes={setAttributes} isVimeoVideo={isVimeoVideo} />

                            <Calendly attributes={attributes} setAttributes={setAttributes} isCalendly={isCalendly} />

                            <GooglePhotos attributes={attributes} setAttributes={setAttributes} />

                            {
                                isYTChannel && !isYTLive && (
                                    <CustomBranding attributes={attributes} setAttributes={setAttributes} />
                                )
                            }
                            <AdControl attributes={attributes} setAttributes={setAttributes} />
                            <LockControl attributes={attributes} setAttributes={setAttributes} />
                            <ContentShare attributes={attributes} setAttributes={setAttributes} />
                        </div>
                    )
                }

                <OpenSea attributes={attributes} setAttributes={setAttributes} isOpensea={isOpensea} isOpenseaSingle={isOpenseaSingle} />

            </InspectorControls >
        )
    )
}