/**
 * Internal dependencies
 */
import EmbedControls from '../common/embed-controls';
import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from '../common/embed-placeholder';
import EmbedWrap from '../common/embed-wrap';
import md5 from 'md5';
import Inspector from './inspector';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
import { embedPressIcon } from '../common/icons';
import SkeletonLoaading from '../common/skeletone-loading';

const {
	useBlockProps
} = wp.blockEditor;

const { Fragment, useEffect } = wp.element;

export default function EmbedPress(props) {
	const { clientId, attributes, className, setAttributes } = props;

	const { url,
		editingURL,
		fetching,
		cannotEmbed,
		interactive,
		embedHTML,
		height,
		width,
		ispagination,
		pagesize,
		columns,
		gapbetweenvideos,
		starttime,
		endtime,
		autoplay,
		controls,
		fullscreen,
		videoannotations,
		progressbarcolor,
		closedcaptions,
		modestbranding,
		relatedvideos,
		customlogo,
		logoX,
		logoY,
		customlogoUrl,
		logoOpacity,
		limit,
		layout,
		preset,
		orderby,
		nftperrow,
		gapbetweenitem,
		nftimage,
		nftcreator,
		prefix_nftcreator,
		nfttitle,
		nftprice,
		prefix_nftprice,
		nftlastsale,
		prefix_nftlastsale,
		nftbutton,
		label_nftbutton,
		alignment,
		itemBGColor,
		titleColor,
		titleFontsize,
		creatorColor,
		creatorFontsize,
		creatorLinkColor,
		creatorLinkFontsize,
		priceColor,
		priceFontsize,
		lastSaleColor,
		lastSaleFontsize,
		buttonTextColor,
		buttonBackgroundColor,
		buttonFontSize,
	} = attributes;

	let customLogoTemp = '';
	let customLogoStyle = '';

	if(customlogo){
		customLogoStyle = `
				border: 0;
				position: absolute;
				bottom: ${logoX}%;
				right: ${logoY}%;
				max-width: 150px;
				max-height: 75px;
				opacity: ${logoOpacity};
				// z-index: 5;
				-o-transition: opacity 0.5s ease-in-out;
				-moz-transition: opacity 0.5s ease-in-out;
				-webkit-transition: opacity 0.5s ease-in-out;
				transition: opacity 0.5s ease-in-out;
				`
		customLogoTemp = `<img decoding="async" style='${customLogoStyle}' src="${customlogo}" class="watermark" width="auto" height="auto">`;

		if(customlogoUrl){
			customLogoTemp = `<a href="${customlogoUrl}"><img style='${customLogoStyle}' decoding="async" src="${customlogo}" class="watermark" width="auto" height="auto"></a>`;
		}
	}

	

	const blockProps = useBlockProps ? useBlockProps() : [];

	const isYTChannel = url.match(/\/channel\/|\/c\/|\/user\/|(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$/i);

	const isOpensea = url.match(/\/collection\/|(?:https?:\/\/)?(?:www\.)?(?:opensea.com\/)(\w+)[^?\/]*$/i);

	const isYTVideo = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/i);

	function switchBackToURLInput() {
		setAttributes({ editingURL: true });
	}
	function onLoad() {
		setAttributes({ fetching: false });
	}

	useEffect(() => {
		if (embedHTML && !editingURL && !fetching) {
			let scripts = embedHTML.matchAll(/<script.*?src=["'](.*?)["'].*?><\/script>/g);
			scripts = [...scripts];
			for (const script of scripts) {
				if (script && typeof script[1] != 'undefined') {
					const url = script[1];
					const hash = md5(url);
					if (document.getElementById(hash)) {
						continue;
					}
					const s = document.createElement('script');
					s.type = 'text/javascript';
					s.setAttribute('id', hash);
					s.setAttribute('src', url);
					document.body.appendChild(s);
				}
			};
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

				let youtubeParams = '';
				let openseaParams = '';
				let ytvParams = '';

				//Generate YouTube params
				if (isYTChannel) {
					let _isYTChannel = {
						pagesize: pagesize ? pagesize : 6,
						gapbetweenvideos: 10,
						ispagination: ispagination ? ispagination : false,
						columns: columns ? columns : '3',
					};
					youtubeParams = '&' + new URLSearchParams(_isYTChannel).toString();
				}

				//Generate YouTube video params
				if (isYTVideo) {
					let _isYTVideo = {
						starttime: starttime,
						endtime: endtime,
						autoplay: autoplay ? 1 : 0,
						controls: controls ? 1 : 0,
						fullscreen: fullscreen ? 1 : 0,
						videoannotations: videoannotations ? 1 : 0,
						progressbarcolor: progressbarcolor,
						closedcaptions: closedcaptions ? 1 : 0,
						modestbranding: modestbranding,
						relatedvideos: relatedvideos ? 1 : 0,
						customlogo: customlogo ? customlogo : '',
						logoX: logoX ? logoX : 0,
						logoY: logoY ? logoY : 0,
						customlogoUrl: customlogoUrl ? customlogoUrl : '',
						logoOpacity: logoOpacity ? logoOpacity : '',
					};

					ytvParams = '&' + new URLSearchParams(_isYTVideo).toString();
				}

				//Generate Opensea params
				if (isOpensea) {
					let _isOpensea = {
						limit: limit ? limit : 20,
						orderby: orderby ? orderby : 'desc',
						layout: layout ? layout : 'ep-grid',
						preset: preset ? preset : 'ep-preset-1',
						nftperrow: nftperrow ? nftperrow : '3',
						gapbetweenitem: gapbetweenitem ? gapbetweenitem : 30,
						nftimage: nftimage ? nftimage : false,
						nftcreator: nftcreator ? nftcreator : false,
						prefix_nftcreator: prefix_nftcreator ? prefix_nftcreator : '',
						nfttitle: nfttitle ? nfttitle : false,
						nftprice: nftprice ? nftprice : false,
						prefix_nftprice: prefix_nftprice ? prefix_nftprice : '',
						nftlastsale: nftlastsale ? nftlastsale : false,
						prefix_nftlastsale: prefix_nftlastsale ? prefix_nftlastsale : '',
						nftbutton: nftbutton ? nftbutton : false,
						label_nftbutton: label_nftbutton ? label_nftbutton : '',

						//Pass Color and Typography
						itemBGColor: itemBGColor ? itemBGColor : '',
						titleColor: titleColor ? titleColor : '',
						titleFontsize: titleFontsize ? titleFontsize : '',
						creatorColor: creatorColor ? creatorColor : '',
						creatorFontsize: creatorFontsize ? creatorFontsize : '',
						creatorLinkColor: creatorLinkColor ? creatorLinkColor : '',
						creatorLinkFontsize: creatorLinkFontsize ? creatorLinkFontsize : '',
						priceColor: priceColor ? priceColor : '',
						priceFontsize: priceFontsize ? priceFontsize : '',
						lastSaleColor: lastSaleColor ? lastSaleColor : '',
						lastSaleFontsize: lastSaleFontsize ? lastSaleFontsize : '',
						buttonTextColor: buttonTextColor ? buttonTextColor : '',
						buttonBackgroundColor: buttonBackgroundColor ? buttonBackgroundColor : '',
						buttonFontSize: buttonFontSize ? buttonFontSize : '',
					};

					openseaParams = '&' + new URLSearchParams(_isOpensea).toString();
				}

				let __url = url.split('#');
				__url = encodeURIComponent(__url[0]);
				return await fetch(`${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress?url=${__url}&width=${width}&height=${height}${youtubeParams}${openseaParams}${ytvParams}`).then(response => response.json());
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

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (!((!embedHTML || editingURL) && !fetching)) {
				embed();
			}
		}, 300)
		return () => clearTimeout(delayDebounceFn)
	}, [pagesize, limit, layout, preset, orderby, nftimage, nfttitle, nftprice, prefix_nftprice, nftlastsale, prefix_nftlastsale, nftperrow, nftbutton, label_nftbutton, nftcreator, prefix_nftcreator, itemBGColor, titleColor, titleFontsize, creatorColor, creatorFontsize, creatorLinkColor, creatorLinkFontsize, priceColor, priceFontsize, lastSaleColor, lastSaleFontsize, buttonTextColor, buttonBackgroundColor, buttonFontSize, starttime, endtime, autoplay, controls, fullscreen, videoannotations, progressbarcolor, closedcaptions, modestbranding, relatedvideos, logoX, logoY, customlogoUrl, logoOpacity]);

	let repeatCol = `repeat(auto-fit, minmax(250px, 1fr))`;

	if (columns > 0) {
		repeatCol = `repeat(auto-fit, minmax(calc(${100 / columns}% - ${gapbetweenvideos}px), 1fr))`;
	}




	return (
		<Fragment>

			<Inspector attributes={attributes} setAttributes={setAttributes} isYTChannel={isYTChannel} isYTVideo={isYTVideo} isOpensea={isOpensea} />

			{((!embedHTML || editingURL) && !fetching) && <div {...blockProps}>
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
				((!isOpensea || editingURL) && (!isYTVideo || editingURL)) && fetching && (<div className={className}><EmbedLoading /> </div>)
			}



			{(embedHTML && !editingURL && (!fetching || isOpensea || isYTVideo)) && <figure {...blockProps} >
				<EmbedWrap style={{ display: (fetching && !isOpensea && !isYTVideo) ? 'none' : 'inline-block', position: 'relative' }} dangerouslySetInnerHTML={{
					__html: embedHTML + customLogoTemp
				}}></EmbedWrap>

				{
					fetching && (
						<div style={{ filter: 'grayscale(1))', backgroundColor: '#fffafa', opacity: '.75' }}
							className="block-library-embed__interactive-overlay"
							onMouseUp={setAttributes({ interactive: true })}
						/>
					)
				}

				{
					!isOpensea && (
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


			{
				isYTChannel && (
					<style style={{ display: "none" }}>
						{
							`
							#block-${clientId} .ep-youtube__content__block .youtube__content__body .content__wrap{
								gap: ${gapbetweenvideos}px!important;
								margin-top: ${gapbetweenvideos}px!important;
							}

							#block-${clientId} .ose-youtube{
								width: ${width}px!important;
							}
							#block-${clientId} .ose-youtube .ep-first-video iframe{
								max-height: ${height}px!important;
							}

							#block-${clientId} .ose-youtube > iframe{
								height: ${height}px!important;
								width: ${width}px!important;
							}

							#block-${clientId} .ep-youtube__content__block .youtube__content__body .content__wrap {
								grid-template-columns: ${repeatCol};
							}

							#block-${clientId} .ep-youtube__content__block .ep-youtube__content__pagination{
								display: flex!important;
							}

							${!ispagination && (
								`#block-${clientId} .ep-youtube__content__block .ep-youtube__content__pagination{
									display: none!important;
								}`
							)}

							`
						}

					</style>
				)

			}

			{
				!isYTChannel && (
					<style style={{ display: "none" }}>
						{
							`
							#block-${clientId} .ose-youtube > iframe{
								height: ${height}px!important;
								width: ${width}px!important;
							}
							#block-${clientId} .ose-youtube{
								height: ${height}px!important;
								width: ${width}px!important;
							}
						`
						}

					</style>
				)
			}

			{
				isOpensea && (
					<style style={{ display: "none" }}>
						{
							`
							#block-${clientId}{
								width: 900px;
								max-width: 100%!important;
							}
							`
						}

					</style>
				)
			}


		</Fragment>

	);

}


