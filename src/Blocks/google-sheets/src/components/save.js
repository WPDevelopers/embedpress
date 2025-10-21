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
 * Save component for Google Sheets block
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
        adFileUrl
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
            <div className={'embedpress-document-embed ep-google-sheets-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} id={`ep-google-sheets-${clientId}`} data-source-id={'source-' + clientId} data-embed-type="Google Sheets">
                <div className="ep-embed-content-wraper">
                    <div className={`position-${sharePosition}-wraper gutenberg-google-sheets-wraper`}>
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
                        <AdTemplate attributes={attributes} deleteIcon={false} progressBar={false} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Save;
