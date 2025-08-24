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
import { embedpressConditionalRegisterBlockType } from "./components/conditional-register";


import { init as instafeedInit } from "./components/InspectorControl/instafeed";
import { init as openseaInit } from "./components/InspectorControl/opensea";
import { init as calendlyInit } from "./components/InspectorControl/calendly";
import { init as youtubeInit } from "./components/InspectorControl/youtube";
import { init as wistiaInit } from "./components/InspectorControl/wistia";
import { init as vimeoInit } from "./components/InspectorControl/vimeo";
import { init as spreakerInit } from "./components/InspectorControl/spreaker";
import { init as googlePhotos } from "./components/InspectorControl/google-photos";

/**
 * Import styles - commented out to avoid Vite processing issues
 * Styles are handled separately through the build process
 */
// import "./style.scss";
import { EPIcon } from "../../GlobalCoponents/icons.js";


console.log("This is outside of the function");

embedpressConditionalRegisterBlockType(metadata, {
    icon: EPIcon,
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
}, 'embedpress');

instafeedInit();
youtubeInit();
openseaInit();
wistiaInit();
vimeoInit();
calendlyInit();
spreakerInit();
googlePhotos();