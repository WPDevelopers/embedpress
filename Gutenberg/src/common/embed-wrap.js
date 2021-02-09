/*
INIT: ensure Babel/Eslint/Flow is configured for ES Class Fields & Static Properties
JSX USAGE: <Epwrap src='http://web.site' onLoad={myOnloadFunction}/>
*/
import ReactDOM from 'react-dom'
const { Component } = wp.element;

export default class EmbedWrap extends Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
	}
	componentDidMount () {
		let wrap = ReactDOM.findDOMNode(this.myRef.current)
		wrap.addEventListener('load', this.props.onLoad);
	}

	render () {

		return (
			<div
				ref={this.myRef}
				{...this.props}
			></div>
		)
	}

}
