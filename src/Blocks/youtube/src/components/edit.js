/**
 * Internal dependencies
 */
import EmbedControls from '../../../GlobalCoponents/embed-controls';
import EmbedLoading from '../../../GlobalCoponents/embed-loading';
import EmbedPlaceholder from '../../../GlobalCoponents/embed-placeholder';
import Iframe from '../../../GlobalCoponents/Iframe';
import { sanitizeUrl } from '../../../GlobalCoponents/helper';
import Inspector from './inspector';

/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {useState, useEffect} = wp.element;
const {useBlockProps} = wp.blockEditor;
import {youtubeIcon} from '../../../GlobalCoponents/icons';

export default function YouTubeEdit({ attributes, setAttributes, isSelected }) {
	const blockProps = useBlockProps();
	const { url: attributeUrl, iframeSrc, width, height, unitoption } = attributes;

	const [state, setState] = useState({
		editingURL: false,
		url: attributeUrl || '',
		fetching: false,
		cannotEmbed: false,
		interactive: false,
	});

	const { editingURL, url, fetching, cannotEmbed, interactive } = state;

	// Reset interactive state when block is not selected
	useEffect(() => {
		if (!isSelected && interactive) {
			setState(prev => ({ ...prev, interactive: false }));
		}
	}, [isSelected, interactive]);

	const hideOverlay = () => {
		setState(prev => ({ ...prev, interactive: true }));
	};

	const onLoad = () => {
		setState(prev => ({ ...prev, fetching: false }));
	};

	const decodeHTMLEntities = (str) => {
		if (str && typeof str === "string") {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "");
		}
		return str;
	};

	const setUrl = (event) => {
		if (event) {
			event.preventDefault();
		}
		setAttributes({url});
		const matches = url.match(
			/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
		);
		if (url && matches) {
			let mediaId = matches[1];
			let iframeSrc = "https://www.youtube.com/embed/" + mediaId;
			let iframeUrl = new URL(iframeSrc);

			// // If your expected result is "http://foo.bar/?x=42&y=2"
			if (typeof embedpressProObj !== 'undefined') {
				for (var key in embedpressProObj.youtubeParams) {
					iframeUrl.searchParams.set(
						key,
						embedpressProObj.youtubeParams[key]
					);
				}
			}

			setState(prev => ({ ...prev, editingURL: false, cannotEmbed: false }));
			setAttributes({iframeSrc: iframeUrl.href, mediaId});

		} else {
			setState(prev => ({
				...prev,
				cannotEmbed: true,
				editingURL: true
			}));
		}
	};

	const switchBackToURLInput = () => {
		setState(prev => ({ ...prev, editingURL: true }));
	};

	const isYoutube = (url) => {
		// Regular expression to match if URL contains youtube.com
		var youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		return youtubeRegex.test(url);
	};

	if(iframeSrc && !isYoutube(iframeSrc)) {
        return <div {...blockProps}>Invalid URL.</div>;
    }

	const label = __('YouTube URL');

	let width_class = '';
	if (unitoption == '%') {
		width_class = 'ep-percentage-width';
	} else {
		width_class = 'ep-fixed-width';
	}

	// No preview, or we can't embed the current URL, or we've clicked the edit button.
	if (!iframeSrc || editingURL) {
		return (
			<div {...blockProps}>
				<Inspector attributes={attributes} setAttributes={setAttributes} />
				<EmbedPlaceholder
					label={label}
					onSubmit={setUrl}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => setState(prev => ({ ...prev, url: event.target.value }))}
					icon={youtubeIcon}
					DocTitle={__('Learn more about YouTube embed')}
					docLink={'https://embedpress.com/docs/embed-youtube-wordpress/'}
				/>
			</div>
		);
	} else {
		return (
			<div {...blockProps}>
				<Inspector attributes={attributes} setAttributes={setAttributes} />
				<div className={`embedpress-youtube-embed ${width_class}`} style={{width: unitoption === '%' ? `${width}%` : `${width}px`, height: `${height}px`}}>
					{fetching ? <EmbedLoading/> : null}

					<Iframe
						src={sanitizeUrl(iframeSrc)}
						onMouseUp={hideOverlay}
						onLoad={onLoad}
						style={{display: fetching ? 'none' : '', width: '100%', height: '100%'}}
						frameBorder="0"
						width={unitoption === '%' ? '100%' : width}
						height={height}
					/>

					{ ! interactive && (
						<div
							className="block-library-embed__interactive-overlay"
							onMouseUp={hideOverlay}
						/>
					) }

					<EmbedControls
						showEditButton={iframeSrc && !cannotEmbed}
						switchBackToURLInput={switchBackToURLInput}
					/>
				</div>
			</div>
		)
	}
}
