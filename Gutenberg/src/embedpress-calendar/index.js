/**
 * BLOCK: embedpress-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import edit from './edit';
import {CalendarIcon} from '../common/icons';


const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks

if (embedpressObj && embedpressObj.active_blocks && embedpressObj.active_blocks['embedpress-calendar']) {
	registerBlockType('embedpress/embedpress-calendar', {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __('Google Calendar'), // Block title.
		icon: CalendarIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
		category: 'embedpress', // Block category — Group blocks together based on common traits E.g. common, formatting, layout Widgets, embed.
		keywords: [
			'embedpress',
			'embed',
			'calendar',
			'calender',
			'google',
			'cal',
			'events',
			'task',
			'birthday',
		],
		supports: {
			align: ["left", "center", "right"],
			default: 'center',
			lightBlockWrapper: true
		},
		attributes: {
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
				default: parseInt(embedpressObj?.iframe_width) || 600,
			},
			height: {
				type: 'string',
				default: parseInt(embedpressObj?.iframe_height) || 600,
			},
			url: {
				type: 'string',
				default: ''
			},
			embedHTML: {
				type: 'string',
				default: ''
			},
		},
		edit,
		save: function (props) {
			return null;
		},


	});
}
