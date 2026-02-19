/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;
import md5 from "md5";

/**
 * Internal dependencies
 */
import { sanitizeUrl, getIframeTitle } from '../../../GlobalCoponents/helper';

const save = ({ attributes }) => {
	const blockProps = useBlockProps.save();
	const { iframeSrc, width, height, enableLazyLoad, customPlayer, clientId } = attributes;

	if (!iframeSrc) {
		return null;
	}

	// Width class is now fixed
	const width_class = 'ep-fixed-width';

	// Disable lazy loading if custom player is enabled
	const shouldLazyLoad = enableLazyLoad && !customPlayer;

	// Generate client ID hash for content protection
	const _md5ClientId = md5(clientId || '');

	return (
		<div {...blockProps}>
			<div id={`ep-gutenberg-content-${_md5ClientId}`} className="ep-gutenberg-content">
				<div
					className={`embedpress-youtube-embed ${width_class}`}
					style={{ maxWidth: '100%', width: `${width}px`, height: `${height}px` }}
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
							data-ep-iframe-title={getIframeTitle(iframeSrc)}
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
							title={getIframeTitle(iframeSrc)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default save;
