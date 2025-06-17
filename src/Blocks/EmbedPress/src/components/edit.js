/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { Fragment, useEffect } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";
import apiFetch from "@wordpress/api-fetch";
import { applyFilters } from "@wordpress/hooks";

/**
 * Internal dependencies
 */
import Inspector from "./inspector.js";
import EmbedControls from "./embed-controls.js";
import EmbedLoading from "./embed-loading.js";
import EmbedPlaceholder from "./embed-placeholder.js";
import EmbedWrap from "./embed-wrap.js";
import DynamicStyles from "./dynamic-styles.js";
import { embedPressIcon } from "./icons.js";
import {
    removedBlockID,
    saveSourceData,
    getPlayerOptions,
    getCarouselOptions,
    shareIconsHtml,
    // Platform detection functions
    isYTChannel,
    isYTVideo,
    isYTLive,
    isYTShorts,
    isVimeoVideo,
    isWistiaVideo,
    isSelfHostedVideo,
    isSelfHostedAudio,
    isInstagramFeed,
    isOpensea,
    isOpenseaSingle,
    isCalendly,
    isTikTok,
    isSpreakerUrl,
    isGooglePhotosUrl,
    initCustomPlayer,
    initCarousel
} from "./helper";
import md5 from "md5";
import { EPIcon } from "../../../GlobalCoponents/icons.js";

