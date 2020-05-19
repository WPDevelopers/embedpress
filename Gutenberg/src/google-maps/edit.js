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
const {Component, Fragment} = wp.element;
import {googleMapsIcon} from '../common/icons'

class GoogleMapsEdit extends Component {
	constructor() {
		super(...arguments);
		this.switchBackToURLInput = this.switchBackToURLInput.bind(this);
		this.setUrl = this.setUrl.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.state = {
			editingURL: false,
			url: this.props.attributes.url,
			fetching: true,
			cannotEmbed: false,
			interactive: false
		};
	}

	static getDerivedStateFromProps(nextProps, state) {
		if (!nextProps.isSelected && state.interactive) {
			return {interactive: false};
		}

		return null;
	}

	hideOverlay() {
		this.setState({interactive: true});
	}

	onLoad() {
		this.setState({
			fetching: false
		})
	}

	decodeHTMLEntities(str) {
		if (str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');

		}
		return str;
	}


	setUrl(event) {
		if (event) {
			event.preventDefault();
		}
		const {url} = this.state;
		const {setAttributes} = this.props;
		setAttributes({url});
		if (url && url.match(/^http[s]?:\/\/(?:(?:(?:www\.|maps\.)?(?:google\.com?))|(?:goo\.gl))(?:\.[a-z]{2})?\/(?:maps\/)?(?:place\/)?(?:[a-z0-9\/%+\-_]*)?([a-z0-9\/%,+\-_=!:@\.&*\$#?\']*)/i)) {
			var iframeSrc = this.decodeHTMLEntities(url);
			/google\.com(?:.+)?(document|presentation|spreadsheets|forms|drawings)/i;
			if (url.match('~(maps/embed|output=embed)~i')) {
				//do something
			} else {
				var regEx = /@(-?[0-9\.]+,-?[0-9\.]+).+,([0-9\.]+[a-z])/i;
				var match = regEx.exec(iframeSrc);
				if (match && match.length > 1 && match[1] && match[2]) {
					iframeSrc = 'https://maps.google.com/maps?hl=en&ie=UTF8&ll=' + match[1] + '&spn=' + match[1] + '&t=m&z=' + Math.round(parseInt(match[2])) + '&output=embed';
				} else {
					this.setState({
						cannotEmbed: true,
						editingURL: true
					})
				}

			}
			this.setState({editingURL: false, cannotEmbed: false});
			setAttributes({iframeSrc: iframeSrc})
		} else {
			this.setState({
				cannotEmbed: true,
				editingURL: true
			})
		}
	}

	switchBackToURLInput() {
		this.setState({editingURL: true});
	}

	render() {
		const {url, editingURL, fetching, cannotEmbed, interactive} = this.state;
		const {iframeSrc} = this.props.attributes;

		const label = __('Google Maps URL');

		// No preview, or we can't embed the current URL, or we've clicked the edit button.
		if (!iframeSrc || editingURL) {
			return (
				<EmbedPlaceholder
					label={label}
					onSubmit={this.setUrl}
					value={url}
					cannotEmbed={cannotEmbed}
					onChange={(event) => this.setState({url: event.target.value})}
					icon={googleMapsIcon}
					DocTitle={__('Learn more about Google map embed')}
					docLink={'https://embedpress.com/docs/embed-google-maps-wordpress/'}
				/>
			);
		} else {

			return (
				<Fragment>
					{fetching ? <EmbedLoading/> : null}
					<Disabled>
						<Iframe src={iframeSrc} onFocus={ this.hideOverlay } onLoad={this.onLoad} style={{display: fetching ? 'none' : ''}}
								frameborder="0" width="600" height="450" allowfullscreen="true"
								mozallowfullscreen="true" webkitallowfullscreen="true"/>
					</Disabled>

					{ ! interactive && (
						<div
							className="block-library-embed__interactive-overlay"
							onMouseUp={ this.hideOverlay }
						/>
					) }

					<EmbedControls
						showEditButton={iframeSrc && !cannotEmbed}
						switchBackToURLInput={this.switchBackToURLInput}
					/>
				</Fragment>

			)
		}
	}
};
export default GoogleMapsEdit;
