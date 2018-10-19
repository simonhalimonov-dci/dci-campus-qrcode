import React, { Component } from 'react'

class List extends Component {
  state= {
    attendance: []
  }

  componentWillMount() {
    fetch("http://localhost:3030/attendance")
    .then(res => res.json())
    .then(json => {
      this.setState({attendance: json})
      console.log(json);
      console.log(this.state);
      
    })
  }

  render () {
    return (
      <div>
        <h1>List</h1>

        <ul>
          {this.state.attendance && this.state.attendance.map(item => {
            return (
              <li style={{display: "flex", justifyContent: "space-between"}}>
                <h3 style={{width: 100}} >{ item.student_name} {item.student_id}</h3>
                <p>{item.student_class}</p>
                <p>{Date.now()}</p>
                <p>Not attended</p>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}


export default List