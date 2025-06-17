/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Conditionally register block type based on EmbedPress settings
 */
export const embedpressConditionalRegisterBlockType = (metadata, settings) => {
    // Debug logging
    console.log('EmbedPress: Attempting to register block', metadata.name);
    console.log('EmbedPress: embedpressObj available:', typeof embedpressObj !== 'undefined');

    if (typeof embedpressObj !== 'undefined') {
        console.log('EmbedPress: embedpressObj:', embedpressObj);
        console.log('EmbedPress: active_blocks:', embedpressObj.active_blocks);
    }

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

    console.log('EmbedPress: Block enabled in settings:', isBlockEnabled);
    console.log('EmbedPress: Should register block:', shouldRegister);

    if (shouldRegister) {
        console.log('EmbedPress: Registering block', metadata.name);
        registerBlockType(metadata.name, {
            ...metadata,
            ...settings,
        });
    } else {
        console.warn('EmbedPress: Block not registered - disabled in settings', metadata.name);
    }
};
