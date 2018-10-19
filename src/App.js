import React, { Component } from 'react'
import './App.css'

import QrReader from 'react-qr-reader'
import QRCode from 'qrcode.react'

class App extends Component {
  state = {qrcode: ""}

  handleChange = () => {
    this.setState({qrcode: this.refs.qrcode.value})
    console.log(this.state);
    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input onChange={this.handleChange} type="text" ref="qrcode"/>
          <QRCode
          value={this.state.qrcode}
            size={256}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            style={{padding: 50}}
          />
          <QRCamera />
        </header>
      </div>
    )
  }
}

class QRCamera extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delay: 300,
      result: 'No result'
    }
    this.handleScan = this.handleScan.bind(this)
  }
  handleScan(data) {
    if (data) {
      this.setState({
        result: data
      })
    }
  }
  handleError(err) {
    console.error(err)
  }
  render() {
    return (
      <div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: 500 }}
        />
        <p>{this.state.result}</p>
      </div>
    )
  }
}

export default App
