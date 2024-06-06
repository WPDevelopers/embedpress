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
import { isFileUrl } from '../common/helper';

import Logo from "../common/Logo";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const canUploadMedia = embedpressObj.can_upload_media;


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
				default: parseInt(embedpressObj.iframe_width) || 600,
			},
			height: {
				type: 'number',
				default: parseInt(embedpressObj.iframe_height) || 600,
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
			docViewer: {
				type: "string",
				default: 'custom',
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
				docViewer,
				themeMode, customColor, presentation, position, download, draw, toolbar, doc_rotation
			} = props.attributes

			const { attributes } = props;

			const urlParamsObject = {
				theme_mode: themeMode,
				...(themeMode === 'custom' && { custom_color: customColor ? customColor : '#343434' }),
				presentation: presentation ? presentation : true,
				position: position ? position : 'bottom',
				download: download ? download : true,
				draw: draw ? draw : true,
			}
			const urlParams = new URLSearchParams(urlParamsObject);
			const queryString = urlParams.toString();

			let isDownloadEnabled = ' enabled-file-download';
			if (!download) {
				isDownloadEnabled = '';
			}

			const iframeSrc = '//view.officeapps.live.com/op/embed.aspx?src=' + href // + '?' + queryString;
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
						<div className={`${docViewer === 'custom' ? 'ep-file-download-option-masked ' : ''}ep-gutenberg-file-doc ep-powered-by-enabled ${isDownloadEnabled}`} data-theme-mode={themeMode} data-custom-color={customColor} data-id={id}>
							<iframe
								style={{
									height: height,
									width: width
								}}
								src={iframeSrc}
								mozallowfullscreen="true"
								webkitallowfullscreen="true" />
							{
								draw && docViewer === 'custom' &&  (
									<canvas class="ep-doc-canvas" width={width} height={height} ></canvas>
								)
							}

							{
								toolbar && docViewer === 'custom' &&  (
									<div class="ep-external-doc-icons ">
										{
											!isFileUrl(href) && (
												epGetPopupIcon()
											)
										}
										{(download && isFileUrl(href)) && (epGetPrintIcon())}
										{(download && isFileUrl(href)) && (epGetDownloadIcon())}
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
