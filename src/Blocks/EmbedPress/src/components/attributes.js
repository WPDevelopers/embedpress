/**
 * EmbedPress Block Attributes
 * 
 * Defines all the attributes for the EmbedPress block
 */

const attributes = {
    // Core attributes
    clientId: {
        type: 'string',
    },
    url: {
        type: 'string',
        default: ''
    },
    embedHTML: {
        type: 'string',
        default: ''
    },
    height: {
        type: 'string',
        default: '600'
    },
    width: {
        type: 'string',
        default: '600'
    },
    
    // State attributes
    editingURL: {
        type: 'boolean',
        default: false
    },
    fetching: {
        type: 'boolean',
        default: false
    },
    cannotEmbed: {
        type: 'boolean',
        default: false
    },
    interactive: {
        type: 'boolean',
        default: false
    },
    align: {
        type: 'string',
        default: 'center'
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

    // Social Sharing
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

    // Custom Player
    customPlayer: {
        type: 'boolean',
        default: false
    },
    playerPreset: {
        type: 'string',
        default: 'preset-default'
    },
    playerColor: {
        type: 'string',
        default: '#5b4e96',
    },
    autoPause: {
        type: 'boolean',
        default: false
    },
    posterThumbnail: {
        type: 'string',
        default: ''
    },

    // YouTube specific attributes
    ispagination: {
        type: 'boolean',
        default: true
    },
    ytChannelLayout: {
        type: 'string',
        default: 'gallery'
    },
    pagesize: {
        type: 'string',
        default: '6'
    },
    columns: {
        type: 'string',
        default: '3'
    },
    gapbetweenvideos: {
        type: 'number',
        default: 30
    },
    videosize: {
        type: 'string',
        default: 'fixed',
    },
    starttime: {
        type: 'string',
    },
    endtime: {
        type: 'string',
    },
    autoplay: {
        type: 'boolean',
        default: false,
    },
    muteVideo: {
        type: 'boolean',
        default: true,
    },
    controls: {
        type: 'string',
    },
    fullscreen: {
        type: 'boolean',
        default: true,
    },
    videoannotations: {
        type: 'boolean',
        default: true,
    },
    progressbarcolor: {
        type: 'string',
        default: 'red'
    },
    closedcaptions: {
        type: 'boolean',
        default: true,
    },
    modestbranding: {
        type: 'string',
    },
    relatedvideos: {
        type: 'boolean',
        default: true,
    },

    // Vimeo specific attributes
    vstarttime: {
        type: 'string',
    },
    vautoplay: {
        type: 'boolean',
        default: false
    },
    vscheme: {
        type: 'string',
    },
    vtitle: {
        type: 'boolean',
        default: true
    },
    vauthor: {
        type: 'boolean',
        default: true
    },
    vavatar: {
        type: 'boolean',
        default: true
    },
    vloop: {
        type: 'boolean',
        default: false
    },
    vautopause: {
        type: 'boolean',
        default: false
    },
    vdnt: {
        type: 'boolean',
        default: false
    },

    // Wistia specific attributes
    wstarttime: {
        type: 'string',
    },
    wautoplay: {
        type: 'boolean',
        default: true
    },
    scheme: {
        type: 'string',
    },
    captions: {
        type: 'boolean',
        default: true
    },
    playbutton: {
        type: 'boolean',
        default: true
    },
    smallplaybutton: {
        type: 'boolean',
        default: true
    },
    playbar: {
        type: 'boolean',
        default: true
    },
    resumable: {
        type: 'boolean',
        default: true
    },
    wistiafocus: {
        type: 'boolean',
        default: true
    },
    volumecontrol: {
        type: 'boolean',
        default: true
    },
    volume: {
        type: 'number',
        default: 100
    },
    rewind: {
        type: 'boolean',
        default: false
    },
    wfullscreen: {
        type: 'boolean',
        default: true
    },
};

export default attributes;
