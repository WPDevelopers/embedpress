/**
 * Internal dependencies
 */

import Iframe from '../common/Iframe';
import ControlHeader from '../common/control-heading';
import Logo from '../common/Logo';
import EmbedLoading from '../common/embed-loading';
import { saveSourceData } from '../common/helper';
import LockControl from '../common/lock-control';
import ContentShare from '../common/social-share-control';
import SocialShareHtml from '../common/social-share-html';
import { EPIcon, InfoIcon } from '../common/icons';
import { sanitizeUrl } from '../common/helper';


import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

const { BlockControls } = wp.blockEditor;
const { ToolbarButton } = wp.components;

import { PdfIcon } from '../common/icons'
import AdControl from '../common/ads-control';
import AdTemplate from '../common/ads-template';
import Upgrade from '../embedpress/Upgrade';

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { getBlobByURL, isBlobURL, revokeBlobURL } = wp.blob;
const { BlockIcon, MediaPlaceholder, InspectorControls } = wp.blockEditor;
const { Component, Fragment, useEffect } = wp.element;
const { applyFilters } = wp.hooks;

const { RangeControl, PanelBody, ExternalLink, ToggleControl, TextControl, SelectControl, RadioControl, ColorPalette } = wp.components;

const ALLOWED_MEDIA_TYPES = [
	'application/pdf',
];


class EmbedPressPDFEdit extends Component {
	constructor() {
		super(...arguments);
		this.onSelectFile = this.onSelectFile.bind(this);

		this.onUploadError = this.onUploadError.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.hideOverlay = this.hideOverlay.bind(this);
		this.isPro = this.isPro.bind(this);
		this.addProAlert = this.addProAlert.bind(this);

		this.state = {
			hasError: false,
			fetching: false,
			interactive: false,
			loadPdf: true,
		};
	}

	componentDidMount() {

		const {
			attributes,
			mediaUpload,
			noticeOperations,
		} = this.props;
		const { href } = attributes;

		// Upload a file drag-and-dropped into the editor
		if (isBlobURL(href)) {
			const file = getBlobByURL(href);
			mediaUpload({
				filesList: [file],
				onFileChange: ([media]) => this.onSelectFile(media),
				onError: (message) => {
					this.setState({ hasError: true });
					noticeOperations.createErrorNotice(message);
				},
			});

			revokeBlobURL(href);
		}

		if (this.props.attributes.href && this.props.attributes.mime === 'application/pdf' && this.state.loadPdf) {
			this.setState({ loadPdf: false });
		}

	}

	componentDidUpdate(prevProps) {

		// Reset copy confirmation state when block is deselected
		if (prevProps.isSelected && !this.props.isSelected) {
			this.setState({ showCopyConfirmation: false });
		}

	}

	static getDerivedStateFromProps(nextProps, state) {
		if (!nextProps.isSelected && state.interactive) {
			return { interactive: false };
		}

		return null;
	}

	hideOverlay() {
		this.setState({ interactive: true });
	}

	onLoad() {
		this.setState({
			fetching: false
		})
	}

	onSelectFile(media) {
		if (media && media.url) {
			this.setState({ hasError: false });
			this.props.setAttributes({
				href: media.url,
				fileName: media.title,
				id: 'embedpress-pdf-' + Date.now(),
				mime: media.mime,
			});

			if (embedpressObj.branding !== undefined && embedpressObj.branding.powered_by !== undefined) {
				this.props.setAttributes({
					powered_by: embedpressObj.branding.powered_by
				});
			}

			if (media.mime === 'application/pdf') {
				this.setState({ loadPdf: false });
			}
		}

		if (this.props.clientId && this.props.attributes.href) {
			saveSourceData(this.props.clientId, this.props.attributes.href);
		}

	}


	onUploadError(message) {
		const { noticeOperations } = this.props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	}

	addProAlert(e, isProPluginActive) {
		if (!isProPluginActive) {
			document.querySelector('.pro__alert__wrap').style.display = 'block';
		}
	}

	removeAlert() {
		if (document.querySelector('.pro__alert__wrap')) {
			document.querySelector('.pro__alert__wrap .pro__alert__card .button').addEventListener('click', (e) => {
				document.querySelector('.pro__alert__wrap').style.display = 'none';
			});
		}
	}


	isPro(display) {
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

	}


