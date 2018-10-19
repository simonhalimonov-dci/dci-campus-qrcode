import React, { Component } from 'react'
import './App.css'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import QrReader from 'react-qr-reader'
import QRCode from 'qrcode.react'
import styled from 'styled-components'
import List from './List'


const Container = styled.div`
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)!important;
    width: 400px;
    text-align: center;
    /* border: 1px solid black; */
    border-radius: 10px;
    background: #00c6ff;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to bottom, #0072ff, #00c6ff);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to bottom, #0072ff, #00c6ff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: #fff;
`

const Navbar = styled.div`
  display: flex;
  justify-content: center;
`
const Li = styled.li`
  margin: 20px;
  list-style: none;
  color: #fff;

  a {
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
  }
`
const Navigation = styled.div`
  
`

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content:center; */
  align-items: center;
  margin: 10px;
`
const Input = styled.input`
  margin: 10px;
  width : 50%;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 25px;
  color: #fff;
  padding: 10px;
`

const Hr = styled.hr`
  margin: 25px;
`
const Borderdiv = styled.div`
  border-radius: 25px;
`

const App = () => (
  <Container>

    <Router>
      <Navigation>

        <Navbar>
          <Li>
            <Link to="/">Home</Link>
          </Li>
          <Li>
            <Link to="/list">List</Link>
          </Li>
          <Li>
            <Link to="/generate-qrcode">Generate</Link>
          </Li>
          <Li>
            <Link to="/scan-qrcode">Scan</Link>
          </Li>
        </Navbar>

        <Hr />

        <Route exact path="/" component={Home} />
        <Route
          path="/generate-qrcode"
          component={GenerateQRCode}
        />
        <Route
          path="/list"
          component={List}
        />
        <Route path="/scan-qrcode" component={ScanQRCode} />
      </Navigation>
    </Router>
  </Container>
)

const Home = () => (
  <div>
    <h1>We are awesome!</h1>
    <Navbar>
      <Li>
        <Link to="/">Home</Link>
      </Li>
      <Li>
        <Link to="/generate-qrcode">Generate</Link>
      </Li>
      <Li>
        <Link to="/scan-qrcode">Scan</Link>
      </Li>
    </Navbar>
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
          <Inputs>
            <Input
              onChange={this.handleChange('student_name')}
              type="text"
            />
            <Input
              onChange={this.handleChange('student_id')}
              type="text"
            />
            <Input
              onChange={this.handleChange('student_class')}
              type="text"
            />
          </Inputs>
          <QRCode
            value={`{"student_name": "${
              this.state.student_name
              }", "student_id":"${
              this.state.student_id
            }", "student_class":"${
              this.state.student_class
            }"}`}
            size={400}
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
      console.log(this.state);

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
        <Borderdiv>
          <QrReader
            delay={this.state.delay}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: 400 }}
          />
        </Borderdiv>
        <Hr />
        {this.state.student && <div>
          <h1>{this.state.student.student_name}</h1>
          <h2>{this.state.student.student_class}</h2>

        </div>}

        <p>{this.state.result}</p>
      </div>
    )
  }
}

export default App
