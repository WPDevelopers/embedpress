/**
 * Internal dependencies
 */

import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from "../common/embed-placeholder";
import {CalendarIcon} from "../common/icons";
import EmbedControls from "../common/embed-controls";
const {TextControl, PanelBody, ToggleControl} = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;
const { Fragment } = wp.element;
/**
 * WordPress dependencies
 */

const {__} = wp.i18n;



export default function EmbedPressCalendarEdit({attributes, className, setAttributes}){
	const {url, editingURL, fetching, cannotEmbed, interactive, embedHTML, height, width, powered_by, is_public} = attributes;
	const blockProps = useBlockProps ? useBlockProps() : [];
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

			setTimeout(()=>{
				setAttributes({
					fetching: false,
					cannotEmbed: false,
					editingURL: false,
					embedHTML: 'ready',
				});

			}, 500);



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
				<PanelBody title={__("Customize Embedded Calendar", 'embedpress')}>
					<p>{__("You can adjust the width and height of embedded content.", 'embedpress')}</p>
					<TextControl
						label={__("Width", 'embedpress')}
						value={ width }
						onChange={ ( width ) => setAttributes( { width } ) }
					/>
					<TextControl
						label={__("Height", 'embedpress')}
						value={ height }
						onChange={ ( height ) => setAttributes( { height } ) }
					/>
					{(embedHTML && !editingURL) && <button onClick={embed}>{__('Apply')}</button>}

				</PanelBody>
				<PanelBody title={__("Calendar Type and other option", 'embedpress')}>
					<p>{__("You can show public calendar without any API key", 'embedpress')}</p>
					<ToggleControl
						label={ __( 'Powered By', 'embedpress' ) }
						onChange={ ( powered_by ) =>
							setAttributes( { powered_by } )
						}
						checked={ powered_by }
					/>
					<ToggleControl
						label={ __( 'Embedding Public Calendar', 'embedpress' ) }
						onChange={ ( is_public ) =>
							setAttributes( { is_public } )
						}
						checked={ is_public }
					/>
				</PanelBody>
			</InspectorControls>
			{ ((!embedHTML || editingURL) && !fetching && is_public) && <div { ...blockProps }>
				<EmbedPlaceholder
					label={__('Public Calendar Link')}
					onSubmit={embed}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => setAttributes({url: event.target.value})}
					icon={CalendarIcon}
					DocTitle={__('Learn more about EmbedPress Calendar')}
					docLink={'https://embedpress.com/docs/'}

				/>
			</div>}

			{ fetching ? <div className={className}><EmbedLoading/> </div> : null}

			{(embedHTML && !editingURL && !fetching) && <figure { ...blockProps } >
				{is_public && <iframe style={{display: fetching ? 'none' : ''}} src={url} width={width} height={height}/> }
				{ powered_by && (
					<p className="embedpress-el-powered">Powered By EmbedPress</p>
				)}
				<div
					className="block-library-embed__interactive-overlay"
					onMouseUp={ setAttributes({interactive: true}) }
				/>

				<EmbedControls
					showEditButton={embedHTML && !cannotEmbed}
					switchBackToURLInput={switchBackToURLInput}
				/>

			</figure>}

			{( !is_public && !editingURL && !fetching) && <figure { ...blockProps } >
				 <p >Private Calendar will show in the frontend only. Note: private calendar needs EmbedPress Pro</p>

				{ powered_by && (
					<p className="embedpress-el-powered">Powered By EmbedPress</p>
				)}
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
