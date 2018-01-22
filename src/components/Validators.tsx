import * as React from 'react';
import { observer } from 'mobx-react';
import { scheduleStore } from '../ScheduleStore';
import { uiStore } from '../UIStore';
import Spinner from './Spinner';
import difference from 'lodash-es/difference';
import Icon from 'material-ui/Icon';
import '../styles/Validators.css';
import { loginStore } from '../LoginStore';

@observer
export default class Validators extends React.Component {

  counter = 0

  render() {
    const genedStyle = {
      width: Math.min(Math.floor(scheduleStore.genedsFulfilled.length / scheduleStore.GENEDS_NEEDED.length * 100), 100) + "%"
    }
    const majorCoursesStyle = {
      width: Math.min(Math.floor(scheduleStore.majorCoursesFulfilled.length / scheduleStore.majorCoursesNeeded.length * 100), 100) + "%"
    }
    const creditsStyle = {
      width: Math.min(Math.floor(scheduleStore.creditsFulfilled / scheduleStore.CREDITS_NEEDED * 100), 100) + "%"
    }
    return (
      <div className="Validators">
        {loginStore.isLoggedIn &&
          <div className="saving-schedule-container">
            {uiStore.isSavingSchedule ? <span>saving schedule</span> : <span>schedule<br/>saved</span>}
            <div className="loader-container">{uiStore.isSavingSchedule ? <Spinner radius={10} /> : <Icon style={{ fontSize: 16, position: 'relative', top: '3px' }}>done</Icon>}</div>
          </div>
        }
        <div className="progress-group geneds">
          <label>Gen&nbsp;Eds</label>
          <div className="progress-bar"><div className="progress-completed" style={genedStyle}></div></div>
          {scheduleStore.genedsFulfilled.length}&nbsp;out&nbsp;of&nbsp;{scheduleStore.GENEDS_NEEDED.length}
          <div className="progress-popup">
            <span>Fulfilled:</span>
            <div>{scheduleStore.genedsFulfilled.map(ge => <span className="gened-block" key={`ge-${this.counter++}`}>{ge}</span>)}</div>
            <span>Remaining:</span>
            <div>{scheduleStore.genedsRemaining.map(ge => <span className="gened-block" key={`ge-${this.counter++}`}>{ge}</span>)}</div>
          </div>
        </div>
        <div className="progress-group credits">
          <label>Credits</label>
          <div className="progress-bar"><div className="progress-completed" style={creditsStyle}></div></div>
          {scheduleStore.creditsFulfilled}&nbsp;out&nbsp;of&nbsp;{scheduleStore.CREDITS_NEEDED} 
        </div>
      </div>
    )
  }
}