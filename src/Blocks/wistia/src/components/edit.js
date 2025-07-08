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
import {wistiaIcon} from '../../../GlobalCoponents/icons';

export default function WistiaEdit({ attributes, setAttributes, isSelected }) {
	const blockProps = useBlockProps();
	const { url: attributeUrl, iframeSrc, width, height, unitoption } = attributes;

	const [state, setState] = useState({
		editingURL: false,
		url: attributeUrl || '',
		fetching: false,
		cannotEmbed: false,
		interactive: false,
		mediaId: ''
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
		if (embedpressGutenbergData['wisita_options']) {
			let $state = {...state}
			setTimeout(function () {
				let script = document.createElement("script");
				script.src = "https://fast.wistia.com/assets/external/E-v1.js";
				script.charset = "ISO-8859-1"
				document.body.appendChild(script);
			}, 100);

			setTimeout(function () {
				let script = document.createElement("script");
				script.type = 'text/javascript';
				script.innerHTML = 'window.pp_embed_wistia_labels = ' + embedpressGutenbergData['wistia_labels'];
				document.body.appendChild(script);

				script = document.createElement("script");
				script.type = 'text/javascript';
				script.innerHTML = 'wistiaEmbed = Wistia.embed( \"' + $state.mediaId + '\", ' + embedpressGutenbergData.wisita_options + ' );';
				document.body.appendChild(script);
			}, 400);
		}
	};

	const decodeHTMLEntities = (str) => {
		if (str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<[\/\!]*?[^<>]*?>/gi, '');
		}
		return str;
	};

	const setUrl = (event) => {
		if (event) {
			event.preventDefault();
		}
		setAttributes({url});
		const matches = url.match(/(?:wistia\.com\/medias\/|wi\.st\/)([a-zA-Z0-9]+)/);
		if (url && matches) {
			let mediaId = matches[1];
			let iframeSrc = `//fast.wistia.net/embed/iframe/${mediaId}`;
			setState(prev => ({ ...prev, editingURL: false, cannotEmbed: false, mediaId }));
			setAttributes({iframeSrc});
		} else {
			setState(prev => ({ ...prev, cannotEmbed: true, editingURL: true }));
		}
	};

	const switchBackToURLInput = () => {
		setState(prev => ({ ...prev, editingURL: true }));
	};

	const isWistia = (url) => {
		const wistiaUrlPattern = /^\/\/fast\.wistia\.net\/embed\/iframe\//;
		return wistiaUrlPattern.test(url);
	};

	if(iframeSrc && !isWistia(iframeSrc)) {
        return <div {...blockProps}>Invalid URL.</div>;
    }

	const label = __('Wistia URL');

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
					icon={wistiaIcon}
					DocTitle={__('Learn more about Wistia embed')}
					docLink={'https://embedpress.com/docs/embed-wistia-wordpress/'}
				/>
			</div>
		);
	} else {
		return (
			<div {...blockProps}>
				<Inspector attributes={attributes} setAttributes={setAttributes} />
				<div className={`embedpress-wistia-embed ${width_class}`} style={{width: unitoption === '%' ? `${width}%` : `${width}px`, height: `${height}px`}}>
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
