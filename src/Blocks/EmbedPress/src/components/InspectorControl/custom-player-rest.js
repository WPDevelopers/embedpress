/**
 * Pipe the Pro custom-player attributes (PRD #81243) through the
 * `embedpress_block_rest_param` filter so they ride along with the embed
 * fetch — same pattern Instagram / YouTube / Vimeo / etc. use.
 *
 * Without this, toggling Email Capture / Chapters / Privacy Mode / etc.
 * never reached `/embedpress/v1/oembed/embedpress`, so the editor preview
 * never re-fetched and showed stale embedHTML / data-options. This file
 * is purely additive: it only registers a filter callback, it does not
 * modify edit.js / save.js / helper.js or any other Gutenberg structure.
 */
import { addFilter } from '@wordpress/hooks';

const { useState, useEffect } = wp.element;
const { isShallowEqualObjects } = wp.isShallowEqual;

// Every Pro custom-player attribute we care about routing through REST.
// Listed explicitly (instead of `Object.keys(attributes)`) so we never
// accidentally leak unrelated block state into the embed request.
const PLAYER_FIELDS = [
    'customPlayer',
    'playerPreset',
    'playerColor',
    'posterThumbnail',
    'playerPip',
    'playerRestart',
    'playerRewind',
    'playerFastForward',
    'playerTooltip',
    'playerHideControls',
    'playerDownload',

    // Pro features
    'playerAutoResume', 'playerAutoResumeThreshold',
    'playerEndScreen', 'playerEndScreenMode', 'playerEndScreenMessage',
    'playerEndScreenButtonText', 'playerEndScreenButtonUrl',
    'playerEndScreenRedirectUrl', 'playerEndScreenCountdown',
    'playerEndScreenShowReplay',
    'playerPrivacyMode', 'playerPrivacyMessage',
    'playerTimedCTA', 'playerTimedCTAItems',
    'playerChapters', 'playerChaptersItems', 'playerChaptersShowTitle',
    'playerEmailCapture', 'playerEmailCaptureTime', 'playerEmailCaptureUnit',
    'playerEmailCaptureHeadline', 'playerEmailCaptureRequireName',
    'playerEmailCaptureAllowSkip', 'playerEmailCaptureButtonText',
    'playerActionLock', 'playerActionLockType', 'playerActionLockHeadline',
    'playerActionLockMessage', 'playerActionLockShareNetworks',
    'playerActionLockShareUrl', 'playerActionLockLinkUrl',
    'playerActionLockLinkText', 'playerActionLockBypassAdmins',
    'playerAdaptiveStreaming',
    'playerCountryRestriction', 'playerCountryMode', 'playerCountryList',
    'playerCountryMessage',
    'playerLmsTracking', 'playerLmsThreshold',
    'playerHeatmap',
    'playerCdnEnabled',
];

export const getCustomPlayerParams = (params, attributes) => {
    if (!attributes || !attributes.customPlayer) return params;

    const out = { ...params };
    PLAYER_FIELDS.forEach((key) => {
        const value = attributes[key];
        if (value === undefined || value === null) return;
        // Arrays/objects (chapter items, CTA items, share networks) need to
        // be serialized — REST params are flat key/value pairs.
        out[key] = (typeof value === 'object') ? JSON.stringify(value) : value;
    });
    return out;
};

/**
 * Build a stable signature object of just the custom-player attributes —
 * used as a dependency in edit.js's debounced re-fetch effect so toggling
 * any Pro player option triggers a new oEmbed request and the editor
 * preview matches the front-end render.
 *
 * Mirrors the per-platform hooks (useYoutube, useVimeoVideo, etc.) which
 * use isShallowEqualObjects to debounce identical updates.
 */
export const useCustomPlayer = (attributes) => {
    const buildSig = () => {
        const out = {};
        PLAYER_FIELDS.forEach((key) => {
            const value = attributes[key];
            if (value === undefined || value === null) return;
            out[key] = (typeof value === 'object') ? JSON.stringify(value) : value;
        });
        return out;
    };

    const [sig, setSig] = useState(buildSig());

    useEffect(() => {
        const next = buildSig();
        if (!isShallowEqualObjects(sig || {}, next)) {
            setSig(next);
        }
    }, [attributes]);

    return sig;
};

export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress/custom-player', getCustomPlayerParams, 20);
};
