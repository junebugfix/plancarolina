import * as React from 'react';
import ProgressBar from './ProgressBar'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { difference } from 'lodash'
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
        <div className="progress-group geneds">
          <label>Gen Eds</label>
          <div className="progress-bar"><div className="progress-completed" style={genedStyle}></div></div>
          {scheduleStore.genedsFulfilled.length} out of {scheduleStore.GENEDS_NEEDED.length}
          <div className="progress-popup">
            <span>Fulfilled:</span>
            <div>{scheduleStore.genedsFulfilled.map(ge => <span className="progress-gened-block" key={`ge-${this.counter++}`}>{ge}</span>)}</div>
            <span>Remaining:</span>
            <div>{scheduleStore.genedsRemaining.map(ge => <span className="progress-gened-block" key={`ge-${this.counter++}`}>{ge}</span>)}</div>
          </div>
        </div>
        <div className="progress-group major-courses">
          <label>Major Courses</label>
          <div className="progress-bar"><div className="progress-completed" style={majorCoursesStyle}></div></div>
          {scheduleStore.majorCoursesFulfilled.length} out of {scheduleStore.majorCoursesNeeded.length}
          <div className="progress-popup">
            <div>
              <span>Fulfilled:</span><br/>
              {scheduleStore.majorCoursesFulfilled.map(c => <span className="progress-gened-block" key={`mc-${this.counter++}`}>{c}</span>)}<br/>
              <span>Remaining:</span><br/>
              {scheduleStore.majorCoursesRemaining.map(c => <span className="progress-gened-block" key={`mc-${this.counter++}`}>{c}</span>)}
            </div>
          </div>
        </div>
        <div className="progress-group credits">
          <label>Credits</label>
          <div className="progress-bar"><div className="progress-completed" style={creditsStyle}></div></div>
            <div>{scheduleStore.creditsFulfilled} out of {scheduleStore.CREDITS_NEEDED}</div> 
        </div>
      </div>
    )
  }
}