const save = (props) => {
	const {
		iframeSrc,
		attrs
	} = props.attributes
	const defaultClass = "ose-twitch-presentation"
	const IframeUrl = iframeSrc + '&parent=' + embedpressGutenbergData.twitch_host;
	return (
		<figure
			className={defaultClass}>
			<iframe
				src={IframeUrl} {...attrs}
				frameBorder="0"
				width="600"
				height="450"></iframe>
		</figure>
	);
};

export default save;
