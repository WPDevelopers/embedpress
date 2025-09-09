/**
 * EmbedPress Block Deprecated Versions
 *
 * This file contains deprecated versions of the block for backward compatibility.
 * Each version represents a different structure that was used in previous plugin versions.
 */

const deprecated = [
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
