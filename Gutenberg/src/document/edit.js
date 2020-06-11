/**
 * Internal dependencies
 */

import Iframe from '../common/Iframe';

/**
 * WordPress dependencies
 */
import classnames from 'classnames';

const {__} = wp.i18n;
const {getBlobByURL, isBlobURL, revokeBlobURL} = wp.blob;
const {BlockControls, BlockIcon, MediaPlaceholder, MediaReplaceFlow} = wp.editor;
const {Component, Fragment} = wp.element;
const {BaseControl, Button, Disabled, PanelBody, withNotices,} = wp.components;
import {googleSlidesIcon} from '../common/icons'

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
		this.confirmCopyURL = this.confirmCopyURL.bind(this);
		this.resetCopyConfirmation = this.resetCopyConfirmation.bind(this);
		this.changeLinkDestinationOption = this.changeLinkDestinationOption.bind(
			this
		);
		this.changeOpenInNewWindow = this.changeOpenInNewWindow.bind(this);
		this.onUploadError = this.onUploadError.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.hideOverlay = this.hideOverlay.bind(this);
		this.state = {
			hasError: false,
			showCopyConfirmation: false,
			fetching:false,
			interactive: false,
			uniqId: 'embedpress-pdf-'+Date.now(),
			loadPdf: true,
		};
	}


	componentDidMount() {
		const {
			attributes,
			mediaUpload,
			noticeOperations
		} = this.props;
		const {href} = attributes;

		// Upload a file drag-and-dropped into the editor
		if (isBlobURL(href)) {
			const file = getBlobByURL(href);

			mediaUpload({
				filesList: [file],
				onFileChange: ([media]) => this.onSelectFile(media),
				onError: (message) => {
					this.setState({hasError: true});
					noticeOperations.createErrorNotice(message);
				},
			});

			revokeBlobURL(href);
		}

		if(this.props.attributes.href && this.props.attributes.mime === 'application/pdf' && this.state.loadPdf){
			this.setState({loadPdf: false});
			PDFObject.embed(this.props.attributes.href, "#"+this.state.uniqId);
		}

	}

	componentDidUpdate(prevProps) {

		// Reset copy confirmation state when block is deselected
		if (prevProps.isSelected && !this.props.isSelected) {
			this.setState({showCopyConfirmation: false});
		}

	}

	static getDerivedStateFromProps(nextProps, state) {
		if (!nextProps.isSelected && state.interactive) {
			return {interactive: false};
		}

		return null;
	}

	hideOverlay() {
		this.setState({interactive: true});
	}

	onLoad() {
		this.setState({
			fetching:false
		})
	}

	onSelectFile(media) {
		if (media && media.url) {
			this.setState({hasError: false});
			this.props.setAttributes({
				href: media.url,
				fileName: media.title,
				textLinkHref: media.url,
				id: media.id,
				mime: media.mime,
			});
			if(media.mime === 'application/pdf'){
				this.setState({loadPdf: false});
				PDFObject.embed(media.url, "#"+this.state.uniqId);
			}
		}

	}

	onUploadError(message) {
		const {noticeOperations} = this.props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	}

	confirmCopyURL() {
		this.setState({showCopyConfirmation: true});
	}

	resetCopyConfirmation() {
		this.setState({showCopyConfirmation: false});
	}

	changeLinkDestinationOption(newHref) {
		// Choose Media File or Attachment Page (when file is in Media Library)
		this.props.setAttributes({textLinkHref: newHref});
	}

	changeOpenInNewWindow(newValue) {
		this.props.setAttributes({
			textLinkTarget: newValue ? '_blank' : false,
		});
	}



	render() {
		const {className, isSelected, attributes, setAttributes, noticeUI, media} = this.props;
		const {href,mime} = attributes;
		const {hasError, showCopyConfirmation,interactive,fetching,uniqId,loadPdf} = this.state;
		const attachmentPage = media && media.link;

		if (!href || hasError) {

			return (
				<MediaPlaceholder
					icon={<BlockIcon icon={googleSlidesIcon}/>}
					labels={{
						title: __('Document'),
						instructions: __(
							'Upload a file or pick one from your media library for embed'
						),
					}}
					onSelect={this.onSelectFile}
					notices={noticeUI}
					allowedTypes={ALLOWED_MEDIA_TYPES}
					onError={this.onUploadError}
				/>
			);
		} else {
			const url = 'https://docs.google.com/viewer?url='+href+'&embedded=true';
			return (
				<Fragment>
					{ mime === 'application/pdf' && (
						<div loadPdf style={{display: loadPdf ? 'none' : ''}} id={uniqId}><span className="embedpress-pdf-loading">Loading PDF....</span></div>
					) }
					{ mime !== 'application/pdf' && (
						<Iframe onMouseUponMouseUp={ this.hideOverlay } style={{height:'600px',width:'600px',display: fetching || !loadPdf ? 'none' : ''}} onLoad={this.onLoad} src={url}
								mozallowfullscreen="true" webkitallowfullscreen="true"/>
					) }
					{ ! interactive && (
						<div
							className="block-library-embed__interactive-overlay"
							onMouseUp={ this.hideOverlay }
						/>
					) }
				</Fragment>
			);
		}

	}

};
export default DocumentEdit;
