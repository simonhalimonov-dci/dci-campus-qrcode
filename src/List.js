import React, { Component } from "react";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faCircle);

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class List extends Component {
  state = {
    attendance: [],
    classId: "FBW2",
  };

  componentDidMount() {
    fetch("http://localhost:3030/attendance")
      .then(res => res.json())
      .then(json => {
        this.setState({ attendance: json });
      });
  }

  render() {
    return (
      <div>
        <header className="attendance-header">
          <h1>{new Date(Date.now()).toLocaleDateString()}</h1>
          <h1>
            <Select
              value={this.state.classId}
              onChange={event => {
                this.setState({ classId: event.target.value });
              }}
            >
              <MenuItem value="FBW2">FBW2</MenuItem>
              <MenuItem value="FBW3">FBW3</MenuItem>
              <MenuItem value="FBW6">FBW6</MenuItem>
            </Select>
          </h1>
        </header>

        <ul className="attendance-list">
          {this.state.attendance &&
            this.state.attendance
              .filter(item => item.student_name)
              .filter(item => item.student_class === this.state.classId)
              .map(item => {
                return (
                  <li className="attendance-item" key={item._id}>
                    <div className="attended">
                      <FontAwesomeIcon
                        icon="circle"
                        color={/*item.date_arrived*/ true ? "green" : "#CCC"}
                      />
                    </div>
                    <p className="name">{item.student_name}</p>
                    <p className="times">
                      {/* {item.date_arrived &&
                        new Date(item.date_arrived).toLocaleDateString()} */}
                      9:30 - 16:45
                      {/* {item.date_left &&
                        new Date(item.date_left).toLocaleDateString()} */}
                    </p>
                    {/* <p>{item.}</p> */}
                  </li>
                );
              })}
        </ul>
      </div>
    );
  }
}

export default List;
