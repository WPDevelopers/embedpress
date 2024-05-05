/**
 * Internal dependencies
 */

import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from "../common/embed-placeholder";
import { CalendarIcon } from "../common/icons";
import EmbedControls from "../common/embed-controls";
import { sanitizeUrl, isInstagramFeed, isInstagramHashtag } from '../common/helper';
const { TextControl, PanelBody, ToggleControl } = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;
const { Fragment } = wp.element;
/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;



export default function EmbedPressCalendarEdit({ attributes, className, setAttributes }) {
	const { url, editingURL, fetching, cannotEmbed, embedHTML, height, width, powered_by, is_public, align } = attributes;
	const blockProps = useBlockProps ? useBlockProps({
		className: 'align' + align,
		style: { width: width + 'px', height: height + 'px' },
	}) : [];
	const heightpx = height + 'px';
	const widthpx = width + 'px';
	function switchBackToURLInput() {
		setAttributes({ editingURL: true, is_public: true });
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

			setTimeout(() => {
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

	function isGoogleCalendar(url) {
		const regex = /^https:\/\/calendar\.google\.com\/calendar\/embed\?.*$/;
		return regex.test(url);
	}

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__("Customize Embedded Calendar", 'embedpress')}>
					<p>{__("You can adjust the width and height of embedded content.", 'embedpress')}</p>
					<TextControl
						label={__("Width", 'embedpress')}
						value={width}
						onChange={(width) => setAttributes({ width })}
					/>

					{
						(!isInstagramFeed(url) && !isInstagramHashtag(url)) && (
							<TextControl
								label={__("Height", 'embedpress')}
								value={height}
								onChange={(height) => setAttributes({ height })}
							/>
						)
					}


				</PanelBody>
				<PanelBody title={__("Calendar Type and other options", 'embedpress')}>
					<p>{__("You can show public calendar without any API key", 'embedpress')}</p>
					<ToggleControl
						label={__('Powered By', 'embedpress')}
						onChange={(powered_by) =>
							setAttributes({ powered_by })
						}
						checked={powered_by}
					/>
					<ToggleControl
						label={__('Embedding Public Calendar', 'embedpress')}
						onChange={(is_public) =>
							setAttributes({ is_public })
						}
						checked={is_public}
					/>
				</PanelBody>
			</InspectorControls>
			{((!embedHTML || editingURL) && !fetching && is_public) && <div {...blockProps}>
				<EmbedPlaceholder
					label={__('Public Calendar Link')}
					onSubmit={embed}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => setAttributes({ url: event.target.value })}
					icon={CalendarIcon}
					DocTitle={__('Learn more about EmbedPress Calendar')}
					docLink={'https://embedpress.com/docs/'}

				/>
			</div>}

			{fetching ? <div className={className}><EmbedLoading /> </div> : null}

			{(embedHTML && is_public && !editingURL && !fetching) && <figure {...blockProps} >
				{is_public && isGoogleCalendar(url) && <iframe style={{ display: fetching ? 'none' : '' }} src={sanitizeUrl(url)} width={width} height={height} />
				}
				{powered_by && isGoogleCalendar(url) && (
					<p className="embedpress-el-powered">Powered By EmbedPress</p>
				)}

				{!isGoogleCalendar(url) && (
					<p className="embedpress-el-powered">Invalid Calendar Link</p>
				)}

				<div
					className="block-library-embed__interactive-overlay"
					onMouseUp={setAttributes({ interactive: true })}
				/>

				<EmbedControls
					showEditButton={embedHTML && !cannotEmbed}
					switchBackToURLInput={switchBackToURLInput}
				/>

			</figure>}

			{(!is_public) && <figure className={'testing'} {...blockProps} >
				<p >Private Calendar will show in the frontend only.<br /><strong>Note: Private calendar needs EmbedPress Pro.</strong></p>

				{powered_by && (
					<p className="embedpress-el-powered">Powered By EmbedPress</p>
				)}
				<div
					className="block-library-embed__interactive-overlay"
					onMouseUp={setAttributes({ interactive: true })}
				/>

				<EmbedControls
					showEditButton={embedHTML && !cannotEmbed}
					switchBackToURLInput={switchBackToURLInput}
				/>

			</figure>}
		</Fragment>

	);

}
