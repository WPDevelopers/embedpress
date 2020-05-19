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
import { wistiaIcon } from '../common/icons';
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('embedpress/wistia-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('Wistia'), // Block title.
	icon: wistiaIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'embedpress', // Block category — Group blocks together based on common traits E.g. common, formatting, layout Widgets, embed.
	keywords: [
		__('embedpress'),
		__('wistia'),
	],
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	edit,
	save: function(props) {
		return null;
	},
	deprecated: [{
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
			const { iframeSrc } = props.attributes
			return (
				<div class="ose-wistia">
					<iframe src={iframeSrc}
						allowtransparency="true"
						frameborder="0"
						class="wistia_embed"
						name="wistia_embed"
						width="600" height="330"></iframe>
				</div>
			);
		},
	}]
});
