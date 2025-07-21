/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";
import md5 from "md5";

/**
 * Internal dependencies
 */
import { getPlayerOptions, getCarouselOptions } from "./helper.js";
import DynamicStyles from "./dynamic-styles.js";
import { applyFilters } from "@wordpress/hooks";

import "../style.scss"
import { getEmbedType } from "../../../../utils/helper.js";

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
        playlist
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
    if (embedHTML && (width || height)) {
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
        <figure {...blockProps} data-source-id={`source-${clientId}`} data-embed-type={getEmbedType(url)}>
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

/**
 * Generate social share HTML to match editor layout (matching helper.js shareIconsHtml function)
 *
 * @param {string} sharePosition - Share position
 * @param {boolean} shareFacebook - Facebook share enabled
 * @param {boolean} shareTwitter - Twitter share enabled
 * @param {boolean} sharePinterest - Pinterest share enabled
 * @param {boolean} shareLinkedin - LinkedIn share enabled
 * @returns {string} - Share HTML
 */
function shareIconsHtml(sharePosition, shareFacebook, shareTwitter, sharePinterest, shareLinkedin) {
    let shareHtml = `<div class="ep-social-share share-position-${sharePosition}">`;

    // Only add Facebook icon if shareFacebook is true
    if (shareFacebook) {
        shareHtml += `
        <a href="#" class="ep-social-icon facebook" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        </a>`;
    }

    if (shareTwitter) {
        shareHtml += `
        <a href="#" class="ep-social-icon twitter" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
        </a>`;
    }

    if (sharePinterest) {
        shareHtml += `
        <a href="#" class="ep-social-icon pinterest" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
            </svg>
        </a>`;
    }

    if (shareLinkedin) {
        shareHtml += `
        <a href="#" class="ep-social-icon linkedin" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        </a>`;
    }

    shareHtml += '</div>';

    return shareHtml;
}
