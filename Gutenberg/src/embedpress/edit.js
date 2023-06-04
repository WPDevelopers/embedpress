/**
 * Internal dependencies
 */
import EmbedControls from '../common/embed-controls';
import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from '../common/embed-placeholder';
import EmbedWrap from '../common/embed-wrap';
import { removedBlockID, saveSourceData } from '../common/helper';

import { shareIconsHtml } from '../common/helper';
import md5 from 'md5';
import Inspector from './inspector';
import DynamicStyles from './dynamic-styles';
const { applyFilters } = wp.hooks;
const apiFetch = wp.apiFetch;

const { select, subscribe } = wp.data;


/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
import { embedPressIcon } from '../common/icons';
import { isOpensea as _isOpensea, isOpenseaSingle as _isOpenseaSingle, useOpensea } from './InspectorControl/opensea';
import { isYTChannel as _isYTChannel, useYTChannel, isYTVideo as _isYTVideo, isYTLive as _isYTLive, useYTVideo } from './InspectorControl/youtube';
import { isWistiaVideo as _isWistiaVideo, useWistiaVideo } from './InspectorControl/wistia';
import { isVimeoVideo as _isVimeoVideo, useVimeoVideo } from './InspectorControl/vimeo';
import ContentShare from '../common/social-share-control';
import { initCustomPlayer } from './functions';

const {
	useBlockProps
} = wp.blockEditor;

const { Fragment, useEffect } = wp.element;

removedBlockID();

export default function EmbedPress(props) {
	const { attributes, className, setAttributes } = props;



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
		contentShare,
		sharePosition,
		customlogo,
		logoX,
		logoY,
		customlogoUrl,
		logoOpacity,
		clientId,
		customPlayer
	} = attributes;


	if (clientId == null || clientId == undefined) {
		setAttributes({ clientId : props.clientId });
	}
	const _md5ClientId = md5(clientId);

	let content_share_class = '';
	let share_position_class = '';
	let share_position = sharePosition ? sharePosition : 'right';
	if (contentShare) {
		content_share_class = 'ep-content-share-enabled';
		share_position_class = 'ep-share-position-' + share_position;
	}

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

	let shareHtml = '';
	if (contentShare) {
		shareHtml = shareIconsHtml(sharePosition);
	}

	const blockProps = useBlockProps ? useBlockProps() : [];

	const isYTChannel = _isYTChannel(url);
	const isYTVideo = _isYTVideo(url);
	const isYTLive = _isYTLive(url);
	const isWistiaVideo = _isWistiaVideo(url);
	const isVimeoVideo = _isVimeoVideo(url);

	const isOpensea = _isOpensea(url);
	const isOpenseaSingle = _isOpenseaSingle(url);

	const openseaParams = useOpensea(attributes);
	const youtubeParams = useYTChannel(attributes);
	const youtubeVideoParams = useYTVideo(attributes);
	const wistiaVideoParams = useWistiaVideo(attributes);
	const vimeoVideoParams = useVimeoVideo(attributes);

	let source = '';

	if (isOpensea || isOpenseaSingle) {
		source = ' source-opensea';
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


	if (!clientId) {
		setAttributes({ clientId: props.clientId })
	}
	function embed(event) {

		if (event) event.preventDefault();

		if (url) {
			setAttributes({
				fetching: true
			});

			setAttributes({ clientId });

			// send api request to get iframe url
			let fetchData = async (url) => {

				let params = {
					url,
					width,
					height,
				};

				params = applyFilters('embedpress_block_rest_param', params, attributes);

				const __url = `${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress`;

				const args = { url: __url, method: "POST", data: params };

				console.log(args);

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

		if (clientId && url) {
			saveSourceData(clientId, url);
		}

		customPlayer && (
			initCustomPlayer(_md5ClientId, attributes)
		)

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
				isYTLive={isYTLive}
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
				((!isOpensea || (!!editingURL || editingURL === 0)) && (!isOpenseaSingle || (!!editingURL || editingURL === 0)) && ((!isYTVideo && !isYTLive) || (!!editingURL || editingURL === 0)) && (!isYTChannel || (!!editingURL || editingURL === 0)) && (!isWistiaVideo || (!!editingURL || editingURL === 0))) && fetching && (<div className={className}><EmbedLoading /> </div>)
			}

			{(embedHTML && !editingURL && (!fetching || isOpensea || isOpenseaSingle || isYTChannel || isYTVideo || isYTLive || isWistiaVideo)) && <figure {...blockProps} data-source-id={'source-' + clientId} >
				<div className={'gutenberg-block-wraper' + ' ' + content_share_class + ' ' + share_position_class + source}>
					<EmbedWrap className={`position-${sharePosition}-wraper ep-embed-content-wraper`} style={{ display: (fetching && !isOpensea && !isOpenseaSingle && !isYTChannel && !isYTVideo && !isYTLive && !isWistiaVideo) ? 'none' : (isOpensea || isOpenseaSingle) ? 'block' : 'inline-block', position: 'relative' }} {...(customPlayer ? { 'data-playerid': md5(clientId) } : {})} dangerouslySetInnerHTML={{
						__html: embedHTML + customLogoTemp + epMessage + shareHtml,
					}}>
					</EmbedWrap>
				</div>

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

			<DynamicStyles attributes={attributes} />

			{
				customlogo && (
					<style style={{ display: "none" }}>
						{
							`
							[data-source-id="source-${clientId}"] img.watermark{
								${customLogoStyle}
							}
							`
						}
					</style>
				)
			}

			{
				!customlogo && (
					<style style={{ display: "none" }}>
						{
							`
							[data-source-id="source-${clientId}"] img.watermark{
								display: none;
							}
							`
						}
					</style>
				)
			}




		</Fragment>

	);

}


