/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { useBlockProps, BlockIcon, MediaPlaceholder, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { RangeControl, PanelBody, ExternalLink, ToolbarButton } from '@wordpress/components';

/**
 * Internal Global Components
 */
import Logo from '../../../GlobalCoponents/Logo';
import EmbedLoading from '../../../GlobalCoponents/embed-loading';
import { sanitizeUrl, saveSourceData, isFileUrl } from '../../../GlobalCoponents/helper';
import { DocumentIcon, epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon, EPIcon } from '../../../GlobalCoponents/icons';
import Upgrade from '../../../GlobalCoponents/upgrade';
import AdControl from '../../../GlobalCoponents/ads-control';
import AdTemplate from '../../../GlobalCoponents/ads-template';
import LockControl from '../../../GlobalCoponents/lock-control';
import ContentShare from '../../../GlobalCoponents/social-share-control';
import SocialShareHtml from '../../../GlobalCoponents/social-share-html';
import DocStyle from './doc-style';
import DocControls from './doc-controls';
import CustomBranding from '../../../EmbedPress/src/components/InspectorControl/custombranding';
import Inspector from '../inspector';
import { applyFilters } from '@wordpress/hooks';

const ALLOWED_MEDIA_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.ms-powerpoint',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
];

/**
 * Edit Component
 */
