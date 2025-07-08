/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;

/**
 * Internal dependencies
 */
import { sanitizeUrl } from '../../../GlobalCoponents/helper';

const save = ({ attributes }) => {
	const blockProps = useBlockProps.save();
	const { iframeSrc, width, height, unitoption } = attributes;

	if (!iframeSrc) {
		return null;
	}

	let width_class = '';
	if (unitoption == '%') {
		width_class = 'ep-percentage-width';
	} else {
		width_class = 'ep-fixed-width';
	}

	return (
		<div {...blockProps}>
			<div className={`embedpress-youtube-embed ${width_class}`} style={{width: unitoption === '%' ? `${width}%` : `${width}px`, height: `${height}px`}}>
				<iframe
					src={sanitizeUrl(iframeSrc)}
					style={{width: '100%', height: '100%'}}
					frameBorder="0"
					width={unitoption === '%' ? '100%' : width}
					height={height}
					allowFullScreen
				/>
			</div>
		</div>
	);
};

export default save;
