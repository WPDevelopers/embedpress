/**
 * Internal dependencies
 */

import Iframe from '../common/Iframe';
import Logo from '../common/Logo';
import EmbedLoading from '../common/embed-loading';
import { saveSourceData } from '../common/helper';
/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { getBlobByURL, isBlobURL, revokeBlobURL } = wp.blob;
const { BlockIcon, MediaPlaceholder, InspectorControls } = wp.blockEditor;
const { Component, Fragment } = wp.element;
const { RangeControl, PanelBody, ExternalLink, ToggleControl } = wp.components;
import { epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../common/icons';
import DocControls from './doc-controls';


const ALLOWED_MEDIA_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.ms-powerpoint',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

class DocumentEdit extends Component {
	constructor() {
		super(...arguments);
		this.onSelectFile = this.onSelectFile.bind(this);

		this.onUploadError = this.onUploadError.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.hideOverlay = this.hideOverlay.bind(this);
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
			PDFObject.embed(this.props.attributes.href, "." + this.props.attributes.id);
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

			if (embedpressObj.embedpress_pro) {
				this.props.setAttributes({
					powered_by: false
				});
			}
			if (media.mime === 'application/pdf') {
				this.setState({ loadPdf: false });
				PDFObject.embed(media.url, "." + this.props.attributes.id);
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


	render() {

		const { attributes, noticeUI, setAttributes } = this.props;
		const { href, mime, id, width, height, themeMode, customColor, presentation, position, download, draw, toolbar, copy_text, doc_rotation, powered_by } = attributes;
		const { hasError, interactive, fetching, loadPdf } = this.state;
		const min = 1;
		const max = 1000;

		const docLink = 'https://embedpress.com/docs/embed-document/';


		if (!href || hasError) {

			return (
				<div className={"embedpress-document-editmode"}>
					<MediaPlaceholder
						icon={<BlockIcon icon={DocumentIcon} />}
						labels={{
							title: __('Document'),
							instructions: __(
								'Upload a file or pick one from your media library for embed.'
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
			const url = '//view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Ffile-examples.com%2Fstorage%2Ffe59cbbb63645c19f9c3014%2F2017%2F02%2Ffile-sample_100kB.doc';
			return (
				<Fragment>
					{(fetching && mime !== 'application/pdf') ? <EmbedLoading /> : null}
					<div className={'embedpress-document-embed ep-doc-' + id} style={{ height: height, width: width }}>
						{mime === 'application/pdf' && (
							<div style={{ height: height, width: width }} className={'embedpress-embed-document-pdf' + ' ' + id} data-emid={id} data-emsrc={href}></div>

						)}
						{mime !== 'application/pdf' && (
							<div className='ep-file-download-option-masked ep-gutenberg-file-doc ep-powered-by-enabled'>
								<Iframe title="" onMouseUponMouseUp={this.hideOverlay} style={{ height: height, width: width, display: fetching || !loadPdf ? 'none' : '' }} onLoad={this.onLoad} src={url} />
								{
									draw && (
										<canvas class="ep-doc-canvas" width="" height="" ></canvas>
									)
								}
								{
									toolbar && (
										<div class="ep-external-doc-icons">
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
							title={__('Embed Size', 'embedpress')}
						>
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

					</InspectorControls>
				</Fragment>
			);
		}

	}

};
export default DocumentEdit;
