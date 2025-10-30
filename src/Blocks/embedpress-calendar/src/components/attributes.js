const attributes = {
	id: {
		type: "string"
	},
	powered_by: {
		type: "boolean",
		default: typeof embedpressGutenbergData !== 'undefined' && typeof embedpressGutenbergData.poweredBy !== 'undefined' ? embedpressGutenbergData.poweredBy : true,
	},
	is_public: {
		type: "boolean",
		default: true,
	},
	width: {
		type: 'string',
		default: (embedpressGutenbergData?.iframe_width) || '600',
	},
	height: {
		type: 'string',
		default: (embedpressGutenbergData?.iframe_height) || '600',
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
};

export default attributes;
