/**
 * Internal dependencies
 */
import SocialShareHtml from '../../../GlobalCoponents/social-share-html.js';
import Logo from '../../../GlobalCoponents/Logo.js';
import AdTemplate from '../../../GlobalCoponents/ads-template.js';
import { sanitizeUrl } from '../../../GlobalCoponents/helper.js';

import { applyFilters } from "@wordpress/hooks";

/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;
const { Fragment } = wp.element;

import "../style.scss";

/**
 * Save component for Google Drawings block
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
            <div className={'embedpress-document-embed ep-google-drawings-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} style={{ width: width + unitoption, maxWidth: '100%' }} id={`ep-google-drawings-${clientId}`} data-source-id={'source-' + clientId}>
                <div className="ep-embed-content-wraper">
                    <div className={`position-${sharePosition}-wraper gutenberg-google-drawings-wraper`}>
                        <div className='main-content-wraper'>
                            <img
                                src={sanitizeUrl(iframeSrc)}
                                style={{ height: height, width: '100%' }}
                                alt="Google Drawing"
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
