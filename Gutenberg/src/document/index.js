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
import Logo
	from "../common/Logo";

const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks

if (embedpressObj && embedpressObj.active_blocks && embedpressObj.active_blocks.document) {
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
			align: ["center", "right", "left"],
			default: ''
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
		edit,
		save: function (props) {
			const {
				href,
				mime,
				id,
				width,
				height,
				powered_by
			} = props.attributes

			const iframeSrc = '//view.officeapps.live.com/op/embed.aspx?src=' + href;
			const pdf_viewer_src = embedpressObj.pdf_renderer + '?file=' + href

			return (
					<div className={'embedpress-document-embed ep-doc-'+id} style={{height:height,width:width, maxWidth:'100%'}}>
					{mime === 'application/pdf' && (
						<iframe style={{height:height,width:width}} className={'embedpress-embed-document-pdf'+' '+id} src={pdf_viewer_src}></iframe>
					)}
					{mime !== 'application/pdf' && (
						<iframe
							style={{
								height: height,
								width: width
							}}
							src={iframeSrc}
							mozallowfullscreen="true"
							webkitallowfullscreen="true"/>
					)}
					{powered_by && (
						<p className="embedpress-el-powered">Powered
							By
							EmbedPress</p>
					)}
					{ embedpressObj.embedpress_pro &&  <Logo id={id}/>}

					</div>
			);
		},


	});
}
