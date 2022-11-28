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
import SkeletonLoaading from '../common/skeletone-loading';
import { isOpensea as _isOpensea, useOpensea } from './InspectorControl/opensea';

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
	} = attributes;

	const blockProps = useBlockProps ? useBlockProps() : [];

	const isYTChannel = url.match(/\/channel\/|\/c\/|\/user\/|(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$/i);

	const isOpensea = _isOpensea(url);
	const openseaParams = useOpensea(attributes);

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

				let params = {
					url,
					width,
					height,
				};

				params = applyFilters('embedpress_block_rest_param', params, attributes);
				const __url = `${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress` ;

				const args = { url: __url, method: "POST", data: params };
				return await apiFetch(args)
					.then((res) => res)
					.catch((err) => console.error(err));

				return await fetch(__url).then(response => response.json());
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
	console.log('XopenseaParams', {...openseaParams});

	useEffect(() => {
		console.log('openseaParams', {...openseaParams});
		const delayDebounceFn = setTimeout(() => {
			if (!((!embedHTML || editingURL) && !fetching)) {
				embed();
			}
		}, 3000)
		return () => {
			clearTimeout(delayDebounceFn)
			console.log(`clearTimeout(${delayDebounceFn})`);
		}
	}, [openseaParams]);

	// @todo move them to youtube.js
	let repeatCol = `repeat(auto-fit, minmax(250px, 1fr))`;

	if (columns > 0) {
		repeatCol = `repeat(auto-fit, minmax(calc(${100 / columns}% - ${gapbetweenvideos}px), 1fr))`;
	}

	return (
		<Fragment>

			<Inspector attributes={attributes} setAttributes={setAttributes} isYTChannel={isYTChannel} isOpensea={isOpensea} />

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

			<DynamicStyles url={url} {...attributes} />

		</Fragment>

	);

}


