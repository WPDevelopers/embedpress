/**
 * Internal dependencies
 */
import SocialShareHtml from '../../../GlobalCoponents/social-share-html.js';
import AdTemplate from '../../../GlobalCoponents/ads-template.js';
import { sanitizeUrl } from '../../../GlobalCoponents/helper.js';

/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;

import "../style.scss";

/**
 * Save component for Google Slides block
 * Renders the same content as the editor for consistent design
 */
const Save = ({ attributes }) => {
    const blockProps = useBlockProps.save();

    const {
        iframeSrc,
        id,
        unitoption,
        width,
        height,
        powered_by,
        clientId,
        sharePosition,
        contentShare,
        adManager,
        adSource,
        adFileUrl,
        enableLazyLoad
    } = attributes;

    if (!iframeSrc) {
        return null;
    }

    let width_class = '';
    if (unitoption === '%') {
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

    return (
        <div {...blockProps}>
            <div className={'embedpress-document-embed ep-google-slides-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} id={`ep-google-slides-${clientId}`} data-source-id={'source-' + clientId} data-embed-type="Google Slides">
                <div className="ep-embed-content-wraper">
                    <div className={`position-${sharePosition}-wraper gutenberg-google-slides-wraper`}>
                        <div className='main-content-wraper'>
                            {enableLazyLoad ? (
                                <div
                                    className="ep-lazy-iframe-placeholder"
                                    data-ep-lazy-src={sanitizeUrl(iframeSrc)}
                                    data-ep-iframe-style={`width: ${unitoption === '%' ? width + '%' : width + 'px'}; height: ${height}px; max-width: 100%;`}
                                    data-ep-iframe-frameborder="0"
                                    data-ep-iframe-allowfullscreen="true"
                                    data-ep-iframe-mozallowfullscreen="true"
                                    data-ep-iframe-webkitallowfullscreen="true"
                                    style={{ width: unitoption === '%' ? width + '%' : width + 'px', height: height + 'px', maxWidth: '100%' }}
                                />
                            ) : (
                                <iframe
                                    src={sanitizeUrl(iframeSrc)}
                                    style={{ width: unitoption === '%' ? width + '%' : width + 'px', height: height + 'px', maxWidth: '100%' }}
                                    frameBorder="0"
                                    allowFullScreen="true"
                                    mozallowfullscreen="true"
                                    webkitallowfullscreen="true"
                                />
                            )}

                            {contentShare && <SocialShareHtml attributes={attributes} />}
                        </div>

                        {powered_by && <p className="embedpress-el-powered">Powered By EmbedPress</p>}
                    </div>

                    {adManager && (adSource === 'image') && adFileUrl && (
                        <AdTemplate attributes={attributes} deleteIcon={false} progressBar={false} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Save;
