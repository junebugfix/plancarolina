import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import '../styles/Toolbar.css'

const logo = require('../logo.png')

@observer
export default class Toolbar extends React.Component {
  render() {
    return (
      <div className="Toolbar">
        <div className="Toolbar-item">
          <img className="Toolbar-logo" src={logo} />
        </div>
        <div className="Toolbar-item" onClick={scheduleStore.addClass}><span className="Toolbar-text">Add Class</span></div>
        <div className="Toolbar-item" onClick={scheduleStore.addMajor}><span className="Toolbar-text">Add Major</span></div>
        {/* <div className="Toolbar-item" onClick={scheduleStore.login}><span className="Toolbar-text">Login</span></div> */}
      </div>
    )
  }
}
