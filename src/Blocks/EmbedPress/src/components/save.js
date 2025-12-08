/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;
import md5 from "md5";

/**
 * Internal dependencies
 */
import { getPlayerOptions, getCarouselOptions } from "./helper.js";
import DynamicStyles from "./dynamic-styles.js";
const { applyFilters } = wp.hooks;

import "../style.scss"
import { shareIconsHtml } from "../../../GlobalCoponents/helper.js";

/**
 * Save component for EmbedPress block
 *
 * For static content (YouTube, Vimeo, etc.), we save the actual embed HTML to the database.
 * For dynamic content (Google Photos, Instagram, OpenSea), we return null and use render_callback.
 */
export default function Save({ attributes }) {
    const blockProps = useBlockProps.save();

    const {
        url,
        embedHTML,
        width,
        height,
        contentShare,
        sharePosition,
        customPlayer,
        playerPreset,
        customlogo,
        logoX,
        logoY,
        logoOpacity,
        clientId,
        // Additional attributes from edit function
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
        enableLazyLoad
    } = attributes;

    if (!url || isDynamicProvider(url)) return null;

    // Platform detection (matching edit function logic)
    const isYTChannelUrl = url && (url.includes('youtube.com/channel/') || url.includes('youtube.com/c/') || url.includes('youtube.com/user/'));
    const isInstagramFeedUrl = url && url.includes('instagram.com');
    const isOpenseaUrl = url && url.includes('opensea.io') && !url.includes('/assets/');
    const isOpenseaSingleUrl = url && url.includes('opensea.io') && url.includes('/assets/');
    const isWistiaVideoUrl = url && url.includes('wistia.com');
    const isSpreakerUrlDetected = url && url.includes('spreaker.com');

    // Content share classes (matching edit function)
    let contentShareClass = '';
    let sharePositionClass = '';
    let sharePos = sharePosition || 'right';
    if (contentShare) {
        contentShareClass = 'ep-content-share-enabled';
        sharePositionClass = 'ep-share-position-' + sharePos;
    }

    // Player preset class (matching edit function)
    let playerPresetClass = '';
    if (customPlayer) {
        playerPresetClass = playerPreset || 'preset-default';
    }

    // YouTube channel class (matching edit function)
    let ytChannelClass = '';
    if (isYTChannelUrl) {
        ytChannelClass = 'embedded-youtube-channel';
    }

    // Instagram layout class (matching edit function)
    let instaLayoutClass = '';
    if (isInstagramFeedUrl) {
        instaLayoutClass = instaLayout;
    }

    // Source class for platform identification (matching edit function)
    let sourceClass = '';
    if (isOpenseaUrl || isOpenseaSingleUrl) {
        sourceClass = ' source-opensea';
    }

    const classes = ['wp-block-embedpress-embedpress'];
    if (contentShare) {
        classes.push('ep-content-share-enabled');
        classes.push(`ep-share-position-${sharePosition || 'right'}`);
    }
    if (customPlayer) {
        classes.push(playerPreset || 'preset-default');
    }

    const wrapperStyle = {
        position: 'relative',
        display: 'inline-block'
    };

    // Generate additional components (matching edit function)
    const _md5ClientId = md5(clientId || '');

    // Calendly popup button preview (matching edit function)
    let cPopupButton = '';
    if (cEmbedType === 'popup_button') {
        let textColor = cPopupButtonTextColor;
        let bgColor = cPopupButtonBGColor;

        if (cPopupButtonTextColor && !cPopupButtonTextColor.startsWith("#")) {
            textColor = "#" + cPopupButtonTextColor;
        }

        if (cPopupButtonBGColor && !cPopupButtonBGColor.startsWith("#")) {
            bgColor = "#" + cPopupButtonBGColor;
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

    // Wistia message (matching edit function)
    let epMessage = '';
    if (isWistiaVideoUrl) {
        epMessage = `<span class='ep-wistia-message'> Changes will be affected in frontend. </span>`;
    }

    // Share HTML (matching edit function)
    let shareHtml = '';
    if (contentShare) {
        shareHtml = shareIconsHtml(sharePosition, shareFacebook, shareTwitter, sharePinterest, shareLinkedin);
    }

    // Custom logo component (simplified version for save)
    const customLogoTemp = applyFilters('embedpress.customLogoComponent', '', attributes);

    // Style for iframe inside embedHTML
    const iframeStyle = `${width ? `width:${width}px;` : ''}${height ? `height:${height}px;` : ''}max-width:100%;`;

    let processedEmbedHTML = embedHTML || '';
    // Disable lazy loading if custom player is enabled
    const shouldLazyLoad = enableLazyLoad && !customPlayer;

    if (embedHTML && shouldLazyLoad) {
        // Convert iframes to lazy load placeholders
        processedEmbedHTML = embedHTML.replace(
            /<iframe([^>]*)src=["']([^"']+)["']([^>]*)>/gi,
            (match, before, src, after) => {
                return `<div class="ep-lazy-iframe-placeholder" data-ep-lazy-src="${src}" data-ep-iframe-style="${iframeStyle}" ${before} ${after} style="${iframeStyle}"></div>`;
            }
        );
    } else if (embedHTML && (width || height)) {
        processedEmbedHTML = embedHTML.replace(
            /<iframe([^>]*)>/gi,
            `<iframe$1 style="${iframeStyle}">`
        );
    } else if (!embedHTML && url) {
        processedEmbedHTML = `
            <div class="embedpress-placeholder" data-url="${url}" data-width="${width || 600}" data-height="${height || 400}">
                <!-- EmbedPress content will be loaded here -->
            </div>`;
    }

    // Generate player and carousel options (matching edit function)
    const playerOptions = customPlayer ? getPlayerOptions({ attributes }) : '';
    const carouselOptions = instaLayout === 'insta-carousel' ? getCarouselOptions({ attributes }) : '';


    return (
        <figure {...blockProps} data-source-id={`source-${clientId}`} data-embed-type={attributes.providerName || ''}>
            <div className={`gutenberg-block-wraper ${contentShareClass} ${sharePositionClass}${sourceClass}`}>
                <div
                    className={`position-${sharePos}-wraper ep-embed-content-wraper ${ytChannelClass} ${playerPresetClass} ${instaLayoutClass}`}
                    style={wrapperStyle}
                    {...(customPlayer ? { 'data-playerid': _md5ClientId } : {})}
                    {...(customPlayer ? { 'data-options': playerOptions } : {})}
                    {...(instaLayout === 'insta-carousel' ? { 'data-carouselid': _md5ClientId } : {})}
                    {...(instaLayout === 'insta-carousel' ? { 'data-carousel-options': carouselOptions } : {})}
                    dangerouslySetInnerHTML={{
                        __html: processedEmbedHTML + customLogoTemp + epMessage + shareHtml + cPopupButton,
                    }}
                />

                {/* Ad Manager Template (matching edit function) */}
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
            </div>



            {/* Ad Manager Styles (matching edit function) */}
            {adManager && (adSource === 'image') && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                        [data-source-id="source-${clientId}"] .main-ad-template div,
                        .main-ad-template div img {
                            height: 100%;
                        }
                        [data-source-id="source-${clientId}"] .main-ad-template {
                            position: absolute;
                            bottom: ${adYPosition}%;
                            left: ${adXPosition}%;
                        }
                    `
                }} />
            )}

            {/* Dynamic Styles - Apply same styles as in editor */}
            <DynamicStyles attributes={attributes} />
        </figure>
    );
}

/**
 * Check if a URL requires dynamic content (real-time data)
 *
 * @param {string} url - The URL to check
 * @returns {boolean} - True if dynamic content, false if static
 */
function isDynamicProvider(url) {
    if (!url) return false;

    // Dynamic providers that require real-time data
    const dynamicProviders = [
        'photos.app.goo.gl',
        'photos.google.com',
        'instagram.com',
        'opensea.io',
        // Add other dynamic providers as needed
    ];

    return dynamicProviders.some(provider => url.includes(provider));
}
