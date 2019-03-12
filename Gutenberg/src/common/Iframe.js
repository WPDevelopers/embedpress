/*
INIT: ensure Babel/Eslint/Flow is configured for ES Class Fields & Static Properties
JSX USAGE: <Iframe src='http://web.site' onLoad={myOnloadFunction}/>
*/
import ReactDOM from 'react-dom'
const { Component } = wp.element;

class Iframe extends Component {

  componentDidMount () {
    let iframe = ReactDOM.findDOMNode(this.refs.iframe)
    iframe.addEventListener('load', this.props.onLoad);
  }

  render () {

    return (
      <iframe
        ref="iframe"
        {...this.props}
        
      />
    )
  }

}

export default Iframe
