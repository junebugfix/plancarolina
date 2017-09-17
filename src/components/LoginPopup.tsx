import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import '../styles/LoginPopup.css'

@observer
export default class AddMajorPopup extends React.Component {
  render() {
    return (
      <div className="LoginPopup">
        <input placeholder="Login" />
      </div>
    )
  }
}