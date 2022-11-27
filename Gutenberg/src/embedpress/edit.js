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
		wstarttime,
        wautoplay,
        scheme,
        captions,
        playbar,
        wfullscreen,
        playbutton,
        resumable,
        wistiafocus,
        volumecontrol,
        volume,
        rewind,
        customlogo,
        logoX,
        logoY,
        customlogoUrl,
        logoOpacity
	} = attributes;

	const blockProps = useBlockProps ? useBlockProps() : [];

	const isYTChannel = url.match(/\/channel\/|\/c\/|\/user\/|(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$/i);

	const isOpensea = url.match(/\/collection\/|(?:https?:\/\/)?(?:www\.)?(?:opensea.com\/)(\w+)[^?\/]*$/i);

	const isWistiaVideo = url.match(/\/medias\/|(?:https?:\/\/)?(?:www\.)?(?:wistia.com\/)(\w+)[^?\/]*$/i);

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
				let wistiaParams = '';

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


				//Generate Wistia video params
				if (isWistiaVideo) {
					let _isWistiaVideo = {
						wstarttime: wstarttime,
						wautoplay: wautoplay ? 1 : 0,
						wfullscreen: wfullscreen ? 1 : 0,
						captions: captions ? 1 : 0,
						scheme: scheme ? scheme : 'red',
						captions: captions ? scheme : 0,
						playbar: playbar ? playbar : 0,
						wfullscreen: wfullscreen ? wfullscreen : 0,
						playbutton: playbutton ? playbutton : 0,
						resumable: resumable ? resumable : 0,
						wistiafocus: wistiafocus ? wistiafocus : 0,
						volumecontrol: volumecontrol ? volumecontrol : 0,
						volume: volume ? volume : 0,
						rewind: rewind ? rewind : 0,
						customlogo: customlogo ? customlogo : '',
						logoX: logoX ? logoX : 0,
						logoY: logoY ? logoY : 0,
						customlogoUrl: customlogoUrl ? customlogoUrl : '',
						logoOpacity: logoOpacity ? logoOpacity : '',
					};

					wistiaParams = '&' + new URLSearchParams(_isWistiaVideo).toString();
				}

				let __url = url.split('#');
				__url = encodeURIComponent(__url[0]);
				return await fetch(`${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress?url=${__url}&width=${width}&height=${height}${youtubeParams}${openseaParams}`).then(response => response.json());
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
	}, [pagesize, limit, layout, preset, orderby, nftimage, nfttitle, nftprice, prefix_nftprice, nftlastsale, prefix_nftlastsale, nftperrow, nftbutton, label_nftbutton, nftcreator, prefix_nftcreator, itemBGColor, titleColor, titleFontsize, creatorColor, creatorFontsize, creatorLinkColor, creatorLinkFontsize, priceColor, priceFontsize, lastSaleColor, lastSaleFontsize, buttonTextColor, buttonBackgroundColor, buttonFontSize]);

	let repeatCol = `repeat(auto-fit, minmax(250px, 1fr))`;

	if (columns > 0) {
		repeatCol = `repeat(auto-fit, minmax(calc(${100 / columns}% - ${gapbetweenvideos}px), 1fr))`;
	}

	return (
		<Fragment>

			<Inspector attributes={attributes} setAttributes={setAttributes} isYTChannel={isYTChannel} isOpensea={isOpensea} isWistiaVideo={isWistiaVideo} />

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
				((!isOpensea || (!!editingURL || editingURL === 0)) && fetching) && (<div className={className}><EmbedLoading /> </div>)
			}


			{(embedHTML && !editingURL && (!fetching || isOpensea)) && <figure {...blockProps} >
				<EmbedWrap style={{ display: (fetching && !isOpensea) ? 'none' : '' }} dangerouslySetInnerHTML={{
					__html: embedHTML
				}}></EmbedWrap>

				{
					fetching && (
						<div style={{ filter: 'grayscale(1))', backgroundColor: '#fffafa', opacity: '0.7' }}
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
				!isYTChannel && !isOpensea && (
					<style style={{ display: "none" }}>
						{
							`
							#block-${clientId} .ose-embedpress-responsive{
								width: ${width}px!important;
								height: ${height}px!important
							}
							#block-${clientId} iframe{
								width: ${width}px!important;
								height: ${height}px!important
							}
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

			{
				isWistiaVideo && (
					<style style={{ display: "none" }}>
						{
							`
								#block-${clientId} .ose-wistia{
									width: ${width}px!important;
									height: ${height}px!important;
								}
								.wistia_embed{
									width: 100%!important;
									height: 100%!important;
								}
							`
						}

					</style>
				)
			}


		</Fragment>

	);

}


