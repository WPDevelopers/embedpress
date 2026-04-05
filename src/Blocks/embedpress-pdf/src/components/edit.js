/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect, useRef, Fragment } = wp.element;

const {
	BlockControls,
	BlockIcon,
	MediaPlaceholder,
	MediaUpload,
	useBlockProps
} = wp.blockEditor;
const {
	ToolbarButton,
	ToolbarGroup,
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
import { saveSourceData, sanitizeUrl, shareIconsHtml, getIframeTitle, isPro, removeAlert } from '../../../GlobalCoponents/helper';
import SocialShareHtml from '../../../GlobalCoponents/social-share-html';
import AdTemplate from '../../../GlobalCoponents/ads-template';
import Inspector from "../inspector";
import { PdfIcon } from "../../../GlobalCoponents/icons";
import CustomBranding from "../../../GlobalCoponents/custombranding";

const isProPluginActive = typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.isProPluginActive;

const showProAlert = (e) => {
	if (isProPluginActive) return;
	let alertWrap = document.querySelector('.pro__alert__wrap');
	if (!alertWrap) {
		document.querySelector('body').append(isPro('none'));
		removeAlert();
		alertWrap = document.querySelector('.pro__alert__wrap');
	}
	if (alertWrap) {
		alertWrap.style.display = 'block';
	}
};

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
	const [thumbnailUrl, setThumbnailUrl] = useState(null);
	const [thumbnailLoading, setThumbnailLoading] = useState(false);
	const thumbnailCanvasRef = useRef(null);

	const blockProps = useBlockProps();

	// Generate PDF thumbnail for lightbox mode
	useEffect(() => {
		if (attributes.displayMode !== 'lightbox' || !attributes.href || attributes.mime !== 'application/pdf') {
			setThumbnailUrl(null);
			return;
		}

		const pdfUrl = attributes.href;
		setThumbnailLoading(true);

		// Use the same PDF.js loading pattern as the PDF Gallery block
		const loadAndRender = () => {
			// If pdfjsLib is already available, use it directly
			if (window.pdfjsLib) {
				renderPage(window.pdfjsLib, pdfUrl);
				return;
			}

			// Determine the assets base URL
			let baseUrl = '';
			if (typeof embedpressGutenbergData !== 'undefined') {
				if (embedpressGutenbergData.assetsUrl) {
					baseUrl = embedpressGutenbergData.assetsUrl;
				} else if (embedpressGutenbergData.staticUrl) {
					baseUrl = embedpressGutenbergData.staticUrl.replace(/static\/?$/, 'assets/');
				}
			}

			if (!baseUrl) {
				setThumbnailLoading(false);
				return;
			}

			const scriptSrc = baseUrl + 'pdf/build/script.js';
			const script = document.createElement('script');
			script.src = scriptSrc;
			script.type = 'module';
			script.onload = () => {
				// Module scripts set pdfjsLib on globalThis asynchronously
				setTimeout(() => {
					if (window.pdfjsLib || globalThis.pdfjsLib) {
						if (!window.pdfjsLib) window.pdfjsLib = globalThis.pdfjsLib;
						window.pdfjsLib.GlobalWorkerOptions.workerSrc = baseUrl + 'pdf/build/pdf.worker.js';
						renderPage(window.pdfjsLib, pdfUrl);
					} else {
						setThumbnailLoading(false);
					}
				}, 100);
			};
			script.onerror = () => {
				setThumbnailLoading(false);
			};
			document.head.appendChild(script);
		};

		const renderPage = (pdfjsLib, url) => {
			const loadingTask = pdfjsLib.getDocument(url);
			loadingTask.promise.then((pdf) => {
				pdf.getPage(1).then((page) => {
					let scale = 1.0;
					let viewport = page.getViewport({ scale });
					const targetWidth = 400;
					scale = targetWidth / viewport.width;
					viewport = page.getViewport({ scale });

					const canvas = document.createElement('canvas');
					canvas.width = viewport.width;
					canvas.height = viewport.height;
					const ctx = canvas.getContext('2d');

					page.render({ canvasContext: ctx, viewport }).promise.then(() => {
						setThumbnailUrl(canvas.toDataURL('image/png'));
						setThumbnailLoading(false);
					});
				});
			}).catch((err) => {
				console.warn('EmbedPress: Could not generate PDF thumbnail', err);
				setThumbnailLoading(false);
			});
		};

		loadAndRender();
	}, [attributes.displayMode, attributes.href, attributes.mime]);


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
			const isSecure = media.url.includes('embedpress-secure');
			
			setAttributes({
				href: media.url,
				fileName: media.title,
				id: 'embedpress-pdf-' + Date.now(),
				mime: media.mime,
				lockContent: isSecure || attributes.lockContent,
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
	const { href, mime, id, unitoption, width, height, powered_by, themeMode, customColor, presentation, lazyLoad, position, flipbook_toolbar_position, download, add_text, draw, open, toolbar, copy_text, toolbar_position, doc_details, doc_rotation, add_image, selection_tool, scrolling, spreads, sharePosition, contentShare, adManager, adSource, adFileUrl, adWidth, adHeight, adXPosition, adYPosition, viewerStyle, displayMode, lightboxThumbnail, lightboxAlign, triggerText, triggerColor, triggerBgColor, triggerFontSize, triggerBorderRadius, zoomIn, zoomOut, fitView, bookmark, customlogo, watermarkText, watermarkFontSize, watermarkColor, watermarkOpacity, watermarkStyle } = attributes;

	// Custom logo component
	const customLogoTemp = applyFilters('embedpress.customLogoComponent', '', attributes);


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
			watermark_text: watermarkText ? watermarkText : '',
			watermark_font_size: watermarkFontSize ? watermarkFontSize : '48',
			watermark_color: watermarkColor ? watermarkColor : '#000000',
			watermark_opacity: watermarkOpacity ? watermarkOpacity : '15',
			watermark_style: watermarkStyle ? watermarkStyle : 'center',
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

		if (viewerStyle === 'flip-book' && typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.flipbookRenderer) {
			pdf_viewer_src = embedpressGutenbergData.flipbookRenderer +
				((embedpressGutenbergData.flipbookRenderer.indexOf('?') === -1) ? '?' : '&') +
				'file=' + getParamData(href);
		}

		// Lightbox mode: show book-style thumbnail preview in editor
		if (displayMode === 'lightbox' && mime === 'application/pdf') {
			const displayedThumb = lightboxThumbnail || thumbnailUrl;
			const pdfTitle = attributes.fileName || (href ? href.split('/').pop().replace('.pdf', '') : 'PDF');

			return (
				<Fragment>
					<BlockControls>
						<ToolbarButton
							className="components-edit-button"
							icon="edit"
							label={__('Re Upload PDF', 'embedpress')}
							onClick={() => setAttributes({ href: '' })}
						/>
						<ToolbarGroup>
							{isProPluginActive ? (
								<Fragment>
									<MediaUpload
										onSelect={(media) => {
											if (media && media.url) {
												setAttributes({ lightboxThumbnail: media.url });
											}
										}}
										allowedTypes={['image']}
										render={({ open }) => (
											<ToolbarButton
												icon="format-image"
												label={__('Custom Thumbnail', 'embedpress')}
												onClick={open}
											/>
										)}
									/>
									{lightboxThumbnail && (
										<ToolbarButton
											icon="dismiss"
											label={__('Remove Custom Thumbnail', 'embedpress')}
											onClick={() => setAttributes({ lightboxThumbnail: '' })}
										/>
									)}
								</Fragment>
							) : (
								<ToolbarButton
									icon="format-image"
									label={__('Custom Thumbnail (Pro)', 'embedpress')}
									onClick={showProAlert}
								/>
							)}
						</ToolbarGroup>
					</BlockControls>
					<div {...blockProps}>
						<div className={'embedpress-document-embed ep-doc-' + id + ' ' + content_share_class + ' ' + share_position_class}
							id={`ep-doc-${attributes.clientId || clientId}`}>
							<div className="ep-embed-content-wraper">
								<div className={`position-${sharePosition}-wraper gutenberg-pdf-wraper`}>
									<div className='main-content-wraper'>
										{/* Book-style thumbnail card */}
										<div className="ep-pdf-thumbnail-card"
											style={{
												display: 'inline-block',
												textAlign: 'center',
												maxWidth: '100%',
											}}>
											<div style={{
												position: 'relative',
												display: 'block',
												width: width ? (width + (unitoption || 'px')) : '100%',
												height: height ? (height + 'px') : 'auto',
												maxWidth: '100%',
												background: '#fff',
												borderRadius: '4px',
												overflow: 'hidden',
											}}>
													{thumbnailLoading && !displayedThumb && (
														<div style={{
															width: '200px',
															height: '280px',
															background: 'linear-gradient(90deg, #f5f3ef 25%, #ece8e1 50%, #f5f3ef 75%)',
															backgroundSize: '200% 100%',
															animation: 'epLightboxShimmer 1.5s infinite',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
														}}>
															<span style={{ color: '#999' }}>{__('Loading...', 'embedpress')}</span>
														</div>
													)}

													{displayedThumb && (
														<img
															src={displayedThumb}
															alt={pdfTitle}
															style={{
																display: 'block',
																width: '100%',
																height: '100%',
																objectFit: 'cover',
															}}
														/>
													)}

													{!thumbnailLoading && !displayedThumb && (
														<div style={{
															width: '200px',
															height: '280px',
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'center',
															justifyContent: 'center',
															background: '#f9f7f4',
														}}>
															<svg width="48" height="48" viewBox="0 0 24 24" fill="#ccc">
																<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
															</svg>
														</div>
													)}

													{/* Play icon overlay */}
													<div style={{
														position: 'absolute',
														inset: 0,
														background: 'rgba(0, 0, 0, 0.25)',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														pointerEvents: 'none',
													}}>
														<div style={{
															width: '56px',
															height: '56px',
															borderRadius: '50%',
															background: 'rgba(255, 255, 255, 0.95)',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
														}}>
															<svg width="24" height="24" viewBox="0 0 24 24" fill="#333" style={{ marginLeft: '2px' }}>
																<path d="M8 5v14l11-7z"/>
															</svg>
														</div>
													</div>
											</div>
										</div>

										{contentShare && <SocialShareHtml attributes={attributes} />}
									</div>

									{customLogoTemp && (
										<div className="custom-logo-container" dangerouslySetInnerHTML={{ __html: customLogoTemp }} />
									)}
								</div>
							</div>
						</div>
					</div>
					<Inspector attributes={attributes} setAttributes={setAttributes} />
				</Fragment>
			);
		}

		// Button / Link / Text modes: show trigger element in editor
		if ((displayMode === 'button' || displayMode === 'link' || displayMode === 'text') && mime === 'application/pdf') {
			const label = triggerText || 'View PDF';

			const triggerStyle = {};
			if (triggerColor) triggerStyle.color = triggerColor;
			if (triggerFontSize) triggerStyle.fontSize = triggerFontSize + 'px';
			if (displayMode === 'button') {
				if (triggerBgColor) triggerStyle.backgroundColor = triggerBgColor;
				if (triggerBorderRadius) triggerStyle.borderRadius = triggerBorderRadius + 'px';
			}

			let triggerEl;
			if (displayMode === 'button') {
				triggerEl = <span className="ep-pdf-trigger ep-pdf-trigger--button" style={triggerStyle}>{label}</span>;
			} else if (displayMode === 'link') {
				triggerEl = <span className="ep-pdf-trigger ep-pdf-trigger--link" style={triggerStyle}>{label}</span>;
			} else {
				triggerEl = <span className="ep-pdf-trigger ep-pdf-trigger--text" style={triggerStyle}>{label}</span>;
			}

			return (
				<Fragment>
					<BlockControls>
						<ToolbarButton
							className="components-edit-button"
							icon="edit"
							label={__('Re Upload PDF', 'embedpress')}
							onClick={() => setAttributes({ href: '' })}
						/>
					</BlockControls>
					<div {...blockProps}>
						<div className={'embedpress-document-embed ep-doc-' + id + ' ' + content_share_class + ' ' + share_position_class}
							id={`ep-doc-${attributes.clientId || clientId}`}>
							<div className="ep-embed-content-wraper">
								<div className={`position-${sharePosition}-wraper gutenberg-pdf-wraper`}>
									<div className='main-content-wraper'>
										{triggerEl}
										{contentShare && <SocialShareHtml attributes={attributes} />}
									</div>
								</div>
							</div>
						</div>
					</div>
					<Inspector attributes={attributes} setAttributes={setAttributes} />
				</Fragment>
			);
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
					<div className={'embedpress-document-embed ep-doc-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} style={{ width: width + unitoption, height: height + 'px', maxWidth: '100%' }} id={`ep-doc-${attributes.clientId || clientId}`} data-source-id={'source-' + (attributes.clientId || clientId)} >

						<div className="ep-embed-content-wraper">
							<div className={`position-${sharePosition}-wraper gutenberg-pdf-wraper`}>
								<div className='main-content-wraper'>
									{mime === 'application/pdf' && (
										// <iframe title="" powered_by={powered_by} style={{ height: height + 'px', width: '100%' }} className={'embedpress-embed-document-pdf' + ' ' + id} data-emid={id} src={sanitizeUrl(pdf_viewer_src)} data-viewer-style={viewerStyle}></iframe>
										<iframe
											key={pdf_viewer_src}
											title={getIframeTitle(href, attributes.fileName)}
											powered_by={powered_by}
											style={{ height: height + 'px', width: width + unitoption, maxWidth: '100%' }}
											className={'embedpress-embed-document-pdf' + ' ' + id}
											data-emid={id}
											data-viewer-style={viewerStyle}
											src={sanitizeUrl(pdf_viewer_src)}
										/>
									)}

									{mime !== 'application/pdf' && (
										<Iframe title={getIframeTitle(url, attributes.fileName)} onMouseUponMouseUp={hideOverlay} style={{ height: height + 'px', width: width, display: fetching || !loadPdf ? 'none' : '' }} onLoad={onLoad} src={sanitizeUrl(url)} />
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
