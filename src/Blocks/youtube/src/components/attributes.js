const attributes = {
	url: {
		type: 'string',
		default: ''
	},
	iframeSrc: {
		type: 'string',
		default: ''
	},
	mediaId: {
		type: 'string',
		default: ''
	},
	// Dimensions
	unitoption: {
		type: 'string',
		default: '%',
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
};

export default attributes;