const Edit = ({ attributes, mediaUpload, noticeOperations, isSelected, setAttributes, clientId, noticeUI }) => {

	const {
		href, mime, id, width, height, docViewer, themeMode, customColor,
		presentation = true, position = 'bottom', download = true, draw = true, toolbar,
		powered_by, adManager, adSource, adFileUrl, contentShare, customlogo
	} = attributes;

	const [hasError, setHasError] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [showOverlay, setShowOverlay] = useState(true);
	const [loadPdf, setLoadPdf] = useState(true);

	const blockProps = useBlockProps();

	useEffect(() => {
		if (isBlobURL(href)) {
			const file = getBlobByURL(href);
			mediaUpload({
				filesList: [file],
				onFileChange: ([media]) => handleFileSelect(media),
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
	}, [href, mime, id]);

	useEffect(() => {
		if (!isSelected) setShowOverlay(true);
	}, [isSelected]);

	const handleFileSelect = (media) => {
		if (!media?.url) return;

		setHasError(false);

		setAttributes({
			href: media.url,
			fileName: media.title,
			id: 'embedpress-pdf-' + Date.now(),
			mime: media.mime,
			powered_by: embedpressObj?.embedpress_pro ? false : powered_by,
		});

		if (media.mime === 'application/pdf') {
			setLoadPdf(false);
			PDFObject.embed(media.url, "." + id);
		}

		if (clientId && media.url) saveSourceData(clientId, media.url);
	};

	const handleUploadError = (message) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	};

	const buildViewerUrl = () => {
		if (docViewer === 'google') return `//docs.google.com/gview?embedded=true&url=${href}`;
		return `//view.officeapps.live.com/op/embed.aspx?src=${href}`;
	};

	if (!href || hasError) {
		return (
			<div {...blockProps}>
				<DocumentPlaceholder
					onSelect={handleFileSelect}
					onError={handleUploadError}
					notices={noticeUI}
				/>
			</div>
		);
	}


	// Custom logo component
	const customLogoTemp = applyFilters('embedpress.customLogoComponent', '', attributes);


	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarButton
					icon="edit"
					label={__('Re Upload', 'embedpress')}
					onClick={() => setAttributes({ href: '' })}
				/>
			</BlockControls>

			{fetching && mime !== 'application/pdf' && <EmbedLoading />}

			<div className={`embedpress-document-embed ep-doc-${id}`} style={{ height, width }}>
				{mime === 'application/pdf' ? (
					<PDFViewer href={href} id={id} width={width} height={height} setFetching={setFetching} customlogo={customlogo} customLogoTemp={customLogoTemp} />
				) : (
					<FileViewer
						href={href}
						url={buildViewerUrl()}
						docViewer={docViewer}
						width={width}
						height={height}
						themeMode={themeMode}
						customColor={customColor}
						id={id}
						download={download}
						draw={draw}
						toolbar={toolbar}
						presentation={presentation}
						setShowOverlay={setShowOverlay}
						setFetching={setFetching}
						loadPdf={loadPdf}
						fetching={fetching}
						customlogo={customlogo}
						customLogoTemp={customLogoTemp}
					/>
				)}

				{showOverlay && (
					<div
						className="block-library-embed__interactive-overlay"
						onMouseUp={() => setShowOverlay(false)}
					/>
				)}

				{powered_by && <p className="embedpress-el-powered">Powered By EmbedPress</p>}
				{!fetching && <Logo id={id} />}
				<DocStyle attributes={attributes} />
			</div>

			{contentShare && <SocialShareHtml attributes={attributes} />}

			{adManager && adSource === 'image' && adFileUrl && (
				<AdTemplate attributes={attributes} setAttributes={setAttributes} deleteIcon progressBar inEditor />
			)}

			<Inspector attributes={attributes} setAttributes={setAttributes} />
		</div>
	);
};

/**
 * Sub-components
 */

const DocumentPlaceholder = ({ onSelect, onError, notices }) => (
	<div className="embedpress-document-editmode">
		<MediaPlaceholder
			icon={<BlockIcon icon={DocumentIcon} />}
			labels={{
				title: __('Document'),
				instructions: __('Upload a file or pick one from your media library for embed.'),
			}}
			onSelect={onSelect}
			notices={notices}
			allowedTypes={ALLOWED_MEDIA_TYPES}
			onError={onError}
		>
			<div className="components-placeholder__learn-more embedpress-doc-link">
				<ExternalLink href="https://embedpress.com/docs/embed-document/">
					Learn more about Embedded document
				</ExternalLink>
			</div>
		</MediaPlaceholder>
	</div>
);

const PDFViewer = ({ href, id, width, height, setFetching, customlogo, customLogoTemp }) => (
	<div className={`embedpress-embed-document-pdf ${id}`} style={{ height, width }} data-emid={id}>
		<embed src={sanitizeUrl(href)} style={{ height, width }} onLoad={() => setFetching(false)} />
		{
			customLogoTemp && (
				<div
					className="custom-logo-container"
					dangerouslySetInnerHTML={{
						__html: customLogoTemp + '',
					}}
				></div>
			)
		}

	</div>
);

const FileViewer = ({ href, url, docViewer, width, height, themeMode, customColor, id, download, draw, toolbar, presentation, setShowOverlay, setFetching, loadPdf, fetching, customlogo, customLogoTemp }) => (
	<div
		className={`${docViewer === 'custom' ? 'ep-file-download-option-masked ' : ''}ep-gutenberg-file-doc ep-powered-by-enabled${download ? ' enabled-file-download' : ''}`}
		data-theme-mode={themeMode}
		data-custom-color={customColor}
		data-id={id}
	>
		<iframe
			src={sanitizeUrl(url)}
			style={{ height, width, display: fetching || !loadPdf ? 'none' : '' }}
			onLoad={() => setFetching(false)}
			onMouseUp={() => setShowOverlay(false)}
		/>

		{draw && docViewer === 'custom' && (
			<canvas className="ep-doc-canvas" width={width} height={height}></canvas>
		)}

		{toolbar && docViewer === 'custom' && (
			<div className="ep-external-doc-icons">
				{!isFileUrl(href) && epGetPopupIcon()}
				{download && isFileUrl(href) && epGetPrintIcon()}
				{download && isFileUrl(href) && epGetDownloadIcon()}
				{draw && epGetDrawIcon()}
				{presentation && epGetFullscreenIcon()}
				{presentation && epGetMinimizeIcon()}
			</div>
		)}

		{
			customLogoTemp && (
				<div
					className="custom-logo-container"
					dangerouslySetInnerHTML={{
						__html: customLogoTemp + '',
					}}
				></div>
			)
		}
	</div>
);


export default Edit;
