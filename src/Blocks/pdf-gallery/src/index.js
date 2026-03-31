/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import Save from "./components/save.js";
import Edit from "./components/edit.js";
import metadata from "../block.json";
import attributes from "./components/attributes";
import { embedpressConditionalRegisterBlockType } from "../../EmbedPress/src/components/conditional-register.js";
import { PdfGalleryIcon } from "../../GlobalCoponents/icons.js";

embedpressConditionalRegisterBlockType(metadata, {
    icon: PdfGalleryIcon,
    attributes,
    keywords: [
        __("embedpress", "embedpress"),
        __("pdf gallery", "embedpress"),
        __("pdf", "embedpress"),
        __("gallery", "embedpress"),
    ],
    edit: Edit,
    save: Save,
}, 'pdf-gallery');
