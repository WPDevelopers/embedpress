const attributes = {
	id: {
		type: "string"
	},
	powered_by: {
		type: "boolean",
		default: true,
	},
	is_public: {
		type: "boolean",
		default: true,
	},
	width: {
		type: 'string',
		default: parseInt(embedpressGutenbergData?.iframe_width) || 600,
	},
	height: {
		type: 'string',
		default: parseInt(embedpressGutenbergData?.iframe_height) || 600,
	},
	url: {
		type: 'string',
		default: ''
	},
	embedHTML: {
		type: 'string',
		default: ''
	},
	interactive: {
		type: 'boolean',
		default: false
	},
};

export default attributes;
