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
import { embedpressConditionalRegisterBlockType } from "../../EmbedPress/src/components/conditional-register.js";

/**
 * Import styles - commented out to avoid Vite processing issues
 * Styles are handled separately through the build process
 */
// import "./style.scss";
import { PdfIcon } from "../../GlobalCoponents/icons.js";

embedpressConditionalRegisterBlockType(metadata, {
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
}, 'embedpress-pdf');
