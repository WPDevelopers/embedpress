/**
 * Internal dependencies
 */

import Iframe from '../common/Iframe';
import Logo from '../common/Logo';
import EmbedLoading from '../common/embed-loading';
import apiFetch from '@wordpress/api-fetch';


/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { getBlobByURL, isBlobURL, revokeBlobURL } = wp.blob;
const { BlockIcon, MediaPlaceholder, InspectorControls } = wp.blockEditor;
const { Component, Fragment } = wp.element;
const { RangeControl, PanelBody, ExternalLink, ToggleControl, SelectControl } = wp.components;

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

import { PdfIcon } from '../common/icons'

const { useEffect } = wp.element;


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
		this.iframeManupulate = this.iframeManupulate.bind(this);
		this.setThemeMode = this.setThemeMode.bind(this);
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
			noticeOperations
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

	}

	onUploadError(message) {
		const { noticeOperations } = this.props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	}

	isDisplay(selectorName) {
		if (!selectorName) {
			selectorName = 'none';
		}
		else {
			selectorName = 'block';
		}

		return selectorName;
	}



	iframeManupulate(iframid, themeMode, presentation, position, download, open, toolbar, copy_text, toolbar_position, doc_details, doc_rotation) {


		const setEPInterval = setInterval(() => {
			let settingsPos = '';
			const frm = document.querySelector(iframid).contentWindow.document;

			const otherhead = frm.getElementsByTagName("head")[0];
			const style = frm.createElement("style");
			style.setAttribute('id', 'EBiframeStyleID');


			if (toolbar === false) {
				presentation = false; download = true; open = false; copy_text = true; toolbar_position = false; doc_details = false; doc_rotation = false;
			}

			toolbar = this.isDisplay(toolbar);
			presentation = this.isDisplay(presentation);
			download = this.isDisplay(download);
			open = this.isDisplay(open);
			copy_text = this.isDisplay(copy_text);


			if (copy_text === 'block') {
				copy_text = 'all';
			}

			doc_details = this.isDisplay(doc_details);
			doc_rotation = this.isDisplay(doc_rotation);

			if (position === 'top') {
				position = 'top:0;bottom:auto;'
				settingsPos = '';
			}
			else {
				position = 'bottom:0;top:auto;'
				settingsPos = `
				.findbar, .secondaryToolbar {
					top: auto;bottom: 32px;
				}
				.doorHangerRight:after{
					transform: rotate(180deg);
					bottom: -16px;
				}
				 .doorHangerRight:before {
					transform: rotate(180deg);
					bottom: -18px;
				}

				.findbar.doorHanger:before {
					bottom: -18px;
					transform: rotate(180deg);
				}
				.findbar.doorHanger:after {
					bottom: -16px;
					transform: rotate(180deg);
				}
			`;
			}
			style.textContent = `
			.toolbar{
				display: ${toolbar}!important;
				position: absolute;
				${position}

			}

			#secondaryToolbar{
				display: ${toolbar};
			}
			#secondaryPresentationMode, #toolbarViewerRight #presentationMode{
				display: ${presentation}!important;
			}
			#secondaryOpenFile, #toolbarViewerRight #openFile{
				display: ${open}!important;
			}
			#secondaryDownload, #secondaryPrint, #toolbarViewerRight #print, #toolbarViewerRight #download{
				display: ${download}!important;
			}
			#pageRotateCw{
				display: ${doc_rotation}!important;
			}
			#pageRotateCcw{
				display: ${doc_rotation}!important;
			}
			#documentProperties{
				display: ${doc_details}!important;
			}
			.textLayer{
				user-select: ${copy_text}!important;
			}

			${settingsPos}

		`;

			this.setThemeMode(iframid, themeMode);

			if (otherhead) {
				if (frm.getElementById("EBiframeStyleID")) {
					frm.getElementById("EBiframeStyleID").remove();
				}
				otherhead.appendChild(style);
				clearInterval(setEPInterval);
			}

		}, 100);
	}

	//Create theme mode function
	setThemeMode(iframid, themeMode) {
		const frm = document.querySelector(iframid).contentWindow.document;
		const htmlEL = frm.getElementsByTagName("html")[0];
		if (htmlEL) {
			htmlEL.setAttribute('ep-data-theme', themeMode);
		}
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


		const { attributes, noticeUI, setAttributes, clientId } = this.props;

		const { href, mime, id, width, height, powered_by, themeMode, presentation, position, download, open, toolbar, copy_text, toolbar_position, doc_details, doc_rotation } = attributes;


		const { hasError, interactive, fetching, loadPdf } = this.state;
		const min = 1;
		const max = 1000;
		const docLink = 'https://embedpress.com/docs/embed-document/';
		const isProPluginActive = embedpressObj.is_pro_plugin_active;

		if (!isProPluginActive) {
			setAttributes({ download: true });
			setAttributes({ copy_text: true });
		}

		if (!document.querySelector('.pro__alert__wrap')) {
			document.querySelector('body').append(this.isPro('none'));
			this.removeAlert();
		}

		function embed(href) {
			let pdf_params = '';

			//Generate PDF params
			let _pdf_params = {
				themeMode: themeMode ? themeMode : 'default',
				presentation: presentation ? presentation : false,
				position: position ? position : 'top',
				download: download ? download : false,
				toolbar: toolbar ? toolbar : false,
				copy_text: copy_text ? copy_text : false,
				toolbar_position: toolbar_position ? toolbar_position : 'top',
				doc_details: doc_details ? doc_details : false,
				doc_rotation: doc_rotation ? doc_rotation : false,
			};

			pdf_params = new URLSearchParams(_pdf_params).toString();

			let __url = href.split('#');
			__url = encodeURIComponent(__url[0]);

			return `${__url}#${pdf_params}`;
		}

		// embed();
			console.log(embed(href));

		// embed().then(data => {
		// 	console.log(data);
		// });

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
			const url = '//view.officeapps.live.com/op/embed.aspx?src=' + embed(href);
			const pdf_viewer_src = embedpressObj.pdf_renderer + '?file=' + embed(href);

			this.iframeManupulate(`.${id}`, themeMode, presentation, position, download, open, toolbar, copy_text, toolbar_position, doc_details, doc_rotation);

			return (
				<Fragment>

					{(fetching && mime !== 'application/pdf') ? <EmbedLoading /> : null}
					<div className={'embedpress-document-embed ep-doc-' + id} style={{ width: width, maxWidth: '100%' }} id={`ep-doc-${this.props.clientId}`}>
						{mime === 'application/pdf' && (
							<iframe powered_by={powered_by} style={{ height: height, width: width }} className={'embedpress-embed-document-pdf' + ' ' + id} data-emid={id} data-emsrc={href} src={pdf_viewer_src}></iframe>

						)}

						{mime !== 'application/pdf' && (
							<Iframe onMouseUponMouseUp={this.hideOverlay} style={{ height: height, width: width, display: fetching || !loadPdf ? 'none' : '' }} onLoad={this.onLoad} src={url} />
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

					<InspectorControls key="inspector">
						<PanelBody
							title={__('Embed Size(px)', 'embedpress')}
						>
							<RangeControl
								label={__(
									'Width',
									'embedpress'
								)}
								value={width}
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

						<PanelBody
							title={__('PDF Control Settings', 'embedpress')}
							initialOpen={false}
						>

							<SelectControl
								label="Theme"
								value={themeMode}
								options={[
									{ label: 'System Default', value: 'dafult' },
									{ label: 'Dark', value: 'dark' },
									{ label: 'Light', value: 'light' },
								]}
								onChange={(themeMode) =>
									setAttributes({ themeMode })
								}
								__nextHasNoMarginBottom
							/>

							<div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { this.addProAlert(e, isProPluginActive) }}>
								<ToggleControl
									label={__('Toolbar', 'embedpress')}
									description={__('Show or Hide toolbar. Note: If you disable toolbar access then every toolbar options will be disabled', 'embedpress')}
									onChange={(toolbar) =>
										setAttributes({ toolbar })
									}
									checked={toolbar}
									style={{ marginTop: '30px' }}
								/>
								{
									(!isProPluginActive) && (
										<span className='isPro'>{__('pro', 'embedpress')}</span>
									)
								}
							</div>


							{
								toolbar && (
									<Fragment>
										<ToggleGroupControl label="Toolbar Position" value={position} onChange={(position) => setAttributes({ position })}>
											<ToggleGroupControlOption value="top" label="Top" />
											<ToggleGroupControlOption value="bottom" label="Bottom" />
										</ToggleGroupControl>


										<ToggleControl
											label={__('Presentation Mode', 'embedpress')}
											onChange={(presentation) =>
												setAttributes({ presentation })
											}
											checked={presentation}
										/>

										<div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { this.addProAlert(e, isProPluginActive) }}>
											<ToggleControl
												label={__('Print/Download', 'embedpress')}
												onChange={(download) =>
													setAttributes({ download })
												}
												checked={download}
											/>
											{
												(!isProPluginActive) && (
													<span className='isPro'>{__('pro', 'embedpress')}</span>
												)
											}
										</div>

										<div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { this.addProAlert(e, isProPluginActive) }}>
											<ToggleControl
												label={__('Copy Text', 'embedpress')}
												onChange={(copy_text) =>
													setAttributes({ copy_text })
												}
												checked={copy_text}
												className={'disabled'}
											/>
											{
												(!isProPluginActive) && (
													<span className='isPro'>{__('pro', 'embedpress')}</span>
												)
											}
										</div>
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
					</InspectorControls>

					<style style={{ display: "none" }}>
						{
							`
							#block-${clientId} {
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

							`
						}
					</style>
				</Fragment >

			);
		}

	}

}

export default EmbedPressPDFEdit;
