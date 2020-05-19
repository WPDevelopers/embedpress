/**
 * Internal dependencies
 */
import EmbedControls from "../common/embed-controls";
import EmbedLoading from "../common/embed-loading";
import EmbedPlaceholder from "../common/embed-placeholder";
import Iframe from "../common/Iframe";
import {youtubeIcon} from "../common/icons";


/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

class YoutubeEdit extends Component {
	constructor() {
		super(...arguments);
		this.switchBackToURLInput = this.switchBackToURLInput.bind(this);
		this.setUrl = this.setUrl.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.hideOverlay = this.hideOverlay.bind( this );
		this.state = {
			editingURL: false,
			url: this.props.attributes.url,
			fetching: true,
			cannotEmbed: false,
			interactive: false
		};
	}

	static getDerivedStateFromProps( nextProps, state ) {
		if ( ! nextProps.isSelected && state.interactive ) {
			return { interactive: false };
		}

		return null;
	}

	hideOverlay() {
		this.setState( { interactive: true } );
	}

	componentWillMount() {
		if (this.state.url) {
			this.setUrl();
		}
	}

	onLoad() {
		this.setState({
			fetching: false
		});
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

	render() {
		const {url, editingURL, fetching, cannotEmbed,interactive} = this.state;
		const {iframeSrc, attrs} = this.props.attributes;
		const label = __("Youtube URL");
		// No preview, or we can't embed the current URL, or we've clicked the edit button.
		if (!iframeSrc || editingURL) {
			return (
				<EmbedPlaceholder
					label={label}
					onSubmit={this.setUrl}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={event => this.setState({url: event.target.value})}
					icon={youtubeIcon}
					DocTitle={__('Learn More About Youtube Embed')}
					docLink={'https://embedpress.com/docs/embed-youtube-wordpress/'}

				/>
			);
		} else {
			return (
				<Fragment>
					{fetching ? <EmbedLoading/> : null}

						<Iframe
							src={iframeSrc}
							{...attrs}
							onLoad={this.onLoad}
							style={{display: fetching ? "none" : ""}}
							width="640"
							onFocus={ this.hideOverlay }
							height="450" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"
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
				</Fragment>
			);
		}
	}
}

export default YoutubeEdit;
