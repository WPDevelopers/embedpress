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
	const { iframeSrc, width, height, enableLazyLoad, customPlayer } = attributes;

	if (!iframeSrc) {
		return null;
	}

	// Width class is now fixed
	const width_class = 'ep-fixed-width';

	// Disable lazy loading if custom player is enabled
	const shouldLazyLoad = enableLazyLoad && !customPlayer;

	return (
		<div {...blockProps}>
			<div
				className={`embedpress-youtube-embed ${width_class}`}
				style={{ width: `${width}px`, height: `${height}px` }}
				data-embed-type="YouTube"
			>
				{shouldLazyLoad ? (
					<div
						className="ep-lazy-iframe-placeholder"
						data-ep-lazy-src={sanitizeUrl(iframeSrc)}
						data-ep-iframe-style={`max-width: 100%; height: 100%;`}
						data-ep-iframe-frameborder="0"
						data-ep-iframe-width={width}
						data-ep-iframe-height={height}
						data-ep-iframe-allowfullscreen="true"
						style={{ maxWidth: '100%', height: '100%' }}
					/>
				) : (
					<iframe
						src={sanitizeUrl(iframeSrc)}
						style={{ maxWidth: '100%', height: '100%' }}
						frameBorder="0"
						width={width}
						height={height}
						allowFullScreen
					/>
				)}
			</div>
		</div>
	);
};

export default save;
