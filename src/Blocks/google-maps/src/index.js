/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Save from "./components/save.js";
import Edit from "./components/edit.js";
import metadata from "../block.json";
import attributes from "./components/attributes";
import { registerBlockType } from "@wordpress/blocks";

/**
 * Import styles - commented out to avoid Vite processing issues
 * Styles are handled separately through the build process
 */
// import "./style.scss";
import { googleMapsIcon } from "../../GlobalCoponents/icons.js";

// Check if the Google Maps block is enabled - use a safer approach
let shouldRegister = false;

if (embedpressGutenbergData && embedpressGutenbergData.activeBlocks && embedpressGutenbergData.activeBlocks['google-maps']) {
    shouldRegister = true;
}

if (shouldRegister) {
    registerBlockType(metadata.name, {
        ...metadata,
        icon: googleMapsIcon,
        attributes,
        keywords: [
            __("embedpress", "embedpress"),
            __("google", "embedpress"),
            __("maps", "embedpress"),
            __("location", "embedpress"),
        ],
        edit: Edit,
        save: Save,
    });
}
