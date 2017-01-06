console.log("hello world");
import React, { PropTypes } from 'react';
import QrReader from 'react-qr-reader'

class Qr extends React.Component {
  static propTypes = {
    height: PropTypes.integer,
    value: PropTypes.string,
    handleScan: PropTypes.func.isRequired,
  }

    constructor(props){
      super(props)
      this.state = {
        result: 'No result',
      }
    }

    handleError(err){
      console.error(err)
    }

    render(){
      const previewStyle = {
        height: 240,
        width: 320,
      }

      return(
        <div>
          <QrReader
            previewStyle={previewStyle}
            handleError={this.handleError}
            handleScan={this.props.handleScan.bind(this)}/>
            <p>{this.state.result}</p>
        </div>
      )
    }
  }

export default Qr;
