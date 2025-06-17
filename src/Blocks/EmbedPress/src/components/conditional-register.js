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

    if (isBlockEnabled) {
        registerBlockType(metadata.name, {
            ...metadata,
            ...settings,
        });
    }
};
