/**
 * Internal dependencies
 */
import EmbedControls from '../common/embed-controls';
import EmbedLoading from '../common/embed-loading';
import EmbedPlaceholder from '../common/embed-placeholder';
import Iframe from '../common/Iframe';

/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
import {googleDocsIcon} from '../common/icons';


export default function EmbedPress({attributes, className, setAttributes}){
	const {url, iframeSrc, editingURL, fetching, cannotEmbed, interactive} = attributes;
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
				return await fetch(`/wp-json/embedpress/v1/oembed/embedpress?url=${url}`).then(response => response.json());
			}
			fetchData(url).then(data => {
				if (data.data && data.data.status === 404){
					setAttributes({
						cannotEmbed: true,
						editingURL: true
					})
				}else{
					let match = data.html.match(/\<iframe.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/)
					setAttributes({
						cannotEmbed: false,
						editingURL: false,
						iframeSrc: match[1],
					})
				}
			});


		} else {
			setAttributes({
				cannotEmbed: true,
				editingURL: true
			})
		}
	}
	if (!iframeSrc || editingURL) {
		return (
			<div>
				<EmbedPlaceholder
					label={__('Embedding....')}
					onSubmit={embed}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => setAttributes({url: event.target.value})}
					icon={googleDocsIcon}
					DocTitle={__('Learn more about embedpress')}
					docLink={'https://embedpress.com/docs/'}
				/>
			</div>

		);
	} else {
		return (
			<div>
				{fetching ? <EmbedLoading/> : null}

				<Iframe src={iframeSrc} onLoad={onLoad} style={{display: fetching ? 'none' : ''}}
						frameBorder="0" width="600" height="450"/>

				{ ! interactive && (
					<div
						className="block-library-embed__interactive-overlay"
						onMouseUp={ console.log('hide overlay') }
					/>
				) }

				<EmbedControls
					showEditButton={iframeSrc && !cannotEmbed}
					switchBackToURLInput={switchBackToURLInput}
				/>
			</div>
		)
	}

}
