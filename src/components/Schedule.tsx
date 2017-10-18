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
    return (
      <div className="Schedule">
        {/* {uiStore.isLoadingSchedule && <div className="schedule-loader loader"></div>} */}
        <div className="Schedule-row Schedule-year-labels">
          <div className="Schedule-year-label">First-Year</div>
          <div className="Schedule-year-label">Sophomore</div>
          <div className="Schedule-year-label">Junior</div>
          <div className="Schedule-year-label">Senior</div>
        </div>
        <div className="Schedule-row">
          <Semester index={Semesters.Fall1} />
          <Semester index={Semesters.Fall2} />
          <Semester index={Semesters.Fall3} />
          <Semester index={Semesters.Fall4} />
          {uiStore.fall5Active &&
          <Semester index={Semesters.Fall5} />}
        </div>
        <div className="Schedule-row">
          <Semester index={Semesters.Spring1} />
          <Semester index={Semesters.Spring2} />
          <Semester index={Semesters.Spring3} />
          <Semester index={Semesters.Spring4} />
          {uiStore.spring5Active &&
          <Semester index={Semesters.Spring5} />}
        </div>
        {uiStore.summersActive &&
        <div className="Schedule-row">
          <Summer index={Semesters.Summer1} opacity={uiStore.firstYearSummerActive ? 1 : 0} />
          <Summer index={Semesters.Summer2} opacity={uiStore.sophomoreSummerActive ? 1 : 0}/>
          <Summer index={Semesters.Summer3} opacity={uiStore.juniorSummerActive ? 1 : 0}/>
          <Summer index={Semesters.Summer4} opacity={uiStore.seniorSummerActive ? 1 : 0}/>
        </div>
        }
      </div>
    )
  }
}