// Initialize block ID removal
removedBlockID();

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;

    const {
        url,
        editingURL,
        fetching,
        cannotEmbed,
        interactive,
        embedHTML,
        height,
        width,
        contentShare,
        sharePosition,
        lockContent,
        customlogo,
        logoX,
        logoY,
        customlogoUrl,
        logoOpacity,
        customPlayer,
        playerPreset,
        adManager,
        adSource,
        adFileUrl,
        adWidth,
        adHeight,
        adXPosition,
        adYPosition,
        shareFacebook,
        shareTwitter,
        sharePinterest,
        shareLinkedin,
        instaLayout,
        cEmbedType,
        cPopupButtonText,
        cPopupButtonBGColor,
        cPopupButtonTextColor,
        coverImageUrl,
        playlist,
    } = attributes;

    // Set client ID if not set
    useEffect(() => {
        if (!attributes.clientId) {
            setAttributes({ clientId });
        }
    }, [clientId, attributes.clientId, setAttributes]);

    const _md5ClientId = md5(attributes.clientId || clientId);

    // Platform detection
    const _isSelfHostedVideo = isSelfHostedVideo(url);
    const _isSelfHostedAudio = isSelfHostedAudio(url);
    const isYTChannelUrl = isYTChannel(url);
    const isYTVideoUrl = isYTVideo(url);
    const isYTLiveUrl = isYTLive(url);
    const isYTShortsUrl = isYTShorts(url);
    const isVimeoVideoUrl = isVimeoVideo(url);
    const isWistiaVideoUrl = isWistiaVideo(url);
    const isInstagramFeedUrl = isInstagramFeed(url);
    const isOpenseaUrl = isOpensea(url);
    const isOpenseaSingleUrl = isOpenseaSingle(url);
    const isCalendlyUrl = isCalendly(url);
    const isTikTokUrl = isTikTok(url);
    const isSpreakerUrlDetected = isSpreakerUrl(url);
    const isGooglePhotosUrlDetected = isGooglePhotosUrl(url);

    // Dynamic logo setting based on URL
    useEffect(() => {
        if (typeof window.embedpressObj !== 'undefined') {
            const embedpressObj = window.embedpressObj;
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                setAttributes({
                    customlogo: embedpressObj.youtube_brand_logo_url || ''
                });
            } else if (url.includes('vimeo.com')) {
                setAttributes({
                    customlogo: embedpressObj.vimeo_brand_logo_url || ''
                });
            } else if (url.includes('wistia.com')) {
                setAttributes({
                    customlogo: embedpressObj.wistia_brand_logo_url || ''
                });
            } else if (url.includes('twitch.com')) {
                setAttributes({
                    customlogo: embedpressObj.twitch_brand_logo_url || ''
                });
            } else if (url.includes('dailymotion.com')) {
                setAttributes({
                    customlogo: embedpressObj.dailymotion_brand_logo_url || ''
                });
            }
        }
    }, [url, setAttributes]);

    // Platform-specific height adjustments
    useEffect(() => {
        if (isSpreakerUrlDetected && !coverImageUrl && !playlist) {
            setAttributes({ height: '200' });
        }
        if (isSpreakerUrlDetected && playlist) {
            setAttributes({ height: '450' });
        }
    }, [url, coverImageUrl, playlist, isSpreakerUrlDetected, setAttributes]);

    useEffect(() => {
        if ((isYTVideoUrl || isYTLiveUrl || _isSelfHostedVideo || isVimeoVideoUrl || isWistiaVideoUrl) && editingURL) {
            setAttributes({ height: '340' });
        }
    }, [url, editingURL, isYTVideoUrl, isYTLiveUrl, _isSelfHostedVideo, isVimeoVideoUrl, isWistiaVideoUrl, setAttributes]);

    // Content share classes
    let contentShareClass = '';
    let sharePositionClass = '';
    let sharePos = sharePosition || 'right';
    if (contentShare) {
        contentShareClass = 'ep-content-share-enabled';
        sharePositionClass = 'ep-share-position-' + sharePos;
    }

    // Player preset class
    let playerPresetClass = '';
    if (customPlayer) {
        playerPresetClass = playerPreset || 'preset-default';
    }

    // YouTube channel class
    let ytChannelClass = '';
    if (isYTChannelUrl) {
        ytChannelClass = 'embedded-youtube-channel';
    }

    // Instagram layout class
    let instaLayoutClass = '';
    if (isInstagramFeedUrl) {
        instaLayoutClass = instaLayout;
    }

    // Source class for platform identification
    let sourceClass = '';
    if (isOpenseaUrl || isOpenseaSingleUrl) {
        sourceClass = ' source-opensea';
    }

    // Calendly popup button preview
    let cPopupButton = '';
    if (cEmbedType === 'popup_button') {
        let textColor = cPopupButtonTextColor;
        let bgColor = cPopupButtonBGColor;

        if (cPopupButtonTextColor && !cPopupButtonTextColor.startsWith("#")) {
            textColor = "#" + cPopupButtonTextColor;
            setAttributes({ cPopupButtonTextColor: textColor });
        }

        if (cPopupButtonBGColor && !cPopupButtonBGColor.startsWith("#")) {
            bgColor = "#" + cPopupButtonBGColor;
            setAttributes({ cPopupButtonBGColor: bgColor });
        }

        cPopupButton = `
            <div class="cbutton-preview-wrapper" style="margin-top:-${height}px">
                <h4 class="cbutton-preview-text">Preview Popup Button</h4>
                <div style="position: static" class="calendly-badge-widget">
                    <div class="calendly-badge-content" style="color: ${textColor}; background: ${bgColor};">
                        ${cPopupButtonText}
                    </div>
                </div>
            </div>
        `;
    }

    // Wistia message
    let epMessage = '';
    if (isWistiaVideoUrl) {
        epMessage = `<span class='ep-wistia-message'> Changes will be affected in frontend. </span>`;
    }

    // Share HTML
    let shareHtml = '';
    if (contentShare) {
        shareHtml = shareIconsHtml(sharePosition, shareFacebook, shareTwitter, sharePinterest, shareLinkedin);
    }

    // Custom logo component
    const customLogoTemp = applyFilters('embedpress.customLogoComponent', [], attributes);

    function switchBackToURLInput() {
        setAttributes({ editingURL: true });
    }

    function onLoad() {
        setAttributes({ fetching: false });
    }

    function execScripts() {
        if (!embedHTML) return;
        
        let scripts = embedHTML.matchAll(/<script.*?src=["'](.*?)["'].*?><\/script>/g);
        scripts = [...scripts];
        for (const script of scripts) {
            if (script && typeof script[1] !== 'undefined') {
                const url = script[1];
                const hash = md5(url);
                const exist = document.getElementById(hash);
                if (exist) {
                    exist.remove();
                }
                const s = document.createElement('script');
                s.type = 'text/javascript';
                s.setAttribute('id', hash);
                s.setAttribute('src', url);
                document.body.appendChild(s);
            }
        }
    }

    function embed(event) {
        if (event) event.preventDefault();

        if (url) {
            setAttributes({ fetching: true });

            // API request to get embed HTML
            const fetchData = async (embedUrl) => {
                let params = {
                    url: embedUrl,
                    width,
                    height,
                };

                params = applyFilters('embedpress_block_rest_param', params, attributes);

                const embedpressObj = window.embedpressObj || {};
                const apiUrl = `${embedpressObj.site_url || window.location.origin}/wp-json/embedpress/v1/oembed/embedpress`;
                const args = { 
                    url: apiUrl, 
                    method: "POST", 
                    data: params 
                };

                return await apiFetch(args)
                    .then((res) => res)
                    .catch((err) => {
                        console.error('EmbedPress API Error:', err);
                        return { error: true };
                    });
            };

            fetchData(url).then(data => {
                setAttributes({ fetching: false });
                
                if ((data.data && data.data.status === 404) || !data.embed || data.error) {
                    setAttributes({
                        cannotEmbed: true,
                        editingURL: true,
                    });
                } else {
                    setAttributes({
                        embedHTML: data.embed,
                        cannotEmbed: false,
                        editingURL: false,
                    });
                    execScripts();
                }
            });
        } else {
            setAttributes({
                cannotEmbed: true,
                fetching: false,
                editingURL: true
            });
        }

        if (attributes.clientId && url) {
            saveSourceData(attributes.clientId, url);
        }

        // Initialize custom player if enabled
        if (customPlayer) {
            initCustomPlayer(_md5ClientId, attributes);
        }

        // Initialize carousel for Instagram
        if (instaLayout === 'insta-carousel') {
            initCarousel(_md5ClientId, attributes);
        }
    }

    useEffect(() => {
        if (embedHTML && !editingURL && !fetching) {
            execScripts();
        }
    }, [embedHTML, editingURL, fetching]);

    const blockProps = useBlockProps();

    return (
        <Fragment>
            <Inspector
                attributes={attributes}
                setAttributes={setAttributes}
                isYTChannel={isYTChannelUrl}
                isYTVideo={isYTVideoUrl}
                isYTLive={isYTLiveUrl}
                isYTShorts={isYTShortsUrl}
                isOpensea={isOpenseaUrl}
                isOpenseaSingle={isOpenseaSingleUrl}
                isWistiaVideo={isWistiaVideoUrl}
                isVimeoVideo={isVimeoVideoUrl}
                isSelfHostedVideo={_isSelfHostedVideo}
                isSelfHostedAudio={_isSelfHostedAudio}
                isCalendly={isCalendlyUrl}
                isTikTok={isTikTokUrl}
                isSpreaker={isSpreakerUrlDetected}
                isGooglePhotos={isGooglePhotosUrlDetected}
            />

            {((!embedHTML || !!editingURL) && !fetching) && (
                <div {...blockProps}>
                    <EmbedPlaceholder
                        label={__('EmbedPress - Embed anything from 150+ sites', 'embedpress')}
                        onSubmit={embed}
                        value={url}
                        cannotEmbed={cannotEmbed}
                        onChange={(event) => setAttributes({ url: event.target.value })}
                        icon={EPIcon}
                        DocTitle={__('Learn more about EmbedPress', 'embedpress')}
                        docLink={'https://embedpress.com/docs/'}
                    />
                </div>
            )}

            {/* Loading state with platform-specific conditions */}
            {(
                (!isOpenseaUrl || (!!editingURL || editingURL === 0)) &&
                (!isOpenseaSingleUrl || (!!editingURL || editingURL === 0)) &&
                ((!isYTVideoUrl && !isYTLiveUrl && !isYTShortsUrl) || (!!editingURL || editingURL === 0)) &&
                (!isYTChannelUrl || (!!editingURL || editingURL === 0)) &&
                (!isWistiaVideoUrl || (!!editingURL || editingURL === 0)) &&
                (!isVimeoVideoUrl || (!!editingURL || editingURL === 0)) &&
                (!isCalendlyUrl || (!!editingURL || editingURL === 0)) &&
                (!isInstagramFeedUrl || (!!editingURL || editingURL === 0)) &&
                (!isSpreakerUrlDetected || (!!editingURL || editingURL === 0)) &&
                (!isGooglePhotosUrlDetected || (!!editingURL || editingURL === 0))
            ) && fetching && (
                <div className={blockProps.className}>
                    <EmbedLoading />
                </div>
            )}

            {/* Main embed content */}
            {(embedHTML && !editingURL && (!fetching || isOpenseaUrl || isOpenseaSingleUrl || isYTChannelUrl || isYTVideoUrl || isYTShortsUrl || isWistiaVideoUrl || isVimeoVideoUrl || isCalendlyUrl || isInstagramFeedUrl || isSpreakerUrlDetected || isGooglePhotosUrlDetected)) && (
                <figure {...blockProps} data-source-id={'source-' + attributes.clientId}>
                    <div className={`gutenberg-block-wraper ${contentShareClass} ${sharePositionClass}${sourceClass}`}>
                        <EmbedWrap
                            className={`position-${sharePos}-wraper ep-embed-content-wraper ${ytChannelClass} ${playerPresetClass} ${instaLayoutClass}`}
                            style={{
                                display: fetching && !isOpenseaUrl && !isOpenseaSingleUrl && !isYTChannelUrl && !isYTVideoUrl && !isYTLiveUrl && !isYTShortsUrl && !isWistiaVideoUrl && !isVimeoVideoUrl && !isCalendlyUrl && !isInstagramFeedUrl && !isGooglePhotosUrlDetected ? 'none' : isOpenseaUrl || isOpenseaSingleUrl ? 'block' : 'inline-block',
                                position: 'relative'
                            }}
                            {...(customPlayer ? { 'data-playerid': md5(attributes.clientId) } : {})}
                            {...(customPlayer ? { 'data-options': getPlayerOptions({ attributes }) } : {})}
                            {...(instaLayout === 'insta-carousel' ? { 'data-carouselid': md5(attributes.clientId) } : {})}
                            {...(instaLayout === 'insta-carousel' ? { 'data-carousel-options': getCarouselOptions({ attributes }) } : {})}
                            dangerouslySetInnerHTML={{
                                __html: embedHTML + customLogoTemp + epMessage + shareHtml + cPopupButton,
                            }}
                        />

                        {/* Ad Manager Template */}
                        {adManager && (adSource === 'image') && adFileUrl && (
                            <div className="main-ad-template" style={{
                                position: 'absolute',
                                bottom: `${adYPosition}%`,
                                left: `${adXPosition}%`,
                                width: `${adWidth}px`,
                                height: `${adHeight}px`,
                                backgroundImage: `url(${adFileUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                zIndex: 10
                            }}>
                                <div style={{ width: '100%', height: '100%' }}>
                                    <img src={adFileUrl} alt="Advertisement" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            </div>
                        )}

                        {fetching && (
                            <div style={{ filter: 'grayscale(1)', backgroundColor: '#fffafa', opacity: '0.7' }}
                                className="block-library-embed__interactive-overlay"
                                onMouseUp={() => setAttributes({ interactive: true })}
                            />
                        )}

                        {!isOpenseaUrl && !isOpenseaSingleUrl && !interactive && (
                            <div
                                className="block-library-embed__interactive-overlay"
                                onMouseUp={() => setAttributes({ interactive: true })}
                            />
                        )}

                        <EmbedControls
                            showEditButton={embedHTML && !cannotEmbed}
                            switchBackToURLInput={switchBackToURLInput}
                        />
                    </div>
                </figure>
            )}

            {/* Dynamic Styles */}
            <DynamicStyles attributes={attributes} />

            {/* Custom Logo Styles */}
            {customlogo && (
                <style>
                    {`
                        [data-source-id="source-${attributes.clientId}"] img.watermark {
                            opacity: ${logoOpacity};
                            left: ${logoX}px;
                            top: ${logoY}px;
                        }
                    `}
                </style>
            )}

            {/* Hide watermark when no custom logo */}
            {!customlogo && (
                <style>
                    {`
                        [data-source-id="source-${attributes.clientId}"] img.watermark {
                            display: none;
                        }
                    `}
                </style>
            )}

            {/* Ad Manager Styles */}
            {adManager && (adSource === 'image') && (
                <style>
                    {`
                        [data-source-id="source-${attributes.clientId}"] .main-ad-template div,
                        .main-ad-template div img {
                            height: 100%;
                        }
                        [data-source-id="source-${attributes.clientId}"] .main-ad-template {
                            position: absolute;
                            bottom: ${adYPosition}%;
                            left: ${adXPosition}%;
                        }
                    `}
                </style>
            )}
        </Fragment>
    );
}
