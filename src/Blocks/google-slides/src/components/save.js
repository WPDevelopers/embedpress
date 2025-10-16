const save = (props) => {
	const {iframeSrc, width, height, unitoption } = props.attributes
	const defaultClass = 'ose-google-docs-slides'
	return (
		<figure
			className={defaultClass}
			data-embed-type="Google Slides">
			<iframe
				src={iframeSrc}
				frameBorder="0"
				style={{width: unitoption === '%' ? width + '%' : width + 'px', height: height + 'px'}}
				allowFullScreen="true"
				mozallowfullscreen="true"
				webkitallowfullscreen="true"></iframe>
		</figure>
	);
};

export default save;
