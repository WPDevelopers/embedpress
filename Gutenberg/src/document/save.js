/**
 * Internal dependencies
 */

import Iframe from "../common/Iframe";

/**
 * WordPress dependencies
 */

const {__} = wp.i18n;
const {Component} = wp.element;
class DocumentSave extends Component {
	constructor() {
		console.log('Manzur')
		super(...arguments);
		this.state = {
			fetching:false,
			uniqId: 'embedpress-pdf',
			loadPdf: true,
		};
	}

	componentDidMount() {
		console.log('Tipu')
		const {attributes} = this.props;
		if(attributes.href && attributes.mime === 'application/pdf' && this.state.loadPdf){
			this.setState({loadPdf: false});
			PDFObject.embed(attributes.href, "#"+this.state.uniqId);
		}
	}

	render() {
		console.log('Render');
		const {attributes} = this.props;
		const {uniqId,loadPdf} = this.state;
		const {href,mime } = attributes;
		const defaultClass = "ose-document-embed-presentation"
		console.log(attributes);
		if (href) {
			const url = 'https://docs.google.com/viewer?url='+href+'&embedded=true';
			return (
				<figure className={defaultClass}>

					{  mime ==='application/pdf' && (
						<div loadPdf style={{display: loadPdf ? 'none' : ''}} id={uniqId}><span className="embedpress-pdf-loading">Loading PDF....</span></div>
					) }
					{  mime !=='application/pdf' && (
						<iframe style={{height:'600px',width:'600px'}}  src={url} mozallowfullscreen="true" webkitallowfullscreen="true"/>
					) }
				</figure>
			);
		}
	}
};
export default DocumentSave;
