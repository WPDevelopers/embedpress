/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState, useEffect, Fragment } from "@wordpress/element";
import {
    BlockControls,
    BlockIcon,
    MediaPlaceholder,
    useBlockProps
} from "@wordpress/block-editor";
import {
    ToolbarButton,
    ExternalLink,
} from "@wordpress/components";

/**
 * Internal dependencies
 */
import EmbedLoading from '../../../GlobalCoponents/embed-loading';
import { saveSourceData, sanitizeUrl } from '../../../GlobalCoponents/helper';
import SocialShareHtml from '../../../GlobalCoponents/social-share-html';
import AdTemplate from '../../../GlobalCoponents/ads-template';
import { googleDrawingsIcon } from "../../../GlobalCoponents/icons";

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

        if (url && url.match(/^http[s]?:\/\/((?:www\.)?docs\.google\.com(?:.*)?(?:document|presentation|spreadsheets|forms|drawings)\/[a-z0-9\/\?=_\-\.\,&%\$#\@\!\+]*)/i)) {
            var iframeSrc = decodeHTMLEntities(url);
            var regEx = /google\.com(?:.+)?(document|presentation|spreadsheets|forms|drawings)/i;
            var match = regEx.exec(iframeSrc);
            var type = match[1];

            if (type && type === 'drawings') {
                setEditingURL(false);
                setCannotEmbed(false);
                setAttributes({
                    iframeSrc: iframeSrc,
                    id: 'embedpress-google-drawings-' + Date.now(),
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

    const label = __('Google Drawings URL (Get your link from File -> Publish to the web -> Link)');

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
            <div className={"embedpress-document-editmode"}>
                <MediaPlaceholder
                    icon={<BlockIcon icon={googleDrawingsIcon} />}
                    labels={{
                        title: __('Google Drawings'),
                        instructions: __(
                            'Enter a Google Drawings URL to embed the drawing.'
                        ),
                    }}
                    onSelect={() => {}}
                    value={url}
                    onChange={(value) => setUrl(value)}
                    onSubmit={handleSetUrl}
                    cannotEmbed={cannotEmbed}
                >
                    <div style={{ width: '100%' }} className="components-placeholder__learn-more embedpress-doc-link">
                        <ExternalLink href="https://embedpress.com/docs/embed-google-drawings-wordpress/">
                            Learn more about Google Drawings embed
                        </ExternalLink>
                    </div>
                </MediaPlaceholder>
            </div>
        );
    } else {
        return (
            <Fragment>
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
                    <div className={'embedpress-document-embed ep-google-drawings-' + attributes.id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} style={{ width: width + unitoption, maxWidth: '100%' }} id={`ep-google-drawings-${attributes.clientId || clientId}`} data-source-id={'source-' + (attributes.clientId || clientId)}>

                        <div className="ep-embed-content-wraper">
                            <div className={`position-${sharePosition}-wraper gutenberg-google-drawings-wraper`}>
                                <div className='main-content-wraper'>
                                    <img
                                        src={sanitizeUrl(iframeSrc)}
                                        onLoad={onLoad}
                                        style={{ height: height, width: '100%', display: fetching ? 'none' : '' }}
                                        alt="Google Drawing"
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
            </Fragment>
        );
    }
}

export default Edit;
