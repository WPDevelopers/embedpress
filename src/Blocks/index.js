/**
 * EmbedPress Gutenberg Blocks Entry Point
 *
 * This file registers all EmbedPress blocks and shared components.
 */

// Import WordPress dependencies
const { __ } = wp.i18n;


import { EPIcon } from './GlobalCoponents/icons.js';

// Register block category
if (wp.blocks && wp.blocks.registerBlockCollection) {
    wp.blocks.registerBlockCollection('embedpress', {
        title: __('EmbedPress', 'embedpress'),
        icon: EPIcon,
    });
}

// Import and register all blocks
import './EmbedPress/src/index.js';
import './document/src/index.js';
import './embedpress-calendar/src/index.js';
import './embedpress-pdf/src/index.js';
import './google-docs/src/index.js';
import './google-drawings/src/index.js';
import './google-forms/src/index.js';
import './google-maps/src/index.js';
import './google-sheets/src/index.js';
import './google-slides/src/index.js';
import './twitch/src/index.js';
import './wistia/src/index.js';
import './youtube/src/index.js';

// Export shared components for use by individual blocks
export { EPIcon } from './GlobalCoponents/icons.js';
export { default as EPSelectControl } from './GlobalCoponents/EPSelectControl.js';
export { default as Iframe } from './GlobalCoponents/Iframe.js';
export { default as Logo } from './GlobalCoponents/Logo.js';
export { default as AdsControl } from './GlobalCoponents/ads-control.js';
export { default as AdsTemplate } from './GlobalCoponents/ads-template.js';
export { default as ControlHeading } from './GlobalCoponents/control-heading.js';
export { common as CoreEmbedsCommon, others as CoreEmbedsOthers } from './GlobalCoponents/core-embeds.js';
export { default as CustomPlayerControls } from './GlobalCoponents/custom-player-controls.js';
export { default as CustomBranding } from './GlobalCoponents/custombranding.js';
export { default as CustomThumbnail } from './GlobalCoponents/customthumbnail.js';
export { default as EmbedControls } from './GlobalCoponents/embed-controls.js';
export { default as EmbedLoading } from './GlobalCoponents/embed-loading.js';
export { default as EmbedPlaceholder } from './GlobalCoponents/embed-placeholder.js';
export { default as EmbedWrap } from './GlobalCoponents/embed-wrap.js';
export * as Helper from './GlobalCoponents/helper.js';
export { default as LockControl } from './GlobalCoponents/lock-control.js';
export { default as Skeleton } from './GlobalCoponents/skeleton.js';
export { default as SkeletonLoading } from './GlobalCoponents/skeletone-loading.js';
export { default as SocialShareControl } from './GlobalCoponents/social-share-control.js';
export { default as SocialShareHtml } from './GlobalCoponents/social-share-html.js';
export { default as Upgrade } from './GlobalCoponents/upgrade.js';


console.log("I that calling");
