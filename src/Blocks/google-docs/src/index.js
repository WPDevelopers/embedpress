/**
 * BLOCK: google-docs-block
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
import {googleDocsIcon} from '../../GlobalCoponents/icons';

const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks

if (embedpressObj && embedpressObj.active_blocks && embedpressObj.active_blocks['google-docs-block']) {
	registerBlockType('embedpress/google-docs-block', {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __('Google Docs'), // Block title.
		icon: googleDocsIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
		category: 'embedpress', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
		keywords: [
			__('embedpress'),
			__('google'),
			__('docs'),
		],
		supports: {
			align: ["wide", "full", "right", "left"],
			default: ''
		},
		attributes,
		edit,
		save,
		deprecated: [
			{
				attributes: {
					align: {
						type: "string",
						enum: ["left", "center", "right", "wide", "full"]
					},
				},

				save: function (props) {
					const {iframeSrc} = props.attributes
					if (iframeSrc) {
						return (
							<div
								className="ose-google-docs-document">

								<iframe
									src={iframeSrc}
									frameBorder="0"
									width="600"
									height="450"
									allowFullScreen="true"
									mozallowfullscreen="true"
									webkitallowfullscreen="true"></iframe>

							</div>

						);
					}
				},
			}
		]
	});
}
