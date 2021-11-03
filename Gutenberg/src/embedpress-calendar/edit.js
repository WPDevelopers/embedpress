/**
 * Internal dependencies
 */

import EmbedLoading from '../common/embed-loading';
/**
 * WordPress dependencies
 */

const {__} = wp.i18n;
const {InspectorControls} = wp.blockEditor;
const {Component, Fragment} = wp.element;
const { RangeControl,PanelBody, ExternalLink,ToggleControl } = wp.components;


class EmbedPressPDFEdit extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			hasError: false,
			fetching:false,
			interactive: false,
			loadPdf: true,
		};
	}


	hideOverlay() {
		this.setState({interactive: true});
	}

	onLoad() {
		this.setState({
			fetching:false
		})
	}



	render() {
		const {attributes, noticeUI,setAttributes} = this.props;
		const {href,mime,id,width,height,powered_by} = attributes;
		const {hasError,interactive,fetching,loadPdf} = this.state;
		const min = 1;
		const max = 1000;
			return (
				<Fragment>
					{(fetching && mime !== 'application/pdf') ? <EmbedLoading/> : null}
					<div className={'embedpress-calendar-embed ep-calendar-'+id} style={{width:width, maxWidth:'100%'}}>


					{ !fetching && (
						<p>{__('Calendar will show in the frontend')}</p>
					) }
					{ ! interactive && (
						<div
							className="block-library-embed__interactive-overlay"
							onMouseUp={ this.hideOverlay }
						/>
					) }
					{ powered_by && (
						<p className="embedpress-el-powered">Powered By EmbedPress</p>
					)}


						</div>

					<InspectorControls key="inspector">
						<PanelBody
							title={ __( 'Embed Size', 'embedpress' ) }
						>
							<RangeControl
								label={ __(
									'Width',
									'embedpress'
								) }
								value={ width }
								onChange={ ( width ) =>
									setAttributes( { width } )
								}
								max={ max }
								min={ min }
							/>
							<RangeControl
								label={ __(
									'Height',
									'embedpress'
								) }
								value={height }
								onChange={ ( height ) =>
									setAttributes( { height } )
								}
								max={ max }
								min={ min }
							/>
							<ToggleControl
								label={ __( 'Powered By', 'embedpress' ) }
								onChange={ ( powered_by ) =>
									setAttributes( { powered_by } )
								}
								checked={ powered_by }
							/>
						</PanelBody>
					</InspectorControls>
				</Fragment>
			);
	}

}

export default EmbedPressPDFEdit;
