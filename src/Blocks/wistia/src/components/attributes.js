const attributes = {
	url: {
		type: 'string',
		default: ''
	},
	iframeSrc: {
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
		default: 600,
	},
	height: {
		type: 'number',
		default: 450,
	},
	interactive: {
		type: 'boolean',
		default: false
	},
};

export default attributes;
