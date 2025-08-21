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
import { embedpressConditionalRegisterBlockType } from "../../EmbedPress/src/components/conditional-register.js";

/**
 * Import styles - commented out to avoid Vite processing issues
 * Styles are handled separately through the build process
 */
// import "./style.scss";
import { DocumentIcon } from "../../GlobalCoponents/icons.js";
import Save from "./components/save.js";

embedpressConditionalRegisterBlockType(metadata, {
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
}, 'document');
