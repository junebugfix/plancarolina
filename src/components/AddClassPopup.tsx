import * as React from 'react'
import { uiStore } from '../UIStore'
import "../styles/AlertPopup.css"

export default class AddClassPopup extends React.Component {

  render() {
    return (
    <div>
      <div id="popup1" className="overlay">
        <div className="popup">
          <h2>Add Class</h2>
          <a className="close" href="#" onClick={uiStore.handleCloseAddClass}>&times;</a>
          <br></br>
          <div className="content add-class">
            <h6>Class Department (ex. COMP)</h6><input></input>
            <h6>Class number (ex. 110)</h6><input></input>
            <h6>Class name (ex. Introduction to Programming)</h6><input></input>
            <h6>Credit hours (ex. 3)</h6><input></input>
            <h6>Gen eds? (ex. EE, GL, NA, HS)</h6><input></input>
            <button>Add class</button>
          </div>
        </div>
      </div>
    </div>
    )
  }
}