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

export interface ScheduleData {
  fall1: CourseData[]
  fall2: CourseData[]
  fall3: CourseData[]
  fall4: CourseData[]
  fall5: CourseData[]
  spring1: CourseData[]
  spring2: CourseData[]
  spring3: CourseData[]
  spring4: CourseData[]
  spring5: CourseData[]
  summer1: CourseData[]
  summer2: CourseData[]
  summer3: CourseData[]
  summer4: CourseData[]
}

@observer
export default class Schedule extends React.Component {
  render() {
    const type = uiStore.isMobileView ? 'mobile' : 'normal'
    return (
      <div className="Schedule">
        {/* {!scheduleStore.initialLoadDone && scheduleStore.hasHitInitialLoadSpinnerThreshold && <div className="initial-spinner-container"><Spinner radius={30} thickness={5} /></div>} */}
        <div className="Schedule-row Schedule-year-labels">
          <div className="Schedule-year-label">First-Year</div>
          <div className="Schedule-year-label">Sophomore</div>
          <div className="Schedule-year-label">Junior</div>
          <div className="Schedule-year-label">Senior</div>
        </div>
        <div className="Schedule-row">
          <Semester type={type} index={Semesters.Fall1} courses={scheduleStore.fall1} />
          <Semester type={type} index={Semesters.Fall2} courses={scheduleStore.fall2} />
          <Semester type={type} index={Semesters.Fall3} courses={scheduleStore.fall3} />
          <Semester type={type} index={Semesters.Fall4} courses={scheduleStore.fall4} />
          {uiStore.fall5Active &&
          <Semester type={type} index={Semesters.Fall5} courses={scheduleStore.fall5} />}
        </div>
        <div className="Schedule-row">
          <Semester type={type} index={Semesters.Spring1} courses={scheduleStore.spring1} />
          <Semester type={type} index={Semesters.Spring2} courses={scheduleStore.spring2} />
          <Semester type={type} index={Semesters.Spring3} courses={scheduleStore.spring3} />
          <Semester type={type} index={Semesters.Spring4} courses={scheduleStore.spring4} />
          {uiStore.spring5Active &&
          <Semester type={type} index={Semesters.Spring5} courses={scheduleStore.spring5} />}
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