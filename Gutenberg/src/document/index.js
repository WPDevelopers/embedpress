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
			align: ["wide", "full", "right", "left"],
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
			const {
				href,
				mime,
				id,
				width,
				height,
				powered_by
			} = props.attributes
			function get_cta_markup(){
				let d = embedpressObj.document_cta;
				if(embedpressObj.embedpress_pro && d) {
					if (!d.logo_url) {
						return null;
					}
					let cta = '';
					let url = d.cta_url ? d.cta_url : null;
					let x = d.logo_xpos ? d.logo_xpos + '%' : '10%';
					let y = d.logo_ypos ? d.logo_ypos + '%' : '10%';
					let opacity = d.logo_opacity ? d.logo_opacity / 100 : '10%';
					let cssClass = '.ep-doc-' + Math.floor(100 + Math.random() * 900);
					let style  = `
		<style type="text/css">
            ${cssClass}{
                text-align: left;
                position: relative;
            }
           ${cssClass} .watermark {
                border: 0;
                position: absolute;
                bottom: ${y};
                right:  ${x};
                max-width: 150px;
                max-height: 75px;
                opacity: ${opacity};
                z-index: 5;
                -o-transition: opacity 0.5s ease-in-out;
                -moz-transition: opacity 0.5s ease-in-out;
                -webkit-transition: opacity 0.5s ease-in-out;
                transition: opacity 0.5s ease-in-out;
            }
            ${cssClass} .watermark:hover {
					   opacity: 1;
				   }
        </style>
		`;
					if (url && '' !== url){
						cta += `<a href="${url}">`;
					}
					cta += `<img class="watermark" alt="" src="${d.logo_url}"/>`;

					if (url && '' !== url){
						cta += `</a>`;
					}
					return style + cta;
				}
				return null;
			}
			const cta = get_cta_markup();

			const iframeSrc = '//view.officeapps.live.com/op/embed.aspx?src=' + href;
			const defaultClass = "embedpress-embed-document"
			return (
				<figure
					className={defaultClass}>
					{mime === 'application/pdf' && (
						<div
							style={{
								height: height,
								width: width
							}}
							className={'embedpress-embed-document-pdf' + ' ' + id}
							data-emid={id}
							data-emsrc={href}></div>
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
					<div dangerouslySetInnerHTML={{
						__html: cta
					}}></div>
				</figure>
			);
		},


	});
}
