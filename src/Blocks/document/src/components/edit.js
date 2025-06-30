/**
 * Internal dependencies
 */

import Iframe from '../../../GlobalCoponents/Iframe';
import Logo from '../../../GlobalCoponents/Logo';
import EmbedLoading from '../../../GlobalCoponents/embed-loading';
import { sanitizeUrl, saveSourceData } from '../../../GlobalCoponents/helper';
import { DocumentIcon } from '../../../GlobalCoponents/icons';
import DocStyle from './doc-style';

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { getBlobByURL, isBlobURL, revokeBlobURL } = wp.blob;
const { BlockIcon, MediaPlaceholder, InspectorControls } = wp.blockEditor;
const { useState, useEffect } = wp.element;
const { RangeControl, PanelBody, ExternalLink, ToggleControl, ToolbarButton } = wp.components;
import { epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../../../GlobalCoponents/icons';
import { isFileUrl } from '../../../GlobalCoponents/helper';
import DocControls from './doc-controls';
import { EPIcon, InfoIcon } from '../../../GlobalCoponents/icons';
import Upgrade from '../../../GlobalCoponents/upgrade';
import AdControl from '../../../GlobalCoponents/ads-control';
import AdTemplate from '../../../GlobalCoponents/ads-template';
import LockControl from '../../../GlobalCoponents/lock-control';
import ContentShare from '../../../GlobalCoponents/social-share-control';
import SocialShareHtml from '../../../GlobalCoponents/social-share-html';
import { useBlockProps } from '@wordpress/block-editor';

const { BlockControls } = wp.blockEditor;

const ALLOWED_MEDIA_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.ms-powerpoint',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.openxmlformats-officedocument.presentationml.slideshow' // Added PPSX MIME type
];


