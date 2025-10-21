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
const {useState, useEffect} = wp.element;
const {useBlockProps} = wp.blockEditor;
import {twitchIcon} from '../../../GlobalCoponents/icons';

export default function TwitchEdit({ attributes, setAttributes, isSelected }) {
	const blockProps = useBlockProps();
	const { url: attributeUrl, iframeSrc, width, height, unitoption } = attributes;

	const [state, setState] = useState({
		editingURL: false,
		url: attributeUrl || '',
		fetching: false,
		cannotEmbed: false,
		interactive: false,
	});

	const { editingURL, url, fetching, cannotEmbed, interactive } = state;

	// Reset interactive state when block is not selected
	useEffect(() => {
		if (!isSelected && interactive) {
			setState(prev => ({ ...prev, interactive: false }));
		}
	}, [isSelected, interactive]);

	const hideOverlay = () => {
		setState(prev => ({ ...prev, interactive: true }));
	};

	const onLoad = () => {
		setState(prev => ({ ...prev, fetching: false }));
	};

	const decodeHTMLEntities = (str) => {
		if (str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
		}
		return str;
	};

	const setUrl = (event) => {
		if (event) {
			event.preventDefault();
		}
		setAttributes({ url });
		var regEx = /http[s]?:\/\/(?:www\.|clips\.)twitch\.tv\/([0-9a-zA-Z\-\_]+)\/?(chat\/?$|[0-9a-z\-\_]*)?/
		if (url && url.match(regEx)) {
			var twitchIframeSrc = decodeHTMLEntities(url);
			var match = regEx.exec(twitchIframeSrc);
			var channelName = match[1];
			var type = "channel";
			var attrs;
			if (url.indexOf('clips.twitch.tv') > -1) {
				type = 'clip';
			} else if (url.indexOf('/videos/') > -1) {
				type = 'video';
			} else if (url.indexOf('#/chat$#') > -1) {
				type = 'chat';
			}
			switch (type) {
				case 'channel':
					twitchIframeSrc = 'https://player.twitch.tv/?channel=' + channelName;
					attrs = {
						scrolling: "no",
						frameborder: "0",
						allowfullscreen: "true"
					};
					break;

				case 'clip':
					twitchIframeSrc = 'https://clips.twitch.tv/embed?clip=' + channelName + '&autoplay=false';
					attrs = {
						scrolling: "no",
						frameborder: "0",
						allowfullscreen: "true"
					};
					break;

				case 'video':
					channelName = match[2];
					twitchIframeSrc = 'https://player.twitch.tv/?video=' + channelName;
					attrs = {
						scrolling: "no",
						frameborder: "0",
						allowfullscreen: "true"
					};
					break;

				case 'chat':
					twitchIframeSrc = 'http://www.twitch.tv/embed/' + channelName + '/chat';
					attrs = {
						scrolling: "yes",
						frameborder: "0",
						allowfullscreen: "true",
						id: "'" + channelName + "'"

					}
					break;
			}
			setState(prev => ({ ...prev, editingURL: false, cannotEmbed: false }));
			setAttributes({ iframeSrc: twitchIframeSrc, attrs })
		} else {
			setState(prev => ({
				...prev,
				cannotEmbed: true,
				editingURL: true
			}));
		}
	};

	const switchBackToURLInput = () => {
		setState(prev => ({ ...prev, editingURL: true }));
	};

	const label = __('Twitch URL');

	let width_class = '';
	if (unitoption == '%') {
		width_class = 'ep-percentage-width';
	} else {
		width_class = 'ep-fixed-width';
	}

	// No preview, or we can't embed the current URL, or we've clicked the edit button.
	if (!iframeSrc || editingURL) {
		return (
			<div {...blockProps}>
				<Inspector attributes={attributes} setAttributes={setAttributes} />
				<EmbedPlaceholder
					label={label}
					onSubmit={setUrl}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => setState(prev => ({ ...prev, url: event.target.value }))}
					icon={twitchIcon}
					DocTitle={__('Learn more about Twitch embed')}
					docLink={'https://embedpress.com/docs/embed-twitch-wordpress/'}
				/>
			</div>
		);
	} else {
		return (
			<div {...blockProps}>
				<Inspector attributes={attributes} setAttributes={setAttributes} />
				<div className={`embedpress-twitch-embed ${width_class}`} style={{width: unitoption === '%' ? `${width}%` : `${width}px`, height: `${height}px`}}>
					{fetching ? <EmbedLoading/> : null}

					<Iframe
						src={sanitizeUrl(iframeSrc)}
						onMouseUp={hideOverlay}
						onLoad={onLoad}
						style={{display: fetching ? 'none' : '', width: '100%', height: '100%'}}
						frameBorder="0"
						width={unitoption === '%' ? '100%' : width}
						height={height}
					/>

					{ ! interactive && (
						<div
							className="block-library-embed__interactive-overlay"
							onMouseUp={hideOverlay}
						/>
					) }

				</div>
			</div>
		)
	}
}
