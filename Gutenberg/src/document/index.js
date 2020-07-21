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
import {DocumentIcon} from '../common/icons';

const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks


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
registerBlockType('embedpress/document', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('Document'), // Block title.
	icon: DocumentIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'embedpress', // Block category — Group blocks together based on common traits E.g. common, formatting, layout Widgets, embed.
	keywords: [
		__('embedpress'),
		__('pdf'),
		__('doc'),
		__('ppt'),
	],
	supports: {
		align: true,
		lightBlockWrapper: true,
	},
	attributes: {
		id: {
			type: "string"
		},
		href: {
			type: "string"
		},
		powered_by: {
			type: "boolean",
			default: true,
		},
		width: {
			type: 'number',
			default: 600,
		},
		height: {
			type: 'number',
			default: 600,
		},
		fileName: {
			type: "string",
		},
		mime: {
			type: "string",
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
	//save
	save: function (props) {
		const {href, mime, id, width, height, powered_by} = props.attributes
		const iframeSrc = '//view.officeapps.live.com/op/embed.aspx?src='+href;
		const defaultClass = "embedpress-embed-document"
		return (
			<figure className={defaultClass}>
				{mime === 'application/pdf' && (
					<div style={{height: height, width: width}} className={'embedpress-embed-document-pdf' + ' ' + id}
						 data-emid={id} data-emsrc={href}></div>
				)}
				{mime !== 'application/pdf' && (
					<iframe style={{height: height, width: width}} src={iframeSrc} mozallowfullscreen="true"
							webkitallowfullscreen="true"/>
				)}
				{powered_by && (
					<p className="embedpress-el-powered">Powered By EmbedPress</p>
				)}
			</figure>
		);
	},

});
