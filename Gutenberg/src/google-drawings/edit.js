/**
 * Internal dependencies
 */
import EmbedControls from '../common/embed-controls';
import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from '../common/embed-placeholder';

/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;
import {googleDrawingsIcon} from '../common/icons';

class GoogleDrawingEdit extends Component {
	constructor() {
		super(...arguments);
		this.switchBackToURLInput = this.switchBackToURLInput.bind(this);
		this.setUrl = this.setUrl.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.state = {
			editingURL: false,
			url: this.props.attributes.url,
			fetching: true,
			cannotEmbed: false
		};
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
			if (type && type == 'drawings') {
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

	render() {
		const {url, editingURL, fetching, cannotEmbed} = this.state;
		const {iframeSrc} = this.props.attributes;

		const label = __('Google Drawings URL (Get your link from File -> Publish to the web -> Link)');

		// No preview, or we can't embed the current URL, or we've clicked the edit button.
		if (!iframeSrc || editingURL) {
			return (
				<EmbedPlaceholder
					label={label}
					onSubmit={this.setUrl}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => this.setState({url: event.target.value})}
					icon={googleDrawingsIcon}
					DocTitle={__('Learn more about Google drawing embed')}
					docLink={'https://embedpress.com/docs/embed-google-drawings-wordpress/'}
				/>
			);
		} else {

			return (
				<Fragment>
					{fetching ? <EmbedLoading/> : null}
					<img src={iframeSrc} onLoad={this.onLoad} style={{display: fetching ? 'none' : ''}} width="960"
						 height="720"/>
					<EmbedControls
						showEditButton={iframeSrc && !cannotEmbed}
						switchBackToURLInput={this.switchBackToURLInput}
					/>
				</Fragment>

			)
		}
	}
};
export default GoogleDrawingEdit;
