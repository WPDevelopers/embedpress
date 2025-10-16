const save = (props) => {
	const { iframeSrc, width, height } = props.attributes
	return (
		<div
			className="ose-wistia"
			data-embed-type="Wistia">
			<iframe
				src={iframeSrc}
				allowtransparency="true"
				frameBorder="0"
				className="wistia_embed"
				name="wistia_embed"
				width={width}
				height={height}
			></iframe>
		</div>
	);
};

export default save;
