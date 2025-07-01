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
import { PdfIcon } from "../../GlobalCoponents/icons.js";

// Check if the PDF block is enabled - use a safer approach
let shouldRegister = false;


console.log({ shouldRegister, embedpressObj });

if (embedpressObj && embedpressObj.active_blocks && embedpressObj.active_blocks['embedpress-pdf']) {
    shouldRegister = true;
}

if (shouldRegister) {
    registerBlockType(metadata.name, {
        ...metadata,
        icon: PdfIcon,
        attributes,
        keywords: [
            __("embedpress", "embedpress"),
            __("pdf", "embedpress"),
            __("doc", "embedpress"),
            __("document", "embedpress"),
        ],
        edit: Edit,
        save: Save,
    });
}
