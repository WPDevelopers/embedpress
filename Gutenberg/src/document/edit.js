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
		this.state = {
			hasError: false,
			showCopyConfirmation: false,
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
	}

	componentDidUpdate(prevProps) {
		// Reset copy confirmation state when block is deselected
		if (prevProps.isSelected && !this.props.isSelected) {
			this.setState({showCopyConfirmation: false});
		}
	}

	onSelectFile(media) {
		if (media && media.url) {
			console.log(media);
			this.setState({hasError: false});
			this.props.setAttributes({
				href: media.url,
				fileName: media.title,
				textLinkHref: media.url,
				id: media.id,
			});
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
		console.log(this.state);
		const {className, isSelected, attributes, setAttributes, noticeUI, media} = this.props;
		const {
			id,
			fileName,
			href,
			textLinkHref,
			textLinkTarget
		} = attributes;
		const {hasError, showCopyConfirmation} = this.state;
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
					<Iframe src={url}
							mozallowfullscreen="true" webkitallowfullscreen="true"/>
				</Fragment>
			);
		}

	}

};
export default DocumentEdit;
