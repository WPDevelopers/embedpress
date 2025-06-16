/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Save from "./src/components/save.jsx";
import Edit from "./src/components/edit.jsx";
import deprecated from "./src/components/deprecated.jsx";
import example from "./src/example";
import metadata from "./block.json";
import attributes from "./src/components/attributes";
// import { ReactComponent as Icon } from "./src/icon.svg";

/**
 * Import styles
 */
import "./src/style.scss";

// Check if WordPress functions are available and block is enabled
if (typeof wp !== 'undefined' && wp.blocks && wp.blocks.registerBlockType) {
    // Check if block is enabled in settings
    const isBlockEnabled = typeof embedpressObj !== 'undefined' &&
                          embedpressObj &&
                          embedpressObj.active_blocks &&
                          embedpressObj.active_blocks.embedpress;

    if (isBlockEnabled) {
        wp.blocks.registerBlockType(metadata.name, {
            ...metadata,
            icon: 'embed-generic',
            attributes,
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
            edit: Edit,
            save: Save,
            example: example,
            deprecated,
        });

        console.log('EmbedPress block registered successfully with Essential Blocks structure');
    } else {
        console.log('EmbedPress block is disabled in settings');
    }
} else {
    console.error('WordPress blocks API not available');
}
