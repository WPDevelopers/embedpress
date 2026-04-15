import { getIframeTitle } from '../../../GlobalCoponents/helper';
import md5 from "md5";

const save = (props) => {
	const {
		iframeSrc,
		attrs,
		enableLazyLoad,
		customPlayer,
		clientId,
		autoplay,
		twitchMute,
		twitchTheme,
		twitchFullscreen,
		twitchChat,
		startTime,
		width,
		height,
	} = props.attributes;

	const defaultClass = "ose-twitch-presentation";

	// Build full embed URL with settings
	let IframeUrl = iframeSrc;

	// Add Twitch control params
	const separator = IframeUrl.indexOf('?') > -1 ? '&' : '?';
	const params = [];

	params.push('autoplay=' + (autoplay ? 'true' : 'false'));
	params.push('muted=' + (twitchMute ? 'true' : 'false'));
	params.push('allowfullscreen=' + (twitchFullscreen ? 'true' : 'false'));
	params.push('theme=' + (twitchTheme || 'dark'));
	params.push('layout=' + (twitchChat ? 'video-with-chat' : 'video'));

	if (startTime > 0) {
		const ta = new Date(startTime * 1000);
		const h = ta.getUTCHours() + 'h';
		const m = ta.getUTCMinutes() + 'm';
		const s = ta.getUTCSeconds() + 's';
		params.push('time=' + h + m + s);
	}

	// Add parent domain
	if (typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.twitch_host) {
		params.push('parent=' + embedpressGutenbergData.twitch_host);
	}

	IframeUrl = IframeUrl + separator + params.join('&');

	// Disable lazy loading if custom player is enabled
	const shouldLazyLoad = enableLazyLoad && !customPlayer;

	// Generate client ID hash for content protection
	const _md5ClientId = md5(clientId || '');

	return (
		<div id={`ep-gutenberg-content-${_md5ClientId}`} className="ep-gutenberg-content">
			<figure
				className={defaultClass}
				data-embed-type="Twitch">
				{shouldLazyLoad ? (
					<div
						className="ep-lazy-iframe-placeholder"
						data-ep-lazy-src={IframeUrl}
						data-ep-iframe-frameborder="0"
						data-ep-iframe-width={width || 600}
						data-ep-iframe-height={height || 450}
						data-ep-iframe-title={getIframeTitle(iframeSrc)}
						style={{ width: (width || 600) + 'px', height: (height || 450) + 'px', maxWidth: '100%' }}
					/>
				) : (
					<iframe
						src={IframeUrl} {...attrs}
						frameBorder="0"
						width={width || 600}
						title={getIframeTitle(iframeSrc)}
						height={height || 450}></iframe>
				)}
			</figure>
		</div>
	);
};

export default save;
