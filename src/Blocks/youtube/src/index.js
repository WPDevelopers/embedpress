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

/**
 * Import styles - commented out to avoid Vite processing issues
 * Styles are handled separately through the build process
 */
// import "./style.scss";
import { youtubeIcon } from "../../GlobalCoponents/icons.js";

embedpressConditionalRegisterBlockType(metadata, {
    icon: youtubeIcon,
    attributes,
    keywords: [
        __("embedpress", "embedpress"),
        __("youtube", "embedpress"),
        __("video", "embedpress"),
        __("embed", "embedpress"),
    ],
    edit: Edit,
    save: Save,
}, 'youtube-block');
