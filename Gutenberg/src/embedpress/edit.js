/**
 * Internal dependencies
 */
import EmbedControls from '../common/embed-controls';
import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from '../common/embed-placeholder';
import EmbedWrap from '../common/embed-wrap';
import SocialShareHtml from '../common/social-share-html';
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
import ContentShare from '../common/social-share-control';

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
		contentShare,
		sharePosition,
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

	let shareHtml = '';
	if(contentShare) {
		shareHtml = `<div class="social-share share-position-${sharePosition}">
		<a href="#" class="social-icon facebook" target="_blank">
			<svg width="64px" height="64px" viewBox="0 -6 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path fill="#475a96" d="M0 0h512v500H0z" /><path d="M375.717 112.553H138.283c-8.137 0-14.73 6.594-14.73 14.73v237.434c0 8.135 6.594 14.73 14.73 14.73h127.826V276.092h-34.781v-40.28h34.781v-29.705c0-34.473 21.055-53.244 51.807-53.244 14.73 0 27.391 1.097 31.08 1.587v36.026l-21.328.01c-16.725 0-19.963 7.947-19.963 19.609v25.717h39.887l-5.193 40.28h-34.693v103.355h68.012c8.135 0 14.73-6.596 14.73-14.73V127.283c-.001-8.137-6.596-14.73-14.731-14.73z" fill="#ffffff" /></g></svg>
		</a>
		<a href="#" class="social-icon twitter" target="_blank">
			<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 248 204">
				<path fill="#ffffff"
					d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z" />
			</svg>
		</a>
		<a href="#" class="social-icon pinterest" target="_blank">
			<svg xmlns="http://www.w3.org/2000/svg" height="800" width="1200" viewBox="-36.42015 -60.8 315.6413 364.8">
				<path
					d="M121.5 0C54.4 0 0 54.4 0 121.5 0 173 32 217 77.2 234.7c-1.1-9.6-2-24.4.4-34.9 2.2-9.5 14.2-60.4 14.2-60.4s-3.6-7.3-3.6-18c0-16.9 9.8-29.5 22-29.5 10.4 0 15.4 7.8 15.4 17.1 0 10.4-6.6 26-10.1 40.5-2.9 12.1 6.1 22 18 22 21.6 0 38.2-22.8 38.2-55.6 0-29.1-20.9-49.4-50.8-49.4-34.6 0-54.9 25.9-54.9 52.7 0 10.4 4 21.6 9 27.7 1 1.2 1.1 2.3.8 3.5-.9 3.8-3 12.1-3.4 13.8-.5 2.2-1.8 2.7-4.1 1.6-15.2-7.1-24.7-29.2-24.7-47.1 0-38.3 27.8-73.5 80.3-73.5 42.1 0 74.9 30 74.9 70.2 0 41.9-26.4 75.6-63 75.6-12.3 0-23.9-6.4-27.8-14 0 0-6.1 23.2-7.6 28.9-2.7 10.6-10.1 23.8-15.1 31.9 11.4 3.5 23.4 5.4 36 5.4 67.1 0 121.5-54.4 121.5-121.5C243 54.4 188.6 0 121.5 0z"
					fill="#fff" />
			</svg>
		</a>
		<a href="#" class="social-icon linkedin" target="_blank">
			<svg fill="#ffffff" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 310 310" xml:space="preserve"><g id="XMLID_801_"><path id="XMLID_802_" d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73
		C77.16,101.969,74.922,99.73,72.16,99.73z"/><path id="XMLID_803_" d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4
		c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"/><path id="XMLID_804_" d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599
		c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319
		c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995
		C310,145.43,300.549,94.761,230.454,94.761z"/></g></svg>
		</a>
	</div>`;
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
			
			setAttributes({clientId});

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
					__html: embedHTML + customLogoTemp + epMessage + shareHtml,
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


