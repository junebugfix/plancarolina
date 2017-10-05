import * as React from 'react';
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import '../styles/AboutUs.css'

@observer
export default class AboutUs extends React.Component {
  render() {
    return (
      <div className="AboutUs">
        about us
      </div>
    )
  }
}