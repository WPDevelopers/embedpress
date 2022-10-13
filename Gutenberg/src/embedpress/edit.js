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

const {
	useBlockProps
} = wp.blockEditor;

const { Fragment, useEffect } = wp.element;

export default function EmbedPress(props) {
	const { clientId, attributes, className, setAttributes } = props;

	const { url, editingURL, fetching, cannotEmbed, interactive, embedHTML, height, width, ispagination, pagesize, columns, gapbetweenvideos } = attributes;
	const blockProps = useBlockProps ? useBlockProps() : [];

	const isYTChannel = url.match(/\/channel\/|\/c\/|\/user\/|(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$/i);
	function switchBackToURLInput() {
		setAttributes({ editingURL: true });
	}
	function onLoad() {
		setAttributes({ fetching: false });
	}

	useEffect( () => {
		if(embedHTML && !editingURL && !fetching){
			let scripts = embedHTML.matchAll(/<script.*?src=["'](.*?)["'].*?><\/script>/g);
			scripts = [...scripts];
			for (const script of scripts) {
				if(script && typeof script[1] != 'undefined'){
					const url = script[1];
					const hash = md5(url);
					if (document.getElementById(hash)) {
						continue;
					}
					const s = document.createElement('script');
					s.type = 'text/javascript';
					s.setAttribute( 'id', hash );
					s.setAttribute( 'src', url );
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
				let _pagesize = isYTChannel ? `&pagesize=${pagesize}` : '';
				let _gapbetweenvideos = isYTChannel ? `&gapbetweenvideos=${gapbetweenvideos}` : '';
				let _ispagination = isYTChannel ? `&ispagination=${ispagination}` : false;
				let _columns = isYTChannel ? `&columns=${columns}` : '';


				return await fetch(`${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress?url=${url}&width=${width}&height=${height}${_columns}${_ispagination}${_pagesize}${_gapbetweenvideos}`).then(response => response.json());
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
			if (pagesize) {
				embed();
			}
		}, 300)

		return () => clearTimeout(delayDebounceFn)
	}, [pagesize]);

	return (
		<Fragment>

			<Inspector attributes={attributes} setAttributes={setAttributes} isYTChannel={isYTChannel} />

			{((!embedHTML || editingURL) && !fetching) && <div {...blockProps}>
				<EmbedPlaceholder
					label={__('EmbedPress - Embed anything from 100+ sites')}
					onSubmit={embed}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => setAttributes({ url: event.target.value })}
					icon={embedPressIcon}
					DocTitle={__('Learn more about EmbedPress')}
					docLink={'https://embedpress.com/docs/'}

				/>
			</div>}

			{fetching ? <div className={className}><EmbedLoading /> </div> : null}

			{(embedHTML && !editingURL && !fetching) && <figure {...blockProps} >
				<EmbedWrap style={{ display: fetching ? 'none' : '' }} dangerouslySetInnerHTML={{
					__html: embedHTML
				}}></EmbedWrap>
				<div
					className="block-library-embed__interactive-overlay"
					onMouseUp={setAttributes({ interactive: true })}
				/>

				<EmbedControls
					showEditButton={embedHTML && !cannotEmbed}
					switchBackToURLInput={switchBackToURLInput}
				/>

			</figure>}

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
						width: 100%;
					}

					#block-${clientId} .ep-youtube__content__block .youtube__content__body .content__wrap {
						grid-template-columns: repeat(auto-fit, minmax(calc(${100 / columns}% - ${gapbetweenvideos}px), 1fr));
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

		</Fragment>

	);

}


