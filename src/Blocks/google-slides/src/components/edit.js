/**
 * Internal dependencies
 */
import EmbedControls from '../../../GlobalCoponents/embed-controls';
import EmbedLoading from '../../../GlobalCoponents/embed-loading';
import EmbedPlaceholder from '../../../GlobalCoponents/embed-placeholder';
import Iframe from '../../../GlobalCoponents/Iframe';
import { sanitizeUrl } from '../../../GlobalCoponents/helper';
import Inspector from './inspector';

/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;
import {googleSlidesIcon} from '../../../GlobalCoponents/icons';

class GoogleSlidesEdit extends Component {
	constructor() {
		super(...arguments);
		this.switchBackToURLInput = this.switchBackToURLInput.bind(this);
		this.setUrl = this.setUrl.bind(this);
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
			if (type && type == 'presentation') {
				if (iframeSrc.match(/pub\?/i)) {
					iframeSrc = iframeSrc.replace('/pub?', '/embed?');
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
		const {iframeSrc, width, height, unitoption} = this.props.attributes;

		if(iframeSrc && !this.isGoogleService(iframeSrc)) {
            return 'Invalid URL.';
        }

		const label = __('Google Slides URL');

		let width_class = '';
		if (unitoption == '%') {
			width_class = 'ep-percentage-width';
		} else {
			width_class = 'ep-fixed-width';
		}

		// No preview, or we can't embed the current URL, or we've clicked the edit button.
		if (!iframeSrc || editingURL) {
			return (
				<Fragment>
					<Inspector attributes={this.props.attributes} setAttributes={this.props.setAttributes} />
					<div>
						<EmbedPlaceholder
							label={label}
							onSubmit={this.setUrl}
							value={url}
							cannotEmbed={cannotEmbed}
							onChange={(event) => this.setState({url: event.target.value})}
							icon={googleSlidesIcon}
							DocTitle={__('Learn more about Google slides embed')}
							docLink={'https://embedpress.com/docs/embed-google-slides-wordpress/'}
						/>
					</div>
				</Fragment>
			);
		} else {
			return (
				<Fragment>
					<Inspector attributes={this.props.attributes} setAttributes={this.props.setAttributes} />
					<div className={`embedpress-google-slides-embed ${width_class}`} style={{width: unitoption === '%' ? `${width}%` : `${width}px`, height: `${height}px`}}>
						{fetching ? <EmbedLoading/> : null}

						<Iframe
							src={sanitizeUrl(iframeSrc)}
							onMouseUp={this.hideOverlay}
							onLoad={this.onLoad}
							style={{display: fetching ? 'none' : '', width: '100%', height: '100%'}}
							frameBorder="0"
							width={unitoption === '%' ? '100%' : width}
							height={height}
						/>

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
				</Fragment>
			)
		}

	}
};
export default GoogleSlidesEdit;
