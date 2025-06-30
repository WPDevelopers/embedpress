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
import {youtubeIcon} from '../../../GlobalCoponents/icons';

class YouTubeEdit extends Component {
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
		if (str && typeof str === "string") {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "");
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
		const matches = url.match(
			/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
		);
		if (url && matches) {
			let mediaId = matches[1];
			let iframeSrc = "https://www.youtube.com/embed/" + mediaId;
			let iframeUrl = new URL(iframeSrc);

			// // If your expected result is "http://foo.bar/?x=42&y=2"
			if (typeof embedpressProObj !== 'undefined') {
				for (var key in embedpressProObj.youtubeParams) {
					iframeUrl.searchParams.set(
						key,
						embedpressProObj.youtubeParams[key]
					);
				}
			}

			this.setState({editingURL: false, cannotEmbed: false});
			setAttributes({iframeSrc: iframeUrl.href, mediaId});

		} else {
			this.setState({
				cannotEmbed: true,
				editingURL: true
			});
		}
	}

	switchBackToURLInput() {
		this.setState({editingURL: true});
	}

	isYoutube(url) {
		// Regular expression to match if URL contains youtube.com
		var youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		return youtubeRegex.test(url);
	}

	render() {
		const {url, editingURL, fetching, cannotEmbed, interactive} = this.state;
		const {iframeSrc} = this.props.attributes;

		if(iframeSrc && !this.isYoutube(iframeSrc)) {
            return 'Invalid URL.';
        }

		const label = __('YouTube URL');

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
						icon={youtubeIcon}
						DocTitle={__('Learn more about YouTube embed')}
						docLink={'https://embedpress.com/docs/embed-youtube-wordpress/'}
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
export default YouTubeEdit;
