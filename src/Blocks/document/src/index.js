/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Edit from "./components/edit.js";
import metadata from "../block.json";
import attributes from "./components/attributes";
import example from "./example";
import { registerBlockType } from "@wordpress/blocks";

/**
 * Import styles - commented out to avoid Vite processing issues
 * Styles are handled separately through the build process
 */
// import "./style.scss";
import { DocumentIcon } from "../../GlobalCoponents/icons.js";
import Save from "./components/save.js";

// Check if the Document block is enabled - use a safer approach
let shouldRegister = false;

if (embedpressObj && embedpressObj.active_blocks && embedpressObj.active_blocks.document) {
    shouldRegister = true;
}

if (shouldRegister) {
    registerBlockType(metadata.name, {
        ...metadata,
        icon: DocumentIcon,
        attributes,
        example,
        keywords: [
            __("embedpress", "embedpress"),
            __("document", "embedpress"),
            __("pdf", "embedpress"),
            __("doc", "embedpress"),
            __("ppt", "embedpress"),
            __("xls", "embedpress"),
        ],
        edit: Edit,
        save: Save,
    });
}
