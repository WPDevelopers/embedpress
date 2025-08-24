/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";
// const { registerBlockType } = wp.blocks;

/**
 * Conditionally register block type based on EmbedPress settings
 */
export const embedpressConditionalRegisterBlockType = (metadata, settings) => {


    // Check if block is enabled in settings
    const isBlockEnabled = typeof embedpressGutenbergData !== 'undefined' &&
        embedpressGutenbergData &&
        embedpressGutenbergData.activeBlocks &&
        embedpressGutenbergData.activeBlocks.embedpress;

    // Fallback: if embedpressGutenbergData is not available, register the block anyway
    // This ensures the block works even if there are localization issues
    // Also register if embedpressGutenbergData exists but activeBlocks is undefined/empty
    const shouldRegister = isBlockEnabled ||
        typeof embedpressGutenbergData === 'undefined' ||
        (typeof embedpressGutenbergData !== 'undefined' && !embedpressGutenbergData.activeBlocks);

    console.log({ namespace: metadata.name, isBlockEnabled, shouldRegister, embedpressGutenbergData, registerBlockType });
    console.log('shouldRegister', shouldRegister); 

    if (shouldRegister) {

        console.log('Registering block', metadata.name);

        registerBlockType(metadata.name, {
            ...metadata,
            ...settings,
        });
    } else {
        console.warn('EmbedPress: Block not registered - disabled in settings', metadata.name);
    }
};
