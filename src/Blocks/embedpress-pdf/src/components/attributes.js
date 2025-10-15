/**
 * EmbedPress PDF Block Attributes
 *
 * Defines all the attributes for the EmbedPress PDF block
 */

console.log('embedpressGutenbergData', embedpressGutenbergData.iframe_width);

const attributes = {
    // Core attributes
    id: {
        type: "string"
    },
    clientId: {
        type: 'string',
    },
    href: {
        type: "string"
    },
    fileName: {
        type: "string",
    },
    mime: {
        type: "string",
    },
    powered_by: {
        type: "boolean",
        default: typeof embedpressGutenbergData !== 'undefined' && typeof embedpressGutenbergData.poweredBy !== 'undefined' ? embedpressGutenbergData.poweredBy : true,
    },

    // PDF Viewer Settings
    presentation: {
        type: "boolean",
        default: true,
    },
    lazyLoad: {
        type: "boolean",
        default: false,
    },
    themeMode: {
        type: "string",
        default: 'default',
    },
    customColor: {
        type: "string",
        default: '#403A81',
    },
    position: {
        type: "string",
        default: 'top',
    },
    flipbook_toolbar_position: {
        type: "string",
        default: 'bottom',
    },

    // Toolbar Controls
    download: {
        type: "boolean",
        default: true,
    },
    open: {
        type: "boolean",
        default: false,
    },
    copy_text: {
        type: "boolean",
        default: true,
    },
    add_text: {
        type: "boolean",
        default: true,
    },
    draw: {
        type: "boolean",
        default: true,
    },
    add_image: {
        type: "boolean",
        default: true,
    },
    selection_tool: {
        type: "string",
        default: '0',
    },
    scrolling: {
        type: "string",
        default: '0',
    },
    spreads: {
        type: "string",
        default: '0',
    },
    toolbar: {
        type: "boolean",
        default: true,
    },
    doc_details: {
        type: "boolean",
        default: true,
    },
    doc_rotation: {
        type: 'boolean',
        default: true,
    },

    // Dimensions
    unitoption: {
        type: 'string',
        default: '%',
    },
    width: {
        type: 'string',
        default: (embedpressGutenbergData?.iframe_width) || '600',
    },
    height: {
        type: 'string',
        default: (embedpressGutenbergData?.iframe_height) || '600',
    },

    // Viewer Style
    viewerStyle: {
        type: "string",
        default: 'modern',
    },
    zoomIn: {
        type: "boolean",
        default: true,
    },
    zoomOut: {
        type: "boolean",
        default: true,
    },
    fitView: {
        type: "boolean",
        default: true,
    },
    bookmark: {
        type: "boolean",
        default: true,
    },


    // Custom Branding
    customlogo: {
        type: 'string',
        default: ''
    },
    logoX: {
        type: 'number',
        default: 5
    },
    logoY: {
        type: 'number',
        default: 10
    },
    customlogoUrl: {
        type: 'string',
    },
    logoOpacity: {
        type: 'number',
        default: 0.6
    },

    // Social Share
    contentShare: {
        type: 'boolean',
        default: false
    },
    sharePosition: {
        type: 'string',
        default: 'right'
    },
    customTitle: {
        type: 'string',
        default: ''
    },
    customDescription: {
        type: 'string',
        default: ''
    },
    customThumbnail: {
        type: 'string',
        default: ''
    },
    shareFacebook: {
        type: 'boolean',
        default: true
    },
    shareTwitter: {
        type: 'boolean',
        default: true
    },
    sharePinterest: {
        type: 'boolean',
        default: true
    },
    shareLinkedin: {
        type: 'boolean',
        default: true
    },

    // Ad Manager attributes
    adManager: {
        type: 'boolean',
        default: false
    },
    adSource: {
        type: 'string',
        default: 'video'
    },
    adContent: {
        type: 'object',
    },
    adFileUrl: {
        type: 'string',
        default: ''
    },
    adWidth: {
        type: 'string',
        default: '300'
    },
    adHeight: {
        type: 'string',
        default: '200'
    },
    adXPosition: {
        type: 'number',
        default: 25
    },
    adYPosition: {
        type: 'number',
        default: 10
    },
    adUrl: {
        type: 'string',
        default: ''
    },
    adStart: {
        type: 'string',
        default: '10'
    },
    adSkipButton: {
        type: 'boolean',
        default: true
    },
    adSkipButtonAfter: {
        type: 'string',
        default: '5'
    },

    // Content Protection
    lockContent: {
        type: 'boolean',
        default: false
    },
    protectionType: {
        type: 'string',
        default: 'password'
    },
    userRole: {
        type: 'array',
        default: []
    },
    protectionMessage: {
        type: 'string',
        default: 'You do not have access to this content. Only users with the following roles can view it: [user_roles]'
    },
    contentPassword: {
        type: 'string',
        default: ''
    },
    lockHeading: {
        type: 'string',
        default: 'Content Locked'
    },
    lockSubHeading: {
        type: 'string',
        default: 'Content is locked and requires password to access it.'
    },
    lockErrorMessage: {
        type: 'string',
        default: 'Oops, that wasn\'t the right password. Try again.'
    },
    passwordPlaceholder: {
        type: 'string',
        default: 'Password'
    },
    submitButtonText: {
        type: 'string',
        default: 'Unlock'
    },
    submitUnlockingText: {
        type: 'string',
        default: 'Unlocking'
    },
    enableFooterMessage: {
        type: 'boolean',
        default: false
    },
    footerMessage: {
        type: 'string',
        default: 'In case you don\'t have the password, kindly reach out to content owner or administrator to request access.'
    },

};

export default attributes;
