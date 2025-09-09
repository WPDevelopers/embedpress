/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import Save from "./components/save.js";
import Edit from "./components/edit.js";
import metadata from "../block.json";
import attributes from "./components/attributes";

/**
 * Import styles - commented out to avoid Vite processing issues
 * Styles are handled separately through the build process
 */
// import "./style.scss";
import { twitchIcon } from "../../GlobalCoponents/icons.js";

// Check if the Twitch block is enabled - use a safer approach
let shouldRegister = false;

if (embedpressGutenbergData && embedpressGutenbergData.activeBlocks && embedpressGutenbergData.activeBlocks['twitch-block']) {
    shouldRegister = true;
}

if (shouldRegister) {
    registerBlockType(metadata.name, {
        ...metadata,
        icon: twitchIcon,
        attributes,
        keywords: [
            __("embedpress", "embedpress"),
            __("twitch", "embedpress"),
            __("stream", "embedpress"),
            __("gaming", "embedpress"),
        ],
        edit: Edit,
        save: Save,
    });
}