	render() {

		const { attributes, noticeUI, setAttributes } = this.props;

		const { href, mime, id, unitoption, width, height, powered_by, themeMode, customColor, presentation, lazyLoad, position, flipbook_toolbar_position, download, add_text, draw, open, toolbar, copy_text, toolbar_position, doc_details, doc_rotation, add_image, selection_tool, scrolling, spreads, clientId, sharePosition, contentShare, adManager, adSource, adFileUrl, adWidth, adHeight, adXPosition, adYPosition, viewerStyle, zoomIn, zoomOut, fitView, bookmark, sound } = attributes;

		if (!clientId) {
			setAttributes({ clientId: this.props.clientId });
		}

		const { hasError, interactive, fetching, loadPdf } = this.state;
		const min = 1;
		const max = 1000;

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
		const isProPluginActive = embedpressObj.is_pro_plugin_active;

		if (!isProPluginActive) {
			setAttributes({ download: true });
			setAttributes({ copy_text: true });
			setAttributes({ draw: false });
			setAttributes({ selection_tool: '0' });
			setAttributes({ scrolling: '-1' });

		}

		if (!document.querySelector('.pro__alert__wrap')) {
			document.querySelector('body').append(this.isPro('none'));
			this.removeAlert();
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
				sound: sound ? sound : false,
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


		const toobarPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Toolbar', 'embedpress'), true);
		const printPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Print/Download', 'embedpress'), true);
		const drawPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Draw', 'embedpress'), false);
		const copyPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Copy Text', 'embedpress'), true);

		const scrollingPlaceholder = applyFilters('embedpress.selectPlaceholder', [], __('Default Scrolling', 'embedpress'), '-1', 'Page Scrolling');

		const selectionPlaceholder = applyFilters('embedpress.selectPlaceholder', [], __('Default Selection Tool', 'embedpress'), '0', 'Text Tool');

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
						onSelect={this.onSelectFile}
						notices={noticeUI}
						allowedTypes={ALLOWED_MEDIA_TYPES}
						onError={this.onUploadError}

					>

						<div style={{ width: '100%' }} className="components-placeholder__learn-more embedpress-doc-link">
							<ExternalLink href={docLink}>Learn more about Embedded document </ExternalLink>
						</div>
					</MediaPlaceholder>
				</div>
			);
		} else {
			const url = '//view.officeapps.live.com/op/embed.aspx?src=' + getParamData(href);

			let pdf_viewer_src = embedpressObj.pdf_renderer + ((embedpressObj.pdf_renderer.indexOf('?') === -1) ? '?' : '&') + 'scrolling=' + scrolling + '&selection_tool=' + selection_tool + '&spreads=' + spreads + '&file=' + getParamData(href);

			if (viewerStyle === 'flip-book') {
				pdf_viewer_src = embedpressObj.EMBEDPRESS_URL_ASSETS + 'pdf-flip-book/viewer.html?file=' + getParamData(href);
			}


			return (
				<Fragment>

					<BlockControls>
						<ToolbarButton
							className="components-edit-button"
							icon="edit"
							label={__('Re Upoload', 'embedpress')}
							onClick={() => setAttributes({ href: '' })}
						/>
					</BlockControls>

					{(fetching && mime !== 'application/pdf') ? <EmbedLoading /> : null}

					<div className={'embedpress-document-embed ep-doc-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} style={{ width: width + unitoption, maxWidth: '100%' }} id={`ep-doc-${this.props.clientId}`} data-source-id={'source-' + clientId} >

						<div className="gutenberg-wraper">
							<div className={`position-${sharePosition}-wraper gutenberg-pdf-wraper`}>
								{mime === 'application/pdf' && (

									(viewerStyle === 'modern') ? (
										<iframe title="" powered_by={powered_by} style={{ height: height, width: '100%' }} className={'embedpress-embed-document-pdf' + ' ' + id} data-emid={id} src={sanitizeUrl(pdf_viewer_src)}></iframe>
									) : (

										<iframe title="" powered_by={powered_by} style={{ height: height, width: '100%' }} className={'embedpress-embed-document-pdf' + ' ' + id} data-emid={id} src={sanitizeUrl(pdf_viewer_src)}></iframe>
									)


								)}

								{mime !== 'application/pdf' && (
									<Iframe title="" onMouseUponMouseUp={this.hideOverlay} style={{ height: height, width: width, display: fetching || !loadPdf ? 'none' : '' }} onLoad={this.onLoad} src={sanitizeUrl(url)} />
								)}
								{!interactive && (
									<div
										className="block-library-embed__interactive-overlay"
										onMouseUp={this.hideOverlay}
									/>
								)}
								{powered_by && (
									<p className="embedpress-el-powered">Powered By EmbedPress</p>
								)}

								{!fetching && <Logo id={id} />}
							</div>

							{
								contentShare &&
								<SocialShareHtml attributes={attributes} />
							}

						</div>
						{
							adManager && (adSource === 'image') && adFileUrl && (
								<AdTemplate attributes={attributes} setAttributes={setAttributes} deleteIcon={false} progressBar={false} inEditor={true} />
							)
						}


					</div>

					<InspectorControls key="inspector">
						<PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Embed Size', 'embedpress')}</div>}>

							<div className={'ep-pdf-width-contol'}>
								<ControlHeader classname={'ep-control-header'} headerText={'WIDTH'} />
								<RadioControl
									selected={unitoption}
									options={[
										{ label: '%', value: '%' },
										{ label: 'PX', value: 'px' },
									]}
									onChange={(unitoption) =>
										setAttributes({ unitoption })
									}
									className={'ep-unit-choice-option'}
								/>

								<RangeControl
									value={width}
									onChange={(width) =>
										setAttributes({ width })
									}
									max={widthMax}
									min={widthMin}
								/>

							</div>

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

						<PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Document Controls', 'embedpress')}</div>} initialOpen={false}>

							<TextControl
								label={__('Document URL', 'embedpress')}
								type="text"
								value={attributes.href || ''}
								onChange={(href) => setAttributes({ href })}
							/>

							<SelectControl
								label="Viewer Style"
								value={viewerStyle}
								options={[
									{ label: 'Modern', value: 'modern' },
									{ label: 'Flip Book', value: 'flip-book' },
								]}
								onChange={(viewerStyle) =>
									setAttributes({ viewerStyle })
								}
								__nextHasNoMarginBottom
							/>

							<SelectControl
								label="Theme"
								value={themeMode}
								options={[
									{ label: 'System Default', value: 'default' },
									{ label: 'Dark', value: 'dark' },
									{ label: 'Light', value: 'light' },
									{ label: 'Custom', value: 'custom' },
								]}
								onChange={(themeMode) =>
									setAttributes({ themeMode })
								}
								__nextHasNoMarginBottom
							/>

							{
								(themeMode === 'custom') && (
									<div>
										<ControlHeader headerText={'Color'} />
										<ColorPalette
											label={__("Color")}
											colors={colors}
											value={customColor}
											onChange={(customColor) => setAttributes({ customColor })}
										/>
									</div>
								)
							}

							{applyFilters('embedpress.pdfControls', [toobarPlaceholder], attributes, setAttributes, 'toolbar')}

							{
								toolbar && (
									<Fragment>


										{
											(viewerStyle === 'flip-book') ? (
												<ToggleGroupControl label="Toolbar Position" value={flipbook_toolbar_position} onChange={(flipbook_toolbar_position) => setAttributes({ flipbook_toolbar_position })}>
													<ToggleGroupControlOption value="top" label="Top" />
													<ToggleGroupControlOption value="bottom" label="Bottom" />
												</ToggleGroupControl>
											) : (
												<ToggleGroupControl label="Toolbar Position" value={position} onChange={(position) => setAttributes({ position })}>
													<ToggleGroupControlOption value="top" label="Top" />
													<ToggleGroupControlOption value="bottom" label="Bottom" />
												</ToggleGroupControl>
											)
										}


										<ToggleControl
											label={__('Presentation Mode', 'embedpress')}
											onChange={(presentation) =>
												setAttributes({ presentation })
											}
											checked={presentation}
										/>

										<ToggleControl
											label={__('Lazy Load', 'embedpress')}
											onChange={(lazyLoad) =>
												setAttributes({ lazyLoad })
											}
											checked={lazyLoad}
										/>

										{applyFilters('embedpress.pdfControls', [printPlaceholder], attributes, setAttributes, 'print')}


										{
											(viewerStyle === 'modern') ? (
												<Fragment>
													<ToggleControl
														label={__('Add Text', 'embedpress')}
														onChange={(add_text) =>
															setAttributes({ add_text })
														}
														checked={add_text}
													/>

													{applyFilters('embedpress.pdfControls', [drawPlaceholder], attributes, setAttributes, 'draw')}
													{applyFilters('embedpress.pdfControls', [copyPlaceholder], attributes, setAttributes, 'copyText')}


													<ToggleControl
														label={__('Add Image', 'embedpress')}
														onChange={(add_image) =>
															setAttributes({ add_image })
														}
														checked={add_image}
													/>
													<ToggleControl
														label={__('Rotation', 'embedpress')}
														onChange={(doc_rotation) =>
															setAttributes({ doc_rotation })
														}
														checked={doc_rotation}
													/>

													<ToggleControl
														label={__('Properties', 'embedpress')}
														onChange={(doc_details) =>
															setAttributes({ doc_details })
														}
														checked={doc_details}
													/>

													{applyFilters('embedpress.pdfControls', [selectionPlaceholder], attributes, setAttributes, 'selectionTool')}

													{applyFilters('embedpress.pdfControls', [scrollingPlaceholder], attributes, setAttributes, 'scrolling')}

													{
														scrolling !== '1' && (
															<SelectControl
																label="Default Spreads"
																value={spreads}
																options={[
																	{ label: 'No Spreads', value: '0' },
																	{ label: 'Odd Spreads', value: '1' },
																	{ label: 'Even Spreads', value: '2' },
																]}
																onChange={(spreads) =>
																	setAttributes({ spreads })
																}
																__nextHasNoMarginBottom
															/>
														)
													}

												</Fragment>
											) : (
												<Fragment>
													<ToggleControl
														label={__('Zoom In', 'embedpress')}
														onChange={(zoomIn) =>
															setAttributes({ zoomIn })
														}
														checked={zoomIn}
													/>
													<ToggleControl
														label={__('Zoom Out', 'embedpress')}
														onChange={(zoomOut) =>
															setAttributes({ zoomOut })
														}
														checked={zoomOut}
													/>
													<ToggleControl
														label={__('Fit View', 'embedpress')}
														onChange={(fitView) =>
															setAttributes({ fitView })
														}
														checked={fitView}
													/>
													<ToggleControl
														label={__('Bookmark', 'embedpress')}
														onChange={(bookmark) =>
															setAttributes({ bookmark })
														}
														checked={bookmark}
													/>
													<ToggleControl
														label={__('Flip Sound', 'embedpress')}
														onChange={(sound) =>
															setAttributes({ sound })
														}
														checked={sound}
													/>
												</Fragment>
											)
										}

										<ToggleControl
											label={__('Powered By', 'embedpress')}
											onChange={(powered_by) =>
												setAttributes({ powered_by })
											}
											checked={powered_by}
										/>


									</Fragment>
								)
							}
						</PanelBody>

						<AdControl attributes={attributes} setAttributes={setAttributes} />
						<LockControl attributes={attributes} setAttributes={setAttributes} />
						<ContentShare attributes={attributes} setAttributes={setAttributes} />

						<Upgrade />

					</InspectorControls>

					<style style={{ display: "none" }}>
						{
							`
							#block-${this.props.clientId} {
								width:-webkit-fill-available;
							}
							.embedpress-el-powered{
								max-width: ${width}
							}

							.alignright .embedpress-document-embed{
								float: right!important;
							}
							.alignleft .embedpress-document-embed{
								float: left;
							}

							.presentationModeEnabledIosDevice {
								position: fixed;
								left: 0;
								top: 0;
								border: 0;
								height: 100%!important;
								width: 100%!important;
								z-index: 999999;
								min-width: 100%!important;
								min-height: 100%!important;
							}

							`
						}
					</style>

					{
						adManager && (adSource === 'image') && (
							<style style={{ display: "none" }}>
								{
									`
							#block-${this.props.clientId} .main-ad-template div, .main-ad-template div img{
								height: 100%;
							}
							#block-${this.props.clientId} .main-ad-template {
								position: absolute;
								bottom: ${adYPosition}%;
								left: ${adXPosition}%;
							}
							`
								}
							</style>
						)
					}
				</Fragment >

			);
		}

	}

}

export default EmbedPressPDFEdit;
