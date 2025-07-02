/**
 * BLOCK: google-maps-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import edit from './components/edit';
import save from './components/save';
import attributes from './components/attributes';
import {googleMapsIcon} from '../../GlobalCoponents/icons';

const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks

if (embedpressGutenbergData && embedpressGutenbergData.active_blocks && embedpressGutenbergData.active_blocks['google-maps-block']) {
	registerBlockType('embedpress/google-maps-block', {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __('Google Maps'), // Block title.
		icon: googleMapsIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
		category: 'embedpress', // Block category — Group blocks together based on common traits E.g. common, formatting, layout Widgets, embed.
		keywords: [
			__('embedpress'),
			__('google'),
			__('maps'),
		],
		supports: {
			align: ["wide", "full", "right", "left"],
			default: ''
		},
		attributes,
		edit,
		save,
	});
}
