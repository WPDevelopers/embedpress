const save = (props) => {
	const {
		iframeSrc,
		attrs,
		enableLazyLoad,
		customPlayer
	} = props.attributes
	const defaultClass = "ose-twitch-presentation"
	const IframeUrl = iframeSrc + '&parent=' + embedpressGutenbergData.twitch_host;

	// Disable lazy loading if custom player is enabled
	const shouldLazyLoad = enableLazyLoad && !customPlayer;

	return (
		<figure
			className={defaultClass}
			data-embed-type="Twitch">
			{shouldLazyLoad ? (
				<div
					className="ep-lazy-iframe-placeholder"
					data-ep-lazy-src={IframeUrl}
					data-ep-iframe-frameborder="0"
					data-ep-iframe-width="600"
					data-ep-iframe-height="450"
					style={{ width: '600px', height: '450px', maxWidth: '100%' }}
				/>
			) : (
				<iframe
					src={IframeUrl} {...attrs}
					frameBorder="0"
					width="600"
					height="450"></iframe>
			)}
		</figure>
	);
};

export default save;
