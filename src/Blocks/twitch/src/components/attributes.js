const twitchDefaults = typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.twitchSettings
	? embedpressGutenbergData.twitchSettings
	: {};

const attributes = {
	url: {
		type: 'string',
		default: ''
	},
	iframeSrc: {
		type: 'string',
		default: ''
	},
	attrs: {
		type: 'string',
		default: ''
	},
	// Dimensions
	unitoption: {
		type: 'string',
		default: 'px',
	},
	width: {
		type: 'number',
		default: parseInt(embedpressGutenbergData?.iframe_width) || 600,
	},
	height: {
		type: 'number',
		default: parseInt(embedpressGutenbergData?.iframe_height) || 450,
	},
	interactive: {
		type: 'boolean',
		default: false
	},
	enableLazyLoad: {
		type: 'boolean',
		default: typeof embedpressGutenbergData !== 'undefined' && typeof embedpressGutenbergData.lazyLoad !== 'undefined' ? embedpressGutenbergData.lazyLoad : false
	},
	// Twitch Controls
	autoplay: {
		type: 'boolean',
		default: twitchDefaults.autoplay === 'yes',
	},
	twitchMute: {
		type: 'boolean',
		default: twitchDefaults.mute === 'yes',
	},
	twitchTheme: {
		type: 'string',
		default: twitchDefaults.theme || 'dark',
	},
	twitchFullscreen: {
		type: 'boolean',
		default: twitchDefaults.fullscreen !== 'no',
	},
	twitchChat: {
		type: 'boolean',
		default: twitchDefaults.chat === 'yes',
	},
	startTime: {
		type: 'number',
		default: twitchDefaults.startTime || 0,
	},
	customPlayer: {
		type: 'boolean',
		default: false,
	},
	clientId: {
		type: 'string',
		default: '',
	},
};

export default attributes;
