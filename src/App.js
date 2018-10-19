import React, { Component } from 'react'
import './App.css'

import QrReader from 'react-qr-reader'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          
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
