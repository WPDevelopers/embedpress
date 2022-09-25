/**
 * Internal dependencies
 */
import EmbedControls from '../common/embed-controls';
import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from '../common/embed-placeholder';
import EmbedWrap from '../common/embed-wrap';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
import { embedPressIcon } from '../common/icons';
const {
	TextControl,
	SelectControl,
	RangeControl,
	ToggleControl,
	PanelBody
} = wp.components;

const {
	InspectorControls,
	useBlockProps
} = wp.blockEditor;

const { Fragment } = wp.element;

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


	function embed(event) {
		if (event) event.preventDefault();

		if (url) {
			setAttributes({
				fetching: true
			});
			// send api request to get iframe url
			let fetchData = async (url) => {
				let _pagesize = isYTChannel ? `&pagesize=${pagesize}` : '';
				return await fetch(`${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress?url=${url}&width=${width}&height=${height}&columns=${columns}&ispagination=${ispagination}${_pagesize}&gapbetweenvideos=${gapbetweenvideos}`).then(response => response.json());
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

	// const publishBtn = document.querySelector('.editor-post-publish-button');

	// if (publishBtn) {
	// 	publishBtn.addEventListener('click', function (event) {
	// 		embed(event);
	// 	});
	// }

	console.log(ispagination);
	const styleCss = `
	`;



	return (
		<Fragment>

			<InspectorControls>
				<PanelBody title={__("Customize Embedded Link")}>
					<p>{__("You can adjust the width and height of embedded content....")}</p>
					<TextControl
						label={__("Width")}
						value={width}
						onChange={(width) => setAttributes({ width })}
					/>

					<TextControl
						label={__("Height")}
						value={height}
						onChange={(height) => setAttributes({ height })}
					/>

					{
						isYTChannel && (
							<div>

								<ToggleControl
									label={__("Pagination")}
									checked={ispagination}
									onChange={(ispagination) => setAttributes({ ispagination })}
								/>

								<TextControl
									label={__("Video Per Page")}
									value={pagesize}
									onChange={(pagesize) => setAttributes({ pagesize })}
								/>
								<p>Specify the number of videos you wish to show on each page.</p>


								<SelectControl
									label={__("Columns")}
									value={columns}
									options={[
										{ label: 'Auto', value: 'auto' },
										{ label: '2', value: '2' },
										{ label: '3', value: '3' },
										{ label: '4', value: '4' },
										{ label: '6', value: '6' },
									]}
									onChange={(columns) => setAttributes({ columns })}
									__nextHasNoMarginBottom
								/>

								<RangeControl
									label={__('Gap Between Videos')}
									value={gapbetweenvideos}
									onChange={(gap) => setAttributes({ gapbetweenvideos: gap })}
									min={0}
									max={100}
								/>
								<p>Specify the gap between youtube videos.</p>
							</div>
						)

					}

					{/* {(embedHTML && !editingURL) && <button className='button' onClick={embed}>{__('Apply Change')}</button>} */}


				</PanelBody>
			</InspectorControls>
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
					
					#block-${clientId} .ep-youtube__content__block .youtube__content__body .content__wrap {
						grid-template-columns: repeat(auto-fit, minmax(calc(${100/columns}% - ${gapbetweenvideos}px), 1fr));
					}

					${!ispagination && (
						`#block-${clientId} .ep-youtube__content__block .ep-youtube__content__pagination{
							display: none;
						}`
					)}

					`
				}
			</style>

		</Fragment>

	);

}


