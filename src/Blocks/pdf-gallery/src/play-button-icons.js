/**
 * Play button icon SVG paths for the PDF Gallery.
 * Used by both edit.js and save.js.
 */

export const PLAY_BUTTON_ICONS = {
    play: {
        label: 'Play',
        viewBox: '0 0 24 24',
        path: 'M8 5v14l11-7z',
    },
    eye: {
        label: 'View / Eye',
        viewBox: '0 0 24 24',
        path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    },
    document: {
        label: 'Document',
        viewBox: '0 0 24 24',
        path: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z',
    },
};

/**
 * Get SVG markup string for a given icon type.
 * Used in save.js for static output.
 */
export function getPlayButtonIconPath(iconType) {
    var icon = PLAY_BUTTON_ICONS[iconType];
    return icon ? icon.path : PLAY_BUTTON_ICONS.play.path;
}

export function getPlayButtonIconViewBox(iconType) {
    var icon = PLAY_BUTTON_ICONS[iconType];
    return icon ? icon.viewBox : PLAY_BUTTON_ICONS.play.viewBox;
}
