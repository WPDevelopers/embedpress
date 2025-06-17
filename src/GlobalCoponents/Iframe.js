/*
INIT: ensure Babel/Eslint/Flow is configured for ES Class Fields & Static Properties
JSX USAGE: <Iframe src='http://web.site' onLoad={myOnloadFunction}/>
*/
import ReactDOM from 'react-dom'
const { Component } = wp.element;

class Iframe extends Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
	}
  componentDidMount () {
    let iframe = ReactDOM.findDOMNode(this.myRef.current)
    iframe.addEventListener('load', this.props.onLoad);
  }

  render () {

    return (
      <iframe
		  ref={this.myRef}
        {...this.props}

      />
    )
  }

}

export default Iframe
