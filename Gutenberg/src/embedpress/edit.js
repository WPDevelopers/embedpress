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
	PanelBody
} = wp.components;

const {
	InspectorControls,
	useBlockProps
} = wp.blockEditor;

const { Fragment } = wp.element;

export default function EmbedPress(props) {
	const { clientId, attributes, className, setAttributes } = props;

	console.log(props);
	const { url, editingURL, fetching, cannotEmbed, interactive, embedHTML, height, width, pagesize, columns, gapBetweenVideos } = attributes;
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
				return await fetch(`${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress?url=${url}&width=${width}&height=${height}${_pagesize}`).then(response => response.json());
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
								<TextControl
									label={__("Video Per Page")}
									value={pagesize}
									onChange={(pagesize) => setAttributes({ pagesize })}
								/>
								<p>Specify the number of videos you wish to show on each page.</p>

								<SelectControl
									label={__("Colums")}
									value={columns}
									options={[
										{ label: 'Auto', value: 'auto' },
										{ label: '2', value: '2' },
										{ label: '3', value: '3' },
										{ label: '4', value: '4' },
										{ label: '6', value: '6' },
									]}
									onChange={(columns) => setAttributes({columns})}
									__nextHasNoMarginBottom
								/>

								<RangeControl
									label={__('Gap Between Videos')}
									value={gapBetweenVideos}
									onChange={(gap) => setAttributes({ gapBetweenVideos: gap })}
									min={1}
									max={50}
								/>
								<p>Specify the gap between youtube videos.</p>
							</div>
						)

					}

					{(embedHTML && !editingURL) && <button className='button' onClick={embed}>{__('Apply Change')}</button>}
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
					` #block-${clientId} .ep-youtube__content__block .youtube__content__body .content__wrap{
						gap: ${gapBetweenVideos}px!important;
					} `
				}
			</style>

		</Fragment>

	);

}


