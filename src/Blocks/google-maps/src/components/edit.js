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
import {googleMapsIcon} from '../../../GlobalCoponents/icons';

export default function GoogleMapsEdit({ attributes, setAttributes, isSelected }) {
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
		setAttributes({url});
		if (url && url.match(/^http[s]?:\/\/(?:(?:(?:www\.|maps\.)?(?:google\.com?))|(?:goo\.gl))(?:\.[a-z]{2})?\/(?:maps\/)?(?:place\/)?(?:[a-z0-9\/%+\-_]*)?([a-z0-9\/%,+\-_=!:@\.&*\$#?\']*)/i)) {
			var googleIframeSrc = decodeHTMLEntities(url);
			if (url.match('~(maps/embed|output=embed)~i')) {
				//do something
			} else {
				var regEx = /@(-?[0-9\.]+,-?[0-9\.]+).+,([0-9\.]+[a-z])/i;
				var match = regEx.exec(googleIframeSrc);
				if (match && match.length > 1 && match[1] && match[2]) {
					googleIframeSrc = 'https://maps.google.com/maps?hl=en&ie=UTF8&ll=' + match[1] + '&spn=' + match[1] + '&t=m&z=' + Math.round(parseInt(match[2])) + '&output=embed';
				} else {
					setState(prev => ({
						...prev,
						cannotEmbed: true,
						editingURL: true
					}));
				}
			}
			setState(prev => ({ ...prev, editingURL: false, cannotEmbed: false }));
			setAttributes({iframeSrc: googleIframeSrc})
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

	if(iframeSrc && !isGoogleService(iframeSrc)) {
        return <div {...blockProps}>Invalid URL.</div>;
    }

	const label = __('Google Maps URL');

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
					icon={googleMapsIcon}
					DocTitle={__('Learn more about Google maps embed')}
					docLink={'https://embedpress.com/docs/embed-google-maps-wordpress/'}
				/>
			</div>
		);
	} else {
		return (
			<div {...blockProps}>
				<Inspector attributes={attributes} setAttributes={setAttributes} />
				<div className={`embedpress-google-maps-embed ${width_class}`} style={{width: unitoption === '%' ? `${width}%` : `${width}px`, height: `${height}px`}}>
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
