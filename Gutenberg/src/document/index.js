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
import { DocumentIcon, epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../common/icons';
import Logo
	from "../common/Logo";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

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
			},
			powered_by: {
				type: "boolean",
				default: true,
			},

			presentation: {
				type: "boolean",
				default: true,
			},
			themeMode: {
				type: "string",
				default: 'default',
			},
			customColor: {
				type: "string",
				default: '#403A81',
			},
			position: {
				type: "string",
				default: 'top',
			},

			download: {
				type: "boolean",
				default: true,
			},
			open: {
				type: "boolean",
				default: false,
			},
			copy_text: {
				type: "boolean",
				default: true,
			},
			draw: {
				type: "boolean",
				default: true,
			},
			toolbar: {
				type: "boolean",
				default: true,
			},
			doc_rotation: {
				type: 'boolean',
				default: true,
			},

		},
		edit,
		save: function (props) {
			const {
				href,
				mime,
				id,
				width,
				height,
				powered_by,
				themeMode, customColor, presentation, position, download, draw, toolbar, doc_rotation
			} = props.attributes

			// const iframeSrc = '//view.officeapps.live.com/op/embed.aspx?src=' + href;
			const iframeSrc = '//view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Ffile-examples.com%2Fstorage%2Ffe59cbbb63645c19f9c3014%2F2017%2F02%2Ffile-sample_100kB.doc';
			return (
				<div className={'embedpress-document-embed ep-doc-' + id} style={{ height: height, width: width }}>
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
						<div className='ep-file-download-option-masked ep-gutenberg-file-doc ep-powered-by-enabled'>
							<iframe
								style={{
									height: height,
									width: width
								}}
								src={iframeSrc}
								mozallowfullscreen="true"
								webkitallowfullscreen="true" />
							{
								draw && (
									<canvas class="ep-doc-canvas" width="" height="" ></canvas>
								)
							}

							{
								toolbar && (
									<div class="ep-external-doc-icons ">
										{epGetPopupIcon()}
										{download && (epGetPrintIcon())}
										{download && (epGetDownloadIcon())}
										{draw && (epGetDrawIcon())}
										{presentation && (epGetFullscreenIcon())}
										{presentation && (epGetMinimizeIcon())}
									</div>
								)
							}
						</div>
					)}
					{powered_by && (
						<p className="embedpress-el-powered">Powered
							By
							EmbedPress</p>
					)}
					{embedpressObj.embedpress_pro && <Logo id={id} />}

				</div>
			);
		},


	});
}
