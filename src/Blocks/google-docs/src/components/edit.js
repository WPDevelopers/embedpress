/**
 * Internal dependencies
 */
import EmbedControls from '../../../GlobalCoponents/embed-controls';
import EmbedLoading from '../../../GlobalCoponents/embed-loading';
import EmbedPlaceholder from '../../../GlobalCoponents/embed-placeholder';
import Iframe from '../../../GlobalCoponents/Iframe';
import { sanitizeUrl } from '../../../GlobalCoponents/helper';

/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {Component} = wp.element;
import {googleDocsIcon} from '../../../GlobalCoponents/icons';

class GoogleDocsEdit extends Component {
	constructor() {
		super(...arguments);
		this.switchBackToURLInput = this.switchBackToURLInput.bind(this);
		this.setUrl = this.setUrl.bind(this);
		this.updateAlignment = this.updateAlignment.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.hideOverlay = this.hideOverlay.bind(this);
		this.state = {
			editingURL: false,
			url: this.props.attributes.url,
			fetching: true,
			cannotEmbed: false,
			interactive: false
		};
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
			fetching: false
		})
	}

	decodeHTMLEntities(str) {
		if (str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');

		}
		return str;
	}

	updateAlignment(nextAlign) {
		const {setAttributes} = this.props;
		const extraUpdatedAttributes =
			['wide', 'full'].indexOf(nextAlign) !== -1
				? {width: undefined, height: undefined}
				: {};
		setAttributes({
			...extraUpdatedAttributes,
			align: nextAlign,
		});
	}


	setUrl(event) {
		if (event) {
			event.preventDefault();
		}
		const {url} = this.state;
		const {setAttributes} = this.props;
		setAttributes({url});
		if (url && url.match(/^http[s]?:\/\/((?:www\.)?docs\.google\.com(?:.*)?(?:document|presentation|spreadsheets|forms|drawings)\/[a-z0-9\/\?=_\-\.\,&%\$#\@\!\+]*)/i)) {
			var iframeSrc = this.decodeHTMLEntities(url);
			var regEx = /google\.com(?:.+)?(document|presentation|spreadsheets|forms|drawings)/i;
			var match = regEx.exec(iframeSrc);
			var type = match[1];
			if (type && type === 'document') {
				if (!iframeSrc.match(/([?&])embedded=true/i)) {
					if (iframeSrc.indexOf('?') > -1) {
						iframeSrc += '&embedded=true';
					} else {
						iframeSrc += '?embedded=true'
					}
				}
				this.setState({editingURL: false, cannotEmbed: false});
				setAttributes({iframeSrc: iframeSrc})
			} else {
				this.setState({
					cannotEmbed: true,
					editingURL: true
				})
			}
		} else {
			this.setState({
				cannotEmbed: true,
				editingURL: true
			})
		}
	}

	switchBackToURLInput() {
		this.setState({editingURL: true});
	}

	isGoogleService(url) {
        var googleRegex = /(?:https?:\/\/)?(?:[^./]+\.)?google\.(com?\.)?[a-z]+(?:\.[a-z]+)?/;
        return googleRegex.test(url);
    }

	render() {
		const {url, editingURL, fetching, cannotEmbed, interactive} = this.state;
		const {iframeSrc} = this.props.attributes;

		if(iframeSrc && !this.isGoogleService(iframeSrc)) {
            return 'Invalid URL.';
        }

		const label = __('Google Docs URL');

		// No preview, or we can't embed the current URL, or we've clicked the edit button.
		if (!iframeSrc || editingURL) {
			return (
				<div>
					<EmbedPlaceholder
						label={label}
						onSubmit={this.setUrl}
						value={url}
						cannotEmbed={cannotEmbed}
						onChange={(event) => this.setState({url: event.target.value})}
						icon={googleDocsIcon}
						DocTitle={__('Learn more about Google doc embed')}
						docLink={'https://embedpress.com/docs/embed-google-docs-wordpress/'}
					/>
				</div>

			);
		} else {
			return (
				<div>
					{fetching ? <EmbedLoading/> : null}

						<Iframe src={sanitizeUrl(iframeSrc)} onMouseUp={ this.hideOverlay } onLoad={this.onLoad} style={{display: fetching ? 'none' : ''}}
								frameBorder="0" width="600" height="450"/>

					{ ! interactive && (
						<div
							className="block-library-embed__interactive-overlay"
							onMouseUp={ this.hideOverlay }
						/>
					) }

					<EmbedControls
						showEditButton={iframeSrc && !cannotEmbed}
						switchBackToURLInput={this.switchBackToURLInput}
					/>
				</div>
			)
		}

	}
};
export default GoogleDocsEdit;
