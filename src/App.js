import React, { Component } from 'react'
import './App.css'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import QrReader from 'react-qr-reader'
import QRCode from 'qrcode.react'

import List from './List'

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/list">List</Link>
        </li>
        <li>
          <Link to="/generate-qrcode">Generate</Link>
        </li>
        <li>
          <Link to="/scan-qrcode">Scan</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route
        path="/generate-qrcode"
        component={GenerateQRCode}
      />
      <Route path="/scan-qrcode" component={ScanQRCode} />
      <Route path="/list" component={List} />
    </div>
  </Router>
)

const Home = () => (
  <div>
    <h1>We are awesome!</h1>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/generate-qrcode">Generate</Link>
      </li>
      <li>
        <Link to="/scan-qrcode">Scan</Link>
      </li>
    </ul>
  </div>
)

class GenerateQRCode extends Component {
  state = { qrcode: '' }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })

    console.log(
      `{"student_name": "${
        this.state.student_name
      }", "student_id":"${
        this.state.student_id
      }", "student_class":"${this.state.student_class}"}`
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input
            onChange={this.handleChange('student_name')}
            type="text"
          />
          <input
            onChange={this.handleChange('student_id')}
            type="text"
          />
          <input
            onChange={this.handleChange('student_class')}
            type="text"
          />
          <QRCode
            value={`{"student_name": "${
              this.state.student_name
            }", "student_id":"${
              this.state.student_id
            }", "student_class":"${
              this.state.student_class
            }"}`}
            size={512}
            bgColor={'#ffffff'}
            fgColor={'#000000'}
            level={'L'}
            style={{ padding: 50 }}
          />
        </header>
      </div>
    )
  }
}

class ScanQRCode extends Component {
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
        result: data,
        student: this.turnQRCodeIntoJSON(data)
      })
      console.log(this.state)
    }
  }

  turnQRCodeIntoJSON = data => {
    try {
      return JSON.parse(data)
    } catch (error) {
      console.log(error)
    }
  }

  handleError(err) {
    console.error(err)
  }

  sendDataToServer = (event) => {
    if (event) {event.preventDefault()} // Prevent the page from reloading
    console.log(this.state);

    fetch("http://localhost:3030/add-attendance", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(this.state.student), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  }

  studentArrived = () => {
    this.setState({student: {...this.state.student, arrived: Date.now()}})
    console.log(this.state);
    this.sendDataToServer()
  }

  studentLeft = () => {
    this.setState({student: {...this.state.student, left: Date.now()}})
    console.log(this.state);
    this.sendDataToServer()

  }

  addCommentToState = () => {
    this.setState({student: {...this.state.student, comment: this.refs.comment.value}})
    console.log(this.state);
    
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
        <hr />
        {this.state.student && (
          <div>
            <h1>{this.state.student.student_name}</h1>
            <h2>{this.state.student.student_class}</h2>

            <form onSubmit={this.sendDataToServer} action="">
              <div>
                <button onClick={this.studentArrived} className="btn">Arrived</button>
                <button onClick={this.studentLeft} className="btn">Left</button>
              </div>

              <textarea onChange={this.addCommentToState} ref="comment" name="" id="" cols="30" rows="10" />
            </form>
          </div>
        )}

        <hr />

        <p>{this.state.result}</p>
      </div>
    )
  }
}

export default App
