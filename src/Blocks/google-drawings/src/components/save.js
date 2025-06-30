const save = (props) => {
	const {iframeSrc} = props.attributes
	const defaultClass = 'ose-google-docs-drawings'
	return (
		<figure
			className={defaultClass}>
			<img
				src={iframeSrc}
				width="960"
				height="720"/>
		</figure>
	);
};

export default save;
