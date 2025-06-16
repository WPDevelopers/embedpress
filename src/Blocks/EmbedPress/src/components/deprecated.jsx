/**
 * EmbedPress Block Deprecated Versions
 * 
 * This file contains deprecated versions of the block for backward compatibility.
 */

const deprecated = [
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
            },
            // Add other v1 attributes as needed
        },
        save: ({ attributes }) => {
            // Return the old save format
            return (
                <div className="embedpress-block" data-url={attributes.url}>
                    {/* Old save structure */}
                </div>
            );
        }
    }
];

export default deprecated;
