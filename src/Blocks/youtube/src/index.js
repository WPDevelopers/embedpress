/**
 * BLOCK: youtube-block
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
import {youtubeIcon} from '../../GlobalCoponents/icons';

const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks

if (embedpressObj && embedpressObj.active_blocks && embedpressObj.active_blocks['youtube-block']) {
	registerBlockType('embedpress/youtube-block', {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __('YouTube'), // Block title.
		icon: youtubeIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
		category: 'embedpress', // Block category — Group blocks together based on common traits E.g. common, formatting, layout Widgets, embed.
		keywords: [
			__('embedpress'),
			__('youtube'),
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
