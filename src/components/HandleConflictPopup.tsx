import * as React from 'react'
import { observable } from 'mobx'
import { uiStore } from '../UIStore'
import { loginStore } from '../LoginStore'
import "../styles/AlertPopup.css"

export default class HandleConflictPopup extends React.Component {
  render() {
    return (
      <div>
        <div id="popup1" className="overlay">
          <div className="popup">
            <h2>Conflicting Schedules</h2>
            <br></br>
            <div className="content">
              You already had a schedule saved in Plan Carolina. What would you like to do with the courses you just edited?
            </div>
            <div className="buttons-container">
              <button onClick={() => loginStore.handleConflictResponse('discard')}>Discard the courses currently in the window and load your previously saved schedule</button>
              <button onClick={() => loginStore.handleConflictResponse('overwrite')}>Overwrite your previously saved schedule and replace it with the courses in the window</button>
              <button onClick={() => loginStore.handleConflictResponse('merge')}>Merge both schedules</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