const DocumentEdit = (props) => {
	const [hasError, setHasError] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [interactive, setInteractive] = useState(false);
	const [loadPdf, setLoadPdf] = useState(true);
	const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);

	const blockProps = useBlockProps();



	const { attributes, mediaUpload, noticeOperations, isSelected, setAttributes, clientId, noticeUI } = props;
	const { href, mime, id, width, height, docViewer, themeMode, customColor, presentation, position, download, draw, toolbar, copy_text, doc_rotation, powered_by, adManager, adSource, adFileUrl, contentShare } = attributes;

	// componentDidMount equivalent
	useEffect(() => {
		// Upload a file drag-and-dropped into the editor
		if (isBlobURL(href)) {
			const file = getBlobByURL(href);

			mediaUpload({
				filesList: [file],
				onFileChange: ([media]) => onSelectFile(media),
				onError: (message) => {
					setHasError(true);
					noticeOperations.createErrorNotice(message);
				},
			});

			revokeBlobURL(href);
		}

		if (href && mime === 'application/pdf' && loadPdf) {
			setLoadPdf(false);
			PDFObject.embed(href, "." + id);
		}
	}, [href, mime, id, loadPdf, mediaUpload, noticeOperations]);

	// componentDidUpdate equivalent
	useEffect(() => {
		// Reset copy confirmation state when block is deselected
		if (!isSelected) {
			setShowCopyConfirmation(false);
		}
	}, [isSelected]);

	// getDerivedStateFromProps equivalent
	useEffect(() => {
		if (!isSelected && interactive) {
			setInteractive(false);
		}
	}, [isSelected, interactive]);

	const hideOverlay = () => {
		setInteractive(true);
	};

	const onLoad = () => {
		setFetching(false);
	};

	const onSelectFile = (media) => {
		if (media && media.url) {
			setHasError(false);
			setAttributes({
				href: media.url,
				fileName: media.title,
				id: 'embedpress-pdf-' + Date.now(),
				mime: media.mime,
			});

			if (embedpressObj.embedpress_pro) {
				setAttributes({
					powered_by: false
				});
			}
			if (media.mime === 'application/pdf') {
				setLoadPdf(false);
				PDFObject.embed(media.url, "." + id);
			}
		}

		if (clientId && href) {
			saveSourceData(clientId, href);
		}
	};

	const onUploadError = (message) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	};


	const min = 1;
	const max = 1000;
	const blockId = id;

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

	const docLink = 'https://embedpress.com/docs/embed-document/';

	let isDownloadEnabled = ' enabled-file-download';
	if (!download) {
		isDownloadEnabled = '';
	}

	if (!href || hasError) {
		return (
			<div {...blockProps}>
				<div className={"embedpress-document-editmode"}>
					<MediaPlaceholder
						icon={<BlockIcon icon={DocumentIcon} />}
						labels={{
							title: __('Document'),
							instructions: __(
								'Upload a file or pick one from your media library for embed.'
							),
						}}
						onSelect={onSelectFile}
						notices={noticeUI}
						allowedTypes={ALLOWED_MEDIA_TYPES}
						onError={onUploadError}
					>
						<div style={{ width: '100%' }} className="components-placeholder__learn-more embedpress-doc-link">
							<ExternalLink href={docLink}>Learn more about Embedded document </ExternalLink>
						</div>
					</MediaPlaceholder>
				</div>
			</div>
		);
	}
	let url = '//view.officeapps.live.com/op/embed.aspx?src=' + href; // + '?' + queryString;

	if (docViewer === 'google') {
		url = '//docs.google.com/gview?embedded=true&url=' + href;
	}

	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarButton
					className="components-edit-button"
					icon="edit"
					label={__('Re Upoload', 'embedpress')}
					onClick={() => setAttributes({ href: '' })}
				/>
			</BlockControls>

			{(fetching && mime !== 'application/pdf') ? <EmbedLoading /> : null}
			<div className={'embedpress-document-embed ep-doc-' + id} style={{ height: height, width: width }}>
				{mime === 'application/pdf' && (
					<div style={{ height: height, width: width }} className={'embedpress-embed-document-pdf' + ' ' + id} data-emid={id} >
						<embed style={{ height: height, width: width }} onLoad={onLoad} src={sanitizeUrl(href)}></embed>
					</div>
				)}
				{mime !== 'application/pdf' && (
					<div className={`${docViewer === 'custom' ? 'ep-file-download-option-masked ' : ''}ep-gutenberg-file-doc ep-powered-by-enabled ${isDownloadEnabled}`} data-theme-mode={themeMode} data-custom-color={customColor} data-id={blockId}>
						<iframe title="" onMouseUp={hideOverlay} style={{ height: height, width: width, display: fetching || !loadPdf ? 'none' : '' }} onLoad={onLoad} src={sanitizeUrl(url)} />
						{
							draw && docViewer === 'custom' && (
								<canvas className="ep-doc-canvas" width={width} height={height} ></canvas>
							)
						}
						{
							toolbar && docViewer === 'custom' && (
								<div className="ep-external-doc-icons">
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

				{!interactive && (
					<div
						className="block-library-embed__interactive-overlay"
						onMouseUp={hideOverlay}
					/>
				)}
				{powered_by && (
					<p className="embedpress-el-powered">Powered By EmbedPress</p>
				)}

				{!fetching && <Logo id={id} />}

				<DocStyle attributes={attributes} />
			</div>

			{contentShare && <SocialShareHtml attributes={attributes} />}

			{adManager && (adSource === 'image') && adFileUrl && (
				<AdTemplate attributes={attributes} setAttributes={setAttributes} deleteIcon={true} progressBar={true} inEditor={true} />
			)}

			<InspectorControls key="inspector">
				<PanelBody className={'embedpress-documents-control'} title={<div className='ep-pannel-icon'>{EPIcon} {__('Embed Size', 'embedpress')}</div>}>
					<RangeControl
						label={__(
							'Width',
							'embedpress'
						)}
						value={width || 720}
						onChange={(width) =>
							setAttributes({ width })
						}
						max={max}
						min={min}
					/>
					<RangeControl
						label={__(
							'Height',
							'embedpress'
						)}
						value={height}
						onChange={(height) =>
							setAttributes({ height })
						}
						max={max}
						min={min}
					/>
				</PanelBody>

				<DocControls attributes={attributes} setAttributes={setAttributes} />
				<AdControl attributes={attributes} setAttributes={setAttributes} />
				<LockControl attributes={attributes} setAttributes={setAttributes} />
				<ContentShare attributes={attributes} setAttributes={setAttributes} />

				<Upgrade />
			</InspectorControls>
		</div>
	);
};

export default DocumentEdit;
