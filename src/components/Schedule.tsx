import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Semester from './Semester';
import Summer from './Summer'
import { Semesters } from '../utils';
import { CourseData } from './Course';
import { scheduleStore } from '../ScheduleStore';
import { uiStore } from '../UIStore';
import Icon from 'material-ui/Icon'
import { CircularProgress } from 'material-ui/Progress'
import Spinner from './Spinner'
import '../styles/Schedule.css';

interface ScheduleState {
  semesters: CourseData[][]
}

@observer
export default class Schedule extends React.Component {
  render() {
    const type = uiStore.isMobileView ? 'mobile' : 'normal'
    return (
      <div className="Schedule">
        {/* {uiStore.isLoadingSchedule && <div className="schedule-loader loader"></div>} */}
        {uiStore.isMobileView && <span className="tap-prompt">Tap a semester to rearrange courses</span>}
        <div className="Schedule-row Schedule-year-labels">
          <div className="Schedule-year-label">First-Year</div>
          <div className="Schedule-year-label">Sophomore</div>
          <div className="Schedule-year-label">Junior</div>
          <div className="Schedule-year-label">Senior</div>
        </div>
        <div className="Schedule-row">
          <Semester type={type} index={Semesters.Fall1} />
          <Semester type={type} index={Semesters.Fall2} />
          <Semester type={type} index={Semesters.Fall3} />
          <Semester type={type} index={Semesters.Fall4} />
          {uiStore.fall5Active &&
          <Semester type={type} index={Semesters.Fall5} />}
        </div>
        <div className="Schedule-row">
          <Semester type={type} index={Semesters.Spring1} />
          <Semester type={type} index={Semesters.Spring2} />
          <Semester type={type} index={Semesters.Spring3} />
          <Semester type={type} index={Semesters.Spring4} />
          {uiStore.spring5Active &&
          <Semester type={type} index={Semesters.Spring5} />}
        </div>
        {uiStore.isAnySummerActive &&
        <div className="Schedule-row">
          <Summer type={type} index={Semesters.Summer1} opacity={uiStore.firstYearSummerActive ? 1 : 0} />
          <Summer type={type} index={Semesters.Summer2} opacity={uiStore.sophomoreSummerActive ? 1 : 0}/>
          <Summer type={type} index={Semesters.Summer3} opacity={uiStore.juniorSummerActive ? 1 : 0}/>
          <Summer type={type} index={Semesters.Summer4} opacity={uiStore.seniorSummerActive ? 1 : 0}/>
        </div>
        }
      </div>
    )
  }
}