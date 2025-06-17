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
import { embedPressIcon } from "./icons.js";
import { 
    removedBlockID, 
    saveSourceData, 
    getPlayerOptions, 
    getCarouselOptions,
    shareIconsHtml
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
        adXPosition,
        adYPosition,
        shareFacebook,
        shareTwitter,
        sharePinterest,
        shareLinkedin,
    } = attributes;

    // Set client ID if not set
    useEffect(() => {
        if (!attributes.clientId) {
            setAttributes({ clientId });
        }
    }, [clientId, attributes.clientId, setAttributes]);

    const _md5ClientId = md5(attributes.clientId || clientId);

    // Dynamic logo setting based on URL
    useEffect(() => {
        if (typeof embedpressObj !== 'undefined') {
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

                const apiUrl = `${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress`;
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

            {fetching && (
                <div className={blockProps.className}>
                    <EmbedLoading />
                </div>
            )}

            {(embedHTML && !editingURL && !fetching) && (
                <figure {...blockProps} data-source-id={'source-' + attributes.clientId}>
                    <div className={`gutenberg-block-wraper ${contentShareClass} ${sharePositionClass}`}>
                        <EmbedWrap
                            className={`position-${sharePos}-wraper ep-embed-content-wraper ${playerPresetClass}`}
                            style={{
                                display: fetching ? 'none' : 'inline-block',
                                position: 'relative'
                            }}
                            {...(customPlayer ? { 'data-playerid': md5(attributes.clientId) } : {})}
                            {...(customPlayer ? { 'data-options': getPlayerOptions({ attributes }) } : {})}
                            dangerouslySetInnerHTML={{
                                __html: embedHTML + customLogoTemp + shareHtml,
                            }}
                        />

                        {!interactive && (
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
        </Fragment>
    );
}
