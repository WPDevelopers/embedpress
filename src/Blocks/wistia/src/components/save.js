const save = (props) => {
	const { iframeSrc, width, height, enableLazyLoad, customPlayer } = props.attributes

	// Disable lazy loading if custom player is enabled
	const shouldLazyLoad = enableLazyLoad && !customPlayer;

	return (
		<div
			className="ose-wistia"
			data-embed-type="Wistia">
			{shouldLazyLoad ? (
				<div
					className="ep-lazy-iframe-placeholder"
					data-ep-lazy-src={iframeSrc}
					data-ep-iframe-allowtransparency="true"
					data-ep-iframe-frameborder="0"
					data-ep-iframe-class="wistia_embed"
					data-ep-iframe-name="wistia_embed"
					data-ep-iframe-width={width}
					data-ep-iframe-height={height}
					style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
				/>
			) : (
				<iframe
					src={iframeSrc}
					allowtransparency="true"
					frameBorder="0"
					className="wistia_embed"
					name="wistia_embed"
					width={width}
					height={height}
				></iframe>
			)}
		</div>
	);
};

export default save;
