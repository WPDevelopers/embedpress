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
};

export default attributes;
