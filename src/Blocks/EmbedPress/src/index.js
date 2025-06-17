/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import Save from "./components/save.jsx";
import Edit from "./components/edit.jsx";
import deprecated from "./components/deprecated";
import example from "./example";
import metadata from "../block.json";
import attributes from "./components/attributes";
import { embedpressConditionalRegisterBlockType } from "./components/conditional-register";

import { embedPressIcon as Icon } from "./components/icons.jsx";

/**
 * Import styles
 */
import "./style.scss";

embedpressConditionalRegisterBlockType(metadata, {
    icon: Icon,
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
    example: example,
    deprecated,
});
