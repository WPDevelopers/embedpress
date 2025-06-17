/**
 * EmbedPress Block Registration
 * 
 * This file registers the EmbedPress block using the new centralized structure.
 * It's designed to work with the existing build system while providing
 * a clean separation from the old Gutenberg implementation.
 */

// Import WordPress dependencies
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

// Import block configuration
import metadata from './block.json';

// For now, we'll use a simple registration that works with the existing build system
// The actual block functionality will be handled by the PHP render callback

console.log('EmbedPress block (new system) - Registration started');

// Check if WordPress functions are available
if (typeof wp !== 'undefined' && wp.blocks && wp.blocks.registerBlockType) {
    // Check if block is enabled in settings
    const isBlockEnabled = typeof embedpressObj !== 'undefined' &&
                          embedpressObj &&
                          embedpressObj.active_blocks &&
                          embedpressObj.active_blocks.embedpress;

    if (isBlockEnabled) {
        // Register the block with minimal client-side functionality
        // The heavy lifting is done by the PHP render callback
        registerBlockType(metadata.name, {
            title: metadata.title,
            description: metadata.description,
            category: metadata.category,
            icon: 'embed-generic',
            keywords: [
                __("embed", "embedpress"),
                __("embedpress", "embedpress"),
                __("video", "embedpress"),
                __("social", "embedpress"),
                __("youtube", "embedpress"),
                __("vimeo", "embedpress"),
                __("google docs", "embedpress"),
                __("pdf", "embedpress"),
            ],
            supports: metadata.supports,
            
            // Simple edit function that shows a placeholder
            edit: function(props) {
                const { attributes, setAttributes } = props;
                
                return wp.element.createElement(
                    'div',
                    { 
                        className: 'embedpress-block-placeholder',
                        style: { 
                            padding: '20px', 
                            border: '2px dashed #ccc', 
                            textAlign: 'center',
                            backgroundColor: '#f9f9f9'
                        }
                    },
                    wp.element.createElement(
                        'p',
                        { style: { margin: 0, fontSize: '16px', color: '#666' } },
                        __('EmbedPress Block (New System)', 'embedpress')
                    ),
                    wp.element.createElement(
                        'p',
                        { style: { margin: '10px 0 0 0', fontSize: '14px', color: '#999' } },
                        __('Block is registered and working with the new system!', 'embedpress')
                    )
                );
            },
            
            // Save function returns null for dynamic blocks
            save: function() {
                return null;
            }
        });

        console.log('EmbedPress block (new system) - Registered successfully');
    } else {
        console.log('EmbedPress block (new system) - Block is disabled in settings');
    }
} else {
    console.error('EmbedPress block (new system) - WordPress blocks API not available');
}
