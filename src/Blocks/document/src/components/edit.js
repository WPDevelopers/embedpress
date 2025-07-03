/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { useBlockProps, BlockIcon, MediaPlaceholder, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { ExternalLink, ToolbarButton } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies - Global Components
 */
import Logo from '../../../GlobalCoponents/Logo';
import EmbedLoading from '../../../GlobalCoponents/embed-loading';
import { sanitizeUrl, saveSourceData, isFileUrl } from '../../../GlobalCoponents/helper';
import { DocumentIcon, epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../../../GlobalCoponents/icons';
import SocialShareHtml from '../../../GlobalCoponents/social-share-html';
import AdTemplate from '../../../GlobalCoponents/ads-template';
import Inspector from '../inspector';
import DocStyle from './doc-style';
import PDFViewer from './PDFViwer';
import FileViewer from './FileViewer';
import DocumentPlaceholder from './DocumentPlaceholder';

import "../editor.scss";
import "../style.scss";



/**
 * Main Edit Component
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
			PDFObject.embed(href, `.${id}`);
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
			powered_by: embedpressGutenbergData?.embedpress_pro ? false : powered_by,
		});

		if (media.mime === 'application/pdf') {
			setLoadPdf(false);
			PDFObject.embed(media.url, `.${id}`);
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
				<div className={`position-${sharePosition}-wraper gutenberg-doc-wraper`}>
					<div className='gutenberg-wraper'>
						{mime === 'application/pdf' ? (
							<PDFViewer href={href} id={id} width={width} height={height} />
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
							/>
						)}

						{contentShare && <SocialShareHtml attributes={attributes} />}
					</div>

					{customLogoTemp && (
						<div className="custom-logo-container" dangerouslySetInnerHTML={{ __html: customLogoTemp }} />
					)}

					{powered_by && <p className="embedpress-el-powered">Powered By EmbedPress</p>}

					{showOverlay && (
						<div
							className="block-library-embed__interactive-overlay"
							onMouseUp={() => setShowOverlay(false)}
						/>
					)}
					<DocStyle attributes={attributes} />
				</div>

				{adManager && adSource === 'image' && adFileUrl && (
					<AdTemplate attributes={attributes} setAttributes={setAttributes} deleteIcon progressBar inEditor />
				)}

			</div>

			<Inspector attributes={attributes} setAttributes={setAttributes} />
		</div>
	);
};

export default Edit;
