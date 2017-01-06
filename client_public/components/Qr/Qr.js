console.log("hello world");
import React, { PropTypes } from 'react';
import QrReader from 'react-qr-reader'

class Qr extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        result: 'No result',
      }
    }
    handleScan(data){
      this.setState({
        result: data,
      })
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
            handleScan={this.handleScan.bind(this)}/>
          <p>{this.state.result}</p>
        </div>
      )
    }
  }

export default Qr;
