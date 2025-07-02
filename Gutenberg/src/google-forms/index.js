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
import {googleFormsIcon} from '../common/icons';

const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks
if (embedpressGutenbergData && embedpressGutenbergData.active_blocks && embedpressGutenbergData.active_blocks['google-forms-block']) {
	registerBlockType('embedpress/google-forms-block', {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __('Google Forms'), // Block title.
		icon: googleFormsIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
		category: 'embedpress', // Block category — Group blocks together based on common traits E.g. common, formatting, layout Widgets, embed.
		keywords: [
			__('embedpress'),
			__('google'),
			__('forms'),
		],
		supports: {
			align: ["wide", "full", "right", "left"],
			default: ''
		},
		attributes: {
			url: {
				type: 'string',
				default: ''
			},
			iframeSrc: {
				type: 'string',
				default: ''
			}
		},
		/**
		 * The edit function describes the structure of your block in the context of the editor.
		 * This represents what the editor will render when the block is used.
		 *
		 * The "edit" property must be a valid function.
		 *
		 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
		 */
		edit,

		/**
		 * The save function defines the way in which the different attributes should be combined
		 * into the final markup, which is then serialized by Gutenberg into post_content.
		 *
		 * The "save" property must be specified and must be a valid function.
		 *
		 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
		 */
		save: function (props) {
			const {iframeSrc} = props.attributes
			const defaultClass = 'ose-google-docs-forms'
			return (
				<figure
					className={defaultClass}>
					<iframe
						src={iframeSrc}
						frameborder="0"
						width="600"
						height="450"
						allowfullscreen="true"
						mozallowfullscreen="true"
						webkitallowfullscreen="true"></iframe>
				</figure>
			);
		},
	});
}
