/**
 * Internal dependencies
 */
import EmbedControls from '../common/embed-controls';
import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from '../common/embed-placeholder';
import EmbedWrap from '../common/embed-wrap';
import md5 from 'md5';
import Inspector from './inspector';
import DynamicStyles from './dynamic-styles';
const { applyFilters } = wp.hooks;
const apiFetch = wp.apiFetch;

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
import { embedPressIcon } from '../common/icons';
import { isOpensea as _isOpensea, isOpenseaSingle as _isOpenseaSingle, useOpensea } from './InspectorControl/opensea';
import { isYTChannel as _isYTChannel, useYTChannel, isYTVideo as _isYTVideo, useYTVideo } from './InspectorControl/youtube';
import { isWistiaVideo as _isWistiaVideo, useWistiaVideo } from './InspectorControl/wistia';
import { isVimeoVideo as _isVimeoVideo, useVimeoVideo } from './InspectorControl/vimeo';

const {
	useBlockProps
} = wp.blockEditor;

const { Fragment, useEffect } = wp.element;

export default function EmbedPress(props) {
	const { clientId, attributes, className, setAttributes } = props;

	
	// @todo remove unused atts from here.
	const {
		url,
		editingURL,
		fetching,
		cannotEmbed,
		interactive,
		embedHTML,
		height,
		width,
		customlogo,
		logoX,
		logoY,
		customlogoUrl,
		logoOpacity,
	} = attributes;

	let customLogoTemp = '';
	let customLogoStyle = '';
	let epMessage = '';

	if (customlogo) {
		customLogoStyle = `
				border: 0;
				position: absolute;
				bottom: ${logoY}%;
				right: ${logoX}%;
				max-width: 150px;
				max-height: 75px;
				opacity: ${logoOpacity};
				// z-index: 5;
				-o-transition: opacity 0.5s ease-in-out;
				-moz-transition: opacity 0.5s ease-in-out;
				-webkit-transition: opacity 0.5s ease-in-out;
				transition: opacity 0.5s ease-in-out;
				`
		customLogoTemp = `<img decoding="async"  src="${customlogo}" class="watermark ep-custom-logo" width="auto" height="auto">`;

		if (customlogoUrl) {
			customLogoTemp = `<a href="${customlogoUrl}" target="_blank"><img decoding="async" src="${customlogo}" class="watermark  ep-custom-logo" width="auto" height="auto"></a>`;
		}
	}

	if (_isWistiaVideo(url)) {
		epMessage = `<span class='ep-wistia-message'> Changes will be affected in frontend. </span>`;
	}


	const blockProps = useBlockProps ? useBlockProps() : [];

	const isYTChannel = _isYTChannel(url);
	const isYTVideo = _isYTVideo(url);
	const isWistiaVideo = _isWistiaVideo(url);
	const isVimeoVideo = _isVimeoVideo(url);

	const isOpensea = _isOpensea(url);
	const isOpenseaSingle = _isOpenseaSingle(url);

	const openseaParams = useOpensea(attributes);
	const youtubeParams = useYTChannel(attributes);
	const youtubeVideoParams = useYTVideo(attributes);
	const wistiaVideoParams = useWistiaVideo(attributes);
	const vimeoVideoParams = useVimeoVideo(attributes);

	const getSourceName = (url) => {
		let sourceName = "";
		let protocolIndex = url.indexOf("://");
		if (protocolIndex !== -1) {
			let domainStartIndex = protocolIndex + 3;
			let domainEndIndex = url.indexOf(".", domainStartIndex);
			let secondDotIndex = url.indexOf(".", domainEndIndex + 1);
			if (secondDotIndex === -1) {
				sourceName = url.substring(domainStartIndex, domainEndIndex);
			} else {
				sourceName = url.substring(domainEndIndex + 1, secondDotIndex);
			}
		}
		return sourceName;
	}
	
	function switchBackToURLInput() {
		setAttributes({ editingURL: true });
	}
	function onLoad() {
		setAttributes({ fetching: false });
	}

	function getAttributes(html) {
		const div = document.createElement('div');
		div.innerHTML = html;
		return div.firstChild.attributes;
	}

	function execScripts() {
		let scripts = embedHTML.matchAll(/<script.*?src=["'](.*?)["'].*?><\/script>/g);
		scripts = [...scripts];
		for (const script of scripts) {
			if (script && typeof script[1] != 'undefined') {
				const url = script[1];
				const hash = md5(url);
				const exist = document.getElementById(hash);
				if (exist) {
					exist.remove();
				}
				const s = document.createElement('script');
				s.type = 'text/javascript';
				s.setAttribute('id', hash);
				s.setAttribute('src', url);
				document.body.appendChild(s);
			}
		};
	}

	useEffect(() => {
		if (embedHTML && !editingURL && !fetching) {
			execScripts();
		}
	}, [embedHTML]);

	function embed(event) {

		if (event) event.preventDefault();

		if (url) {
			setAttributes({
				fetching: true
			});

			// send api request to get iframe url
			let fetchData = async (url) => {

				let params = {
					url,
					width,
					height,
					isGutenBerg: true,
				};

				params = applyFilters('embedpress_block_rest_param', params, attributes);

				const __url = `${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress`;

				const args = { url: __url, method: "POST", data: params };

				return await apiFetch(args)
					.then((res) => res)
					.catch((argserr) => console.error(argserr));
			}

			fetchData(url).then(data => {
				setAttributes({
					fetching: false
				});
				if ((data.data && data.data.status === 404) || !data.embed) {
					setAttributes({
						cannotEmbed: true,
						editingURL: true,
					})
				} else {

					setAttributes({
						embedHTML: data.embed,
						cannotEmbed: false,
						editingURL: false,
					});
					execScripts();
				}
			});
		} else {
			setAttributes({
				cannotEmbed: true,
				fetching: false,
				editingURL: true
			})
		}


		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'save_source_name',
				source_name: getSourceName(url),
				block_id: clientId,
				source_url: url
			},
			success: function(response) {
				console.log(response);
			}
		});
		
		 
	}
	// console.log('XopenseaParams', {...openseaParams});

	useEffect(() => {
		// console.log('openseaParams', {...openseaParams});
		const delayDebounceFn = setTimeout(() => {
			if (!((!embedHTML || editingURL) && !fetching)) {
				embed();
			}
		}, 1500)
		return () => {
			clearTimeout(delayDebounceFn)
		}
	}, [openseaParams, youtubeParams, youtubeVideoParams, wistiaVideoParams, vimeoVideoParams]);

	return (
		<Fragment>

			<Inspector
				attributes={attributes}
				setAttributes={setAttributes}
				isYTChannel={isYTChannel}
				isYTVideo={isYTVideo}
				isOpensea={isOpensea}
				isOpenseaSingle={isOpenseaSingle}
				isWistiaVideo={isWistiaVideo}
				isVimeoVideo={isVimeoVideo}
			/>

			{((!embedHTML || !!editingURL) && !fetching) && <div {...blockProps}>
				<EmbedPlaceholder
					label={__('EmbedPress - Embed anything from 150+ sites')}
					onSubmit={embed}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => setAttributes({ url: event.target.value })}
					icon={embedPressIcon}
					DocTitle={__('Learn more about EmbedPress')}
					docLink={'https://embedpress.com/docs/'}
				/>
			</div>}

			{
				((!isOpensea || (!!editingURL || editingURL === 0)) && (!isOpenseaSingle || (!!editingURL || editingURL === 0)) && (!isYTVideo || (!!editingURL || editingURL === 0)) && (!isYTChannel || (!!editingURL || editingURL === 0)) && (!isWistiaVideo || (!!editingURL || editingURL === 0))) && fetching && (<div className={className}><EmbedLoading /> </div>)
			}

			{(embedHTML && !editingURL && (!fetching || isOpensea || isOpenseaSingle || isYTChannel || isYTVideo || isWistiaVideo)) && <figure {...blockProps} >
				<EmbedWrap style={{ display: (fetching && !isOpensea && !isOpenseaSingle && !isYTChannel && !isYTVideo && !isWistiaVideo) ? 'none' : (isOpensea || isOpenseaSingle || isYTChannel) ? 'block' : 'inline-block', position: 'relative' }} dangerouslySetInnerHTML={{
					__html: embedHTML + customLogoTemp + epMessage,
				}}>

				</EmbedWrap>

				{
					fetching && (
						<div style={{ filter: 'grayscale(1))', backgroundColor: '#fffafa', opacity: '0.7' }}
							className="block-library-embed__interactive-overlay"
							onMouseUp={setAttributes({ interactive: true })}
						/>
					)
				}

				{
					(!isOpensea && !isOpenseaSingle) && (
						<div
							className="block-library-embed__interactive-overlay"
							onMouseUp={setAttributes({ interactive: true })}
						/>
					)
				}

				<EmbedControls
					showEditButton={embedHTML && !cannotEmbed}
					switchBackToURLInput={switchBackToURLInput}
				/>

			</figure>}

			<DynamicStyles url={url} clientId={clientId} {...attributes} />

			{
				customlogo && (
					<style style={{ display: "none" }}>
						{
							`
							#block-${clientId} img.watermark{
								${customLogoStyle}
							}
							`
						}
					</style>
				)
			}


		</Fragment>

	);

}


