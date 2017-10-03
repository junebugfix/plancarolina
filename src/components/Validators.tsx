import * as React from 'react';
import ProgressBar from './ProgressBar'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { times } from 'lodash'
import '../styles/Validators.css'

@observer
export default class Validators extends React.Component {

  counter = 0

  render() {
    const genedStyle = {
      width: Math.floor(scheduleStore.genedsFulfilled.length / scheduleStore.GENEDS_NEEDED.length * 100) + "%"
    }
    const majorCoursesStyle = {
      width: Math.floor(scheduleStore.majorCoursesFulfilled.length / scheduleStore.majorCoursesNeeded.length * 100) + "%"
    }
    const creditsStyle = {
      width: Math.floor(scheduleStore.creditsFulfilled / scheduleStore.CREDITS_NEEDED * 100) + "%"
    }
    return (
      <div className="Validators">
        <label>Gen Eds</label>
        <div className="progress-bar"><div className="progress-completed" style={genedStyle}></div></div>
        <label>Major Courses</label>
        <div className="progress-bar"><div className="progress-completed" style={majorCoursesStyle}></div></div>
        <label>Credits</label>
        <div className="progress-bar"><div className="progress-completed" style={creditsStyle}></div></div>
      </div>
    )
  }
}