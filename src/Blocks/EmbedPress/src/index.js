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
import { embedpressConditionalRegisterBlockType } from "./components/conditional-register";
import deprecated from "./components/deprecated";


import { init as instafeedInit } from "./components/InspectorControl/instafeed";
import { init as openseaInit } from "./components/InspectorControl/opensea";
import { init as calendlyInit } from "./components/InspectorControl/calendly";
import { init as youtubeInit } from "./components/InspectorControl/youtube";
import { init as wistiaInit } from "./components/InspectorControl/wistia";
import { init as vimeoInit } from "./components/InspectorControl/vimeo";
import { init as spreakerInit } from "./components/InspectorControl/spreaker";
import { init as googlePhotos } from "./components/InspectorControl/google-photos";
import { init as meetupInit } from "./components/InspectorControl/meetup";
import { init as twitchInit } from "./components/InspectorControl/twitch";
// Custom Player Pro REST hook (#81243) — pipes Pro player attrs through
// embedpress_block_rest_param so the embed fetch sees them.
import { init as customPlayerRestInit } from "./components/InspectorControl/custom-player-rest";
// Replaces the Pro plugin's legacy SelectControl preset picker with a
// named visual picker — works without rebuilding the Pro Gutenberg dist.
import { init as presetPickerInit } from "./components/InspectorControl/preset-picker-filter";

/**
 * Import styles - commented out to avoid Vite processing issues
 * Styles are handled separately through the build process
 */
// import "./style.scss";
import { EPIcon } from "../../GlobalCoponents/icons.js";


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
    deprecated,
}, 'embedpress');

instafeedInit();
youtubeInit();
openseaInit();
wistiaInit();
vimeoInit();
calendlyInit();
spreakerInit();
twitchInit();
googlePhotos();
meetupInit();
customPlayerRestInit();
presetPickerInit();