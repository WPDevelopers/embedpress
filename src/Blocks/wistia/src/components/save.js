const save = (props) => {
	const {iframeSrc} = props.attributes
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
				width="600"
				height="330"></iframe>
		</div>
	);
};

export default save;
