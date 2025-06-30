const save = (props) => {
	const {iframeSrc} = props.attributes
	const defaultClass = 'ose-google-docs-slides'
	return (
		<figure
			className={defaultClass}>
			<iframe
				src={iframeSrc}
				frameBorder="0"
				width="600"
				height="450"
				allowFullScreen="true"
				mozallowfullscreen="true"
				webkitallowfullscreen="true"></iframe>
		</figure>
	);
};

export default save;
