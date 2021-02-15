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
const {__} = wp.i18n;
import {embedPressIcon} from '../common/icons';
const {TextControl, PanelBody} = wp.components;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;

export default function EmbedPress({attributes, className, setAttributes}){
	const {url, editingURL, fetching, cannotEmbed, interactive, embedHTML, height, width} = attributes;

	function switchBackToURLInput() {
		setAttributes( {editingURL: true});
	}
	function onLoad() {
		setAttributes( {fetching: false});
	}

	function embed(event) {
		if (event) event.preventDefault();
		if (url) {
			// send api request to get iframe url
			let fetchData = async (url) => {
				setAttributes({
					fetching: true
				});
				return await fetch(`${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress?url=${url}&width=${width}&height=${height}`).then(response => response.json());
			}
			fetchData(url).then(data => {
				setAttributes({
					fetching: false
				});
				if ((data.data && data.data.status === 404) || !data.embed){
					setAttributes({
						cannotEmbed: true,
						editingURL: true,
					})
				}else{
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
				editingURL: true
			})
		}
	}
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={__("Customize Embedded Link")}>
						<TextControl
							label={__("Width")}
							value={ width }
							onChange={ ( width ) => setAttributes( { width } ) }
						/>
						<TextControl
							label={__("Height")}
							value={ height }
							onChange={ ( height ) => setAttributes( { height } ) }
						/>
					</PanelBody>
				</InspectorControls>

				{ (!embedHTML || editingURL) && <EmbedPlaceholder
					label={__('EmbedPress - Embed anything from 100+ sites')}
					onSubmit={embed}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => setAttributes({url: event.target.value})}
					icon={embedPressIcon}
					DocTitle={__('Learn more about EmbedPress')}
					docLink={'https://embedpress.com/docs/'}
				/> }

				{(embedHTML && !editingURL) && <div className={className}>
					{fetching ? <EmbedLoading/> : null}
					<EmbedWrap style={{display: fetching ? 'none' : ''}} dangerouslySetInnerHTML={{
						__html: embedHTML
					}}></EmbedWrap>

					<div
						className="block-library-embed__interactive-overlay"
						onMouseUp={ setAttributes({interactive: true}) }
					/>

					<EmbedControls
						showEditButton={embedHTML && !cannotEmbed}
						switchBackToURLInput={switchBackToURLInput}
					/>
				</div>}

			</Fragment>

		);

}


