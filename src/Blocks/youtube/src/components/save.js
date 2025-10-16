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
	const { iframeSrc, width, height } = attributes;

	if (!iframeSrc) {
		return null;
	}

	// Width class is now fixed
	const width_class = 'ep-fixed-width';

	return (
		<div {...blockProps}>
			<div
				className={`embedpress-youtube-embed ${width_class}`}
				style={{ width: `${width}px`, height: `${height}px` }}
				data-embed-type="YouTube"
			>
				<iframe
					src={sanitizeUrl(iframeSrc)}
					style={{ maxWidth: '100%', height: '100%' }}
					frameBorder="0"
					width={width}
					height={height}
					allowFullScreen
				/>
			</div>
		</div>
	);
};

export default save;
