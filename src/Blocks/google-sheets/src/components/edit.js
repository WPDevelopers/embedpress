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
const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
const { useBlockProps } = wp.blockEditor;
import { googleSheetsIcon } from '../../../GlobalCoponents/icons';

export default function GoogleSheetsEdit({ attributes, setAttributes, isSelected }) {
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
		if (str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
		}
		return str;
	};

	const setUrl = (event) => {
		if (event) {
			event.preventDefault();
		}
		setAttributes({ url });
		if (url && url.match(/^http[s]?:\/\/((?:www\.)?docs\.google\.com(?:.*)?(?:document|presentation|spreadsheets|forms|drawings)\/[a-z0-9\/\?=_\-\.\,&%\$#\@\!\+]*)/i)) {
			var googleIframeSrc = decodeHTMLEntities(url);
			var regEx = /google\.com(?:.+)?(document|presentation|spreadsheets|forms|drawings)/i;
			var match = regEx.exec(googleIframeSrc);
			var type = match[1];
			if (type && type == 'spreadsheets') {
				if (googleIframeSrc.indexOf('?') > -1) {
					var query = googleIframeSrc.split('?');
					query = query[1];
					query = query.split('&');
					if (query.length > 0) {
						var hasHeadersParam = false;
						var hasWidgetParam = false;
						query.map(param => {
							if (param.indexOf('widget=')) {
								hasWidgetParam = true;
							} else if (param.indexOf('headers=')) {
								hasHeadersParam = true;
							}
						})
						if (!hasWidgetParam) {
							googleIframeSrc += '&widget=true';
						}

						if (!hasHeadersParam) {
							googleIframeSrc += '&headers=false';
						}
					}
				} else {
					googleIframeSrc += '?widget=true&headers=false';
				}
				setState(prev => ({ ...prev, editingURL: false, cannotEmbed: false }));
				setAttributes({ iframeSrc: googleIframeSrc })
			} else {
				setState(prev => ({
					...prev,
					cannotEmbed: true,
					editingURL: true
				}));
			}
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

	const isGoogleService = (url) => {
		var googleRegex = /(?:https?:\/\/)?(?:[^./]+\.)?google\.(com?\.)?[a-z]+(?:\.[a-z]+)?/;
		return googleRegex.test(url);
	};

	if (iframeSrc && !isGoogleService(iframeSrc)) {
		return <div {...blockProps}>Invalid URL.</div>;
	}

	const label = __('Google Sheets URL');

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
					icon={googleSheetsIcon}
					DocTitle={__('Learn more about Google sheets embed')}
					docLink={'https://embedpress.com/docs/embed-google-sheets-wordpress/'}
				/>
			</div>
		);
	} else {
		return (
			<div {...blockProps}>
				<Inspector attributes={attributes} setAttributes={setAttributes} />
				<div className={`embedpress-google-sheets-embed ${width_class}`} style={{ width: unitoption === '%' ? `${width}%` : `${width}px`, height: `${height}px` }}>
					{fetching ? <EmbedLoading /> : null}

					<Iframe
						src={sanitizeUrl(iframeSrc)}
						onMouseUp={hideOverlay}
						onLoad={onLoad}
						style={{
							display: fetching ? 'none' : '',
							width: unitoption === '%' ? '100%' : `${width}px`,
							maxWidth: '100%',
							height: `${height}px`,
						}}
						frameBorder="0"
					/>


					{!interactive && (
						<div
							className="block-library-embed__interactive-overlay"
							onMouseUp={hideOverlay}
						/>
					)}

					<EmbedControls
						showEditButton={iframeSrc && !cannotEmbed}
						switchBackToURLInput={switchBackToURLInput}
					/>
				</div>
			</div>
		)
	}
}
