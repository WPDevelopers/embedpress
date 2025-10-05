/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;

const {
	BlockControls,
	BlockIcon,
	MediaPlaceholder,
	useBlockProps
} = wp.blockEditor;
const {
	ToolbarButton,
	ExternalLink,
} = wp.components;

const { getBlobByURL, isBlobURL, revokeBlobURL } = wp.blob;
const { applyFilters } = wp.hooks;

/**
 * Internal dependencies
 */
import Iframe from '../../../GlobalCoponents/Iframe';
import Logo from '../../../GlobalCoponents/Logo';
import EmbedLoading from '../../../GlobalCoponents/embed-loading';
import { saveSourceData, sanitizeUrl, shareIconsHtml } from '../../../GlobalCoponents/helper';
import SocialShareHtml from '../../../GlobalCoponents/social-share-html';
import AdTemplate from '../../../GlobalCoponents/ads-template';
import Inspector from "../inspector";
import { PdfIcon } from "../../../GlobalCoponents/icons";
import CustomBranding from "../../../GlobalCoponents/custombranding";

const ALLOWED_MEDIA_TYPES = [
	'application/pdf',
];

import "../editor.scss";
import "../style.scss";





function Edit(props) {
	const { attributes, setAttributes, clientId, isSelected, noticeUI, mediaUpload, noticeOperations } = props;


	// State management
	const [hasError, setHasError] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [interactive, setInteractive] = useState(false);
	const [loadPdf, setLoadPdf] = useState(true);

	const blockProps = useBlockProps();


	// Reset interactive state when block is deselected
	useEffect(() => {
		if (!isSelected && interactive) {
			setInteractive(false);
		}
	}, [isSelected, interactive]);

	// Handle file upload on mount
	useEffect(() => {
		const { href } = attributes;

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

		if (attributes.href && attributes.mime === 'application/pdf' && loadPdf) {
			setLoadPdf(false);
		}
	}, []);

	// Helper functions
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

			if (embedpressGutenbergData.branding !== undefined && embedpressGutenbergData.branding.powered_by !== undefined) {
				setAttributes({
					powered_by: embedpressGutenbergData.branding.powered_by
				});
			}

			if (media.mime === 'application/pdf') {
				setLoadPdf(false);
			}
		}

		if (clientId && attributes.href) {
			saveSourceData(clientId, attributes.href);
		}
	};

	const onUploadError = (message) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	};

	const addProAlert = (isProPluginActive) => {
		if (!isProPluginActive) {
			document.querySelector('.pro__alert__wrap').style.display = 'block';
		}
	};

	const removeAlert = () => {
		if (document.querySelector('.pro__alert__wrap')) {
			document.querySelector('.pro__alert__wrap .pro__alert__card .button').addEventListener('click', () => {
				document.querySelector('.pro__alert__wrap').style.display = 'none';
			});
		}
	};

	const isPro = () => {
		const alertPro = `
		<div class="pro__alert__wrap" style="display: none;">
			<div class="pro__alert__card">
				<img src="../wp-content/plugins/embedpress/EmbedPress/Ends/Back/Settings/assets/img/alert.svg" alt=""/>
					<h2>Opps...</h2>
					<p>You need to upgrade to the <a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Premium</a> Version to use this feature</p>
					<a href="#" class="button radius-10">Close</a>
			</div>
		</div>
		`;

		const dom = document.createElement('div');
		dom.innerHTML = alertPro;
		return dom;
	};

	// Set client ID if not set - using useEffect to ensure stability
	useEffect(() => {
		if (clientId == null || clientId == undefined) {
			setAttributes({ clientId });
		}
	}, []);

	// Extract attributes
	const { href, mime, id, unitoption, width, height, powered_by, themeMode, customColor, presentation, lazyLoad, position, flipbook_toolbar_position, download, add_text, draw, open, toolbar, copy_text, toolbar_position, doc_details, doc_rotation, add_image, selection_tool, scrolling, spreads, sharePosition, contentShare, adManager, adSource, adFileUrl, adWidth, adHeight, adXPosition, adYPosition, viewerStyle, zoomIn, zoomOut, fitView, bookmark, customlogo } = attributes;

	// Custom logo component
	const customLogoTemp = applyFilters('embedpress.customLogoComponent', null, attributes);


	let width_class = '';
	if (unitoption == '%') {
		width_class = 'ep-percentage-width';
	}
	else {
		width_class = 'ep-fixed-width';
	}

	let content_share_class = '';
	let share_position_class = '';
	let share_position = sharePosition ? sharePosition : 'right';
	if (contentShare) {
		content_share_class = 'ep-content-share-enabled';
		share_position_class = 'ep-share-position-' + share_position;
	}

	const colors = [
		{ name: '', color: '#823535' },
		{ name: '', color: '#008000' },
		{ name: '', color: '#403A81' },
		{ name: '', color: '#333333' },
		{ name: '', color: '#000264' },
	];

	let widthMin = 0;
	let widthMax = 100;

	if (unitoption == 'px') {
		widthMax = 1500;
	}

	const docLink = 'https://embedpress.com/docs/embed-document/';
	const isProPluginActive = embedpressGutenbergData.isProPluginActive;

	if (!isProPluginActive) {
		setAttributes({ download: true });
		setAttributes({ copy_text: true });
		setAttributes({ draw: false });
		setAttributes({ selection_tool: '0' });
		setAttributes({ scrolling: '-1' });
	}

	if (!document.querySelector('.pro__alert__wrap')) {
		document.querySelector('body').append(isPro());
		removeAlert();
	}

	function getParamData(href) {
		let pdf_params = '';
		let colorsObj = {};

		//Generate PDF params
		if (themeMode === 'custom') {
			colorsObj = {
				customColor: (customColor && (customColor !== 'default')) ? customColor : '#403A81',
			}
		}

		let _pdf_params = {
			themeMode: themeMode ? themeMode : 'default',
			...colorsObj,
			presentation: presentation ? presentation : false,
			lazyLoad: lazyLoad ? lazyLoad : false,
			position: position ? position : 'top',
			flipbook_toolbar_position: flipbook_toolbar_position ? flipbook_toolbar_position : 'bottom',
			download: download ? download : false,
			toolbar: toolbar ? toolbar : false,
			copy_text: copy_text ? copy_text : false,
			add_text: add_text ? add_text : false,
			draw: draw ? draw : false,
			toolbar_position: toolbar_position ? toolbar_position : 'top',
			doc_details: doc_details ? doc_details : false,
			doc_rotation: doc_rotation ? doc_rotation : false,
			add_image: add_image ? add_image : false,
			zoom_in: zoomIn ? zoomIn : false,
			zoom_out: zoomOut ? zoomOut : false,
			fit_view: fitView ? fitView : false,
			bookmark: bookmark ? bookmark : false,
			selection_tool: selection_tool ? selection_tool : '0',
			scrolling: scrolling ? scrolling : '-1',
			spreads: spreads ? spreads : '0',
		};

		// Convert object to query string
		const queryString = new URLSearchParams(_pdf_params).toString();

		// Encode the query string to base64
		const base64String = btoa(encodeURIComponent(queryString).replace(/%([0-9A-F]{2})/g, function (match, p1) {
			return String.fromCharCode(parseInt(p1, 16));
		}));

		// Return the formatted string
		pdf_params = "key=" + base64String;

		let __url = href.split('#');
		__url = encodeURIComponent(__url[0]);

		if (viewerStyle === 'flip-book') {
			return `${__url}&${pdf_params}`;
		}

		return `${__url}#${pdf_params}`;
	}



	if (!href || hasError) {
		return (
			<div className={"embedpress-document-editmode"} >
				<MediaPlaceholder
					icon={<BlockIcon icon={PdfIcon} />}
					labels={{
						title: __('EmbedPress PDF'),
						instructions: __(
							'Upload a PDF file or pick one from your media library for embed.'
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
		);
	} else {
		const url = '//view.officeapps.live.com/op/embed.aspx?src=' + getParamData(href);

		let pdf_viewer_src = embedpressGutenbergData.pdfRenderer + ((embedpressGutenbergData.pdfRenderer.indexOf('?') === -1) ? '?' : '&') + 'scrolling=' + scrolling + '&selection_tool=' + selection_tool + '&spreads=' + spreads + '&file=' + getParamData(href);

		if (viewerStyle === 'flip-book') {
			pdf_viewer_src = embedpressGutenbergData.assetsUrl + 'pdf-flip-book/viewer.html?file=' + getParamData(href);
		}



		return (
			<Fragment>
				<BlockControls>
					<ToolbarButton
						className="components-edit-button"
						icon="edit"
						label={__('Re Upload', 'embedpress')}
						onClick={() => setAttributes({ href: '' })}
					/>
				</BlockControls>

				{(fetching && mime !== 'application/pdf') ? <EmbedLoading /> : null}

				<div {...blockProps}>
					<div className={'embedpress-document-embed ep-doc-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} style={{ width: width + unitoption, maxWidth: '100%' }} id={`ep-doc-${attributes.clientId || clientId}`} data-source-id={'source-' + (attributes.clientId || clientId)} >

						<div className="ep-embed-content-wraper">
							<div className={`position-${sharePosition}-wraper gutenberg-pdf-wraper`}>
								<div className='main-content-wraper'>
									{mime === 'application/pdf' && (
										(viewerStyle === 'modern') ? (
											<iframe title="" powered_by={powered_by} style={{ height: height, width: '100%' }} className={'embedpress-embed-document-pdf' + ' ' + id} data-emid={id} src={sanitizeUrl(pdf_viewer_src)}></iframe>
										) : (
											<iframe title="" powered_by={powered_by} style={{ height: height, width: '100%' }} className={'embedpress-embed-document-pdf' + ' ' + id} data-emid={id} src={sanitizeUrl(pdf_viewer_src)}></iframe>
										)
									)}

									{mime !== 'application/pdf' && (
										<Iframe title="" onMouseUponMouseUp={hideOverlay} style={{ height: height, width: width, display: fetching || !loadPdf ? 'none' : '' }} onLoad={onLoad} src={sanitizeUrl(url)} />
									)}

									{contentShare && <SocialShareHtml attributes={attributes} />}
								</div>

								{customLogoTemp && (
									<div className="custom-logo-container" dangerouslySetInnerHTML={{ __html: customLogoTemp }} />
								)}

								{powered_by && <p className="embedpress-el-powered">Powered By EmbedPress</p>}


								<div
									className="block-library-embed__interactive-overlay"
									onMouseUp={() => setAttributes({ interactive: true })}
								/>

							</div>


							{
								adManager && (adSource === 'image') && adFileUrl && (
									<AdTemplate attributes={attributes} setAttributes={setAttributes} deleteIcon={false} progressBar={false} inEditor={true} />
								)
							}

						</div>

					</div>
				</div>
				<Inspector attributes={attributes} setAttributes={setAttributes} />
			</Fragment >
		);
	}
}

export default Edit;
