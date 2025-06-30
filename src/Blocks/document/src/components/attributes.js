const attributes = {
	id: {
		type: "string"
	},
	href: {
		type: "string"
	},
	width: {
		type: 'number',
		default: parseInt(embedpressObj.iframe_width) || 600,
	},
	height: {
		type: 'number',
		default: parseInt(embedpressObj.iframe_height) || 600,
	},
	fileName: {
		type: "string",
	},
	mime: {
		type: "string",
	},
	powered_by: {
		type: "boolean",
		default: true,
	},
	presentation: {
		type: "boolean",
		default: true,
	},
	docViewer: {
		type: "string",
		default: 'custom',
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
	draw: {
		type: "boolean",
		default: true,
	},
	toolbar: {
		type: "boolean",
		default: true,
	},
	doc_rotation: {
		type: 'boolean',
		default: true,
	},
};

export default attributes;
