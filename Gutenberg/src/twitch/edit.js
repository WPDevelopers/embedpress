/**
 * Internal dependencies
 */
import EmbedControls from '../common/embed-controls';
import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from '../common/embed-placeholder';
import Iframe from '../common/Iframe';

/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;
import {twitchIcon} from '../common/icons'

class TwitchEdit extends Component {
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
		var regEx = /http[s]?:\/\/(?:www\.|clips\.)twitch\.tv\/([0-9a-zA-Z\-\_]+)\/?(chat\/?$|[0-9a-z\-\_]*)?/
		if (url && url.match(regEx)) {
			var iframeSrc = this.decodeHTMLEntities(url);
			var match = regEx.exec(iframeSrc);
			var channelName = match[1];
			console.log(channelName);
			var type = "channel";
			var attrs;
			if (url.indexOf('clips.twitch.tv') > -1) {
				type = 'clip';
			} else if (url.indexOf('/videos/') > -1) {
				type = 'video';
			} else if (url.indexOf('#/chat$#') > -1) {
				type = 'chat';
			}
			console.log(type)
			switch (type) {
				case 'channel':
					iframeSrc = 'https://player.twitch.tv/?channel=' + channelName;
					attrs = {
						scrolling: "no",
						frameborder: "0",
						allowfullscreen: "true"
					};
					break;

				case 'clip':
					iframeSrc = 'https://clips.twitch.tv/embed?clip=' + channelName + '&autoplay=false';
					attrs = {
						scrolling: "no",
						frameborder: "0",
						allowfullscreen: "true"
					};
					break;

				case 'video':
					channelName = match[2];
					iframeSrc = 'https://player.twitch.tv/?video=' + channelName;
					attrs = {
						scrolling: "no",
						frameborder: "0",
						allowfullscreen: "true"
					};
					break;

				case 'chat':
					iframeSrc = 'http://www.twitch.tv/embed/' + channelName + '/chat';
					attrs = {
						scrolling: "yes",
						frameborder: "0",
						allowfullscreen: "true",
						id: "'" + channelName + "'"

					}
					break;
			}
			this.setState({editingURL: false, cannotEmbed: false});
			setAttributes({iframeSrc, attrs})
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
		const {url, editingURL, fetching, cannotEmbed,interactive} = this.state;
		const {iframeSrc, attrs} = this.props.attributes;

		const label = __('Twitch URL');
		// No preview, or we can't embed the current URL, or we've clicked the edit button.
		if (!iframeSrc || editingURL) {
			return (
				<EmbedPlaceholder
					label={label}
					onSubmit={this.setUrl}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => this.setState({url: event.target.value})}
					icon={twitchIcon}
					DocTitle={__('Learn more about twitch embed')}
					docLink={'https://embedpress.com/docs/embed-twitch-streams-chat/'}
				/>
			);
		} else {
			const IframeUrl = iframeSrc+'&parent='+embedpressObj.twitch_host;
			return (
				<Fragment>
					{fetching ? <EmbedLoading/> : null}

					<Iframe src={IframeUrl}  {...attrs}
							onLoad={this.onLoad}
							style={{display: fetching ? 'none' : ''}}
							onFocus={this.hideOverlay}
							width="600"
							height="450"/>

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

			)
		}
	}
};
export default TwitchEdit;
