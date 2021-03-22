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
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
const { Fragment } = wp.element;

export default function EmbedPress({attributes, className, setAttributes}){
	const {url, editingURL, fetching, cannotEmbed, interactive, embedHTML, height, width} = attributes;
	///const blockProps = useBlockProps();
	function switchBackToURLInput() {
		setAttributes( {editingURL: true});
	}
	function onLoad() {
		setAttributes( {fetching: false});
	}

	function embed(event) {
		if (event) event.preventDefault();

		if (url) {
			setAttributes({
				fetching: true
			});
			console.log("test");
			// send api request to get iframe url
			let fetchData = async (url) => {
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
				fetching: false,
				editingURL: true
			})
		}
	}
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={__("Customize Embedded Link")}>
						<p>{__("You can adjust the width and height of embedded content.")}</p>
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
						{(embedHTML && !editingURL) && <button onClick={embed}>{__('Apply')}</button>}
					</PanelBody>
				</InspectorControls>
				{ ((!embedHTML || editingURL) && !fetching) && <EmbedPlaceholder
					label={__('EmbedPress - Embed anything from 100+ sites')}
					onSubmit={embed}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => setAttributes({url: event.target.value})}
					icon={embedPressIcon}
					DocTitle={__('Learn more about EmbedPress')}
					docLink={'https://embedpress.com/docs/'}
				/> }

				{ fetching ? <div className={className}><EmbedLoading/> </div> : null}

				{(embedHTML && !editingURL && !fetching) && <figure {...useBlockProps()}>
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
				</figure>}

			</Fragment>

		);

}


