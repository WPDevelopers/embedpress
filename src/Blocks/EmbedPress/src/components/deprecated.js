/**
 * EmbedPress Block Deprecated Versions
 *
 * This file contains deprecated versions of the block for backward compatibility.
 * Each version represents a different structure that was used in previous plugin versions.
 */

import md5 from "md5";
import { getLegacyPlayerOptions, getCarouselOptions } from "./helper.js";
import { shareIconsHtml } from "../../../GlobalCoponents/helper.js";
import DynamicStyles from "./dynamic-styles.js";
const { useBlockProps } = wp.blockEditor;
const { applyFilters } = wp.hooks;

/**
 * v4 save — pre-#81243 markup. Identical to the current save() in every
 * respect EXCEPT that data-options is built with the legacy 13-key JSON
 * (getLegacyPlayerOptions) instead of the new full Pro-feature JSON.
 *
 * Posts saved before the Pro-feature keys were added store the old JSON
 * verbatim in their HTML; this deprecation lets WP match that markup so
 * the editor doesn't show the recovery prompt. Migration is a no-op —
 * attribute names are unchanged, the new attributes simply read their
 * defaults until the user toggles them.
 */
function SaveV4({ attributes }) {
    const blockProps = useBlockProps.save();
    const {
        url, embedHTML, width, height, contentShare, sharePosition,
        customPlayer, playerPreset, clientId,
        adManager, adSource, adFileUrl, adWidth, adHeight, adXPosition, adYPosition,
        shareFacebook, shareTwitter, sharePinterest, shareLinkedin,
        instaLayout, cEmbedType, cPopupButtonText, cPopupButtonBGColor, cPopupButtonTextColor,
        enableLazyLoad,
    } = attributes;

    const dynamicProviders = ['photos.app.goo.gl', 'photos.google.com', 'instagram.com', 'opensea.io'];
    const isDynamic = url && dynamicProviders.some((p) => url.includes(p));
    if (!url || isDynamic) return null;

    const isYTChannelUrl = url && (url.includes('youtube.com/channel/') || url.includes('youtube.com/c/') || url.includes('youtube.com/user/'));
    const isInstagramFeedUrl = url && url.includes('instagram.com');
    const isOpenseaUrl = url && url.includes('opensea.io') && !url.includes('/assets/');
    const isOpenseaSingleUrl = url && url.includes('opensea.io') && url.includes('/assets/');
    const isWistiaVideoUrl = url && url.includes('wistia.com');

    let contentShareClass = '';
    let sharePositionClass = '';
    const sharePos = sharePosition || 'right';
    if (contentShare) {
        contentShareClass = 'ep-content-share-enabled';
        sharePositionClass = 'ep-share-position-' + sharePos;
    }

    let playerPresetClass = '';
    if (customPlayer) playerPresetClass = playerPreset || 'preset-default';

    let ytChannelClass = '';
    if (isYTChannelUrl) ytChannelClass = 'embedded-youtube-channel';

    let instaLayoutClass = '';
    if (isInstagramFeedUrl) instaLayoutClass = instaLayout;

    let sourceClass = '';
    if (isOpenseaUrl || isOpenseaSingleUrl) sourceClass = ' source-opensea';

    const wrapperStyle = { position: 'relative', display: 'inline-block' };
    const _md5ClientId = md5(clientId || '');

    let cPopupButton = '';
    if (cEmbedType === 'popup_button') {
        let textColor = cPopupButtonTextColor;
        let bgColor = cPopupButtonBGColor;
        if (cPopupButtonTextColor && !cPopupButtonTextColor.startsWith('#')) textColor = '#' + cPopupButtonTextColor;
        if (cPopupButtonBGColor && !cPopupButtonBGColor.startsWith('#')) bgColor = '#' + cPopupButtonBGColor;
        cPopupButton = `\n            <div class="cbutton-preview-wrapper" style="margin-top:-${height}px">\n                <h4 class="cbutton-preview-text">Preview Popup Button</h4>\n                <div style="position: static" class="calendly-badge-widget">\n                    <div class="calendly-badge-content" style="color: ${textColor}; background: ${bgColor};">\n                        ${cPopupButtonText}\n                    </div>\n                </div>\n            </div>\n        `;
    }

    let epMessage = '';
    if (isWistiaVideoUrl) epMessage = `<span class='ep-wistia-message'> Changes will be affected in frontend. </span>`;

    let shareHtml = '';
    if (contentShare) shareHtml = shareIconsHtml(sharePosition, shareFacebook, shareTwitter, sharePinterest, shareLinkedin);

    const customLogoTemp = applyFilters('embedpress.customLogoComponent', '', attributes);
    const iframeStyle = `${width ? `width:${width}px;` : ''}${height ? `height:${height}px;` : ''}max-width:100%;`;

    let processedEmbedHTML = embedHTML || '';
    const shouldLazyLoad = enableLazyLoad && !customPlayer;
    if (embedHTML && shouldLazyLoad) {
        processedEmbedHTML = embedHTML.replace(
            /<iframe([^>]*)src=["']([^"']+)["']([^>]*)>/gi,
            (m, before, src, after) => `<div class="ep-lazy-iframe-placeholder" data-ep-lazy-src="${src}" data-ep-iframe-style="${iframeStyle}" ${before} ${after} style="${iframeStyle}"></div>`
        );
    } else if (embedHTML && (width || height)) {
        processedEmbedHTML = embedHTML.replace(/<iframe([^>]*)>/gi, `<iframe$1 style="${iframeStyle}">`);
    } else if (!embedHTML && url) {
        processedEmbedHTML = `\n            <div class="embedpress-placeholder" data-url="${url}" data-width="${width || 600}" data-height="${height || 400}">\n                <!-- EmbedPress content will be loaded here -->\n            </div>`;
    }

    const playerOptions = customPlayer ? getLegacyPlayerOptions({ attributes }) : '';
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
                    dangerouslySetInnerHTML={{ __html: processedEmbedHTML + customLogoTemp + epMessage + shareHtml + cPopupButton }}
                />
                {adManager && adSource === 'image' && adFileUrl && (
                    <div className="main-ad-template" style={{
                        position: 'absolute', bottom: `${adYPosition}%`, left: `${adXPosition}%`,
                        width: `${adWidth}px`, height: `${adHeight}px`,
                        backgroundImage: `url(${adFileUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 10
                    }}>
                        <div style={{ width: '100%', height: '100%' }}>
                            <img src={adFileUrl} alt="Advertisement" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                )}
            </div>
            {adManager && adSource === 'image' && (
                <style dangerouslySetInnerHTML={{
                    __html: `\n                        [data-source-id="source-${clientId}"] .main-ad-template div,\n                        .main-ad-template div img { height: 100%; }\n                        [data-source-id="source-${clientId}"] .main-ad-template { position: absolute; bottom: ${adYPosition}%; left: ${adXPosition}%; }\n                    `
                }} />
            )}
            <DynamicStyles attributes={attributes} />
        </figure>
    );
}

const deprecated = [
    // v4 — pre-#81243 (data-options had only the 13 basic player keys
    // and DynamicStyles output varied across older revisions).
    //
    // We can't reproduce every old revision's exact markup byte-for-byte,
    // so we lean on isEligible: () => true. WP only consults deprecations
    // when current save() validation already failed, and isEligible
    // bypasses the deprecation's own markup match — the block is migrated
    // and rewritten with current save() on the next post update.
    //
    // Migrate is identity: attribute names didn't change, the new Pro
    // attributes simply read their defaults during parse and the user
    // can opt into them via the inspector.
    {
        isEligible: () => true,
        save: SaveV4,
        migrate: (attributes) => attributes,
    },

    // Version 3 - Pre-4.2.7 structure with render_callback only
    {
        attributes: {
            url: {
                type: 'string',
                default: ''
            },
            embedHTML: {
                type: 'string',
                default: ''
            },
            height: {
                type: 'string',
                default: '600'
            },
            width: {
                type: 'string',
                default: '600'
            },
            customPlayer: {
                type: 'object',
                default: {}
            },
            sharePosition: {
                type: 'string',
                default: 'bottom'
            },
            clientId: {
                type: 'string',
                default: ''
            },
            // Old custom player attributes
            autoplay: {
                type: 'boolean',
                default: false
            },
            loop: {
                type: 'boolean',
                default: false
            },
            controls: {
                type: 'boolean',
                default: true
            },
            muted: {
                type: 'boolean',
                default: false
            }
        },
        migrate: (attributes) => {
            // Migrate old structure to new structure
            const newAttributes = { ...attributes };

            // Migrate individual player settings to customPlayer object
            if (attributes.autoplay !== undefined ||
                attributes.loop !== undefined ||
                attributes.controls !== undefined ||
                attributes.muted !== undefined) {

                newAttributes.customPlayer = {
                    autoplay: attributes.autoplay || false,
                    loop: attributes.loop || false,
                    controls: attributes.controls !== undefined ? attributes.controls : true,
                    muted: attributes.muted || false
                };

                // Remove old individual attributes
                delete newAttributes.autoplay;
                delete newAttributes.loop;
                delete newAttributes.controls;
                delete newAttributes.muted;
            }

            // Mark as migrated
            newAttributes.isMigrated = true;

            return newAttributes;
        },
        save: ({ attributes }) => {
            // This version used render_callback only, so save returns null
            return null;
        }
    },

    // Version 2 - Legacy structure with embedHTML
    {
        attributes: {
            url: {
                type: 'string',
                default: ''
            },
            embedHTML: {
                type: 'string',
                default: ''
            },
            height: {
                type: 'string',
                default: '600'
            },
            width: {
                type: 'string',
                default: '600'
            },
            customPlayer: {
                type: 'object',
                default: {}
            },
            oldSharePosition: {
                type: 'string',
                default: 'bottom'
            }
        },
        migrate: (attributes) => {
            const newAttributes = { ...attributes };

            // Migrate old share position attribute name
            if (attributes.oldSharePosition) {
                newAttributes.sharePosition = attributes.oldSharePosition;
                delete newAttributes.oldSharePosition;
            }

            // Mark as migrated
            newAttributes.isMigrated = true;

            return newAttributes;
        },
        save: ({ attributes }) => {
            const { url, embedHTML, height, width } = attributes;

            return (
                <div className="embedpress-gutenberg-wrapper" style={{ height, width }}>
                    {embedHTML ? (
                        <div dangerouslySetInnerHTML={{ __html: embedHTML }} />
                    ) : (
                        <div className="embedpress-block" data-url={url}>
                            <p>EmbedPress content</p>
                        </div>
                    )}
                </div>
            );
        }
    },

    // Version 1 - Original EmbedPress block structure
    {
        attributes: {
            url: {
                type: 'string',
                default: ''
            },
            embedHTML: {
                type: 'string',
                default: ''
            },
            height: {
                type: 'string',
                default: '600'
            },
            width: {
                type: 'string',
                default: '600'
            }
        },
        migrate: (attributes) => {
            // Migrate to version 2 structure
            const newAttributes = { ...attributes };

            // Add missing attributes with defaults
            newAttributes.customPlayer = {};
            newAttributes.sharePosition = 'bottom';
            newAttributes.isMigrated = true;

            return newAttributes;
        },
        save: ({ attributes }) => {
            const { url, embedHTML } = attributes;

            // Very basic old save format
            return (
                <div className="embedpress-block" data-url={url}>
                    {embedHTML ? (
                        <div dangerouslySetInnerHTML={{ __html: embedHTML }} />
                    ) : (
                        <p>EmbedPress: {url}</p>
                    )}
                </div>
            );
        }
    }
];

export default deprecated;
