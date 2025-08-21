/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Check if a block is enabled in EmbedPress settings
 */
export const isBlockEnabled = (blockKey) => {
    // Check if embedpressGutenbergData is available
    if (typeof embedpressGutenbergData === 'undefined') {
        console.log('EmbedPress: embedpressGutenbergData not available, registering block by default:', blockKey);
        return true; // Register by default if data is not available
    }

    // Check if activeBlocks is available
    if (!embedpressGutenbergData.activeBlocks) {
        console.log('EmbedPress: activeBlocks not available, registering block by default:', blockKey);
        return true; // Register by default if activeBlocks is not available
    }

    // Check if the specific block is enabled
    const enabled = !!embedpressGutenbergData.activeBlocks[blockKey];
    console.log('EmbedPress: Block enabled check:', blockKey, enabled);
    return enabled;
};

/**
 * Conditionally register block type based on EmbedPress settings
 */
export const embedpressConditionalRegisterBlockType = (metadata, settings, blockKey = null) => {
    console.log("EmbedPress: Conditional block registration for:", metadata.name);

    // Use the block key from parameter or extract from metadata name
    const settingsKey = blockKey || metadata.name.replace('embedpress/', '');

    const shouldRegister = isBlockEnabled(settingsKey);

    console.log('EmbedPress: Registration decision:', {
        blockName: metadata.name,
        settingsKey,
        shouldRegister,
        embedpressGutenbergData: typeof embedpressGutenbergData !== 'undefined' ? embedpressGutenbergData : 'undefined'
    });

    if (shouldRegister) {
        registerBlockType(metadata.name, {
            ...metadata,
            ...settings,
        });
        console.log('EmbedPress: Block registered successfully:', metadata.name);
    } else {
        console.warn('EmbedPress: Block not registered - disabled in settings:', metadata.name);
    }
};
