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
import {wistiaIcon} from '../../../GlobalCoponents/icons';

class WistiaEdit extends Component {
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
			interactive: false,
			mediaId: ''
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
		});
		if (embedpressGutenbergData['wisita_options']) {
			let $state = {...this.state}
			setTimeout(function () {
				let script = document.createElement("script");
				script.src = "https://fast.wistia.com/assets/external/E-v1.js";
				script.charset = "ISO-8859-1"
				document.body.appendChild(script);
			}, 100);

			setTimeout(function () {
				let script = document.createElement("script");
				script.type = 'text/javascript';
				script.innerHTML = 'window.pp_embed_wistia_labels = ' + embedpressGutenbergData['wistia_labels'];
				document.body.appendChild(script);

				script = document.createElement("script");
				script.type = 'text/javascript';
				script.innerHTML = 'wistiaEmbed = Wistia.embed( \"' + $state.mediaId + '\", ' + embedpressGutenbergData.wisita_options + ' );';
				document.body.appendChild(script);
			}, 400);
		}

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
		if (url && (url.match(/^http[s]?:\/\/(?:www\.)?wistia\.com\/medias/i) || url.match(/^http[s]?:\/\/(?:www\.)?fast\/.wistia\.com\/embed\/medias/i.jsonp))) {
			let mediaIdMatches = url.match(/medias\/(.*)/);
			let mediaId = mediaIdMatches[1];
			let iframeSrc = '//fast.wistia.net/embed/iframe/' + mediaId;

			this.setState({editingURL: false, cannotEmbed: false, mediaId});
			setAttributes({iframeSrc});
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

	isWistia(url) {
		const wistiaUrlPattern = /^\/\/fast\.wistia\.net\/embed\/iframe\//;
		return wistiaUrlPattern.test(url);
	}

	render() {
		const {url, editingURL, fetching, cannotEmbed, interactive} = this.state;
		const {iframeSrc} = this.props.attributes;

		if(iframeSrc && !this.isWistia(iframeSrc)) {
            return 'Invalid URL.';
        }

		const label = __('Wistia URL');

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
						icon={wistiaIcon}
						DocTitle={__('Learn more about Wistia embed')}
						docLink={'https://embedpress.com/docs/embed-wistia-wordpress/'}
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
export default WistiaEdit;
