import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import '../styles/Toolbar.css'

const logo = require('../logo.png')

@observer
export default class Toolbar extends React.Component {
  render() {
    return (
      <div className="Toolbar">
        <div className="Toolbar-item">
          <img className="Toolbar-logo" src={logo} />
          <h1 className="Toolbar-text">Plan Carolina</h1>
        </div>
        <div className="Toolbar-item"><span className="Toolbar-text">Add Major</span></div>
        <div className="Toolbar-item"><span className="Toolbar-text">Login</span></div>
      </div>
    )
  }
}
