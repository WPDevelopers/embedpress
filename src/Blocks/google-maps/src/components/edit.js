/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;
const {
    BlockControls,
    useBlockProps
} = wp.blockEditor;
const {
    ToolbarButton,
} = wp.components;

/**
 * Internal dependencies
 */
import Iframe from '../../../GlobalCoponents/Iframe';
import EmbedLoading from '../../../GlobalCoponents/embed-loading';
import EmbedPlaceholder from '../../../GlobalCoponents/embed-placeholder';
import EmbedControls from '../../../GlobalCoponents/embed-controls';
import { saveSourceData, sanitizeUrl } from '../../../GlobalCoponents/helper';
import SocialShareHtml from '../../../GlobalCoponents/social-share-html';
import AdTemplate from '../../../GlobalCoponents/ads-template';
import { googleMapsIcon } from "../../../GlobalCoponents/icons";
import Inspector from './inspector';

import "../editor.scss";
import "../style.scss";

function Edit(props) {
    const { attributes, setAttributes, clientId, isSelected } = props;

    // State management
    const [editingURL, setEditingURL] = useState(false);
    const [url, setUrl] = useState(attributes.url || '');
    const [fetching, setFetching] = useState(true);
    const [cannotEmbed, setCannotEmbed] = useState(false);
    const [interactive, setInteractive] = useState(false);

    const blockProps = useBlockProps();

    // Reset interactive state when block is deselected
    useEffect(() => {
        if (!isSelected && interactive) {
            setInteractive(false);
        }
    }, [isSelected, interactive]);

    // Helper functions
    const hideOverlay = () => {
        setInteractive(true);
    };

    const onLoad = () => {
        setFetching(false);
    };

    const decodeHTMLEntities = (str) => {
        if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        }
        return str;
    };

    const isGoogleService = (url) => {
        var googleRegex = /(?:https?:\/\/)?(?:[^./]+\.)?google\.(com?\.)?[a-z]+(?:\.[a-z]+)?/;
        return googleRegex.test(url);
    };

    const handleSetUrl = (event) => {
        if (event) {
            event.preventDefault();
        }

        setAttributes({ url });

        if (url && url.match(/^http[s]?:\/\/(?:(?:(?:www\.|maps\.)?(?:google\.com?))|(?:goo\.gl))(?:\.[a-z]{2})?\/(?:maps\/)?(?:place\/)?(?:[a-z0-9\/%+\-_]*)?([a-z0-9\/%,+\-_=!:@\.&*\$#?\']*)/i)) {
            var iframeSrc = decodeHTMLEntities(url);
            if (url.match('~(maps/embed|output=embed)~i')) {
                //do something
            } else {
                var regEx = /@(-?[0-9\.]+,-?[0-9\.]+).+,([0-9\.]+[a-z])/i;
                var match = regEx.exec(iframeSrc);
                if (match && match.length > 1 && match[1] && match[2]) {
                    iframeSrc = 'https://maps.google.com/maps?hl=en&ie=UTF8&ll=' + match[1] + '&spn=' + match[1] + '&t=m&z=' + Math.round(parseInt(match[2])) + '&output=embed';
                } else {
                    setCannotEmbed(true);
                    setEditingURL(true);
                }
            }
            setEditingURL(false);
            setCannotEmbed(false);
            setAttributes({
                iframeSrc: iframeSrc,
                id: 'embedpress-google-maps-' + Date.now(),
            });

            if (embedpressGutenbergData.branding !== undefined && embedpressGutenbergData.branding.powered_by !== undefined) {
                setAttributes({
                    powered_by: embedpressGutenbergData.branding.powered_by
                });
            }
        } else {
            setCannotEmbed(true);
            setEditingURL(true);
        }

        if (clientId && url) {
            saveSourceData(clientId, url);
        }
    };

    const switchBackToURLInput = () => {
        setEditingURL(true);
    };

    // Set client ID if not set - using useEffect to ensure stability
    useEffect(() => {
        if (clientId == null || clientId == undefined) {
            setAttributes({ clientId });
        }
    }, []);

    // Extract attributes
    const { iframeSrc, powered_by, unitoption, width, height, sharePosition, contentShare, adManager, adSource, adFileUrl } = attributes;

    if (iframeSrc && !isGoogleService(iframeSrc)) {
        return 'Invalid URL.';
    }

    const label = __('Google Maps URL');

    let width_class = '';
    if (unitoption == '%') {
        width_class = 'ep-percentage-width';
    } else {
        width_class = 'ep-fixed-width';
    }

    let content_share_class = '';
    let share_position_class = '';
    let share_position = sharePosition ? sharePosition : 'right';
    if (contentShare) {
        content_share_class = 'ep-content-share-enabled';
        share_position_class = 'ep-share-position-' + share_position;
    }

    // No preview, or we can't embed the current URL, or we've clicked the edit button.
    if (!iframeSrc || editingURL) {
        return (
            <div {...blockProps}>
                <Inspector attributes={attributes} setAttributes={setAttributes} />
                <EmbedPlaceholder
                    label={__('Google Maps URL')}
                    onSubmit={handleSetUrl}
                    value={url}
                    cannotEmbed={cannotEmbed}
                    onChange={(event) => setUrl(event.target.value)}
                    icon={googleMapsIcon}
                    DocTitle={__('Learn More About Google Maps Embed')}
                    docLink={'https://embedpress.com/docs/embed-google-maps-wordpress/'}
                />
            </div>
        );
    } else {
        return (
            <Fragment>
                <Inspector attributes={attributes} setAttributes={setAttributes} />

                <BlockControls>
                    <ToolbarButton
                        className="components-edit-button"
                        icon="edit"
                        label={__('Edit URL', 'embedpress')}
                        onClick={switchBackToURLInput}
                    />
                </BlockControls>

                {fetching ? <EmbedLoading /> : null}

                <div {...blockProps}>
                    <div className={'embedpress-document-embed ep-google-maps-' + attributes.id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} id={`ep-google-maps-${attributes.clientId || clientId}`} data-source-id={'source-' + (attributes.clientId || clientId)}>

                        <div className="ep-embed-content-wraper">
                            <div className={`position-${sharePosition}-wraper gutenberg-google-maps-wraper`}>
                                <div className='main-content-wraper'>
                                    <Iframe
                                        src={sanitizeUrl(iframeSrc)}
                                        onMouseUp={hideOverlay}
                                        onLoad={onLoad}
                                        style={{ width: unitoption === '%' ? width + '%' : width + 'px', height: height + 'px', maxWidth: '100%', display: fetching ? 'none' : '' }}
                                        frameBorder="0"
                                    />

                                    {contentShare && <SocialShareHtml attributes={attributes} />}
                                </div>

                                {powered_by && <p className="embedpress-el-powered">Powered By EmbedPress</p>}

                                <div
                                    className="block-library-embed__interactive-overlay"
                                    onMouseUp={() => setAttributes({ interactive: true })}
                                />
                            </div>

                            {adManager && (adSource === 'image') && adFileUrl && (
                                <AdTemplate attributes={attributes} setAttributes={setAttributes} deleteIcon={false} progressBar={false} inEditor={true} />
                            )}
                        </div>
                    </div>
                </div>

                <EmbedControls
                    showEditButton={iframeSrc && !cannotEmbed}
                    switchBackToURLInput={switchBackToURLInput}
                />
            </Fragment>
        );
    }
}

export default Edit;
