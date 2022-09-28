/**
 * Internal dependencies
 */

import Iframe from '../common/Iframe';
import Logo from '../common/Logo';
import EmbedLoading from '../common/embed-loading';
/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { getBlobByURL, isBlobURL, revokeBlobURL } = wp.blob;
const { BlockIcon, MediaPlaceholder, InspectorControls } = wp.blockEditor;
const { Component, Fragment } = wp.element;
const { RangeControl, PanelBody, ExternalLink, ToggleControl } = wp.components;
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

import { PdfIcon } from '../common/icons'


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

	iframeManupulate(iframid) {
		console.log(iframid);
		var frm = document.querySelector(iframid).contentWindow.document;

		var otherhead = frm.getElementsByTagName("head")[0];
		console.log(frm);
		var link = frm.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", "http://development.local/wp-content/plugins/embedpress/Gutenberg/src/embedpress-pdf/style.css");
		otherhead.appendChild(link);
	}


	render() {
		const { attributes, noticeUI, setAttributes, clientId } = this.props;
		const { href, mime, id, width, height, powered_by, print, download, open, toolbar, copy_text, toolbar_position, doc_details, doc_rotation } = attributes;
		const { hasError, interactive, fetching, loadPdf } = this.state;
		const min = 1;
		const max = 1000;
		const docLink = 'https://embedpress.com/docs/embed-document/';


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
			const url = '//view.officeapps.live.com/op/embed.aspx?src=' + href;
			const pdf_viewer_src = embedpressObj.pdf_renderer + '?file=' + href
			return (
				<Fragment>

					{(fetching && mime !== 'application/pdf') ? <EmbedLoading /> : null}
					<div className={'embedpress-document-embed ep-doc-' + id} style={{ width: width, maxWidth: '100%' }} id={`ep-doc-${this.props.clientId}`}>
						{mime === 'application/pdf' && (
							<iframe style={{ height: height, width: width }} className={'embedpress-embed-document-pdf' + ' ' + id} data-emid={id} data-emsrc={href} src={pdf_viewer_src}></iframe>

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
							title={__('PDF Control Setting', 'embedpress')}
							initialOpen={false}
						>

							<ToggleControl
								label={__('Toolbar', 'embedpress')}
								description={__('Show or Hide toolbar. Note: If you disable toolbar access then every toolbar options will be disabled', 'embedpress')}
								onChange={(toolbar) =>
									setAttributes({ toolbar })
								}
								checked={toolbar}
							/>


							{
								toolbar && (
									<Fragment>
										<ToggleGroupControl label="Toolbar Position" value="top" >
											<ToggleGroupControlOption value="top" label="Top" />
											<ToggleGroupControlOption value="bottom" label="Bottom" />
										</ToggleGroupControl>

										<ToggleControl
											label={__('Print Access', 'embedpress')}
											onChange={(print) =>
												setAttributes({ print })
											}
											checked={print}
										/>

										<ToggleControl
											label={__('Print Access', 'embedpress')}
											onChange={(print) =>
												setAttributes({ print })
											}
											checked={print}
										/>
										<ToggleControl
											label={__('Open Access', 'embedpress')}
											onChange={(open) =>
												setAttributes({ open })
											}
											checked={open}
										/>
										<ToggleControl
											label={__('Download Access', 'embedpress')}
											onChange={(download) =>
												setAttributes({ download })
											}
											checked={download}
										/>
										<ToggleControl
											label={__('Text Copy Access', 'embedpress')}
											onChange={(copy_text) =>
												setAttributes({ copy_text })
											}
											checked={copy_text}
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


					{
						setTimeout(() => {
							this.iframeManupulate(`.${id}`)
						}, 1000)
					}

					<style style={{ display: "none" }}>
						{
							// (!toolbar) &&
							`
									#ep-doc-${this.props.clientId} .toolbar{
										display: none;
									}
									
								`
						}
					</style>
				</Fragment>

			);
		}

	}

}

export default EmbedPressPDFEdit;
