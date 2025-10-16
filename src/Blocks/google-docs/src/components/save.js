/**
 * Internal dependencies
 */
import SocialShareHtml from '../../../GlobalCoponents/social-share-html.js';
import Logo from '../../../GlobalCoponents/Logo.js';
import AdTemplate from '../../../GlobalCoponents/ads-template.js';
import { sanitizeUrl } from '../../../GlobalCoponents/helper.js';

const { applyFilters } = wp.hooks;

/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;
const { Fragment } = wp.element;

import "../style.scss";

/**
 * Save component for Google Docs block
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
        adXPosition,
        adYPosition
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
            <div className={'embedpress-document-embed ep-google-docs-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} id={`ep-google-docs-${clientId}`} data-source-id={'source-' + clientId} data-embed-type="Google Docs">
                <div className="ep-embed-content-wraper">
                    <div className={`position-${sharePosition}-wraper gutenberg-google-docs-wraper`}>
                        <div className='main-content-wraper'>
                            <iframe
                                src={sanitizeUrl(iframeSrc)}
                                style={{ width: unitoption === '%' ? width + '%' : width + 'px', height: height + 'px', maxWidth: '100%' }}
                                frameBorder="0"
                                allowFullScreen="true"
                                mozallowfullscreen="true"
                                webkitallowfullscreen="true"
                            />

                            {contentShare && <SocialShareHtml attributes={attributes} />}
                        </div>

                        {powered_by && <p className="embedpress-el-powered">Powered By EmbedPress</p>}
                    </div>

                    {adManager && (adSource === 'image') && adFileUrl && (
                        <AdTemplate
                            attributes={attributes}
                            deleteIcon={false}
                            progressBar={false}
                            inEditor={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Save;
