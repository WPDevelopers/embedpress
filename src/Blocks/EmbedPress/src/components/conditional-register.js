/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Conditionally register block type based on EmbedPress settings
 */
export const embedpressConditionalRegisterBlockType = (metadata, settings) => {
    

    // Check if block is enabled in settings
    const isBlockEnabled = typeof embedpressObj !== 'undefined' &&
                          embedpressObj &&
                          embedpressObj.active_blocks &&
                          embedpressObj.active_blocks.embedpress;

    // Fallback: if embedpressObj is not available, register the block anyway
    // This ensures the block works even if there are localization issues
    // Also register if embedpressObj exists but active_blocks is undefined/empty
    const shouldRegister = isBlockEnabled ||
                          typeof embedpressObj === 'undefined' ||
                          (typeof embedpressObj !== 'undefined' && !embedpressObj.active_blocks);

    if (shouldRegister) {
        registerBlockType(metadata.name, {
            ...metadata,
            ...settings,
        });
    } else {
        console.warn('EmbedPress: Block not registered - disabled in settings', metadata.name);
    }
};
