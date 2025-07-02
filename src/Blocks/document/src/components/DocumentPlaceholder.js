
import { BlockIcon, MediaPlaceholder } from '@wordpress/block-editor';

import { DocumentIcon } from '../../../GlobalCoponents/icons';
import { ExternalLink } from '@wordpress/components';

/**
 * Allowed file types
 */
const ALLOWED_MEDIA_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
];


/**
 * Sub-components
 */

const DocumentPlaceholder = ({ onSelect, onError, notices }) => (
    <div className="embedpress-document-editmode">
        <MediaPlaceholder
            icon={<BlockIcon icon={DocumentIcon} />}
            labels={{
                title: __('Document'),
                instructions: __('Upload a file or pick one from your media library for embed.'),
            }}
            onSelect={onSelect}
            notices={notices}
            allowedTypes={ALLOWED_MEDIA_TYPES}
            onError={onError}
        >
            <div className="components-placeholder__learn-more embedpress-doc-link">
                <ExternalLink href="https://embedpress.com/docs/embed-document/">
                    Learn more about Embedded document
                </ExternalLink>
            </div>
        </MediaPlaceholder>
    </div>
);


export default DocumentPlaceholder;
